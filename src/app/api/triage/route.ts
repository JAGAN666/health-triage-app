import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Demo triage responses for different symptom categories
const DEMO_RESPONSES = {
  headache: {
    message: "Based on your description of a headache, this appears to be a common condition that can have various causes including tension, dehydration, or stress.",
    triageResult: {
      riskLevel: "LOW" as const,
      rationale: "Headaches are commonly caused by tension, dehydration, or stress. Based on your description, this appears to be a routine concern.",
      actionPlan: [
        "Stay hydrated by drinking plenty of water",
        "Try rest in a quiet, dark room",
        "Consider over-the-counter pain relievers as directed",
        "If headaches persist or worsen, consult a healthcare provider"
      ],
      emergency: false,
      confidence: 0.85
    }
  },
  fever: {
    message: "A fever can be your body's natural response to fighting infection. Let me assess the severity based on your symptoms.",
    triageResult: {
      riskLevel: "MEDIUM" as const,
      rationale: "Fever indicates your body is fighting an infection. Monitoring temperature and accompanying symptoms is important.",
      actionPlan: [
        "Monitor your temperature regularly",
        "Stay hydrated with fluids",
        "Get plenty of rest",
        "Consider consulting a healthcare provider if fever persists over 3 days or reaches 103°F (39.4°C)"
      ],
      emergency: false,
      confidence: 0.90
    }
  },
  chest_pain: {
    message: "Chest pain is a symptom that requires careful evaluation. Given the potential seriousness, I recommend seeking medical attention promptly.",
    triageResult: {
      riskLevel: "HIGH" as const,
      rationale: "Chest pain can indicate various conditions, some potentially serious. Immediate medical evaluation is recommended to rule out cardiac or other urgent conditions.",
      actionPlan: [
        "Seek immediate medical attention at an emergency room",
        "Do not drive yourself - call 911 or have someone drive you",
        "If you experience severe chest pain with shortness of breath, call 911 immediately",
        "Bring a list of current medications and medical history"
      ],
      emergency: true,
      confidence: 0.95
    }
  },
  cold_symptoms: {
    message: "Based on your description of cold-like symptoms, this appears to be a common upper respiratory condition that typically resolves with rest and supportive care.",
    triageResult: {
      riskLevel: "LOW" as const,
      rationale: "Common cold symptoms like runny nose, sneezing, and mild congestion are typically viral and self-limiting.",
      actionPlan: [
        "Get plenty of rest and stay hydrated",
        "Use a humidifier or breathe steam from a hot shower",
        "Consider over-the-counter cold medications as directed",
        "See a healthcare provider if symptoms worsen or persist beyond 10 days"
      ],
      emergency: false,
      confidence: 0.80
    }
  },
  stomach_pain: {
    message: "Stomach pain can have various causes ranging from simple indigestion to more serious conditions. Let me help assess your situation.",
    triageResult: {
      riskLevel: "MEDIUM" as const,
      rationale: "Abdominal pain can indicate various conditions. The severity, location, and associated symptoms help determine the appropriate level of care.",
      actionPlan: [
        "Avoid solid foods temporarily and stay hydrated with clear fluids",
        "Apply a warm compress to the area if it provides comfort",
        "Monitor for worsening pain, fever, or vomiting",
        "Seek medical attention if pain is severe, persistent, or accompanied by fever"
      ],
      emergency: false,
      confidence: 0.75
    }
  },
  default: {
    message: "Thank you for describing your symptoms. Based on the information provided, I recommend monitoring your condition and considering professional medical advice.",
    triageResult: {
      riskLevel: "MEDIUM" as const,
      rationale: "Without being able to conduct a physical examination, it's important to err on the side of caution and recommend professional medical evaluation.",
      actionPlan: [
        "Monitor your symptoms and note any changes",
        "Consider scheduling an appointment with your healthcare provider",
        "Seek immediate care if symptoms worsen significantly",
        "Keep a symptom diary to share with your healthcare provider"
      ],
      emergency: false,
      confidence: 0.70
    }
  }
};

function getDemoResponse(message: string) {
  const lowerMessage = message.toLowerCase();
  
  // Check for symptom keywords and return appropriate demo response
  if (lowerMessage.includes('headache') || lowerMessage.includes('head pain') || lowerMessage.includes('migraine')) {
    return DEMO_RESPONSES.headache;
  } else if (lowerMessage.includes('fever') || lowerMessage.includes('temperature') || lowerMessage.includes('hot')) {
    return DEMO_RESPONSES.fever;
  } else if (lowerMessage.includes('chest pain') || lowerMessage.includes('chest hurt') || lowerMessage.includes('heart')) {
    return DEMO_RESPONSES.chest_pain;
  } else if (lowerMessage.includes('cold') || lowerMessage.includes('runny nose') || lowerMessage.includes('sneezing') || lowerMessage.includes('congestion')) {
    return DEMO_RESPONSES.cold_symptoms;
  } else if (lowerMessage.includes('stomach') || lowerMessage.includes('abdominal') || lowerMessage.includes('belly') || lowerMessage.includes('nausea')) {
    return DEMO_RESPONSES.stomach_pain;
  } else {
    return DEMO_RESPONSES.default;
  }
}

const getSystemPrompt = (language: string) => {
  const languageInstructions = {
    'en': 'Respond in English.',
    'es': 'Respond in Spanish (Español). Use appropriate medical terminology in Spanish.',
    'hi': 'Respond in Hindi (हिन्दी). Use appropriate medical terminology in Hindi.'
  };

  return `You are a medical triage AI assistant designed to help users assess their symptoms and understand appropriate next steps. You provide informational support only - NOT medical advice.

Language: ${languageInstructions[language] || languageInstructions['en']}

Your role:
1. Listen to symptom descriptions with empathy and professionalism
2. Ask clarifying questions when needed
3. Provide risk assessment (LOW, MEDIUM, HIGH) with clear rationale
4. Suggest appropriate action plans based on risk level
5. Escalate to emergency services for life-threatening situations

Risk Level Guidelines:
- LOW: Minor symptoms, self-care appropriate, routine doctor visit if persistent
- MEDIUM: Concerning symptoms that warrant medical attention within 24-48 hours
- HIGH: Serious symptoms requiring immediate medical attention or ER visit

Emergency Escalation:
If symptoms suggest immediate danger (chest pain with shortness of breath, severe bleeding, loss of consciousness, severe allergic reactions, thoughts of self-harm), immediately recommend calling 911 or local emergency services.

Response Format:
Provide a conversational response in the specified language, then if appropriate, end with:

TRIAGE_RESULT:
Risk: [LOW|MEDIUM|HIGH]
Rationale: [Brief explanation of why this risk level in the specified language]
Actions: [Bulleted list of recommended actions in the specified language]
Emergency: [true|false]
Confidence: [0.0-1.0 - How confident you are in this assessment based on available information]

Important Disclaimers:
- Always remind users this is not medical advice
- Encourage professional medical consultation
- Be culturally sensitive and avoid assumptions
- Never diagnose specific conditions
- Focus on symptoms and appropriate care seeking behavior
- Use culturally appropriate emergency contact information (911 in US, etc.)`;
};

interface Message {
  content: string;
  sender: 'user' | 'ai';
}

export async function POST(request: NextRequest) {
  try {
    const { message, history, language = 'en' } = await request.json();
    
    // Check if we're in demo mode or if OpenAI API is unavailable
    const isNetlify = process.env.NETLIFY === 'true';
    const isDemo = process.env.DEMO_MODE === 'true' || isNetlify;
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    
    if (!hasOpenAIKey || isDemo) {
      console.log('Using demo mode for triage response:', { isNetlify, isDemo, hasOpenAIKey });
      
      // Add a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const demoResponse = getDemoResponse(message);
      
      return NextResponse.json({
        ...demoResponse,
        demo: true // Add demo flag for frontend
      });
    }

    // Build conversation history for context
    const conversationHistory = [
      { role: 'system', content: getSystemPrompt(language) },
      ...history.slice(1).map((msg: Message) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: conversationHistory as any,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 
      "I apologize, but I'm having trouble processing your request right now. If this is an emergency, please call 911 immediately.";

    // Parse triage result if present
    let triageResult = null;
    const triageMatch = aiResponse.match(/TRIAGE_RESULT:\s*Risk:\s*(\w+)\s*Rationale:\s*([^\n]+)\s*Actions:\s*((?:\s*-\s*[^\n]+\n?)*)\s*Emergency:\s*(\w+)\s*Confidence:\s*([\d.]+)/);
    
    if (triageMatch) {
      const [, riskLevel, rationale, actionsText, emergency, confidence] = triageMatch;
      const actions = actionsText.trim().split('\n').map(action => action.replace(/^\s*-\s*/, '').trim()).filter(Boolean);
      
      triageResult = {
        riskLevel: riskLevel as 'LOW' | 'MEDIUM' | 'HIGH',
        rationale: rationale.trim(),
        actionPlan: actions,
        emergency: emergency.toLowerCase() === 'true',
        confidence: Math.min(1.0, Math.max(0.0, parseFloat(confidence) || 0.5))
      };
    }

    // Clean response (remove triage result section for display)
    const cleanResponse = aiResponse.replace(/TRIAGE_RESULT:[\s\S]*$/, '').trim();

    return NextResponse.json({ 
      message: cleanResponse,
      triageResult 
    });

  } catch (error) {
    console.error('Triage API error:', error);
    
    // Fallback to demo response on error
    const fallbackResponse = getDemoResponse("I have some symptoms I'd like to discuss");
    
    return NextResponse.json({ 
      ...fallbackResponse,
      demo: true,
      error: true,
      message: "I'm experiencing some technical difficulties, but I can still help with basic guidance. " + fallbackResponse.message
    });
  }
}