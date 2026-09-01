// backend/test-models-free.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testFreeModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env');
    return;
  }

  console.log('🔍 Testing FREE Gemini models...\n');

  // Only these models work with FREE API key
  const models = [
    'gemini-1.5-flash',     // Best for free tier
    'gemini-1.5-pro',       // More capable but slower
    'gemini-1.0-pro',       // Older but stable
    'gemini-pro',           // Oldest
  ];

  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of models) {
    try {
      console.log(`Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say 'Hello'");
      console.log(`✅ ${modelName} WORKS!`);
      console.log(`Response: ${result.response.text()}\n`);
      console.log(`🎯 USE THIS MODEL: ${modelName}`);
      return modelName;
    } catch (error) {
      console.log(`❌ ${modelName} failed:`, error.message);
      console.log('---\n');
    }
  }

  console.log('❌ No models working!');
  console.log('\n🔧 FIX:');
  console.log('1. Go to https://aistudio.google.com/');
  console.log('2. Click "Get API Key"');
  console.log('3. Create a NEW API key');
  console.log('4. Enable billing (FREE tier doesn\'t need payment)');
  console.log('5. Wait 2-3 minutes for activation');
  console.log('6. Update .env with new key');
  console.log('7. Run this test again');
}

testFreeModels();