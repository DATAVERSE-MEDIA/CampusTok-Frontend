import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bot, Lightbulb } from "lucide-react";
import { CHATBOT_INSIGHTS } from "../../data/sentimentData";

const Typewriter = ({ text, speed = 20 }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayText("");
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <p className="text-sm text-gray-700 leading-relaxed">{displayText}</p>;
};

export default function ChatBotInsights() {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentInsightIndex((prev) => (prev + 1) % CHATBOT_INSIGHTS.length);
    }, 8000); // Change insight every 8 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 border border-primary-700 shadow-md relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Bot className="w-32 h-32 text-white" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary-700 rounded-lg">
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          <h3 className="font-bold text-white text-lg">AI Insights</h3>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 min-h-[100px] shadow-inner">
          <Typewriter
            key={currentInsightIndex}
            text={CHATBOT_INSIGHTS[currentInsightIndex]}
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-1">
            {CHATBOT_INSIGHTS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentInsightIndex
                    ? "w-6 bg-yellow-400"
                    : "w-1.5 bg-primary-600"
                }`}
              />
            ))}
          </div>
          <button className="text-xs text-primary-200 hover:text-white flex items-center gap-1 transition-colors">
            <Lightbulb className="w-3 h-3" />
            Generate New Report
          </button>
        </div>
      </div>
    </motion.div>
  );
}
