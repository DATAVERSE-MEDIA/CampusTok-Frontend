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
  Mail,
  BookOpen,
  Hash,
  School, // Use School instead of University
  Globe,
  Briefcase,
  Home,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useLogin, useGoogleAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/useAuthStore";

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

const institutions = [
  "University of Lagos",
  "Harvard University",
  "MIT",
  "Stanford University",
  "Yale University",
  "Oxford University",
  "Cambridge University",
  "University of Ibadan",
  "Covenant University",
  "Federal University of Technology",
];

const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Medicine",
  "Law",
  "Business Administration",
  "Economics",
  "Psychology",
  "Architecture",
];

const levels = ["100", "200", "300", "400", "500", "Postgraduate"];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authStoreLogin, email: storedEmail } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<"general" | "student" | "institution">("general");
  
  const [generalForm, setGeneralForm] = useState({
    username: "",
    password: "",
  });
  
  const [studentForm, setStudentForm] = useState({
    institution: "",
    matricNumber: "",
    department: "",
    level: "",
    password: "",
  });
  
  const [institutionForm, setInstitutionForm] = useState({
    institutionName: "",
    email: "",
    password: "",
  });
  
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check for verification success message
  useEffect(() => {
    if (location.state?.message && location.state?.verified) {
      setSuccessMessage(location.state.message);
      if (location.state.email) {
        setGeneralForm((prev) => ({ ...prev, username: location.state.email }));
      } else if (storedEmail) {
        setGeneralForm((prev) => ({ ...prev, username: storedEmail }));
      }
      setTimeout(() => {
        setSuccessMessage(null);
        window.history.replaceState({}, document.title);
      }, 5000);
    }
  }, [location.state, storedEmail]);

  const { mutate: login, isPending } = useLogin();
  const { mutate: googleAuth, isPending: isGoogleAuthPending } = useGoogleAuth();

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

  const handleGeneralInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleStudentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleInstitutionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInstitutionForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!agreedToTerms) {
      alert("Please agree to Terms & Conditions");
      return false;
    }

    if (activeTab === "general") {
      if (!generalForm.username.trim()) newErrors.username = "Username or email is required";
      if (!generalForm.password) newErrors.password = "Password is required";
    } else if (activeTab === "student") {
      if (!studentForm.institution) newErrors.institution = "Institution is required";
      if (!studentForm.matricNumber.trim()) newErrors.matricNumber = "Matric number is required";
      if (!studentForm.department) newErrors.department = "Department is required";
      if (!studentForm.level) newErrors.level = "Level is required";
      if (!studentForm.password) newErrors.password = "Password is required";
    } else if (activeTab === "institution") {
      if (!institutionForm.institutionName.trim()) newErrors.institutionName = "Institution name is required";
      if (!institutionForm.email.trim()) newErrors.email = "Email is required";
      if (!institutionForm.password) newErrors.password = "Password is required";
      if (institutionForm.email && !/\S+@\S+\.\S+/.test(institutionForm.email)) {
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
    if (activeTab === "general") {
      return {
        email: generalForm.username,
        password: generalForm.password,
        userType: "general",
      };
    } else if (activeTab === "student") {
      return {
        email: `${studentForm.matricNumber}@${studentForm.institution.toLowerCase().replace(/\s+/g, "")}.edu`,
        password: studentForm.password,
        userType: "student",
        institution: studentForm.institution,
        matricNumber: studentForm.matricNumber,
        department: studentForm.department,
        level: studentForm.level,
      };
    } else {
      return {
        email: institutionForm.email,
        password: institutionForm.password,
        userType: "institution",
        institutionName: institutionForm.institutionName,
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    const loginData = getLoginData();

    login(loginData, {
      onSuccess: (data: any) => {
        const userType = data.user?.userType || data.user?.role || activeTab;
        
        if (data.user && !data.user.userType && !data.user.role) {
          const updatedUser = {
            ...data.user,
            userType: activeTab,
            role: activeTab,
            ...(activeTab === "student" && {
              institution: studentForm.institution,
              matricNumber: studentForm.matricNumber,
              department: studentForm.department,
              level: studentForm.level,
            }),
            ...(activeTab === "institution" && {
              institutionName: institutionForm.institutionName,
            }),
          };
          authStoreLogin(updatedUser);
        }
        
        redirectBasedOnUserType(userType);
      },
      onError: (error: any) => {
        if (
          error?.response?.status === 404 ||
          error?.response?.status === 401 ||
          error?.response?.status === 400 ||
          error?.message?.includes("network")
        ) {
          // Dummy login for testing
          const dummyUser = {
            userType: activeTab,
            role: activeTab,
            name: activeTab === "general" 
              ? generalForm.username.split("@")[0] || "User"
              : activeTab === "student"
              ? `Student ${studentForm.matricNumber}`
              : institutionForm.institutionName,
            email: loginData.email,
            isAuthenticated: true,
            ...(activeTab === "student" && {
              institution: studentForm.institution,
              matricNumber: studentForm.matricNumber,
              department: studentForm.department,
              level: studentForm.level,
            }),
            ...(activeTab === "institution" && {
              institutionName: institutionForm.institutionName,
            }),
          };
          authStoreLogin(dummyUser);
          redirectBasedOnUserType(activeTab);
        } else {
          setErrors({
            submit: error?.response?.data?.message || error?.message || "Login failed. Please try again.",
          });
          setIsLoading(false);
        }
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
    if (userType === "student") {
      navigate("/student-dashboard", { replace: true });
    } else if (userType === "institution") {
      navigate("/institution-dashboard", { replace: true });
    } else {
      navigate("/general-dashboard", { replace: true });
    }
  };

  const renderGeneralForm = () => (
    <div className="space-y-4">
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          name="username"
          value={generalForm.username}
          onChange={handleGeneralInputChange}
          disabled={isLoading || googleAuthLoading}
          className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm ${
            errors.username ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
          placeholder="Username or Email"
        />
      </div>
      {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="password"
          name="password"
          value={generalForm.password}
          onChange={handleGeneralInputChange}
          disabled={isLoading || googleAuthLoading}
          className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm ${
            errors.password ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
          placeholder="Password"
        />
      </div>
      {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
    </div>
  );

  const renderStudentForm = () => (
    <div className="space-y-4">
      <div className="relative">
        <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <select
          name="institution"
          value={studentForm.institution}
          onChange={handleStudentInputChange}
          disabled={isLoading || googleAuthLoading}
          className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm appearance-none ${
            errors.institution ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
        >
          <option value="">Select Institution</option>
          {institutions.map((inst) => (
            <option key={inst} value={inst}>{inst}</option>
          ))}
        </select>
      </div>
      {errors.institution && <p className="text-sm text-red-600">{errors.institution}</p>}

      <div className="relative">
        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          name="matricNumber"
          value={studentForm.matricNumber}
          onChange={handleStudentInputChange}
          disabled={isLoading || googleAuthLoading}
          className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm ${
            errors.matricNumber ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
          placeholder="Matric Number"
        />
      </div>
      {errors.matricNumber && <p className="text-sm text-red-600">{errors.matricNumber}</p>}

      <div className="relative">
        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <select
          name="department"
          value={studentForm.department}
          onChange={handleStudentInputChange}
          disabled={isLoading || googleAuthLoading}
          className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm appearance-none ${
            errors.department ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
        >
          <option value="">Select Department/Faculty</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>
      {errors.department && <p className="text-sm text-red-600">{errors.department}</p>}

      <div className="relative">
        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <select
          name="level"
          value={studentForm.level}
          onChange={handleStudentInputChange}
          disabled={isLoading || googleAuthLoading}
          className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm appearance-none ${
            errors.level ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
        >
          <option value="">Select Level</option>
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>{lvl} Level</option>
          ))}
        </select>
      </div>
      {errors.level && <p className="text-sm text-red-600">{errors.level}</p>}

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
      {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
    </div>
  );

  const renderInstitutionForm = () => (
    <div className="space-y-4">
      <div className="relative">
        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          name="institutionName"
          value={institutionForm.institutionName}
          onChange={handleInstitutionInputChange}
          disabled={isLoading || googleAuthLoading}
          className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm ${
            errors.institutionName ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
          placeholder="Institution Name"
        />
      </div>
      {errors.institutionName && <p className="text-sm text-red-600">{errors.institutionName}</p>}

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
      {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
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
                    <Icon className={`w-5 h-5 ${
                      isActive ? "text-primary-600" : "text-gray-600"
                    }`} />
                    <span className={`text-xs font-medium ${
                      isActive ? "text-primary-900" : "text-gray-700"
                    }`}>
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

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || googleAuthLoading}
                className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? "Logging in..." : "Login"}
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
            <div className={isLoading || googleAuthLoading ? "opacity-50 pointer-events-none" : ""}>
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