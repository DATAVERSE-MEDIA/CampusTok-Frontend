// import { useState, useRef } from "react";
// import {
//   X,
//   Image,
//   Video,
//   Globe,
//   Users,
//   Lock,
//   School,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   Upload,
// } from "lucide-react";
// import { apiClient } from "../api";
// import { useAuthStore } from "../store/useAuthStore";
// import { useAppStore } from "../store/useAppStore";

// interface CreatePostModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onPostCreated?: () => void;
// }

// const privacyOptions = [
//   { value: "public", label: "Public", icon: Globe, description: "Visible to everyone" },
//   { value: "school_only", label: "School Only", icon: School, description: "Only members of your school" },
//   { value: "followers_only", label: "Followers Only", icon: Users, description: "Only your followers" },
// ];

// const postTypeOptions = [
//   { value: "post", label: "Post", description: "Regular post" },
//   { value: "reel", label: "Reel", description: "Short video" },
// ];

// export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
//   const { user, userType } = useAuthStore();
//   const { selectedSchool } = useAppStore();
  
//   const [content, setContent] = useState("");
//   const [privacy, setPrivacy] = useState<"public" | "school_only" | "followers_only">("public");
//   const [postType, setPostType] = useState<"post" | "reel">("post");
//   const [isSchoolScope, setIsSchoolScope] = useState(true);
//   const [images, setImages] = useState<File[]>([]);
//   const [video, setVideo] = useState<File | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [progress, setProgress] = useState(0);
  
//   const imageInputRef = useRef<HTMLInputElement>(null);
//   const videoInputRef = useRef<HTMLInputElement>(null);

//   if (!isOpen) return null;

//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
    
//     // Validate file types
//     const validFiles = files.filter(file => 
//       file.type.startsWith('image/') && 
//       file.size <= 10 * 1024 * 1024 // 10MB max
//     );
    
//     if (validFiles.length !== files.length) {
//       setError("Some files were invalid. Only images under 10MB are allowed.");
//     }
    
//     setImages(prev => [...prev, ...validFiles]);
//   };

//   const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
    
//     // Validate video file
//     if (!file.type.startsWith('video/')) {
//       setError("Please select a video file");
//       return;
//     }
    
//     if (file.size > 100 * 1024 * 1024) { // 100MB max for videos
//       setError("Video size must be less than 100MB");
//       return;
//     }
    
//     setVideo(file);
//     setPostType("reel");
//   };

//   const removeImage = (index: number) => {
//     setImages(prev => prev.filter((_, i) => i !== index));
//   };

//   const removeVideo = () => {
//     setVideo(null);
//     setPostType("post");
//     if (videoInputRef.current) {
//       videoInputRef.current.value = "";
//     }
//   };

//   const triggerImageInput = () => {
//     imageInputRef.current?.click();
//   };

//   const triggerVideoInput = () => {
//     videoInputRef.current?.click();
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!content.trim()) {
//       setError("Please enter some content for your post");
//       return;
//     }

//     if (postType === "reel" && !video) {
//       setError("Please select a video for your reel");
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
//     setSuccess(false);
//     setProgress(0);

//     try {
//       const formData = new FormData();
      
//       // Add text fields
//       formData.append("content", content);
//       formData.append("privacy", privacy);
//       formData.append("post_type", postType);
//       formData.append("is_school_scope", isSchoolScope.toString());
      
//       // Add school scope if applicable
//       if (selectedSchool?.id && isSchoolScope) {
//         formData.append("school_id", selectedSchool.id.toString());
//       }

//       // Add images
//       images.forEach((image, index) => {
//         formData.append(`images`, image);
//       });

//       // Add video if it's a reel
//       if (postType === "reel" && video) {
//         formData.append("video", video);
//       }

//       // Simulate progress for better UX
//       const progressInterval = setInterval(() => {
//         setProgress(prev => Math.min(prev + 10, 90));
//       }, 100);

//       const response = await apiClient.post("/posts", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         onUploadProgress: (progressEvent) => {
//           if (progressEvent.total) {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setProgress(percentCompleted);
//           }
//         },
//       });

//       clearInterval(progressInterval);
//       setProgress(100);

//       setSuccess(true);
      
//       // Reset form
//       setTimeout(() => {
//         resetForm();
//         onPostCreated?.();
//         onClose();
//       }, 1500);

//     } catch (err: any) {
//       console.error("Error creating post:", err);
//       setError(
//         err.response?.data?.detail || 
//         err.response?.data?.message || 
//         err.message || 
//         "Failed to create post. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//       setTimeout(() => setProgress(0), 1000);
//     }
//   };

//   const resetForm = () => {
//     setContent("");
//     setPrivacy("public");
//     setPostType("post");
//     setIsSchoolScope(true);
//     setImages([]);
//     setVideo(null);
//     setError(null);
//     setSuccess(false);
//     setProgress(0);
    
//     if (imageInputRef.current) imageInputRef.current.value = "";
//     if (videoInputRef.current) videoInputRef.current.value = "";
//   };

//   const handleClose = () => {
//     if (!isSubmitting) {
//       resetForm();
//       onClose();
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
//       <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
//           <button
//             onClick={handleClose}
//             disabled={isSubmitting}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
//           >
//             <X className="w-5 h-5 text-gray-700" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-4 lg:p-6">
//           {/* Success Message */}
//           {success && (
//             <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
//               <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//               <p className="text-sm text-green-700 flex-1">Post created successfully!</p>
//             </div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
//               <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//               <p className="text-sm text-red-700 flex-1">{error}</p>
//             </div>
//           )}

//           {/* Progress Bar */}
//           {isSubmitting && progress > 0 && (
//             <div className="mb-4">
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-primary h-2 rounded-full transition-all duration-300"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//               <p className="text-xs text-gray-500 mt-1 text-center">
//                 {progress < 100 ? "Uploading..." : "Processing..."}
//               </p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Content Textarea */}
//             <div>
//               <textarea
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 placeholder="What's on your mind?"
//                 className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm lg:text-base"
//                 disabled={isSubmitting}
//                 maxLength={1000}
//               />
//               <div className="text-xs text-gray-500 text-right mt-1">
//                 {content.length}/1000 characters
//               </div>
//             </div>

//             {/* Media Preview */}
//             <div className="space-y-3">
//               {/* Images Preview */}
//               {images.length > 0 && (
//                 <div className="grid grid-cols-3 gap-2">
//                   {images.map((image, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={URL.createObjectURL(image)}
//                         alt={`Preview ${index + 1}`}
//                         className="w-full h-24 object-cover rounded-lg"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(index)}
//                         disabled={isSubmitting}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Video Preview */}
//               {video && (
//                 <div className="relative">
//                   <video
//                     src={URL.createObjectURL(video)}
//                     controls
//                     className="w-full h-48 object-cover rounded-lg"
//                   />
//                   <button
//                     type="button"
//                     onClick={removeVideo}
//                     disabled={isSubmitting}
//                     className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Privacy Settings */}
//             <div className="space-y-3">
//               <h3 className="font-medium text-gray-900">Privacy</h3>
//               <div className="grid grid-cols-3 gap-2">
//                 {privacyOptions.map((option) => {
//                   const Icon = option.icon;
//                   const isSelected = privacy === option.value;
//                   return (
//                     <button
//                       key={option.value}
//                       type="button"
//                       onClick={() => setPrivacy(option.value as any)}
//                       disabled={isSubmitting}
//                       className={`p-3 rounded-lg border transition-all text-center ${
//                         isSelected
//                           ? "border-primary-600 bg-primary-50"
//                           : "border-gray-200 bg-white hover:border-gray-300"
//                       } disabled:opacity-50`}
//                     >
//                       <Icon className="w-5 h-5 mx-auto mb-1 text-gray-600" />
//                       <div className="text-xs font-medium">{option.label}</div>
//                       <div className="text-xs text-gray-500 mt-0.5 truncate">
//                         {option.description}
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Post Type */}
//             <div className="space-y-3">
//               <h3 className="font-medium text-gray-900">Post Type</h3>
//               <div className="grid grid-cols-2 gap-2">
//                 {postTypeOptions.map((option) => (
//                   <button
//                     key={option.value}
//                     type="button"
//                     onClick={() => setPostType(option.value as any)}
//                     disabled={isSubmitting}
//                     className={`p-3 rounded-lg border transition-all text-center ${
//                       postType === option.value
//                         ? "border-primary-600 bg-primary-50"
//                         : "border-gray-200 bg-white hover:border-gray-300"
//                     } disabled:opacity-50`}
//                   >
//                     <div className="text-sm font-medium">{option.label}</div>
//                     <div className="text-xs text-gray-500 mt-0.5">
//                       {option.description}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* School Scope (for students/institutions) */}
//             {(userType === "student" || userType === "institution") && selectedSchool && (
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
//                     {selectedSchool.logo ? (
//                       <img
//                         src={selectedSchool.logo}
//                         alt={selectedSchool.name}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-blue-100 flex items-center justify-center">
//                         <School className="w-5 h-5 text-blue-600" />
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <div className="font-medium text-sm">{selectedSchool.name}</div>
//                     <div className="text-xs text-gray-500">{selectedSchool.code}</div>
//                   </div>
//                 </div>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={isSchoolScope}
//                     onChange={(e) => setIsSchoolScope(e.target.checked)}
//                     disabled={isSubmitting}
//                     className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
//                   />
//                   <span className="text-sm text-gray-700">School Scope</span>
//                 </label>
//               </div>
//             )}
//           </form>
//         </div>

//         {/* Footer */}
//         <div className="p-4 lg:p-6 border-t border-gray-200">
//           <div className="flex items-center gap-2 mb-4">
//             {/* Image Upload Button */}
//             <button
//               type="button"
//               onClick={triggerImageInput}
//               disabled={isSubmitting || postType === "reel"}
//               className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               title="Add Images"
//             >
//               <Image className="w-5 h-5" />
//             </button>
//             <input
//               ref={imageInputRef}
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleImageSelect}
//               className="hidden"
//               disabled={isSubmitting || postType === "reel"}
//             />

//             {/* Video Upload Button */}
//             <button
//               type="button"
//               onClick={triggerVideoInput}
//               disabled={isSubmitting}
//               className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
//               title="Add Video"
//             >
//               <Video className="w-5 h-5" />
//             </button>
//             <input
//               ref={videoInputRef}
//               type="file"
//               accept="video/*"
//               onChange={handleVideoSelect}
//               className="hidden"
//               disabled={isSubmitting}
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             disabled={isSubmitting || !content.trim()}
//             className="w-full bg-primary hover:bg-primary-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 Creating Post...
//               </>
//             ) : (
//               <>
//                 <Upload className="w-4 h-4" />
//                 Create Post
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// components/CreatePostModal.tsx
import { useState, useRef } from "react";
import {
  X,
  Image,
  Video,
  Globe,
  Users,
  Lock,
  School,
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useAppStore } from "../store/useAppStore";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (postData: {
    content: string;
    privacy: "public" | "school_only" | "followers_only";
    post_type: "post" | "reel";
    is_school_scope: boolean;
    images?: File[];
    video?: File;
  }) => Promise<void>;
}

const privacyOptions = [
  { value: "public", label: "Public", icon: Globe, description: "Visible to everyone" },
  { value: "school_only", label: "School Only", icon: School, description: "Only members of your school" },
  { value: "followers_only", label: "Followers Only", icon: Users, description: "Only your followers" },
];

const postTypeOptions = [
  { value: "post", label: "Post", description: "Regular post" },
  { value: "reel", label: "Reel", description: "Short video" },
];

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const { user, userType } = useAuthStore();
  const { selectedSchool } = useAppStore();
  
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "school_only" | "followers_only">("public");
  const [postType, setPostType] = useState<"post" | "reel">("post");
  const [isSchoolScope, setIsSchoolScope] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      file.size <= 10 * 1024 * 1024 // 10MB max
    );
    
    if (validFiles.length !== files.length) {
      setError("Some files were invalid. Only images under 10MB are allowed.");
    }
    
    setImages(prev => [...prev, ...validFiles]);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate video file
    if (!file.type.startsWith('video/')) {
      setError("Please select a video file");
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) { // 100MB max for videos
      setError("Video size must be less than 100MB");
      return;
    }
    
    setVideo(file);
    setPostType("reel");
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
    setPostType("post");
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const triggerImageInput = () => {
    imageInputRef.current?.click();
  };

  const triggerVideoInput = () => {
    videoInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError("Please enter some content for your post");
      return;
    }

    if (postType === "reel" && !video) {
      setError("Please select a video for your reel");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    setProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Call the mutation through onPostCreated
      await onPostCreated({
        content,
        privacy,
        post_type: postType,
        is_school_scope: isSchoolScope,
        images: images.length > 0 ? images : undefined,
        video: postType === "reel" ? video : undefined,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error("Error creating post:", err);
      setError(
        err.response?.data?.detail || 
        err.response?.data?.message || 
        err.message || 
        "Failed to create post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const resetForm = () => {
    setContent("");
    setPrivacy("public");
    setPostType("post");
    setIsSchoolScope(true);
    setImages([]);
    setVideo(null);
    setError(null);
    setSuccess(false);
    setProgress(0);
    
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 flex-1">Post created successfully!</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 flex-1">{error}</p>
            </div>
          )}

          {/* Progress Bar */}
          {isSubmitting && progress > 0 && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {progress < 100 ? "Uploading..." : "Processing..."}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Content Textarea */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm lg:text-base"
                disabled={isSubmitting}
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {content.length}/1000 characters
              </div>
            </div>

            {/* Media Preview */}
            <div className="space-y-3">
              {/* Images Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        disabled={isSubmitting}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Video Preview */}
              {video && (
                <div className="relative">
                  <video
                    src={URL.createObjectURL(video)}
                    controls
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeVideo}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Privacy Settings */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Privacy</h3>
              <div className="grid grid-cols-3 gap-2">
                {privacyOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = privacy === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPrivacy(option.value as any)}
                      disabled={isSubmitting}
                      className={`p-3 rounded-lg border transition-all text-center ${
                        isSelected
                          ? "border-primary-600 bg-primary-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      } disabled:opacity-50`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                      <div className="text-xs font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate">
                        {option.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post Type */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Post Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {postTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPostType(option.value as any)}
                    disabled={isSubmitting}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      postType === option.value
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    } disabled:opacity-50`}
                  >
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* School Scope (for students/institutions) */}
            {(userType === "student" || userType === "institution") && selectedSchool && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {selectedSchool.logo ? (
                      <img
                        src={selectedSchool.logo}
                        alt={selectedSchool.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                        <School className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{selectedSchool.name}</div>
                    <div className="text-xs text-gray-500">{selectedSchool.code}</div>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSchoolScope}
                    onChange={(e) => setIsSchoolScope(e.target.checked)}
                    disabled={isSubmitting}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-700">School Scope</span>
                </label>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 lg:p-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            {/* Image Upload Button */}
            <button
              type="button"
              onClick={triggerImageInput}
              disabled={isSubmitting || postType === "reel"}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add Images"
            >
              <Image className="w-5 h-5" />
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              disabled={isSubmitting || postType === "reel"}
            />

            {/* Video Upload Button */}
            <button
              type="button"
              onClick={triggerVideoInput}
              disabled={isSubmitting}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Add Video"
            >
              <Video className="w-5 h-5" />
            </button>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              className="hidden"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="w-full bg-primary hover:bg-primary-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Post...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Create Post
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}