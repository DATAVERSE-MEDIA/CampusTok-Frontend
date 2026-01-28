import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import SchoolDropdown from "../components/SchoolDropdown";
import { schoolApi, apiClient } from "../api";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your campus assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch schools from API
  const fetchSchools = useCallback(async () => {
    setIsLoadingSchools(true);

    try {
      const response = await schoolApi.getAllSchools();
      const schoolsData = response.data.data || response.data || [];

      const formattedSchools = schoolsData.map((school) => ({
        id: school.id,
        name: school.institution_name || school.name,
        code: school.code || school.id?.toUpperCase(),
        logo: school.institution_profile_picture || school.logo,
        address: school.institution_location || school.address,
        website: school.institution_website,
        email: school.institution_email,
        description: school.institution_description,
        type: "university",
      }));

      setSchools(formattedSchools);

      if (!selectedSchool && formattedSchools.length > 0) {
        setSelectedSchool(formattedSchools[0]);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);

      const mockSchools = [
        {
          id: "unilag",
          name: "University of Lagos",
          code: "UNILAG",
          logo: "https://i.pinimg.com/736x/7c/0e/fe/7c0efec92682d80048147b2e73d3c4d2.jpg",
          address: "Akoka, Yaba, Lagos State, Nigeria",
          website: "https://unilag.edu.ng",
          email: "info@unilag.edu.ng",
          description: "Federal university founded in 1962.",
          type: "university",
        },
        {
          id: "ileife",
          name: "Obafemi Awolowo University",
          code: "OAU",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfwWX6sdVsQrNytuqVQjijmgSGpet1NZQg7w&s",
          address: "Ile-Ife, Osun State, Nigeria",
          website: "https://oauife.edu.ng",
          email: "info@oauife.edu.ng",
          description: "Established in 1961, renowned for academic excellence.",
          type: "university",
        },
      ];

      setSchools(mockSchools);
      if (!selectedSchool && mockSchools.length > 0) {
        setSelectedSchool(mockSchools[0]);
      }
    } finally {
      setIsLoadingSchools(false);
    }
  }, [selectedSchool]);

  // Fetch schools on component mount
  useEffect(() => {
    if (schools.length === 0) {
      fetchSchools();
    }
  }, [schools.length, fetchSchools]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageText = input.trim();
    setInput("");

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add loading message
    const loadingMessage = {
      id: Date.now() + 1,
      text: "",
      sender: "bot",
      isLoading: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);
    setIsLoading(true);

    try {
      // Make API request
      const response = await apiClient.post("/chats/", {
        message: userMessageText,
        thread_id: threadId || undefined,
      });

      const { response: botResponseText, thread_id: newThreadId } =
        response.data;

      // Update thread ID if we got a new one
      if (newThreadId && !threadId) {
        setThreadId(newThreadId);
      }

      // Remove loading message and add bot response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isLoading);
        return [
          ...filtered,
          {
            id: Date.now() + 2,
            text: botResponseText,
            sender: "bot",
            timestamp: new Date(),
          },
        ];
      });
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove loading message and add error message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isLoading);
        return [
          ...filtered,
          {
            id: Date.now() + 2,
            text: "Sorry, I encountered an error. Please try again.",
            sender: "bot",
            isError: true,
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
      // Focus input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with School Dropdown on the right (original layout) */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Campus Chatbot
              </h1>
              <p className="text-xs text-gray-500">
                Ask me anything about campus life
              </p>
            </div>
          </div>

          <div className="w-64">
            <SchoolDropdown
              schools={schools}
              selectedSchool={selectedSchool}
              onSelectSchool={setSelectedSchool}
              isLoading={isLoadingSchools}
              placeholder="Choose your school..."
            />
          </div>
        </div>
      </div>

      {/* Messages Container - ChatGPT Style */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-6 flex gap-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`flex flex-col gap-1 max-w-[85%] ${
                  message.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-primary-600 text-white rounded-br-sm"
                      : message.isError
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-1">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      <span className="text-gray-400 text-sm">Thinking...</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words m-0">
                        {message.text}
                      </p>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-400 px-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {message.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - ChatGPT Style */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form onSubmit={handleSend} className="relative">
            <div className="flex items-end gap-2 bg-gray-100 rounded-2xl border border-gray-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize textarea
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder={
                  selectedSchool
                    ? `Ask about ${selectedSchool.name}...`
                    : "Type your message... (Press Enter to send, Shift+Enter for new line)"
                }
                className="flex-1 bg-transparent border-none outline-none resize-none px-4 py-3 text-sm text-gray-900 placeholder-gray-500 max-h-32 overflow-y-auto"
                rows={1}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="m-2 p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                title="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            {selectedSchool && (
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-1 px-1">
                <span>Chatting about:</span>
                <span className="font-medium">{selectedSchool.name}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
