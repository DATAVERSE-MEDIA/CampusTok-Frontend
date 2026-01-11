// api/index.ts
import axios from 'axios'

const env = (import.meta as any).env
const API_BASE_URL = env?.VITE_API_URL || 'https://talk-lgsa.onrender.com/api/v1'

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
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
    // Don't intercept 401 for login endpoint - let it be handled in authApi.login
    if (error.config?.url?.includes('/auth/login')) {
      return Promise.reject(error)
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login for other endpoints
      // You might want to clear auth state here
      localStorage.removeItem('auth_token')
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authApi = {
  login: (credentials: { email: string; password: string; userType?: string }) => {
    // If endpoint doesn't support userType, we'll handle it gracefully
    return apiClient.post('/auth/login', credentials)
    //  .catch((error) => {
    //   // For testing: return dummy response if endpoint doesn't exist or returns 401/400
    //   if (error.response?.status === 404 || error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
    //     console.log('Using dummy login response for testing (status:', error.response?.status || 'network error', ')')
    //     // Return a successful response for testing purposes
    //     return Promise.resolve({
    //       data: {
    //         user: {
    //           id: Date.now().toString(),
    //           email: credentials.email,
    //           name: credentials.email.split('@')[0],
    //           userType: credentials.userType || 'general',
    //           role: credentials.userType || 'general',
    //           // Add default student/institution data for testing
    //           school: credentials.userType === 'student' ? 'University of Lagos' : null,
    //           department: credentials.userType === 'student' ? 'Civil Engineering' : null
    //         },
    //         token: 'dummy-token-' + Date.now()
    //       }
    //     })
    //   }
    //   throw error
    // })
  },
  
  register: (userData: {full_name:string, email: string; password: string; role?: string }) => {
    return apiClient.post('/auth/register', userData)
    
    // .catch((error: any) => {
    //   // For testing: return dummy response if endpoint doesn't exist or returns error
    //   if (error.response?.status === 404 || error.response?.status === 400 || error.code === 'ERR_NETWORK') {
    //     console.log('Using dummy registration response for testing')
    //     // Return a successful response matching axios response structure
    //     return Promise.resolve({
    //       data: {
    //         status: true,
    //         message: "User created successfully, Please check your mail to verify your email address.",
    //         data: {
    //           id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    //           full_name: userData.full_name,
    //           email: userData.email,
    //           role: userData.role || "general",
    //           verification_token: Math.floor(1000 + Math.random() * 9000).toString(),
    //           is_onboarding_completed: false,
    //           profile_picture: null,
    //           is_verified: false,
    //           created_at: new Date().toISOString(),
    //           updated_at: new Date().toISOString()
    //         }
    //       },
    //       status: 200,
    //       statusText: 'OK',
    //       headers: {},
    //       config: {}
    //     } as any)
    //   }
    //   throw error
    // })
  },
  
  verifyEmail: (token: string) => {
    // Handle verify email with token as query param
    return apiClient.post(`/auth/verify-email?token=${encodeURIComponent(token)}`)
    
    // .catch((error: any) => {
    //   // For testing: return dummy response if endpoint doesn't exist
    //   if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
    //     const testTokens = ['1234', '0000', '1111', '9999']
    //     if (testTokens.includes(token)) {
    //       return Promise.resolve({
    //         data: {
    //           status: true,
    //           message: "Email verified successfully",
    //           data: {
    //             verified: true,
    //             token: 'dummy-verified-token-' + Date.now()
    //           }
    //         }
    //       })
    //     } else {
    //       return Promise.reject({
    //         response: {
    //           data: {
    //             message: 'Invalid verification code. Try 1234, 0000, 1111, or 9999 for testing.'
    //           },
    //           status: 400
    //         },
    //         message: 'Invalid verification code'
    //       })
    //     }
    //   }
    //   throw error
    // })
  },
  
  logout: () => apiClient.post('/auth/logout'),
  
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { token, newPassword }),
  
  getProfile: () => apiClient.get('/auth/users/me'),
  
  updateProfile: (profileData: any) =>
    apiClient.put('/auth/profile', profileData),

  resendVerification:(data : any)=>
    apiClient.post('/auth/resend-verification-token', { email: data.email }),

  googleAuth:(code:any)=>
    apiClient.post('/auth/google-token', { code }).then(res => res.data),
}

export const schoolApi = {
  getAllSchools: () => apiClient.get('/auth/institutions'),
  
  getSchoolById: (id: string | number) => apiClient.get(`/institutions/${id}`),
  
  searchSchools: (query: string) =>
    apiClient.get('/institutions/search', { params: { q: query } }),
  
  createSchool: (schoolData: any) => apiClient.post('/institutions', schoolData),
  
  updateSchool: (id: string | number, schoolData: any) =>
    apiClient.put(`/institutions/${id}`, schoolData),
  
  deleteSchool: (id: string | number) => apiClient.delete(`/institutions/${id}`),

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
    const url = queryString ? `/institutions?${queryString}` : '/institutions';
    
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