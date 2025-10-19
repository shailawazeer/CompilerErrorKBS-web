const axios = require("axios");
require("dotenv").config();

async function testDirectAPI() {
  console.log("\n🧪 Testing Gemini API directly...\n");

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY not found in .env file");
    return;
  }

  console.log(`✅ API Key found: ${apiKey.substring(0, 15)}...`);
  console.log(`   Length: ${apiKey.length} characters\n`);

  // List of models to try
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro"];
  console.log("🔄 Testing models...\n");

  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}...`);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const response = await axios.post(
        url,
        {
          contents: [
            {
              parts: [
                {
                  text: "Say 'Hello World' in one sentence.",
                },
              ],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 15000,
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = response.data.candidates[0].content.parts[0].text;
        console.log(`✅ SUCCESS with ${modelName}!`);
        console.log(`   Response: ${text.substring(0, 100)}...\n`);
        console.log(`\n🎉 Use this model in your code: "${modelName}"`);
        return; // Stop testing once we find a working model
      }
    } catch (error) {
      if (error.response) {
        console.log(
          `❌ Failed: ${error.response.status} - ${
            error.response.data?.error?.message || "Unknown error"
          }`
        );
      } else {
        console.log(`❌ Failed: ${error.message}`);
      }
    }
  }

  console.log("\n❌ All models failed. Checking API key validity...\n");

  // Try to list models to check if API key is valid
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listResponse = await axios.get(listUrl);

    if (listResponse.data?.models) {
      console.log("✅ API key is VALID, but no compatible models found");
      console.log("\nAvailable models:");
      listResponse.data.models.forEach((model) => {
        console.log(`   - ${model.name.replace("models/", "")}`);
      });
    }
  } catch (error) {
    console.error("❌ API key validation failed:");
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(
        `   Error: ${JSON.stringify(error.response.data, null, 2)}`
      );
    } else {
      console.error(`   Error: ${error.message}`);
    }

    console.error("\n💡 Solutions:");
    console.error(
      "   1. Generate a NEW API key at: https://aistudio.google.com/app/apikey"
    );
    console.error(
      "   2. Make sure you copy the ENTIRE key (usually 39 characters)"
    );
    console.error("   3. Ensure your .env file has: GEMINI_API_KEY=AIzaSy...");
    console.error("   4. No quotes around the key in .env file");
    console.error("   5. Restart your server after changing .env");
  }
}

testDirectAPI();
