import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, teamSize, roleType, roles, description } = await request.json();

    console.log('=== SAVE PRICING INFO API CALLED ===');
    console.log('Received data:', { userId, teamSize, roleType, roles, description });

    if (!userId) {
      console.log('ERROR: No userId provided');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create a pricing quote record
    const pricingQuote = await prisma.pricingQuote.create({
      data: {
        user_id: userId,
        member_count: parseInt(teamSize) || 1,
        industry: existingUser.industry_name || 'General',
        total_monthly_cost: 0, // Will be calculated later
        currency_code: 'PHP',
        quote_number: 1,
        candidate_recommendations: JSON.stringify([]),
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Create pricing quote roles
    const rolesArray = roles ? roles.split(',').map((role: string) => role.trim()) : [];
    
    for (const role of rolesArray) {
      await prisma.pricingQuoteRole.create({
        data: {
          quote_id: pricingQuote.id,
          role_title: role,
          role_description: description || '',
          experience_level: 'Mid-level', // Default, can be updated later
          workspace_type: 'Remote',
          base_salary_php: 25000, // Default base salary
          multiplier: 1.5, // Default multiplier
          monthly_cost: 37500, // base_salary * multiplier
          workspace_cost: 0, // No workspace cost for remote
          total_cost: 37500, // monthly_cost + workspace_cost
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }

    // Update user's lead capture status
    await prisma.user.update({
      where: { user_id: userId },
      data: {
        second_lead_capture: true,
        updated_at: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Pricing information saved successfully',
      pricingQuote: {
        id: pricingQuote.id,
        memberCount: pricingQuote.member_count,
        industry: pricingQuote.industry,
        roles: rolesArray,
        description: description
      }
    });
  } catch (error) {
    console.error('Error saving pricing information:', error);
    return NextResponse.json({ 
      error: 'Failed to save pricing information',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
