import { SeniorResultTemplate } from "./components/senior-result-template"


const seniorSecondaryData = {
  school: {
    name: "Private School",
    address: "16, Bayo Oyewole Street, Ago–Palace Way, Okota, Lagos.",
    term: "First Term",
    session: "2015/2016",
  },
  pupil: {
    name: "Peters Felix Adekunle",
    age: 16,
    class: "SS2",
    numberInClass: 8,
    admissionNo: "GHS0005",
  },
  summary: {
    marksObtainable: 900,
    marksObtained: 458,
    average: 50.89,
    percentage: "51%",
  },
  subjects: [
    { name: "Physics", ca1: 17, ca2: 7, exam: 34, total: 58, grade: "D7", remarks: "Pass" },
    { name: "Chemistry", ca1: 2, ca2: 5, exam: 45, total: 52, grade: "D7", remarks: "Pass" },
    { name: "Commerce", ca1: 6, ca2: 4, exam: 27, total: 37, grade: "F9", remarks: "Fail" },
    { name: "Mathematics", ca1: 16, ca2: 15, exam: 42, total: 73, grade: "C5", remarks: "Credit" },
    { name: "Economics", ca1: 8, ca2: 15, exam: 45, total: 68, grade: "C6", remarks: "Credit" },
    { name: "Biology", ca1: 9, ca2: 6, exam: 43, total: 58, grade: "C6", remarks: "Credit" },
    { name: "Government", ca1: 3, ca2: 4, exam: 60, total: 67, grade: "C5", remarks: "Credit" },
    { name: "Accounting", ca1: 1, ca2: 3, exam: 46, total: 50, grade: "E8", remarks: "Weak Pass" },
    { name: "Computer", ca1: 18, ca2: 15, exam: 33, total: 66, grade: "C5", remarks: "Credit" },
  ],
  remarks: {
    teacher: "Good but work more next term",
    houseMaster: "Satisfactory and good at school, but try harder",
  },
  termDates: {
    nextTermBegins: "1st March, 2016",
    thisTermEnds: "15th April, 2016",
  },
}

export default function SeniorSecondaryPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Senior Secondary School Result</h1>
          <p className="text-gray-600">Academic Performance Report - SS2</p>
        </div> */}
        <SeniorResultTemplate data={seniorSecondaryData} />
      </div>
    </div>
  )
}
