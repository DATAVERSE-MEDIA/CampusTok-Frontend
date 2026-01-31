import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Eye,
  Users,
  FileText,
  BookOpen,
  Bell,
} from "lucide-react";

export default function InstitutionDashboard() {
  const navigate = useNavigate();

  const quickLinks = [
    {
      path: "/sentiment-bank",
      icon: Eye,
      label: "Sentiment Bank",
      description: "Real-time campus public opinion analysis",
    },
    {
      path: "/community",
      icon: Users,
      label: "Communities",
      description: "Manage and engage with communities",
    },
    {
      path: "/notifications",
      icon: Bell,
      label: "Notifications",
      description: "View alerts and updates",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Institution Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your institution and view insights
          </p>
        </div>

        {/* Quick links / cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {quickLinks.map(({ path, icon: Icon, label, description }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="bg-white rounded-lg border border-gray-200 p-6 text-left hover:border-primary-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
              </div>
              <p className="text-sm text-gray-500">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
