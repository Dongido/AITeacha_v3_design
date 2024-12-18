const questionTypelist = [
  { label: "Multiple choice", value: "Multiple choice" },
  { label: "Short answer", value: "Short answer" },
  { label: "Essay", value: "Essay" },
];

const voiceTypelist = [
  { label: "Male Voice", value: "alloy" },
  { label: "Female Voice", value: "nova" },
];

const ageGroupList = [
  { label: "1 - 3 years", value: "1 - 3 years" },
  { label: "4 - 7 years", value: "4 - 7 years" },
  { label: "7 - 18 years", value: "7 - 18 years" },
];

const supportResourcesList = [
  { label: "Specialized educators", value: "specialized educators" },
  { label: "Assistive technologies", value: "assistive technologies" },
];

const difficultyList = [
  { label: "Basic", value: "basic" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const mediaTypelist = [
  { label: "Video", value: "Video" },
  { label: "Audio", value: "Audio" },
];
const activityList = [
  { label: "Quizzes", value: "Quizzes" },
  { label: "Crossword Puzzles", value: "Crossword Puzzles" },
  { label: "Word Searches", value: "Word Searches" },
  { label: "Matching Games", value: "Matching Games" },
];
const curriculumFocus = [
  {
    label: "Learner-centered curriculum",
    value: "Learner-centered curriculum",
  },
  { label: " Integrated curriculum", value: "Integrated curriculum" },
  {
    label: "Activity centered curriculum",
    value: "Activity centered curriculum",
  },
  {
    label: "Teacher-centered curriculum",
    value: "Teacher-centered curriculum",
  },
];
const wordTypeList = [
  { label: "Nouns", value: "nouns" },
  { label: "Adjectives", value: "adjectives" },
  { label: "Verbs", value: "verbs" },
];

interface SDGOption {
  id: string;
  value: string;
  label: string;
}

const sdgOptions: SDGOption[] = [
  { id: "sdg1", value: "No Poverty", label: "SDG 1 - No Poverty" },
  { id: "sdg2", value: "Zero Hunger", label: "SDG 2 - Zero Hunger" },
  {
    id: "sdg3",
    value: "Good Health and Well-being",
    label: "SDG 3 - Good Health and Well-being",
  },
  {
    id: "sdg4",
    value: "Quality Education",
    label: "SDG 4 - Quality Education",
  },
  {
    id: "sdg5",
    value: "Gender Equality",
    label: "SDG 5 - Gender Equality",
  },
  {
    id: "sdg6",
    value: "Clean Water and Sanitation",
    label: "SDG 6 - Clean Water and Sanitation",
  },
  {
    id: "sdg7",
    value: "Affordable and Clean Energy",
    label: "SDG 7 - Affordable and Clean Energy",
  },
  {
    id: "sdg8",
    value: "Decent Work and Economic Growth",
    label: "SDG 8 - Decent Work and Economic Growth",
  },
  {
    id: "sdg9",
    value: "Industry, Innovation, and Infrastructure",
    label: "SDG 9 - Industry, Innovation, and Infrastructure",
  },
  {
    id: "sdg10",
    value: " Reduced Inequality",
    label: "SDG 10 - Reduced Inequality",
  },
  {
    id: "sdg11",
    value: "Sustainable Cities and Communities",
    label: "SDG 11 - Sustainable Cities and Communities",
  },
  {
    id: "sdg12",
    value: "Responsible Consumption and Production",
    label: "SDG 12 - Responsible Consumption and Production",
  },
  {
    id: "sdg13",
    value: "Climate Action",
    label: "SDG 13 - Climate Action",
  },
  {
    id: "sdg14",
    value: "Life Below Water",
    label: "SDG 14 - Life Below Water",
  },
  {
    id: "sdg15",
    value: "Life on Land",
    label: "SDG 15 - Life on Land",
  },
  {
    id: "sdg16",
    value: "Peace, Justice, and Strong Institutions",
    label: "SDG 16 - Peace, Justice, and Strong Institutions",
  },
  {
    id: "sdg17",
    value: "Partnerships for the Goals",
    label: "SDG 17 - Partnerships for the Goals",
  },
];
const examTypeList = [
  { label: "SAT", value: "SAT" },
  { label: "TOEFL", value: "TOEFL" },
  { label: "IELTS", value: "IELTS" },
  { label: "GMAT", value: "GMAT" },
];

export {
  activityList,
  sdgOptions,
  questionTypelist,
  ageGroupList,
  supportResourcesList,
  wordTypeList,
  examTypeList,
  curriculumFocus,
  mediaTypelist,
  difficultyList,
  voiceTypelist,
};
