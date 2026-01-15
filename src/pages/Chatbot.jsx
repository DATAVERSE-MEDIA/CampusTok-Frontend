// import { useState, useRef, useEffect } from 'react'
// import { Send, Bot, User } from 'lucide-react'

// export default function Chatbot() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm your campus assistant. How can I help you today?",
//       sender: 'bot',
//       timestamp: new Date()
//     }
//   ])
//   const [input, setInput] = useState('')
//   const messagesEndRef = useRef(null)

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   const handleSend = (e) => {
//     e.preventDefault()
//     if (!input.trim()) return

//     const userMessage = {
//       id: messages.length + 1,
//       text: input,
//       sender: 'user',
//       timestamp: new Date()
//     }

//     setMessages([...messages, userMessage])
//     setInput('')

//     // Simulate bot response
//     setTimeout(() => {
//       const botResponse = {
//         id: messages.length + 2,
//         text: "I understand you're asking about: " + input + ". Let me help you with that!",
//         sender: 'bot',
//         timestamp: new Date()
//       }
//       setMessages(prev => [...prev, botResponse])
//     }, 1000)
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="card mb-6">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
//             <Bot className="w-6 h-6 text-primary-600" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Campus Chatbot</h1>
//             <p className="text-gray-600">Ask me anything about campus life!</p>
//           </div>
//         </div>
//       </div>

//       <div className="card">
//         <div className="h-[600px] flex flex-col">
//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto space-y-4 p-4">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 {message.sender === 'bot' && (
//                   <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
//                     <Bot className="w-5 h-5 text-white" />
//                   </div>
//                 )}
//                 <div
//                   className={`max-w-[70%] rounded-lg p-4 ${
//                     message.sender === 'user'
//                       ? 'bg-primary-600 text-white'
//                       : 'bg-gray-100 text-gray-900'
//                   }`}
//                 >
//                   <p>{message.text}</p>
//                   <p className={`text-xs mt-2 ${
//                     message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
//                   }`}>
//                     {message.timestamp.toLocaleTimeString()}
//                   </p>
//                 </div>
//                 {message.sender === 'user' && (
//                   <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
//                     <User className="w-5 h-5 text-gray-600" />
//                   </div>
//                 )}
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input */}
//           <form onSubmit={handleSend} className="border-t p-4">
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Type your message..."
//                 className="flex-1 input-field"
//               />
//               <button
//                 type="submit"
//                 className="btn-primary px-6 flex items-center gap-2"
//               >
//                 <Send className="w-5 h-5" />
//                 Send
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }


// pages/ChatbotPage.jsx
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Building2 } from 'lucide-react';
import SchoolDropdown from '../components/SchoolDropdown';
import { schoolApi } from "../api";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your campus assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch schools from API
  const fetchSchools = async () => {
    setIsLoadingSchools(true);
    
    try {
      const response = await schoolApi.getAllSchools();
      const schoolsData = response.data.data || response.data || [];

      // Format the schools data
      const formattedSchools = schoolsData.map((school) => ({
        id: school.id,
        name: school.institution_name || school.name,
        code: school.code || school.id?.toUpperCase(),
        logo: school.institution_profile_picture || school.logo,
        address: school.institution_location || school.address,
        website: school.institution_website,
        email: school.institution_email,
        description: school.institution_description,
        type: 'university',
      }));
      
      setSchools(formattedSchools);
      
      // If no school is selected yet and we have schools, select the first one
      if (!selectedSchool && formattedSchools.length > 0) {
        setSelectedSchool(formattedSchools[0]);
      }
      
    } catch (error) {
      console.error("Error fetching schools:", error);
      
      // Fallback mock data (optional)
      const mockSchools = [
        {
          id: 'unilag',
          name: 'University of Lagos',
          code: 'UNILAG',
          logo: 'https://i.pinimg.com/736x/7c/0e/fe/7c0efec92682d80048147b2e73d3c4d2.jpg',
          address: 'Akoka, Yaba, Lagos State, Nigeria',
          website: 'https://unilag.edu.ng',
          email: 'info@unilag.edu.ng',
          description: 'Federal university founded in 1962.',
          type: 'university',
        },
        {
          id: 'ileife',
          name: 'Obafemi Awolowo University',
          code: 'OAU',
          logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfwWX6sdVsQrNytuqVQjijmgSGpet1NZQg7w&s',
          address: 'Ile-Ife, Osun State, Nigeria',
          website: 'https://oauife.edu.ng',
          email: 'info@oauife.edu.ng',
          description: 'Established in 1961, renowned for academic excellence.',
          type: 'university',
        },
      ];
      
      setSchools(mockSchools);
      if (!selectedSchool && mockSchools.length > 0) {
        setSelectedSchool(mockSchools[0]);
      }
    } finally {
      setIsLoadingSchools(false);
    }
  };

  // Fetch schools on component mount
  useEffect(() => {
    if (schools.length === 0) {
      fetchSchools();
    }
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add school context to message if selected
    let messageText = input;
    if (selectedSchool) {
      messageText = `[${selectedSchool.name}] ${input}`;
    }

    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      school: selectedSchool?.name,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate bot response with school context
    setTimeout(() => {
      let botResponseText = `I understand you're asking about: ${input}`;
      
      if (selectedSchool) {
        botResponseText += ` at ${selectedSchool.name}. Let me help you with that!`;
      } else {
        botResponseText += `. Let me help you with that!`;
      }
      
      const botResponse = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with School Selector */}
      <div className="car mb-6 ">
        <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4 mb-4 ">
          {/* <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campus Chatbot</h1>
              <p className="text-gray-600">Ask me anything about campus life!</p>
            </div>
          </div> */}
          
          {/* School Dropdown */}
          {/* <div className="w-full sm:w-64 border min-w-96 "> */}
            {/* <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Institution
            </label> */}
            
           <div className=' absolute max-w-96 min-w-96 z-50 top-20'>
            <SchoolDropdown
              schools={schools}
              selectedSchool={selectedSchool}
              onSelectSchool={setSelectedSchool}
              isLoading={isLoadingSchools}
              placeholder="Choose your school..."
              className=''
            />
            </div>
            
            
            
            {/* {selectedSchool && (
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {selectedSchool.address}
              </div>
            )} */}
          {/* </div> */}
        </div>

        {/* Selected School Info */}
        {/* {selectedSchool && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              {selectedSchool.logo && (
                <img
                  src={selectedSchool.logo}
                  alt={selectedSchool.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{selectedSchool.name}</h3>
                  {selectedSchool.code && (
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                      {selectedSchool.code}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{selectedSchool.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  {selectedSchool.website && (
                    <a 
                      href={selectedSchool.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary-600 hover:underline"
                    >
                      Website
                    </a>
                  )}
                  {selectedSchool.email && (
                    <a 
                      href={`mailto:${selectedSchool.email}`}
                      className="hover:text-primary-600 hover:underline"
                    >
                      Email
                    </a>
                  )}
                  {selectedSchool.address && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {selectedSchool.address}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Chat Interface */}
      <div className="card mt-10">
        <div className="h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.school && (
                    <div className="text-xs font-medium mb-1 opacity-75">
                      {message.school}
                    </div>
                  )}
                  <p>{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectedSchool 
                    ? `Ask about ${selectedSchool.name}...` 
                    : "Type your message..."
                }
                className="flex-1 input-field"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="btn-primary px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
            {selectedSchool && (
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                <Building2 className="w-3 h-3" />
                <span>Chatting about: <strong>{selectedSchool.name}</strong></span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}








// import { useState, useRef, useEffect } from 'react';
// import { Send, Bot, User, Building2 } from 'lucide-react';
// import SchoolDropdown from '../components/SchoolDropdown';
// import { schoolApi } from "../api";

// export default function Chatbot() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm your campus assistant. How can I help you today?",
//       sender: 'bot',
//       timestamp: new Date()
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState(null);
//   const [isLoadingSchools, setIsLoadingSchools] = useState(false);
//   const [showDropdownOverlay, setShowDropdownOverlay] = useState(true);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Fetch schools from API
//   const fetchSchools = async () => {
//     setIsLoadingSchools(true);
    
//     try {
//       const response = await schoolApi.getAllSchools();
//       const schoolsData = response.data.data || response.data || [];

//       // Format the schools data
//       const formattedSchools = schoolsData.map((school) => ({
//         id: school.id,
//         name: school.institution_name || school.name,
//         code: school.code || school.id?.toUpperCase(),
//         logo: school.institution_profile_picture || school.logo,
//         address: school.institution_location || school.address,
//         website: school.institution_website,
//         email: school.institution_email,
//         description: school.institution_description,
//         type: 'university',
//       }));
      
//       setSchools(formattedSchools);
      
//       // If no school is selected yet and we have schools, select the first one
//       if (!selectedSchool && formattedSchools.length > 0) {
//         setSelectedSchool(formattedSchools[0]);
//       }
      
//     } catch (error) {
//       console.error("Error fetching schools:", error);
      
//       // Fallback mock data (optional)
//       const mockSchools = [
//         {
//           id: 'unilag',
//           name: 'University of Lagos',
//           code: 'UNILAG',
//           logo: 'https://i.pinimg.com/736x/7c/0e/fe/7c0efec92682d80048147b2e73d3c4d2.jpg',
//           address: 'Akoka, Yaba, Lagos State, Nigeria',
//           website: 'https://unilag.edu.ng',
//           email: 'info@unilag.edu.ng',
//           description: 'Federal university founded in 1962.',
//           type: 'university',
//         },
//         {
//           id: 'ileife',
//           name: 'Obafemi Awolowo University',
//           code: 'OAU',
//           logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfwWX6sdVsQrNytuqVQjijmgSGpet1NZQg7w&s',
//           address: 'Ile-Ife, Osun State, Nigeria',
//           website: 'https://oauife.edu.ng',
//           email: 'info@oauife.edu.ng',
//           description: 'Established in 1961, renowned for academic excellence.',
//           type: 'university',
//         },
//       ];
      
//       setSchools(mockSchools);
//       if (!selectedSchool && mockSchools.length > 0) {
//         setSelectedSchool(mockSchools[0]);
//       }
//     } finally {
//       setIsLoadingSchools(false);
//     }
//   };

//   // Fetch schools on component mount
//   useEffect(() => {
//     if (schools.length === 0) {
//       fetchSchools();
//     }
//   }, []);

//   const handleSend = (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     // Add school context to message if selected
//     let messageText = input;
//     if (selectedSchool) {
//       messageText = `[${selectedSchool.name}] ${input}`;
//     }

//     const userMessage = {
//       id: messages.length + 1,
//       text: messageText,
//       sender: 'user',
//       school: selectedSchool?.name,
//       timestamp: new Date()
//     };

//     setMessages([...messages, userMessage]);
//     setInput('');

//     // Simulate bot response with school context
//     setTimeout(() => {
//       let botResponseText = `I understand you're asking about: ${input}`;
      
//       if (selectedSchool) {
//         botResponseText += ` at ${selectedSchool.name}. Let me help you with that!`;
//       } else {
//         botResponseText += `. Let me help you with that!`;
//       }
      
//       const botResponse = {
//         id: messages.length + 2,
//         text: botResponseText,
//         sender: 'bot',
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, botResponse]);
//     }, 1000);
//   };

//   // Handle school selection
//   const handleSelectSchool = (school) => {
//     setSelectedSchool(school);
//     setShowDropdownOverlay(false);
//   };

//   return (
//     <div className="max-w-4xl mx-auto relative min-h-screen">
//       {/* Absolutely Positioned Dropdown Overlay */}
//       {showDropdownOverlay && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
//           <div className="w-full max-w-2xl mx-4">
//             <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
//               <div className="text-center mb-8">
//                 <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Bot className="w-10 h-10 text-primary-600" />
//                 </div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                   Welcome to Campus Chatbot
//                 </h1>
//                 <p className="text-gray-600 text-lg">
//                   Please select your institution to get started
//                 </p>
//               </div>
              
//               <div className="mb-6">
//                 <label className="block text-lg font-semibold text-gray-700 mb-3">
//                   Select Your Institution
//                 </label>
//                 <SchoolDropdown
//                   schools={schools}
//                   selectedSchool={selectedSchool}
//                   onSelectSchool={handleSelectSchool}
//                   isLoading={isLoadingSchools}
//                   placeholder="Search or select your school..."
//                   className="text-lg"
//                 />
//               </div>
              
//               {selectedSchool && (
//                 <div className="flex gap-4 mt-6">
//                   <button
//                     onClick={() => setShowDropdownOverlay(false)}
//                     className="flex-1 py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
//                   >
//                     Continue to Chat
//                   </button>
//                   <button
//                     onClick={() => {
//                       setSelectedSchool(null);
//                       setShowDropdownOverlay(true);
//                     }}
//                     className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     Change Selection
//                   </button>
//                 </div>
//               )}
              
//               <p className="text-center text-gray-500 text-sm mt-6">
//                 You can change your institution anytime from the chat interface
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Floating School Indicator */}
//       {selectedSchool && !showDropdownOverlay && (
//         <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
//           <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg px-4 py-2 flex items-center gap-3">
//             <div className="flex items-center gap-2">
//               {selectedSchool.logo ? (
//                 <img
//                   src={selectedSchool.logo}
//                   alt={selectedSchool.name}
//                   className="w-6 h-6 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
//                   <Building2 className="w-4 h-4 text-primary-600" />
//                 </div>
//               )}
//               <span className="font-medium text-gray-900">{selectedSchool.name}</span>
//               {selectedSchool.code && (
//                 <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
//                   {selectedSchool.code}
//                 </span>
//               )}
//             </div>
//             <button
//               onClick={() => setShowDropdownOverlay(true)}
//               className="text-sm text-primary-600 hover:text-primary-800 font-medium"
//             >
//               Change
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main Chat Interface */}
//       <div className="pt-16"> {/* Add padding to avoid overlap with floating indicator */}
//         <div className="card mb-6">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
//               <Bot className="w-6 h-6 text-primary-600" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Campus Chatbot</h1>
//               <p className="text-gray-600">Ask me anything about campus life!</p>
//             </div>
//           </div>
          
//           {/* Selected School Info Card */}
//           {selectedSchool && (
//             <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//               <div className="flex items-start gap-3">
//                 {selectedSchool.logo && (
//                   <img
//                     src={selectedSchool.logo}
//                     alt={selectedSchool.name}
//                     className="w-12 h-12 rounded-lg object-cover"
//                   />
//                 )}
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <h3 className="font-semibold text-gray-900">{selectedSchool.name}</h3>
//                     {selectedSchool.code && (
//                       <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded">
//                         {selectedSchool.code}
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-600 mb-2">{selectedSchool.description}</p>
//                   <div className="flex flex-wrap gap-3 text-xs text-gray-500">
//                     {selectedSchool.address && (
//                       <span className="flex items-center gap-1">
//                         <Building2 className="w-3 h-3" />
//                         {selectedSchool.address}
//                       </span>
//                     )}
//                     {selectedSchool.website && (
//                       <a 
//                         href={selectedSchool.website} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="hover:text-primary-600 hover:underline"
//                       >
//                         Website
//                       </a>
//                     )}
//                     {selectedSchool.email && (
//                       <a 
//                         href={`mailto:${selectedSchool.email}`}
//                         className="hover:text-primary-600 hover:underline"
//                       >
//                         Email
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="card">
//           <div className="h-[600px] flex flex-col">
//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto space-y-4 p-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   {message.sender === 'bot' && (
//                     <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
//                       <Bot className="w-5 h-5 text-white" />
//                     </div>
//                   )}
//                   <div
//                     className={`max-w-[70%] rounded-lg p-4 ${
//                       message.sender === 'user'
//                         ? 'bg-primary-600 text-white'
//                         : 'bg-gray-100 text-gray-900'
//                     }`}
//                   >
//                     {message.school && (
//                       <div className="text-xs font-medium mb-1 opacity-75">
//                         {message.school}
//                       </div>
//                     )}
//                     <p>{message.text}</p>
//                     <p className={`text-xs mt-2 ${
//                       message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
//                     }`}>
//                       {message.timestamp.toLocaleTimeString()}
//                     </p>
//                   </div>
//                   {message.sender === 'user' && (
//                     <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
//                       <User className="w-5 h-5 text-gray-600" />
//                     </div>
//                   )}
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input */}
//             <form onSubmit={handleSend} className="border-t p-4">
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder={
//                     selectedSchool 
//                       ? `Ask about ${selectedSchool.name}...` 
//                       : "Select an institution to start chatting..."
//                   }
//                   className="flex-1 input-field"
//                   disabled={!selectedSchool}
//                 />
//                 <button
//                   type="submit"
//                   disabled={!input.trim() || !selectedSchool}
//                   className="btn-primary px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Send className="w-5 h-5" />
//                   Send
//                 </button>
//               </div>
//               {selectedSchool ? (
//                 <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
//                   <Building2 className="w-3 h-3" />
//                   <span>Chatting about: <strong>{selectedSchool.name}</strong></span>
//                   <button
//                     type="button"
//                     onClick={() => setShowDropdownOverlay(true)}
//                     className="ml-auto text-primary-600 hover:text-primary-800 text-xs font-medium"
//                   >
//                     Change institution
//                   </button>
//                 </div>
//               ) : (
//                 <div className="mt-2 text-xs text-yellow-600 flex items-center gap-2">
//                   <Building2 className="w-3 h-3" />
//                   <span>Please select an institution to start chatting</span>
//                 </div>
//               )}
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


