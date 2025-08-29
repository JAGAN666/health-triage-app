exports.handler = async (event, context) => {
  const { httpMethod, headers, body } = event;
  
  // CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS request for CORS
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    // For demo purposes, check for demo auth cookies/headers
    const demoAuth = headers['x-demo-auth'] || 'false';
    const demoUser = headers['x-demo-user'] || '';
    
    if (httpMethod === 'GET') {
      // Return authentication status
      if (demoAuth === 'true' || demoUser) {
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authenticated: true,
            user: {
              email: demoUser || 'demo@healthtriage.ai',
              name: 'Demo User',
              role: 'PATIENT'
            },
            demo: true
          }),
        };
      }
      
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authenticated: false,
          demo: false
        }),
      };
    }

    if (httpMethod === 'POST') {
      // Handle demo login
      const { email, password } = JSON.parse(body);
      
      // Demo credentials
      const demoUsers = [
        { email: 'patient@demo.com', password: 'demo123', name: 'Demo Patient', role: 'PATIENT' },
        { email: 'doctor@demo.com', password: 'demo123', name: 'Dr. Demo', role: 'DOCTOR' }
      ];
      
      const user = demoUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Set-Cookie': `demo-auth=true; Path=/; HttpOnly; Max-Age=86400`,
          },
          body: JSON.stringify({
            success: true,
            user: {
              email: user.email,
              name: user.name,
              role: user.role
            },
            demo: true
          }),
        };
      }
      
      return {
        statusCode: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          error: 'Invalid credentials'
        }),
      };
    }

    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.error('Auth function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
    };
  }
};