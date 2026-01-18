import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function PublicTrustGauge({ value = 75 }) {
  const data = [
    { name: "Score", value: value },
    { name: "Remaining", value: 100 - value },
  ];

  const getColor = (val) => {
    if (val >= 70) return "#10b981"; // green
    if (val >= 40) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const color = getColor(value);
  const cx = "50%";
  const cy = "70%";
  const iR = 60;
  const oR = 80;

  // Needle animation variants
  // Convert value (0-100) to angle (-90 to 90 degrees) for CSS rotation if we used a needle div
  // But here we'll use just the pie filling up.

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-between relative overflow-hidden h-full min-h-[160px]"
    >
      <h3 className="text-gray-500 text-sm font-medium absolute top-4 left-6">
        Public Trust Score
      </h3>

      <div className="w-full h-32 mt-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx={cx}
              cy={cy}
              innerRadius={iR}
              outerRadius={oR}
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Centered Value */}
        <div className="absolute inset-x-0 bottom-0 text-center -mb-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="text-4xl font-bold" style={{ color }}>
              {value}%
            </span>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-1">
              {value >= 70 ? "Excellent" : value >= 40 ? "Average" : "Critical"}
            </p>
          </motion.div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-2 px-4">
        Based on real-time analysis of student posts & comments.
      </p>

      {/* Decorative background glow */}
      <div
        className="absolute -top-10 -right-10 w-24 h-24 bg-gray-50 rounded-full blur-2xl z-0 pointer-events-none"
        style={{ backgroundColor: `${color}15` }} // 15% opacity hex
      />
    </motion.div>
  );
}
