# Personal Finance App

A full-stack personal finance management application with receipt OCR functionality.

## Features

### Core Features
- User authentication and authorization.
- Dashboard with financial overview.
- Transaction management (add, edit, delete) with custom date range filter.
- Category management API endpoint.
- Financial analytics and charts.
- Support for pagination of the list api
- Supporting multiple users who can use the web app

## Features

### **Authentication & Security**
- User registration and login with JWT tokens
- Secure password hashing with bcrypt
- Protected routes and middleware
- Session management

### **Financial Management**
- **Income & Expense Tracking**: Categorize and record all financial transactions
- **Smart Categories**: Pre-defined categories with custom category creation
- **Date Filtering**: Filter transactions by date ranges
- **Real-time Updates**: Instant updates across all components

### **Receipt Processing (OCR)**
- **Image Upload**: Support for JPG, PNG, GIF formats
- **Intelligent Text Extraction**: Uses Tesseract.js for OCR processing
- **Auto-Parsing**: Automatically extracts:
  - Total amount
  - Transaction date
  - Store/merchant name
  - Suggested category
- **Form Auto-fill**: Automatically populates transaction forms with extracted data

### **Dashboard & Analytics**
- **Financial Overview**: Income vs. expenses summary
- **Category Breakdown**: Visual representation of spending patterns
- **Interactive Charts**: Built with Chart.js and Recharts
- **Responsive Design**: Works seamlessly on all devices

### **Transaction Management**
- **CRUD Operations**: Create, read, update, and delete transactions
- **Pagination**: Server-side pagination for efficient data loading (10 records per page)
- **Search & Filter**: Advanced filtering capabilities
- **Bulk Operations**: Manage multiple transactions efficiently

### Receipt Upload & OCR : Detailed
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

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-finance-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your configuration
   
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend/personal-finance-app
   npm install
   npm start
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - The application will automatically create necessary collections


### Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=your_mongodb_connection_string
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

## **Architecture**

### **Frontend (React)**
- **React 18** with modern hooks and functional components
- **Tailwind CSS** for responsive and beautiful UI
- **React Router** for client-side navigation
- **Axios** for HTTP requests
- **Context API** for state management
- **Error Boundaries** for robust error handling

### **Backend (Node.js)**
- **Express.js** REST API
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Multer** for file uploads
- **Tesseract.js** for OCR processing
- **Server-side pagination** for optimal performance

## Troubleshooting

### Common Issues
1. **OCR Not Working**: Check if the image is clear and readable
2. **Upload Fails**: Verify file size and format
3. **Authentication Errors**: Ensure user is logged in
4. **Server Errors**: Check backend logs for detailed error messages

## 🎯 **Key Features Explained**

### **Server-Side Pagination**
The application implements efficient server-side pagination:
- **Backend**: Uses MongoDB's `limit()` and `skip()` for optimal database queries
- **Frontend**: Only loads 10 records at a time, reducing memory usage
- **Performance**: Scales efficiently even with thousands of transactions

### **OCR Receipt Processing**
- **Image Upload**: Users can upload receipt images
- **Text Extraction**: Tesseract.js extracts text from images
- **Smart Parsing**: Algorithms identify amounts, dates, and merchant names
- **Auto-Categorization**: Suggests categories based on extracted text
- **Form Integration**: Automatically fills transaction forms

### **Error Handling**
- **Frontend**: Comprehensive error boundaries and user-friendly error messages
- **Backend**: Structured error responses with appropriate HTTP status codes
- **Validation**: Input validation on both client and server sides

### Performance Notes
- First OCR processing may take longer due to model loading
- Subsequent uploads are faster
- Large images are automatically optimized
- Temporary files are cleaned up after processing



## License

This project is belongs to Animesh Punetha - NIT Durgapur

