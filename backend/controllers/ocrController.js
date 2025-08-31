// backend/controllers/ocrController.js
const { createWorker } = require('tesseract.js');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const findTotal = (text) => {
  const lines = text.split('\n');
  
  // Enhanced regex to find total amounts with various formats
  const totalRegexes = [
    /(?:(?<!sub)total|amount due|balance|debit|grand total|final total)[\s:]*([\$€₹]?\s?\d{1,6}[,.]\d{2})/i,
    /([\$€₹]?\s?\d{1,6}[,.]\d{2})[\s]*total/i,
    /total[\s]*([\$€₹]?\s?\d{1,6}[,.]\d{2})/i
  ];

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    for (const regex of totalRegexes) {
      const match = line.match(regex);
      if (match && match[1]) {
        return parseFloat(match[1].replace(/[^0-9.]/g, ''));
      }
    }
  }

  return null;
};

const findDate = (text) => {
  // Common date patterns in receipts
  const dateRegexes = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/g, // MM/DD/YYYY or DD/MM/YYYY
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/g,   // MM/DD/YY or DD/MM/YY
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g,   // YYYY/MM/DD
    /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{2,4})/gi, // DD MMM YYYY
  ];

  for (const regex of dateRegexes) {
    const match = text.match(regex);
    if (match && match[0]) {
      try {
        const date = new Date(match[0]);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      } catch (e) {
        // Continue to next regex
      }
    }
  }

  return null;
};

const findDescription = (text) => {
  const lines = text.split('\n');
  
  // Look for common receipt patterns
  const descriptionPatterns = [
    /(?:store|shop|business|company|restaurant|cafe|market|mall|outlet)[\s:]*([^\n]+)/i,
    /(?:merchant|vendor|seller)[\s:]*([^\n]+)/i,
    /^([A-Z\s&]+(?:STORE|SHOP|RESTAURANT|MARKET|OUTLET|LTD|INC|LLC))$/i
  ];

  for (const line of lines) {
    for (const pattern of descriptionPatterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        const description = match[1].trim();
        if (description.length > 3 && description.length < 100) {
          return description;
        }
      }
    }
  }

  // Fallback: look for lines that might be business names
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 5 && trimmed.length < 50 && 
        /^[A-Z\s&]+$/.test(trimmed) && 
        !trimmed.includes('TOTAL') && 
        !trimmed.includes('AMOUNT') &&
        !trimmed.includes('DATE') &&
        !trimmed.includes('RECEIPT')) {
      return trimmed;
    }
  }

  return null;
};

const findCategory = (text) => {
  const textLower = text.toLowerCase();
  
  // Common category keywords
  const categoryKeywords = {
    'groceries': ['grocery', 'supermarket', 'food', 'vegetables', 'fruits', 'dairy', 'store', 'general store', 'milk', 'bread', 'noodles', 'cheese'],
    'restaurants': ['restaurant', 'cafe', 'dining', 'food', 'meal', 'lunch', 'dinner'],
    'transportation': ['fuel', 'gas', 'petrol', 'diesel', 'uber', 'taxi', 'transport'],
    'shopping': ['clothing', 'apparel', 'fashion', 'shoes', 'accessories', 'mall'],
    'utilities': ['electricity', 'water', 'gas', 'internet', 'phone', 'utility'],
    'entertainment': ['movie', 'cinema', 'theater', 'concert', 'show', 'entertainment'],
    'healthcare': ['pharmacy', 'medical', 'doctor', 'hospital', 'clinic', 'medicine']
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword)) {
        return category;
      }
    }
  }

  return null;
};

const parseReceipt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Validate file type
  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({ message: 'Only image files are allowed.' });
  }

  const worker = await createWorker('eng');
  const filePath = path.resolve(req.file.path);

  try {
    const ret = await worker.recognize(filePath);
    const text = ret.data.text;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from the image. Please ensure the image is clear and readable.' });
    }
    
    const totalAmount = findTotal(text);
    const date = findDate(text);
    const description = findDescription(text);
    const category = findCategory(text);

    res.json({
      message: 'Receipt processed successfully',
      extractedText: text,
      parsedData: {
        amount: totalAmount,
        total: totalAmount,
        date: date,
        description: description,
        category: category,
        type: 'expense' // Default to expense for receipts
      }
    });

  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ 
      message: 'Failed to process receipt. Please ensure the image is clear and try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    try {
      await worker.terminate();
    } catch (workerError) {
      console.error('Error terminating worker:', workerError);
    }
    
    // Clean up the uploaded file
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up file:', cleanupError);
    }
  }
};

module.exports = { 
  parseReceipt, 
  findTotal, 
  findDate, 
  findDescription, 
  findCategory 
};