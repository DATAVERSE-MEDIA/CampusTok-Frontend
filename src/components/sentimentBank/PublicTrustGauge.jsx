export default function PublicTrustGauge({ value = 82 }) {
  // Calculate the angle for the gauge (0-180 degrees for semi-circle)
  const percentage = Math.min(Math.max(value, 0), 100)
  const radius = 70
  const circumference = Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
      <h3 className="text-sm text-gray-600 mb-4">Public Trust Index</h3>
      <div className="relative w-full max-w-[180px] mx-auto h-28">
        {/* Semi-circle gauge */}
        <svg className="w-full h-full" viewBox="0 0 200 110">
          {/* Background arc */}
          <path
            d="M 30 90 A 70 70 0 0 1 170 90"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Filled arc based on percentage */}
          <path
            d="M 30 90 A 70 70 0 0 1 170 90"
            fill="none"
            stroke="#10b981"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(180 100 90)"
            style={{ transformOrigin: '100px 90px' }}
          />
        </svg>
        {/* Percentage text - centered in the semi-circle */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <p className="text-3xl font-bold text-gray-900">{value}%</p>
        </div>
      </div>
    </div>
  )
}

