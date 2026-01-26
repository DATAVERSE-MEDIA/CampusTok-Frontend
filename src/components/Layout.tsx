// import { useState } from 'react'
// import { Outlet } from 'react-router-dom'
// import Sidebar from './Sidebar'
// import TopNav from './TopNav'
// import CreatePostModal from './CreatePostModal';

// export default function Layout() {
//    const [sidebarOpen, setSidebarOpen] = useState(false);
//    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

//     const handlePostCreated = () => {
//     // Refresh posts or show success message
//     console.log('Post created successfully!');
//     // You might want to trigger a refetch of posts here
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex max-h-screen">
//       {/* Sidebar - Hidden on mobile, shown on desktop */}
//       <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen}  onCreatePostClick={() => setIsCreatePostModalOpen(true)}/>
      
//       {/* Main Content */}
//       <div className="flex-1 flex flex-col w-full lg:w-auto">
//         <TopNav />
//         <main className="flex-1 overflow-y-auto bg-white pb-16 lg:pb-0">
//           <Outlet />
//         </main>
//       </div>

//       <CreatePostModal
//         isOpen={isCreatePostModalOpen}
//         onClose={() => setIsCreatePostModalOpen(false)}
//         onPostCreated={handlePostCreated}
//       />
      
//       {/* Overlay for mobile sidebar */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </div>
//   )
// }



// components/Layout.tsx
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import CreatePostModal from './CreatePostModal'
import { usePostMutations } from '../hooks/usePosts'
import { useAppStore } from '../store/useAppStore'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)
  
  // Use the createPost mutation
  const { createPost } = usePostMutations()
  const { selectedSchool } = useAppStore()

  const handlePostCreated = async (postData: { 
    content: string; 
    privacy: "public" | "school_only" | "followers_only";
    post_type: "post" | "reel";
    is_school_scope: boolean;
    images?: File[];
    video?: File;
  }) => {
    try {
      await createPost.mutateAsync({
        content: postData.content,
        privacy: postData.privacy,
        post_type: postData.post_type,
        is_school_scope: postData.is_school_scope,
        school_id: selectedSchool?.id,
        images: postData.images,
        video: postData.video,
      })
      
      console.log('Post created successfully!')
      setIsCreatePostModalOpen(false)
      
      // You can show a toast notification here
      // toast.success('Post created successfully!')
    } catch (error) {
      console.error('Error creating post:', error)
      // toast.error('Failed to create post')
      // Note: Error is already handled in the mutation
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex max-h-screen">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}  
        onCreatePostClick={() => setIsCreatePostModalOpen(true)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <TopNav />
        <main className="flex-1 overflow-y-auto bg-white pb-16 lg:pb-0">
          <Outlet />
        </main>
      </div>

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}