// backend/routes/receiptRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ✅ DEBUG VERSION - This will log everything
router.post('/upload', upload.single('receipt'), async (req, res) => {
  console.log('========================================');
  console.log('📥 RECEIPT UPLOAD REQUEST RECEIVED');
  console.log('========================================');
  
  try {
    // Step 1: Check if file exists
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded' 
      });
    }

    console.log(`✅ File received:`);
    console.log(`   - Name: ${req.file.originalname}`);
    console.log(`   - Size: ${req.file.size} bytes`);
    console.log(`   - Type: ${req.file.mimetype}`);
    console.log(`   - Path: ${req.file.path}`);

    // Step 2: Check API Key
    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`🔑 API Key: ${apiKey ? '✅ Present (' + apiKey.substring(0, 10) + '...)' : '❌ MISSING!'}`);
    
    if (!apiKey) {
      console.log('❌ GEMINI_API_KEY is missing');
      return res.status(500).json({ 
        success: false,
        error: 'Server configuration error: API key missing' 
      });
    }

    // Step 3: Test Gemini API connection
    console.log('🔄 Testing Gemini API connection...');
    
    let genAI;
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      console.log('✅ Gemini client created');
    } catch (error) {
      console.log('❌ Failed to create Gemini client:', error.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to initialize AI service',
        details: error.message
      });
    }

    // Step 4: Read file
    console.log('📖 Reading file...');
    let fileBuffer;
    let base64Data;
    try {
      fileBuffer = fs.readFileSync(req.file.path);
      base64Data = fileBuffer.toString('base64');
      console.log(`✅ File read: ${base64Data.length} characters`);
    } catch (error) {
      console.log('❌ Failed to read file:', error.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to read file',
        details: error.message
      });
    }

    // Step 5: Try each model
    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.0-pro'
    ];

    let result = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`🔄 Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName
        });

        console.log(`📤 Sending to Gemini (${modelName})...`);
        
        const startTime = Date.now();
        result = await model.generateContent([
          "Extract receipt details in JSON format: merchant_name (string), date (string in YYYY-MM-DD), total_amount (number), tax (number), items (array with name and price). Return ONLY valid JSON.",
          { inlineData: { mimeType: req.file.mimetype, data: base64Data } }
        ]);
        const endTime = Date.now();
        
        console.log(`✅ Gemini responded in ${endTime - startTime}ms`);
        console.log(`📝 Response preview: ${result.response.text().substring(0, 100)}...`);
        
        break; // Success, exit loop
      } catch (error) {
        console.log(`❌ Model ${modelName} failed:`, error.message);
        lastError = error;
        continue;
      }
    }

    // Step 6: Check if we got a response
    if (!result || !result.response) {
      console.log('❌ All models failed');
      console.log('Last error:', lastError?.message);
      
      // Clean up file
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      
      return res.status(500).json({
        success: false,
        error: 'AI processing failed',
        details: lastError?.message || 'Unknown error',
        suggestion: 'Check your Gemini API key and try again'
      });
    }

    // Step 7: Parse response
    const responseText = result.response.text();
    console.log('📝 Full response:', responseText);

    let extractedData;
    try {
      extractedData = JSON.parse(responseText);
      console.log('✅ JSON parsed successfully');
    } catch (parseError) {
      console.log('⚠️ Failed to parse JSON, trying to extract...');
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          extractedData = JSON.parse(jsonMatch[0]);
          console.log('✅ JSON extracted from text');
        } catch (e) {
          console.log('❌ Failed to extract JSON');
          extractedData = {
            merchant_name: "Unknown",
            date: new Date().toISOString().split('T')[0],
            total_amount: 0,
            tax: 0,
            items: [],
            raw_text: responseText
          };
        }
      } else {
        extractedData = {
          merchant_name: "Unknown",
          date: new Date().toISOString().split('T')[0],
          total_amount: 0,
          tax: 0,
          items: []
        };
      }
    }

    // Step 8: Clean up
    try { fs.unlinkSync(req.file.path); } catch (e) {}

    // Step 9: Send success
    console.log('✅ Sending success response');
    console.log('========================================\n');
    
    res.status(200).json({
      success: true,
      data: extractedData,
      message: 'Receipt processed successfully'
    });

  } catch (error) {
    console.log('========================================');
    console.log('❌ UNEXPECTED ERROR:');
    console.log(error);
    console.log('========================================\n');
    
    // Clean up file if it exists
    try { if (req.file) fs.unlinkSync(req.file.path); } catch (e) {}
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;