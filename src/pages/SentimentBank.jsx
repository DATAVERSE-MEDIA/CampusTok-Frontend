import MetricCard from "../components/sentimentBank/MetricCard";
import PublicTrustGauge from "../components/sentimentBank/PublicTrustGauge";
import WhatPeopleAreSaying from "../components/sentimentBank/WhatPeopleAreSaying";
import SentimentBySchoolAreas from "../components/sentimentBank/SentimentBySchoolAreas";
import ChatBotInsights from "../components/sentimentBank/ChatBotInsights";
import RecommendedActions from "../components/sentimentBank/RecommendedActions";

export default function SentimentBank() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex justify-center pb-8 scroll-smooth">
      <div className="mx-auto p-4 lg:p-8 w-full max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sentiment Bank</h1>
          <p className="text-gray-500">
            Real-time analysis of campus public opinion
          </p>
        </div>

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
          <div className="h-[320px]">
            <WhatPeopleAreSaying />
          </div>
          <div className="h-[320px]">
            <SentimentBySchoolAreas />
          </div>
        </div>

        {/* Bottom Section - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="h-full">
            <ChatBotInsights />
          </div>
          <div className="h-full">
            <RecommendedActions />
          </div>
        </div>
      </div>
    </div>
  );
}
