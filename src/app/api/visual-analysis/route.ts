import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Demo visual analysis responses for different image types
const DEMO_VISUAL_RESPONSES = {
  skin_condition: {
    analysis: "VISUAL OBSERVATIONS: The image shows a localized area with mild redness and slight texture variation on the skin surface. The affected area appears to be well-defined with regular borders.\n\nEDUCATIONAL ASSESSMENT: Based on the visual characteristics observed, this appears to be a MEDIUM priority for professional consultation. The mild redness and localized nature suggest it could be a common skin condition such as minor irritation or a benign skin variation.\n\nURGENCY GUIDANCE: ROUTINE timeframe for seeking care would be appropriate. While not urgent, having a healthcare professional examine this would provide proper evaluation and peace of mind.\n\nEDUCATIONAL RECOMMENDATIONS:\n1. Keep the area clean and dry\n2. Avoid scratching or picking at the area\n3. Take photos to track any changes over time\n4. Schedule a routine appointment with a dermatologist or healthcare provider for proper evaluation\n\nCONFIDENCE: 0.8\n\nFor proper evaluation and care, consult with a healthcare professional who can provide personalized medical advice.",
    riskLevel: "MEDIUM" as const,
    urgency: "ROUTINE" as const,
    recommendations: [
      "Keep the area clean and dry",
      "Avoid scratching or picking at the area", 
      "Take photos to track any changes over time",
      "Schedule a routine appointment with a dermatologist or healthcare provider for proper evaluation"
    ],
    confidence: 0.8
  },
  wound_injury: {
    analysis: "VISUAL OBSERVATIONS: The image shows what appears to be a minor surface wound or abrasion with some redness around the edges. The wound appears to be superficial and the surrounding skin shows normal color patterns.\n\nEDUCATIONAL ASSESSMENT: This appears to be a LOW to MEDIUM priority for professional consultation. Minor wounds of this nature typically heal well with proper care, though professional assessment can ensure proper healing.\n\nURGENCY GUIDANCE: ROUTINE care would be appropriate unless signs of infection develop. Monitor for increased redness, warmth, swelling, or discharge.\n\nEDUCATIONAL RECOMMENDATIONS:\n1. Clean gently with mild soap and water\n2. Apply an antibiotic ointment if recommended by a healthcare provider\n3. Cover with a clean bandage to protect from bacteria\n4. Change dressing daily and keep the wound clean and dry\n\nCONFIDENCE: 0.75\n\nFor proper evaluation and care, consult with a healthcare professional who can provide personalized medical advice.",
    riskLevel: "MEDIUM" as const,
    urgency: "ROUTINE" as const,
    recommendations: [
      "Clean gently with mild soap and water",
      "Apply an antibiotic ointment if recommended by a healthcare provider",
      "Cover with a clean bandage to protect from bacteria",
      "Change dressing daily and keep the wound clean and dry"
    ],
    confidence: 0.75
  },
  rash_irritation: {
    analysis: "VISUAL OBSERVATIONS: The image displays an area with diffuse redness and what appears to be a slightly raised texture. The affected region has irregular but relatively well-defined borders.\n\nEDUCATIONAL ASSESSMENT: This visual presentation suggests a MEDIUM priority for professional consultation. Skin rashes can have various causes including allergic reactions, contact dermatitis, or other skin conditions that benefit from professional evaluation.\n\nURGENCY GUIDANCE: ROUTINE to URGENT timeframe depending on symptoms. If accompanied by itching, pain, spreading, or systemic symptoms, seeking care sooner would be advisable.\n\nEDUCATIONAL RECOMMENDATIONS:\n1. Avoid known irritants or allergens if identified\n2. Apply cool, damp cloths to reduce discomfort if needed\n3. Avoid scratching to prevent secondary infection\n4. Consider seeing a healthcare provider or dermatologist for proper diagnosis and treatment options\n\nCONFIDENCE: 0.7\n\nFor proper evaluation and care, consult with a healthcare professional who can provide personalized medical advice.",
    riskLevel: "MEDIUM" as const,
    urgency: "ROUTINE" as const,
    recommendations: [
      "Avoid known irritants or allergens if identified",
      "Apply cool, damp cloths to reduce discomfort if needed",
      "Avoid scratching to prevent secondary infection",
      "Consider seeing a healthcare provider or dermatologist for proper diagnosis and treatment options"
    ],
    confidence: 0.7
  },
  general: {
    analysis: "VISUAL OBSERVATIONS: The image shows an area of concern on the skin with some color variation and textural changes. The characteristics observed include mild discoloration and surface changes in a localized region.\n\nEDUCATIONAL ASSESSMENT: Based on visual characteristics, this would be classified as MEDIUM priority for professional consultation. Any changes in skin appearance benefit from professional medical evaluation to ensure proper care.\n\nURGENCY GUIDANCE: ROUTINE consultation timeframe would be appropriate. Scheduling an appointment with a healthcare provider when convenient would be a reasonable approach.\n\nEDUCATIONAL RECOMMENDATIONS:\n1. Monitor the area for any changes in size, color, or texture\n2. Take photos periodically to track progression\n3. Protect the area from excessive sun exposure\n4. Schedule an appointment with a healthcare provider or dermatologist for professional evaluation\n\nCONFIDENCE: 0.65\n\nFor proper evaluation and care, consult with a healthcare professional who can provide personalized medical advice.",
    riskLevel: "MEDIUM" as const,
    urgency: "ROUTINE" as const,
    recommendations: [
      "Monitor the area for any changes in size, color, or texture",
      "Take photos periodically to track progression",
      "Protect the area from excessive sun exposure",
      "Schedule an appointment with a healthcare provider or dermatologist for professional evaluation"
    ],
    confidence: 0.65
  }
};

function getDemoVisualResponse(description?: string) {
  if (!description) {
    return DEMO_VISUAL_RESPONSES.general;
  }
  
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('wound') || lowerDesc.includes('cut') || lowerDesc.includes('injury') || lowerDesc.includes('scratch')) {
    return DEMO_VISUAL_RESPONSES.wound_injury;
  } else if (lowerDesc.includes('rash') || lowerDesc.includes('itch') || lowerDesc.includes('irritation') || lowerDesc.includes('red') || lowerDesc.includes('bumps')) {
    return DEMO_VISUAL_RESPONSES.rash_irritation;
  } else if (lowerDesc.includes('skin') || lowerDesc.includes('spot') || lowerDesc.includes('mole') || lowerDesc.includes('lesion')) {
    return DEMO_VISUAL_RESPONSES.skin_condition;
  } else {
    return DEMO_VISUAL_RESPONSES.general;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { image, description } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Check if we're in demo mode or if OpenAI API is unavailable
    const isNetlify = process.env.NETLIFY === 'true';
    const isDemo = process.env.DEMO_MODE === 'true' || isNetlify;
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    
    if (!hasOpenAIKey || isDemo) {
      console.log('Using demo mode for visual analysis:', { isNetlify, isDemo, hasOpenAIKey });
      
      // Add a realistic delay to simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const demoResponse = getDemoVisualResponse(description);
      
      return NextResponse.json({
        ...demoResponse,
        demo: true // Add demo flag for frontend
      });
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
    
    // Use demo response as fallback for errors
    const demoFallback = getDemoVisualResponse(description);
    
    const fallbackResponse = {
      ...demoFallback,
      demo: true,
      error: true,
      analysis: `I'm experiencing some technical difficulties, but I can provide general guidance. ${demoFallback.analysis}`
    };

    return NextResponse.json(fallbackResponse, { status: 200 });
  }
}