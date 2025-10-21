// import * as React from "react";
// import { useState, useEffect } from "react";
// import { Input } from "../../../components/ui/Input";
// import { Button } from "../../../components/ui/Button";
// import { generateOutlineQuestion } from "../../../api/assignment";
// import { TextArea } from "../../../components/ui/TextArea";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../../../components/ui/Dialogue";
// import { Edit, Trash, Plus } from "lucide-react";

// export interface QuestionOption {
//   [key: string]: string;
// }

// export interface Question {
//   question: string;
//   options: QuestionOption;
// }

// export interface AssessmentQuestion {
//   title: string;
//   options: string[];
// }
// const parseOutlines = (
//   responseTextArray: string[]
// ): { title: string; items: string[]; assessment?: AssessmentQuestion[] }[] => {
//   const outlines: {
//     title: string;
//     items: string[];
//     assessment?: AssessmentQuestion[];
//   }[] = [];

//   if (!Array.isArray(responseTextArray)) {
//     console.error("Input is not an array of strings.");
//     return outlines; // Return empty array if input is invalid
//   }

//   const responseText = responseTextArray.join("\n\n"); // Join the array into a single string

//   const outlineBlocks = responseText.split("\n\n");

//   outlineBlocks.forEach((block) => {
//     const lines = block.trim().split("\n");
//     if (lines.length > 0) {
//       const titleLine = lines.shift()?.trim();
//       if (titleLine) {
//         outlines.push({
//           title: titleLine,
//           items: lines
//             .filter((line) => line.trim() !== "")
//             .map((line) => line.trim()),
//         });
//       }
//     }
//   });

//   return outlines;
// };

// interface OutlineInputsProps {
//   initialOutlines: {
//     title: string;
//     items?: string[];
//     assessment?: AssessmentQuestion[];
//   }[];
//   grade: string;
//   onOutlinesChange: (
//     updatedOutlines: {
//       title: string;
//       items?: string[];
//       assessment?: AssessmentQuestion[];
//     }[]
//   ) => void;
//   onSelectedOutlinesChange: (
//     selectedOutlines: {
//       title: string;
//       items?: string[];
//       assessment?: AssessmentQuestion[];
//     }[]
//   ) => void;
//   onGenerateMoreOutlines: () => void;
// }

// const OutlineInputs = ({
//   initialOutlines,
//   grade,
//   onOutlinesChange,
//   onSelectedOutlinesChange,
//   onGenerateMoreOutlines,
// }: OutlineInputsProps) => {
//   const [outlines, setOutlines] = useState(initialOutlines);
//    console.log("outlines", outlines)
//   const [loading, setLoading] = useState<number | null>(null);
//   const [questions, setQuestions] = useState<{
//     [key: number]: AssessmentQuestion[];
//   }>({});
//   const [selectedOutlinesIndices, setSelectedOutlinesIndices] = useState<
//     number[]
//   >([]);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [dialogAssessment, setDialogAssessment] = useState<
//     AssessmentQuestion[]
//   >([]);
//   const [dialogIndex, setDialogIndex] = useState<number | null>(null);

//   const generateAssessment = async (outlineIndex: number, title: string) => {
//     setLoading(outlineIndex);
//     try {
//       const responseData = await generateOutlineQuestion(title, grade);
//       console.log("API response:", responseData);

//       if (responseData.status !== "success" || !responseData.data) {
//         throw new Error("API returned an unexpected response.");
//       }

//       const questionData: Question[] = responseData.data;
//       const assessmentQuestions: AssessmentQuestion[] = questionData.map(
//         (q: Question) => ({
//           title: q.question,
//           options: Object.values(q.options),
//         })
//       );

//       setQuestions((prev) => ({
//         ...prev,
//         [outlineIndex]: assessmentQuestions,
//       }));
//       setOutlines((prevOutlines) =>
//         prevOutlines.map((outline, i) =>
//           i === outlineIndex
//             ? { ...outline, assessment: assessmentQuestions }
//             : outline
//         )
//       );
//       onOutlinesChange(
//         outlines.map((outline, i) => ({
//           title: outline.title,
//           assessment:
//             i === outlineIndex ? assessmentQuestions : outline.assessment,
//         }))
//       );
//     } catch (error: any) {
//       alert(error.message);
//       console.error("Error parsing question string:", error);
//     } finally {
//       setLoading(null);
//     }
//   };

//   const handleTitleChange = (
//     index: number,
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setOutlines((prevOutlines) =>
//       prevOutlines.map((outline, i) =>
//         i === index ? { ...outline, title: event.target.value } : outline
//       )
//     );
//     onOutlinesChange(
//       outlines.map((outline, i) => ({
//         title: i === index ? event.target.value : outline.title,
//         assessment: questions[i] || outline.assessment,
//       }))
//     );
//   };

//   const handleAssessmentChange = (
//     index: number,
//     value: AssessmentQuestion[]
//   ) => {
//     setOutlines((prevOutlines) =>
//       prevOutlines.map((outline, i) =>
//         i === index ? { ...outline, assessment: value } : outline
//       )
//     );
//     setQuestions((prev) => ({
//       ...prev,
//       [index]: value,
//     }));
//     onOutlinesChange(
//       outlines.map((outline, i) => ({
//         title: outline.title,
//         assessment: i === index ? value : outline.assessment,
//       }))
//     );
//   };

//   const addOutline = (event: React.MouseEvent<HTMLButtonElement>) => {
//     event.preventDefault();
//     const newOutline = { title: "", items: [], assessment: [] };
//     setOutlines((prevOutlines) => [...prevOutlines, newOutline]);
//     onOutlinesChange([...outlines, { title: "", assessment: [] }]);
//   };
//   const handleSelectOutline = (
//     index: number,
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     event.preventDefault();
//     setSelectedOutlinesIndices((prevSelected) => {
//       if (prevSelected.includes(index)) {
//         return prevSelected.filter((i) => i !== index);
//       } else {
//         return [...prevSelected, index];
//       }
//     });
//   };
//   const handleDialogOpen = (
//     index: number,
//     assessment: AssessmentQuestion[] | undefined,
//     event?: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     if (event) {
//       event.preventDefault();
//     }
//     setDialogAssessment(assessment || []);
//     setDialogIndex(index);
//     setDialogOpen(true);
//   };
//   const handleDialogClose = (event?: React.MouseEvent<HTMLButtonElement>) => {
//     if (event) {
//       event.preventDefault();
//     }
//     setDialogOpen(false);
//     setDialogIndex(null);
//     setDialogAssessment([]);
//   };

//   const handleDialogSave = (event?: React.MouseEvent<HTMLButtonElement>) => {
//     if (event) {
//       event.preventDefault();
//     }
//     if (dialogIndex !== null) {
//       handleAssessmentChange(dialogIndex, dialogAssessment);
//     }
//     handleDialogClose();
//   };

//   const handleDialogAssessmentChange = (
//     questionIndex: number,
//     field: "title" | "options",
//     value: string,
//     optionIndex?: number
//   ) => {
//     setDialogAssessment((prevAssessment) => {
//       const newAssessment = [...prevAssessment];
//       if (field === "title") {
//         newAssessment[questionIndex].title = value;
//       } else if (field === "options" && optionIndex !== undefined) {
//         newAssessment[questionIndex].options[optionIndex] = value;
//       }
//       return newAssessment;
//     });
//   };

//   const handleAddAssessment = () => {
//     setDialogAssessment((prevAssessment) => [
//       ...prevAssessment,
//       { title: "", options: ["", "", "", ""] },
//     ]);
//   };

//   const handleRemoveAssessment = (questionIndex: number) => {
//     setDialogAssessment((prevAssessment) => {
//       return prevAssessment.filter((_, index) => index !== questionIndex);
//     });
//   };

//   useEffect(() => {
//     onOutlinesChange(
//       outlines.map((outline, i) => ({
//         title: outline.title,
//         assessment: questions[i] || outline.assessment,
//       }))
//     );
//   }, [outlines, questions, onOutlinesChange]);

//   useEffect(() => {
//     const selectedOutlinesData = selectedOutlinesIndices.map(
//       (index) => outlines[index]
//     );
//     onSelectedOutlinesChange(selectedOutlinesData);
//   }, [selectedOutlinesIndices, outlines, onSelectedOutlinesChange]);

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-4">
//         {outlines.map((outline, outlineIndex) => (
//           <div
//             key={outlineIndex}
//             className="p-4 border rounded-lg bg-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
//           >
//             {!selectedOutlinesIndices.includes(outlineIndex) && (
//               <div className="flex items-center gap-2">
//                 <Button
//                   onClick={(event) => handleSelectOutline(outlineIndex, event)}
//                   variant="outline"
//                   className="px-4 py-2 rounded-full text-sm md:text-base"
//                 >
//                   Add
//                 </Button>
//               </div>
//             )}

//             <Input
//               type="text"
//               value={outline.title}
//               onChange={(e) => handleTitleChange(outlineIndex, e)}
//               placeholder="Outline Title"
//               className="flex-1 border rounded-lg p-2 text-sm md:text-base"
//             />

//             <Button
//               onClick={(event) =>
//                 handleDialogOpen(outlineIndex, outline.assessment, event)
//               }
//               variant="ghost"
//               className="p-2 sm:p-3 md:p-4 flex items-center"
//             >
//               <Edit className="h-4 w-4 mr-2" />
//               <span className="hidden sm:inline">View Assessment</span>
//               <span className="sr-only">View Assessment</span>
//             </Button>
//             <button
//               onClick={() => generateAssessment(outlineIndex, outline.title)}
//               className="bg-[#6200EE] text-white px-4 py-2 rounded-lg text-sm md:text-base transition disabled:opacity-50"
//               disabled={loading === outlineIndex}

//             >
//               {loading === outlineIndex
//                 ? "Generating..."
//                 : "Generate Assessment"}
//             </button>
//           </div>
//         ))}
//       </div>

//       <div className="flex gap-2">
//         <button
//           onClick={addOutline}
//           className="w-full md:w-auto rounded-lg px-6 py-2 bg-[#6200EE] text-white"
//         >
//           Add Outline
//         </button>

//         <button
//           onClick={onGenerateMoreOutlines}

//           className="w-full md:w-auto rounded-lg px-6 bg-gray-300"
//         >
//           Generate More Outlines
//         </button>
//       </div>

//       <Dialog
//         open={dialogOpen}
//         onOpenChange={(event) => {
//           if (typeof event !== "boolean") {
//             handleDialogClose(event);
//           }
//         }}
//       >
//         <DialogContent className="max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Edit Assessments</DialogTitle>
//             <DialogDescription>
//               Modify the assessment questions as needed.
//             </DialogDescription>
//           </DialogHeader>
//           {dialogAssessment.map((question, questionIndex) => (
//             <div key={questionIndex} className="mb-4">
//               <div className="flex gap-2">
//                 {" "}
//                 <p className="font-semibold">Question {questionIndex + 1}</p>
//                 <Button
//                   onClick={() => handleRemoveAssessment(questionIndex)}
//                   variant="ghost"
//                   className="-pb-3"
//                 >
//                   <Trash className="h-4 w-4" />
//                 </Button>
//               </div>
//               <TextArea
//                 value={question.title}
//                 onChange={(e) =>
//                   handleDialogAssessmentChange(
//                     questionIndex,
//                     "title",
//                     e.target.value
//                   )
//                 }
//                 placeholder="Question Title"
//                 className="w-full mb-2"
//               />
//               <p className="font-semibold mt-2">Options</p>
//               {question.options.map((option, optionIndex) => (
//                 <div key={optionIndex} className="flex items-center mb-1">
//                   <span className="mr-2">
//                     {String.fromCharCode(65 + optionIndex)}.
//                   </span>
//                   <Input
//                     type="text"
//                     value={option}
//                     onChange={(e) =>
//                       handleDialogAssessmentChange(
//                         questionIndex,
//                         "options",
//                         e.target.value,
//                         optionIndex
//                       )
//                     }
//                     placeholder={`Option ${String.fromCharCode(
//                       65 + optionIndex
//                     )}`}
//                     className="w-full"
//                   />
//                 </div>
//               ))}
//             </div>
//           ))}
//           <Button
//             onClick={handleAddAssessment}
//             variant="ghost"
//             className="w-full flex justify-center items-center gap-2 mt-4"
//           >
//             <Plus className="h-4 w-4" />
//             Add Question
//           </Button>
//           <div className="flex justify-end mt-4 gap-2">
//             <Button
//               variant="outline"
//               onClick={(event) => handleDialogClose(event)}
//             >
//               Cancel
//             </Button>
//             <Button onClick={(event) => handleDialogSave(event)}>Save</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export { parseOutlines, OutlineInputs };

import * as React from "react";
import { useState, useEffect } from "react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { generateOutlineQuestion } from "../../../api/assignment";
import { TextArea } from "../../../components/ui/TextArea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/Dialogue";
import { Edit, Trash, Plus } from "lucide-react";

export interface QuestionOption {
  [key: string]: string;
}

export interface Question {
  question: string;
  options: QuestionOption;
}

export interface AssessmentQuestion {
  title: string;
  options: string[];
}

export interface OutlineItem {
  title: string;
  items?: string[];
  assessment?: AssessmentQuestion[];
}

interface OutlineInputsProps {
  initialOutlines: OutlineItem[];
  grade: string;
  onOutlinesChange: (updatedOutlines: OutlineItem[]) => void;
  onSelectedOutlinesChange: (selectedOutlines: OutlineItem[]) => void;
  onGenerateMoreOutlines: () => void;
  savedSelectedOutlines?: OutlineItem[];
}

export const parseOutlines = (responseTextArray: string[]): OutlineItem[] => {
  if (!Array.isArray(responseTextArray)) return [];
  const outlines: OutlineItem[] = [];
  const text = responseTextArray.join("\n\n");
  const blocks = text.split("\n\n");

  blocks.forEach((block) => {
    const lines = block.trim().split("\n");
    const titleLine = lines.shift()?.trim();
    if (titleLine) {
      outlines.push({
        title: titleLine,
        items: lines.filter(Boolean).map((line) => line.trim()),
      });
    }
  });

  return outlines;
};

const OutlineInputs: React.FC<OutlineInputsProps> = ({
  initialOutlines,
  grade,
  onOutlinesChange,
  onSelectedOutlinesChange,
  onGenerateMoreOutlines,
  savedSelectedOutlines,
}) => {
  const [outlines, setOutlines] = useState<OutlineItem[]>(initialOutlines);
  const [loading, setLoading] = useState<number | null>(null);
  const [questions, setQuestions] = useState<{
    [key: number]: AssessmentQuestion[];
  }>({});
  const [selectedOutlinesIndices, setSelectedOutlinesIndices] = useState<
    number[]
  >([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAssessment, setDialogAssessment] = useState<
    AssessmentQuestion[]
  >([]);
  const [dialogIndex, setDialogIndex] = useState<number | null>(null);

  useEffect(() => {
    if (
      savedSelectedOutlines &&
      savedSelectedOutlines.length > 0 &&
      outlines.length > 0
    ) {
      const restoredIndices = outlines
        .map((outline, index) =>
          savedSelectedOutlines.some((sel) => sel.title === outline.title)
            ? index
            : null
        )
        .filter((i): i is number => i !== null);

      setSelectedOutlinesIndices(restoredIndices);
    }
  }, [savedSelectedOutlines, outlines]);

  // ✅ Persist selected outlines in parent whenever indices or outlines change
  useEffect(() => {
    const selectedData = selectedOutlinesIndices
      .map((i) => outlines[i])
      .filter(Boolean);
    onSelectedOutlinesChange(selectedData);
  }, [selectedOutlinesIndices, outlines, onSelectedOutlinesChange]);

  // ✅ Keep outlines in sync with parent only when necessary
  useEffect(() => {
    const outlinesChanged =
      JSON.stringify(outlines) !== JSON.stringify(initialOutlines);

    if (outlinesChanged) {
      // Update parent if outlines changed locally
      if (outlines && outlines.length > 0) {
        onOutlinesChange(outlines);
      }
    } else {
      // Update local state if parent sent truly new outlines
      if (JSON.stringify(initialOutlines) !== JSON.stringify(outlines)) {
        setOutlines(initialOutlines);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialOutlines), JSON.stringify(outlines)]);

  const generateAssessment = async (index: number, title: string) => {
    setLoading(index);
    try {
      const responseData = await generateOutlineQuestion(title, grade);
      if (responseData.status !== "success" || !responseData.data)
        throw new Error("Unexpected response from API");

      const questionData: Question[] = responseData.data;
      const assessment = questionData.map((q) => ({
        title: q.question,
        options: Object.values(q.options),
      }));

      setQuestions((prev) => ({ ...prev, [index]: assessment }));
      setOutlines((prev) =>
        prev.map((outline, i) =>
          i === index ? { ...outline, assessment } : outline
        )
      );
    } catch (err: any) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const handleTitleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newOutlines = outlines.map((o, i) =>
      i === index ? { ...o, title: event.target.value } : o
    );
    setOutlines(newOutlines);
  };

  const addOutline = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newOutline: OutlineItem = { title: "", items: [], assessment: [] };
    setOutlines((prev) => [...prev, newOutline]);
  };

  const handleSelectOutline = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setSelectedOutlinesIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleDialogOpen = (
    index: number,
    assessment: AssessmentQuestion[] | undefined,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    e?.preventDefault();
    setDialogAssessment(assessment || []);
    setDialogIndex(index);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogIndex(null);
    setDialogAssessment([]);
  };

  const handleDialogSave = () => {
    if (dialogIndex === null) return;

    const newOutlines = outlines.map((o, i) =>
      i === dialogIndex ? { ...o, assessment: dialogAssessment } : o
    );

    setOutlines(newOutlines); // updates local state
    onOutlinesChange(newOutlines); // pushes to parent immediately

    const selectedData = selectedOutlinesIndices
      .map((i) => newOutlines[i])
      .filter(Boolean);
    onSelectedOutlinesChange(selectedData);

    handleDialogClose();
  };

  const handleDialogAssessmentChange = (
    qIndex: number,
    field: "title" | "options",
    value: string,
    optIndex?: number
  ) => {
    setDialogAssessment((prev) => {
      const updated = [...prev];
      if (field === "title") updated[qIndex].title = value;
      else if (field === "options" && optIndex !== undefined)
        updated[qIndex].options[optIndex] = value;
      return updated;
    });
  };

  const handleAddAssessment = () => {
    setDialogAssessment((prev) => [
      ...prev,
      { title: "", options: ["", "", "", ""] },
    ]);
  };

  const handleRemoveAssessment = (qIndex: number) => {
    setDialogAssessment((prev) => prev.filter((_, index) => index !== qIndex));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {outlines.map((outline, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg bg-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {!selectedOutlinesIndices.includes(i) && (
              <Button
                onClick={(e) => handleSelectOutline(i, e)}
                variant="outline"
                className="px-4 py-2 rounded-full text-sm md:text-base"
              >
                Add
              </Button>
            )}

            <Input
              type="text"
              value={outline.title}
              onChange={(e) => handleTitleChange(i, e)}
              placeholder="Outline Title"
              className="flex-1 border rounded-lg p-2 text-sm md:text-base"
            />

            <Button
              onClick={(e) => handleDialogOpen(i, outline.assessment, e)}
              variant="ghost"
              className="p-2 sm:p-3 md:p-4 flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View Assessment</span>
            </Button>

            <button
              onClick={() => generateAssessment(i, outline.title)}
              className="bg-[#6200EE] text-white px-4 py-2 rounded-lg text-sm md:text-base transition disabled:opacity-50"
              disabled={loading === i}
            >
              {loading === i ? "Generating..." : "Generate Assessment"}
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={addOutline}
          className="w-full md:w-auto rounded-lg px-6 py-2 bg-[#6200EE] text-white"
        >
          Add Outline
        </button>

        <button
          onClick={onGenerateMoreOutlines}
          className="w-full md:w-auto rounded-lg px-6 bg-gray-300"
        >
          Generate More Outlines
        </button>
      </div>

      {/* Dialog for editing assessments */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Assessments</DialogTitle>
            <DialogDescription>
              Modify the assessment questions as needed.
            </DialogDescription>
          </DialogHeader>

          {dialogAssessment.map((q, qIndex) => (
            <div key={qIndex} className="mb-4">
              <div className="flex gap-2 items-center">
                <p className="font-semibold">Question {qIndex + 1}</p>
                <Button
                  onClick={() => handleRemoveAssessment(qIndex)}
                  variant="ghost"
                  className="-pb-3"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <TextArea
                value={q.title}
                onChange={(e) =>
                  handleDialogAssessmentChange(qIndex, "title", e.target.value)
                }
                placeholder="Question Title"
                className="w-full mb-2"
              />
              <p className="font-semibold mt-2">Options</p>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center mb-1">
                  <span className="mr-2">
                    {String.fromCharCode(65 + optIndex)}.
                  </span>
                  <Input
                    type="text"
                    value={opt}
                    onChange={(e) =>
                      handleDialogAssessmentChange(
                        qIndex,
                        "options",
                        e.target.value,
                        optIndex
                      )
                    }
                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          ))}

          <Button
            onClick={handleAddAssessment}
            variant="ghost"
            className="w-full flex justify-center items-center gap-2 mt-4"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>

          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleDialogSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { OutlineInputs };
