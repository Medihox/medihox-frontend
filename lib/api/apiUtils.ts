import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export interface ApiError {
  status: number | string;
  data: any;
}

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
  if (typeof error === 'string') return error;
  
  if (error.data?.message) return error.data.message;
  if (error.error) return error.error;
  if (error.message) return error.message;
  
  return 'An unknown error occurred';
}; 