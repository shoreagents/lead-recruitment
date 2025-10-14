import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';

// Helper function to generate clean resume slug (same as frontend)
const generateResumeSlug = (firstName: string, lastName: string, uid: string | number) => {
  // Clean and normalize names
  const cleanFirst = (firstName || 'user')
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^a-z0-9]/g, '') // Keep only alphanumeric
    .slice(0, 20); // Limit length
  
  const cleanLast = (lastName || 'profile')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20);
  
  // Get last 2 digits of UID
  const uidStr = uid.toString();
  const lastTwoDigits = uidStr.slice(-2).padStart(2, '0'); // Ensure 2 digits
  
  return `${cleanFirst}-${cleanLast}-${lastTwoDigits}`;
};

export async function POST(request: NextRequest) {
  try {
    const { dryRun = true } = await request.json();
    
    console.log('🚀 Starting resume slug migration...');
    console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE MIGRATION'}`);
    
    // Get all resumes with user data from database
    const result = await pool.query(`
      SELECT 
        sr.id,
        sr.resume_slug,
        sr.user_id,
        u.first_name,
        u.last_name,
        u.id as uid
      FROM saved_resumes sr
      LEFT JOIN users u ON sr.user_id = u.id
      WHERE sr.resume_slug IS NOT NULL
      ORDER BY sr.id
    `);
    
    const resumes = result.rows.map(row => ({
      id: row.id,
      slug: row.resume_slug,
      user_id: row.user_id,
      users: {
        id: row.uid,
        first_name: row.first_name,
        last_name: row.last_name
      }
    }));
    
    console.log(`📋 Found ${resumes.length} resumes to process`);
    
    const results = {
      total: resumes.length,
      updated: 0,
      skipped: 0,
      errors: 0,
      conflicts: [] as any[],
      updates: [] as any[]
    };
    
    // Process each resume
    for (const resume of resumes) {
      try {
        const user = resume.users;
        if (!user) {
          console.log(`⚠️  Resume ${resume.id}: No user data found`);
          results.errors++;
          continue;
        }
        
        const newSlug = generateResumeSlug(
          user.first_name,
          user.last_name,
          user.id
        );
        
        // Check if slug needs updating
        if (resume.slug === newSlug) {
          console.log(`⏭️  Resume ${resume.id}: Slug already correct (${newSlug})`);
          results.skipped++;
          continue;
        }
        
        // Check for potential conflicts
        const conflictingResume = resumes.find(r => 
          r.id !== resume.id && 
          r.users && 
          generateResumeSlug(r.users.first_name, r.users.last_name, r.users.id) === newSlug
        );
        
        if (conflictingResume) {
          console.log(`⚠️  Resume ${resume.id}: Slug conflict detected (${newSlug})`);
          results.conflicts.push({
            resume_id: resume.id,
            conflicting_resume_id: conflictingResume.id,
            slug: newSlug,
            user_name: `${user.first_name} ${user.last_name}`
          });
          results.errors++;
          continue;
        }
        
        results.updates.push({
          resume_id: resume.id,
          old_slug: resume.slug,
          new_slug: newSlug,
          user_name: `${user.first_name} ${user.last_name}`
        });
        
        console.log(`✅ Resume ${resume.id}: ${resume.slug} → ${newSlug} (${user.first_name} ${user.last_name})`);
        
        // Perform the actual update (if not dry run)
        if (!dryRun) {
          await pool.query(
            'UPDATE saved_resumes SET resume_slug = $1 WHERE id = $2',
            [newSlug, resume.id]
          );
          
          // Also update applications table if it has resume_slug
          try {
            await pool.query(
              'UPDATE applications SET resume_slug = $1 WHERE resume_id = $2',
              [newSlug, resume.id]
            );
          } catch (err) {
            console.log(`⚠️  Could not update applications table for resume ${resume.id}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
          
          console.log(`   📝 Database updated for resume ${resume.id}`);
        }
        
        results.updated++;
        
      } catch (error) {
        console.error(`❌ Error processing resume ${resume.id}:`, error);
        results.errors++;
      }
    }
    
    // Summary
    console.log('');
    console.log('📊 Migration Summary');
    console.log('===================');
    console.log(`✅ Updated: ${results.updated}`);
    console.log(`⏭️  Skipped (already correct): ${results.skipped}`);
    console.log(`❌ Errors: ${results.errors}`);
    console.log(`⚠️  Conflicts: ${results.conflicts.length}`);
    
    if (dryRun) {
      console.log('');
      console.log('🔍 This was a dry run - no changes were made');
    }
    
    return NextResponse.json({
      success: true,
      message: dryRun ? 'Dry run completed' : 'Migration completed',
      results
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Migration failed' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint for migration status/info
export async function GET() {
  return NextResponse.json({
    message: 'Resume Slug Migration API',
    usage: {
      'POST /api/migrate-resume-slugs': 'Run migration',
      'body': {
        'dryRun': 'boolean (default: true) - Set to false to apply changes'
      }
    },
    example: {
      'dry_run': 'POST with { "dryRun": true }',
      'live_migration': 'POST with { "dryRun": false }'
    }
  });
}
