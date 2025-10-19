const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listAvailableModels() {
  try {
    console.log("🔍 Checking available Gemini models...\n");
    console.log(`API Key: ${process.env.GEMINI_API_KEY?.substring(0, 10)}...`);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // List all available models
    const models = await genAI.listModels();

    console.log("\n✅ Available Models:");
    console.log("=".repeat(50));

    for (const model of models) {
      console.log(`\n📦 Model: ${model.name}`);
      console.log(`   Display Name: ${model.displayName}`);
      console.log(
        `   Supported Methods: ${model.supportedGenerationMethods?.join(", ")}`
      );
      console.log(`   Input Token Limit: ${model.inputTokenLimit}`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("\n💡 Use one of the model names above in your code");
  } catch (error) {
    console.error("\n❌ Error listing models:", error.message);
    console.error("\n🔧 Possible issues:");
    console.error("   1. Invalid API key");
    console.error("   2. API key not enabled");
    console.error("   3. Network/firewall blocking Google APIs");
    console.error(
      "\n💡 Get a new API key at: https://aistudio.google.com/app/apikey"
    );
  }
}

listAvailableModels();
