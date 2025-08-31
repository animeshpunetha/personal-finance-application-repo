# Personal Finance App

A full-stack personal finance management application with receipt OCR functionality.

## Features

### Core Features
- User authentication and authorization
- Dashboard with financial overview
- Transaction management (add, edit, delete)
- Category management
- Financial analytics and charts

### New: Receipt Upload & OCR
- **Receipt Image Upload**: Upload receipt images directly in the transaction form
- **Automatic Data Extraction**: OCR technology extracts key information from receipts
- **Smart Field Mapping**: Automatically fills transaction form fields with extracted data
- **User Review & Edit**: Users can review extracted data and make adjustments before saving

## Receipt Upload Workflow

1. **Open Add Transaction Form**: Click "Add Transaction" button
2. **Expand Receipt Upload Section**: Click on "Upload Receipt (Optional)" to expand the section
3. **Choose Image**: Click "Choose Image" to select a receipt photo
4. **Process Receipt**: Click "Process Receipt" to extract data using OCR
5. **Review & Edit**: Review the automatically filled fields and make any necessary adjustments
6. **Save Transaction**: Click "Add Transaction" to save the transaction

## What Gets Extracted

The OCR system attempts to extract:
- **Amount**: Total transaction amount
- **Date**: Transaction date from receipt
- **Description**: Business/store name
- **Category**: Suggested category based on receipt content
- **Type**: Defaults to "expense" for receipts

## Supported Image Formats

- JPEG/JPG
- PNG
- GIF
- BMP
- WebP

## Technical Details

### Backend
- **OCR Engine**: Tesseract.js for text extraction
- **File Upload**: Multer for handling multipart form data
- **Image Processing**: Automatic cleanup after processing
- **Error Handling**: Comprehensive error handling and user feedback

### Frontend
- **File Selection**: Drag-and-drop style file input
- **Progress Indicators**: Upload and processing status feedback
- **Form Integration**: Seamless integration with existing transaction form
- **Responsive Design**: Works on both desktop and mobile devices

## Installation & Setup

### Backend Dependencies
```bash
cd backend
npm install
```

Required packages:
- `tesseract.js` - OCR functionality
- `multer` - File upload handling
- `express` - Web framework
- `mongoose` - Database ORM

### Frontend Dependencies
```bash
cd frontend/personal-finance-app
npm install
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

### Running the Application
1. Start the backend: `cd backend && npm start`
2. Start the frontend: `cd frontend/personal-finance-app && npm start`
3. Open your browser to `http://localhost:3000`

## Usage Tips

### For Best OCR Results
- Ensure receipt images are clear and well-lit
- Avoid blurry or low-resolution images
- Make sure text is readable and not cut off
- Use high contrast images when possible

### Manual Override
- All extracted fields can be manually edited
- Users can change any field before saving
- Category suggestions can be overridden
- Amount and date can be corrected if needed

## Troubleshooting

### Common Issues
1. **OCR Not Working**: Check if the image is clear and readable
2. **Upload Fails**: Verify file size and format
3. **Authentication Errors**: Ensure user is logged in
4. **Server Errors**: Check backend logs for detailed error messages

### Performance Notes
- First OCR processing may take longer due to model loading
- Subsequent uploads are faster
- Large images are automatically optimized
- Temporary files are cleaned up after processing

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Improving OCR accuracy
- Enhancing the UI/UX
- Adding new receipt formats support

## License

This project is licensed under the ISC License.

