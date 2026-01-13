export default function MetricCard({ title, value, subtitle, color = 'green', showBarChart = false, showLineChart = false }) {
  const colorClasses = {
    green: {
      dot: 'bg-green-500',
      bar: 'bg-green-500',
      line: '#10b981'
    },
    blue: {
      dot: 'bg-blue-500',
      bar: 'bg-blue-500',
      line: '#3b82f6'
    },
    red: {
      dot: 'bg-red-500',
      bar: 'bg-red-500',
      line: '#ef4444'
    }
  }

  const colors = colorClasses[color] || colorClasses.green

  // Line chart data - upward trending
  const blueLineData = [15, 18, 16, 22, 20, 25, 23, 28]
  const redLineData = [10, 12, 15, 18, 20, 25, 28, 30]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
      <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
      <div className="flex items-center gap-2 mb-3">
        {color === 'green' && <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>}
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
      
      {/* Bar Chart for Overall Sentiment */}
      {showBarChart && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${colors.bar} rounded-full`} style={{ width: '72%' }}></div>
          </div>
        </div>
      )}

      {/* Line Chart for Total Mentions (blue) */}
      {showLineChart && color === 'blue' && (
        <div className="mt-4 h-10">
          <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" className="overflow-visible">
            <polyline
              points={blueLineData.map((val, i) => `${(i / (blueLineData.length - 1)) * 100},${40 - (val / 30) * 30}`).join(' ')}
              fill="none"
              stroke={colors.line}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Line Chart for Critical Issues (red) */}
      {showLineChart && color === 'red' && (
        <div className="mt-4 h-10">
          <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" className="overflow-visible">
            <polyline
              points={redLineData.map((val, i) => `${(i / (redLineData.length - 1)) * 100},${40 - (val / 30) * 30}`).join(' ')}
              fill="none"
              stroke={colors.line}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

