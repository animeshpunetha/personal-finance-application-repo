// backend/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { parseReceipt } = require('../controllers/ocrController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // The folder where files will be saved temporarily
  },
  filename(req, file, cb) {
    // Create a unique filename: fieldname-timestamp.extension
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Define the POST route for receipt uploads.
// The middleware chain runs in order:
// 1. `protect`: Checks for a valid JWT.
// 2. `upload.single('receiptImage')`: Handles the single file upload from a form field named 'receiptImage'.
// 3. `parseReceipt`: Our controller that runs after the file is successfully uploaded.
router.post('/receipt', protect, upload.single('receiptImage'), parseReceipt);

module.exports = router;