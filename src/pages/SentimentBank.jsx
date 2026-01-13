import MetricCard from '../components/sentimentBank/MetricCard'
import PublicTrustGauge from '../components/sentimentBank/PublicTrustGauge'
import WhatPeopleAreSaying from '../components/sentimentBank/WhatPeopleAreSaying'
import SentimentBySchoolAreas from '../components/sentimentBank/SentimentBySchoolAreas'
import ChatBotInsights from '../components/sentimentBank/ChatBotInsights'
import RecommendedActions from '../components/sentimentBank/RecommendedActions'
import RightSidebar from '../components/RightSideBar'

export default function SentimentBank() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex justify-center">
      <div className="mx-auto p-4 lg:p-6 md:min-w-[70%]">
        {/* Top Metrics Row - 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          <MetricCard
            title="Overall Sentiment"
            value="72% • Positive"
            color="green"
            showBarChart={true}
          />
          <MetricCard
            title="Total mentions"
            value="1,250 Analyzed"
            color="blue"
            showLineChart={true}
          />
          <MetricCard
            title="Critical Issues"
            value="50 Alerts"
            color="red"
            showLineChart={true}
          />
          <PublicTrustGauge value={82} />
        </div>

        {/* Middle Section - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
          {/* Left Column - What people are saying */}
          <WhatPeopleAreSaying />

          {/* Right Column - Sentiment by school areas */}
          <SentimentBySchoolAreas />
        </div>

        {/* Bottom Section - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left Column - ChatBot Generated Insights */}
          <ChatBotInsights />

          {/* Right Column - Recommended Actions */}
          <RecommendedActions />
        </div>
      </div>

      <div className='hidden md:block'>
      <RightSidebar />
      </div>
      
    </div>
  )
}

