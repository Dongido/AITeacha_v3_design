import { useState } from "react"
import { Eye, EyeOff, Edit2, Settings, X, Trash2 } from "lucide-react"
import { Button } from "../../../../components/ui/Button"
import { useLocation, useNavigate } from "react-router-dom";


const subjectColumns = [
  { key: "name", label: "Subject", isFixed: true },
  { key: "ca1", label: "1st CA" },
  { key: "ca2", label: "2nd CA" },
  { key: "exam", label: "Exam" },
  { key: "total", label: "Total" },
  { key: "grade", label: "Grade" },
  { key: "remarks", label: "Remarks" },
]

interface Subject {
  name: string
  ca1: number
  ca2: number
  exam: number
  total: number
  grade: string
  remarks: string
}


 export type VisibilityState = {
  schoolHeader: boolean;
  pupilInfo: boolean;
  subjectsTable: boolean;
  termDates: boolean;
  pupilName: boolean;
  pupilAge: boolean;
  pupilClass: boolean;
  pupilNumberInClass: boolean;
  pupilAdmissionNo: boolean;
  summaryMarksObtainable: boolean;
  summaryMarksObtained: boolean;
  summaryAverage: boolean;
  summaryPercentage: boolean;
  schoolName: boolean;
  schoolAddress: boolean;
  schoolReportInfo: boolean;
  teacherRemark: boolean;
  houseMasterRemark: boolean;
  nextTermBegins: boolean;
  thisTermEnds: boolean;
};

 
 export interface SecondaryResultData {
  school: {
    name: string
    address: string
    term: string
    session: string
  }
  pupil: {
    name: string
    age: number
    class: string
    numberInClass: number
    admissionNo: string
  }
  summary: {
    marksObtainable: number
    marksObtained: number
    average: number
    percentage: string
  }
  subjects: Subject[]
  remarks: {
    teacher: string
    houseMaster: string
  }
  termDates: {
    nextTermBegins: string
    thisTermEnds: string
  }
}

interface EditableSecondaryResultProps {
  data: SecondaryResultData
  initialVisibility?: VisibilityState; 
  initialColumnVisibility?: Record<string, boolean>;
  disableEditing?: boolean; 
}

export function SeniorResultTemplate({  data, 
    initialVisibility, 
    initialColumnVisibility, 
    disableEditing = false  }: EditableSecondaryResultProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [editableData, setEditableData] = useState(data)
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)
  const [highlightedColumn, setHighlightedColumn] = useState<string | null>(null)
  const location = useLocation();
  const navigate = useNavigate();


 const [visibility, setVisibility] = useState<VisibilityState>(
    initialVisibility || {
      schoolHeader: true,
      pupilInfo: true,
      subjectsTable: true,
      termDates: true,
      pupilName: true,
      pupilAge: true,
      pupilClass: true,
      pupilNumberInClass: true,
      pupilAdmissionNo: true,
      summaryMarksObtainable: true,
      summaryMarksObtained: true,
      summaryAverage: true,
      summaryPercentage: true,
      schoolName: true,
      schoolAddress: true,
      schoolReportInfo: true,
      teacherRemark: true,
      houseMasterRemark: true,
      nextTermBegins: true,
      thisTermEnds: true,
    }
  );

   const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    initialColumnVisibility || 
    subjectColumns.reduce(
      (acc, col) => ({ ...acc, [col.key]: true }),
      {}
    )
  );

  const toggleVisibility = (section: keyof typeof visibility) => {
    setVisibility((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleColumnVisibility = (key: string) => {
    setColumnVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const removeSubject = (subjectName: string) => {
    setEditableData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((subj) => subj.name !== subjectName),
    }))
  }

  const updateField = (path: string[], value: any) => {
    setEditableData((prev) => {
      const newData = { ...prev }
      let current: any = newData
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return newData
    })
  }

  const visibleColumns = subjectColumns.filter(col => columnVisibility[col.key])

  const showRemoveColumn = isEditMode && visibility.subjectsTable

  const removeRemark = (key: 'teacher' | 'houseMaster') => {
    updateField(["remarks", key], "")
    const visibilityKey = key === 'teacher' ? 'teacherRemark' : 'houseMasterRemark'
    toggleVisibility(visibilityKey as keyof typeof visibility)
  }

  const removeTermDate = (key: 'nextTermBegins' | 'thisTermEnds') => {
    updateField(["termDates", key], "")

    const visibilityKey = key
    toggleVisibility(visibilityKey as keyof typeof visibility)
  }



  const saveTemplate = () => {
    const templateConfig = {
      data: editableData,
      visibility: visibility,
      columnVisibility: columnVisibility,
    }
    try {
      localStorage.setItem('savedTemplateConfig', JSON.stringify(templateConfig))
       navigate("/dashboard/edit/result");
    } catch (e) {
      console.error('Error saving template to local storage', e)
      alert('Error saving template.')
    }
  }


  


  return (
    <div className="relative">
      {location.pathname === "/dashboard/secondary" && <>
       <div className="fixed top-24 right-4 z-50 flex gap-2">
        <Button
          onClick={() => {
            if (isEditMode) {
              saveTemplate() 
            }
            setIsEditMode(!isEditMode)
          }}
          variant={isEditMode ? "default" : "outline"}
          size="sm"
          className="shadow-lg"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          {isEditMode ? "Done Editing" : "Edit Mode"}
        </Button>
        <Button onClick={() => setShowSettings(!showSettings)} variant="outline" size="sm" className="shadow-lg">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {showSettings && (
        <div className="fixed top-20 right-4 z-50 bg-white border rounded-lg shadow-xl p-4 w-64 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="font-semibold">Section Visibility</h3>
            <Button onClick={() => setShowSettings(false)} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2 mb-4">
            {Object.entries(visibility).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                <Button onClick={() => toggleVisibility(key as keyof typeof visibility)} variant="ghost" size="sm">
                  {value ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                </Button>
              </div>
            ))}
          </div>

          {visibility.subjectsTable && (
            <>
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="font-semibold">Table Columns</h3>
              </div>
              <div className="space-y-2">
                {subjectColumns.map((col) => (
                  <div key={col.key} className="flex items-center justify-between">
                    <span className="text-sm">{col.label}</span>
                    <Button
                      onClick={() => !col.isFixed && toggleColumnVisibility(col.key)}
                      variant="ghost"
                      size="sm"
                      disabled={!!col.isFixed}
                      title={col.isFixed ? "Required column" : `Toggle ${col.label}`}
                    >
                      {columnVisibility[col.key] ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      </>}
     
      <div className="p-4 md:p-6 mt-20 bg-white border border-gray-300 max-w-5xl mx-auto shadow-lg text-sm">
        {visibility.schoolName && (
          <h1 className="text-xl md:text-2xl font-bold mb-1 relative group">
            {isEditMode ? (
              <input
                type="text"
                value={editableData.school.name}
                onChange={(e) => updateField(["school", "name"], e.target.value)}
                className="w-full text-center border-b-2 border-purple-300 bg-transparent"
              />
            ) : (
              editableData.school.name
            )}
            {isEditMode && (
              <Button
                onClick={() => toggleVisibility("schoolName")}
                variant="destructive"
                size="icon"
                className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hide School Name"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </h1>
        )}

        {/* School Address */}
        {visibility.schoolAddress && (
          <p className="text-center text-gray-600 text-xs md:text-sm relative group">
            {isEditMode ? (
              <input
                type="text"
                value={editableData.school.address}
                onChange={(e) => updateField(["school", "address"], e.target.value)}
                className="w-full text-center border-b border-gray-300 bg-transparent"
              />
            ) : (
              editableData.school.address
            )}
            {isEditMode && (
              <Button
                onClick={() => toggleVisibility("schoolAddress")}
                variant="destructive"
                size="icon"
                className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hide School Address"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </p>
        )}

        {/* Report Type (Term, Session) */}
        {visibility.schoolReportInfo && (
          <p className="text-center text-purple-600 font-semibold text-xs md:text-sm relative group">
            {isEditMode ? (
              <span className="flex justify-center gap-2">
                Continuous Assessment Report (
                <input
                  type="text"
                  value={editableData.school.term}
                  onChange={(e) => updateField(["school", "term"], e.target.value)}
                  className="w-24 border-b border-purple-300 bg-transparent"
                />
                ,
                <input
                  type="text"
                  value={editableData.school.session}
                  onChange={(e) => updateField(["school", "session"], e.target.value)}
                  className="w-24 border-b border-purple-300 bg-transparent"
                />
                )
              </span>
            ) : (
              `Continuous Assessment Report (${editableData.school.term}, ${editableData.school.session})`
            )}
            {isEditMode && (
              <Button
                onClick={() => toggleVisibility("schoolReportInfo")}
                variant="destructive"
                size="icon"
                className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hide Report Info"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </p>
        )}

        {visibility.pupilInfo && (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border border-gray-400 p-4 relative">
            <div className="space-y-1">
              {visibility.pupilName && (
                <p className="text-xs md:text-sm relative group"> {/* Keep 'group' here */}
                  <span className="font-bold">Name of Pupil:</span>{" "}
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editableData.pupil.name}
                      onChange={(e) => updateField(["pupil", "name"], e.target.value)}
                      className="border-b border-gray-300 bg-transparent"
                    />
                  ) : (
                    editableData.pupil.name
                  )}
                  {isEditMode && (
                    <Button
                      onClick={() => toggleVisibility("pupilName")}
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hide Name"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </p>
              )}

              {visibility.pupilAge && (
                <p className="text-xs md:text-sm relative group"> {/* Keep 'group' here */}
                  <span className="font-bold">Age:</span>{" "}
                  {isEditMode ? (
                    <input
                      type="number"
                      value={editableData.pupil.age}
                      onChange={(e) => updateField(["pupil", "age"], Number.parseInt(e.target.value))}
                      className="w-16 border-b border-gray-300 bg-transparent"
                    />
                  ) : (
                    editableData.pupil.age
                  )}
                  {isEditMode && (
                    <Button
                      onClick={() => toggleVisibility("pupilAge")}
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hide Age"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </p>
              )}

              {visibility.pupilClass && (
                <p className="text-xs md:text-sm relative group">
                  <span className="font-bold">Class:</span>{" "}
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editableData.pupil.class}
                      onChange={(e) => updateField(["pupil", "class"], e.target.value)}
                      className="w-24 border-b border-gray-300 bg-transparent"
                    />
                  ) : (
                    editableData.pupil.class
                  )}
                  {isEditMode && (
                    <Button
                      onClick={() => toggleVisibility("pupilClass")}
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hide Class"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </p>
              )}

              {visibility.pupilNumberInClass && (
                <p className="text-xs md:text-sm relative group">
                  <span className="font-bold">Number in Class:</span>{" "}
                  {isEditMode ? (
                    <input
                      type="number"
                      value={editableData.pupil.numberInClass}
                      onChange={(e) => updateField(["pupil", "numberInClass"], Number.parseInt(e.target.value))}
                      className="w-16 border-b border-gray-300 bg-transparent"
                    />
                  ) : (
                    editableData.pupil.numberInClass
                  )}
                  {isEditMode && (
                    <Button
                      onClick={() => toggleVisibility("pupilNumberInClass")}
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hide Number in Class"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </p>
              )}

              {visibility.pupilAdmissionNo && (
                <p className="text-xs md:text-sm relative group"> {/* Keep 'group' here */}
                  <span className="font-bold">Admission No:</span>{" "}
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editableData.pupil.admissionNo}
                      onChange={(e) => updateField(["pupil", "admissionNo"], e.target.value)}
                      className="border-b border-gray-300 bg-transparent"
                    />
                  ) : (
                    editableData.pupil.admissionNo
                  )}
                  {isEditMode && (
                    <Button
                      onClick={() => toggleVisibility("pupilAdmissionNo")}
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hide Admission No"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start md:items-end space-y-1">
              {visibility.summaryMarksObtainable && (
                <p className="text-xs md:text-sm relative group">
                  <span className="font-bold">Total Marks Obtainable:</span> {editableData.summary.marksObtainable}
                  {isEditMode && (
                    <Button
                      onClick={() => toggleVisibility("summaryMarksObtainable")}
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hide Marks Obtainable"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </p>
              )}

              {visibility.summaryMarksObtained && (
                <p className="text-xs md:text-sm relative group">
                  <span className="font-bold">Total Marks Obtained:</span> {editableData.summary.marksObtained}
                  {isEditMode && (
                    <Button
                      onClick={() => toggleVisibility("summaryMarksObtained")}
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hide Marks Obtained"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </p>
              )}

              {visibility.summaryAverage && (
                <p className="text-xs md:text-sm relative group">
                  <span className="font-bold">Average:</span> {editableData.summary.average}
                  {isEditMode && (
                    <Button
                      onClick={() => toggleVisibility("summaryAverage")}
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hide Average"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </p>
              )}

              {visibility.summaryPercentage && (
                <p className="text-xs md:text-sm relative group">
                  <span className="font-bold">Percentage:</span> {editableData.summary.percentage}
                  {isEditMode && (
                    <Button
                      onClick={() => toggleVisibility("summaryPercentage")}
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hide Percentage"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </p>
              )}
            </div>

            {isEditMode && (
              <Button
                onClick={() => toggleVisibility("pupilInfo")}
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 opacity-0 transition-opacity"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}

        {visibility.subjectsTable && (
          <div className="overflow-x-auto mb-6 relative group">
            <table className="w-full border border-gray-400 text-xs md:text-sm">
              <thead className="bg-purple-100">
                <tr>
                  {subjectColumns.map((col) =>
                    columnVisibility[col.key] && (
                      <th
                        key={col.key}
                        onMouseEnter={() => setHoveredColumn(col.key)}
                        onMouseLeave={() => setHoveredColumn(null)}
                        className={`border p-2 relative group/th transition-colors duration-200
                        ${hoveredColumn === col.key ? 'bg-purple-200 text-purple-800' : ''}
                        ${highlightedColumn === col.key ? 'bg-purple-300 text-white' : ''}
                        ${isEditMode && !col.isFixed ? 'cursor-pointer' : ''}
                      `}
                      >
                        {col.label}

                        {isEditMode && !col.isFixed && (
                          <Button
                            onClick={() => toggleColumnVisibility(col.key)}
                            variant="destructive"
                            size="icon"
                            className="absolute  w-5 h-5 p-0 opacity-0 group-hover/th:opacity-100 transition-opacity"
                            title={`Remove '${col.label}' column`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {editableData.subjects.map((subj, i) => (
                  <tr key={i}
                    className="group/tr">
                    {subjectColumns.map((col) => {
                      if (!columnVisibility[col.key]) return null;
                      let cellClass = "border p-2";
                      if (col.key === 'total' || col.key === 'grade') {
                        cellClass += " text-center font-bold";
                      } else if (col.key !== 'name' && col.key !== 'remarks') {
                        cellClass += " text-center";
                      }
                      return (
                        <td key={col.key}
                          className={`${cellClass} transition-colors duration-200 ${hoveredColumn === col.key && isEditMode ? 'bg-red-100' : ''
                            }`}
                        >
                          {(subj as any)[col.key]}
                        </td>
                      );
                    })}

                    {/* {showRemoveColumn && (
                      <td className="border p-1 text-center w-10">
                        <Button
                          onClick={() => removeSubject(subj.name)}
                          variant="ghost"
                          size="icon"
                          className="w-full h-auto p-1 text-red-600 hover:bg-red-50 opacity-0 group-hover/tr:opacity-100 transition-opacity"
                          title={`Remove subject: ${subj.name}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    )} */}
                  </tr>
                ))}
              </tbody>
            </table>

            {isEditMode && (
              <Button
                onClick={() => toggleVisibility("subjectsTable")}
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hide Subjects Table"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}

        {visibility.teacherRemark || visibility.houseMasterRemark ? (
          <div className="border border-gray-400 p-4 mb-4 relative group">
            {visibility.teacherRemark && (
              <p className="text-xs md:text-sm mb-2 relative group/remark">
                <span className="font-bold">Teacher:</span>{" "}
                {isEditMode ? (
                  <input
                    type="text"
                    value={editableData.remarks.teacher}
                    onChange={(e) => updateField(["remarks", "teacher"], e.target.value)}
                    className="w-full border-b border-gray-300 bg-transparent"
                  />
                ) : (
                  editableData.remarks.teacher
                )}
                {isEditMode && (
                  <Button
                    onClick={() => removeRemark("teacher")}
                    variant="destructive"
                    size="icon"
                    className="absolute right-0 h-4 w-4 p-0 opacity-0 group-hover/remark:opacity-100 transition-opacity"
                    title="Remove Teacher Comment"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </p>
            )}

            {/* House Master Remark */}
            {visibility.houseMasterRemark && (
              <p className="text-xs md:text-sm relative group/remark">
                <span className="font-bold">House Master:</span>{" "}
                {isEditMode ? (
                  <input
                    type="text"
                    value={editableData.remarks.houseMaster}
                    onChange={(e) => updateField(["remarks", "houseMaster"], e.target.value)}
                    className="w-full border-b border-gray-300 bg-transparent"
                  />
                ) : (
                  editableData.remarks.houseMaster
                )}
                {isEditMode && (
                  <Button
                    onClick={() => removeRemark("houseMaster")}
                    variant="destructive"
                    size="icon"
                    className="absolute right-0 h-4 w-4 p-0 opacity-0 group-hover/remark:opacity-100 transition-opacity"
                    title="Remove House Master Comment"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </p>
            )}


            {isEditMode && (
              <Button
                onClick={() => {
                  toggleVisibility("teacherRemark");
                  toggleVisibility("houseMasterRemark");
                }}
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hide Remarks Section"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ) : null}

        {visibility.nextTermBegins || visibility.thisTermEnds ? (
          <div className="border border-gray-400 p-4 relative group">

            {/* Next Term Begins */}
            {visibility.nextTermBegins && (
              <p className="text-xs md:text-sm mb-2 relative group/date">
                <span className="font-bold">Next Term Begins:</span>{" "}
                {isEditMode ? (
                  <input
                    type="text"
                    value={editableData.termDates.nextTermBegins}
                    onChange={(e) => updateField(["termDates", "nextTermBegins"], e.target.value)}
                    className="border-b border-gray-300 bg-transparent"
                  />
                ) : (
                  editableData.termDates.nextTermBegins
                )}
                {isEditMode && (
                  <Button
                    onClick={() => removeTermDate("nextTermBegins")}
                    variant="destructive"
                    size="icon"
                    className="absolute right-0 h-4 w-4 p-0 opacity-0 group-hover/date:opacity-100 transition-opacity"
                    title="Remove 'Next Term Begins' Date"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </p>
            )}

            {/* This Term Ends */}
            {visibility.thisTermEnds && (
              <p className="text-xs md:text-sm relative group/date">
                <span className="font-bold">This Term Ends:</span>{" "}
                {isEditMode ? (
                  <input
                    type="text"
                    value={editableData.termDates.thisTermEnds}
                    onChange={(e) => updateField(["termDates", "thisTermEnds"], e.target.value)}
                    className="border-b border-gray-300 bg-transparent"
                  />
                ) : (
                  editableData.termDates.thisTermEnds
                )}
                {isEditMode && (
                  <Button
                    onClick={() => removeTermDate("thisTermEnds")}
                    variant="destructive"
                    size="icon"
                    className="absolute right-0 h-4 w-4 p-0 opacity-0 group-hover/date:opacity-100 transition-opacity"
                    title="Remove 'This Term Ends' Date"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </p>
            )}

            {/* Overall section hide button (removes the entire border box) */}
            {isEditMode && (
              <Button
                onClick={() => {
                  toggleVisibility("nextTermBegins");
                  toggleVisibility("thisTermEnds");
                }}
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hide Term Dates Section"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}