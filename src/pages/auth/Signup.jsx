import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useRegister } from "../../hooks/useAuth";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "general", // Default role, can be changed later
  });
  const [errors, setErrors] = useState({});

  // Use the hook properly - call it at the top level
  const { mutate: register, isPending, error: apiError } = useRegister();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare request body
    const reqBody = {
      full_name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role || "general",
    };

    // Call the mutation function
    register(reqBody, {
      onSuccess: (data) => {
        console.log("Registration successful:", data);
        // Save email to auth store for OTP verification
        const email = data?.data?.email || data?.email || formData.email;
        if (email) {
          signup(email); // Save email to auth store
        }
        // Navigate to OTP verification screen
        navigate("/verify-email");
      },
      onError: (error) => {
        console.error("Registration failed:", error);
        // Handle API errors
        setErrors({
          submit:  error.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.message ||
            "Registration failed. Please try again.",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Panel - Primary Color - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 rounded-r-3xl items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center px-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold text-white mb-4">
            CampusTOK
          </h1>
          <p className="text-lg xl:text-xl text-white/90">
            Join thousands of students connecting on campus
          </p>
        </div>
      </div>

      {/* Right Panel - Light Gray */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate("/login")}
            className="mb-4 lg:mb-6 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            disabled={isPending}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary-900">CampusTOK</h1>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
            Create Account
          </h2>
          <p className="text-sm lg:text-base text-gray-600 mb-6 lg:mb-8 text-center">
            Sign up to get started with CampusTOK
          </p>

          {/* Error Message */}
          {(errors.submit || apiError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.submit ||
                apiError?.response?.data?.message ||
                "Registration failed. Please try again."}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
            <div className="relative">
              <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isPending}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white rounded-lg border text-sm sm:text-base ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Full Name"
              />
            </div>
            {errors.name && (
              <p className="text-xs sm:text-sm text-red-600 mt-1">
                {errors.name}
              </p>
            )}

            <div className="relative">
              <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isPending}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white rounded-lg border text-sm sm:text-base ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Email"
              />
            </div>
            {errors.email && (
              <p className="text-xs sm:text-sm text-red-600 mt-1">
                {errors.email}
              </p>
            )}

            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isPending}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white rounded-lg border text-sm sm:text-base ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Password"
              />
            </div>
            {errors.password && (
              <p className="text-xs sm:text-sm text-red-600 mt-1">
                {errors.password}
              </p>
            )}

            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isPending}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white rounded-lg border text-sm sm:text-base ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Confirm Password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs sm:text-sm text-red-600 mt-1">
                {errors.confirmPassword}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary-800 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isPending ? "Creating account..." : "Sign Up"}
            </button>
          </form>

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

          {/* Social Login Buttons */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-6">
            <button
              disabled={isPending}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
            >
              <span className="text-lg sm:text-xl font-bold">G</span>
            </button>
            <button
              type="button"
              disabled={isPending}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black border border-gray-300 flex items-center justify-center hover:bg-gray-900 transition-colors disabled:opacity-50 shadow-sm"
            >
              <span className="text-white text-lg sm:text-xl">🍎</span>
            </button>
          </div>

          <button
            disabled={isPending}
            onClick={() => navigate("/general-dashboard")}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors mb-6 disabled:opacity-50 text-sm sm:text-base"
          >
            Explore as Visitor
          </button>

          <div className="text-center">
            <p className="text-sm lg:text-base text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary-600 hover:text-primary-700 underline font-medium"
                disabled={isPending}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
