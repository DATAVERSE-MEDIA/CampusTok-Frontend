import { useState } from "react";
import { GraduationCap, ExternalLink, RefreshCw } from "lucide-react";

export default function StudentPortal() {
  const [portalUrl] = useState("https://studentportal.unilag.edu.ng/login");
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Student Portal
              </h1>
              <p className="text-gray-600">
                Access your student portal in a new window
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Open in New Tab
            </a>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {/* <div className="bg-gray-100 p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white rounded px-4 py-2 text-sm text-gray-600">
              {portalUrl}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Student Portal
          </div>
        </div> */}
        <div className="h-[600px] bg-white">
          <iframe
            src={portalUrl}
            className="w-full h-full border-0"
            title="Student Portal"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>

      <div className="card mt-6 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <GraduationCap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">
              About Student Portal
            </h3>
            <p className="text-sm text-blue-700">
              This is an iframe integration of the student portal. In
              production, this would connect to your actual student portal
              system. You can click "Open in New Tab" to view the portal in a
              separate window.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
