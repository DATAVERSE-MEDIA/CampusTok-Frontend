// // hooks/usePosts.ts
// import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
// import { apiClient } from '../api'
// import { useAppStore } from '../store/useAppStore'

// // Post keys for query cache
// export const postKeys = {
//   all: ['posts'] as const,
//   lists: () => [...postKeys.all, 'list'] as const,
//   list: (filters: any) => [...postKeys.lists(), filters] as const,
//   details: () => [...postKeys.all, 'detail'] as const,
//   detail: (id: string | number) => [...postKeys.details(), id] as const,
//   infinite: (filters: any) => [...postKeys.all, 'infinite', filters] as const,
//   bySchool: (schoolId: string) => [...postKeys.all, 'school', schoolId] as const,
//   byUser: (userId: string) => [...postKeys.all, 'user', userId] as const,
//   feed: (params: any) => [...postKeys.all, 'feed', params] as const,
// }

// // Fetch posts with infinite scroll
// export const usePosts = (params = {}) => {
//   const { selectedSchool } = useAppStore()
  
//   const queryParams = {
//     page: 1,
//     limit: 10,
//     sortBy: 'created_at',
//     sortOrder: 'desc' as const,
//     ...params,
//   }

//   // Add school filter if selected
//   if (selectedSchool?.id) {
//     queryParams.school_scope = selectedSchool.name
//   }

//   return useInfiniteQuery({
//     queryKey: postKeys.infinite(queryParams),
//     queryFn: async ({ pageParam = 1 }) => {
//       const response = await apiClient.get('/posts', {
//         params: {
//           ...queryParams,
//           page: pageParam,
//         }
//       })
      
//       const data = response.data.data || response.data || []
      
//       // If no data and first page, return dummy data for testing
//       if (data.length === 0 && pageParam === 1) {
//         return {
//           posts: getDummyPosts(),
//           nextPage: null,
//           hasMore: false,
//         }
//       }
      
//       return {
//         posts: data,
//         nextPage: data.length >= queryParams.limit ? pageParam + 1 : null,
//         hasMore: data.length >= queryParams.limit,
//       }
//     },
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     gcTime: 10 * 60 * 1000, // 10 minutes cache
//   })
// }

// // Fetch single post
// export const usePost = (postId: string | number) => {
//   return useQuery({
//     queryKey: postKeys.detail(postId),
//     queryFn: () => apiClient.get(`/posts/${postId}`).then(res => res.data),
//     enabled: !!postId,
//     staleTime: 2 * 60 * 1000, // 2 minutes
//   })
// }

// // Post mutations - this should be a hook
// export const usePostMutations = () => {
//   const queryClient = useQueryClient() // FIXED: Use useQueryClient hook

//   // Create post mutation
//   const createPost = useMutation({
//     mutationFn: (postData: { 
//       content: string; 
//       privacy: "public" | "school_only" | "followers_only";
//       post_type: "post" | "reel";
//       is_school_scope: boolean;
//       school_id?: string | number;
//       images?: File[];
//       video?: File;
//     }) => {
//       const formData = new FormData()
      
//       // Add text fields
//       formData.append('content', postData.content)
//       formData.append('privacy', postData.privacy)
//       formData.append('post_type', postData.post_type)
//       formData.append('is_school_scope', postData.is_school_scope.toString())
      
//       // Add school ID if provided
//       if (postData.school_id) {
//         formData.append('school_id', postData.school_id.toString())
//       }
      
//       // Add images if any
//       if (postData.images && postData.images.length > 0) {
//         postData.images.forEach((image) => {
//           formData.append('images', image)
//         })
//       }
      
//       // Add video if provided
//       if (postData.video) {
//         formData.append('video', postData.video)
//       }
      
//       return apiClient.post('/posts', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       })
//     },
//     onSuccess: () => {
//       // Invalidate all posts queries to refetch
//       queryClient.invalidateQueries({ queryKey: postKeys.all })
      
//       // Also invalidate school-specific posts
//       queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      
//       console.log('Post created successfully!')
//     },
//     onError: (error) => {
//       console.error('Error creating post:', error)
//     },
//   })

//   // Like post mutation
//   const likePost = useMutation({
//     mutationFn: (postId: string | number) => 
//       apiClient.post(`/posts/${postId}/like`),
//     onMutate: async (postId) => {
//       // Cancel any outgoing refetches
//       await queryClient.cancelQueries({ queryKey: postKeys.all })
      
//       // Snapshot the previous value
//       const previousPosts = queryClient.getQueryData(postKeys.all)
      
//       // Optimistically update the cache
//       queryClient.setQueryData(postKeys.all, (old: any) => {
//         if (!old) return old
        
//         // Handle both regular query and infinite query structures
//         if (old.pages) {
//           // Infinite query structure
//           return {
//             ...old,
//             pages: old.pages.map((page: any) => ({
//               ...page,
//               posts: page.posts.map((post: any) =>
//                 post.id === postId
//                   ? { 
//                       ...post, 
//                       likes_count: (post.likes_count || 0) + 1,
//                       liked: true 
//                     }
//                   : post
//               )
//             }))
//           }
//         } else {
//           // Regular query structure
//           return Array.isArray(old)
//             ? old.map((post: any) =>
//                 post.id === postId
//                   ? { 
//                       ...post, 
//                       likes_count: (post.likes_count || 0) + 1,
//                       liked: true 
//                     }
//                   : post
//               )
//             : old
//         }
//       })
      
//       return { previousPosts }
//     },
//     onError: (err, postId, context) => {
//       // Rollback on error
//       if (context?.previousPosts) {
//         queryClient.setQueryData(postKeys.all, context.previousPosts)
//       }
//     },
//     onSettled: () => {
//       // Refetch posts to ensure consistency
//       queryClient.invalidateQueries({ queryKey: postKeys.all })
//     },
//   })

//   // Unlike post mutation
//   const unlikePost = useMutation({
//     mutationFn: (postId: string | number) => 
//       apiClient.delete(`/posts/${postId}/like`),
//     onMutate: async (postId) => {
//       await queryClient.cancelQueries({ queryKey: postKeys.all })
      
//       const previousPosts = queryClient.getQueryData(postKeys.all)
      
//       queryClient.setQueryData(postKeys.all, (old: any) => {
//         if (!old) return old
        
//         if (old.pages) {
//           return {
//             ...old,
//             pages: old.pages.map((page: any) => ({
//               ...page,
//               posts: page.posts.map((post: any) =>
//                 post.id === postId
//                   ? { 
//                       ...post, 
//                       likes_count: Math.max(0, (post.likes_count || 1) - 1),
//                       liked: false 
//                     }
//                   : post
//               )
//             }))
//           }
//         } else {
//           return Array.isArray(old)
//             ? old.map((post: any) =>
//                 post.id === postId
//                   ? { 
//                       ...post, 
//                       likes_count: Math.max(0, (post.likes_count || 1) - 1),
//                       liked: false 
//                     }
//                   : post
//               )
//             : old
//         }
//       })
      
//       return { previousPosts }
//     },
//     onError: (err, postId, context) => {
//       if (context?.previousPosts) {
//         queryClient.setQueryData(postKeys.all, context.previousPosts)
//       }
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: postKeys.all })
//     },
//   })

//   // Comment on post mutation
//   const commentOnPost = useMutation({
//     mutationFn: ({ postId, content }: { postId: string | number; content: string }) =>
//       apiClient.post(`/posts/${postId}/comments`, { content }),
//     onSuccess: (data, variables) => {
//       // Invalidate the specific post to refetch comments
//       queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) })
      
//       // Also update the posts list
//       queryClient.setQueryData(postKeys.all, (old: any) => {
//         if (!old) return old
        
//         if (old.pages) {
//           return {
//             ...old,
//             pages: old.pages.map((page: any) => ({
//               ...page,
//               posts: page.posts.map((post: any) =>
//                 post.id === variables.postId
//                   ? { 
//                       ...post, 
//                       comments_count: (post.comments_count || 0) + 1 
//                     }
//                   : post
//               )
//             }))
//           }
//         } else {
//           return Array.isArray(old)
//             ? old.map((post: any) =>
//                 post.id === variables.postId
//                   ? { 
//                       ...post, 
//                       comments_count: (post.comments_count || 0) + 1 
//                     }
//                   : post
//               )
//             : old
//         }
//       })
//     },
//   })

//   // Share post mutation
//   const sharePost = useMutation({
//     mutationFn: (postId: string | number) => 
//       apiClient.post(`/posts/${postId}/share`),
//     onMutate: async (postId) => {
//       await queryClient.cancelQueries({ queryKey: postKeys.all })
      
//       const previousPosts = queryClient.getQueryData(postKeys.all)
      
//       queryClient.setQueryData(postKeys.all, (old: any) => {
//         if (!old) return old
        
//         if (old.pages) {
//           return {
//             ...old,
//             pages: old.pages.map((page: any) => ({
//               ...page,
//               posts: page.posts.map((post: any) =>
//                 post.id === postId
//                   ? { 
//                       ...post, 
//                       shares_count: (post.shares_count || 0) + 1 
//                     }
//                   : post
//               )
//             }))
//           }
//         } else {
//           return Array.isArray(old)
//             ? old.map((post: any) =>
//                 post.id === postId
//                   ? { 
//                       ...post, 
//                       shares_count: (post.shares_count || 0) + 1 
//                     }
//                   : post
//               )
//             : old
//         }
//       })
      
//       return { previousPosts }
//     },
//     onError: (err, postId, context) => {
//       if (context?.previousPosts) {
//         queryClient.setQueryData(postKeys.all, context.previousPosts)
//       }
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: postKeys.all })
//     },
//   })

//   // Delete post mutation
//   const deletePost = useMutation({
//     mutationFn: (postId: string | number) => 
//       apiClient.delete(`/posts/${postId}`),
//     onSuccess: (data, postId) => {
//       // Remove the post from cache
//       queryClient.setQueryData(postKeys.all, (old: any) => {
//         if (!old) return old
        
//         if (old.pages) {
//           return {
//             ...old,
//             pages: old.pages.map((page: any) => ({
//               ...page,
//               posts: page.posts.filter((post: any) => post.id !== postId)
//             }))
//           }
//         } else {
//           return Array.isArray(old)
//             ? old.filter((post: any) => post.id !== postId)
//             : old
//         }
//       })
      
//       console.log('Post deleted successfully!')
//     },
//   })

//   return {
//     createPost,
//     likePost,
//     unlikePost,
//     commentOnPost,
//     sharePost,
//     deletePost,
//   }
// }

// // Helper function for dummy posts (for testing)
// const getDummyPosts = () => [
//   {
//     id: 1,
//     content: "At the University of Lagos, a new electric bus was introduced to shuttle students around campus. Silent and eco-friendly, it quickly became a symbol of innovation, inspiring students wh...",
//     author: {
//       full_name: "University of Lagos",
//       profile_picture: null,
//       role: "institution",
//     },
//     media: [],
//     likes_count: 11700,
//     comments_count: 500,
//     shares_count: 1000,
//     views_count: 100000,
//     created_at: new Date().toISOString(),
//     liked: false,
//   },
// ]

// hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery, UseMutationOptions } from '@tanstack/react-query'
import { apiClient } from '../api'
import { useAppStore } from '../store/useAppStore'

// Post keys for query cache
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: any) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...postKeys.details(), id] as const,
  infinite: (filters: any) => [...postKeys.all, 'infinite', filters] as const,
  bySchool: (schoolId: string) => [...postKeys.all, 'school', schoolId] as const,
  byInstitution: (institutionId: string, params?: any) => [...postKeys.all, 'institution', institutionId, params] as const,
  byUser: (userId: string) => [...postKeys.all, 'user', userId] as const,
  feed: (params: any) => [...postKeys.all, 'feed', params] as const,
}

// Types for institution posts
export interface InstitutionPostsParams {
  institution_id: string
  skip?: number
  limit?: number
  post_type?: 'post' | 'reel' | 'all'
}

export interface InstitutionPostsResponse {
  posts: any[]
  total: number
  hasMore: boolean
  nextSkip: number
}

// Fetch posts with infinite scroll
export const usePosts = (params = {}) => {
  const { selectedSchool } = useAppStore()
  
  const queryParams = {
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc' as const,
    ...params,
  }

  // Add school filter if selected
  if (selectedSchool?.id) {
    queryParams.school_scope = selectedSchool.name
  }

  return useInfiniteQuery({
    queryKey: postKeys.infinite(queryParams),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get('/posts', {
        params: {
          ...queryParams,
          page: pageParam,
        }
      })
      
      const data = response.data.data || response.data || []
      
      // If no data and first page, return dummy data for testing
      if (data.length === 0 && pageParam === 1) {
        return {
          posts: getDummyPosts(),
          nextPage: null,
          hasMore: false,
        }
      }
      
      return {
        posts: data,
        nextPage: data.length >= queryParams.limit ? pageParam + 1 : null,
        hasMore: data.length >= queryParams.limit,
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  })
}

// NEW: Fetch posts by institution ID (regular query)
export const useInstitutionPosts = (params: InstitutionPostsParams, options?: any) => {
  const { institution_id, skip = 0, limit = 10, post_type = 'all' } = params
  
  return useQuery({
    queryKey: postKeys.byInstitution(institution_id, { skip, limit, post_type }),
    queryFn: async () => {
      const response = await apiClient.get(`/posts/institution/${institution_id}`, {
        params: {
          skip,
          limit,
          post_type: post_type === 'all' ? undefined : post_type,
        }
      })
      
      const data = response.data.data || response.data || []
      
      return {
        posts: data,
        total: data.length,
        hasMore: data.length >= limit,
        nextSkip: skip + data.length,
      }
    },
    enabled: !!institution_id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  })
}

// NEW: Fetch posts by institution ID with infinite scroll
export const useInfiniteInstitutionPosts = (params: Omit<InstitutionPostsParams, 'skip'>) => {
  const { institution_id, limit = 10, post_type = 'all' } = params
  
  return useInfiniteQuery({
    queryKey: postKeys.byInstitution(institution_id, { post_type }),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.get(`/posts/institution/${institution_id}`, {
        params: {
          skip: pageParam,
          limit,
          post_type: post_type === 'all' ? undefined : post_type,
        }
      })
      
      const data = response.data.data || response.data || []
      
      return {
        posts: data,
        total: data.length,
        hasMore: data.length >= limit,
        nextSkip: pageParam + data.length,
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextSkip : undefined
    },
    initialPageParam: 0,
    enabled: !!institution_id,
    staleTime: 2 * 60 * 1000,
  })
}

// NEW: Mutation to fetch institution posts (triggered manually)
export const useFetchInstitutionPosts = (
  options?: UseMutationOptions<InstitutionPostsResponse, Error, InstitutionPostsParams>
) => {
  return useMutation({
    mutationFn: async (params: InstitutionPostsParams) => {
      const { institution_id, skip = 0, limit = 10, post_type = 'all' } = params
      
      const response = await apiClient.get(`/posts/institution/${institution_id}`, {
        params: {
          skip,
          limit,
          post_type: post_type === 'all' ? undefined : post_type,
        }
      })
      
      const data = response.data.data || response.data || []
      
      return {
        posts: data,
        total: data.length,
        hasMore: data.length >= limit,
        nextSkip: skip + data.length,
      }
    },
    ...options,
  })
}

// NEW: Combined hook for institution posts with cache updates
export const useInstitutionPostsWithCache = () => {
  const queryClient = useQueryClient()
  
  const fetchInstitutionPosts = useFetchInstitutionPosts({
    onSuccess: (data, variables) => {
      // Update cache with fetched posts
      queryClient.setQueryData(
        postKeys.byInstitution(variables.institution_id, {
          skip: variables.skip,
          limit: variables.limit,
          post_type: variables.post_type,
        }),
        data
      )
    },
  })
  
  const getInstitutionPosts = useInstitutionPosts
  
  const getInfiniteInstitutionPosts = useInfiniteInstitutionPosts
  
  return {
    fetchInstitutionPosts: fetchInstitutionPosts.mutate,
    fetchInstitutionPostsAsync: fetchInstitutionPosts.mutateAsync,
    isFetching: fetchInstitutionPosts.isPending,
    getInstitutionPosts,
    getInfiniteInstitutionPosts,
  }
}

// Fetch single post
export const usePost = (postId: string | number) => {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => apiClient.get(`/posts/${postId}`).then(res => res.data),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Post mutations - this should be a hook
export const usePostMutations = () => {
  const queryClient = useQueryClient()

  // Create post mutation
  const createPost = useMutation({
    mutationFn: (postData: { 
      content: string; 
      privacy: "public" | "school_only" | "followers_only";
      post_type: "post" | "reel";
      is_school_scope: boolean;
      school_id?: string | number;
      institution_id?: string;
      images?: File[];
      video?: File;
    }) => {
      const formData = new FormData()
      
      // Add text fields
      formData.append('content', postData.content)
      formData.append('privacy', postData.privacy)
      formData.append('post_type', postData.post_type)
      formData.append('is_school_scope', postData.is_school_scope.toString())
      
      // Add school ID if provided
      if (postData.school_id) {
        formData.append('school_id', postData.school_id.toString())
      }
      
      // Add institution ID if provided
      if (postData.institution_id) {
        formData.append('institution_id', postData.institution_id)
      }
      
      // Add images if any
      if (postData.images && postData.images.length > 0) {
        postData.images.forEach((image) => {
          formData.append('images', image)
        })
      }
      
      // Add video if provided
      if (postData.video) {
        formData.append('video', postData.video)
      }
      
      return apiClient.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    onSuccess: (data, variables) => {
      // Invalidate all posts queries to refetch
      queryClient.invalidateQueries({ queryKey: postKeys.all })
      
      // Also invalidate school-specific posts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      
      // Invalidate institution-specific posts if institution_id was provided
      if (variables.institution_id) {
        queryClient.invalidateQueries({ 
          queryKey: postKeys.byInstitution(variables.institution_id) 
        })
      }
      
      console.log('Post created successfully!')
    },
    onError: (error) => {
      console.error('Error creating post:', error)
    },
  })

  // Like post mutation
  const likePost = useMutation({
    mutationFn: (postId: string | number) => 
      apiClient.post(`/posts/${postId}/like`),
    onMutate: async (postId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: postKeys.all })
      
      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(postKeys.all)
      
      // Optimistically update the cache
      queryClient.setQueryData(postKeys.all, (old: any) => {
        if (!old) return old
        
        // Handle both regular query and infinite query structures
        if (old.pages) {
          // Infinite query structure
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) =>
                post.id === postId
                  ? { 
                      ...post, 
                      likes_count: (post.likes_count || 0) + 1,
                      liked: true 
                    }
                  : post
              )
            }))
          }
        } else {
          // Regular query structure
          return Array.isArray(old)
            ? old.map((post: any) =>
                post.id === postId
                  ? { 
                      ...post, 
                      likes_count: (post.likes_count || 0) + 1,
                      liked: true 
                    }
                  : post
              )
            : old
        }
      })
      
      return { previousPosts }
    },
    onError: (err, postId, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.all, context.previousPosts)
      }
    },
    onSettled: () => {
      // Refetch posts to ensure consistency
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })

  // Unlike post mutation
  const unlikePost = useMutation({
    mutationFn: (postId: string | number) => 
      apiClient.delete(`/posts/${postId}/like`),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all })
      
      const previousPosts = queryClient.getQueryData(postKeys.all)
      
      queryClient.setQueryData(postKeys.all, (old: any) => {
        if (!old) return old
        
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) =>
                post.id === postId
                  ? { 
                      ...post, 
                      likes_count: Math.max(0, (post.likes_count || 1) - 1),
                      liked: false 
                    }
                  : post
              )
            }))
          }
        } else {
          return Array.isArray(old)
            ? old.map((post: any) =>
                post.id === postId
                  ? { 
                      ...post, 
                      likes_count: Math.max(0, (post.likes_count || 1) - 1),
                      liked: false 
                    }
                  : post
              )
            : old
        }
      })
      
      return { previousPosts }
    },
    onError: (err, postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.all, context.previousPosts)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })

  // Comment on post mutation
  const commentOnPost = useMutation({
    mutationFn: ({ postId, content }: { postId: string | number; content: string }) =>
      apiClient.post(`/posts/${postId}/comments`, { content }),
    onSuccess: (data, variables) => {
      // Invalidate the specific post to refetch comments
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) })
      
      // Also update the posts list
      queryClient.setQueryData(postKeys.all, (old: any) => {
        if (!old) return old
        
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) =>
                post.id === variables.postId
                  ? { 
                      ...post, 
                      comments_count: (post.comments_count || 0) + 1 
                    }
                  : post
              )
            }))
          }
        } else {
          return Array.isArray(old)
            ? old.map((post: any) =>
                post.id === variables.postId
                  ? { 
                      ...post, 
                      comments_count: (post.comments_count || 0) + 1 
                    }
                  : post
              )
            : old
        }
      })
    },
  })

  // Share post mutation
  const sharePost = useMutation({
    mutationFn: (postId: string | number) => 
      apiClient.post(`/posts/${postId}/share`),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all })
      
      const previousPosts = queryClient.getQueryData(postKeys.all)
      
      queryClient.setQueryData(postKeys.all, (old: any) => {
        if (!old) return old
        
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) =>
                post.id === postId
                  ? { 
                      ...post, 
                      shares_count: (post.shares_count || 0) + 1 
                    }
                  : post
              )
            }))
          }
        } else {
          return Array.isArray(old)
            ? old.map((post: any) =>
                post.id === postId
                  ? { 
                      ...post, 
                      shares_count: (post.shares_count || 0) + 1 
                    }
                  : post
              )
            : old
        }
      })
      
      return { previousPosts }
    },
    onError: (err, postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.all, context.previousPosts)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })

  // Delete post mutation
  const deletePost = useMutation({
    mutationFn: (postId: string | number) => 
      apiClient.delete(`/posts/${postId}`),
    onSuccess: (data, postId) => {
      // Remove the post from cache
      queryClient.setQueryData(postKeys.all, (old: any) => {
        if (!old) return old
        
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.filter((post: any) => post.id !== postId)
            }))
          }
        } else {
          return Array.isArray(old)
            ? old.filter((post: any) => post.id !== postId)
            : old
        }
      })
      
      console.log('Post deleted successfully!')
    },
  })

  return {
    createPost,
    likePost,
    unlikePost,
    commentOnPost,
    sharePost,
    deletePost,
  }
}

// Helper function for dummy posts (for testing)
const getDummyPosts = () => [
  {
    id: 1,
    content: "At the University of Lagos, a new electric bus was introduced to shuttle students around campus. Silent and eco-friendly, it quickly became a symbol of innovation, inspiring students wh...",
    author: {
      full_name: "University of Lagos",
      profile_picture: null,
      role: "institution",
    },
    media: [],
    likes_count: 11700,
    comments_count: 500,
    shares_count: 1000,
    views_count: 100000,
    created_at: new Date().toISOString(),
    liked: false,
  },
]