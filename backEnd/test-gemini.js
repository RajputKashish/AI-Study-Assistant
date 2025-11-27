import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Load API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log("Testing Gemini API...");
console.log("API Key present:", GEMINI_API_KEY ? "Yes" : "No");

// Initialize SDK
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// List of models to try
const modelsToTry = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",     // more reasoning / heavy tasks
  "gemini-2.0-flash"    // fallback
];


// Use top-level await (works only in ES modules)
for (const modelName of modelsToTry) {
  try {
    console.log(`\n🔍 Trying model: ${modelName}`);

    const model = genAI.getGenerativeModel({ model: modelName });

    /** 
     * FIXED:
     * generateContent() directly returns an object containing `response`
     * No need to await result.response anymore.
     */
    const result = await model.generateContent("Say hello!");

    // Extract text correctly
    const text = result.response.text();

    console.log(`✅ SUCCESS with ${modelName}`);
    console.log(`Response: ${text.substring(0, 50)}...`);

    break; // Stop after first successful model
  } catch (error) {
    // Show actual error for debugging
    console.log(`❌ Failed: ${error?.message || error}`);
  }
}
