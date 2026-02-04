import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { useEffect, useState } from "react";

const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(String(value).replace(/,/g, ""), 10) || 0;
    if (start === end) return;

    let timer = setInterval(() => {
      start += Math.ceil(end / 100);
      if (start > end) start = end;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, 10); // simple fast counter

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default function MetricCard({
  title,
  value,
  subValue, // e.g., "Analyzed" or "Alerts"
  context, // e.g., "72% • Positive" or text context
  trend, // "positive" | "negative" | "neutral"
  data = [], // Array of numbers for sparkline
  color = "blue",
  index = 0,
}) {
  // Theme configuration
  const themes = {
    blue: {
      gradientFrom: "#3b82f6",
      gradientTo: "#93c5fd",
      stroke: "#2563eb",
      bg: "bg-blue-50",
      text: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    green: {
      gradientFrom: "#10b981",
      gradientTo: "#6ee7b7",
      stroke: "#059669",
      bg: "bg-green-50",
      text: "text-green-600",
      iconBg: "bg-green-100",
    },
    red: {
      gradientFrom: "#ef4444",
      gradientTo: "#fca5a5",
      stroke: "#dc2626",
      bg: "bg-red-50",
      text: "text-red-600",
      iconBg: "bg-red-100",
    },
  };

  const theme = themes[color] || themes.blue;

  // Format data for Recharts
  const chartData = data.map((val, i) => ({ i, val }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {typeof value === "number" ? <Counter value={value} /> : value}
            </h2>
            {subValue && (
              <span className="text-sm text-gray-400 font-medium">
                {subValue}
              </span>
            )}
          </div>
        </div>

        {/* Trend Icon */}
        <div className={`p-2 rounded-full ${theme.iconBg}`}>
          {trend === "positive" && (
            <ArrowUpRight className={`w-4 h-4 ${theme.text}`} />
          )}
          {trend === "negative" && (
            <ArrowDownRight className={`w-4 h-4 ${theme.text}`} />
          )}
          {trend === "neutral" && <Minus className={`w-4 h-4 ${theme.text}`} />}
          {!trend && <div className={`w-4 h-4 ${theme.bg} rounded-full`} />}
        </div>
      </div>

      {/* Context / Subtext */}
      <div className="mb-4">
        <p
          className={`text-xs font-semibold ${theme.text} flex items-center gap-1`}
        >
          {context}
        </p>
      </div>

      {/* Sparkline Chart */}
      <div className="h-16 w-full absolute bottom-0 left-0 right-0 opacity-50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id={`gradient-${color}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={theme.gradientFrom}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={theme.gradientTo}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Tooltip cursor={false} content={<></>} />
            <Area
              type="monotone"
              dataKey="val"
              stroke={theme.stroke}
              strokeWidth={2}
              fill={`url(#gradient-${color})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
