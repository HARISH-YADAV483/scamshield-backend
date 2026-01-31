import ScamReport from "../models/ScamReport.model.js";
import { analyzeScamDescription, getRiskLevel } from "../utils/aiScamAnalyzer.js";

import VerifiedScamContact from "../models/VerifiedScamContact.model.js";
import { detectContactType, normalizeContact } from "../utils/contactMatch.js";
import { simpleSimilarity } from "../utils/similarity.js";


export const reportScam = async (req, res) => {
  try {
    const {
      title,
      description,
      scamType,
      platform,
      scammerContact,
      lossAmount,
    } = req.body;


    if (!title || !description || !scamType || !platform) {
      return res.status(400).json({ message: "❌ Required fields missing" });
    }


    const combinedText = `${title} ${description}`;
    const aiAnalysis = analyzeScamDescription(combinedText);
    let susceptibilityScore = aiAnalysis.score;


    const loss = Number(lossAmount || 0);
    if (loss > 0) susceptibilityScore += 35;


    let contactMatchPercent = 0;
    let matchedVerifiedContacts = [];

    if (scammerContact && scammerContact.trim() !== "") {
      const inputType = detectContactType(scammerContact);
      const normInput = normalizeContact(scammerContact);


      const dbContacts = await VerifiedScamContact.find({
        type: inputType,
        isVerified: true,
      }).limit(200);

      for (const c of dbContacts) {
        const normDb = normalizeContact(c.value);
        const sim = simpleSimilarity(normInput, normDb);


        if (sim > contactMatchPercent) {
          contactMatchPercent = sim;
        }


        if (sim >= 70) {
          matchedVerifiedContacts.push({
            value: c.value,
            type: c.type,
            source: c.source,
            similarity: sim,
            tags: c.tags,
            notes: c.notes,
          });
        }
      }


      if (contactMatchPercent >= 90) susceptibilityScore += 35;
      else if (contactMatchPercent >= 80) susceptibilityScore += 25;
      else if (contactMatchPercent >= 70) susceptibilityScore += 15;
    }


    if (susceptibilityScore > 100) susceptibilityScore = 100;


    const riskLevel = getRiskLevel(susceptibilityScore);


    const report = await ScamReport.create({
      title,
      description,
      scamType,
      platform,
      scammerContact: scammerContact || "",
      lossAmount: loss,
      susceptibilityScore,
      status: "pending",
      reportedBy: req.user.id,

      // ✅ NEW fields
      contactMatchPercent,
      matchedVerifiedContacts,
    });

    res.status(201).json({
      message: "✅ Scam reported successfully",
      report,
      riskLevel,
      
      
      contactMatchPercent,
      matchedVerifiedContacts,
      

      aiAnalysis: {
        score: aiAnalysis.score,
        riskLevel: aiAnalysis.riskLevel,
        detectedTypes: aiAnalysis.detectedTypes,
        redFlags: aiAnalysis.redFlags,
        analysis: aiAnalysis.analysis
      }
    });
  } catch (error) {
    console.log("❌ reportScam error:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};


export const getLatestVerifiedScams = async (req, res) => {
  try {
    const scams = await ScamReport.find({ status: "verified" })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(scams);
  } catch (error) {
    console.log("❌ getLatestVerifiedScams error:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

export const searchScams = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "❌ Search query is required" });
    }

    const scams = await ScamReport.find({
      status: "verified",
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { scammerContact: { $regex: q, $options: "i" } },
        { scamType: { $regex: q, $options: "i" } },
        { platform: { $regex: q, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(scams);
  } catch (error) {
    console.log("❌ searchScams error:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};


export const getScamById = async (req, res) => {
  try {
    const { id } = req.params;

    const scam = await ScamReport.findById(id);

    if (!scam) {
      return res.status(404).json({ message: "❌ Scam not found" });
    }

    res.status(200).json(scam);
  } catch (error) {
    console.log("❌ getScamById error:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};