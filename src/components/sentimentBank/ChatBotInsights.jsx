export default function ChatBotInsights({ insights = [] }) {
  const defaultInsights = [
    "Spike about facility issue",
    "Positive feedback on academi...",
    "Security concerns rising after..."
  ]

  const displayInsights = insights.length > 0 ? insights : defaultInsights

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        ChatBot Generated Insights
      </h3>
      <ul className="space-y-2">
        {displayInsights.map((insight, index) => (
          <li key={index} className="text-sm text-gray-700 flex items-start">
            <span className="text-gray-900 mr-2 font-bold">•</span>
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

