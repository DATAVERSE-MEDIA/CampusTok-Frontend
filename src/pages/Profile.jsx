import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Edit, MapPin, Calendar, Mail, Phone, GraduationCap, Settings } from 'lucide-react'

export default function Profile() {
  const { user } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    username: '@johndoe',
    bio: 'Computer Science student passionate about technology and innovation.',
    location: 'Boston, MA',
    email: 'john.doe@university.edu',
    phone: '(555) 123-4567',
    school: 'Harvard University',
    major: 'Computer Science',
    year: 'Junior',
    joinDate: 'September 2022'
  })

  const stats = [
    { label: 'Posts', value: 42 },
    { label: 'Friends', value: 127 },
    { label: 'Communities', value: 8 },
    { label: 'Followers', value: 234 },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-700 rounded-t-lg mb-20 relative">
          <button className="absolute top-4 right-4 btn-secondary flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Cover
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-32 h-32 bg-primary-500 rounded-full flex items-center justify-center text-white text-4xl font-bold -mt-16 border-4 border-white">
                {profileData.name.charAt(0)}
              </div>
              <div className="pt-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{profileData.name}</h1>
                <p className="text-gray-600 mb-2">{profileData.username}</p>
                <p className="text-gray-700">{profileData.bio}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-primary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? 'Save' : 'Edit Profile'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{profileData.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{profileData.school}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Joined {profileData.joinDate}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{profileData.phone}</span>
              </div>
              <div className="text-gray-700">
                <span className="font-medium">Major:</span> {profileData.major} • {profileData.year}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                  {profileData.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">
                    <span className="font-medium">{profileData.name}</span> shared a new post
                  </p>
                  <p className="text-sm text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

