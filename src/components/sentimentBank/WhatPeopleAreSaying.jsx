import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { RECENT_FEEDBACK } from "../../data/sentimentData";

export default function WhatPeopleAreSaying() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate the highlighted comment every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % RECENT_FEEDBACK.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentFeedback = RECENT_FEEDBACK[currentIndex];

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="w-4 h-4 text-green-500" />;
      case "negative":
        return <ThumbsDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary-600" />
          Live Student Feed
        </h3>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </div>

      <div className="flex-1 relative min-h-[140px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFeedback.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 h-full flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                    {currentFeedback.student.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {currentFeedback.student}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentFeedback.faculty}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {currentFeedback.time}
                </span>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-auto italic">
                "{currentFeedback.text}"
              </p>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                {getSentimentIcon(currentFeedback.sentiment)}
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {currentFeedback.sentiment} sentiment
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {RECENT_FEEDBACK.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-6 bg-primary-600" : "w-1.5 bg-gray-200"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
