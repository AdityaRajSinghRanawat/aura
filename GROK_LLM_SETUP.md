# Grok API LLM Setup Guide

## Overview
This project now uses **LangChain JS** with **Grok API** to analyze property complaints. The system parses complaint descriptions and provides:
- Summary of the issue
- Key action steps for resolution
- Problem-solution mindset approach
- Category, priority, and suggested department
- Estimated resolution cost and timeline

## Installation & Setup

### 1. Dependencies Installed
The following packages have been installed:
```bash
npm install @langchain/openai dotenv
```

**Included Packages:**
- `@langchain/openai` - LangChain integration with OpenAI-compatible APIs (Grok)
- `@langchain/core` - Core LangChain components (already in project)
- `langchain` - Main LangChain library (already in project)
- `dotenv` - Environment variable management

### 2. Environment Configuration

A `.env` file has been created in the project root. Update it with your Grok API credentials:

```env
# Grok API Configuration
VITE_GROK_API_KEY=your_grok_api_key_here

# Grok API Endpoint
VITE_GROK_API_BASE_URL=https://api.x.ai/v1

# Optional: Grok Model (default is grok-beta)
VITE_GROK_MODEL=grok-beta

# Application Settings
VITE_APP_NAME=Aura Property Management

# Optional: Enable/Disable AI Features
VITE_ENABLE_AI_ANALYSIS=true
```

### 3. Getting a Grok API Key

1. Visit **https://console.x.ai/** (or https://api.x.ai/)
2. Sign up/Log in to your xAI account
3. Create a new API key in the dashboard
4. Copy the API key and paste it in the `.env` file as `VITE_GROK_API_KEY`

## File Structure

### Modified Files:
1. **`src/lib/llm.js`** - Complete rewrite with Grok API integration
   - Uses ChatOpenAI from LangChain with Grok API endpoint
   - System prompt designed for property management complaints
   - Returns structured JSON with all analysis fields
   - Includes fallback simulation for testing without API key

2. **`src/pages/ComplaintsPage.jsx`** - Enhanced to display comprehensive analysis
   - Stores full `aiAnalysis` object with all Grok API response data
   - Displays summary, category, priority, action steps, etc.
   - Shows problem-solution approach with detailed breakdown
   - Displays estimated cost and assigned department

3. **`.env`** - New environment configuration file
   - Contains Grok API credentials and configuration
   - Uses `VITE_` prefix for Vite client-side access

### New Dependencies:
- `@langchain/openai` - v0.x.x (for OpenAI-compatible APIs)
- `dotenv` - Latest version

## Response Format

When a complaint is submitted, the Grok API returns:

```json
{
  "summary": "Brief 1-2 sentence summary",
  "problemDescription": "Detailed problem description",
  "keyActionSteps": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ],
  "problemSolutionApproach": {
    "problemAnalysis": "Root cause analysis",
    "solutionStrategy": "Overall approach",
    "expectedOutcome": "What should be achieved",
    "timeline": "Estimated resolution time"
  },
  "category": "Plumbing|Electrical|etc",
  "priority": "High|Medium|Low",
  "suggestedDepartment": "Which department",
  "estimatedResolutionCost": "Cost estimate"
}
```

## Testing Without API Key

If you don't have a Grok API key yet, the system will still work with a **realistic fallback simulation** that:
- Analyzes complaint keywords
- Provides contextually appropriate responses
- Returns the same JSON structure
- Simulates a 1.5-second processing delay

## Vite Environment Variables

Vite automatically loads `.env` files at build time. Variables prefixed with `VITE_` are exposed to the client-side code via `import.meta.env`.

**Note:** Do NOT commit your `.env` file to version control. Add it to `.gitignore`:
```
.env
.env.local
.env.*.local
```

## Usage Example

```javascript
import { analyzeComplaint } from '../lib/llm';

// In your component
const analysis = await analyzeComplaint(
  "The kitchen sink is leaking and water is pooling...",
  "Apartment 305"
);

console.log(analysis);
// OUTPUT:
{
  summary: "Kitchen sink leaking with water pooling...",
  keyActionSteps: ["Shut off water valve", "..."],
  problemSolutionApproach: {...},
  // ... and more fields
}
```

## Troubleshooting

### API Key Not Working
- Verify the key is from https://console.x.ai/
- Check that the `.env` file exists in the project root (not in src/)
- Restart the dev server: `npm run dev`
- Check browser console for error messages

### Getting Markdown Format Instead of JSON
- Grok might wrap JSON in markdown code blocks
- The code already handles this with regex cleanup
- If issues persist, check the system prompt formatting

### Fallback Simulation Always Running
- Check that `VITE_GROK_API_KEY` is set in `.env`
- Verify `VITE_ENABLE_AI_ANALYSIS=true` in `.env`
- Check that the `.env` file is in the project root directory
- Look for error messages in browser dev tools console

### Environment Variables Not Loaded
- Ensure `.env` file is in the **project root** (not in src/)
- Restart the development server after modifying `.env`
- Only `VITE_` prefixed variables are available on client-side

## Next Steps

1. ✅ Install dependencies: `npm install @langchain/openai dotenv`
2. ✅ Create `.env` file with configuration
3. 📝 Add your Grok API key to `.env`
4. 🚀 Start development server: `npm run dev`
5. 🧪 Test complaint submission on ComplaintsPage

## References
- LangChain JS Docs: https://js.langchain.com/
- Grok API Docs: https://x.ai/api/
- Vite Environment Variables: https://vitejs.dev/guide/env-and-modes.html
