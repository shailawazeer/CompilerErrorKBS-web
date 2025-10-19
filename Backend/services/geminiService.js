const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Try multiple model names in order of preference
const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro"];

async function generateSolution(query) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not set in .env");
  }

  // Try each model until one works
  for (const modelName of models) {
    // ✅ Fixed: was MODEL_NAMES
    try {
      console.log(`🤖 Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `You are an expert programming tutor helping beginners understand compiler errors.

USER'S CODE/ERROR:
"${query}"

Provide a clear, well-structured explanation in markdown format (MAX 250 words):

## 🔍 Error Type
[Identify: Syntax Error / Runtime Error / Compilation Error / Logical Error]

## 💻 Language Detected
[Auto-detect: C, C++, Java, Python, JavaScript, etc.]

## ❌ What's Wrong?
[Explain the problem in simple, beginner-friendly language - 2-3 sentences]

## 🎯 Why This Happens
[Explain the root cause - 1-2 sentences]

## ✅ How to Fix It

**Step 1:** [First action to take]

**Step 2:** [Second action to take]

**Step 3:** [Final verification step]

## 📝 Example

### Before (Incorrect):
\`\`\`
[Show the exact incorrect code]
\`\`\`

### After (Corrected):
\`\`\`
[Show the fixed version]
\`\`\`

## 💡 Key Takeaway
[One sentence summarizing the lesson]

Keep explanations simple, use proper spacing, and format code blocks clearly.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const solution = response.text().trim();

      console.log(`✅ Successfully generated solution using ${modelName}`);
      console.log(`📝 Query: ${query.substring(0, 50)}...`);

      return solution;
    } catch (error) {
      console.error(`❌ Model ${modelName} failed:`, error.message);

      // If this isn't the last model, try the next one
      if (modelName !== models[models.length - 1]) {
        // ✅ Fixed: was MODEL_NAMES
        console.log(`⏭️  Trying next model...`);
        continue;
      }

      // All models failed
      throw error;
    }
  }

  // Fallback if all models fail
  throw new Error(
    "All Gemini models failed. Please check your API key and quota."
  );
}

// Test function to verify API key and available models
async function testGeminiConnection() {
  try {
    console.log("\n🔍 Testing Gemini API connection...");
    console.log(`API Key present: ${!!process.env.GEMINI_API_KEY}`);
    console.log(
      `API Key preview: ${process.env.GEMINI_API_KEY?.substring(0, 10)}...`
    );

    const testQuery = "What is a null pointer exception?";
    const solution = await generateSolution(testQuery);

    console.log("\n✅ Gemini API is working!");
    console.log(`📝 Test response length: ${solution.length} characters`);
    return true;
  } catch (error) {
    console.error("\n❌ Gemini API test failed:");
    console.error(`   Error: ${error.message}`);
    console.error("\n💡 Troubleshooting steps:");
    console.error(
      "   1. Verify your API key at https://makersuite.google.com/app/apikey"
    );
    console.error(
      "   2. Check if billing is enabled for your Google Cloud project"
    );
    console.error("   3. Ensure the Generative Language API is enabled");
    console.error("   4. Try generating a new API key");
    return false;
  }
}

module.exports = { generateSolution, testGeminiConnection };
