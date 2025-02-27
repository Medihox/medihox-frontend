import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/api';

export const corsProxy = async (
  path: string,
  method: string,
  data?: any,
  headers?: Record<string, string>
) => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url: `${API_BASE_URL}/${path}`,
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