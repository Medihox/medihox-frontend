import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export interface ApiError {
  status: number | string;
  data: any;
};

export const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return typeof error === 'object' && error != null && 'status' in error;
};

export const isSerializedError = (
  error: unknown
): error is SerializedError => {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    'name' in error
  );
};

export const getErrorMessage = (error: any): string => {
  // Handle string errors directly
  if (typeof error === 'string') return error;
  
  // Handle RTK Query error objects
  if (isFetchBaseQueryError(error)) {
    // Handle error response with data
    if (error.data) {
      if (typeof error.data === 'string') return error.data;
      
      // Use type assertion for data object
      const data = error.data as Record<string, any>;
      
      // Extract nested error messages
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.detail) return data.detail;
      
      // Extract validation errors if available
      if (data.errors) {
        if (Array.isArray(data.errors)) {
          return data.errors.join(', ');
        } else if (typeof data.errors === 'object') {
          // Convert validation error object to string
          return Object.entries(data.errors as Record<string, string>)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
        }
      }
    }
    
    // Handle HTTP error statuses
    const status = error.status;
    if (status === 'FETCH_ERROR') return 'Network error. Please check your connection.';
    if (status === 'PARSING_ERROR') return 'Failed to parse server response.';
    if (status === 'TIMEOUT_ERROR') return 'Request timed out. Please try again.';
    if (status === 'CUSTOM_ERROR') return error.error || 'An error occurred.';
    
    // Status code based messages
    if (status === 401) return 'Authentication failed. Please login again.';
    if (status === 403) return 'You do not have permission to perform this action.';
    if (status === 404) return 'The requested resource was not found.';
    if (status === 500) return 'Server error. Please try again later.';
  }
  
  // Handle serialized errors
  if (isSerializedError(error)) {
    return error.message || 'An error occurred';
  }
  
  // Check for common error properties in any object
  const err = error as Record<string, any>;
  if (err.error) return err.error;
  if (err.message) return err.message;
  if (err.statusText) return err.statusText;
  
  // For any nested error objects
  if (err.data?.error) return err.data.error;
  if (err.data?.message) return err.data.message;
  
  // Stringify the error if possible
  try {
    if (typeof error === 'object' && error !== null) {
      return JSON.stringify(error);
    }
  } catch (e) {
    // Fallback for circular references
  }
  
  return 'An unexpected error occurred. Please try again.';
}; 
