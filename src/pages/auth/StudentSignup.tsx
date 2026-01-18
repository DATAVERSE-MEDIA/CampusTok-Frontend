import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { useSchools } from "../../hooks/useSchools";
import {
  ArrowLeft,
  GraduationCap,
  School,
  BookOpen,
  Hash,
  Loader2,
} from "lucide-react";

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

export default function StudentSignup() {
  const navigate = useNavigate();
  const { user, selectProfile, setDefaultInstitution } = useAuthStore();
  const { setSelectedSchool } = useAppStore();

  const [formData, setFormData] = useState({
    institution: "",
    matricNumber: "",
    department: "",
    level: "",
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
      newErrors.institution = "Please select your institution";
    }
    if (!formData.matricNumber.trim()) {
      newErrors.matricNumber = "Matric number is required";
    }
    if (!formData.department) {
      newErrors.department = "Please select your department";
    }
    if (!formData.level) {
      newErrors.level = "Please select your level";
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

      // Update auth store with student profile
      selectProfile("student", selectedInstitution);
      setDefaultInstitution(selectedInstitution);

      // Also set in app store for immediate use
      setSelectedSchool(selectedInstitution);

      // TODO: Call API to update user profile with student details
      // await apiClient.patch('/users/me/profile', {
      //   role: 'student',
      //   institution_id: selectedInstitution.id,
      //   matric_number: formData.matricNumber,
      //   department: formData.department,
      //   level: formData.level
      // });

      // Navigate to student dashboard
      navigate("/student-dashboard", { replace: true });
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
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold text-white mb-4">
            CampusTok
          </h1>
          <p className="text-lg xl:text-xl text-white/90">
            Complete your student profile
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
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary-900">CampusTok</h1>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
            Student Profile
          </h2>
          <p className="text-sm lg:text-base text-gray-600 mb-6 text-center">
            Tell us about your academic journey
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
                Institution
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                    {isLoadingSchools
                      ? "Loading..."
                      : "Select your institution"}
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

            {/* Matric Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Matric Number
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="matricNumber"
                  value={formData.matricNumber}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. 190401234"
                  className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm ${
                    errors.matricNumber ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
                />
              </div>
              {errors.matricNumber && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.matricNumber}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Faculty / Department
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm appearance-none ${
                    errors.department ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
                >
                  <option value="">Select your department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              {errors.department && (
                <p className="text-sm text-red-600 mt-1">{errors.department}</p>
              )}
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Level
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border text-sm appearance-none ${
                    errors.level ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
                >
                  <option value="">Select your level</option>
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl} Level
                    </option>
                  ))}
                </select>
              </div>
              {errors.level && (
                <p className="text-sm text-red-600 mt-1">{errors.level}</p>
              )}
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
                "Complete Profile"
              )}
            </button>
          </form>

          {/* Skip Option */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/student-dashboard")}
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
