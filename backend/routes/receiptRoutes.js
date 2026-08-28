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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and PDF files are allowed'), false);
    }
  }
});

router.post('/upload', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded' 
      });
    }

    console.log(`📁 Processing receipt: ${req.file.filename}`);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY is missing');
      return res.status(500).json({ 
        success: false,
        error: 'Server configuration error: API key missing' 
      });
    }

    // Initialize Gemini with FREE model
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ✅ Use ONLY free models
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",  // Best free model
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      }
    });

    // Read file
    const fileBuffer = fs.readFileSync(req.file.path);
    const base64Data = fileBuffer.toString('base64');
    const mimeType = req.file.mimetype;

    console.log('🤖 Sending to Gemini (free tier)...');

    // ✅ Correct format for free tier
    const result = await model.generateContent([
      "Extract receipt details in JSON format: merchant_name, date (YYYY-MM-DD), total_amount, tax, items (array of name and price). Return ONLY JSON.",
      { inlineData: { mimeType: mimeType, data: base64Data } }
    ]);

    const responseText = result.response.text();
    console.log('📝 Gemini Response:', responseText);

    // Parse response
    let extractedData;
    try {
      extractedData = JSON.parse(responseText);
    } catch (parseError) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        extractedData = {
          merchant_name: "Unknown",
          date: new Date().toISOString().split('T')[0],
          total_amount: 0,
          tax: 0,
          items: [],
          raw_text: responseText
        };
      }
    }

    res.status(200).json({
      success: true,
      data: extractedData,
      message: 'Receipt processed successfully'
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process receipt',
      details: error.message
    });
  }
});

module.exports = router;