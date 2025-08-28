import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { EmergencyContactService } from '@/lib/services/emergencyContactService';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Emergency contact validation schema
const emergencyContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email().optional(),
  address: z.string().optional(),
  isPrimary: z.boolean().default(false),
  canReceiveAlerts: z.boolean().default(true),
  availableHours: z.string().default('24/7'),
  medicalInfo: z.string().optional()
});

// Mock emergency contacts storage
let emergencyContacts = [
  {
    id: '1',
    userId: '1',
    name: 'Jane Doe',
    relationship: 'Spouse/Partner',
    phone: '+1 (555) 987-6543',
    email: 'jane.doe@email.com',
    address: '123 Main St, Anytown, ST 12345',
    isPrimary: true,
    canReceiveAlerts: true,
    availableHours: '24/7',
    medicalInfo: 'Knows all medical history and medications',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    name: 'Dr. Sarah Johnson',
    relationship: 'Doctor',
    phone: '+1 (555) 123-4567',
    email: 'dr.johnson@clinic.com',
    isPrimary: false,
    canReceiveAlerts: true,
    availableHours: '9 AM - 5 PM Mon-Fri',
    medicalInfo: 'Primary care physician',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// GET - Fetch user's emergency contacts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 });
    }

    const userId = (session.user as any).id;
    
    // Seed mock data if no contacts exist
    await EmergencyContactService.seedMockEmergencyContacts(userId);
    
    const contacts = await EmergencyContactService.getUserEmergencyContacts(userId);
    
    // Transform for frontend compatibility
    const transformedContacts = contacts.map(contact => ({
      ...contact,
      canReceiveAlerts: true,
      availableHours: contact.isPrimary ? '24/7' : '9 AM - 5 PM',
      medicalInfo: contact.isPrimary ? 'Knows all medical history' : '',
      updatedAt: contact.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      contacts: transformedContacts,
      total: contacts.length,
      primary: contacts.find(c => c.isPrimary) || null
    });
    
  } catch (error) {
    console.error('Emergency contacts fetch error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch emergency contacts'
    }, { status: 500 });
  }
}

// POST - Add new emergency contact
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = emergencyContactSchema.parse(body);
    
    const contactData = {
      userId: (session.user as any).id,
      name: validatedData.name,
      relationship: validatedData.relationship,
      phone: validatedData.phone,
      email: validatedData.email,
      address: validatedData.address,
      isPrimary: validatedData.isPrimary
    };

    const newContact = await EmergencyContactService.createEmergencyContact(contactData);
    
    return NextResponse.json({
      success: true,
      contact: {
        ...newContact,
        canReceiveAlerts: true,
        availableHours: newContact.isPrimary ? '24/7' : '9 AM - 5 PM',
        medicalInfo: newContact.isPrimary ? 'Knows all medical history' : ''
      },
      message: 'Emergency contact added successfully'
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      }, { status: 400 });
    }
    
    console.error('Emergency contact creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to add emergency contact'
    }, { status: 500 });
  }
}

// PUT - Update emergency contact
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Contact ID is required'
      }, { status: 400 });
    }
    
    // Validate update data
    const validatedData = emergencyContactSchema.partial().parse(updateData);
    
    // TODO: Get user ID from authentication token
    const userId = '1'; // Mock user ID
    
    // Find contact
    const contactIndex = emergencyContacts.findIndex(contact => 
      contact.id === id && contact.userId === userId
    );
    
    if (contactIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Emergency contact not found'
      }, { status: 404 });
    }
    
    // If setting as primary, remove primary status from other contacts
    if (validatedData.isPrimary) {
      emergencyContacts = emergencyContacts.map((contact, index) => 
        contact.userId === userId && index !== contactIndex
          ? { ...contact, isPrimary: false, updatedAt: new Date().toISOString() }
          : contact
      );
    }
    
    // Update contact
    emergencyContacts[contactIndex] = {
      ...emergencyContacts[contactIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      contact: emergencyContacts[contactIndex],
      message: 'Emergency contact updated successfully'
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      }, { status: 400 });
    }
    
    console.error('Emergency contact update error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update emergency contact'
    }, { status: 500 });
  }
}

// DELETE - Remove emergency contact
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('id');
    
    if (!contactId) {
      return NextResponse.json({
        success: false,
        message: 'Contact ID is required'
      }, { status: 400 });
    }
    
    // TODO: Get user ID from authentication token
    const userId = '1'; // Mock user ID
    
    // Find contact
    const contactIndex = emergencyContacts.findIndex(contact => 
      contact.id === contactId && contact.userId === userId
    );
    
    if (contactIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Emergency contact not found'
      }, { status: 404 });
    }
    
    // Don't allow deletion if it's the only contact
    const userContacts = emergencyContacts.filter(c => c.userId === userId);
    if (userContacts.length === 1) {
      return NextResponse.json({
        success: false,
        message: 'Cannot delete the only emergency contact. Add another contact first.'
      }, { status: 400 });
    }
    
    // Remove contact
    const deletedContact = emergencyContacts[contactIndex];
    emergencyContacts.splice(contactIndex, 1);
    
    // If deleted contact was primary, set the first remaining contact as primary
    if (deletedContact.isPrimary) {
      const remainingUserContacts = emergencyContacts.filter(c => c.userId === userId);
      if (remainingUserContacts.length > 0) {
        const firstContactIndex = emergencyContacts.findIndex(c => c.id === remainingUserContacts[0].id);
        emergencyContacts[firstContactIndex] = {
          ...emergencyContacts[firstContactIndex],
          isPrimary: true,
          updatedAt: new Date().toISOString()
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Emergency contact deleted successfully'
    });
    
  } catch (error) {
    console.error('Emergency contact deletion error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete emergency contact'
    }, { status: 500 });
  }
}

// PATCH - Set primary emergency contact
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactId } = body;
    
    if (!contactId) {
      return NextResponse.json({
        success: false,
        message: 'Contact ID is required'
      }, { status: 400 });
    }
    
    // TODO: Get user ID from authentication token
    const userId = '1'; // Mock user ID
    
    // Find contact
    const contact = emergencyContacts.find(c => c.id === contactId && c.userId === userId);
    
    if (!contact) {
      return NextResponse.json({
        success: false,
        message: 'Emergency contact not found'
      }, { status: 404 });
    }
    
    // Remove primary status from all user contacts
    emergencyContacts = emergencyContacts.map(c => 
      c.userId === userId 
        ? { ...c, isPrimary: false, updatedAt: new Date().toISOString() }
        : c
    );
    
    // Set new primary contact
    const contactIndex = emergencyContacts.findIndex(c => c.id === contactId);
    emergencyContacts[contactIndex] = {
      ...emergencyContacts[contactIndex],
      isPrimary: true,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      contact: emergencyContacts[contactIndex],
      message: 'Primary emergency contact updated successfully'
    });
    
  } catch (error) {
    console.error('Primary contact update error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update primary contact'
    }, { status: 500 });
  }
}