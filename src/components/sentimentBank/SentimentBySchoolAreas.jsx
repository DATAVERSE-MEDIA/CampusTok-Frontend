import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { SENTIMENT_BY_AREA } from "../../data/sentimentData";

export default function SentimentBySchoolAreas() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-900">Sentiment by Area</h3>
        <select className="text-xs bg-gray-50 border-gray-200 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-primary-500">
          <option>This Week</option>
          <option>Last Week</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Breakdown of student satisfaction across key campus facilities.
      </p>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={SENTIMENT_BY_AREA}
          >
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
            />
            {/* <PolarRadiusAxis angle={30} domain={[0, 100]} /> */}
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ color: "#4f46e5", fontWeight: 600 }}
            />
            <Radar
              name="Satisfaction Score"
              dataKey="A"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="#8b5cf6"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-violet-500 opacity-20 border border-violet-500"></span>
          <span className="text-xs text-gray-500">Current Score</span>
        </div>
      </div>
    </motion.div>
  );
}
