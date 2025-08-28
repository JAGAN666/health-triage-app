import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const zipCode = searchParams.get('zipCode');
    const limit = parseInt(searchParams.get('limit') || '50');

    const whereClause: any = {
      isActive: true
    };

    if (type && type !== 'all') {
      whereClause.type = type;
    }

    if (zipCode) {
      whereClause.zipCode = zipCode;
    }

    const resources = await prisma.resource.findMany({
      where: whereClause,
      orderBy: [
        { type: 'asc' },
        { name: 'asc' }
      ],
      take: limit
    });

    return NextResponse.json({ 
      resources,
      count: resources.length 
    });

  } catch (error) {
    console.error('Resources API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const resourceData = await request.json();
    
    // Validate required fields
    if (!resourceData.name || !resourceData.type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: {
        name: resourceData.name,
        type: resourceData.type,
        address: resourceData.address,
        phone: resourceData.phone,
        website: resourceData.website,
        latitude: resourceData.latitude,
        longitude: resourceData.longitude,
        hours: resourceData.hours,
        cost: resourceData.cost,
        zipCode: resourceData.zipCode,
        city: resourceData.city,
        state: resourceData.state,
        country: resourceData.country || 'US'
      }
    });

    return NextResponse.json({ 
      success: true, 
      resource 
    });

  } catch (error) {
    console.error('Resource creation API error:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}