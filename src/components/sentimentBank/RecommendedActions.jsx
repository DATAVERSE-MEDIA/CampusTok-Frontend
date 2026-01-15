export default function RecommendedActions({ actions = [] }) {
  const defaultActions = [
    "Address facility problem urgently",
    "Send update to campus safety measures",
    "Communicate academic achievement"
  ]

  const displayActions = actions.length > 0 ? actions : defaultActions

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recommended Actions
      </h3>
      <ul className="space-y-2">
        {displayActions.map((action, index) => (
          <li key={index} className="text-sm text-gray-700 flex items-start">
            <span className="text-gray-900 mr-2 font-bold">•</span>
            <span>{action}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

