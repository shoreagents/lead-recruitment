import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, firstName, surname, email, company, summary } = await request.json();

    console.log('=== SAVE CONTACT INFO API CALLED ===');
    console.log('Received data:', { userId, firstName, surname, email, company, summary });

    if (!userId) {
      console.log('ERROR: No userId provided');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if user already exists
    console.log('Checking if user exists with userId:', userId);
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId }
    });

    console.log('Existing user found:', existingUser);

    if (existingUser) {
      console.log('Updating existing user...');
      // Update existing user with new contact information
      const updatedUser = await prisma.user.update({
        where: { user_id: userId },
        data: {
          first_name: firstName || existingUser.first_name,
          last_name: surname || existingUser.last_name,
          email: email || existingUser.email,
          company: company || existingUser.company,
          updated_at: new Date(),
          // Mark first lead capture as completed
          first_lead_capture: true
        }
      });

      console.log('User updated successfully:', updatedUser);
      return NextResponse.json({ 
        success: true, 
        message: 'Contact information updated successfully',
        user: updatedUser
      });
    } else {
      console.log('Creating new user...');
      // Create new user with contact information
      const newUser = await prisma.user.create({
        data: {
          user_id: userId,
          first_name: firstName,
          last_name: surname,
          email: email,
          company: company,
          user_type: 'Anonymous',
          first_lead_capture: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      console.log('New user created successfully:', newUser);
      return NextResponse.json({ 
        success: true, 
        message: 'Contact information saved successfully',
        user: newUser
      });
    }
  } catch (error) {
    console.error('Error saving contact information:', error);
    return NextResponse.json({ 
      error: 'Failed to save contact information',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
