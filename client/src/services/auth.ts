import { api } from './api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  cards?: Card[];
}

interface AuthResponse {
  user: User;
  token: string;
}

// Define the error response type
interface ErrorResponse {
  message?: string;
  error?: string;
  [key: string]: any;  // Allow for other properties
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<{ userId: string }> {
    try {
      console.log('Attempting registration with data:', data);
      
      // Basic client-side validation
      if (!data.email || !data.password || !data.name) {
        throw new Error('Please fill in all required fields');
      }
      
      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const response = await api.post<{ userId: string } | ErrorResponse | string>(
        '/register',
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          },
          // Don't throw for 500 errors so we can handle them properly
          validateStatus: (status) => status < 600 
        }
      ) as { data: { userId: string } | ErrorResponse | string; status: number; statusText: string; headers: any };
      
      console.log('Registration response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });
      
      // Handle different status codes
      if (response.status >= 400) {
        let errorMessage = 'Registration failed';
        
        // Try to extract error message from response
        if (response.data) {
          if (typeof response.data === 'string') {
            errorMessage = response.data;
          } else if (typeof response.data === 'object' && response.data !== null) {
            const errorData = response.data as ErrorResponse;
            if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            }
          }
        }
        
        // Add status code to error message if available
        if (response.status) {
          errorMessage += ` (Status: ${response.status})`;
        }
        
        throw new Error(errorMessage);
      }
      
      // If we get here, registration was successful
      if (typeof response.data === 'object' && response.data !== null && 'userId' in response.data) {
        return { userId: (response.data as { userId: string }).userId };
      }
      throw new Error('Invalid response format from server');
    } catch (error: unknown) {
      // Handle different types of errors
      if (error instanceof Error) {
        const axiosError = error as any;
        console.error('Registration error:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          response: axiosError.response?.data
        });
        
        // Re-throw with a more user-friendly message
        const errorMessage = axiosError.response?.data?.message || 
                           error.message || 
                           'Registration failed. Please try again later.';
        throw new Error(errorMessage);
      } else if (typeof error === 'string') {
        console.error('Registration error:', error);
        throw new Error(error);
      } else {
        console.error('Unknown registration error occurred:', error);
        throw new Error('An unknown error occurred during registration');
      }
    }
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/me');
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('auth');
  },
};

export interface Card {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}
