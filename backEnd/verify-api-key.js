import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log("API Key Check:");
console.log("==============");
console.log("Key present:", GEMINI_API_KEY ? "Yes" : "No");
console.log("Key length:", GEMINI_API_KEY?.length || 0);
console.log("Key starts with:", GEMINI_API_KEY?.substring(0, 10) + "...");
console.log("\nTesting API key validity...\n");

// Test with a simple fetch to the API
const testUrl = `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`;

try {
    const response = await fetch(testUrl);
    const data = await response.json();
    
    if (response.ok) {
        console.log("✅ API Key is VALID!");
        console.log("\nAvailable models:");
        data.models?.forEach(model => {
            console.log(`  - ${model.name}`);
        });
    } else {
        console.log("❌ API Key is INVALID or EXPIRED");
        console.log("Error:", data.error?.message || JSON.stringify(data));
        console.log("\n📝 To fix this:");
        console.log("1. Go to https://aistudio.google.com/app/apikey");
        console.log("2. Create a new API key");
        console.log("3. Update GEMINI_API_KEY in your .env file");
    }
} catch (error) {
    console.log("❌ Network error:", error.message);
}
