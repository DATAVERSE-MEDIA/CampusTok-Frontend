export default function WhatPeopleAreSaying({ comments = [] }) {
  const defaultComments = [
    {
      category: "Facilities",
      author: "Parents",
      timeAgo: "2hrs ago",
      comment: "The bathroom are always dirty and the AC is..."
    },
    {
      category: "Academics",
      author: "Student",
      timeAgo: "1 day ago",
      comment: "The bathroom are always dirty and the AC is..."
    },
    {
      category: "Academics",
      author: "Student",
      timeAgo: "1 day ago",
      comment: "The bathroom are always dirty and the AC is..."
    }
  ]

  const displayComments = comments.length > 0 ? comments : defaultComments

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        What people are saying
      </h3>
      <div className="space-y-4">
        {displayComments.map((item, index) => (
          <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">
                {item.category}
              </span>
              <span className="text-xs text-gray-500">
                -{item.author}, {item.timeAgo}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              "{item.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

