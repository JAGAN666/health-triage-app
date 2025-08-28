import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { mood, notes, userId } = await request.json();

    if (!mood || mood < 1 || mood > 5) {
      return NextResponse.json(
        { error: 'Invalid mood value. Must be between 1 and 5.' },
        { status: 400 }
      );
    }

    // For now, create anonymous entries (userId optional)
    // In a real app, you'd get userId from authentication
    const moodEntry = await prisma.moodEntry.create({
      data: {
        mood,
        notes: notes || null,
        userId: userId || 'anonymous-' + Date.now(), // Temporary anonymous user
      },
    });

    return NextResponse.json({ 
      success: true, 
      entry: moodEntry 
    });

  } catch (error) {
    console.error('Mood entry API error:', error);
    return NextResponse.json(
      { error: 'Failed to save mood entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';
    const limit = parseInt(searchParams.get('limit') || '30');

    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: {
          startsWith: userId === 'anonymous' ? 'anonymous-' : userId
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return NextResponse.json({ entries: moodEntries });

  } catch (error) {
    console.error('Mood entries GET API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mood entries' },
      { status: 500 }
    );
  }
}