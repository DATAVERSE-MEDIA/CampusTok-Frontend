import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const STORAGE_KEY = "campustok_chat_history";

// Knowledge base for Nigerian universities
const UNIVERSITY_KNOWLEDGE = `
You are CampusTok AI, a helpful assistant for Nigerian university students. You have deep knowledge about these institutions:

## University of Lagos (UNILAG)
- Location: Akoka, Yaba, Lagos State, Nigeria
- Founded: 1962
- Type: Federal University
- Notable faculties: Engineering, Medicine, Law, Sciences, Arts, Social Sciences
- Website: unilag.edu.ng
- Known for: Strong engineering and medical programs, vibrant student life
- Student population: ~57,000
- Campus features: Distance Learning Institute, Central Library, Sports Complex
- Key contacts: info@unilag.edu.ng

## Yaba College of Technology (YABATECH)
- Location: Yaba, Lagos State, Nigeria
- Founded: 1947 (oldest polytechnic in Nigeria)
- Type: Federal Polytechnic
- Notable programs: Engineering, Art & Design, Science, Management
- Website: yabatech.edu.ng
- Known for: Practical/technical education, producing skilled technicians
- Campus: Main campus in Yaba, satellite campus in Epe
- Offers: National Diploma (ND), Higher National Diploma (HND)

## Obafemi Awolowo University (OAU)
- Location: Ile-Ife, Osun State, Nigeria
- Founded: 1961 (as University of Ife, renamed 1987)
- Type: Federal University
- Notable faculties: Pharmacy, Agriculture, Law, Sciences, Engineering
- Website: oauife.edu.ng
- Known for: Beautiful campus (one of the largest in Africa), academic excellence
- Student population: ~35,000
- Campus features: Oduduwa Hall, Amphitheatre, Teaching Hospital
- Named after: Chief Obafemi Awolowo

When answering:
1. Be helpful, friendly, and conversational
2. If asked about something you don't know, suggest where the student might find that information
3. Encourage students to verify critical information (fees, deadlines) with official sources
4. You can help with: admission info, campus life, courses, facilities, academic calendar, student services
5. For very current information (like specific dates or recent news), recommend checking official websites/portals
`;

const DEFAULT_MESSAGE = {
  id: 1,
  role: "assistant",
  content:
    "Hi there! 👋 I'm your CampusTok AI assistant. I can help you with questions about UNILAG, Yabatech, OAU, or campus life in general. What would you like to know?",
  timestamp: new Date().toISOString(),
};

export default function Chatbot() {
  const { selectedSchool } = useAppStore();
  const { user } = useAuthStore();

  const [messages, setMessages] = useState(() => {
    // Load from localStorage on initial mount
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : [DEFAULT_MESSAGE];
      } catch {
        return [DEFAULT_MESSAGE];
      }
    }
    return [DEFAULT_MESSAGE];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Save to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const clearChat = () => {
    setMessages([DEFAULT_MESSAGE]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build context-aware system prompt
      const schoolContext = selectedSchool?.name
        ? `The user is currently viewing content from ${selectedSchool.name}. Prioritize information about this institution when relevant.`
        : "The user has not selected a specific school.";

      const userContext = user?.full_name
        ? `The user's name is ${user.full_name}.`
        : "";

      const systemPrompt = `${UNIVERSITY_KNOWLEDGE}

Current context:
${schoolContext}
${userContext}

Respond in a helpful, concise manner. Use markdown formatting for better readability when appropriate.`;

      // Build conversation history for context
      const conversationHistory = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              ...conversationHistory,
              { role: "user", content: input.trim() },
            ],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent =
        data.choices?.[0]?.message?.content ||
        "I'm sorry, I couldn't process that request. Please try again.";

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: assistantContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Groq API error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I'm having trouble connecting right now. Please check your internet connection and try again.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              CampusTok AI
            </h1>
            {selectedSchool && (
              <p className="text-xs text-gray-500">
                Focused on {selectedSchool.name}
              </p>
            )}
          </div>
        </div>

        {/* Clear chat button */}
        {messages.length > 1 && (
          <button
            onClick={clearChat}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 scroll-smooth">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: message.role === "user" ? 50 : -50,
                transition: { duration: 0.2 },
              }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`flex flex-col max-w-[85%] min-w-[15%] rounded-xl px-3 py-2 ${
                  message.role === "user"
                    ? "bg-gray-200 text-gray-800 rounded-br-sm"
                    : ""
                }`}
              >
                {message.role === "user" ? (
                  <p className="text-base whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                ) : (
                  <div className="prose prose-sm prose-gray max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 prose-code:bg-gray-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none">
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            className="text-blue-500 hover:underline"
                          />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
                <p
                  className={`text-[10px] mt-px ${
                    message.role === "user"
                      ? "text-gray-400 ml-auto"
                      : "text-gray-400 mr-auto opacity-0"
                  }`}
                ></p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="mt-auto">
        <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-2 shadow-sm">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedSchool
                ? `Ask about ${selectedSchool.name}...`
                : "Ask me anything..."
            }
            disabled={isLoading}
            className="flex-1 px-3 py-2 bg-transparent text-base placeholder-gray-400 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          {/* Powered by Groq AI • Responses may not always be accurate */}
        </p>
      </form>
    </div>
  );
}
