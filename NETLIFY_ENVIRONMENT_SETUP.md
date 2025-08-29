# 🚀 Netlify Environment Setup for Real OpenAI API

## Required Environment Variables

To enable real-time OpenAI API functionality instead of demo responses, you need to set the following environment variable in your Netlify deployment:

### 1. OpenAI API Key
```
OPENAI_API_KEY=your_openai_api_key_here
```
**Note:** Use the actual OpenAI API key from your local `.env.local` file.

## How to Set Environment Variables in Netlify

### Method 1: Netlify Dashboard (Recommended)
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site: `health-triage-ai-jagan`
3. Click **Site Settings**
4. Go to **Environment Variables** in the sidebar
5. Click **Add a variable**
6. Set:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `[paste your OpenAI API key from .env.local]`
7. Click **Create variable**

### Method 2: Netlify CLI
```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Login to Netlify
netlify login

# Set environment variable (replace with your actual API key)
netlify env:set OPENAI_API_KEY your_openai_api_key_here
```

### Method 3: netlify.toml (NOT RECOMMENDED for API keys)
❌ **Do not put API keys in netlify.toml** - This file is committed to git and exposes your API key publicly.

## After Setting the Environment Variable

1. **Redeploy your site** to apply the environment variable:
   - Either push a new commit to trigger auto-deployment
   - Or manually trigger a deploy in Netlify dashboard

2. **Verify the setup**:
   - Check the build logs for "Using real OpenAI API for triage response"
   - Test the AI Chat Diagnosis feature
   - Test the Visual Analysis feature

## Expected Behavior

### ✅ With OpenAI API Key Set:
- AI Chat Diagnosis uses real GPT-4 responses
- Visual Analysis uses real GPT-4V image analysis
- Responses are dynamic and contextual
- Full conversation history maintained
- Advanced image understanding

### ❌ Without OpenAI API Key:
- Both features fall back to demo responses
- Static, pre-defined responses based on keywords
- Limited conversation context
- Basic image scenario matching

## Security Notes

- ✅ Environment variables in Netlify are secure and encrypted
- ✅ API keys are not exposed in client-side code
- ✅ Variables are only available to build and function processes
- ⚠️ Never commit API keys to git repositories
- ⚠️ Regularly rotate API keys for security

## Troubleshooting

### If features still show demo responses:
1. Verify the environment variable is set correctly in Netlify
2. Check that you redeployed after setting the variable
3. Look for console logs in Netlify function logs
4. Ensure the API key has sufficient OpenAI credits

### Testing locally:
Your local `.env.local` file already has the API key, so features should work with real OpenAI API in development.

---

**After completing this setup, your AI features will use real OpenAI responses instead of demo data!** 🤖✨