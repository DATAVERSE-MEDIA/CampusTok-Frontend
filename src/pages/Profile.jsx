// import { useState } from 'react'
// import { useAuthStore } from '../store/useAuthStore'
// import { Edit, MapPin, Calendar, Mail, Phone, GraduationCap, Settings } from 'lucide-react'
// import {useProfile} from '../hooks/useAuth'

// export default function Profile() {
//   const { user } = useAuthStore()
//   const [isEditing, setIsEditing] = useState(false)
//   const [profileData, setProfileData] = useState({
//     name: user?.name || 'John Doe',
//     username: '@johndoe',
//     bio: 'Computer Science student passionate about technology and innovation.',
//     location: 'Boston, MA',
//     email: 'john.doe@university.edu',
//     phone: '(555) 123-4567',
//     school: 'Harvard University',
//     major: 'Computer Science',
//     year: 'Junior',
//     joinDate: 'September 2022'
//   })

//   const stats = [
//     { label: 'Posts', value: 42 },
//     { label: 'Friends', value: 127 },
//     { label: 'Communities', value: 8 },
//     { label: 'Followers', value: 234 },
//   ]

//    const { data, isLoading, error }  = useProfile()

  

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="card mb-6">
//         {/* Cover Photo */}
//         <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-700 rounded-t-lg mb-20 relative">
//           <button className="absolute top-4 right-4 btn-secondary flex items-center gap-2">
//             <Edit className="w-4 h-4" />
//             Edit Cover
//           </button>
//         </div>

//         {/* Profile Info */}
//         <div className="px-6 pb-6">
//           <div className="flex items-start justify-between mb-6">
//             <div className="flex items-start gap-4">
//               <div className="w-32 h-32 bg-primary-500 rounded-full flex items-center justify-center text-white text-4xl font-bold -mt-16 border-4 border-white">
//                 {profileData.name.charAt(0)}
//               </div>
//               <div className="pt-4">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-1">{profileData.name}</h1>
//                 <p className="text-gray-600 mb-2">{profileData.username}</p>
//                 <p className="text-gray-700">{profileData.bio}</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsEditing(!isEditing)}
//               className="btn-primary flex items-center gap-2"
//             >
//               <Edit className="w-4 h-4" />
//               {isEditing ? 'Save' : 'Edit Profile'}
//             </button>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-4 gap-4 mb-6">
//             {stats.map((stat) => (
//               <div key={stat.label} className="text-center">
//                 <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
//                 <div className="text-sm text-gray-600">{stat.label}</div>
//               </div>
//             ))}
//           </div>

//           {/* Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <MapPin className="w-5 h-5 text-gray-400" />
//                 <span className="text-gray-700">{profileData.location}</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <GraduationCap className="w-5 h-5 text-gray-400" />
//                 <span className="text-gray-700">{profileData.school}</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Calendar className="w-5 h-5 text-gray-400" />
//                 <span className="text-gray-700">Joined {profileData.joinDate}</span>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <Mail className="w-5 h-5 text-gray-400" />
//                 <span className="text-gray-700">{profileData.email}</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Phone className="w-5 h-5 text-gray-400" />
//                 <span className="text-gray-700">{profileData.phone}</span>
//               </div>
//               <div className="text-gray-700">
//                 <span className="font-medium">Major:</span> {profileData.major} • {profileData.year}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="card">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
//         <div className="space-y-4">
//           {[1, 2, 3].map((item) => (
//             <div key={item} className="p-4 border border-gray-200 rounded-lg">
//               <div className="flex items-start gap-3">
//                 <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
//                   {profileData.name.charAt(0)}
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-gray-700">
//                     <span className="font-medium">{profileData.name}</span> shared a new post
//                   </p>
//                   <p className="text-sm text-gray-500 mt-1">2 hours ago</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }


// import { useState, useEffect } from 'react'
// import { useAuthStore } from '../store/useAuthStore'
// import { Edit, MapPin, Calendar, Mail, Phone, GraduationCap, Settings, User } from 'lucide-react'
// import { useProfile } from '../hooks/useAuth'

// // Skeleton Loading Component
// const ProfileSkeleton = () => (
//   <div className="max-w-4xl mx-auto animate-pulse">
//     <div className="card mb-6">
//       {/* Cover Photo Skeleton */}
//       <div className="h-48 bg-gray-200 rounded-t-lg mb-20 relative"></div>

//       {/* Profile Info Skeleton */}
//       <div className="px-6 pb-6">
//         <div className="flex items-start justify-between mb-6">
//           <div className="flex items-start gap-4">
//             <div className="w-32 h-32 bg-gray-300 rounded-full -mt-16 border-4 border-white"></div>
//             <div className="pt-4 flex-1">
//               <div className="h-8 bg-gray-300 rounded w-48 mb-3"></div>
//               <div className="h-4 bg-gray-300 rounded w-32 mb-3"></div>
//               <div className="h-4 bg-gray-300 rounded w-64 mb-2"></div>
//               <div className="h-4 bg-gray-300 rounded w-56"></div>
//             </div>
//           </div>
//           <div className="h-10 bg-gray-300 rounded w-32"></div>
//         </div>

//         {/* Stats Skeleton */}
//         <div className="grid grid-cols-4 gap-4 mb-6">
//           {[1, 2, 3, 4].map((item) => (
//             <div key={item} className="text-center">
//               <div className="h-7 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
//               <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
//             </div>
//           ))}
//         </div>

//         {/* Details Skeleton */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             {[1, 2, 3].map((item) => (
//               <div key={item} className="flex items-center gap-3">
//                 <div className="w-5 h-5 bg-gray-300 rounded"></div>
//                 <div className="h-4 bg-gray-300 rounded w-40"></div>
//               </div>
//             ))}
//           </div>
//           <div className="space-y-4">
//             {[1, 2, 3].map((item) => (
//               <div key={item} className="flex items-center gap-3">
//                 <div className="w-5 h-5 bg-gray-300 rounded"></div>
//                 <div className="h-4 bg-gray-300 rounded w-40"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Recent Activity Skeleton */}
//     <div className="card">
//       <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
//       <div className="space-y-4">
//         {[1, 2, 3].map((item) => (
//           <div key={item} className="p-4 border border-gray-200 rounded-lg">
//             <div className="flex items-start gap-3">
//               <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
//               <div className="flex-1">
//                 <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
//                 <div className="h-3 bg-gray-300 rounded w-24"></div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// )

// // Error Display Component
// const ErrorDisplay = ({ error, onRetry }) => (
//   <div className="max-w-4xl mx-auto">
//     <div className="card p-8 text-center">
//       <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//         <User className="w-8 h-8 text-red-500" />
//       </div>
//       <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Profile</h2>
//       <p className="text-gray-600 mb-4">{error?.message || 'An error occurred while loading your profile'}</p>
//       <button
//         onClick={onRetry}
//         className="btn-primary"
//       >
//         Try Again
//       </button>
//     </div>
//   </div>
// )

// export default function Profile() {
//   const { user } = useAuthStore()
//   const [isEditing, setIsEditing] = useState(false)
//   const [profileData, setProfileData] = useState({
//     name: 'John Doe',
//     username: '@johndoe',
//     bio: 'Computer Science student passionate about technology and innovation.',
//     location: 'Boston, MA',
//     email: 'john.doe@university.edu',
//     phone: '(555) 123-4567',
//     school: 'Harvard University',
//     major: 'Computer Science',
//     year: 'Junior',
//     joinDate: 'September 2022'
//   })

//   const { data, isLoading, error, refetch } = useProfile()
//   const apiData = data ? { ...data.user , profile_picture: data.profile_picture} : null
//   // Update profile data when API data is available
//   useEffect(() => {
//     if (apiData) {
//       // Map API data to your profile structure
//       setProfileData(prev => ({
//         ...prev,
//         name: apiData.full_name || apiData.name || 'User',
//         email: apiData.email || prev.email,
//         // Generate username from email if not provided
//         username: apiData.username || `@${(apiData.email || '').split('@')[0]}` || prev.username,
//         bio: apiData.bio || apiData.bio || prev.bio,
//         // Add other fields from API as needed
//         location: apiData.location || prev.location,
//         phone: apiData.phone || prev.phone,
//         school: apiData.school || apiData.university || prev.school,
//         major: apiData.major || apiData.field_of_study || prev.major,
//         year: apiData.year || apiData.year_level || prev.year,
//         // Format join date
//         joinDate: apiData.created_at ? 
//           new Date(apiData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 
//           prev.joinDate
//       }))
//     }
//   }, [apiData])

//   // Use API data for stats if available
//   const stats = [
//     { label: 'Posts', value: apiData?.post_count || 42 },
//     { label: 'Friends', value: apiData?.friends_count || 127 },
//     { label: 'Communities', value: apiData?.communities_count || 8 },
//     { label: 'Followers', value: apiData?.followers_count || 234 },
//   ]

//   // Show loading skeleton
//   if (isLoading) {
//     return <ProfileSkeleton />
//   }

//   // Show error display
//   if (error) {
//     return <ErrorDisplay error={error} onRetry={refetch} />
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="card mb-6">
//         {/* Cover Photo */}
//         <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-700 rounded-t-lg mb-20 relative">
//           <button className="absolute top-4 right-4 btn-secondary flex items-center gap-2">
//             <Edit className="w-4 h-4" />
//             Edit Cover
//           </button>
          
//           {/* Show profile picture from API if available */}
//           {apiData?.profile_picture && (
//             <img 
//               src={apiData.profile_picture} 
//               alt={profileData.name}
//               className="w-32 h-32 rounded-full border-4 border-white absolute -bottom-16 left-6 object-cover"
//             />
//           )}
//         </div>

//         {/* Profile Info */}
//         <div className="px-6 pb-6">
//           <div className="flex items-start justify-between mb-6">
//             <div className="flex items-start gap-4">
//               {/* Fallback to initial if no profile picture */}
//               {!apiData?.profile_picture && (
//                 <div className="w-32 h-32 bg-primary-500 rounded-full flex items-center justify-center text-white text-4xl font-bold -mt-16 border-4 border-white">
//                   {profileData.name.charAt(0)}
//                 </div>
//               )}
//               <div className="pt-4">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-1">{profileData.name}</h1>
//                 <p className="text-gray-600 mb-2">{profileData.username}</p>
//                 <p className="text-gray-700">{profileData.bio}</p>
                
//                 {/* Show user type from API if available */}
//                 {apiData?.userType && (
//                   <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
//                     {apiData.userType.charAt(0).toUpperCase() + apiData.userType.slice(1)}
//                   </span>
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={() => setIsEditing(!isEditing)}
//               className="btn-primary flex items-center gap-2"
//             >
//               <Edit className="w-4 h-4" />
//               {isEditing ? 'Save' : 'Edit Profile'}
//             </button>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-4 gap-4 mb-6">
//             {stats.map((stat) => (
//               <div key={stat.label} className="text-center">
//                 <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
//                 <div className="text-sm text-gray-600">{stat.label}</div>
//               </div>
//             ))}
//           </div>

//           {/* Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <MapPin className="w-5 h-5 text-gray-400" />
//                 <span className="text-gray-700">{profileData.location}</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <GraduationCap className="w-5 h-5 text-gray-400" />
//                 <span className="text-gray-700">{profileData.school}</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Calendar className="w-5 h-5 text-gray-400" />
//                 <span className="text-gray-700">Joined {profileData.joinDate}</span>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <Mail className="w-5 h-5 text-gray-400" />
//                 <span className="text-gray-700">{profileData.email}</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Phone className="w-5 h-5 text-gray-400" />
//                 <span className="text-gray-700">{profileData.phone}</span>
//               </div>
//               <div className="text-gray-700">
//                 <span className="font-medium">Major:</span> {profileData.major} • {profileData.year}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="card">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
//         <div className="space-y-4">
//           {[1, 2, 3].map((item) => (
//             <div key={item} className="p-4 border border-gray-200 rounded-lg">
//               <div className="flex items-start gap-3">
//                 <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
//                   {profileData.name.charAt(0)}
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-gray-700">
//                     <span className="font-medium">{profileData.name}</span> shared a new post
//                   </p>
//                   <p className="text-sm text-gray-500 mt-1">2 hours ago</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }



import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { 
  Edit, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  GraduationCap, 
  Camera,
  X,
  Check,
  Upload,
  Image
} from 'lucide-react'
import { useProfile, useUpdateProfile } from '../hooks/useAuth'
import {useProfilePicture} from '../hooks/useProfilePicture'

// Skeleton Loading Component
const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto animate-pulse">
    <div className="card mb-6">
      <div className="h-48 bg-gray-200 rounded-t-lg mb-20 relative"></div>
      <div className="px-6 pb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-32 h-32 bg-gray-300 rounded-full -mt-16 border-4 border-white"></div>
            <div className="pt-4 flex-1">
              <div className="h-8 bg-gray-300 rounded w-48 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-32 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-56"></div>
            </div>
          </div>
          <div className="h-10 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="text-center">
              <div className="h-7 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-40"></div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-40"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Error Display Component
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="max-w-4xl mx-auto">
    <div className="card p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <X className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Profile</h2>
      <p className="text-gray-600 mb-4">{error?.message || 'An error occurred while loading your profile'}</p>
      <button onClick={onRetry} className="btn-primary">Try Again</button>
    </div>
  </div>
)

// Profile Picture Upload Component
const ProfilePictureUpload = ({ 
  currentPicture, 
  onUpload, 
  onRemove,
  isUploading 
}) => {
  const fileInputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (file) => {
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, GIF, etc.)')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB')
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreviewUrl(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    handleFileSelect(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleUpload = async () => {
    if (selectedFile && onUpload) {
      await onUpload(selectedFile)
      setSelectedFile(null)
      setPreviewUrl('')
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl('')
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative">
      {/* Current Profile Picture */}
      <div className="relative group">
        <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-2 sm:border-4 border-white overflow-hidden bg-gradient-to-r from-primary-500 to-primary-700">
          {currentPicture ? (
            <img 
              src={currentPicture} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl font-bold">
              {currentPicture ? '' : '?'}
            </div>
          )}
        </div>
        
        {/* Upload Button Overlay */}
        <button
          onClick={triggerFileInput}
          className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Camera className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
        </button>
      </div>

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Preview Profile Picture</h3>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview */}
            <div className="mb-6">
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                {selectedFile.name} • {(selectedFile.size / 1024).toFixed(0)}KB
              </p>
            </div>

            {/* Upload Controls */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="btn-primary flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Picture
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Picture Button */}
      {currentPicture && (
        <button
          onClick={onRemove}
          className="mt-3 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          disabled={isUploading}
        >
          <X className="w-4 h-4" />
          Remove Picture
        </button>
      )}
    </div>
  )
}

// Main Profile Component
export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
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
  
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const { data: apiData, isLoading, error, refetch } = useProfile()
  const { mutate: updateProfile } = useUpdateProfile()
  const { 
  uploadProfilePicture, 
  removeProfilePicture, 
  isUploading: isPictureUploading,
  error: pictureError,
  success: pictureSuccess,
  resetState 
} = useProfilePicture()

  // Update profile data when API data is available
  useEffect(() => {
    if (apiData) {
      setProfileData(prev => ({
        ...prev,
        name: apiData.full_name || apiData.name || 'User',
        email: apiData.email || prev.email,
        username: apiData.username || `@${(apiData.email || '').split('@')[0]}` || prev.username,
        bio: apiData.bio || apiData.bio || prev.bio,
        location: apiData.location || prev.location,
        phone: apiData.phone || prev.phone,
        school: apiData.school || apiData.university || prev.school,
        major: apiData.major || apiData.field_of_study || prev.major,
        year: apiData.year || apiData.year_level || prev.year,
        joinDate: apiData.created_at ? 
          new Date(apiData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 
          prev.joinDate
      }))
    }
  }, [apiData])

  // Handle profile picture upload
  const handleUploadProfilePicture = async (file) => {
       await uploadProfilePicture(file)
  }

  // Handle remove profile picture
  const handleRemoveProfilePicture = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return

    await removeProfilePicture()

  }

  // Handle save edited profile
  const handleSaveProfile = () => {
    const profileUpdate = {
      full_name: profileData.name,
      bio: profileData.bio,
      location: profileData.location,
      phone: profileData.phone,
      school: profileData.school,
      major: profileData.major,
      year: profileData.year,
    }

    updateProfile(profileUpdate, {
      onSuccess: () => {
        setIsEditing(false)
        refetch() // Refresh profile data
      },
      onError: (error) => {
        console.error('Profile update error:', error)
        alert(error.response?.data?.message || 'Failed to update profile')
      }
    })
  }

  // Use API data for stats if available
  const stats = [
    { label: 'Posts', value: apiData?.post_count || 42 },
    { label: 'Friends', value: apiData?.friends_count || 127 },
    { label: 'Communities', value: apiData?.communities_count || 8 },
    { label: 'Followers', value: apiData?.followers_count || 234 },
  ]

  // Get current profile picture from API or auth store
  const currentProfilePicture = apiData?.profile_picture || user?.profilePicture

  // Show loading skeleton
  if (isLoading) {
    return <ProfileSkeleton />
  }

  // Show error display
  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 pb-20 lg:pb-6">
      {/* Upload Status Messages */}
      {uploadSuccess && (
        <div className="mb-3 lg:mb-4 p-2.5 lg:p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm lg:text-base">
          <Check className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
          <span>Profile picture updated successfully!</span>
        </div>
      )}
      
      {uploadError && (
        <div className="mb-3 lg:mb-4 p-2.5 lg:p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm lg:text-base">
          <X className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      <div className="card mb-4 lg:mb-6">
        {/* Cover Photo */}
        <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-r from-primary-500 to-primary-700 rounded-t-lg mb-16 sm:mb-20 relative overflow-hidden">
          <button className="absolute top-2 right-2 sm:top-4 sm:right-4 btn-secondary flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm px-2 lg:px-4 py-1.5 lg:py-2">
            <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Edit Cover</span>
          </button>
          
          {/* Profile Picture Upload Component */}
          <div className="absolute -bottom-12 sm:-bottom-16 left-3 sm:left-6">
            <ProfilePictureUpload
              currentPicture={currentProfilePicture}
              onUpload={handleUploadProfilePicture}
              onRemove={handleRemoveProfilePicture}
              isUploading={isUploading}
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-3 sm:px-4 lg:px-6 pb-4 lg:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 lg:mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 sm:ml-28 lg:ml-36 w-full sm:w-auto">
              <div className="pt-0 sm:pt-4 w-full sm:w-auto">
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 bg-gray-50 border border-gray-300 rounded px-2 lg:px-3 py-1 w-full sm:w-auto"
                  />
                ) : (
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{profileData.name}</h1>
                )}
                <p className="text-sm lg:text-base text-gray-600 mb-2">{profileData.username}</p>
                
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    className="w-full text-sm lg:text-base text-gray-700 bg-gray-50 border border-gray-300 rounded px-2 lg:px-3 py-2"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm lg:text-base text-gray-700 break-words">{profileData.bio}</p>
                )}
                
                {/* Show user type from API if available */}
                {apiData?.userType && (
                  <span className="inline-block mt-2 px-2 lg:px-3 py-1 bg-primary-100 text-primary-700 text-xs lg:text-sm font-medium rounded-full">
                    {apiData.userType.charAt(0).toUpperCase() + apiData.userType.slice(1)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-sm lg:text-base px-4 py-2 lg:py-2"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  <span>{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
                </>
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-2 lg:p-0">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs lg:text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-start gap-2 lg:gap-3">
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    className="text-sm lg:text-base text-gray-700 bg-gray-50 border border-gray-300 rounded px-2 lg:px-3 py-1 w-full"
                  />
                ) : (
                  <span className="text-sm lg:text-base text-gray-700 break-words">{profileData.location}</span>
                )}
              </div>
              <div className="flex items-start gap-2 lg:gap-3">
                <GraduationCap className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.school}
                    onChange={(e) => setProfileData({...profileData, school: e.target.value})}
                    className="text-sm lg:text-base text-gray-700 bg-gray-50 border border-gray-300 rounded px-2 lg:px-3 py-1 w-full"
                  />
                ) : (
                  <span className="text-sm lg:text-base text-gray-700 break-words">{profileData.school}</span>
                )}
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm lg:text-base text-gray-700">Joined {profileData.joinDate}</span>
              </div>
            </div>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-start gap-2 lg:gap-3">
                <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm lg:text-base text-gray-700 break-words break-all">{profileData.email}</span>
              </div>
              <div className="flex items-start gap-2 lg:gap-3">
                <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="text-sm lg:text-base text-gray-700 bg-gray-50 border border-gray-300 rounded px-2 lg:px-3 py-1 w-full"
                  />
                ) : (
                  <span className="text-sm lg:text-base text-gray-700">{profileData.phone}</span>
                )}
              </div>
              <div className="text-sm lg:text-base text-gray-700">
                <span className="font-medium">Major:</span>
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-2 mt-1">
                    <input
                      type="text"
                      value={profileData.major}
                      onChange={(e) => setProfileData({...profileData, major: e.target.value})}
                      className="text-sm lg:text-base text-gray-700 bg-gray-50 border border-gray-300 rounded px-2 lg:px-3 py-1 w-full sm:w-32"
                    />
                    <select
                      value={profileData.year}
                      onChange={(e) => setProfileData({...profileData, year: e.target.value})}
                      className="text-sm lg:text-base text-gray-700 bg-gray-50 border border-gray-300 rounded px-2 lg:px-3 py-1 w-full sm:w-auto"
                    >
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>
                ) : (
                  <span className="ml-1">{profileData.major} • {profileData.year}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">Recent Activity</h2>
        <div className="space-y-3 lg:space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-3 lg:p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base flex-shrink-0">
                  {profileData.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm lg:text-base text-gray-700 break-words">
                    <span className="font-medium">{profileData.name}</span> shared a new post
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}