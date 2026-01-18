import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useVerifyEmail, useResendVerification } from "../../hooks/useAuth";
import { ArrowLeft, Mail } from "lucide-react";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { email, verifyEmail: verifyEmailStore } = useAuthStore();
  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Get email from URL params if not in store (for email verification links)
  const emailFromUrl = searchParams.get("email");
  const currentEmail = email || emailFromUrl || "";

  const {
    mutate: verifyEmail,
    isPending: isVerifying,
    error: verifyError,
  } = useVerifyEmail();
  const { mutate: resendVerification, isPending: isResending } =
    useResendVerification();

  useEffect(() => {
    if (!currentEmail) {
      // If no email found, redirect to signup
      navigate("/signup");
    }
  }, [currentEmail, navigate]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    setError("");
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    if (pastedData.length === 4) {
      const digits = pastedData.split("");
      setCode(digits);

      // Focus on last input
      const lastInput = document.getElementById("code-3");
      if (lastInput) lastInput.focus();
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join("");

    // Validation
    if (verificationCode.length !== 4) {
      setError("Please enter the complete 4-digit verification code");
      return;
    }

    // Check if all are numbers
    if (!/^\d{4}$/.test(verificationCode)) {
      setError("Please enter a valid 4-digit number");
      return;
    }

    // Call API to verify email - pass token as string
    verifyEmail(verificationCode, {
      onSuccess: (response) => {
        console.log("Email verification successful:", response);

        // Note: verifyEmailStore() is already called in the hook's onSuccess
        // Show success message briefly
        setSuccessMessage(
          "Email verified successfully! Redirecting to login...",
        );
        setError("");

        verifyEmailStore();

        // Clear code
        setCode(["", "", "", ""]);

        // Navigate to login after a short delay
        setTimeout(() => {
          navigate("/pick-profile-picture", {
            replace: true,
            state: {
              message: "Email verified successfully! Please login to continue.",
              email: currentEmail,
              verified: true,
            },
          });
        }, 1500);
      },
      onError: (error) => {
        console.error("Email verification failed:", error);
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Invalid verification code. Please try again or request a new code.",
        );
        setSuccessMessage("");
        // Clear code on error for easier retry
        setCode(["", "", "", ""]);
        // Focus on first input
        const firstInput = document.getElementById("code-0");
        if (firstInput) firstInput.focus();
      },
    });
  };

  const handleResend = () => {
    if (!currentEmail) {
      setError("No email found. Please return to signup.");
      navigate("/signup");
      return;
    }

    resendVerification(
      { email: currentEmail },
      {
        onSuccess: (data) => {
          console.log("Verification code resent:", data);
          setSuccessMessage("New verification code sent to your email!");
          setError("");

          // Clear code for new entry
          setCode(["", "", "", ""]);

          // Focus on first input
          const firstInput = document.getElementById("code-0");
          if (firstInput) firstInput.focus();

          // Clear success message after 5 seconds
          setTimeout(() => setSuccessMessage(""), 5000);
        },
        onError: (error) => {
          console.error("Resend verification failed:", error);
          setError(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to resend verification code. Please try again.",
          );
          setSuccessMessage("");
        },
      },
    );
  };

  // const handleVerify = () => {
  //   const verificationCode = code.join('')
  //   if (verificationCode.length !== 4) {
  //     setError('Please enter the complete verification code')
  //     return
  //   }

  //   if (verificationCode === '1234') {
  //     verifyEmail()
  //     navigate('/pick-profile-picture')
  //   } else {
  //     setError('Invalid verification code. Try 1234 for demo.')
  //   }
  // }

  // const handleResend = () => {
  //   alert('Verification code resent to your email!')
  // }

  // If no email, don't render (will redirect)
  if (!currentEmail) {
    return null;
  }

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
            <Mail className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold text-white mb-4">
            CampusTok
          </h1>
          <p className="text-lg xl:text-xl text-white/90">
            Verify your email to get started
          </p>
        </div>
      </div>

      {/* Right Panel - Light Gray */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate("/signup")}
            className="mb-4 lg:mb-6 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            disabled={isVerifying || isResending}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary-900">CampusTok</h1>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
            Verify Your Email
          </h2>
          <p className="text-sm lg:text-base text-gray-600 mb-4 text-center">
            Enter the 4-digit code sent to
          </p>
          <p className="text-primary-600 font-medium mb-6 lg:mb-8 text-center break-all">
            {currentEmail}
          </p>

          {/* OTP Input Boxes */}
          <div
            className="flex justify-center gap-2 sm:gap-3 mb-6"
            onPaste={handlePaste}
          >
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isVerifying || isResending}
                className="w-14 h-14 sm:w-16 sm:h-16 text-center text-xl sm:text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{
                  borderColor: error
                    ? "#ef4444"
                    : digit
                      ? "#24223A"
                      : "#d1d5db",
                }}
              />
            ))}
          </div>

          {/* Error Message */}
          {(error || verifyError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs sm:text-sm text-red-700 text-center">
                {error ||
                  verifyError?.response?.data?.message ||
                  "Verification failed"}
              </p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs sm:text-sm text-green-700 text-center">
                {successMessage}
              </p>
            </div>
          )}

          {/* Loading State */}
          {(isVerifying || isResending) && !error && !successMessage && (
            <div className="mb-4 text-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs sm:text-sm text-gray-500">
                {isVerifying ? "Verifying code..." : "Sending new code..."}
              </p>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={isVerifying || isResending || code.join("").length !== 4}
            className="w-full bg-primary hover:bg-primary-800 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </button>

          <div className="text-center">
            <span className="text-xs sm:text-sm text-gray-600">
              Didn't receive any code?{" "}
            </span>
            <button
              disabled={isVerifying || isResending || !currentEmail}
              onClick={handleResend}
              className="text-primary-600 hover:text-primary-700 underline font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          </div>

          {/* Test Code Hint (for development/testing) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                <strong>Testing:</strong> Try code <strong>1234</strong> or any
                4-digit number
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
