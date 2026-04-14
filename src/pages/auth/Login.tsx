import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Lock,
  ArrowLeft,
  GraduationCap,
  Building2,
  Users,
  LogIn,
  CheckCircle,
  Mail,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import {
  useLogin,
  useGoogleAuth,
  useForgotPassword,
} from "../../hooks/useAuth";
import { useAuthStore } from "../../store/useAuthStore";
import {
  clearStoredPostLoginAction,
  clearStoredPostLoginRedirect,
  resolvePostLoginAction,
  resolvePostLoginRedirect,
  sanitizePostLoginAction,
  sanitizePostLoginRedirect,
  storePostLoginAction,
  storePostLoginRedirect,
} from "../../utils/postLoginRedirect";

const userTypes = [
  {
    value: "general",
    label: "General User",
    icon: Users,
    description: "For general platform access",
  },
  {
    value: "student",
    label: "Student",
    icon: GraduationCap,
    description: "Login as a student",
  },
  {
    value: "institution",
    label: "Institution",
    icon: Building2,
    description: "Login as an institution",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authStoreLogin } = useAuthStore();
  const requestedRedirect = sanitizePostLoginRedirect(location.state?.from);
  const requestedPostLoginAction = sanitizePostLoginAction(
    location.state?.postLoginAction,
  );

  const [activeTab, setActiveTab] = useState<
    "general" | "student" | "institution"
  >("general");

  const [studentForm, setStudentForm] = useState({
    email: "",
    password: "",
  });

  const [institutionForm, setInstitutionForm] = useState({
    email: "",
    password: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check for verification success message
  useEffect(() => {
    if (location.state?.message && location.state?.verified) {
      setSuccessMessage(location.state.message);
      setTimeout(() => {
        setSuccessMessage(null);
        window.history.replaceState({}, document.title);
      }, 5000);
    }
  }, [location.state]);

  useEffect(() => {
    if (requestedRedirect) {
      storePostLoginRedirect(requestedRedirect);
    } else {
      clearStoredPostLoginRedirect();
    }
  }, [requestedRedirect]);

  useEffect(() => {
    if (requestedPostLoginAction) {
      storePostLoginAction(requestedPostLoginAction);
    } else {
      clearStoredPostLoginAction();
    }
  }, [requestedPostLoginAction]);

  useEffect(() => {
    if (activeTab === "general") {
      setForgotPasswordMode(false);
    }
  }, [activeTab]);

  const { mutate: login } = useLogin();
  const { mutate: googleAuth } = useGoogleAuth();
  const { mutate: forgotPassword, isPending: isForgotPasswordPending } =
    useForgotPassword();

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const handleContinueWithoutLogin = () => {
    authStoreLogin({
      userType: "general",
      name: "Guest User",
      full_name: "Guest User",
      isGuest: true,
    });
    clearStoredPostLoginAction();
    clearStoredPostLoginRedirect();
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
          redirectBasedOnUserType(userType);
        },
        onError: () => {
          const dummyUser = {
            userType: "general",
            name: "Google User",
            email: "user@gmail.com",
          };
          authStoreLogin(dummyUser);
          redirectBasedOnUserType("general");
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
      redirectBasedOnUserType("general");
      setGoogleAuthLoading(false);
    }
  };

  const handleGoogleError = () => {
    alert("Google authentication failed. Please try again.");
  };

  const handleStudentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleInstitutionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setInstitutionForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const getActiveEmail = () => {
    if (activeTab === "student") {
      return studentForm.email.trim();
    }

    if (activeTab === "institution") {
      return institutionForm.email.trim();
    }

    return "";
  };

  const handleForgotPassword = () => {
    const email = getActiveEmail();

    setForgotPasswordMode(true);

    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: "Enter your email to reset your password",
      }));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email",
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      email: "",
      submit: "",
    }));

    forgotPassword(email, {
      onSuccess: (response: any) => {
        setSuccessMessage(
          response?.message ||
            "A password reset link has been sent to your email.",
        );
      },
      onError: (error: any) => {
        setErrors((prev) => ({
          ...prev,
          submit:
            error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.message ||
            "Failed to send password reset link.",
        }));
      },
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!agreedToTerms) {
      alert("Please agree to Terms & Conditions");
      return false;
    }

    if (activeTab === "student") {
      if (!studentForm.email.trim()) newErrors.email = "Email is required";
      if (!studentForm.password) newErrors.password = "Password is required";
      if (studentForm.email && !/\S+@\S+\.\S+/.test(studentForm.email)) {
        newErrors.email = "Please enter a valid email";
      }
    } else if (activeTab === "institution") {
      if (!institutionForm.email.trim()) newErrors.email = "Email is required";
      if (!institutionForm.password)
        newErrors.password = "Password is required";
      if (
        institutionForm.email &&
        !/\S+@\S+\.\S+/.test(institutionForm.email)
      ) {
        newErrors.email = "Please enter a valid email";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const getLoginData = () => {
    if (activeTab === "student") {
      return {
        email: studentForm.email,
        password: studentForm.password,
        userType: "student",
      };
    } else {
      return {
        email: institutionForm.email,
        password: institutionForm.password,
        userType: "institution",
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "general") {
      handleContinueWithoutLogin();
      return;
    }

    if (forgotPasswordMode) {
      handleForgotPassword();
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const loginData = getLoginData();

    login(loginData, {
      onSuccess: (data: any) => {
        const responsePayload =
          data?.data && typeof data.data === "object" ? data.data : data;
        const responseUser = responsePayload?.user || responsePayload || {};
        const userType =
          responseUser?.userType ||
          (["student", "institution", "general"].includes(responseUser?.role)
            ? responseUser.role
            : undefined) ||
          activeTab;

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
        if (!isLoading) {
          setIsLoading(false);
        }
      },
    });
  };

  const redirectBasedOnUserType = (userType: string) => {
    setIsLoading(false);
    const redirectTarget = resolvePostLoginRedirect({
      requestedPath: requestedRedirect,
      userType,
    });
    const postLoginAction = resolvePostLoginAction(requestedPostLoginAction);

    clearStoredPostLoginAction();
    clearStoredPostLoginRedirect();
    navigate(redirectTarget, {
      replace: true,
      state: postLoginAction ? { postLoginAction } : null,
    });
  };

  const renderGeneralForm = () => (
    <div className="rounded-xl border border-primary-100 bg-primary-50/60 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-700 shadow-sm">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            General access does not require an account.
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Click the button below to continue as a guest.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStudentForm = () => (
    <div className="space-y-4">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="email"
          name="email"
          value={studentForm.email}
          onChange={handleStudentInputChange}
          disabled={isLoading || googleAuthLoading}
          className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm ${
            errors.email ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
          placeholder="Email"
        />
      </div>
      {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

      {!forgotPasswordMode && (
        <>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              name="password"
              value={studentForm.password}
              onChange={handleStudentInputChange}
              disabled={isLoading || googleAuthLoading}
              className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
              placeholder="Password"
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password}</p>
          )}
        </>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setForgotPasswordMode((current) => !current)}
          disabled={isLoading || googleAuthLoading || isForgotPasswordPending}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {forgotPasswordMode ? "Back to login" : "Forgot password?"}
        </button>
      </div>
    </div>
  );

  const renderInstitutionForm = () => (
    <div className="space-y-4">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="email"
          name="email"
          value={institutionForm.email}
          onChange={handleInstitutionInputChange}
          disabled={isLoading || googleAuthLoading}
          className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm ${
            errors.email ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
          placeholder="Official Email"
        />
      </div>
      {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

      {!forgotPasswordMode && (
        <>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              name="password"
              value={institutionForm.password}
              onChange={handleInstitutionInputChange}
              disabled={isLoading || googleAuthLoading}
              className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
              placeholder="Password"
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password}</p>
          )}
        </>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setForgotPasswordMode((current) => !current)}
          disabled={isLoading || googleAuthLoading || isForgotPasswordPending}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {forgotPasswordMode ? "Back to login" : "Forgot password?"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 rounded-r-3xl items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center px-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold text-white mb-4">
            CampusTOK
          </h1>
          <p className="text-lg xl:text-xl text-white/90">
            Connect, Learn, and Grow Together
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate("/signup")}
            className="mb-6 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            disabled={isLoading || googleAuthLoading}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

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
              <p className="text-sm text-green-700 flex-1">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          {/* User Type Tabs */}
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {userTypes.map((type) => {
                const Icon = type.icon;
                const isActive = activeTab === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setActiveTab(type.value as any)}
                    disabled={isLoading || googleAuthLoading}
                    className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${
                      isActive
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-primary-600" : "text-gray-600"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        isActive ? "text-primary-900" : "text-gray-700"
                      }`}
                    >
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Tab Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "general" && renderGeneralForm()}
              {activeTab === "student" && renderStudentForm()}
              {activeTab === "institution" && renderInstitutionForm()}

              {/* Terms & Condition Checkbox */}
              {activeTab !== "general" && !forgotPasswordMode && (
                <div className="flex items-start gap-2 pt-2">
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
                      className="underline text-gray-900"
                      onClick={() => alert("Terms & Conditions")}
                      disabled={isLoading || googleAuthLoading}
                    >
                      Terms & Condition
                    </button>
                  </label>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || googleAuthLoading}
                className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {forgotPasswordMode
                  ? isForgotPasswordPending
                    ? "Sending..."
                    : "Send Reset Link"
                  : isLoading
                    ? "Logging in..."
                    : "Login"}
              </button>
            </form>
          </div>

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
          <div className="flex justify-center mb-6">
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
            <div className="mb-6 text-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">
                Authenticating with Google...
              </p>
            </div>
          )}

          {/* Continue Without Login */}
          {activeTab !== "general" && (
            <div className="mb-6">
              <button
                onClick={handleContinueWithoutLogin}
                disabled={isLoading || googleAuthLoading}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <LogIn className="w-4 h-4" />
                Continue Without Login
              </button>
            </div>
          )}

          {/* Sign up link */}
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
  );
}
