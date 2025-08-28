import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Login validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    
    // TODO: Implement actual authentication
    // For now, return mock response
    
    // Mock user data
    const mockUser = {
      id: '1',
      email: validatedData.email,
      name: 'John Doe',
      role: 'patient'
    };
    
    // Mock token (in production, use proper JWT)
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    return NextResponse.json({
      success: true,
      user: mockUser,
      token: mockToken,
      message: 'Login successful'
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      }, { status: 400 });
    }
    
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Login failed. Please check your credentials.'
    }, { status: 401 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'Method not allowed'
  }, { status: 405 });
}