import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image, description } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return NextResponse.json({ 
        error: 'API configuration error',
        analysis: "Visual analysis is temporarily unavailable due to configuration issues. Please try again later or consult a healthcare professional for your concerns.",
        riskLevel: 'MEDIUM',
        urgency: 'ROUTINE',
        recommendations: [
          "Try again in a few minutes",
          "If you have health concerns, consult a healthcare professional directly",
          "Take photos to track changes over time",
          "Monitor symptoms and seek care if they worsen"
        ],
        confidence: 0
      }, { status: 503 });
    }

    console.log('Starting visual analysis with description:', description ? 'provided' : 'none');

    // Create the system prompt for visual assessment (educational, not diagnostic)
    const systemPrompt = `You are an AI visual assessment tool that helps users understand visual characteristics and provides educational guidance about when to seek professional care. This is for informational and educational purposes only.

IMPORTANT GUIDELINES:
- You provide visual observations and educational information only
- You are NOT providing medical diagnosis or medical advice
- Focus on describing what you can observe visually
- Always encourage consulting healthcare professionals for any health concerns
- Be helpful and informative while staying within educational bounds

For each image, please provide:
1. VISUAL OBSERVATIONS: Describe colors, textures, patterns, and general appearance
2. EDUCATIONAL ASSESSMENT: Rate as LOW, MEDIUM, or HIGH priority for professional consultation
3. URGENCY GUIDANCE: ROUTINE, URGENT, or EMERGENCY timeframe for seeking care
4. EDUCATIONAL RECOMMENDATIONS: 3-4 general wellness and care-seeking suggestions
5. CONFIDENCE: Your confidence in these visual observations (0-1 scale)

Visual characteristics that suggest different priority levels:

Higher priority for professional consultation:
- Significant color changes, swelling, or irregular patterns
- Signs that appear to be spreading or worsening
- Unusual growths, lesions, or changes in existing spots
- Areas that appear infected or severely irritated

Moderate priority indicators:
- Mild to moderate redness, swelling, or irritation  
- Changes in existing skin features
- Persistent or recurring visual concerns
- Minor injuries that may need professional assessment

Lower priority characteristics:
- Minor surface scratches or very mild irritation
- Common appearance variations without concerning features
- Very minor or superficial concerns

Always conclude with educational reminder: "For proper evaluation and care, consult with a healthcare professional who can provide personalized medical advice."`;

    const userPrompt = description 
      ? `Please provide educational visual observations for this image. Additional context provided by user: ${description}`
      : 'Please provide educational visual observations and general guidance for this image.';

    // Validate image format (should be base64 data URL)
    if (!image.startsWith('data:image/')) {
      console.error('Invalid image format provided');
      return NextResponse.json({ 
        error: 'Invalid image format',
        analysis: "The image format is not supported. Please upload a valid image file (JPG, PNG, GIF, WebP).",
        riskLevel: 'MEDIUM',
        urgency: 'ROUTINE',
        recommendations: [
          "Try uploading the image again",
          "Ensure you're uploading a clear photo",
          "Use JPG or PNG format for best results",
          "If issues persist, consult a healthcare professional directly"
        ],
        confidence: 0
      }, { status: 400 });
    }

    console.log('Calling OpenAI GPT-4V API...');
    const startTime = Date.now();

    // Call GPT-4V for image analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: image,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3, // Lower temperature for medical consistency
    });

    const apiCallDuration = Date.now() - startTime;
    console.log(`OpenAI API call completed in ${apiCallDuration}ms`);

    const analysisText = completion.choices[0]?.message?.content;
    
    if (!analysisText) {
      console.error('No response content from OpenAI API');
      throw new Error('Empty response from AI service');
    }

    console.log('OpenAI analysis length:', analysisText.length, 'characters');
    console.log('Analysis preview:', analysisText.substring(0, 200) + '...');

    // Check for actual refusal responses from OpenAI (more specific patterns)
    const actualRefusalIndicators = [
      'i cannot analyze this image',
      'i\'m not able to analyze',  
      'i cannot provide medical',
      'i\'m unable to examine',
      'this appears to be a medical',
      'i cannot assist with medical diagnosis',
      'i\'m not able to provide medical',
      'cannot analyze medical images',
      'unable to analyze medical'
    ];

    // More sophisticated refusal detection
    const isActualRefusal = actualRefusalIndicators.some(indicator => 
      analysisText.toLowerCase().includes(indicator)
    ) || (
      // Very short responses that are clearly refusals
      analysisText.length < 50 && analysisText.toLowerCase().includes('cannot')
    ) || (
      // OpenAI's standard refusal pattern
      analysisText.toLowerCase().includes('i can\'t') && analysisText.length < 200
    );

    // Look for educational content indicators (these are NOT refusals)
    const hasEducationalContent = [
      'visual observations',
      'educational assessment', 
      'recommendations',
      'consultation priority',
      'healthcare professional',
      'appears to show',
      'i can observe',
      'the image shows',
      'visible features',
      'consider consulting'
    ].some(indicator => 
      analysisText.toLowerCase().includes(indicator)
    );

    // Log detection results for debugging
    console.log('Refusal detection analysis:', {
      isActualRefusal,
      hasEducationalContent,
      responseLength: analysisText.length,
      willTreatAsRefusal: isActualRefusal && !hasEducationalContent
    });

    // Only treat as refusal if it's actually a refusal AND doesn't contain educational content
    if (isActualRefusal && !hasEducationalContent) {
      console.log('Detected actual refusal response from OpenAI');
      return NextResponse.json({
        analysis: "I'm unable to provide a detailed visual analysis of this specific image. This might be due to image quality, content restrictions, or other factors. However, I can offer some general guidance.",
        riskLevel: 'MEDIUM' as const,
        urgency: 'ROUTINE' as const,
        recommendations: [
          "For any health concerns, consult with a healthcare professional who can examine you directly",
          "If you notice changes in your skin or body, track them with photos over time", 
          "Consider scheduling a routine check-up if you have ongoing concerns",
          "For urgent symptoms, seek immediate medical attention"
        ],
        confidence: 0.1,
        error: true,
        refusal: true
      });
    }

    // Parse the response to extract structured data
    const parseAnalysis = (text: string) => {
      // Updated patterns to match new educational format
      const riskMatch = text.match(/(?:EDUCATIONAL ASSESSMENT|ASSESSMENT|RISK LEVEL?|RISK|PRIORITY):\s*(LOW|MEDIUM|HIGH)/i);
      const urgencyMatch = text.match(/(?:URGENCY GUIDANCE|URGENCY|TIMEFRAME):\s*(ROUTINE|URGENT|EMERGENCY)/i);
      const confidenceMatch = text.match(/(?:CONFIDENCE):\s*(\d+(?:\.\d+)?)/i);
      
      // Extract recommendations (looking for numbered lists or bullet points)
      const recommendationsMatch = text.match(/(?:EDUCATIONAL RECOMMENDATIONS?|RECOMMENDATIONS?|NEXT STEPS?):\s*((?:\d+\..*?(?=\n\d+\.|$)|\*.*?(?=\n\*|$)|\-.*?(?=\n\-|$))+)/is);
      let recommendations: string[] = [];
      
      if (recommendationsMatch) {
        recommendations = recommendationsMatch[1]
          .split(/\n/)
          .filter(line => line.trim())
          .map(line => line.replace(/^\d+\.\s*|\*\s*|\-\s*/, '').trim())
          .filter(line => line.length > 0)
          .slice(0, 4); // Limit to 4 recommendations
      }

      // Default recommendations if none found
      if (recommendations.length === 0) {
        recommendations = [
          "Monitor the area for any changes",
          "Keep the area clean and dry",
          "Consult with a healthcare professional if symptoms persist or worsen",
          "Take photos to track changes over time"
        ];
      }

      return {
        analysis: text,
        riskLevel: (riskMatch?.[1]?.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH') || 'MEDIUM',
        urgency: (urgencyMatch?.[1]?.toUpperCase() as 'ROUTINE' | 'URGENT' | 'EMERGENCY') || 'ROUTINE',
        recommendations,
        confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.7
      };
    };

    const structuredResult = parseAnalysis(analysisText);

    // Log for debugging
    console.log('Visual Analysis Result:', {
      riskLevel: structuredResult.riskLevel,
      urgency: structuredResult.urgency,
      confidence: structuredResult.confidence,
      recommendationsCount: structuredResult.recommendations.length,
      analysisLength: structuredResult.analysis.length
    });

    // Enhanced content validation
    const hasMinimumContent = structuredResult.analysis && 
                            structuredResult.analysis.length >= 20 &&
                            structuredResult.recommendations.length > 0;
    
    const hasValidStructure = structuredResult.riskLevel && 
                             structuredResult.urgency && 
                             structuredResult.confidence !== undefined;

    if (!hasMinimumContent || !hasValidStructure) {
      console.error('Analysis result validation failed:', {
        hasMinimumContent,
        hasValidStructure,
        analysisLength: structuredResult.analysis?.length || 0,
        recommendationsCount: structuredResult.recommendations.length
      });
      throw new Error('Invalid analysis result structure');
    }

    return NextResponse.json(structuredResult);

  } catch (error) {
    console.error('Visual analysis error:', error);
    
    // Provide specific error messages based on error type
    let errorMessage = "I'm experiencing technical difficulties analyzing this image right now.";
    let errorRecommendations = [
      "Try uploading the image again with better lighting",
      "Ensure the image is clear and in focus", 
      "Consult with a healthcare professional for persistent concerns",
      "Monitor symptoms and seek care if they worsen"
    ];

    // Log the error details for debugging
    console.error('Visual analysis error details:', {
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = "Visual analysis service is temporarily unavailable due to configuration issues.";
        errorRecommendations = [
          "Try again in a few minutes",
          "Contact support if the issue persists",
          "Consult with a healthcare professional directly",
          "Monitor symptoms and seek care if they worsen"
        ];
      } else if (error.message.includes('rate limit')) {
        errorMessage = "Too many analysis requests at the moment. Please wait and try again.";
        errorRecommendations = [
          "Wait a few minutes and try again",
          "Upload one image at a time",
          "If urgent, consult with a healthcare professional directly",
          "Monitor symptoms while waiting"
        ];
      } else if (error.message.includes('Invalid') || error.message.includes('image')) {
        errorMessage = "There was an issue processing your image. Please try uploading a different photo.";
        errorRecommendations = [
          "Try taking a new, clear photo",
          "Ensure good lighting and focus",
          "Use JPG or PNG format",
          "If issues persist, consult a healthcare professional"
        ];
      } else if (error.message.includes('structure') || error.message.includes('validation')) {
        errorMessage = "I received a response but couldn't process it properly. The analysis may be incomplete.";
        errorRecommendations = [
          "Try uploading the image again",
          "Consider providing more description about your symptoms",
          "If you have health concerns, consult a healthcare professional directly",
          "Try again in a few minutes"
        ];
      }
    }
    
    // Fallback response for API errors
    const fallbackResponse = {
      analysis: `${errorMessage} Please try again, or if you have health concerns, consult with a healthcare professional directly.`,
      riskLevel: 'MEDIUM' as const,
      urgency: 'ROUTINE' as const,
      recommendations: errorRecommendations,
      confidence: 0,
      error: true // Add error flag for frontend handling
    };

    return NextResponse.json(fallbackResponse, { status: 200 });
  }
}