import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Profile validation schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', '']).optional(),
  address: z.string().optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string()
  }).optional(),
  medicalHistory: z.object({
    conditions: z.array(z.string()),
    medications: z.array(z.string()),
    allergies: z.array(z.string()),
    bloodType: z.string().optional()
  }).optional(),
  preferences: z.object({
    notifications: z.boolean(),
    language: z.string(),
    units: z.enum(['metric', 'imperial'])
  }).optional()
});

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    // Get authenticated session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        bloodType: true,
        allergies: true,
        medications: true,
        medicalHistory: true,
        emergencyContact: true,
        language: true,
        location: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User profile not found.' },
        { status: 404 }
      );
    }

    // Parse JSON fields safely
    const profile = {
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth?.toISOString().split('T')[0] || '',
      gender: user.gender || '',
      address: user.location || '',
      emergencyContact: user.emergencyContact ? JSON.parse(user.emergencyContact) : null,
      medicalHistory: {
        conditions: user.medicalHistory ? JSON.parse(user.medicalHistory) : [],
        medications: user.medications ? JSON.parse(user.medications) : [],
        allergies: user.allergies ? JSON.parse(user.allergies) : [],
        bloodType: user.bloodType || ''
      },
      preferences: {
        notifications: true,
        language: user.language || 'en',
        units: 'imperial' as const
      }
    };
    
    return NextResponse.json({
      success: true,
      profile: profile
    });
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch profile'
    }, { status: 500 });
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Get authenticated session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = profileSchema.parse(body);
    
    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        gender: validatedData.gender,
        location: validatedData.address,
        language: validatedData.preferences?.language || 'en',
        bloodType: validatedData.medicalHistory?.bloodType,
        allergies: validatedData.medicalHistory?.allergies ? JSON.stringify(validatedData.medicalHistory.allergies) : null,
        medications: validatedData.medicalHistory?.medications ? JSON.stringify(validatedData.medicalHistory.medications) : null,
        medicalHistory: validatedData.medicalHistory?.conditions ? JSON.stringify(validatedData.medicalHistory.conditions) : null,
        emergencyContact: validatedData.emergencyContact ? JSON.stringify(validatedData.emergencyContact) : null,
      }
    });
    
    return NextResponse.json({
      success: true,
      profile: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email
      },
      message: 'Profile updated successfully'
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      }, { status: 400 });
    }
    
    console.error('Profile update error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update profile'
    }, { status: 500 });
  }
}

// DELETE - Delete user profile (soft delete for healthcare data compliance)
export async function DELETE(request: NextRequest) {
  try {
    // Get authenticated session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Soft delete - update user record instead of deleting for healthcare data compliance
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        // Mark as deleted instead of actual deletion for compliance
        name: '[DELETED USER]',
        phone: null,
        location: null,
        dateOfBirth: null,
        gender: null,
        bloodType: null,
        allergies: null,
        medications: null,
        medicalHistory: null,
        emergencyContact: null
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully'
    });
    
  } catch (error) {
    console.error('Profile deletion error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete profile'
    }, { status: 500 });
  }
}