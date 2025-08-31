// backend/controllers/ocrController.js
const { createWorker } = require('tesseract.js');
const path = require('path');
const fs = require('fs');

const findTotal = (text) => {
  const lines = text.split('\n');
  
  // --- THIS REGEX IS NOW CORRECTED ---
  // The keywords are now grouped inside (?: ... ) so the number-capturing part applies to all of them.
  const regex = /(?:(?<!sub)total|amount due|balance|debit|grand total)[\s:]*([\$€₹]?\s?\d{1,6}[,.]\d{2})/i;

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    const match = line.match(regex);
    
    if (match && match[1]) {
      return parseFloat(match[1].replace(/[^0-9.]/g, ''));
    }
  }

  return null;
};

const parseReceipt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const worker = await createWorker('eng');
  const filePath = path.resolve(req.file.path);

  try {
    const ret = await worker.recognize(filePath);
    const text = ret.data.text;
    
    const totalAmount = findTotal(text);

    res.json({
      message: 'Receipt processed successfully',
      extractedText: text,
      parsedData: {
        total: totalAmount,
      }
    });

  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ message: 'Failed to process receipt.' });
  } finally {
    await worker.terminate();
    fs.unlinkSync(filePath);
  }
};

module.exports = { parseReceipt };