import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { generateUserId } from '@/lib/userEngagementService';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Pricing Progress API endpoint reached');
    
    const body = await request.json();
    const { 
      step, 
      data, 
      user_id,
      quote_id 
    } = body;

    console.log('📊 Pricing Progress API called:', { step, user_id, data });

    if (!step || !data || !user_id) {
      console.error('❌ Missing required fields:', { step, data, user_id });
      return NextResponse.json(
        { error: 'Missing required fields: step, data, user_id' },
        { status: 400 }
      );
    }

    console.log('🔧 Creating Supabase client...');
    const supabase = createClient();
    console.log('✅ Supabase client created');

    switch (step) {
      case 1: {
        // Step 1: Save member_count to pricing_quotes (company data comes from users table)
        const { memberCount } = data;
        
        console.log('📝 Step 1: Processing member count', { memberCount });
        
        // Check if user exists (users are created automatically via page visits)
        console.log('🔍 Checking if user exists...');
        const { data: existingUser, error: userCheckError } = await supabase
          .from('users')
          .select('user_id')
          .eq('user_id', user_id)
          .single();

        if (userCheckError && userCheckError.code !== 'PGRST116') {
          console.error('❌ Error checking user:', userCheckError);
          return NextResponse.json(
            { error: 'Failed to check user existence', details: userCheckError.message },
            { status: 500 }
          );
        }

        if (!existingUser) {
          console.error('❌ User not found - should be created by page visit tracking');
          return NextResponse.json(
            { error: 'User not found - please refresh the page and try again' },
            { status: 400 }
          );
        }
        
        console.log('✅ User exists in database');

        // Always create new pricing quote (allow multiple quotes per user)
        console.log('🆕 Creating new pricing quote...');
        console.log('📊 Insert data:', { user_id, member_count: memberCount });
        
        const { data: newQuote, error: insertError } = await supabase
          .from('pricing_quotes')
          .insert({
            user_id,
            member_count: parseInt(memberCount), // Ensure it's an integer
            industry: 'TBD', // Will be filled in step 2
            total_monthly_cost: 0 // Will be calculated in step 4
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('❌ Error creating quote:', insertError);
          return NextResponse.json(
            { error: 'Failed to create pricing quote - user may not exist in users table', details: insertError.message },
            { status: 500 }
          );
        }
        console.log('✅ New quote created successfully with ID:', newQuote.id);
        
        // Return the quote ID so subsequent steps can use it
        return NextResponse.json({ 
          success: true, 
          quote_id: newQuote.id,
          message: 'Quote created successfully' 
        });

        break;
      }

      case 2: {
        // Step 2: Save industry to users table
        const { industry } = data;
        
        // Check if user exists, if not create them
        const { data: existingUser, error: userCheckError } = await supabase
          .from('users')
          .select('user_id')
          .eq('user_id', user_id)
          .single();

        if (userCheckError && userCheckError.code !== 'PGRST116') {
          console.error('❌ Error checking user:', userCheckError);
          return NextResponse.json(
            { error: 'Failed to check user existence' },
            { status: 500 }
          );
        }

        if (!existingUser) {
          // Create new user with industry
          console.log('🆕 Creating new user with industry...');
          const { error: createError } = await supabase
            .from('users')
            .insert({
              user_id: user_id,
              industry_name: industry,
              user_type: 'Anonymous',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (createError) {
            console.error('❌ Error creating user:', createError);
            return NextResponse.json(
              { error: 'Failed to create user' },
              { status: 500 }
            );
          }
        } else {
          // Update existing user
          const { error: userError } = await supabase
            .from('users')
            .update({ 
              industry_name: industry,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user_id);

          if (userError) {
            console.error('Error updating user industry:', userError);
            return NextResponse.json(
              { error: 'Failed to save industry information' },
              { status: 500 }
            );
          }
        }

        // Update the specific pricing_quotes with industry
        if (!quote_id) {
          console.error('❌ Missing quote_id for step 2');
          return NextResponse.json(
            { error: 'Missing quote_id for updating industry' },
            { status: 400 }
          );
        }
        
        const { error: quoteError } = await supabase
          .from('pricing_quotes')
          .update({ 
            industry
          })
          .eq('id', quote_id);

        if (quoteError) {
          console.error('Error updating quote industry:', quoteError);
        }

        break;
      }

      case 3: {
        // Step 3: Save contact form data to users table (only if provided)
        const { firstName, lastName, email } = data;
        
        // Only update if contact information is actually provided
        const hasContactInfo = firstName?.trim() || lastName?.trim() || email?.trim();
        
        if (!hasContactInfo) {
          console.log('⚠️ No contact information provided in step 3, skipping user update');
          return NextResponse.json({ 
            success: true, 
            message: 'Step 3 completed - no contact info to save' 
          });
        }
        
        console.log('📝 Step 3: Processing contact information', { firstName, lastName, email });
        
        // Check if user exists, if not create them
        const { data: existingUser, error: userCheckError } = await supabase
          .from('users')
          .select('user_id')
          .eq('user_id', user_id)
          .single();

        if (userCheckError && userCheckError.code !== 'PGRST116') {
          console.error('❌ Error checking user:', userCheckError);
          return NextResponse.json(
            { error: 'Failed to check user existence' },
            { status: 500 }
          );
        }

        if (!existingUser) {
          // Create new user with contact info
          console.log('🆕 Creating new user with contact info...');
          const { error: createError } = await supabase
            .from('users')
            .insert({
              user_id: user_id,
              first_name: firstName || null,
              last_name: lastName || null,
              email: email || null,
              user_type: 'Anonymous',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (createError) {
            console.error('❌ Error creating user:', createError);
            return NextResponse.json(
              { error: 'Failed to create user' },
              { status: 500 }
            );
          }
        } else {
          // Update existing user - only update fields that have values
          const updateData: any = { updated_at: new Date().toISOString() };
          
          if (firstName?.trim()) updateData.first_name = firstName;
          if (lastName?.trim()) updateData.last_name = lastName;
          if (email?.trim()) updateData.email = email;
          
          console.log('🔄 Updating user with provided contact info:', updateData);
          
          const { error: userError } = await supabase
            .from('users')
            .update(updateData)
            .eq('user_id', user_id);

          if (userError) {
            console.error('Error updating user contact info:', userError);
            return NextResponse.json(
              { error: 'Failed to save contact information' },
              { status: 500 }
            );
          }
        }

        // No additional pricing_quotes update needed for step 3
        console.log('✅ Contact information saved to users table');
        
        // Track second lead capture for anonymous users
        try {
          const { error: leadError } = await supabase
            .from('users')
            .update({ second_lead_capture: true })
            .eq('user_id', user_id);
          
          if (leadError) {
            console.error('❌ Error tracking second lead capture:', leadError);
          } else {
            console.log('✅ Second lead capture tracked');
          }
        } catch (leadError) {
          console.error('❌ Error tracking second lead capture:', leadError);
        }

        break;
      }

      case 4: {
        // Step 4: Save roles data to pricing_quote_roles table
        const { roles } = data;
        
        console.log('📝 Step 4: Processing roles data:', { roles, user_id });
        console.log('📝 Roles array length:', roles ? roles.length : 'undefined');
        
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
          console.error('❌ No roles data provided or roles is not an array');
          return NextResponse.json(
            { error: 'No roles data provided' },
            { status: 400 }
          );
        }
        
        // Use the specific quote ID
        if (!quote_id) {
          console.error('❌ Missing quote_id for step 4');
          return NextResponse.json(
            { error: 'Missing quote_id for updating roles' },
            { status: 400 }
          );
        }
        
        console.log('✅ Using quote ID:', quote_id);

        // Delete existing roles for this quote
        console.log('🗑️ Deleting existing roles for quote:', quote_id);
        const { error: deleteError } = await supabase
          .from('pricing_quote_roles')
          .delete()
          .eq('quote_id', quote_id);
        
        if (deleteError) {
          console.error('❌ Error deleting existing roles:', deleteError);
        } else {
          console.log('✅ Existing roles deleted successfully');
        }

        // Insert new roles
        console.log('📝 Preparing roles to insert...');
        const rolesToInsert = roles.map((role: any, index: number) => {
          const roleData = {
            quote_id: quote_id,
            role_title: role.title,
            role_description: role.description,
            experience_level: role.level,
            workspace_type: role.workspace || 'wfh',
            base_salary_php: role.baseSalary || 0,
            multiplier: role.multiplier || 1.0,
            monthly_cost: role.monthlyCost || 0,
            workspace_cost: role.workspaceCost || 0,
            total_cost: role.totalCost || 0
          };
          console.log(`📝 Role ${index + 1}:`, roleData);
          return roleData;
        });

        console.log('🔄 Inserting roles into database...');
        const { data: insertedRoles, error: rolesError } = await supabase
          .from('pricing_quote_roles')
          .insert(rolesToInsert)
          .select();

        if (rolesError) {
          console.error('❌ Error inserting roles:', rolesError);
          return NextResponse.json(
            { error: 'Failed to save roles information' },
            { status: 500 }
          );
        }
        
        console.log('✅ Roles inserted successfully:', insertedRoles);

        // Update pricing_quotes with total cost
        const totalCost = roles.reduce((sum: number, role: any) => sum + (role.totalCost || 0), 0);
        const { error: updateError } = await supabase
          .from('pricing_quotes')
          .update({ 
            total_monthly_cost: totalCost
          })
          .eq('id', quote_id);

        if (updateError) {
          console.error('Error updating quote with roles:', updateError);
        }

        break;
      }

      case 5: {
        // Step 5: Final step - update pricing_quotes with final data
        const { candidateRecommendations } = data;
        
        if (!quote_id) {
          console.error('❌ Missing quote_id for step 5');
          return NextResponse.json(
            { error: 'Missing quote_id for updating final quote data' },
            { status: 400 }
          );
        }
        
        const { error: quoteError } = await supabase
          .from('pricing_quotes')
          .update({ 
            candidate_recommendations: candidateRecommendations || []
          })
          .eq('id', quote_id);

        if (quoteError) {
          console.error('Error updating final quote:', quoteError);
          return NextResponse.json(
            { error: 'Failed to save final quote data' },
            { status: 500 }
          );
        }

        break;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid step number' },
          { status: 400 }
        );
    }

    console.log('🎉 Pricing progress saved successfully for step', step);
    return NextResponse.json({ 
      success: true, 
      message: `Step ${step} data saved successfully` 
    });

  } catch (error) {
    console.error('💥 Error in pricing-progress API:', error);
    console.error('💥 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
