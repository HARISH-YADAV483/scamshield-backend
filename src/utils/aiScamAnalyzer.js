import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * AI-Powered Scam Analyzer
 * 
 * This module uses OpenAI GPT to analyze text and provide intelligent,
 * contextual scam detection with human-like reasoning.
 */

/**
 * Analyzes text using OpenAI GPT for contextual scam detection
 * @param {string} text - The text to analyze (from OCR)
 * @returns {Object} - Detailed scam analysis with reasoning
 */
export const analyzeWithAI = async (text) => {
  // If no API key, return null to trigger fallback
  if (!openai) {
    console.log("OpenAI API key not configured, using fallback analysis");
    return null;
  }

  if (!text || text.trim().length < 10) {
    return {
      success: false,
      error: "Text too short for meaningful analysis"
    };
  }

  const systemPrompt = `You are an expert scam detection analyst for ScamShield, a fraud prevention platform. Your job is to analyze suspicious messages and provide intelligent, contextual analysis.

## Your Task:
Analyze the given text and determine if it's a scam. If it is, explain WHY in simple, clear language that a regular person can understand.

## Response Format (JSON):
{
  "isScam": boolean,
  "scamType": "string (e.g., 'Job Fraud', 'OTP Scam', 'Phishing', 'Investment Scam', 'Tech Support Scam', 'Prize/Lottery Scam', 'KYC Fraud', 'Romance Scam', 'Unknown')",
  "confidence": "number (0-100)",
  "reasoning": "string - Clear explanation of WHY this is/ isn't a scam. Use real-world examples and common sense.",
  "redFlags": [
    {
      "flag": "string - The suspicious element",
      "explanation": "string - Why this is concerning"
    }
  ],
  "realWorldAdvice": "string - Actionable advice like 'Do NOT click any links', 'Block this number', etc.",
  "whatHappensNext": "string - If user engages, what scam typically unfolds"
}

## Key Scam Indicators to Look For:
1. **Urgency/Pressure**: "Immediate action required", "Account will be blocked", "Limited time offer"
2. **Financial Requests**: "Send money", "Pay registration fee", "Buy gift cards", "UPI transfer"
3. **OTP/Authentication**: "Don't share OTP", "Verification code", "Bank official asking for PIN"
4. **Too Good To Be True**: "Guaranteed returns", "Easy money", "Free prize", "Winner selected"
5. **Impersonation**: "Amazon customer care", "Bank official", "Google support", "Government scheme"
6. **Off-Platform Contact**: "WhatsApp me", "Telegram group", "Call this number"
7. **KYC/Documents**: "Update KYC", "Send ID documents", "Aadhaar/PAN details"
8. **Remote Access**: "Install TeamViewer", "Give remote access", "Download app"

## Important Guidelines:
- Be helpful and clear, not alarmist
- Explain your reasoning so users can learn
- Give specific, actionable advice
- Use examples from real scam patterns
- If uncertain, express that clearly

Now analyze this text and respond with ONLY valid JSON:`;

  const userMessage = `Analyze this text for scams:\n\n"${text}"`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    return {
      success: true,
      ...result,
      analysis: {
        method: "AI",
        model: "gpt-3.5-turbo",
        textLength: text.length,
        analyzedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Quick scam check - returns simple risk assessment
 * @param {string} text - Text to check
 * @returns {Object} - Simplified risk assessment
 */
export const quickScamCheck = async (text) => {
  const analysis = await analyzeWithAI(text);
  
  if (!analysis || !analysis.success) {
    return null;
  }

  // Convert AI analysis to simple risk score
  let riskLevel = "LOW";
  let riskScore = analysis.confidence || 0;

  if (analysis.isScam) {
    if (riskScore >= 70) {
      riskLevel = "HIGH";
    } else if (riskScore >= 40) {
      riskLevel = "MEDIUM";
    }
  }

  return {
    isScam: analysis.isScam,
    scamType: analysis.scamType,
    riskLevel,
    riskScore: Math.round(riskScore),
    reasoning: analysis.reasoning,
    advice: analysis.realWorldAdvice
  };
};

/**
 * Batch analyze multiple texts
 * @param {Array} texts - Array of texts to analyze
 * @returns {Array} - Array of analysis results
 */
export const batchAnalyze = async (texts) => {
  const results = await Promise.all(
    texts.map(async (text) => {
      const analysis = await analyzeWithAI(text);
      return analysis || { success: false, text: text.substring(0, 100) };
    })
  );
  return results;
};

/**
 * Backward compatibility function for existing code
 * Uses pattern-based analysis
 */
export const analyzeScamDescription = (text = "") => {
  if (!text || text.trim() === "") {
    return {
      score: 0,
      riskLevel: "LOW",
      detectedTypes: [],
      redFlags: [],
      analysis: "No description provided for analysis"
    };
  }

  const lowerText = text.toLowerCase();
  let totalScore = 0;
  let matchedPatterns = [];

  // Analyze each pattern category
  for (const [category, { patterns, weight, description }] of Object.entries(SCAM_PATTERNS)) {
    let categoryMatchCount = 0;

    for (const pattern of patterns) {
      if (pattern.test(text)) {
        categoryMatchCount++;
        totalScore += weight;
        matchedPatterns.push({
          category,
          description,
          weight
        });
      }
    }

    if (categoryMatchCount > 1) {
      const maxWeight = weight;
      const bonus = Math.min(categoryMatchCount - 1, 3) * 5;
      totalScore = totalScore - (categoryMatchCount * weight) + maxWeight + bonus;
    }
  }

  const textLength = text.length;
  if (textLength < 20) {
    totalScore += 10;
  }

  const urgencyMatch = /\b(urgent|immediately|asap|hurry)\b/i.test(lowerText);
  const moneyMatch = /\b(money|payment|transfer|send|pay|fee|deposit)\b/i.test(lowerText);
  const contactMatch = /\b(whatsapp|telegram|phone|call|contact|message)\b/i.test(lowerText);

  if (urgencyMatch && moneyMatch) {
    totalScore += 15;
    matchedPatterns.push({
      category: "critical_combination",
      description: "URGENCY + MONEY REQUEST - Classic scam pattern",
      weight: 15
    });
  }

  if (urgencyMatch && contactMatch) {
    totalScore += 10;
    matchedPatterns.push({
      category: "critical_combination",
      description: "URGENCY + OFF-CONTACT REQUEST - High pressure to move conversation",
      weight: 10
    });
  }

  const normalizedScore = Math.min(Math.max(totalScore, 0), 100);

  let riskLevel = "LOW";
  if (normalizedScore >= 70) {
    riskLevel = "HIGH";
  } else if (normalizedScore >= 40) {
    riskLevel = "MEDIUM";
  }

  const detectedTypes = detectScamType(text);
  const redFlags = extractRedFlags(text);

  return {
    score: normalizedScore,
    riskLevel,
    detectedTypes,
    redFlags,
    matchedPatterns: matchedPatterns.slice(0, 10),
    analysis: {
      totalIndicators: matchedPatterns.length,
      primaryRisk: detectedTypes[0] || "Unknown",
      confidence: normalizedScore >= 70 ? "HIGH" : normalizedScore >= 40 ? "MEDIUM" : "LOW"
    }
  };
};

/**
 * Backward compatibility function
 */
export const getRiskLevel = (score) => {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
};

// Pattern categories for backward compatibility
const SCAM_PATTERNS = {
  urgency: {
    patterns: [
      /\b(urgent|immediately|asap|right away|right now|hurry|limited time|expires?|deadline|act now|don'?t delay|only.*left)\b/i,
      /\b(within.*hours?|today only|hours left|minutes left|final.*call|last.*chance)\b/i,
    ],
    weight: 25,
    description: "Creates artificial urgency to prevent careful thinking"
  },
  financialRequest: {
    patterns: [
      /\b(send.*money|transfer.*money|pay.*fee|processing fee|registration fee|advance.*payment|upfront|initial.*payment)\b/i,
      /\b(deposit.*amount|wallet.*balance|refill.*account|load.*money|add.*money|top.?up)\b/i,
      /\b(₹|rs\.?|rupees?|inr|dollars?|usd)\s*\d+[\d,]*\s*(now|please|urgently)?\b/i,
      /\b\d+[\d,]*\s*(₹|rs\.?|rupees?|inr|dollars?|usd)\b/i,
      /\b(give.*account|bank.*details|account.*number|upi.*id|qr.*code|payment.*link)\b/i,
    ],
    weight: 30,
    description: "Requests for financial transactions or payment details"
  },
  otpScam: {
    patterns: [
      /\b(otp|one.?time.?password|verification.*code|security.*code|pin.*number|don'?t.*share|don'?t.*tell)\b/i,
      /\b(shared.*by.*mistake|accidentally.*sent|wrong.*transfer|refund.*otp)\b/i,
      /\b(bank.*official|customer.*care|support.*team).*ask.*(otp|pin|password)\b/i,
    ],
    weight: 35,
    description: "Attempts to steal OTP/PIN through social engineering"
  },
  jobFraud: {
    patterns: [
      /\b(work.*from.*home|remote.*job|part.*time.*job|freelance|gig.*earning|easy.*money|earn.*daily)\b/i,
      /\b(registration.*fee|joining.*fee|training.*fee|material.*fee|kit.*fee|investment.*plan)\b/i,
      /\b(telegram.*group|whatsapp.*group|join.*channel|contact.*hr|hr.*department)\b/i,
      /\b(typing.*job|data.*entry|form.*filling|customer.*service.*job)\b/i,
      /\b(unlimited.*earning|fixed.*salary|daily.*payment|weekly.*payment)\b/i,
    ],
    weight: 30,
    description: "Fake job offers requiring upfront payments"
  },
  investmentFraud: {
    patterns: [
      /\b(investment|mutual.*fund|stock.*market|trading|crypto|cryptocurrency|bitcoin|ethereum)\b/i,
      /\b(guaranteed.*return|fixed.*return|high.*return|double.*money|triple.*money|luck.*chance)\b/i,
      /\b(trading.*app|investment.*app|forex|binance|wazirx|coinDCX|groww|zerodha)\b/i,
      /\b(minimum.*deposit|minimum.*investment|start.*with|just.*₹|just.*rs)\b/i,
      /\b(100%.*safe|legitimate|government.*approved|registered.*company)\b/i,
    ],
    weight: 28,
    description: "Investment opportunities promising unrealistic returns"
  },
  phishing: {
    patterns: [
      /\b(verify.*account|update.*account|confirm.*details|secure.*account|locked.*account)\b/i,
      /\b(click.*link|visit.*website|login.*page|bank.*website|official.*website)\b/i,
      /\b(amazon|paytm|phonepe|googlepay|flipkart|netbanking)\b.*(refund|update|verify)/i,
      /\b(your.*account.*will.*be.*(suspended|blocked|closed)|action.*required|immediate.*attention)\b/i,
      /\b(suspended.*account|blocked.*account|verify.*kyc|kyc.*pending|kyc.*expired)\b/i,
    ],
    weight: 32,
    description: "Attempts to steal credentials through fake links/alerts"
  },
  prizeScam: {
    patterns: [
      /\b(Congratulations|winner|won|lucky.*winner|selected|chosen)\b/i,
      /\b(prize|lottery|jackpot|cash.*prize|gift.*voucher|free.*money|free.*gift)\b/i,
      /\b(claim.*prize|claim.*reward|collect.*winnings|shipping.*fee|delivery.*charge|tariff.*fee)\b/i,
      /\b(won.*draw|winner.*notification|you.*have.*won|congratulations.*winner)\b/i,
    ],
    weight: 28,
    description: "Fake prize notifications requiring payment to claim"
  },
  identityScam: {
    patterns: [
      /\b(kyc|know.*your.*customer|identity.*verification|document.*verification)\b/i,
      /\b(aadhaar|pan.*card|bank.*passbook|photo.*id|selfie.*with.*id)\b/i,
      /\b(update.*kyc|complete.*kyc|kyc.*pending|kyc.*failed|verify.*identity)\b/i,
    ],
    weight: 25,
    description: "Requests for identity documents for fraudulent purposes"
  },
  romanceScam: {
    patterns: [
      /\b(love|romance|relationship|marry|married|wedding|trust.*me|feel.*strongly)\b/i,
      /\b(long.*distance|overseas|military|doctor|engineer|working.*abroad)\b/i,
      /\b(send.*gift|send.*money|help.*family|medical.*emergency|investment.*for.*us)\b/i,
    ],
    weight: 25,
    description: "Emotional manipulation to extract money"
  },
  techSupportScam: {
    patterns: [
      /\b(technical.*support|microsoft|apple|google|amazon.*support|customer.*care)\b/i,
      /\b(computer.*infected|virus|malware|hacked|unauthorized.*access)\b/i,
      /\b(remote.*access|teamviewer|anydesk|quick.*assist|give.*control)\b/i,
      /\b(refund.*for.*subscription|subscription.*expired|renew.*subscription)\b/i,
    ],
    weight: 30,
    description: "Fake tech support or refund scams"
  }
};

// Helper function to detect scam type from text
const detectScamType = (text) => {
  const lowerText = text.toLowerCase();
  const detectedTypes = [];

  if (/\b(otp|one.?time.*password|verification.*code|pin|password.*shared|shared.*otp)\b/i.test(lowerText)) {
    detectedTypes.push("OTP Theft");
  }
  if (/\b(upi|payment|wallet|qr.*code|scan.*qr|send.*money|transfer)\b/i.test(lowerText)) {
    detectedTypes.push("UPI Fraud");
  }
  if (/\b(job|work.*from.*home|remote.*job|part.*time|freelance|earning|typing|registration.*fee|training.*fee)\b/i.test(lowerText)) {
    detectedTypes.push("Job Fraud");
  }
  if (/\b(investment|crypto|bitcoin|trading|stock|mutual.*fund|forex|double.*money|high.*return)\b/i.test(lowerText)) {
    detectedTypes.push("Investment/Crypto Scam");
  }
  if (/\b(click.*link|login|website|verify.*account|update.*account|bank.*website|amazon|paytm)\b/i.test(lowerText)) {
    detectedTypes.push("Phishing");
  }
  if (/\b(prize|lottery|winner|congratulations|won|claim.*prize|free.*gift)\b/i.test(lowerText)) {
    detectedTypes.push("Prize/Lottery Scam");
  }
  if (/\b(kyc|identity|document|aadhaar|pan.*card|verification)\b/i.test(lowerText)) {
    detectedTypes.push("KYC Fraud");
  }
  if (/\b(support|customer.*care|technical.*support|microsoft|amazon.*call|refund)\b/i.test(lowerText)) {
    detectedTypes.push("Tech Support Scam");
  }

  return detectedTypes.length > 0 ? detectedTypes : ["Unknown Scam Type"];
};

// Helper function to extract key red flags
const extractRedFlags = (text) => {
  const lowerText = text.toLowerCase();
  const redFlags = [];

  if (/\b(urgent|immediately|asap|hurry|limited time|act now)\b/i.test(lowerText)) {
    redFlags.push("Creates artificial urgency");
  }

  if (/\b(send money|transfer|pay fee|deposit|upfront|payment)\b/i.test(lowerText)) {
    redFlags.push("Requests money/payment");
  }

  if (/\b(otp|verification code|don't share|don't tell)\b/i.test(lowerText)) {
    redFlags.push("Asks for OTP/PIN");
  }

  if (/\b(guaranteed|double money|high return|easy money|free)\b/i.test(lowerText)) {
    redFlags.push("Too good to be true offer");
  }

  if (/\b(bank official|customer care|support team|hr department)\b/i.test(lowerText)) {
    redFlags.push("Claims to be official/representative");
  }

  if (/\b(click link|visit website|login here|click here)\b/i.test(lowerText)) {
    redFlags.push("Asks to click suspicious links");
  }

  return redFlags;
};

export default {
  analyzeWithAI,
  quickScamCheck,
  batchAnalyze,
  analyzeScamDescription,
  getRiskLevel
};

