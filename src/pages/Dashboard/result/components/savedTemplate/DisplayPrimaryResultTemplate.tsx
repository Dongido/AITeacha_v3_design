// ViewEditedTemplate.tsx

import React, { useState, useEffect } from 'react';
import { AcademicColumnKey, LOCAL_STORAGE_KEY, PrimaryResultData, sampleData, SavedTemplateConfig, Subject } from '../primary-result-template';
import EditTemplate from '../juniortemplate/EditTempalte';
import { Input } from '../../../../../components/ui/Input';
import { Trash2 } from 'lucide-react';
import { Button } from '@material-tailwind/react';
import { TextArea } from '../../../../../components/ui/TextArea';



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


const defaultFallback: SavedTemplateConfig = {
    data: {} as PrimaryResultData,
    visibility: {} as any,
    columnVisibility: {} as any,
    schoolDetails: [],
    gradingSystem: [],
    lastEditDate: 'N/A',

};


export default function ViewEditedPrimaryTemplate() {
    const [config, setConfig] = useState<SavedTemplateConfig | null>(null);
    const [data, setData] = useState<PrimaryResultData>(sampleData)


    useEffect(() => {
        try {
            const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedConfig) {
                setConfig(JSON.parse(savedConfig) as SavedTemplateConfig);
            } else {
                // Optionally load default state or show a message
                console.log("No saved template found in Local Storage.");
                setConfig(defaultFallback);
            }
        } catch (error) {
            console.error("Error loading template from local storage:", error);
            setConfig(defaultFallback);
        }
    }, []);

    if (!config) {
        return (
            <div className="min-h-screen p-4 flex justify-center items-center">
                Loading saved template...
            </div>
        );
    }


    const updateSubject = (index: number, field: keyof Subject, value: any) => {
        const newSubjects = [...config.data.subjects]
        newSubjects[index] = { ...newSubjects[index], [field]: value }
        setData((prev) => ({ ...prev, subjects: newSubjects }))
    }


    const isEditing = false

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
          <div className="min-h-screen bg-gray-50 p-4">
           <div className="max-w-5xl mx-auto">
            {/* Display the Last Edit Date */}
            <div className="text-right text-sm text-gray-600 mb-4">
                Last Edited: <span className="font-semibold text-blue-600">{config.lastEditDate}</span>
            </div>

            <div className="w-full max-w-[1200px] mx-auto bg-white shadow-lg">
            <div className="border-2 border-gray-800 p-2 sm:p-4">
                <EditTemplate
                    visibility={config.visibility}
                    isEditing={false}
                    schoolDetails={config.schoolDetails}
                    data={config.data}
                    columnVisibility={config.columnVisibility}
                    gradingSystem={config.gradingSystem}
                    toggleVisibility={() => { }}
                    deleteDetailLine={() => { }}
                    updateData={() => { }}
                    academicColumns={academicColumns}
                    toggleColumnVisibility={() => { }}
                    renderSubjectCell={renderSubjectCell}
                    updateAffectiveSkill={() => { }}
                    deletePsychomotorSkill={() => { }}
                    updatePsychomotorSkill={() => { }}
                    deleteAffectiveSkill={() => { }}
                    deleteGrade={() => { }}
                />
            </div>

            {config.visibility.summary && (
            <div className="mt-4 border border-gray-400 relative group">
              {/* Button to delete the ENTIRE Summary section */}
              {/* {isEditing && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                  onClick={() => toggleVisibility("summary")}
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </Button>
              )} */}
              <div className="bg-gray-100 p-2 font-bold text-center">SUMMARY</div>
              <div className="p-2 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm gap-2">

                {/* TOTAL SCORE */}
                {config.visibility.summaryTotalScore && (
                  <div className="relative group/field pr-5">
                    {/* {isEditing && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                        onClick={() => toggleVisibility("summaryTotalScore")}
                      >
                        <Trash2 className="w-2.5 h-2.5 text-white" />
                      </Button>
                    )} */}
                    TOTAL SCORE: {data.totalScore}/{data.maxScore}
                  </div>
                )}

                {/* AVG. SCORE */}
                {config.visibility.summaryAverage && (
                  <div className="relative group/field pr-5">
                    {/* {isEditing && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                        onClick={() => toggleVisibility("summaryAverage")}
                      >
                        <Trash2 className="w-2.5 h-2.5 text-white" />
                      </Button>
                    )} */}
                    AVG. SCORE: {data.average}%
                  </div>
                )}

                {/* GRADE */}
                {config.visibility.summaryGrade && (
                  <div className="relative group/field pr-5">
                    {/* {isEditing && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                        onClick={() => toggleVisibility("summaryGrade")}
                      >
                        <Trash2 className="w-2.5 h-2.5 text-white" />
                      </Button>
                    )} */}
                    GRADE: {data.overallGrade}
                  </div>
                )}

                {/* SIGNATURE / STAMP */}
                {config.visibility.summarySignature && (
                  <div className="border border-gray-400 w-20 h-8 flex items-center justify-center text-xs relative group/field">
                    {/* {isEditing && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                        onClick={() => toggleVisibility("summarySignature")}
                      >
                        <Trash2 className="w-2.5 h-2.5 text-white" />
                      </Button>
                    )} */}
                    SIGNATURE / STAMP
                  </div>
                )}
              </div>
            </div>
          )}

          {config.visibility.remarks && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm relative group">
              {/* Button to delete the ENTIRE Remarks section */}
              {/* {isEditing && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                  onClick={() => toggleVisibility("remarks")}
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </Button>
              )} */}

              {/* CLASS TEACHER REMARKS */}
              {config.visibility.remarksClassTeacher && (
                <div className="relative group/field">
                  {/* {isEditing && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                      onClick={() => toggleVisibility("remarksClassTeacher")}
                    >
                      <Trash2 className="w-2.5 h-2.5 text-white" />
                    </Button>
                  )} */}
                  <div className="font-bold">CLASS TEACHER REMARKS:</div>
                  {isEditing ? (
                    <TextArea
                      value={data.classTeacherRemarks}
                    //   onChange={(e) => updateData("classTeacherRemarks", e.target.value)}
                      className="min-h-[60px]"
                    />
                  ) : (
                    <div className="border-b border-gray-400 pb-1">{data.classTeacherRemarks}</div>
                  )}
                </div>
              )}

              {/* SCHOOL HEAD REMARKS */}
              {config.visibility.remarksSchoolHead && (
                <div className="relative group/field">
                  {/* {isEditing && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center
                       rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                      onClick={() => toggleVisibility("remarksSchoolHead")}
                    >
                      <Trash2 className="w-2.5 h-2.5 text-white" />
                    </Button>
                  )} */}
                  <div className="font-bold">SCHOOL HEAD REMARKS:</div>
                  {isEditing ? (
                    <TextArea
                      value={data.headTeacherRemarks}
                    //   onChange={(e) => updateData("headTeacherRemarks", e.target.value)}
                      className="min-h-[60px]"
                    />
                  ) : (
                    <div className="border-b border-gray-400 pb-1">{data.headTeacherRemarks}</div>
                  )}
                </div>
              )}
            </div>
          )}
          {config.visibility.footer && (
            <div className="mt-4 text-xs text-center relative group">
              {/* Button to delete the ENTIRE Footer section */}
              {/* {isEditing && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 z-10 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                  onClick={() => toggleVisibility("footer")}
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </Button>
              )} */}

              {/* INFO TO PARENTS: Static Text */}
              {config.visibility.footerInfo && (
                <div className="font-bold relative group/field">
                  {/* {isEditing && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-0 -right-4 h-4 w-4 flex items-center justify-center rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                      onClick={() => toggleVisibility("footerInfo")}
                    >
                      <Trash2 className="w-2.5 h-2.5 text-white" />
                    </Button>
                  )} */}
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
                  {config.visibility.footerInfo && <div>We thank God for an awesome term. Please be aware that next term PTA meeting will be on</div>}

                  {/* Next Term Begins Date */}
                  { config.visibility.footerNextTermBegins && (
                    <div className="relative group/field inline-block">
                      {/* {isEditing && (
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute -top-1 -right-5 h-4 w-4 flex items-center justify-center
                           rounded-full p-0 z-10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 hover:scale-105"
                        //   onClick={() => toggleVisibility("footerNextTermBegins")}
                        >
                          <Trash2 className="w-2.5 h-2.5 text-white" />
                        </Button>
                      )} */}
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
    );
}