import { useState } from "react"
import { Settings, Edit2, Trash2, EyeOff } from "lucide-react" // Added EyeOff icon
import { Button } from "../../../../components/ui/Button"
import { Label } from "../../../../components/ui/Label"
import { Switch } from "../../../../components/ui/Switch"
import { Input } from "../../../../components/ui/Input"
import { TextArea } from "../../../../components/ui/TextArea"
import EditTemplate from "./juniortemplate/EditTempalte"
import { useNavigate } from "react-router-dom"




// ... (Interface and sampleData remain the same)
export interface Subject {
  name: string
  firstCA: number
  secondCA: number
  exam: number
  total: number
  grade: string
  position: string
  teacher: string
  thirdCA: number
  average: number
}

export interface AffectiveSkill {
  skill: string
  rating: number
}

export interface PsychomotorSkill {
  skill: string
  rating: number
}

export interface PrimaryResultData {
  studentName: string
  gender: string
  admissionNumber: string
  age: string
  term: string
  session: string
  class: string
  studentsInClass: number
  classTeacher: string
  totalDaysInTerm: number
  totalDaysPresent: number
  totalDaysAbsent: number
  resumption: string
  subjects: Subject[]
  affectiveSkills: AffectiveSkill[]
  psychomotorSkills: PsychomotorSkill[]
  totalScore: number
  maxScore: number
  average: number
  overallGrade: string
  classTeacherRemarks: string
  headTeacherRemarks: string
  nextTermBegins: string
}



export const LOCAL_STORAGE_KEY = "primarySchoolTemplateConfig";

export interface SavedTemplateConfig {
    data: PrimaryResultData;
    visibility: VisibilityState;
    columnVisibility: Record<AcademicColumnKey, boolean>;
    schoolDetails: { id: number, type: string, value: string }[];
    gradingSystem: GradeRow[];
    lastEditDate: string; 
}

export type VisibilityState = {
  logo: boolean,
  studentPhoto: boolean,
  schoolInfo: boolean,
  studentInfo: boolean,
  attendanceInfo: boolean,
  academicTable: boolean,
  affectiveSkills: boolean,
  psychomotorSkills: boolean,
  gradingSystem: boolean,
  summary: boolean,
  remarks: boolean,
  footer: boolean,
  gender: boolean,
  admissionNumber: boolean,
  age: boolean,
  term: boolean,
  session: boolean,
  resumption: boolean,
  class: boolean,
  studentsInClass: boolean,
  classTeacher: boolean,
  totalDaysInTerm: boolean,
  totalDaysPresent: boolean,
  totalDaysAbsent: boolean,
  summaryTotalScore: boolean,
  summaryAverage: boolean,
  summaryGrade: boolean,
  summarySignature: boolean,
  remarksClassTeacher: boolean,
  remarksSchoolHead: boolean,
  footerInfo: boolean,
  footerNextTermBegins: boolean,
}

export const sampleData: PrimaryResultData = {
  studentName: "IFUNANYA KELEMADE",
  gender: "Female",
  admissionNumber: "STU/2020/1004",
  age: "8",
  term: "1st Term",
  session: "2021/2022",
  class: "Primary 1",
  studentsInClass: 7,
  classTeacher: "Mrs. Johnson",
  totalDaysInTerm: 102,
  totalDaysPresent: 85,
  totalDaysAbsent: 17,
  resumption: "10th Jan 2022",
  subjects: [
    {
      name: "Mathematics",
      firstCA: 19,
      secondCA: 20,
      exam: 60,
      total: 99,
      grade: "A",
      position: "1st",
      teacher: "Mr. John",
      thirdCA: 99,
      average: 78,
    },
    {
      name: "English Language",
      firstCA: 12,
      secondCA: 18,
      exam: 56,
      total: 86,
      grade: "A",
      position: "1st",
      teacher: "Mrs. Jane",
      thirdCA: 86,
      average: 68,
    },
    {
      name: "Computer Science",
      firstCA: 15,
      secondCA: 14,
      exam: 53,
      total: 82,
      grade: "A",
      position: "1st",
      teacher: "Mr. Tech",
      thirdCA: 82,
      average: 65,
    },
    {
      name: "Quantitative Analysis",
      firstCA: 15,
      secondCA: 18,
      exam: 36,
      total: 69,
      grade: "B",
      position: "4th",
      teacher: "Mrs. Math",
      thirdCA: 88,
      average: 70,
    },
    {
      name: "Religion",
      firstCA: 20,
      secondCA: 12,
      exam: 36,
      total: 68,
      grade: "B",
      position: "4th",
      teacher: "Rev. Paul",
      thirdCA: 95,
      average: 72,
    },
    {
      name: "Integrated Science",
      firstCA: 20,
      secondCA: 9,
      exam: 49,
      total: 78,
      grade: "B",
      position: "3rd",
      teacher: "Dr. Science",
      thirdCA: 67,
      average: 72,
    },
    {
      name: "Agricultural Science",
      firstCA: 3,
      secondCA: 11,
      exam: 32,
      total: 46,
      grade: "D",
      position: "5th",
      teacher: "Mr. Farm",
      thirdCA: 97,
      average: 61,
    },
    {
      name: "French Language",
      firstCA: 12,
      secondCA: 19,
      exam: 43,
      total: 74,
      grade: "B",
      position: "3rd",
      teacher: "Mme. French",
      thirdCA: 83,
      average: 69,
    },
    {
      name: "Introductory Technology",
      firstCA: 18,
      secondCA: 15,
      exam: 45,
      total: 78,
      grade: "B",
      position: "1st",
      teacher: "Mr. Tech",
      thirdCA: 78,
      average: 68,
    },
    {
      name: "Yoruba/Ibo/Hausa",
      firstCA: 12,
      secondCA: 15,
      exam: 45,
      total: 72,
      grade: "B",
      position: "4th",
      teacher: "Mr. Local",
      thirdCA: 100,
      average: 76,
    },
  ],
  affectiveSkills: [
    { skill: "PUNCTUALITY", rating: 4 },
    { skill: "POLITENESS", rating: 2 },
    { skill: "NEATNESS", rating: 2 },
    { skill: "HONESTY", rating: 5 },
    { skill: "LEADERSHIP SKILL", rating: 3 },
    { skill: "COOPERATION", rating: 4 },
    { skill: "ATTENTIVENESS", rating: 4 },
    { skill: "PERSEVERANCE", rating: 4 },
    { skill: "ATTITUDE TO WORK", rating: 3 },
  ],
  psychomotorSkills: [
    { skill: "HANDWRITING", rating: 2 },
    { skill: "VERBAL FLUENCY", rating: 5 },
    { skill: "SPORTS", rating: 3 },
    { skill: "HANDLING TOOLS", rating: 5 },
    { skill: "DRAWING & PAINTING", rating: 3 },
  ],
  totalScore: 752,
  maxScore: 1000,
  average: 75.2,
  overallGrade: "B",
  classTeacherRemarks: "A very promising child",
  headTeacherRemarks: "Brilliant performance",
  nextTermBegins: "January 10th",
}
export interface GradeRow {
  grade: string;
  range: string;
}

export type AcademicColumnKey = keyof Subject | 'name' | 'firstCA' | 'secondCA' | 'exam' | 'total' | 'grade' | 'position' | 'teacher' | 'thirdCA' | 'average'

export function PrimaryResultTemplate() {
  const [data, setData] = useState<PrimaryResultData>(sampleData)
  const [showSettings, setShowSettings] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  // 1. NEW STATE for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<AcademicColumnKey, boolean>>({
    name: true,
    firstCA: true,
    secondCA: true,
    exam: true,
    total: true,
    grade: true,
    position: true,
    teacher: true,
    thirdCA: true,
    average: true,
  })

  const [schoolDetails, setSchoolDetails] = useState([
    { id: 1, type: 'name', value: 'STEP TO SUCCESS DEMO SCHOOL' },
    { id: 2, type: 'motto', value: 'Motto: Excellence Personified' },
    { id: 3, type: 'address', value: '5 Blessing Okoh Way, Benin City' },
    { id: 4, type: 'contact', value: 'TEL: 08012345678, EMAIL: hello@mysch.ng' },
  ]);



  const toggleColumnVisibility = (column: AcademicColumnKey) => {

    setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }))
  }

  // Array of column keys for iteration
  const academicColumns: { key: AcademicColumnKey, label: string, isInput?: boolean }[] = [
    { key: 'name', label: 'SUBJECTS', isInput: true },
    { key: 'firstCA', label: '1st CA (20)', isInput: true },
    { key: 'secondCA', label: '2nd CA (20)', isInput: true },
    { key: 'exam', label: 'EXAM (60)', isInput: true },
    { key: 'total', label: 'TOTAL (100)' },
    { key: 'grade', label: 'GRADE', isInput: true },
    { key: 'position', label: 'SUBJECT POSITION', isInput: true },
    { key: 'teacher', label: 'SUBJECT TEACHER', isInput: true },
    { key: 'thirdCA', label: '3rd CA' },
    { key: 'average', label: 'AVERAGE' },
  ]


  const [visibility, setVisibility] = useState({
    logo: true,
    studentPhoto: true,
    schoolInfo: true,
    studentInfo: true,
    attendanceInfo: true,
    academicTable: true,
    affectiveSkills: true,
    psychomotorSkills: true,
    gradingSystem: true,
    summary: true,
    remarks: true,
    footer: true,
    gender: true,
    admissionNumber: true,
    age: true,
    term: true,
    session: true,
    resumption: true,
    class: true,
    studentsInClass: true,
    classTeacher: true,
    totalDaysInTerm: true,
    totalDaysPresent: true,
    totalDaysAbsent: true,
    summaryTotalScore: true,
    summaryAverage: true,
    summaryGrade: true,
    summarySignature: true,
    remarksClassTeacher: true,
    remarksSchoolHead: true,
    footerInfo: true,
    footerNextTermBegins: true,
  })
  const initialGradingSystem: GradeRow[] = [
    { grade: "A", range: "80-100" },
    { grade: "B", range: "70-79" },
    { grade: "C", range: "60-69" },
    { grade: "D", range: "50-59" },
    { grade: "E", range: "40-49" },
    { grade: "F", range: "0-39" },
  ];
  const [gradingSystem, setGradingSystem] = useState<GradeRow[]>(initialGradingSystem);
  const deleteGrade = (gradeToDelete: string) => {
    setGradingSystem(prevGrades => prevGrades.filter(grade => grade.grade !== gradeToDelete));
  };

  const deleteDetailLine = (id: any) => {
    setSchoolDetails(prevDetails => prevDetails.filter(detail => detail.id !== id));
  };

  const toggleVisibility = (section: keyof typeof visibility) => {
    setVisibility((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const updateData = (field: keyof PrimaryResultData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const updateSubject = (index: number, field: keyof Subject, value: any) => {
    const newSubjects = [...data.subjects]
    newSubjects[index] = { ...newSubjects[index], [field]: value }
    setData((prev) => ({ ...prev, subjects: newSubjects }))
  }

  const updateAffectiveSkill = (index: number, field: keyof AffectiveSkill, value: any) => {
    const newSkills = [...data.affectiveSkills]
    newSkills[index] = { ...newSkills[index], [field]: value }
    setData((prev) => ({ ...prev, affectiveSkills: newSkills }))
  }

  const updatePsychomotorSkill = (index: number, field: keyof PsychomotorSkill, value: any) => {
    const newSkills = [...data.psychomotorSkills]
    newSkills[index] = { ...newSkills[index], [field]: value }
    setData((prev) => ({ ...prev, psychomotorSkills: newSkills }))
  }

  const deleteAffectiveSkill = (index: number) => {
    const newSkills = data.affectiveSkills.filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, affectiveSkills: newSkills }));
  };

  const deletePsychomotorSkill = (index: number) => {
    const newSkills = data.psychomotorSkills.filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, psychomotorSkills: newSkills }));
  };

  const saveTemplateConfig = () => {
    const lastEditDate = new Date().toLocaleString();
    const configToSave = {
      data,
      visibility,
      columnVisibility,
      schoolDetails,
      gradingSystem,
      lastEditDate,
    };
    try {
      localStorage.setItem("primarySchoolTemplateConfig", JSON.stringify(configToSave));
       navigate("/dashboard/edit/primary");
    } catch (error) {
      console.error("Error saving to local storage:", error);
      alert("Could not save template config.");
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      saveTemplateConfig();
    }
    setIsEditing(!isEditing);
  }



  const renderSubjectCell = (subject: Subject, key: AcademicColumnKey, index: number, isInput?: boolean) => {
    const isNumeric = key === 'firstCA' || key === 'secondCA' || key === 'exam' || key === 'thirdCA' || key === 'total' || key === 'average';
    const isEditable = isEditing && isInput;
    const numericProps = isNumeric ? { type: "number", min: 0, max: 100 } : {};

    if (isEditable) {
      return (
        <Input
          {...numericProps}
          value={subject[key as keyof Subject] as any}
          onChange={(e) => updateSubject(index, key as keyof Subject, isNumeric ? Number.parseInt(e.target.value) : e.target.value)}
          className={`h-6 text-xs text-center ${key !== 'name' ? 'w-12' : ''}`}
        />
      );
    }
    return subject[key as keyof Subject];
  };


  return (
    <div className="relative">
      <div className="fixed top-28 right-4 z-50 flex gap-2">
        <Button onClick={handleEditToggle} variant={isEditing ? "default" : "outline"} size="sm">
          <Edit2 className="w-4 h-4 mr-2" />
          {isEditing ? "Done Editing" : "Edit Mode"}
        </Button>
        <Button onClick={() => setShowSettings(!showSettings)} variant={showSettings ? "default" : "outline"} size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {showSettings && (
        <div className="fixed top-30 right-4 z-50 bg-white border rounded-lg shadow-lg p-4 w-80 max-h-[80vh] overflow-y-auto">
          <h3 className="font-bold text-lg mb-4">Section Visibility</h3>
          <div className="space-y-3">
            {Object.entries(visibility).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="capitalize cursor-pointer">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={() => toggleVisibility(key as keyof typeof visibility)}
                />
              </div>
            ))}
          </div>

          {/* NEW: Column Visibility Settings */}
          <h3 className="font-bold text-lg mt-6 mb-4">Column Visibility</h3>
          <div className="space-y-3">
            {academicColumns.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={`col-${key}`} className="capitalize cursor-pointer">
                  {label.split('(')[0].trim()}
                </Label>
                <Switch
                  id={`col-${key}`}
                  checked={columnVisibility[key]}
                  onCheckedChange={() => toggleColumnVisibility(key)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-[1200px] mx-auto bg-white shadow-lg mt-20">
        <div className="border-2 border-gray-800 p-2 sm:p-4">
          <EditTemplate
            visibility={visibility}
            isEditing={isEditing}
            schoolDetails={schoolDetails}
            toggleVisibility={toggleVisibility}
            deleteDetailLine={deleteDetailLine}
            data={data}
            updateData={updateData}
            academicColumns={academicColumns}
            columnVisibility={columnVisibility}
            toggleColumnVisibility={toggleColumnVisibility}
            renderSubjectCell={renderSubjectCell}
            updateAffectiveSkill={updateAffectiveSkill}
            deletePsychomotorSkill={deletePsychomotorSkill}
            updatePsychomotorSkill={updatePsychomotorSkill}
            deleteAffectiveSkill={deleteAffectiveSkill}
            gradingSystem={gradingSystem}
            deleteGrade={deleteGrade}
          />
          {visibility.summary && (
            <div className="mt-4 border border-gray-400 relative group">
              {/* Button to delete the ENTIRE Summary section */}
              {isEditing && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                  onClick={() => toggleVisibility("summary")}
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </Button>
              )}
              <div className="bg-gray-100 p-2 font-bold text-center">SUMMARY</div>
              <div className="p-2 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm gap-2">

                {/* TOTAL SCORE */}
                {visibility.summaryTotalScore && (
                  <div className="relative group/field pr-5">
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                        onClick={() => toggleVisibility("summaryTotalScore")}
                      >
                        <Trash2 className="w-2.5 h-2.5 text-white" />
                      </Button>
                    )}
                    TOTAL SCORE: {data.totalScore}/{data.maxScore}
                  </div>
                )}

                {/* AVG. SCORE */}
                {visibility.summaryAverage && (
                  <div className="relative group/field pr-5">
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                        onClick={() => toggleVisibility("summaryAverage")}
                      >
                        <Trash2 className="w-2.5 h-2.5 text-white" />
                      </Button>
                    )}
                    AVG. SCORE: {data.average}%
                  </div>
                )}

                {/* GRADE */}
                {visibility.summaryGrade && (
                  <div className="relative group/field pr-5">
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                        onClick={() => toggleVisibility("summaryGrade")}
                      >
                        <Trash2 className="w-2.5 h-2.5 text-white" />
                      </Button>
                    )}
                    GRADE: {data.overallGrade}
                  </div>
                )}

                {/* SIGNATURE / STAMP */}
                {visibility.summarySignature && (
                  <div className="border border-gray-400 w-20 h-8 flex items-center justify-center text-xs relative group/field">
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                        onClick={() => toggleVisibility("summarySignature")}
                      >
                        <Trash2 className="w-2.5 h-2.5 text-white" />
                      </Button>
                    )}
                    SIGNATURE / STAMP
                  </div>
                )}
              </div>
            </div>
          )}

          {visibility.remarks && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm relative group">
              {/* Button to delete the ENTIRE Remarks section */}
              {isEditing && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                  onClick={() => toggleVisibility("remarks")}
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </Button>
              )}

              {/* CLASS TEACHER REMARKS */}
              {visibility.remarksClassTeacher && (
                <div className="relative group/field">
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                      onClick={() => toggleVisibility("remarksClassTeacher")}
                    >
                      <Trash2 className="w-2.5 h-2.5 text-white" />
                    </Button>
                  )}
                  <div className="font-bold">CLASS TEACHER REMARKS:</div>
                  {isEditing ? (
                    <TextArea
                      value={data.classTeacherRemarks}
                      onChange={(e) => updateData("classTeacherRemarks", e.target.value)}
                      className="min-h-[60px]"
                    />
                  ) : (
                    <div className="border-b border-gray-400 pb-1">{data.classTeacherRemarks}</div>
                  )}
                </div>
              )}

              {/* SCHOOL HEAD REMARKS */}
              {visibility.remarksSchoolHead && (
                <div className="relative group/field">
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center
                       rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                      onClick={() => toggleVisibility("remarksSchoolHead")}
                    >
                      <Trash2 className="w-2.5 h-2.5 text-white" />
                    </Button>
                  )}
                  <div className="font-bold">SCHOOL HEAD REMARKS:</div>
                  {isEditing ? (
                    <TextArea
                      value={data.headTeacherRemarks}
                      onChange={(e) => updateData("headTeacherRemarks", e.target.value)}
                      className="min-h-[60px]"
                    />
                  ) : (
                    <div className="border-b border-gray-400 pb-1">{data.headTeacherRemarks}</div>
                  )}
                </div>
              )}
            </div>
          )}
          {visibility.footer && (
            <div className="mt-4 text-xs text-center relative group">
              {/* Button to delete the ENTIRE Footer section */}
              {isEditing && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                  onClick={() => toggleVisibility("footer")}
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </Button>
              )}

              {/* INFO TO PARENTS: Static Text */}
              {visibility.footerInfo && (
                <div className="font-bold relative group/field">
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-0 -right-4 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                      onClick={() => toggleVisibility("footerInfo")}
                    >
                      <Trash2 className="w-2.5 h-2.5 text-white" />
                    </Button>
                  )}
                  INFO TO PARENTS:
                </div>
              )}

              {isEditing ? (
                <TextArea
                  defaultValue="We thank God for an awesome term. Please be aware that next term PTA meeting will be on"
                  className="min-h-[40px] text-xs"
                />
              ) : (
                <>
                  {visibility.footerInfo && <div>We thank God for an awesome term. Please be aware that next term PTA meeting will be on</div>}

                  {/* Next Term Begins Date */}
                  {visibility.footerNextTermBegins && (
                    <div className="relative group/field inline-block">
                      {isEditing && (
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute -top-1 -right-5 h-4 w-4 flex items-center justify-center
                           rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                          onClick={() => toggleVisibility("footerNextTermBegins")}
                        >
                          <Trash2 className="w-2.5 h-2.5 text-white" />
                        </Button>
                      )}
                      {data.nextTermBegins}
                      . Kindly pay fees on time too
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>


      </div>
    </div>
  )
}