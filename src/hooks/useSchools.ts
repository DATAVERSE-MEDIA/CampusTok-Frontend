// hooks/useSchools.ts
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { schoolApi } from '../api'
import { useAppStore } from '../store/useAppStore'
import { useEffect } from 'react'

// School keys for query cache
export const schoolKeys = {
  all: ['schools'] as const,
  lists: () => [...schoolKeys.all, 'list'] as const,
  list: (filters: any) => [...schoolKeys.lists(), filters] as const,
  details: () => [...schoolKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...schoolKeys.details(), id] as const,
  search: (query: string) => [...schoolKeys.all, 'search', query] as const,
  paginated: (params: any) => [...schoolKeys.all, 'paginated', params] as const,
}

// School hooks with Zustand sync
export const useSchools = (filters = {}) => {
  const setSchools = useAppStore(state => state.setSchools)
  
  const query = useQuery({
    queryKey: schoolKeys.list(filters),
    queryFn: () => schoolApi.getAllSchools().then(res => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (cache time) - v5 renamed cacheTime to gcTime
  })

  // Sync data with Zustand store when it changes
  useEffect(() => {
    if (query.data && query.isSuccess) {
      // Update Zustand store with fetched schools
      // setSchools(query.data)
    }
  }, [query.data, query.isSuccess, setSchools])

  return query
}

export const useSchool = (id: string | number) => {
  return useQuery({
    queryKey: schoolKeys.detail(id),
    queryFn: () => schoolApi.getSchoolById(id).then(res => res.data),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useSearchSchools = (query: string) => {
  const setSearchQuery = useAppStore(state => state.setSearchQuery)
  
  const searchQuery = useQuery({
    queryKey: schoolKeys.search(query),
    queryFn: () => schoolApi.searchSchools(query).then(res => res.data),
    enabled: query.length > 2, // Only search if query has at least 3 characters
  })

  // Sync search query with Zustand
  useEffect(() => {
    if (query.length > 2) {
      setSearchQuery(query)
    }
  }, [query, setSearchQuery])

  return searchQuery
}

export const useCreateSchool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (schoolData: any) =>
      schoolApi.createSchool(schoolData).then(res => res.data),
    onSuccess: (newSchool) => {
      // Invalidate schools list
      queryClient.invalidateQueries({ queryKey: schoolKeys.lists() })
      
      // Optimistically add to cache
      queryClient.setQueryData(schoolKeys.lists(), (old: any) => {
        return old ? [...old, newSchool] : [newSchool]
      })
    },
  })
}

export const useUpdateSchool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) =>
      schoolApi.updateSchool(id, data).then(res => res.data),
    onSuccess: (updatedSchool) => {
      // Invalidate specific school and list
      queryClient.invalidateQueries({ queryKey: schoolKeys.detail(updatedSchool.id) })
      queryClient.invalidateQueries({ queryKey: schoolKeys.lists() })
      
      // Optimistically update cache
      queryClient.setQueryData(schoolKeys.detail(updatedSchool.id), updatedSchool)
    },
  })
}

export const useDeleteSchool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string | number) =>
      schoolApi.deleteSchool(id).then(res => res.data),
    onSuccess: (_, id) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: schoolKeys.lists() })
      
      // Remove from cache
      queryClient.setQueryData(schoolKeys.lists(), (old: any) => {
        return old ? old.filter((school: any) => school.id !== id) : []
      })
    },
  })
}

// Infinite scroll for schools (v5 syntax)
export const useInfiniteSchools = (pageSize = 10) => {
  return useInfiniteQuery({
    queryKey: ['schools', 'infinite'],
    queryFn: ({ pageParam }) =>
      schoolApi.getSchoolsPaginated({ page: pageParam, limit: pageSize }).then(res => res.data),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1
      return lastPage.length === pageSize ? nextPage : undefined
    },
    initialPageParam: 1, // Required in v5
  })
}


// Get paginated schools
export const useSchoolsPaginated = (params: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}) => {
  return useQuery({
    queryKey: schoolKeys.paginated(params),
    queryFn: () => schoolApi.getSchoolsPaginated(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true, // Keep previous data while fetching new page
  })
}
