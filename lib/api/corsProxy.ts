import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/api';

export const corsProxy = async (
  path: string,
  method: string,
  data?: any,
  headers?: Record<string, string>
) => {
  try {
    // Extract query parameters if they exist in the path
    let url = `${API_BASE_URL}/${path}`;
    
    // Don't manipulate the URL if it's already properly formatted
    // This ensures we don't mess with query parameters that may be in the middle of a path
    
    const config: AxiosRequestConfig = {
      method,
      url,
      ...(data && { data }),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    // Forward the error response
    if (error.response) {
      throw {
        status: error.response.status,
        data: error.response.data,
      };
    }
    throw error;
  }
}; 