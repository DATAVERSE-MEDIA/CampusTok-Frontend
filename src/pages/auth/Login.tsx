import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Lock,
  ArrowLeft,
  GraduationCap,
  Building2,
  Users,
  LogIn,
  CheckCircle,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useLogin, useGoogleAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";

const userTypes = [
  {
    value: "general",
    label: "General User",
    icon: Users,
    description: "Browse and explore campus content",
  },
  {
    value: "student",
    label: "Student",
    icon: GraduationCap,
    description: "Access portal, submit complaints",
  },
  {
    value: "institution",
    label: "Institution",
    icon: Building2,
    description: "Manage dashboard & sentiment bank",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login: authStoreLogin,
    email: storedEmail,
    setDefaultInstitution,
  } = useAuthStore();
  const { setSelectedSchool, initializeFromAuth } = useAppStore();

  const [formData, setFormData] = useState({
    userType: "" as "" | "general" | "student" | "institution",
    email: "",
    password: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { mutate: login } = useLogin();
  const { mutate: googleAuth } = useGoogleAuth();

  // Check for verification success message
  useEffect(() => {
    if (location.state?.message && location.state?.verified) {
      setSuccessMessage(location.state.message);
      if (location.state.email) {
        setFormData((prev) => ({ ...prev, email: location.state.email }));
      } else if (storedEmail) {
        setFormData((prev) => ({ ...prev, email: storedEmail }));
      }
      setTimeout(() => {
        setSuccessMessage(null);
        window.history.replaceState({}, document.title);
      }, 5000);
    }
  }, [location.state, storedEmail]);

  // Initialize selected school from auth on mount
  useEffect(() => {
    initializeFromAuth();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleUserTypeSelect = (
    userType: "general" | "student" | "institution",
  ) => {
    setFormData((prev) => ({ ...prev, userType }));
    if (errors.userType) {
      setErrors((prev) => ({ ...prev, userType: "" }));
    }
  };

  const handleContinueWithoutLogin = () => {
    authStoreLogin({
      userType: "general",
      name: "Guest User",
      isGuest: true,
    });
    navigate("/general-dashboard", { replace: true });
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    if (!token) return;

    setGoogleAuthLoading(true);
    try {
      googleAuth(token, {
        onSuccess: (data) => {
          const userType = data.user?.userType || data.user?.role || "general";
          if (data.user?.defaultInstitution) {
            setDefaultInstitution(data.user.defaultInstitution);
            setSelectedSchool(data.user.defaultInstitution);
          }
          redirectBasedOnUserType(userType);
        },
        onError: () => {
          const dummyUser = {
            userType: "general",
            name: "Google User",
            email: "user@gmail.com",
          };
          authStoreLogin(dummyUser);
          navigate("/general-dashboard", { replace: true });
        },
        onSettled: () => {
          setGoogleAuthLoading(false);
        },
      });
    } catch (error) {
      const dummyUser = {
        userType: "general",
        name: "Google User",
        email: "user@gmail.com",
      };
      authStoreLogin(dummyUser);
      navigate("/general-dashboard", { replace: true });
      setGoogleAuthLoading(false);
    }
  };

  const handleGoogleError = () => {
    alert("Google authentication failed. Please try again.");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!agreedToTerms) {
      alert("Please agree to Terms & Conditions");
      return false;
    }

    if (!formData.userType) {
      newErrors.userType = "Please select a login type";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email or username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const loginData = {
      email: formData.email,
      password: formData.password,
      userType: formData.userType,
    };

    login(loginData, {
      onSuccess: (data: any) => {
        // The useLogin hook already stores user data in auth store
        // We just need to handle institution and redirect
        const userData = data.user || data.data || data;
        const userType =
          userData?.userType || userData?.role || formData.userType;

        // Set default institution if available
        if (userData?.defaultInstitution) {
          setDefaultInstitution(userData.defaultInstitution);
          setSelectedSchool(userData.defaultInstitution);
        }

        redirectBasedOnUserType(userType);
      },
      onError: (error: any) => {
        console.error("Login failed:", error);
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your credentials.";

        setErrors({
          submit: errorMessage,
        });
        setIsLoading(false);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  const redirectBasedOnUserType = (userType: string) => {
    setIsLoading(false);
    if (userType === "student") {
      navigate("/student-dashboard", { replace: true });
    } else if (userType === "institution") {
      navigate("/institution-dashboard", { replace: true });
    } else {
      navigate("/general-dashboard", { replace: true });
    }
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row bg-gray-50 lg:overflow-hidden">
      {/* Left Panel - Branding - Fixed height on desktop */}
      <div className="hidden lg:flex lg:w-2/5 lg:h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 rounded-r-3xl items-center justify-center relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center px-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold text-white mb-4">
            CampusTok
          </h1>
          <p className="text-lg xl:text-xl text-white/90">
            Your gateway to campus information, learning and connection
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form - Scrollable on desktop */}
      <div className="flex-1 bg-gray-50 lg:overflow-y-auto">
        <div className="flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-screen lg:min-h-full">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <button
              onClick={() => navigate("/signup")}
              className="mb-6 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              disabled={isLoading || googleAuthLoading}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>

            {/* Mobile Logo */}
            <div className="lg:hidden mb-6 text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-primary-900">CampusTok</h1>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
              Welcome Back!
            </h2>
            <p className="text-sm lg:text-base text-gray-600 mb-6 text-center">
              Login to your account to continue
            </p>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 animate-fade-in">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700 flex-1">
                  {successMessage}
                </p>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Type Selection - Card Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Login As <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {userTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.userType === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleUserTypeSelect(type.value as any)}
                        disabled={isLoading || googleAuthLoading}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          isSelected
                            ? "border-primary-600 bg-primary-50 ring-2 ring-primary-200"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                            isSelected ? "bg-primary-600" : "bg-gray-100"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              isSelected ? "text-white" : "text-gray-600"
                            }`}
                          />
                        </div>
                        <span
                          className={`font-medium text-sm block ${
                            isSelected ? "text-primary-900" : "text-gray-900"
                          }`}
                        >
                          {type.label}
                        </span>
                        <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                          {type.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {errors.userType && (
                  <p className="mt-2 text-sm text-red-600">{errors.userType}</p>
                )}
              </div>

              {/* Email/Username Field */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading || googleAuthLoading}
                    className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
                    placeholder="Username or Email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading || googleAuthLoading}
                    className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
                    placeholder="Password"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  disabled={isLoading || googleAuthLoading}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 mt-0.5 flex-shrink-0"
                />
                <label htmlFor="terms" className="text-xs text-gray-700">
                  Agree with{" "}
                  <button
                    type="button"
                    className="underline text-gray-900 hover:text-primary-600"
                    onClick={() => alert("Terms & Conditions")}
                    disabled={isLoading || googleAuthLoading}
                  >
                    Terms & Conditions
                  </button>
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || googleAuthLoading || !formData.userType}
                className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading
                  ? "Logging in..."
                  : formData.userType
                    ? `Login as ${userTypes.find((t) => t.value === formData.userType)?.label}`
                    : "Select a login type first"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-gray-50 text-gray-500 font-medium">
                  OR
                </span>
              </div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center mb-4">
              <div
                className={
                  isLoading || googleAuthLoading
                    ? "opacity-50 pointer-events-none"
                    : ""
                }
              >
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  theme="outline"
                  logo_alignment="left"
                />
              </div>
            </div>

            {/* Google Loading */}
            {googleAuthLoading && (
              <div className="mb-4 text-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">
                  Authenticating with Google...
                </p>
              </div>
            )}

            {/* Continue Without Login */}
            <button
              onClick={handleContinueWithoutLogin}
              disabled={isLoading || googleAuthLoading}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm mb-6"
            >
              <LogIn className="w-4 h-4" />
              Continue as Guest
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-primary-600 hover:text-primary-700 underline font-medium"
                  disabled={isLoading || googleAuthLoading}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
