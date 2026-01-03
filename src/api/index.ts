// api/index.ts
import axios from 'axios'

const env = (import.meta as any).env
const API_BASE_URL = env?.VITE_API_URL || 'https://talk-lgsa.onrender.com/api/v1'

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') // Or AsyncStorage for React Native
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      // You might want to clear auth state here
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),
  
  register: (userData: {full_name:string, email: string; password: string; role?: string }) => 
     apiClient.post('/auth/register', userData),
  
  verifyEmail: (token: string) =>
    apiClient.post('/auth/verify-email', { token }),
  
  logout: () => apiClient.post('/auth/logout'),
  
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { token, newPassword }),
  
  getProfile: () => apiClient.get('/auth/profile'),
  
  updateProfile: (profileData: any) =>
    apiClient.put('/auth/profile', profileData),

  resendVerification:(data : any)=>
    apiClient.post('/auth/resend-verification-token', { email: data.email }),
}

export const schoolApi = {
  getAllSchools: () => apiClient.get('/schools'),
  
  getSchoolById: (id: string | number) => apiClient.get(`/schools/${id}`),
  
  searchSchools: (query: string) =>
    apiClient.get('/schools/search', { params: { q: query } }),
  
  createSchool: (schoolData: any) => apiClient.post('/schools', schoolData),
  
  updateSchool: (id: string | number, schoolData: any) =>
    apiClient.put(`/schools/${id}`, schoolData),
  
  deleteSchool: (id: string | number) => apiClient.delete(`/schools/${id}`),

  getSchoolsPaginated: (params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, any>;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    // Add filters if provided
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/schools?${queryString}` : '/schools';
    
    return apiClient.get(url);
  },
}

export const notificationApi = {
  getNotifications: () => apiClient.get('/notifications'),
  
  markAsRead: (notificationId: string) =>
    apiClient.put(`/notifications/${notificationId}/read`),
  
  deleteNotification: (notificationId: string) =>
    apiClient.delete(`/notifications/${notificationId}`),
}

export const messageApi = {
  getMessages: () => apiClient.get('/messages'),
  
  getConversation: (userId: string) =>
    apiClient.get(`/messages/conversation/${userId}`),
  
  sendMessage: (messageData: { to: string; content: string }) =>
    apiClient.post('/messages', messageData),
  
  markAsRead: (messageId: string) =>
    apiClient.put(`/messages/${messageId}/read`),
}