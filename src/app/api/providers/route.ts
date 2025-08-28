import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ProviderService } from '@/lib/services/providerService';

// Provider search schema
const searchSchema = z.object({
  specialty: z.string().optional(),
  location: z.string().optional(),
  availability: z.string().optional(),
  telehealthOnly: z.boolean().optional(),
  insuranceAccepted: z.string().optional(),
  maxDistance: z.number().optional(),
  sortBy: z.enum(['distance', 'rating', 'availability', 'price']).optional()
});

// Mock providers data
const providers = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Family Medicine',
    rating: 4.8,
    reviewCount: 124,
    location: 'San Francisco, CA',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    distance: '2.3 miles',
    availability: 'Available Now',
    languages: ['English', 'Spanish'],
    experience: 8,
    consultationFee: 85,
    image: '/api/placeholder/150/150',
    verified: true,
    telehealth: true,
    bio: 'Board-certified family physician with expertise in preventive care and chronic disease management.',
    education: ['MD, UCSF School of Medicine', 'Residency, UCSF Medical Center'],
    certifications: ['Board Certified in Family Medicine', 'HIPAA Certified'],
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Kaiser', 'Medicare'],
    officeHours: 'Mon-Fri 8AM-6PM, Sat 9AM-2PM',
    nextAvailable: '2024-02-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Internal Medicine',
    rating: 4.9,
    reviewCount: 89,
    location: 'Palo Alto, CA',
    coordinates: { lat: 37.4419, lng: -122.1430 },
    distance: '5.1 miles',
    availability: 'Today',
    languages: ['English', 'Mandarin'],
    experience: 12,
    consultationFee: 95,
    image: '/api/placeholder/150/150',
    verified: true,
    telehealth: true,
    bio: 'Experienced internist specializing in adult primary care and complex medical conditions.',
    education: ['MD, Stanford School of Medicine', 'Residency, Stanford Hospital'],
    certifications: ['Board Certified in Internal Medicine', 'Advanced Cardiac Life Support'],
    insuranceAccepted: ['Blue Cross', 'United Healthcare', 'Cigna'],
    officeHours: 'Mon-Fri 7AM-7PM',
    nextAvailable: '2024-02-01T14:30:00Z'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    rating: 4.7,
    reviewCount: 156,
    location: 'San Jose, CA',
    coordinates: { lat: 37.3382, lng: -121.8863 },
    distance: '8.7 miles',
    availability: 'Tomorrow',
    languages: ['English', 'Spanish'],
    experience: 6,
    consultationFee: 120,
    image: '/api/placeholder/150/150',
    verified: true,
    telehealth: true,
    bio: 'Dermatologist focused on medical dermatology and cosmetic procedures.',
    education: ['MD, UCLA School of Medicine', 'Dermatology Residency, UCLA'],
    certifications: ['Board Certified in Dermatology', 'Mohs Surgery Certified'],
    insuranceAccepted: ['Blue Cross', 'Aetna', 'United Healthcare'],
    officeHours: 'Mon-Thu 8AM-5PM, Fri 8AM-3PM',
    nextAvailable: '2024-02-02T09:00:00Z'
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Cardiology',
    rating: 4.9,
    reviewCount: 203,
    location: 'Mountain View, CA',
    coordinates: { lat: 37.3861, lng: -122.0839 },
    distance: '6.2 miles',
    availability: 'Next Week',
    languages: ['English'],
    experience: 15,
    consultationFee: 150,
    image: '/api/placeholder/150/150',
    verified: true,
    telehealth: true,
    bio: 'Interventional cardiologist with extensive experience in heart disease prevention and treatment.',
    education: ['MD, Harvard Medical School', 'Cardiology Fellowship, Mass General'],
    certifications: ['Board Certified in Cardiology', 'Interventional Cardiology Certified'],
    insuranceAccepted: ['All major insurances'],
    officeHours: 'Mon-Fri 6AM-8PM',
    nextAvailable: '2024-02-08T11:00:00Z'
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    specialty: 'Mental Health',
    rating: 4.8,
    reviewCount: 98,
    location: 'Redwood City, CA',
    coordinates: { lat: 37.4852, lng: -122.2364 },
    distance: '4.5 miles',
    availability: 'Available Now',
    languages: ['English'],
    experience: 10,
    consultationFee: 110,
    image: '/api/placeholder/150/150',
    verified: true,
    telehealth: true,
    bio: 'Licensed psychiatrist specializing in anxiety, depression, and stress management.',
    education: ['MD, UCSF School of Medicine', 'Psychiatry Residency, UCSF'],
    certifications: ['Board Certified in Psychiatry', 'Addiction Medicine Certified'],
    insuranceAccepted: ['Blue Cross', 'Kaiser', 'Cigna', 'Medicare'],
    officeHours: 'Mon-Sat 9AM-6PM',
    nextAvailable: '2024-02-01T16:00:00Z'
  }
];

// GET - Search providers
export async function GET(request: NextRequest) {
  try {
    // Seed mock providers if needed
    await ProviderService.seedMockProviders();
    
    const { searchParams } = new URL(request.url);
    
    const specialty = searchParams.get('specialty');
    const availability = searchParams.get('availability');
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
    const maxRate = searchParams.get('maxRate') ? parseFloat(searchParams.get('maxRate')!) : undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const filters = {
      specialty: specialty && specialty !== 'All Specialties' ? specialty : undefined,
      minRating,
      maxRate
    };
    
    const providers = await ProviderService.searchProviders(filters, limit);
    
    // Get unique specialties for filter options
    const specialties = [...new Set(providers.map(p => p.specialty))];
    const languages = [...new Set(providers.flatMap(p => p.languages || []))];
    
    return NextResponse.json({
      success: true,
      providers: providers.map(provider => ({
        ...provider,
        // Add mock data for compatibility with frontend
        location: 'San Francisco Bay Area, CA',
        distance: `${Math.random() * 10 + 1}`.slice(0,3) + ' miles',
        availability: provider.isVerified ? 'Available Now' : 'Next Week',
        consultationFee: provider.hourlyRate || 150,
        telehealth: true,
        verified: provider.isVerified,
        image: '/api/placeholder/150/150',
        nextAvailable: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      })),
      total: providers.length,
      filters: {
        specialties,
        availabilities: ['Available Now', 'Today', 'Tomorrow', 'Next Week'],
        languages
      }
    });
    
  } catch (error) {
    console.error('Provider search error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to search providers'
    }, { status: 500 });
  }
}

// GET specific provider details
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId } = body;
    
    const provider = await ProviderService.getProviderById(providerId);
    
    if (!provider) {
      return NextResponse.json({
        success: false,
        message: 'Provider not found'
      }, { status: 404 });
    }
    
    // Add additional details for specific provider
    const detailedProvider = {
      ...provider,
      // Add mock data for compatibility
      location: 'San Francisco Bay Area, CA',
      distance: '3.2 miles',
      availability: provider.isVerified ? 'Available Now' : 'Next Week',
      consultationFee: provider.hourlyRate || 150,
      telehealth: true,
      verified: provider.isVerified,
      image: '/api/placeholder/150/150',
      insuranceAccepted: ['Blue Cross', 'Aetna', 'Kaiser', 'Medicare'],
      officeHours: 'Mon-Fri 8AM-6PM',
      nextAvailable: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      reviews: [
        {
          id: '1',
          patientName: 'Anonymous Patient',
          rating: 5,
          comment: 'Excellent care and very thorough explanation.',
          date: '2024-01-15T00:00:00Z',
          verified: true
        },
        {
          id: '2',
          patientName: 'Anonymous Patient',
          rating: provider.rating,
          comment: 'Professional and caring. Highly recommend.',
          date: '2024-01-10T00:00:00Z',
          verified: true
        }
      ],
      availableSlots: [
        { date: '2024-02-01', times: ['10:00 AM', '2:00 PM', '4:00 PM'] },
        { date: '2024-02-02', times: ['9:00 AM', '11:00 AM', '3:00 PM'] },
        { date: '2024-02-03', times: ['10:00 AM', '1:00 PM', '5:00 PM'] }
      ]
    };
    
    return NextResponse.json({
      success: true,
      provider: detailedProvider
    });
    
  } catch (error) {
    console.error('Provider details error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch provider details'
    }, { status: 500 });
  }
}