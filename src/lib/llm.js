import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

/**
 * AI Service for processing property complaints using Grok API via LangChain
 * Parses complaint descriptions and provides:
 * - Summary of the issue
 * - Key action steps to resolve
 * - Problem-solution mindset approach
 */

export const analyzeComplaint = async (text, propertyName) => {
  const apiKey = import.meta.env.VITE_GROK_API_KEY;
  const baseUrl = import.meta.env.VITE_GROK_API_BASE_URL || "https://api.x.ai/v1";
  const modelName = import.meta.env.VITE_GROK_MODEL || "grok-beta";
  const enableAI = import.meta.env.VITE_ENABLE_AI_ANALYSIS === "true";

  // 1. Try to use real AI if API key is configured
  if (apiKey && enableAI) {
    try {
      const model = new ChatOpenAI({
        modelName: modelName,
        openAIApiKey: apiKey,
        baseURL: baseUrl,
        maxTokens: 2048,
        temperature: 0.7,
      });

      const systemPrompt = `You are an expert property management AI assistant. Analyze complaint descriptions and provide structured analysis in the following JSON format.
      
Your response must be ONLY valid JSON, no additional text. Use this exact structure:
{
  "summary": "A concise 1-2 sentence summary of the main issue",
  "problemDescription": "Detailed description of the problem and its impact",
  "keyActionSteps": [
    "First actionable step to resolve the issue",
    "Second actionable step",
    "Third actionable step (if applicable)"
  ],
  "problemSolutionApproach": {
    "problemAnalysis": "Root cause analysis of the issue",
    "solutionStrategy": "Overall approach to solve the problem",
    "expectedOutcome": "What should be achieved after resolution",
    "timeline": "Estimated time to resolve"
  },
  "category": "Issue category (e.g., Plumbing, Electrical, Maintenance, etc.)",
  "priority": "High|Medium|Low based on severity",
  "suggestedDepartment": "Which department should handle this",
  "estimatedResolutionCost": "Rough cost estimate if applicable"
}`;

      const userPrompt = `Please analyze the following property complaint for "${propertyName}":

COMPLAINT DESCRIPTION:
${text}

Provide a structured analysis with actionable steps and a problem-solution mindset approach.`;

      const response = await model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt)
      ]);

      // Parse the JSON from the text response
      // Handle potential markdown code blocks in response
      let cleanText = response.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      // Remove any leading/trailing text before/after JSON
      const jsonStart = cleanText.indexOf('{');
      const jsonEnd = cleanText.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
      }

      return JSON.parse(cleanText);

    } catch (error) {
      console.warn("Grok AI API Call failed, falling back to simulation:", error);
    }
  }

  // 2. Fallback Simulation (if no key or error)
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

  const lowerText = text.toLowerCase();
  let category = "General Maintenance";
  let priority = "Medium";
  let suggestedDepartment = "Property Management";
  let summary = "Resident reported a maintenance issue.";
  let problemDescription = "The property requires maintenance attention.";
  let keyActionSteps = [
    "Document the complaint with photos/videos if possible",
    "Assess the severity and impact on the resident",
    "Schedule an inspection within 24-48 hours"
  ];
  let problemSolutionApproach = {
    problemAnalysis: "Need detailed inspection to understand the root cause",
    solutionStrategy: "Professional assessment followed by appropriate repairs",
    expectedOutcome: "Property restored to acceptable condition",
    timeline: "3-7 days depending on complexity"
  };
  let estimatedResolutionCost = "$200 - $500";

  // Logic simulation based on keywords
  if (lowerText.includes('water') || lowerText.includes('leak') || lowerText.includes('flood')) {
    category = "Plumbing";
    priority = "High";
    suggestedDepartment = "Emergency Plumbing Service";
    summary = "Water leakage or flooding reported - urgent attention required.";
    problemDescription = "The property is experiencing water damage or leakage that poses immediate risk to the unit and adjacent properties.";
    keyActionSteps = [
      "IMMEDIATE: Shut off main water valve to the unit",
      "Contact emergency plumber for immediate inspection",
      "Document water damage with photos/video for insurance",
      "Move resident to temporary accommodation if necessary",
      "Assess structural damage and prevent further deterioration"
    ];
    problemSolutionApproach = {
      problemAnalysis: "Water leak/flooding caused by pipe rupture, fixture failure, or drainage blockage",
      solutionStrategy: "Emergency response with professional plumber, repair source of leak, restore water flow, repair/replace damaged fixtures, assess water damage",
      expectedOutcome: "Water leak stopped, pipe/fixture repaired/replaced, water damage remediated, resident satisfied",
      timeline: "4-24 hours for initial stoppage, 3-7 days for full repair"
    };
    estimatedResolutionCost = "$500 - $2000+";
  } else if (lowerText.includes('electricity') || lowerText.includes('power') || lowerText.includes('outage')) {
    category = "Electrical";
    priority = "High";
    suggestedDepartment = "Electrical Services";
    summary = "Power outage or electrical failure reported.";
    problemDescription = "The property has lost electrical power or experiencing electrical system failure affecting one or multiple units.";
    keyActionSteps = [
      "Verify if it's a building-wide or unit-specific outage",
      "Check circuit breakers and main electrical panel",
      "Contact licensed electrician for inspection",
      "If building-wide, contact power utility immediately",
      "Ensure temporary lighting for safety if needed"
    ];
    problemSolutionApproach = {
      problemAnalysis: "Electrical outage/failure could be due to tripped breaker, utility issue, faulty wiring, or overloaded circuit",
      solutionStrategy: "Identify scope (unit vs building), check breakers, contact utility if building-wide, hire licensed electrician for internal issues, repair faulty components",
      expectedOutcome: "Power restored to unit, electrical system functioning safely, root cause identified and fixed",
      timeline: "1-4 hours for utility restoration, 24-48 hours for internal electrical repairs"
    };
    estimatedResolutionCost = "$300 - $1500";
  } else if (lowerText.includes('noise') || lowerText.includes('neighbor') || lowerText.includes('sound') || lowerText.includes('party')) {
    category = "Disturbance / Neighbor";
    priority = "Medium";
    suggestedDepartment = "Building Management / Security";
    summary = "Noise complaint from neighboring unit or common areas.";
    problemDescription = "Resident is experiencing excessive noise that violates building noise policies and affects quality of life.";
    keyActionSteps = [
      "Document complaint with date, time, and noise level details",
      "Review building noise policies and lease agreements",
      "Issue formal warning notice to offending unit",
      "Mediate between residents if both parties agree",
      "If repeated, escalate to legal/eviction process"
    ];
    problemSolutionApproach = {
      problemAnalysis: "Noise issue stemming from neighboring unit activities, construction, or events during quiet hours",
      solutionStrategy: "Document incidents, communicate building policies, issue progressive warnings, involve both parties in mediation, escalate if unresolved",
      expectedOutcome: "Noise reduced to acceptable levels, resident satisfaction restored, or policy violation addressed",
      timeline: "24-48 hours for first contact, 7-14 days for resolution"
    };
    estimatedResolutionCost = "$0 - $200 (primarily administrative)";
  } else if (lowerText.includes('internet') || lowerText.includes('wifi') || lowerText.includes('broadband')) {
    category = "Connectivity";
    priority = "Medium";
    suggestedDepartment = "IT / ISP Support";
    summary = "Internet or WiFi connectivity issues reported.";
    problemDescription = "Resident experiencing slow or no internet service affecting their work/living situation.";
    keyActionSteps = [
      "Restart home router and modem",
      "Check if service is down building-wide",
      "Restart ISP equipment or reboot line",
      "Contact ISP technical support if building-wide issue",
      "Consider WiFi optimization if signal weak"
    ];
    problemSolutionApproach = {
      problemAnalysis: "Connectivity issue caused by equipment malfunction, signal interference, ISP outage, or configuration problem",
      solutionStrategy: "Troubleshoot equipment, verify ISP service status, optimize router placement, escalate to ISP if needed, consider mesh network upgrade",
      expectedOutcome: "High-speed internet restored, resident can work/stream without interruption",
      timeline: "1-4 hours for troubleshooting, next business day for ISP issues"
    };
    estimatedResolutionCost = "$0 - $300";
  } else if (lowerText.includes('clean') || lowerText.includes('dirty') || lowerText.includes('pest') || lowerText.includes('trash') || lowerText.includes('cockroach') || lowerText.includes('rodent')) {
    category = "Hygiene / Pest Control";
    priority = "High";
    suggestedDepartment = "Housekeeping / Pest Control";
    summary = "Cleanliness, pest, or sanitation issue reported in the property.";
    problemDescription = "Pest infestation or cleanliness issues creating health hazards and affecting resident comfort and safety.";
    keyActionSteps = [
      "Schedule immediate pest control inspection",
      "Isolate affected area to prevent spread",
      "Perform deep cleaning of common areas",
      "Identify entry points and seal them",
      "Implement preventive maintenance schedule",
      "Follow up with inspection in 7-14 days"
    ];
    problemSolutionApproach = {
      problemAnalysis: "Pest infestation or unsanitary conditions due to poor cleaning, improper waste management, or structural gaps",
      solutionStrategy: "Professional pest control treatment, thorough cleaning, eliminate food sources, seal entry points, establish preventive maintenance plan",
      expectedOutcome: "Zero pest activity, clean and sanitary environment, resident health and safety assured",
      timeline: "24-48 hours for initial treatment, 2-3 weeks for complete elimination"
    };
    estimatedResolutionCost = "$300 - $1000";
  } else if (lowerText.includes('security') || lowerText.includes('theft') || lowerText.includes('lock') || lowerText.includes('break-in')) {
    category = "Security";
    priority = "High";
    suggestedDepartment = "Security / Maintenance";
    summary = "Security concern, theft, or lock issue reported.";
    problemDescription = "Resident feels unsafe due to security breach, theft, or access control failure requiring immediate protective measures.";
    keyActionSteps = [
      "Immediately ensure resident safety and security",
      "Dispatch security personnel for assessment",
      "Document incident with photos/video evidence",
      "File police report if theft occurred",
      "Repair/replace affected locks or access systems",
      "Review CCTV footage if available",
      "Increase patrols in affected area"
    ];
    problemSolutionApproach = {
      problemAnalysis: "Security failure due to broken locks, faulty access system, inadequate patrols, or structural vulnerabilities",
      solutionStrategy: "Immediate security response, replace compromised locks, upgrade access control, increase surveillance, investigate root cause, implement prevention measures",
      expectedOutcome: "Resident feels secure, security breach fixed, additional preventive measures in place, confidence restored",
      timeline: "Immediate response, 24-48 hours for repairs"
    };
    estimatedResolutionCost = "$200 - $800";
  }

  return {
    summary,
    problemDescription,
    keyActionSteps,
    problemSolutionApproach,
    category,
    priority,
    suggestedDepartment,
    estimatedResolutionCost
  };
};
