import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AppointmentService } from '@/lib/services/appointmentService';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Appointment validation schema
const appointmentSchema = z.object({
  providerId: z.string(),
  dateTime: z.string(),
  duration: z.number().optional(),
  type: z.string().optional(),
  reason: z.string().min(5, 'Please provide a reason for the appointment'),
  notes: z.string().optional()
});

// Mock appointments data
let appointments = [
  {
    id: '1',
    userId: '1',
    providerId: '1',
    providerName: 'Dr. Sarah Johnson',
    specialty: 'Family Medicine',
    date: '2024-02-15',
    time: '2:00 PM',
    type: 'video',
    status: 'upcoming',
    reason: 'Annual checkup',
    notes: '',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    providerId: '2',
    providerName: 'Dr. Michael Chen',
    specialty: 'Internal Medicine',
    date: '2024-01-20',
    time: '10:30 AM',
    type: 'video',
    status: 'completed',
    reason: 'Follow-up consultation',
    notes: 'Discussed test results',
    createdAt: '2024-01-15T00:00:00Z'
  }
];

// GET - Fetch user appointments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const statusMap: any = {
      'upcoming': 'SCHEDULED',
      'completed': 'COMPLETED',
      'cancelled': 'CANCELLED'
    };

    const appointmentStatus = status ? statusMap[status] : undefined;
    const appointments = await AppointmentService.getUserAppointments(
      (session.user as any).id,
      appointmentStatus
    );
    
    // Transform for frontend compatibility
    const transformedAppointments = appointments.map(apt => ({
      id: apt.id,
      userId: apt.userId,
      providerId: apt.providerId,
      providerName: apt.provider.name,
      specialty: apt.provider.specialty,
      date: apt.dateTime.toISOString().split('T')[0],
      time: apt.dateTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      dateTime: apt.dateTime,
      type: apt.type,
      status: apt.status.toLowerCase(),
      reason: apt.notes || 'Consultation',
      notes: apt.diagnosis || '',
      createdAt: apt.createdAt,
      meetingLink: apt.meetingLink,
      cost: apt.cost,
      duration: apt.duration
    }));
    
    return NextResponse.json({
      success: true,
      appointments: transformedAppointments,
      total: appointments.length
    });
    
  } catch (error) {
    console.error('Appointments fetch error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch appointments'
    }, { status: 500 });
  }
}

// POST - Create new appointment
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
    const validatedData = appointmentSchema.parse(body);
    
    // Create appointment
    const appointmentData = {
      userId: (session.user as any).id,
      providerId: validatedData.providerId,
      dateTime: new Date(validatedData.dateTime),
      duration: validatedData.duration || 30,
      type: validatedData.type || 'consultation',
      notes: validatedData.reason + (validatedData.notes ? ` - ${validatedData.notes}` : '')
    };

    const newAppointment = await AppointmentService.createAppointment(appointmentData);
    
    // Get full appointment details for response
    const appointmentDetails = await AppointmentService.getAppointmentById(newAppointment.id);
    
    return NextResponse.json({
      success: true,
      appointment: {
        id: appointmentDetails?.id,
        userId: appointmentDetails?.userId,
        providerId: appointmentDetails?.providerId,
        providerName: appointmentDetails?.provider.name,
        specialty: appointmentDetails?.provider.specialty,
        date: appointmentDetails?.dateTime.toISOString().split('T')[0],
        time: appointmentDetails?.dateTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        dateTime: appointmentDetails?.dateTime,
        type: appointmentDetails?.type,
        status: 'upcoming',
        reason: validatedData.reason,
        notes: validatedData.notes || '',
        meetingLink: appointmentDetails?.meetingLink,
        createdAt: appointmentDetails?.createdAt
      },
      message: 'Appointment booked successfully'
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      }, { status: 400 });
    }
    
    console.error('Appointment creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to book appointment'
    }, { status: 500 });
  }
}

// PUT - Update appointment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    // TODO: Get user ID from authentication token
    const userId = '1'; // Mock user ID
    
    // Find appointment
    const appointmentIndex = appointments.findIndex(apt => 
      apt.id === id && apt.userId === userId
    );
    
    if (appointmentIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Appointment not found'
      }, { status: 404 });
    }
    
    // Update appointment
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      appointment: appointments[appointmentIndex],
      message: 'Appointment updated successfully'
    });
    
  } catch (error) {
    console.error('Appointment update error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update appointment'
    }, { status: 500 });
  }
}

// DELETE - Cancel appointment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('id');
    
    if (!appointmentId) {
      return NextResponse.json({
        success: false,
        message: 'Appointment ID is required'
      }, { status: 400 });
    }
    
    // TODO: Get user ID from authentication token
    const userId = '1'; // Mock user ID
    
    // Find and update appointment status to cancelled
    const appointmentIndex = appointments.findIndex(apt => 
      apt.id === appointmentId && apt.userId === userId
    );
    
    if (appointmentIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Appointment not found'
      }, { status: 404 });
    }
    
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    };
    
    // TODO: Notify provider
    // TODO: Send cancellation confirmation
    
    return NextResponse.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
    
  } catch (error) {
    console.error('Appointment cancellation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to cancel appointment'
    }, { status: 500 });
  }
}