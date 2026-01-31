export const calculateScamScore = (text = "") => {
  let score = 0;
  const msg = text.toLowerCase();


  if (msg.includes("otp")) score += 30;
  if (msg.includes("upi")) score += 20;
  if (msg.includes("password")) score += 30;
  if (msg.includes("urgent")) score += 15;
  if (msg.includes("click")) score += 10;
  if (msg.includes("link")) score += 10;
  if (msg.includes("http")) score += 15;


  if (score > 100) score = 100;

  return score;
};


export const getRiskLevel = (score) => {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
};