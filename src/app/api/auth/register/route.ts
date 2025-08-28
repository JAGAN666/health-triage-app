import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Registration validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    // TODO: Check if user already exists
    // TODO: Hash password
    // TODO: Save to database
    
    // Mock registration process
    const newUser = {
      id: Date.now().toString(),
      email: validatedData.email,
      name: validatedData.name,
      phone: validatedData.phone,
      dateOfBirth: validatedData.dateOfBirth,
      role: 'patient',
      createdAt: new Date().toISOString(),
      emailVerified: false
    };
    
    // Mock token (in production, use proper JWT)
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    return NextResponse.json({
      success: true,
      user: newUser,
      token: mockToken,
      message: 'Registration successful. Please check your email for verification.'
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      }, { status: 400 });
    }
    
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      message: 'Registration failed. Please try again.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'Method not allowed'
  }, { status: 405 });
}