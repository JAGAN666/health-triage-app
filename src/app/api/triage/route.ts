import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        message: "I apologize, but the AI service is currently unavailable. If this is an emergency, please call 911 immediately.",
        triageResult: null 
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
    
    return NextResponse.json({ 
      message: "I'm experiencing technical difficulties right now. If this is an emergency, please call 911 or go to your nearest emergency room immediately.",
      triageResult: null 
    });
  }
}