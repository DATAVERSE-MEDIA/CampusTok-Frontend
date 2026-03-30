import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { RECOMMENDED_ACTIONS } from "../../data/sentimentData";

export default function RecommendedActions() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-600 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-600 border-orange-200";
      default:
        return "bg-blue-100 text-blue-600 border-blue-200";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "maintenance":
        return <Clock className="w-4 h-4" />;
      case "academic":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900">Recommended Actions</h3>
        <button className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3 flex-1"
      >
        {RECOMMENDED_ACTIONS.map((action) => (
          <motion.div
            key={action.id}
            variants={item}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all cursor-pointer group`}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getPriorityColor(
                    action.priority
                  )} bg-opacity-50`}
                >
                  {getIcon(action.type)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {action.desc}
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${getPriorityColor(
                  action.priority
                )}`}
              >
                {action.priority}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
