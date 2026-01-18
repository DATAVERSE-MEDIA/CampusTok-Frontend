export const METRICS_DATA = {
  overallSentiment: {
    value: 72,
    trend: "positive",
    history: [65, 68, 70, 72, 71, 74, 72],
    label: "Overall Sentiment",
    period: "Last 7 days",
  },
  studentVoices: {
    value: 2845,
    history: [200, 350, 400, 380, 500, 450, 565], // Mentions per day
    label: "Student Voices Heard",
    context: "+15% from last week",
  },
  criticalIssues: {
    value: 12,
    history: [5, 8, 12, 10, 15, 12, 12],
    label: "Urgent Alerts",
    context: "Requires attention",
  },
};

export const RECENT_FEEDBACK = [
  {
    id: 1,
    student: "Chidon A.",
    faculty: "Engineering",
    text: "The Wifi at Julius Berger hall is actually fast today! First time in weeks. 🙌",
    sentiment: "positive",
    time: "2 mins ago",
  },
  {
    id: 2,
    student: "Teniola O.",
    faculty: "Arts",
    text: "Please can management look into the shuttle bus prices? ₦200 per trip is getting too much for us.",
    sentiment: "negative",
    time: "15 mins ago",
  },
  {
    id: 3,
    student: "Emeka J.",
    faculty: "Science",
    text: "GST 104 exam timetable is clashing with CHM 102. Who do we complain to?",
    sentiment: "neutral",
    time: "1 hour ago",
  },
  {
    id: 4,
    student: "Fatima B.",
    faculty: "Social Sciences",
    text: "The new cafe at Moremi Hall serves the best Jollof now. No cap! 🔥",
    sentiment: "positive",
    time: "2 hours ago",
  },
];

export const SENTIMENT_BY_AREA = [
  { subject: "Academics", A: 85, fullMark: 100 },
  { subject: "Hostel", A: 45, fullMark: 100 },
  { subject: "Transport", A: 60, fullMark: 100 },
  { subject: "Security", A: 90, fullMark: 100 },
  { subject: "Cafeteria", A: 75, fullMark: 100 },
  { subject: "Admin", A: 50, fullMark: 100 },
];

export const CHATBOT_INSIGHTS = [
  "⚠️ Anomaly Detected: Sudden spike in keywords 'Shuttle' and 'Price' starting 08:00 AM today.",
  "📈 Positive Trend: Satisfaction with 'Campus Security' has risen by 12% following new lighting installation.",
  "💡 Suggestion: Consider releasing an official statement regarding the GST exam timetable conflict to reduce anxiety.",
];

export const RECOMMENDED_ACTIONS = [
  {
    id: 1,
    title: "Address Transport Costs",
    desc: "Meeting with Student Union regarding shuttle pricing concerns.",
    priority: "high",
    type: "meeting",
  },
  {
    id: 2,
    title: "Resolve Exam Clash",
    desc: "Coordinate with Faculty of Science on GST 104 / CHM 102 timeline.",
    priority: "critical",
    type: "academic",
  },
  {
    id: 3,
    title: "Hostel Maintenance",
    desc: "Schedule pump repairs for Moremi Hall water supply.",
    priority: "medium",
    type: "maintenance",
  },
];
