const RightSidebar = ({ navigate }) => (

  <div className="w-full bg-white p-4 lg:p-6 flex items-start sticky top-0 h-fit">
    <div className="border border-gray-200 rounded-lg p-4 lg:p-6 w-full bg-white">
      <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg lg:text-xl">
             <img src="https://res.cloudinary.com/ddcfjn03w/image/upload/v1768467101/chatbot/chatbot%20icon.png" className=''/>
          </span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm lg:text-base">HI, I'm ChatBot</h3>
        </div>
      </div>
      <p className="text-gray-600 text-xs lg:text-sm mb-4 lg:mb-6 leading-relaxed">
        You can ask me questions based on a particular institution.
      </p>
      <button
        onClick={() => navigate('/chatbot')}
        className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2.5 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base"
      >
        Use ChatBot
      </button>
    </div>
  </div>
)


export default RightSidebar;