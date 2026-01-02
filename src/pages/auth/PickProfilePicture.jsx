import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { Camera, Upload } from 'lucide-react'

export default function PickProfilePicture() {
  const navigate = useNavigate()
  const { emailVerified } = useAuthStore()
  const [selectedImage, setSelectedImage] = useState(null)
  const [preview, setPreview] = useState(null)

  if (!emailVerified) {
    navigate('/verify-email')
    return null
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNext = () => {
    navigate('/welcome')
  }

  const handleSkip = () => {
    navigate('/welcome')
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
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Pick a profile picture.</h2>
          <p className="text-gray-600 mb-8">Have a favorite selfie, upload it here.</p>

          <div className="mb-8">
            <label className="block">
              <div className="w-64 h-64 mx-auto border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <>
                    <Camera className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-gray-600 font-medium">Upload</span>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleNext}
              className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors"
            >
              next
            </button>
            <button
              onClick={handleSkip}
              className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

