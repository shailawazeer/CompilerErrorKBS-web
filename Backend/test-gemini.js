const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Say hello!");
    console.log("✅ Success:", result.response.text());
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

test();
