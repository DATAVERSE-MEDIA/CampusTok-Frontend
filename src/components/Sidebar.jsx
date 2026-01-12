import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useAppStore } from "../store/useAppStore";
import { schoolApi } from "../api";
import {
  User,
  MessageSquare,
  Users,
  GraduationCap,
  ChevronDown,
  X,
  Bell,
  Settings,
  LogOut,
  HelpCircle,
  LayoutDashboard,
  Eye,
  FileText,
  BookOpen,
  AtSign,
  Building2,
  Book,
  Loader2
} from "lucide-react";


// General account menu items - matching Figma
const generalMenuItems = [
  { path: "/profile", icon: User, label: "Profile" },
  { path: "/community", icon: Users, label: "Communities" },
  { path: "/messages", icon: MessageSquare, label: "Messages" },
];

// Student menu items
const studentMenuItems = [
  { path: "/profile", icon: User, label: "Profile" },
  { path: "/community", icon: Users, label: "Communities" },
  { path: "/messages", icon: MessageSquare, label: "Messages" },
  { path: "/complaints", icon: HelpCircle, label: "complaints" },
  { path: "/student-portal", icon: GraduationCap, label: "Student Portal" },
  { path: "/notifications", icon: Bell, label: "Notification" },
];

// Institution menu items - matching Figma design
const institutionMenuItems = [
  { path: "/institution-dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/community", icon: Users, label: "Communities" },
  { path: "/chatbot", icon: Eye, label: "Sentiment Bank" },
  { path: "/faculties", icon: FileText, label: "Faculties / Department" },
  { path: "/courses", icon: BookOpen, label: "Courses / Programs" },
  { path: "/notifications", icon: Bell, label: "Notification" },
];

export default function Sidebar({ isOpen, setIsOpen ,onCreatePostClick}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, userType } = useAuthStore();
  const { selectedSchool, setSelectedSchool, schools ,setSchools} = useAppStore();
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
   const [isLoadingSchools, setIsLoadingSchools] = useState(false);


  // Determine which menu items to show based on user type or route
  const effectiveUserType =
    userType ||
    (location.pathname.includes("institution")
      ? "institution"
      : location.pathname.includes("student")
      ? "student"
      : null);


  // Fetch schools from API
  const fetchSchools = async () => {
    setIsLoadingSchools(true);
    
    try {
      const response = await schoolApi.getAllSchools();
      const schoolsData = response.data.data || response.data || [];

     // console.log("schools ::",JSON.stringify(schoolsData))
      
      // Format the schools data
      const formattedSchools = schoolsData.map((school) => ({
        id: school.id || school._id,
        name: school.name || school.institution_name || school.full_name,
        
        code: school.code || school.abbreviation || school.short_name,
        logo: school.logo || school.profile_picture || school.image_url,
        address: school.address || school.location,
        type: school.type || "university",
      }));
      
      setSchools(formattedSchools);
      
      // If no school is selected yet and we have schools, select the first one
      if (!selectedSchool && formattedSchools.length > 0) {
       // setSelectedSchool(formattedSchools[0]);
      }
      
    } catch (error) {
      console.error("Error fetching schools:", error);
      
      // Mock data for testing
      // const mockSchools = [
      //   {
      //     id: 1,
      //     name: "University of Lagos",
      //     code: "UNILAG",
      //     logo: null,
      //     address: "University Road, Lagos Mainland Akoka, Yaba, Lagos",
      //     type: "university",
      //   },
      //   {
      //     id: 2,
      //     name: "Harvard University",
      //     code: "HARVARD",
      //     logo: null,
      //     address: "Cambridge, Massachusetts, USA",
      //     type: "university",
      //   },
      //   {
      //     id: 3,
      //     name: "University of Ibadan",
      //     code: "UI",
      //     logo: null,
      //     address: "Ibadan, Oyo State, Nigeria",
      //     type: "university",
      //   },
      // ];
      
      // setSchools(mockSchools);
      // if (!selectedSchool && mockSchools.length > 0) {
      //   setSelectedSchool(mockSchools[0]);
      // }
    } finally {
      setIsLoadingSchools(false);
    }
  };

  // Fetch schools on component mount
  useEffect(() => {
    if (schools.length === 0) {
      fetchSchools();
    }
  }, []);

  

  // Debug: Log to verify userType detection
  useEffect(() => {
    console.log("Sidebar - UserType from store:", userType);
    console.log("Sidebar - Effective UserType:", effectiveUserType);
    console.log("Sidebar - Current pathname:", location.pathname);
  }, [userType, effectiveUserType, location.pathname]);

  const menuItems =
    effectiveUserType === "institution"
      ? institutionMenuItems
      : effectiveUserType === "student"
      ? studentMenuItems
      : generalMenuItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigate = (path) => {
    //navigate(path);
    setIsOpen(false); // Close sidebar on mobile after navigation

    onCreatePostClick()
  };
 
  console.log("user:" ,JSON.stringify(user))
  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40
        w-64 bg-gray-50 text-gray-900
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4 border-b border-gray-300">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Logo Section with School Dropdown - Matching Figma */}
        <div className="p-4 lg:p-6 border-b border-gray-300">
          <button
            onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
            className="w-full flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <h1 className="text-lg lg:text-xl font-bold text-gray-900 flex-1 text-left">
              CampusTOK
            </h1>
            {/* Small University Logo with Dropdown */}
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-300 bg-white">
                {selectedSchool?.logo || user?.logo ? (
                  <img
                    src={selectedSchool.logo || user.logo}
                    alt={selectedSchool?.name || "University"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <div className="text-xs font-bold text-blue-600">UL</div>
                  </div>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-600 transition-transform ${
                  showSchoolDropdown ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* School Dropdown */}
          {showSchoolDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSchoolDropdown(false)}
              />
              <div className="absolute left-0 mt-2 w-full lg:w-64 bg-white rounded-lg shadow-lg border border-gray-300 z-20">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase mb-1">
                    Select School/Institution
                  </div>

                  {isLoadingSchools ? (
                    <div className="px-4 py-3 text-center">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      <p className="text-xs text-gray-500 mt-1">Loading schools...</p>
                    </div>
                  ) : schools.length > 0 ? (
                    schools.map((school) => (
                      <button
                        key={school.id}
                        onClick={() => {
                          setSelectedSchool(school);
                          setShowSchoolDropdown(false);
                          setIsOpen(false);
                          // Navigate to dashboard for the selected school
                          // if (location.pathname === "/") {
                          //   window.location.reload();
                          // } else {
                          //   navigate("/");
                          // }
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3 ${
                          selectedSchool?.id === school.id
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-900"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
                          {school.logo ? (
                            <img
                              src={school.logo}
                              alt={school.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                              <Book className="w-4 h-4 text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {school.name}
                          </div>
                          <div className="text-xs text-gray-500">{school.code}</div>
                        </div>
                      </button>
                    ))
                   ) : (
                    <div className="px-4 py-3 text-center">
                      <p className="text-xs text-gray-500">No schools available</p>
                    </div>
                    )}
                


                  {/* {schools.map((school) => (
                    <button
                      key={school.id}
                      onClick={() => {
                        setSelectedSchool(school);
                        setShowSchoolDropdown(false);
                        setIsOpen(false); // Close sidebar on mobile
                        // Refresh the page or update content
                        if (location.pathname === "/") {
                          window.location.reload();
                        } else {
                          navigate("/");
                        }
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${
                        selectedSchool?.id === school.id
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-900"
                      }`}
                    >
                      <div className="font-medium text-sm lg:text-base">
                        {school.name}
                      </div>
                      <div className="text-xs text-gray-500">{school.code}</div>
                    </button>
                  ))} */}


                </div>
              </div>
            </>
          )}
        </div>

        {/* User/Institution Profile Section - Matching Figma */}
        <div className="p-4 lg:p-6 border-b border-gray-300">
          {effectiveUserType === "institution" ? (
            // Institution Profile - Matching Figma design with larger logo
            <div className="flex items-start gap-3">
              {/* Larger University Crest/Logo - Matching Figma */}
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200 bg-white flex items-center justify-center">
                {user?.logo || selectedSchool?.logo ? (
                  <img
                    src={user.logo || selectedSchool.logo}
                    alt={user?.name || selectedSchool?.name || "Institution"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                    <div className="text-center p-1">
                      <div className="text-xs lg:text-sm font-bold text-blue-700">
                        UNIVERSITY
                      </div>
                      <div className="text-xs lg:text-sm font-bold text-blue-700">
                        OF LAGOS
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="font-bold text-gray-900 text-base lg:text-lg truncate mb-1">
                  {user?.name || selectedSchool?.name || "University of Lagos"}
                </h3>
                {/* Address in two lines - Matching Figma */}
                <p className="text-xs lg:text-sm text-gray-600 leading-tight">
                  University Road
                </p>
                <p className="text-xs lg:text-sm text-gray-600 leading-tight truncate">
                  Lagos Mainland A...
                </p>
              </div>
            </div>
          ) : effectiveUserType === "general" || !effectiveUserType ? (
            // General Account Profile - Matching Figma
            <div className="flex items-center gap-3">
              {/* Profile Picture */}
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0) || "F"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm lg:text-base truncate">
                  {user?.name || "Felix Gabriel"}
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 truncate">
                  General Account
                </p>
              </div>
            </div>
          ) : (
            // Student Profile - Matching Figma design exactly
            <div className="flex items-start gap-3">
              {/* Profile Picture - Larger circular, matching Figma */}
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                {user?.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={user?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-xl lg:text-2xl">
                    {user?.name?.charAt(0) || "F"}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {/* Name - Large, bold, dark grey - Matching Figma */}
                <h3 className="font-bold text-gray-900 text-lg lg:text-xl mb-1 truncate">
                  {user?.name || "Felix Gabriel"}
                </h3>
                {/* Two separate lines - Always show both - Matching Figma exactly */}
                <p className="text-xs lg:text-sm text-gray-600 leading-tight truncate">
                  {user?.school ||
                    selectedSchool?.name ||
                    "University of Lagos"}
                </p>
                <p className="text-xs lg:text-sm text-gray-600 leading-tight truncate mt-0.5">
                  {user?.department || user?.major || "Civil Engineering"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation - Matching Figma */}
        <nav className="flex-1 p-2 lg:p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-colors text-sm lg:text-base ${
                      isActive
                        ? "bg-gray-200 text-gray-900 font-medium"
                        : "text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Post Button - Matching Figma (dark purple border) */}
        <div className="p-3 lg:p-4 border-t border-gray-300">
          <button
            onClick={() => handleNavigate("/")}
            className="w-full border-2 border-gray-900 text-gray-900 bg-gray-50 py-2.5 lg:py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm lg:text-base"
          >
            Post
          </button>
        </div>

        {/* Create Account As Section - Only for general accounts */}
        {(effectiveUserType === "general" || !effectiveUserType) && (
          <div className="p-3 lg:p-4 border-t border-gray-300">
            <p className="text-xs lg:text-sm text-gray-500 uppercase mb-2 lg:mb-3 font-semibold px-2">
              Create Account As
            </p>
            <div className="space-y-1">
              <button
                onClick={() => navigate("/signup?type=student")}
                className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors text-sm lg:text-base"
              >
                <GraduationCap className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">A Student</span>
              </button>
              <button
                onClick={() => navigate("/create-account")}
                className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors text-sm lg:text-base"
              >
                <Building2 className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">An Institution</span>
              </button>
            </div>
          </div>
        )}

        {/* Settings and Logout - Matching Figma (Hidden for general accounts) */}
        {effectiveUserType !== "general" && effectiveUserType && (
          <div className="p-3 lg:p-4 border-t border-gray-300 space-y-1">
            {effectiveUserType === "institution" ? (
              <>
                <button
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors text-sm lg:text-base"
                >
                  <Settings className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left truncate">Settings</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${
                      showSettingsDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showSettingsDropdown && (
                  <div className="ml-4 pl-4 border-l border-gray-300 space-y-1">
                    <button
                      onClick={() => {
                        handleNavigate("/settings");
                        setShowSettingsDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors text-sm"
                    >
                      <AtSign className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Account Settings</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => handleNavigate("/settings")}
                className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors text-sm lg:text-base"
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Settings</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm lg:text-base"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
