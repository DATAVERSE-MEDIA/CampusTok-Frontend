import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { GraduationCap, Building2, Users, ArrowRight } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();
  const { user, selectProfile } = useAuthStore();
  const userName = user?.name || user?.full_name || "there";

  const handleStudent = () => {
    // Navigate to student profile setup
    navigate("/student-signup");
  };

  const handleInstitution = () => {
    // Navigate to institution profile setup
    navigate("/institution-signup");
  };

  const handleContinueAsGeneral = () => {
    // Mark profile as selected and go to general dashboard
    selectProfile("general");
    navigate("/general-dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Panel - Branding */}
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
            CampusTok
          </h1>
          <p className="text-lg xl:text-xl text-white/90">
            Your gateway to campus life
          </p>
        </div>
      </div>

      {/* Right Panel - Options */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md text-center">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary-900">CampusTok</h1>
          </div>

          {/* Welcome Message */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Hi {userName}! 👋
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            Welcome to CampusTok
          </h3>
          <p className="text-gray-600 mb-8">
            Your gateway to campus information, learning and connection.
          </p>

          {/* Avatar Placeholder */}
          <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-5xl">👤</span>
          </div>

          <h4 className="text-lg font-bold text-gray-900 mb-6">
            How would you like to continue?
          </h4>

          {/* Option Cards */}
          <div className="space-y-3 mb-6">
            {/* Student Option */}
            <button
              onClick={handleStudent}
              className="w-full p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h5 className="font-semibold text-gray-900">
                  Continue as Student
                </h5>
                <p className="text-sm text-gray-500">
                  Access portal, submit complaints, and explore campus
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </button>

            {/* Institution Option */}
            <button
              onClick={handleInstitution}
              className="w-full p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <h5 className="font-semibold text-gray-900">
                  Continue as Institution
                </h5>
                <p className="text-sm text-gray-500">
                  Manage dashboard, sentiment bank, and communications
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-50 text-gray-500 font-medium">
                OR
              </span>
            </div>
          </div>

          {/* Continue as General */}
          <button
            onClick={handleContinueAsGeneral}
            className="w-full p-4 bg-gray-100 rounded-xl border-2 border-gray-200 hover:bg-gray-200 transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gray-300 transition-colors">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1 text-left">
              <h5 className="font-semibold text-gray-900">
                Continue as General User
              </h5>
              <p className="text-sm text-gray-500">
                Explore CampusTok without a specific role
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
