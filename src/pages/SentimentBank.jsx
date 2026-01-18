import MetricCard from "../components/sentimentBank/MetricCard";
import PublicTrustGauge from "../components/sentimentBank/PublicTrustGauge";
import WhatPeopleAreSaying from "../components/sentimentBank/WhatPeopleAreSaying";
import SentimentBySchoolAreas from "../components/sentimentBank/SentimentBySchoolAreas";
import ChatBotInsights from "../components/sentimentBank/ChatBotInsights";
import RecommendedActions from "../components/sentimentBank/RecommendedActions";
import { METRICS_DATA } from "../data/sentimentData";

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
            title={METRICS_DATA.overallSentiment.label}
            value={METRICS_DATA.overallSentiment.value + "%"}
            context={METRICS_DATA.overallSentiment.period}
            trend={METRICS_DATA.overallSentiment.trend}
            data={METRICS_DATA.overallSentiment.history}
            color="green"
            index={0}
          />
          <MetricCard
            title={METRICS_DATA.studentVoices.label}
            value={METRICS_DATA.studentVoices.value}
            context={METRICS_DATA.studentVoices.context}
            trend="positive"
            data={METRICS_DATA.studentVoices.history}
            color="blue"
            index={1}
          />
          <MetricCard
            title={METRICS_DATA.criticalIssues.label}
            value={METRICS_DATA.criticalIssues.value}
            context={METRICS_DATA.criticalIssues.context}
            trend="negative"
            data={METRICS_DATA.criticalIssues.history}
            color="red"
            index={2}
          />
          <PublicTrustGauge value={82} />
        </div>

        {/* Middle Section - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
          {/* Left Column - Live Feed */}
          <div className="h-[320px]">
            <WhatPeopleAreSaying />
          </div>

          {/* Right Column - Radar Chart */}
          <div className="h-[320px]">
            <SentimentBySchoolAreas />
          </div>
        </div>

        {/* Bottom Section - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left Column - ChatBot Generated Insights */}
          <div className="h-full">
            <ChatBotInsights />
          </div>

          {/* Right Column - Recommended Actions */}
          <div className="h-full">
            <RecommendedActions />
          </div>
        </div>
      </div>
    </div>
  );
}
