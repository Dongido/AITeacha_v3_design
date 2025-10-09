import React, { useState } from "react";
import { Button } from "../../../../../components/ui/Button";
import { EyeOff, Trash2 } from "lucide-react";
import { Input } from "../../../../../components/ui/Input"; // Make sure this exists
import { AcademicColumnKey, AffectiveSkill, GradeRow, PrimaryResultData, PsychomotorSkill, Subject } from "../primary-result-template";


interface EditTemplateProps {
    visibility: {
        logo: boolean;
        schoolInfo: boolean;
        studentPhoto: boolean;
        studentInfo: boolean,
        attendanceInfo: boolean,
        academicTable: boolean,
        affectiveSkills: boolean,
        psychomotorSkills: boolean,
        gradingSystem: boolean,
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
    };
    isEditing: boolean;
    schoolDetails: { id: number; value: string; type: string }[];
    toggleVisibility: (key: keyof EditTemplateProps["visibility"]) => void;
    deleteDetailLine: (id: number) => void;
    data: PrimaryResultData,
    updateData: (field: keyof PrimaryResultData, value: any) => void
    academicColumns: {
        key: AcademicColumnKey;
        label: string;
        isInput?: boolean;
    }[],
    columnVisibility: Record<AcademicColumnKey, boolean>,
    toggleColumnVisibility: (column: AcademicColumnKey) => void,
    renderSubjectCell: (subject: Subject, key: AcademicColumnKey, index: number, isInput?: boolean) => string | number | JSX.Element,
    updateAffectiveSkill: (index: number, field: keyof AffectiveSkill, value: any) => void
    deletePsychomotorSkill: (index: number) => void,
    updatePsychomotorSkill: (index: number, field: keyof PsychomotorSkill, value: any) => void,
    deleteAffectiveSkill: (index: number) => void,
    gradingSystem: GradeRow[],
    deleteGrade: (gradeToDelete: string) => void
}

const EditTemplate: React.FC<EditTemplateProps> = ({
    visibility,
    isEditing,
    schoolDetails,
    toggleVisibility,
    deleteDetailLine,
    data,
    updateData,
    academicColumns,
    columnVisibility,
    toggleColumnVisibility,
    renderSubjectCell,
    updateAffectiveSkill,
    deletePsychomotorSkill,
    updatePsychomotorSkill,
    deleteAffectiveSkill,
    gradingSystem,
    deleteGrade
}) => {


    const [hoveredColumnKey, setHoveredColumnKey] = useState(null);
    return (
        <div>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    {/* LOGO */}
                    {visibility.logo && (
                        <div className="relative group">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-gray-800 flex-shrink-0">
                                <div className="text-xs font-bold text-center">LOGO</div>
                            </div>
                            {isEditing && (
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                                    onClick={() => toggleVisibility("logo")}
                                >
                                    <Trash2 className="w-3.5 h-3.5 text-white" />
                                </Button>
                            )}
                        </div>
                    )}

                    {/* SCHOOL INFO */}
                    {visibility.schoolInfo && (
                        <div className="text-center sm:text-left relative group">
                            {isEditing && (
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 z-10 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                                    onClick={() => toggleVisibility("schoolInfo")}
                                >
                                    <Trash2 className="w-3.5 h-3.5 text-white" />
                                </Button>
                            )}
                            {isEditing ? (
                                <div className="space-y-1">
                                    {schoolDetails.map((item) => (
                                        <div key={item.id} className="relative group/line">
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="absolute -top-1 -right-6 h-5 w-5 rounded-full p-0 z-10
                        opacity-0 group-hover/line:opacity-100 transition-opacity duration-200"
                                                onClick={() => deleteDetailLine(item.id)}
                                            >
                                                <Trash2 className="w-3 h-3 text-white" />
                                            </Button>

                                            <Input
                                                defaultValue={item.value}
                                                className="text-xs h-6 pr-8"
                                                placeholder={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {schoolDetails.map((item, index) => (
                                        <p key={item.id || index} className="text-xs text-gray-500">
                                            {item.value}
                                        </p>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* STUDENT PHOTO */}
                {visibility.studentPhoto && (
                    <div className="relative group">
                        <div className="w-16 h-20 sm:w-20 sm:h-24 bg-gray-200 border border-gray-400 flex items-center justify-center flex-shrink-0">
                            <div className="text-xs text-gray-500 text-center">Student Photo</div>
                        </div>
                        {isEditing && (
                            <Button
                                size="icon"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
              opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                                onClick={() => toggleVisibility("studentPhoto")}
                            >
                                <Trash2 className="w-3.5 h-3.5 text-white" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <div className="text-center mb-4">
                <h2 className="text-sm sm:text-lg font-bold text-gray-800">«« STUDENT'S ACADEMIC REPORT CARD »»</h2>
            </div>
            {visibility.studentInfo && (
                <div className="border border-gray-400 mb-4 relative group">
                    {/* Delete Button for entire Student Info section */}
                    {isEditing && (
                        <Button
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                            onClick={() => toggleVisibility("studentInfo")}
                        >
                            <Trash2 className="w-3.5 h-3.5 text-white" />
                        </Button>
                    )}

                    {/* Student Name */}
                    <div className="bg-gray-100 p-2 text-center font-bold text-base sm:text-lg">
                        {isEditing ? (
                            <Input
                                value={data.studentName}
                                onChange={(e) => updateData("studentName", e.target.value)}
                                className="text-center font-bold"
                            />
                        ) : (
                            data.studentName
                        )}
                    </div>

                    <div className="p-2 text-xs sm:text-sm">
                        {/* Gender, Admission Number, Age - Now with individual toggles */}
                        <div className="mb-2">
                            {isEditing ? (
                                <div className="flex flex-col sm:flex-row gap-2">
                                    {/* Gender Field with Delete Icon */}
                                    {visibility.gender && ( // <-- CHECK VISIBILITY
                                        <div className="flex-1 relative group/field">
                                            {isEditing && (
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                    onClick={() => toggleVisibility("gender")} // <-- TOGGLE INDIVIDUAL FIELD
                                                >
                                                    <Trash2 className="w-2.5 h-2.5 text-white" />
                                                </Button>
                                            )}
                                            <Input
                                                value={data.gender}
                                                onChange={(e) => updateData("gender", e.target.value)}
                                                placeholder="Gender"
                                            />
                                        </div>
                                    )}

                                    {/* Admission Number Field with Delete Icon */}
                                    {visibility.admissionNumber && ( // <-- CHECK VISIBILITY
                                        <div className="flex-1 relative group/field">
                                            {isEditing && (
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    className="absolute -top-1 -right-1 h-4 w-4 flex 
                                                    items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                    onClick={() => toggleVisibility("admissionNumber")} 
                                                >
                                                    <Trash2 className="w-2.5 h-2.5 text-white" />
                                                </Button>
                                            )}
                                            <Input
                                                value={data.admissionNumber}
                                                onChange={(e) => updateData("admissionNumber", e.target.value)}
                                                placeholder="Admission Number"
                                            />
                                        </div>
                                    )}

                                    {/* Age Field with Delete Icon */}
                                    {visibility.age && ( // <-- CHECK VISIBILITY
                                        <div className="flex-1 relative group/field">
                                            {isEditing && (
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                    onClick={() => toggleVisibility("age")} // <-- TOGGLE INDIVIDUAL FIELD
                                                >
                                                    <Trash2 className="w-2.5 h-2.5 text-white" />
                                                </Button>
                                            )}
                                            <Input
                                                value={data.age}
                                                onChange={(e) => updateData("age", e.target.value)}
                                                placeholder="Age"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* Display only visible fields */}
                                    {visibility.gender && `Gender: ${data.gender}`}
                                    {visibility.gender && (visibility.admissionNumber || visibility.age) && " | "}
                                    {visibility.admissionNumber && `Admission Number: ${data.admissionNumber}`}
                                    {visibility.admissionNumber && visibility.age && " | "}
                                    {visibility.age && `Age: ${data.age}`}
                                </>
                            )}
                        </div>

                        {/* Attendance/Term Info (Conditional: visibility.attendanceInfo) */}
                        {visibility.attendanceInfo && (
                            <div className="p-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm border-t border-gray-300 relative group/attendance">
                                {/* Delete Button for Attendance Info section */}
                                {isEditing && (
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="absolute -top-4 right-0 h-5 w-5 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/attendance:opacity-100 transition-opacity duration-200 hover:scale-105"
                                        onClick={() => toggleVisibility("attendanceInfo")}
                                    >
                                        <Trash2 className="w-3 h-3 text-white" />
                                    </Button>
                                )}

                                {/* Term/Session/Resumption - Apply the same pattern here for individual fields */}
                                <div>
                                    {isEditing ? (
                                        <div className="space-y-1">
                                            {/* Example: Term Field with Delete Icon */}
                                            {visibility.term && ( // <-- CHECK VISIBILITY
                                                <div className="relative group/field">
                                                    {isEditing && (
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                            onClick={() => toggleVisibility("term")} // <-- TOGGLE INDIVIDUAL FIELD
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5 text-white" />
                                                        </Button>
                                                    )}
                                                    <Input value={data.term} onChange={(e) => updateData("term", e.target.value)} placeholder="Term" className="h-7" />
                                                </div>
                                            )}

                                            {/* Session Field with Delete Icon */}
                                            {visibility.session && ( // <-- CHECK VISIBILITY
                                                <div className="relative group/field">
                                                    {isEditing && (
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                            onClick={() => toggleVisibility("session")} // <-- TOGGLE INDIVIDUAL FIELD
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5 text-white" />
                                                        </Button>
                                                    )}
                                                    <Input value={data.session} onChange={(e) => updateData("session", e.target.value)} placeholder="Session" className="h-7" />
                                                </div>
                                            )}

                                            {/* Resumption Field with Delete Icon */}
                                            {visibility.resumption && ( // <-- CHECK VISIBILITY
                                                <div className="relative group/field">
                                                    {isEditing && (
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                            onClick={() => toggleVisibility("resumption")} // <-- TOGGLE INDIVIDUAL FIELD
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5 text-white" />
                                                        </Button>
                                                    )}
                                                    <Input value={data.resumption} onChange={(e) => updateData("resumption", e.target.value)} placeholder="Resumption" className="h-7" />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            {visibility.term && <div>Term: {data.term}</div>}
                                            {visibility.session && <div>Session: {data.session}</div>}
                                            {visibility.resumption && <div>Resumption: {data.resumption}</div>}
                                        </>
                                    )}
                                </div>

                                {/* The same pattern should be applied to the remaining blocks (Class/Students/Teacher and Days Present/Absent) */}
                                {/* ... (rest of the attendanceInfo section remains, but fields should be wrapped like the examples above) ... */}

                                {/* Class/Students in Class/Class Teacher */}
                                <div>
                                    {isEditing ? (
                                        <div className="space-y-1">
                                            {visibility.class && (
                                                <div className="relative group/field">
                                                    {isEditing && (
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                            onClick={() => toggleVisibility("class")}
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5 text-white" />
                                                        </Button>
                                                    )}
                                                    <Input value={data.class} onChange={(e) => updateData("class", e.target.value)} placeholder="Class" className="h-7" />
                                                </div>
                                            )}

                                            {visibility.studentsInClass && (
                                                <div className="relative group/field">
                                                    {isEditing && (
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                            onClick={() => toggleVisibility("studentsInClass")}
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5 text-white" />
                                                        </Button>
                                                    )}
                                                    <Input type="number" value={data.studentsInClass} onChange={(e) => updateData("studentsInClass", Number.parseInt(e.target.value))} placeholder="Students in Class" className="h-7" />
                                                </div>
                                            )}

                                            {visibility.classTeacher && (
                                                <div className="relative group/field">
                                                    {isEditing && (
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                            onClick={() => toggleVisibility("classTeacher")}
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5 text-white" />
                                                        </Button>
                                                    )}
                                                    <Input value={data.classTeacher} onChange={(e) => updateData("classTeacher", e.target.value)} placeholder="Class Teacher" className="h-7" />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            {visibility.class && <div>Class: {data.class}</div>}
                                            {visibility.studentsInClass && <div>Students in Class: {data.studentsInClass}</div>}
                                            {visibility.classTeacher && <div>Class Teacher: {data.classTeacher}</div>}
                                        </>
                                    )}
                                </div>

                                {/* Days Present/Absent */}
                                <div>
                                    {isEditing ? (
                                        <div className="space-y-1">
                                            {visibility.totalDaysInTerm && (
                                                <div className="relative group/field">
                                                    {isEditing && (
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                            onClick={() => toggleVisibility("totalDaysInTerm")}
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5 text-white" />
                                                        </Button>
                                                    )}
                                                    <Input type="number" value={data.totalDaysInTerm} onChange={(e) => updateData("totalDaysInTerm", Number.parseInt(e.target.value))} placeholder="Total Days in Term" className="h-7" />
                                                </div>
                                            )}

                                            {visibility.totalDaysPresent && (
                                                <div className="relative group/field">
                                                    {isEditing && (
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                            onClick={() => toggleVisibility("totalDaysPresent")}
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5 text-white" />
                                                        </Button>
                                                    )}
                                                    <Input type="number" value={data.totalDaysPresent} onChange={(e) => updateData("totalDaysPresent", Number.parseInt(e.target.value))} placeholder="Total Days Present" className="h-7" />
                                                </div>
                                            )}

                                            {visibility.totalDaysAbsent && (
                                                <div className="relative group/field">
                                                    {isEditing && (
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                            onClick={() => toggleVisibility("totalDaysAbsent")}
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5 text-white" />
                                                        </Button>
                                                    )}
                                                    <Input type="number" value={data.totalDaysAbsent} onChange={(e) => updateData("totalDaysAbsent", Number.parseInt(e.target.value))} placeholder="Total Days Absent" className="h-7" />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            {visibility.totalDaysInTerm && <div>Total Days in Term: {data.totalDaysInTerm}</div>}
                                            {visibility.totalDaysPresent && <div>Total Days Present: {data.totalDaysPresent}</div>}
                                            {visibility.totalDaysAbsent && <div>Total Days Absent: {data.totalDaysAbsent}</div>}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-4">
                {visibility.academicTable && (
                    <div className="flex-1 relative group">
                        {isEditing && (
                            <Button
                                size="icon"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                                onClick={() => toggleVisibility("academicTable")}
                            >
                                <Trash2 className="w-3.5 h-3.5 text-white" />
                            </Button>
                        )}
                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-400 text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            {academicColumns
                                .filter((col) => columnVisibility[col.key])
                                .map(({ key, label }) => (
                            <th
                                key={key}
                                className={`border border-gray-400 p-1 ${key === "name" ? "text-left" : "text-center"
                                    } relative`}
                                onMouseEnter={() => setHoveredColumnKey(key as any)}
                                onMouseLeave={() => setHoveredColumnKey(null)}
                            >
                                {label}

                            {isEditing && hoveredColumnKey === key && (
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 right-2 
                                bg-red-500 h-6 w-6 flex items-center justify-center 
                                rounded-full p-0 z-10 transition-transform duration-200 
                                hover:scale-105 cursor-pointer"
                                    onClick={() => toggleColumnVisibility(key)}
                                >
                                    <Trash2 className="w-3.5 h-3.5 text-white" />
                                </div>
                            )}
                        </th>
                        ))}
                       </tr>

                        </thead>
                        <tbody>
                            {data.subjects.map((subject, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {academicColumns.filter(col => columnVisibility[col.key]).map(({ key, isInput }) => (
                                        <td
                                            key={key}
                                            className={`
                                            border border-gray-400 p-1
                                            ${key === 'name' ? 'text-left font-medium' : 'text-center'}
                                            ${key === 'total' || key === 'grade' ? ' font-bold' : ''}
                                            ${hoveredColumnKey === key && isEditing ? 'bg-red-500' : ''}
                                            `}
                                        >
                                            {renderSubjectCell(subject, key, index, isInput)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

                <div className="w-full lg:w-48 space-y-4">
                    {visibility.affectiveSkills && (
                        <div className="border border-gray-400 relative group">
                            {isEditing && (
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                                     opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                                    onClick={() => toggleVisibility("affectiveSkills")}

                                >
                                    <Trash2 className="w-3.5 h-3.5 text-white" />
                                </Button>
                            )}
                            <div className="bg-gray-100 p-1 text-center font-bold text-xs">AFFECTIVE SKILLS</div>
                            <table className="w-full text-xs">
                                <tbody>
                                    {data.affectiveSkills.map((skill, index) => (
                                        <tr key={index} className="group/row">
                                            <td className="border-r border-gray-300 p-1 text-left relative">
                                                {isEditing ? (
                                                    <Input
                                                        value={skill.skill}
                                                        onChange={(e) => updateAffectiveSkill(index, "skill", e.target.value)}
                                                        className="h-6 text-xs"
                                                    />
                                                ) : (
                                                    skill.skill
                                                )}
                                            </td>
                                            <td className="p-1 text-center">
                                                {isEditing ? (
                                                    <Input
                                                        type="number"
                                                        value={skill.rating}
                                                        onChange={(e) => updateAffectiveSkill(index, "rating", Number.parseInt(e.target.value))}
                                                        className="h-6 text-xs text-center w-10"
                                                    />
                                                ) : (
                                                    skill.rating
                                                )}
                                            </td>
                                            {/* NEW: Delete Button */}
                                            {isEditing && (
                                                <td className="p-0 w-6">
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        className="h-6 w-6 p-0 flex items-center justify-center
                                                         rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                        onClick={() => deleteAffectiveSkill(index)}
                                                    >
                                                        <Trash2 className="w-3 h-3 text-white" />
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {visibility.psychomotorSkills && (
                        <div className="border border-gray-400 relative group">
                            {isEditing && (
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                                    onClick={() => toggleVisibility("psychomotorSkills")}

                                >
                                    <Trash2 className="w-3.5 h-3.5 text-white" />
                                </Button>
                            )}
                            <div className="bg-gray-100 p-1 text-center font-bold text-xs">PSYCHOMOTOR SKILLS</div>
                            <table className="w-full text-xs">
                                <table className="w-full text-xs">
                                    <tbody>
                                        {data.psychomotorSkills.map((skill, index) => (
                                            <tr key={index} className="group/row">
                                                <td className="border-r border-gray-300 p-1 text-left">
                                                    {isEditing ? (
                                                        <Input
                                                            value={skill.skill}
                                                            onChange={(e) => updatePsychomotorSkill(index, "skill", e.target.value)}
                                                            className="h-6 text-xs"
                                                        />
                                                    ) : (
                                                        skill.skill
                                                    )}
                                                </td>
                                                <td className="p-1 text-center">
                                                    {isEditing ? (
                                                        <Input
                                                            type="number"
                                                            value={skill.rating}
                                                            onChange={(e) =>
                                                                updatePsychomotorSkill(index, "rating", Number.parseInt(e.target.value))
                                                            }
                                                            className="h-6 text-xs text-center w-10"
                                                        />
                                                    ) : (
                                                        skill.rating
                                                    )}
                                                </td>
                                                {isEditing && (
                                                    <td className="p-0 w-6">
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="h-6 w-6 p-0 flex items-center justify-center rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 hover:scale-105"
                                                            onClick={() => deletePsychomotorSkill(index)}
                                                        >
                                                            <Trash2 className="w-3 h-3 text-white" />
                                                        </Button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </table>
                        </div>
                    )}

                    {visibility.gradingSystem && (
            <div className="border border-gray-400 relative group">
        {/* Delete Button for entire Grading System section */}
        {isEditing && (
            <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                onClick={() => toggleVisibility("gradingSystem")}
            >
                <Trash2 className="w-3.5 h-3.5 text-white" />
            </Button>
        )}
        <div className="bg-gray-100 p-1 text-center font-bold text-xs">GRADING SYSTEM</div>
        <table className="w-full text-xs">
            <tbody>
                {/* Map over the gradingSystem state to render rows */}
                {gradingSystem.map((item) => (
                    <tr 
                        key={item.grade} 
                        className="relative group/row" // Added relative and group/row for positioning the button
                    >
                        {/* Individual Delete Button for this grade row */}
                        {isEditing && (
                            <Button
                                size="icon"
                                variant="destructive"
                                className="absolute -left-2 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 
                                   opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 hover:scale-105"
                                onClick={() => deleteGrade(item.grade)} 
                            >
                                <Trash2 className="w-2.5 h-2.5 text-white" />
                            </Button>
                        )}
                        <td className="border-r border-gray-300 p-1 pl-4">{item.grade}</td>
                        <td className="p-1">{item.range}</td>
                             </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
                  )}
                </div>
            </div>
        </div>
    );
};

export default EditTemplate;
