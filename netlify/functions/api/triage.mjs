// Simplified triage function for testing

export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    // For now, return a simple response to test the function
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Triage function is working! This is a test response.",
        triageResult: {
          riskLevel: "LOW",
          rationale: "Test response - function is operational",
          actionPlan: ["Function is working correctly"],
          emergency: false,
          confidence: 1.0
        }
      }),
    };

  } catch (error) {
    console.error('Triage API error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "I'm experiencing technical difficulties right now. If this is an emergency, please call 911 or go to your nearest emergency room immediately.",
        triageResult: null,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      }),
    };
  }
};
