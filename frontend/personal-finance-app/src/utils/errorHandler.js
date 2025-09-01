// src/utils/errorHandler.js
import { toast } from 'react-hot-toast';

// Enhanced error classification and handling
export class EnhancedErrorHandler {
  // Classify errors based on HTTP status codes and error messages
  static classifyError(error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || '';
    const originalError = error;

    return {
      status,
      message,
      originalError,
      type: this.getErrorType(status, message),
      userFriendlyMessage: this.getUserFriendlyMessage(status, message),
      shouldRetry: this.shouldRetry(status),
      requiresAuth: this.requiresAuthentication(status)
    };
  }

  // Determine error type for better handling
  static getErrorType(status, message) {
    if (status === 400) {
      if (message.includes('required fields') || message.includes('provide')) {
        return 'VALIDATION_ERROR';
      }
      if (message.includes('file') || message.includes('image')) {
        return 'FILE_ERROR';
      }
      return 'BAD_REQUEST';
    }
    
    if (status === 401) {
      if (message.includes('token')) {
        return 'TOKEN_ERROR';
      }
      if (message.includes('password') || message.includes('email')) {
        return 'CREDENTIALS_ERROR';
      }
      return 'AUTH_ERROR';
    }
    
    if (status === 403) return 'FORBIDDEN';
    if (status === 404) return 'NOT_FOUND';
    if (status === 409) return 'CONFLICT';
    if (status >= 500) return 'SERVER_ERROR';
    
    return 'UNKNOWN_ERROR';
  }

  // Get user-friendly error messages
  static getUserFriendlyMessage(status, message) {
    const lowerMessage = message.toLowerCase();
    
    // Validation errors
    if (status === 400) {
      if (lowerMessage.includes('required fields')) {
        return 'Please fill in all required fields';
      }
      if (lowerMessage.includes('provide')) {
        return 'Please provide all necessary information';
      }
      if (lowerMessage.includes('file uploaded')) {
        return 'Please select a file to upload';
      }
      if (lowerMessage.includes('image files')) {
        return 'Please select a valid image file (JPEG, PNG, etc.)';
      }
      if (lowerMessage.includes('extract text')) {
        return 'The image is not clear enough. Please try a clearer image.';
      }
    }

    // Authentication errors
    if (status === 401) {
      if (lowerMessage.includes('token failed')) {
        return 'Your session has expired. Please login again.';
      }
      if (lowerMessage.includes('no token')) {
        return 'Please login to continue';
      }
      if (lowerMessage.includes('invalid email') || lowerMessage.includes('invalid password')) {
        return 'Invalid email or password. Please check your credentials.';
      }
      if (lowerMessage.includes('not authorized')) {
        return 'You are not authorized to perform this action';
      }
    }

    // Not found errors
    if (status === 404) {
      if (lowerMessage.includes('transaction not found')) {
        return 'The transaction you are looking for was not found';
      }
      if (lowerMessage.includes('user not found')) {
        return 'User profile not found';
      }
      if (lowerMessage.includes('category not found')) {
        return 'The category you are looking for was not found';
      }
      return 'The requested resource was not found';
    }

    // Conflict errors
    if (status === 409) {
      if (lowerMessage.includes('user already exists')) {
        return 'An account with this email already exists. Please login instead.';
      }
      if (lowerMessage.includes('category already exists')) {
        return 'A category with this name already exists';
      }
    }

    // Server errors
    if (status >= 500) {
      return 'A server error occurred. Please try again later.';
    }

    // Default fallback
    return message || 'An unexpected error occurred';
  }

  // Determine if the error should trigger a retry
  static shouldRetry(status) {
    return status >= 500 || status === 429; // Server errors or rate limiting
  }

  // Determine if the error requires re-authentication
  static requiresAuthentication(status) {
    return status === 401;
  }

  // Handle authentication errors specifically
  static handleAuthError(error, navigate) {
    const classifiedError = this.classifyError(error);
    
    if (classifiedError.requiresAuth) {
      // Clear user data and redirect to login
      localStorage.removeItem('userInfo');
      toast.error(classifiedError.userFriendlyMessage);
      navigate('/login');
      return true; // Indicates auth error was handled
    }
    
    return false;
  }

  // Handle file upload errors specifically
  static handleFileError(error) {
    const classifiedError = this.classifyError(error);
    
    if (classifiedError.type === 'FILE_ERROR') {
      toast.error(classifiedError.userFriendlyMessage);
      return true; // Indicates file error was handled
    }
    
    return false;
  }

  // Handle OCR processing errors specifically
  static handleOCRError(error) {
    const classifiedError = this.classifyError(error);
    
    if (classifiedError.type === 'FILE_ERROR' || classifiedError.type === 'VALIDATION_ERROR') {
      toast.error(classifiedError.userFriendlyMessage);
      return true; // Indicates OCR error was handled
    }
    
    return false;
  }

  // Generic error handler with toast notification
  static handleError(error, options = {}) {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = 'An error occurred',
      context = 'Unknown'
    } = options;

    const classifiedError = this.classifyError(error);
    
    // Log error for debugging
    if (logError) {
      console.error(`[${context}] Error:`, {
        status: classifiedError.status,
        message: classifiedError.message,
        type: classifiedError.type,
        originalError: classifiedError.originalError
      });
    }

    // Show toast notification
    if (showToast) {
      toast.error(classifiedError.userFriendlyMessage);
    }

    return classifiedError;
  }

  // Handle network errors specifically
  static handleNetworkError(error) {
    if (!error.response) {
      // Network error (no response from server)
      toast.error('Network error. Please check your internet connection.');
      return {
        type: 'NETWORK_ERROR',
        userFriendlyMessage: 'Network error. Please check your internet connection.',
        shouldRetry: true
      };
    }
    
    return null; // Not a network error
  }

  // Handle form validation errors
  static handleValidationError(errors) {
    if (typeof errors === 'object' && errors !== null) {
      const errorMessages = Object.values(errors).filter(Boolean);
      if (errorMessages.length > 0) {
        toast.error(errorMessages[0]); // Show first error
        return errorMessages;
      }
    }
    return [];
  }
}

// Convenience functions for common error handling scenarios
export const handleTransactionError = (error) => {
  return EnhancedErrorHandler.handleError(error, {
    context: 'Transaction',
    fallbackMessage: 'Failed to process transaction'
  });
};

export const handleAuthError = (error, navigate) => {
  return EnhancedErrorHandler.handleAuthError(error, navigate);
};

export const handleFileError = (error) => {
  return EnhancedErrorHandler.handleFileError(error);
};

export const handleOCRError = (error) => {
  return EnhancedErrorHandler.handleOCRError(error);
};

export const handleNetworkError = (error) => {
  return EnhancedErrorHandler.handleNetworkError(error);
};

export default EnhancedErrorHandler;
