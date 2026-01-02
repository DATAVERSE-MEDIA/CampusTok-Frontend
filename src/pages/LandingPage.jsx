import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { Heart, MessageCircle, Share2, BarChart3, MoreVertical } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const { selectedSchool } = useAppStore()

  return (
    <div className="flex-1 flex bg-white">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6">
          {/* Post */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            {/* Post Header */}
            <div className="p-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center relative">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-lg">U</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {selectedSchool ? selectedSchool.name : 'University of Lagos'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedSchool?.address || 'University Road Lagos Mainland Akoka, Yaba, Lagos'}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Post Text */}
            <div className="px-4 pb-4">
              <p className="text-gray-900 leading-relaxed">
                At the University of Lagos, a new electric bus was introduced to shuttle students around campus. 
                Silent and eco-friendly, it quickly became a symbol of innovation, inspiring students wh...
              </p>
            </div>

            {/* Post Image */}
            <div className="w-full">
              <div className="w-full h-[600px] bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center relative overflow-hidden">
                {/* Placeholder for the academic regalia image - you can replace this with actual image */}
                <div className="w-full h-full flex items-center justify-center bg-amber-50">
                  <div className="text-center">
                    <div className="w-40 h-40 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-7xl">👩‍🎓</span>
                    </div>
                    <p className="text-gray-600 text-sm">Academic Regalia - University of Lagos</p>
                    <p className="text-gray-500 text-xs mt-2">Replace with actual image from your assets</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="px-4 py-4 border-t border-gray-200 flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="font-medium">11.7k</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">500</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="font-medium">1k</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">100k</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Chatbot Widget */}
      <div className="w-80 bg-gray-900 p-6 flex items-start">
        <div className="bg-gray-800 rounded-lg p-6 w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-bold text-white">HI, I'm ChatBot</h3>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-6">
            You can ask me questions based on a particular institution.
          </p>
          <button
            onClick={() => navigate('/chatbot')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Use ChatBot
          </button>
        </div>
      </div>
    </div>
  )
}
