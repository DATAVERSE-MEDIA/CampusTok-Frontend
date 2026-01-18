// hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, authApi } from "../api";
import { mockAuthApi } from "../api/mockApi";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

// Auth keys for query cache
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

// Authentication hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (credentials: {
      email: string;
      password: string;
      userType?: string;
    }) => authApi.login(credentials).then((res) => res.data),
    onSuccess: (response, variables) => {
      // API returns { status, message, data } where data contains user + token info
      // The actual user data is in response.data (the nested data field)
      const apiData = response.data || response;

      console.log("Login response:", response);
      console.log("API data extracted:", apiData);

      // Build user object from the response
      const userData = {
        id: apiData?.id,
        full_name: apiData?.full_name,
        email: apiData?.email,
        profile_picture: apiData?.profile_picture,
        userType: apiData?.role || variables.userType || "general",
        role: apiData?.role || variables.userType || "general",
        is_verified: apiData?.is_verified,
        is_onboarding_completed: apiData?.is_onboarding_completed,
        isAuthenticated: true,
      };

      console.log("User data to store:", userData);
      loginStore(userData);

      // Save token - check multiple possible locations
      const token = response.token || apiData?.token || response.access_token;
      if (token) {
        localStorage.setItem("auth_token", token);
      }

      // Invalidate user profile query
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error: any) => {
      console.error("Login mutation error:", error);
    },
  });
};

export const useRegister = () => {
  const signupStore = useAuthStore((state) => state.signup);

  return useMutation({
    mutationFn: (userData: {
      full_name: string;
      email: string;
      password: string;
      role?: string;
    }) => authApi.register(userData).then((res) => res.data),
    onSuccess: (data: any) => {
      console.log("Registration response:", data);
      // Extract email from response (could be in data.email, data.data.email, or use the request email)
      const email = data?.data?.email || data?.email || data?.user?.email;
      if (email) {
        signupStore(email);
      } else {
        // Fallback: use email from the request (this is handled in the component)
        console.warn(
          "Email not found in registration response, will use request email",
        );
      }
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      // The API layer already handles dummy responses, so if we get here,
      // it's a real error that should be displayed
      throw error;
    },
  });
};

export const useVerifyEmail = () => {
  const verifyEmailStore = useAuthStore((state) => state.verifyEmail);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string | { token: string }) => {
      // Handle both string and object parameter formats
      const verificationToken = typeof token === "string" ? token : token.token;

      return authApi
        .verifyEmail(verificationToken)
        .then((res) => res.data)
        .catch((error: any) => {
          // For testing: return dummy success response if endpoint doesn't exist
          if (error.response?.status === 404 || error.code === "ERR_NETWORK") {
            // Check if token matches a test token (for testing purposes)
            const testTokens = ["1234", "0000", "1111", "9999"];
            if (testTokens.includes(verificationToken)) {
              return Promise.resolve({
                status: true,
                message: "Email verified successfully",
                data: {
                  verified: true,
                  token: "dummy-verified-token-" + Date.now(),
                },
              });
            } else {
              // Return error for invalid test token
              return Promise.reject(
                new Error(
                  "Invalid verification code. Try 1234, 0000, 1111, or 9999 for testing.",
                ),
              );
            }
          }
          throw error;
        });
    },
    onSuccess: (data: any) => {
      // Mark email as verified
      verifyEmailStore();

      // Save token if provided
      if (data?.data?.token || data?.token) {
        localStorage.setItem("auth_token", data?.data?.token || data?.token);
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
};

export const useLogout = () => {
  const logoutStore = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout().then((res) => res.data),
    onSuccess: () => {
      logoutStore();
      localStorage.removeItem("auth_token");
      queryClient.clear(); // Clear all queries on logout
    },
  });
};

export const useProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authApi.getProfile().then((res) => res.data),
    enabled: isAuthenticated, // Only fetch if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Custom hook to sync profile with Zustand
export const useProfileWithSync = () => {
  const { user, setUser } = useAuthStore();
  const query = useProfile();

  useEffect(() => {
    if (query.data && query.isSuccess && !user) {
      setUser(query.data);
    }
  }, [query.data, query.isSuccess, user, setUser]);

  return query;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: any) =>
      authApi.updateProfile(profileData).then((res) => res.data),
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(authKeys.profile(), data);
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) =>
      authApi.forgotPassword(email).then((res) => res.data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => authApi.resetPassword(token, newPassword).then((res) => res.data),
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      authApi.resendVerification(data).then((res) => res.data),
  });
};

// hooks/useAuth.ts - Add this hook
export const useGoogleAuth = () => {
  const queryClient = useQueryClient();
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (code: string) =>
      authApi.googleAuth(code).then((res) => res.data),
    onSuccess: (data) => {
      // Update Zustand store
      loginStore(data.user);

      // Save token if provided
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      // Invalidate user profile query
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });

      return data;
    },
    onError: (error) => {
      console.error("Google authentication failed:", error);
      console.error("Error details:", {
        message: error.message,
        // response: error.response?.data,
        // status: error.response?.status,
        // url: error.config?.url,
      });
      throw error;
    },
  });
};
