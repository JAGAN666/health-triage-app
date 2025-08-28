import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Convert the audio file to a format suitable for OpenAI Whisper
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    
    // Create a File object for OpenAI API
    const file = new File([buffer], 'audio.webm', { type: audioFile.type });

    console.log('🎤 Processing voice transcription with OpenAI Whisper...');
    console.log(`📊 Audio file size: ${(buffer.length / 1024).toFixed(2)} KB`);
    console.log(`🎵 Audio type: ${audioFile.type}`);

    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en', // Can be made dynamic based on user preferences
      prompt: 'The following is a health symptom description from a patient seeking medical guidance. Please transcribe accurately, including medical terms.', // Context helps with medical terminology
      temperature: 0.1, // Lower temperature for more consistent transcriptions
    });

    const transcription = response.text.trim();
    
    console.log('✅ Whisper transcription successful');
    console.log(`📝 Transcribed text length: ${transcription.length} characters`);

    // Enhanced transcription with medical context awareness
    if (transcription.length === 0) {
      return NextResponse.json(
        { error: 'No speech detected in audio' },
        { status: 400 }
      );
    }

    // Optional: Clean up common transcription issues for medical context
    const cleanedTranscription = transcription
      .replace(/\b(\w+)\s+\1\b/gi, '$1') // Remove duplicated words
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    return NextResponse.json({
      transcription: cleanedTranscription,
      confidence: response.text.length > 10 ? 'HIGH' : 'MEDIUM', // Simple confidence estimation
      duration: Math.ceil(buffer.length / 16000), // Rough duration estimate
      language: 'en'
    });

  } catch (error) {
    console.error('Voice transcription error:', error);
    
    if (error instanceof Error) {
      // Handle specific OpenAI errors
      if (error.message.includes('Invalid file format')) {
        return NextResponse.json(
          { error: 'Unsupported audio format. Please try again.' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('File too large')) {
        return NextResponse.json(
          { error: 'Audio file too large. Please record a shorter message.' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Service temporarily busy. Please try again in a moment.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to process voice input. Please try again.' },
      { status: 500 }
    );
  }
}

// Support for preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}