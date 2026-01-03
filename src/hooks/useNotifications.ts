// hooks/useNotifications.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationApi, messageApi } from '../api'
import { useAppStore } from '../store/useAppStore'
import { useEffect } from 'react'

// Notification keys
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
}

// Message keys
export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  conversation: (userId: string) => [...messageKeys.all, 'conversation', userId] as const,
}

// Notification hooks
export const useNotifications = () => {
  const addNotification = useAppStore(state => state.addNotification)
  
  const query = useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: () => notificationApi.getNotifications().then(res => res.data),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0, // Always fresh
  })

  // Sync with Zustand store when data changes
  useEffect(() => {
    if (query.data && query.isSuccess) {
      // Clear existing notifications if needed
      // Then add new ones
      query.data.forEach(notification => {
        // addNotification(notification)
      })
    }
  }, [query.data, query.isSuccess, addNotification])

  return query
}

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationApi.markAsRead(notificationId).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
    },
  })
}

// Message hooks
export const useMessages = () => {
  return useQuery({
    queryKey: messageKeys.lists(),
    queryFn: () => messageApi.getMessages().then(res => res.data),
    refetchInterval: 10000, // Refetch every 10 seconds for real-time
  })
}

export const useConversation = (userId: string) => {
  return useQuery({
    queryKey: messageKeys.conversation(userId),
    queryFn: () => messageApi.getConversation(userId).then(res => res.data),
    enabled: !!userId,
    refetchInterval: 5000, // Refetch every 5 seconds for active conversations
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (messageData: { to: string; content: string }) =>
      messageApi.sendMessage(messageData).then(res => res.data),
    onSuccess: (newMessage, variables) => {
      // Optimistically update conversation cache
      queryClient.setQueryData(
        messageKeys.conversation(variables.to),
        (old: any) => {
          return old ? [...old, newMessage] : [newMessage]
        }
      )
    },
  })
}