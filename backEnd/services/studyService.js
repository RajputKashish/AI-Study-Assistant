import StudySession from "../models/studySession.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash"
});

export const generateStudyMaterial = async (text, userId) => {
  try {
    const prompt = `
Summarize the following notes and create a practice quiz.
Return ONLY valid JSON (no markdown, no extra text).

JSON format:
{
  "summary": ["point1", "point2", "point3", ...],
  "quiz": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correct": "A"
    }
  ]
}

Notes:
${text}
`;

    const result = await model.generateContent(prompt);
    let output = result.response.text();

    output = output.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch {
      throw new Error("AI response was not valid JSON");
    }

    const studySession = await StudySession.create({
      user: userId,
      inputText: text,
      summary: parsed.summary,
      quiz: parsed.quiz,
    });

    return studySession;
  } catch (error) {
    throw error;
  }
};

export const getStudyHistory = async (userId) => {
  return await StudySession.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(10);
};
