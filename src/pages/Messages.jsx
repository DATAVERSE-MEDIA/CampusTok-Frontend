import { useState } from 'react'
import { Send, Search, MoreVertical, Phone, Video } from 'lucide-react'

const conversations = [
  {
    id: 1,
    name: 'Sarah Johnson',
    lastMessage: 'Hey! Are you coming to the study group?',
    time: '2m ago',
    unread: 2,
    avatar: null
  },
  {
    id: 2,
    name: 'Michael Chen',
    lastMessage: 'Thanks for the notes!',
    time: '1h ago',
    unread: 0,
    avatar: null
  },
  {
    id: 3,
    name: 'Study Group',
    lastMessage: 'Emily: Meeting at 3pm in the library',
    time: '3h ago',
    unread: 5,
    avatar: null,
    isGroup: true
  },
  {
    id: 4,
    name: 'Campus Admin',
    lastMessage: 'Your event registration is confirmed',
    time: '1d ago',
    unread: 0,
    avatar: null
  },
]

const messages = [
  { id: 1, text: 'Hey! Are you coming to the study group?', sender: 'other', time: '2:30 PM' },
  { id: 2, text: 'Yes, I\'ll be there!', sender: 'me', time: '2:32 PM' },
  { id: 3, text: 'Great! See you then.', sender: 'other', time: '2:33 PM' },
]

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageInput, setMessageInput] = useState('')
  const [conversationMessages, setConversationMessages] = useState(messages)

  const handleSend = (e) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    const newMessage = {
      id: conversationMessages.length + 1,
      text: messageInput,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setConversationMessages([...conversationMessages, newMessage])
    setMessageInput('')
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-200px)]">
      <div className="card h-full flex">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedConversation.id === conversation.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {conversation.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conversation.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedConversation.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900">{selectedConversation.name}</h2>
                    <p className="text-sm text-gray-500">Active now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === 'me'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'me' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 input-field"
                  />
                  <button type="submit" className="btn-primary px-6 flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

