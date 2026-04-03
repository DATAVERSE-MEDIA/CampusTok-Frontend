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
import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import CreatePostModal from "./CreatePostModal";
import { usePostMutations } from "../hooks/usePosts";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { OPEN_CREATE_POST_EVENT } from "../utils/createPost";
import { SHOW_AUTH_NOTICE_EVENT } from "../utils/authNotice";
import {
  CREATE_POST_AUTH_NOTICE,
  DEFAULT_AUTH_NOTICE,
} from "../utils/authNoticeContent";
import {
  POST_LOGIN_ACTION_OPEN_CREATE_POST,
  clearStoredPostLoginAction,
  storePostLoginAction,
  storePostLoginRedirect,
} from "../utils/postLoginRedirect";
import { isUserSessionAuthenticated } from "../utils/sessionAuth";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [authNotice, setAuthNotice] = useState(null);
  const consumedPostLoginActionRef = useRef(null);

  // Use the createPost mutation
  const { createPost } = usePostMutations();
  const { selectedSchool, bumpFeedRefreshToken } = useAppStore();
  const { isAuthenticated } = useAuthStore();
  const canCreatePost = isUserSessionAuthenticated(isAuthenticated);

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
        // Ensure posts created while a school is selected
        // also appear under that institution's feed
        institution_id: selectedSchool?.id,
        images: postData.images,
        video: postData.video,
      });

      console.log("Post created successfully!");
      setIsCreatePostModalOpen(false);

      // Trigger dashboard feeds to refetch latest posts
      bumpFeedRefreshToken();

      // You can show a toast notification here
      // toast.success('Post created successfully!')
    } catch (error) {
      console.error("Error creating post:", error);
      // toast.error('Failed to create post')
      // Note: Error is already handled in the mutation
    }
  };

  const handleCreatePostClick = useCallback(() => {
    setSidebarOpen(false);

    if (!canCreatePost) {
      setAuthNotice({
        ...CREATE_POST_AUTH_NOTICE,
        from: `${location.pathname}${location.search}${location.hash}`,
      });
      return;
    }

    setIsCreatePostModalOpen(true);
  }, [canCreatePost, location.hash, location.pathname, location.search]);

  const handleAuthNotice = useCallback((event) => {
    const nextNotice = event?.detail
      ? {
          title: event.detail.title || DEFAULT_AUTH_NOTICE.title,
          description:
            event.detail.description || DEFAULT_AUTH_NOTICE.description,
          from: event.detail.from,
          postLoginAction: event.detail.postLoginAction,
        }
      : DEFAULT_AUTH_NOTICE;

    setAuthNotice(nextNotice);
  }, []);

  useEffect(() => {
    if (!authNotice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setAuthNotice(null);
    }, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [authNotice]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    window.addEventListener(OPEN_CREATE_POST_EVENT, handleCreatePostClick);
    window.addEventListener(SHOW_AUTH_NOTICE_EVENT, handleAuthNotice);

    return () => {
      window.removeEventListener(OPEN_CREATE_POST_EVENT, handleCreatePostClick);
      window.removeEventListener(SHOW_AUTH_NOTICE_EVENT, handleAuthNotice);
    };
  }, [handleAuthNotice, handleCreatePostClick]);

  useEffect(() => {
    const postLoginAction = location.state?.postLoginAction;
    const actionKey = `${location.key}:${postLoginAction || ""}`;

    if (
      !canCreatePost ||
      postLoginAction !== POST_LOGIN_ACTION_OPEN_CREATE_POST ||
      consumedPostLoginActionRef.current === actionKey
    ) {
      return;
    }

    consumedPostLoginActionRef.current = actionKey;
    clearStoredPostLoginAction();
    setIsCreatePostModalOpen(true);

    const nextState = { ...(location.state || {}) };
    delete nextState.postLoginAction;

    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      state: Object.keys(nextState).length ? nextState : null,
    });
  }, [
    canCreatePost,
    location.hash,
    location.key,
    location.pathname,
    location.search,
    location.state,
    navigate,
  ]);

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col lg:flex-row lg:max-h-screen overflow-x-hidden">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onCreatePostClick={handleCreatePostClick}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full lg:w-auto">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white pb-16 lg:pb-0">
          <Outlet />
        </main>
      </div>

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onPostCreated={handlePostCreated}
      />

      {authNotice && (
        <div className="fixed bottom-6 right-4 left-4 z-50 sm:left-auto sm:w-[420px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {authNotice.title}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {authNotice.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAuthNotice(null)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const nextFrom =
                    authNotice.from ||
                    `${location.pathname}${location.search}${location.hash}`;

                  storePostLoginRedirect(nextFrom);
                  storePostLoginAction(authNotice.postLoginAction);
                  setAuthNotice(null);
                  navigate("/login", {
                    state: {
                      from: nextFrom,
                      postLoginAction: authNotice.postLoginAction,
                    },
                  });
                }}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setAuthNotice(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
