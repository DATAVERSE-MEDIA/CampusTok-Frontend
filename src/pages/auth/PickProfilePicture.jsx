// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuthStore } from '../../store/useAuthStore'
// import { Camera, Upload } from 'lucide-react'

// export default function PickProfilePicture() {
//   const navigate = useNavigate()
//   const { emailVerified } = useAuthStore()
//   const [selectedImage, setSelectedImage] = useState(null)
//   const [preview, setPreview] = useState(null)

//   if (!emailVerified) {
//     navigate('/verify-email')
//     return null
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setSelectedImage(file)
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setPreview(reader.result)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleNext = () => {
//     navigate('/login')
//   }

//   const handleSkip = () => {
//     navigate('/login') ;// /welcome
//   }


 

//   return (
//     <div className="min-h-screen flex bg-black">
//       {/* Left Panel - Primary Color */}
//       <div className="w-2/5 bg-primary rounded-r-3xl flex items-center justify-center">
//         <h1 className="text-6xl font-bold text-white">CampusTOK</h1>
//       </div>

//       {/* Right Panel - Light Gray */}
//       <div className="flex-1 bg-gray-100 flex items-center justify-center p-12">
//         <div className="w-full max-w-md">
//           <div className='w-full flex flex-col justify-center items-center'>
//             <h2 className="text-3xl font-bold text-gray-900 mb-3">Pick a profile picture.</h2>
//             <p className="text-gray-600 mb-8">Have a favorite selfie, upload it here.</p>
//           </div>

//           <div className="mb-8">
//             <label className="block">
//               <div className="w-64 h-64 mx-auto border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
//                 {preview ? (
//                   <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
//                 ) : (
//                   <>
//                     <Camera className="w-12 h-12 text-gray-400 mb-2" />
//                     <span className="text-gray-600 font-medium">Upload</span>
//                   </>
//                 )}
//               </div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>
//           </div>

//           <div className="space-y-3">
//             <button
//               onClick={handleNext}
//               className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors"
//             >
//               next
//             </button>
//             <button
//               onClick={handleSkip}
//               className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//             >
//               Skip for now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { Camera, Upload, Check, X, Loader2 } from 'lucide-react'
import { useProfilePicture } from '../../hooks/useProfilePicture'

export default function PickProfilePicture() {
  const navigate = useNavigate()
  const { emailVerified } = useAuthStore()
  const fileInputRef = useRef(null)
  
  // Use the profile picture hook
  const {
    uploadProfilePicture,
    isUploading,
    error,
    success,
    resetState
  } = useProfilePicture()

  const [selectedImage, setSelectedImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('idle') // idle, uploading, success, error

  if (!emailVerified) {
    // navigate('/verify-email')
    // return null
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, GIF, etc.)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setSelectedImage(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Reset any previous upload status
    resetState()
    setUploadStatus('idle')
  }

  const handleUpload = async () => {
    if (!selectedImage) {
      alert('Please select an image first')
      return
    }

    try {
      setUploadStatus('uploading')
      
      // Upload the image using the hook
      await uploadProfilePicture(selectedImage)
      
      setUploadStatus('success')
      
      // Navigate after successful upload (optional delay for user to see success)
      setTimeout(() => {
        navigate('/login')
      }, 1500)
      
    } catch (err) {
      setUploadStatus('error')
      console.error('Upload failed:', err)
    }
  }

  const handleNext = async () => {
    // If an image is selected, upload it first
    if (selectedImage) {
      await handleUpload()
    } else {
      // If no image selected, just navigate
      navigate('/login')
    }
  }

  const handleSkip = () => {
    navigate('/login') // /welcome
  }

  const triggerFileInput = () => {
    // Prevent multiple clicks
    if (isUploading) return;
    
    // Clear the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Trigger click on the input
    fileInputRef.current?.click();
  }

  const removeSelectedImage = () => {
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setSelectedImage(null)
    setPreview(null)
    resetState()
    setUploadStatus('idle')
  }

  // Upload status messages
  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading your profile picture...'
      case 'success':
        return 'Profile picture uploaded successfully!'
      case 'error':
        return error || 'Failed to upload picture. Please try again.'
      default:
        return null
    }
  }

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="w-5 h-5 animate-spin" />
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />
      case 'error':
        return <X className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Panel - Primary Color */}
      <div className="w-2/5 bg-primary rounded-r-3xl flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white">CampusTOK</h1>
      </div>

      {/* Right Panel - Light Gray */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className='w-full flex flex-col justify-center items-center'>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Pick a profile picture.</h2>
            <p className="text-gray-600 mb-8">Have a favorite selfie, upload it here.</p>
          </div>

          {/* Upload Status Display */}
          {(uploadStatus === 'uploading' || uploadStatus === 'success' || uploadStatus === 'error') && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              uploadStatus === 'uploading' ? 'bg-blue-50 text-blue-700' :
              uploadStatus === 'success' ? 'bg-green-50 text-green-700' :
              'bg-red-50 text-red-700'
            }`}>
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusMessage()}</span>
            </div>
          )}

          <div className="mb-8">
            {/* Change this to use onClick on the div instead of relying on label */}
            <div 
              onClick={triggerFileInput}
              className="w-64 h-64 mx-auto border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors relative"
            >
              {preview ? (
                <>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg" 
                  />
                  {/* Overlay with change option */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="w-8 h-8 mx-auto mb-1" />
                      <span className="text-sm">Change Photo</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Camera className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-gray-600 font-medium">Upload Photo</span>
                  <span className="text-gray-400 text-xs mt-1">JPG, PNG, GIF up to 5MB</span>
                </>
              )}
              
              {/* Remove the label wrapper and put input separately */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isUploading}
              />
            </div>

            {/* Selected file info */}
            {selectedImage && (
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">
                  Selected: <span className="font-medium">{selectedImage.name}</span>
                  <span className="text-gray-400 ml-2">
                    ({(selectedImage.size / 1024).toFixed(0)} KB)
                  </span>
                </p>
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  disabled={isUploading}
                  className="mt-1 text-sm text-red-600 hover:text-red-700 disabled:text-gray-400"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleNext}
              disabled={isUploading}
              className="w-full bg-primary hover:bg-primary-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : selectedImage ? (
                'Upload & Continue'
              ) : (
                'Continue without photo'
              )}
            </button>
            
            <button
              onClick={handleSkip}
              disabled={isUploading}
              className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}