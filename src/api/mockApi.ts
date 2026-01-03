// api/mockAuthApi.ts
export const mockAuthApi = {
  register: (userData: {full_name:string, email: string; password: string; role?: string }) => {
    return Promise.resolve({
      data: {
        status: true,
        message: "User created successfully, Please check your mail to verify your email address.",
        data: {
          id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          full_name: userData.full_name,
          email: userData.email,
          role: userData.role || "general",
          verification_token: Math.floor(1000 + Math.random() * 9000).toString(), // Random 4-digit code
          is_onboarding_completed: false,
          profile_picture: null,
          is_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    });
  },
};
