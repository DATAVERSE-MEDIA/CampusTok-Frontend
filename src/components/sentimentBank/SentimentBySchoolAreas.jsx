export default function SentimentBySchoolAreas({ areas = [] }) {
  const defaultAreas = [
    { name: "Academics", sentiment: 95 },
    { name: "Faculties", sentiment: 98 },
    { name: "Securities", sentiment: 92 },
    { name: "Administratives", sentiment: 96 }
  ]

  const displayAreas = areas.length > 0 ? areas : defaultAreas

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Sentiment by school areas
      </h3>
      <div className="grid grid-cols-2 gap-6">
        {displayAreas.map((area, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Circular gauge - mostly filled green */}
            <div className="relative w-28 h-28 mb-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="6"
                />
                {/* Filled circle - high sentiment (mostly green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeDasharray={`${(area.sentiment / 100) * 263.9} 263.9`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-700 text-center font-medium">
              {area.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

