import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { useSchools } from "../../hooks/useSchools";
import { ArrowLeft, Building2, Mail, Loader2 } from "lucide-react";

export default function InstitutionSignup() {
  const navigate = useNavigate();
  const { user, selectProfile, setDefaultInstitution } = useAuthStore();
  const { setSelectedSchool } = useAppStore();

  const [formData, setFormData] = useState({
    institution: "",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch institutions
  const { data: institutions = [], isLoading: isLoadingSchools } = useSchools();

  // Transform schools data
  const institutionOptions = institutions.map((school) => ({
    id: school.id,
    name: school.institution_name,
    code: school.code,
    logo: school.institution_profile_picture,
    email: school.institution_email,
  }));

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, [user, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.institution) {
      newErrors.institution = "Please select an institution";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Official email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
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

    setIsSubmitting(true);

    try {
      // Get selected institution object
      const selectedInstitution =
        institutionOptions[parseInt(formData.institution)];

      // Update auth store with institution profile
      selectProfile("institution", selectedInstitution);
      setDefaultInstitution(selectedInstitution);

      // Also set in app store for immediate use
      setSelectedSchool(selectedInstitution);

      // TODO: Call API to update user profile
      // await apiClient.patch('/users/me/profile', {
      //   role: 'institution',
      //   institution_id: selectedInstitution.id,
      //   official_email: formData.email
      // });

      // Navigate to institution dashboard
      navigate("/institution-dashboard", { replace: true });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrors({ submit: "Failed to save profile. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
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
            <Building2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold text-white mb-4">
            CampusTok
          </h1>
          <p className="text-lg xl:text-xl text-white/90">
            Set up your institution profile
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate("/welcome")}
            className="mb-6 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary-900">CampusTok</h1>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
            Institution Profile
          </h2>
          <p className="text-sm lg:text-base text-gray-600 mb-6 text-center">
            Manage your institution's presence on CampusTok
          </p>

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Institution Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Select Institution
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  disabled={isSubmitting || isLoadingSchools}
                  className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm appearance-none ${
                    errors.institution ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
                >
                  <option value="">
                    {isLoadingSchools ? "Loading..." : "Select institution"}
                  </option>
                  {institutionOptions.map((inst, index) => (
                    <option key={inst.id} value={index}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.institution && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.institution}
                </p>
              )}
            </div>

            {/* Official Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Official Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="admin@institution.edu.ng"
                  className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> As an institution admin, you'll have
                access to:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Dashboard & Analytics</li>
                <li>Sentiment Bank</li>
                <li>Content Management</li>
                <li>AI Chatbot Training</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Setup"
              )}
            </button>
          </form>

          {/* Skip Option */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/institution-dashboard")}
              disabled={isSubmitting}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
