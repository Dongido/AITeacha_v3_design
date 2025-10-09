import React, { useState } from "react";
import { Button } from "../../../../components/ui/Button";
import { Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type Subject = {
  name: string;
  ca1: number | null;
  ca2: number | null;
  ca3: number | null;
  ca4: number | null;
  exam: number | null;
  total: number;
  grade: string;
  position: string;
  remark: string;
};

type ResultAnalysis = {
  compulsorySubjects: string;
  minimumSubjectToOffer: string;
  minimumSubjectToPass: string;
  promotionScore: string;
};

type Domain = {
  neatness?: string;
  honesty?: string;
  puntuality?: string;
  sports?: string;
  handwriting?: string;
  musicalSkills?: string;
};

export type StudentData = {
  studentName: string;
  admissionNo: string;
  class: string;
  numberInClass: string;
  term: string;
  session: string;
  status: string;
  totalMarksObtained: number;
  totalMarksObtainable: number;
  average: number;
  position: string;
  subjects: Subject[];
  classTeacherRemarks: string;
  vacationDate: string;
  resumptionDate: string;
  resultAnalysis: ResultAnalysis;
  affectiveDomain: Domain;
  psychomotorDomain: Domain;
};
type DomainKey = keyof Domain;
type DomainType = "affectiveDomain" | "psychomotorDomain";

const subjectColumns = [
  { key: "name", label: "Subjects", visibilityKey: "col_name" },
  { key: "ca1", label: "1st C.A", visibilityKey: "col_ca1" },
  { key: "ca2", label: "2nd C.A", visibilityKey: "col_ca2" },
  { key: "ca3", label: "3rd C.A", visibilityKey: "col_ca3" },
  { key: "ca4", label: "4th C.A", visibilityKey: "col_ca4" },
  { key: "exam", label: "Exam", visibilityKey: "col_exam" },
  { key: "total", label: "Total", visibilityKey: "col_total" },
  { key: "grade", label: "Grade", visibilityKey: "col_grade" },
  { key: "position", label: "Position", visibilityKey: "col_position" },
  { key: "remark", label: "Remark", visibilityKey: "col_remark" },
];

const initialTemplateState = {
  schoolName: "Austica Memorial College, Nanka",
  motto: "Faith, Determination and Knowledge",
  reportTitle: "Terminal Report",
  studentName: "AJULUCHUKWU WILLIAMSTEVE CHINEMEREM",
  admissionNo: "AMC/2015/0231",
  class: "JSS3",
  numberInClass: "105",
  term: "First Term",
  session: "2017/2018",
  status: "Passed",
  totalMarksObtainable: 1500,
  totalMarksObtained: 977,
  average: 65.13,
  position: "61st",
  subjects: [
    {
      name: "ENGLISH",
      ca1: 9,
      ca2: 5,
      ca3: 5,
      ca4: 4,
      exam: 38,
      total: 61,
      grade: "C",
      position: "12th",
      remark: "Good",
    },
    {
      name: "MATHEMATICS",
      ca1: 10,
      ca2: 9,
      ca3: 1,
      ca4: 1,
      exam: 35,
      total: 56,
      grade: "P",
      position: "30th",
      remark: "Satisfactory",
    },
    {
      name: "AGRIC SCIENCE",
      ca1: 10,
      ca2: 10,
      ca3: 10,
      ca4: 7,
      exam: 45,
      total: 82,
      grade: "A",
      position: "15th",
      remark: "Excellent",
    },
    {
      name: "BASIC SCIENCE",
      ca1: 9,
      ca2: 6,
      ca3: 7,
      ca4: 7,
      exam: 27,
      total: 56,
      grade: "P",
      position: "31st",
      remark: "Satisfactory",
    },
    {
      name: "BASIC TECHNOLOGY",
      ca1: 10,
      ca2: 8,
      ca3: 7,
      ca4: 6,
      exam: 43,
      total: 74,
      grade: "C",
      position: "11th",
      remark: "Good",
    },
    {
      name: "BUSINESS STUDIES",
      ca1: 10,
      ca2: 10,
      ca3: 10,
      ca4: 8,
      exam: 35,
      total: 73,
      grade: "C",
      position: "21st",
      remark: "Good",
    },
    {
      name: "CIVIC EDUCATION",
      ca1: 6,
      ca2: 6,
      ca3: 7,
      ca4: 10,
      exam: 30,
      total: 59,
      grade: "P",
      position: "23rd",
      remark: "Satisfactory",
    },
    {
      name: "CULTURE AND CREATIVE",
      ca1: 4,
      ca2: 4,
      ca3: 5,
      ca4: 5,
      exam: 36,
      total: 54,
      grade: "P",
      position: "33rd",
      remark: "Satisfactory",
    },
    {
      name: "FRENCH LANGUAGE",
      ca1: 6,
      ca2: 6,
      ca3: 4,
      ca4: 8,
      exam: 34,
      total: 58,
      grade: "P",
      position: "18th",
      remark: "Satisfactory",
    },
    {
      name: "HOME ECONOMICS",
      ca1: 4,
      ca2: 1,
      ca3: 6,
      ca4: 9,
      exam: 31,
      total: 51,
      grade: "P",
      position: "37th",
      remark: "Satisfactory",
    },
    {
      name: "IGBO LANGUAGE",
      ca1: 7,
      ca2: 5,
      ca3: 6,
      ca4: 5,
      exam: 37,
      total: 60,
      grade: "C",
      position: "30th",
      remark: "Good",
    },
    {
      name: "PHYSICAL HEALTH EDUCATION",
      ca1: 5,
      ca2: 7,
      ca3: 8,
      ca4: 9,
      exam: 45,
      total: 74,
      grade: "C",
      position: "21st",
      remark: "Good",
    },
    {
      name: "SOCIAL STUDIES",
      ca1: null,
      ca2: null,
      ca3: null,
      ca4: null,
      exam: 80,
      total: 80,
      grade: "A",
      position: "19th",
      remark: "Excellent",
    },
    {
      name: "CHRISTIAN RELIGIOUS STUDIES",
      ca1: 8,
      ca2: 8,
      ca3: 10,
      ca4: 13,
      exam: 21,
      total: 60,
      grade: "C",
      position: "27th",
      remark: "Good",
    },
    {
      name: "COMPUTER STUDIES",
      ca1: 8,
      ca2: 9,
      ca3: 10,
      ca4: 10,
      exam: 42,
      total: 79,
      grade: "A",
      position: "20th",
      remark: "Excellent",
    },
  ],
  classTeacherRemarks: "Satisfactory",
  vacationDate: "Thursday 14th December, 2017",
  resumptionDate: "Monday 8th January, 2018",
  resultAnalysis: {
    compulsorySubjects: "Mathematics Or English, You Passed Mathematics | You Passed English Language",
    minimumSubjectToOffer: "Minimum Subject to offer is 12, you offered 15",
    minimumSubjectToPass: "Minimum subject to pass is 10, you passed 15 (pass mark is 50)",
    promotionScore: "Promotion score is 50, you scored 65.13",
  },
  affectiveDomain: {
    neatness: "Good",
    honesty: "Good",
    puntuality: "Good",
  },
  psychomotorDomain: {
    sports: "Good",
    handwriting: "Good",
    musicalSkills: "Good",
  },
}
export interface SavedJuniorTemplateConfig {
  data: StudentData;

  visibleSections: Record<string, boolean>;
}

type HeaderProperties = {
  schoolName: string;
  motto: string;
  reportTitle: string;
}

const initialColumnVisibility = subjectColumns.reduce(
  (acc, col) => ({ ...acc, [col.visibilityKey]: true }),
  {}
);
type TemplateState = StudentData & HeaderProperties;

export const JuniorResultTemplate = ({ data, initialVisibility }: { data: StudentData, initialVisibility?: Record<string, boolean> }) => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate()


  const [templateData, setTemplateData] = useState<TemplateState>({
    ...initialTemplateState,
    ...data,
  });
  const location = useLocation()

  const [visibleSections, setVisibleSections] = useState(() => {
    const defaultVisibility = {
      studentInfo: true,
      subjects: true,
      remarks: true,
      resultAnalysis: true,
      affective: true,
      psychomotor: true,
      ...initialColumnVisibility,
      ...Object.keys({
        "Name of Student": templateData.studentName,
      }).reduce(
        (acc, key) => ({
          ...acc,
          [`info_${key.replace(/[^a-zA-Z0-9]/g, "")}`]: true,
        }),
        {}
      ),
      remark_classTeacher: true,
      remark_vacationDate: true,
      remark_resumptionDate: true,
      ...Object.keys(templateData.resultAnalysis).reduce(
        (acc, key) => ({ ...acc, [`analysis_${key}`]: true }),
        {}
      ),
      ...Object.keys(templateData.affectiveDomain).reduce(
        (acc, key) => ({ ...acc, [`affective_${key}`]: true }),
        {}
      ),
      ...Object.keys(templateData.psychomotorDomain).reduce(
        (acc, key) => ({ ...acc, [`psychomotor_${key}`]: true }),
        {}
      ),
    };

    return initialVisibility ? { ...defaultVisibility, ...initialVisibility } : defaultVisibility;
  });



  const [highlightedColumn, setHighlightedColumn] = useState<string | null>(null);


  const handleDomainChange = (
    domainType: DomainType,
    key: string,
    value: string
  ) => {
    setTemplateData((prev) => ({
      ...prev,
      [domainType]: {
        ...prev[domainType],
        [key]: value,
      },
    }));
  };

  const handleEditChange = (key: string, value: string) => {
    setTemplateData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (section: keyof typeof visibleSections) => {
    setVisibleSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSaveToLocalStorage = (
    finalData: StudentData,
    currentVisibleSections: Record<string, boolean>
  ) => {
    try {
      const savedConfig: SavedJuniorTemplateConfig = {
        data: finalData,
        visibleSections: currentVisibleSections,
      };
      localStorage.setItem('savedJuniorTemplateConfig', JSON.stringify(savedConfig));
    } catch (e) {
      console.error("Failed to save template to local storage", e);
      alert('Error saving template.');
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      const compiledFinalData: StudentData = {
        ...data,
        ...templateData,
      };
      handleSaveToLocalStorage(compiledFinalData, visibleSections);
      navigate("/dashboard/edit/junior");
    } else {
      setIsEditing(true);
    }
  };



  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 relative">
      {
        location.pathname === "/dashboard/junior" && <>
          <div className="absolute top-3 right-3 flex items-center gap-3">
            <button
              onClick={handleEditToggle}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              {isEditing ? "Save" : "Edit"}
            </button>

            <details className="relative">
              <summary className="cursor-pointer px-3 py-1 bg-gray-200 text-sm rounded">
                ⚙ Settings
              </summary>
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10 w-40 p-2 text-sm">
                {Object.keys(visibleSections).map((key) => (
                  <label key={key} className="flex justify-between items-center py-1">
                    <span className="capitalize">{key}</span>
                    <input
                      type="checkbox"
                      checked={visibleSections[key as keyof typeof visibleSections]}
                      onChange={() => toggleSection(key as keyof typeof visibleSections)}
                    />
                  </label>
                ))}
              </div>
            </details>
          </div>
        </>
      }
      <div className="text-center border-b pb-4 mb-4 mt-6">
        {isEditing ? (
          <>
            <input
              value={templateData.schoolName}
              onChange={(e) => handleEditChange("schoolName", e.target.value)}
              className="text-xl font-bold text-blue-800 uppercase border-b w-full text-center mb-2"
            />
            <input
              value={templateData.motto}
              onChange={(e) => handleEditChange("motto", e.target.value)}
              className="text-sm italic text-gray-600 border-b w-full text-center mb-2"
            />
            <input
              value={templateData.reportTitle}
              onChange={(e) => handleEditChange("reportTitle", e.target.value)}
              className="text-red-600 font-semibold border-b w-full text-center"
            />
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-blue-800 uppercase">
              {templateData.schoolName}
            </h1>
            <p className="text-sm italic text-gray-600">{templateData.motto}</p>
            <p className="text-red-600 font-semibold mt-2">{templateData.reportTitle}</p>
          </>
        )}
      </div>

      {visibleSections.studentInfo && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mb-4 relative group border p-3">
          {isEditing && (
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
              onClick={() => toggleSection("studentInfo")}
            >
              <Trash2 className="w-3.5 h-3.5 text-white" />
            </Button>
          )}

          {Object.entries({
            "Name of Student": data.studentName,
            "Admission No.": data.admissionNo,
            Class: data.class,
            "Number in Class": data.numberInClass,
            Term: data.term,
            Session: data.session,
            Status: data.status,
            Average: `${data.average}%`,
            Position: data.position,
          }).map(([label, value]) => {
            const key = `info_${label.replace(/[^a-zA-Z0-9]/g, "")}`;
            if (!visibleSections[key as keyof typeof visibleSections]) return null;

            return (
              <p key={label} className="relative group/field pr-6">
                {isEditing && (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center
                      rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                    onClick={() => toggleSection(key as keyof typeof visibleSections)}
                  >
                    <Trash2 className="w-2.5 h-2.5 text-white" />
                  </Button>
                )}
                <span className="font-semibold">{label}:</span>{" "}
                {isEditing ? (
                  <input
                    value={String(value)}
                    onChange={() => { }}
                    className="border-b border-gray-400 focus:outline-none px-1"
                  />
                ) : (
                  value
                )}
              </p>
            );
          })}
        </div>
      )}

      {visibleSections.subjects && (
        <div className="overflow-x-auto mt-4 relative group border border-gray-300">
          {isEditing && (
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-20 
                 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
              onClick={() => toggleSection("subjects")}
            >
              <Trash2 className="w-3.5 h-3.5 text-white" />
            </Button>
          )}

          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {subjectColumns.map((col) => {
                  const isVisible =
                    visibleSections[col.visibilityKey as keyof typeof visibleSections];
                  if (!isVisible) return null;

                  return (
                    <th
                      key={col.key}
                      onMouseEnter={() => setHighlightedColumn(col.key)}
                      onMouseLeave={() => setHighlightedColumn(null)}
                      className={`border p-2 relative group/colHeader transition-colors cursor-pointer ${highlightedColumn === col.key ? " text-black" : "hover:bg-gray-200"
                        }`}
                    >
                      {isEditing && (
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute h-4 w-4 flex items-center justify-center
                           rounded-full p-0 z-10 opacity-0 group-hover/colHeader:opacity-100 transition-opacity duration-200 hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSection(col.visibilityKey as keyof typeof visibleSections);
                          }}
                        >
                          <Trash2 className="w-2.5 h-2.5 text-white" />
                        </Button>
                      )}
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {data.subjects.map((subj, idx) => (
                <tr
                  key={idx}
                  className={`relative group/row ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                  {subjectColumns.map((col) => {
                    const isVisible =
                      visibleSections[col.visibilityKey as keyof typeof visibleSections];
                    if (!isVisible) return null;
                    const value = subj[col.key as keyof Subject];
                    const isHighlighted = highlightedColumn === col.key;
                    return (
                      <td
                        key={col.key}
                        className={`border p-2 text-center transition-colors ${isHighlighted && isEditing ? "bg-red-200" : ""
                          }`}
                      >
                        {isEditing ? (
                          <input
                            value={String(value ?? "")}
                            onChange={() => { }}
                            className="w-full text-center border-b border-gray-400 focus:outline-none"
                          />
                        ) : (
                          value ?? "-"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {visibleSections.affective && (
          <div className="border border-gray-300 rounded-md p-3 relative group/affective">
            {isEditing && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                  opacity-0 group-hover/affective:opacity-100 transition-opacity duration-200 hover:scale-105"
                onClick={() => toggleSection("affective")}
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
              </Button>
            )}

            <h3 className="font-semibold text-gray-800 mb-2">Affective Domain</h3>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(data.affectiveDomain).map(([key, value]) => {
                  const visibilityKey = `affective_${key}`;
                  if (!visibleSections[visibilityKey as keyof typeof visibleSections]) return null;

                  return (
                    <tr key={key} className="border-t relative group/row">
                      {isEditing && (
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute -left-5 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 
                            opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 hover:scale-105"
                          onClick={() => toggleSection(visibilityKey as keyof typeof visibleSections)}
                        >
                          <Trash2 className="w-2.5 h-2.5 text-white" />
                        </Button>
                      )}
                      <td className="py-1 capitalize pl-6">{key}</td>
                      <td className="text-right">
                        {isEditing ? (
                          <input
                            type="text"
                            value={value as string}
                            className="w-16 border border-gray-300 rounded p-1 text-center"
                            onChange={(e) =>
                              handleDomainChange("affectiveDomain", key, e.target.value)
                            }
                          />
                        ) : (
                          value
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {visibleSections.psychomotor && (
          <div className="border border-gray-300 rounded-md p-3 relative group/psychomotor">
            {isEditing && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                  opacity-0 group-hover/psychomotor:opacity-100 transition-opacity duration-200 hover:scale-105"
                onClick={() => toggleSection("psychomotor")}
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
              </Button>
            )}

            <h3 className="font-semibold text-gray-800 mb-2">Psychomotor Domain</h3>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(data.psychomotorDomain).map(([key, value]) => {
                  const visibilityKey = `psychomotor_${key}`;
                  if (!visibleSections[visibilityKey as keyof typeof visibleSections]) return null;

                  return (
                    <tr key={key} className="border-t relative group/row">
                      {isEditing && (
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute -left-5 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 
                            opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 hover:scale-105"
                          onClick={() => toggleSection(visibilityKey as keyof typeof visibleSections)}
                        >
                          <Trash2 className="w-2.5 h-2.5 text-white" />
                        </Button>
                      )}
                      <td className="py-1 capitalize pl-6">{key}</td>
                      <td className="text-right">
                        {isEditing ? (
                          <input
                            type="text"
                            value={value as string}
                            className="w-16 border border-gray-300 rounded p-1 text-center"
                            onChange={(e) =>
                              handleDomainChange("psychomotorDomain", key, e.target.value)
                            }
                          />
                        ) : (
                          value
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
