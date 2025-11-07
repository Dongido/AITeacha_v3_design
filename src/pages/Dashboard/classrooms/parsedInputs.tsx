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

/* -------------------------  PARSE OUTLINES UTILITY  ------------------------- */
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

/* -----------------------------  MAIN COMPONENT  ----------------------------- */
const OutlineInputs: React.FC<OutlineInputsProps> = ({
  initialOutlines,
  grade,
  onOutlinesChange,
  onSelectedOutlinesChange,
  onGenerateMoreOutlines,
  savedSelectedOutlines = [],
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

  /* --------------------------- RESTORE SAVED SELECTIONS -------------------------- */
  useEffect(() => {
    if (savedSelectedOutlines.length > 0 && outlines.length > 0) {
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

  /* --------------------------- SYNC SELECTED OUTLINES --------------------------- */
  useEffect(() => {
    const selectedData = selectedOutlinesIndices
      .map((i) => outlines[i])
      .filter(Boolean);
    onSelectedOutlinesChange(selectedData);
  }, [selectedOutlinesIndices, outlines, onSelectedOutlinesChange]);

  /* ----------------------------- SYNC OUTLINES STATE ---------------------------- */
  useEffect(() => {
    const outlinesChanged =
      JSON.stringify(outlines) !== JSON.stringify(initialOutlines);
    if (outlinesChanged) onOutlinesChange(outlines);
  }, [outlines, initialOutlines, onOutlinesChange]);

  /* ------------------------------ GENERATE QUESTIONS ----------------------------- */
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
      console.error("Error generating assessment:", err);
      alert(err.message);
    } finally {
      setLoading(null);
    }
  };

  /* ------------------------------- EDIT TITLE FIELD ------------------------------ */
  const handleTitleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const newOutlines = outlines.map((o, i) =>
      i === index ? { ...o, title: event.target.value } : o
    );
    setOutlines(newOutlines);
  };

  /* ------------------------------- ADD NEW OUTLINE ------------------------------- */
  const addOutline = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newOutline: OutlineItem = { title: "", items: [], assessment: [] };
    setOutlines((prev) => [...prev, newOutline]);
  };

  /* ------------------------------ SELECT/UNSELECT ------------------------------ */
  const handleSelectOutline = (
    index: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setSelectedOutlinesIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  /* ------------------------------- OPEN DIALOG -------------------------------- */
  const handleDialogOpen = (
    index: number,
    assessment: AssessmentQuestion[] | undefined,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (event) event.preventDefault();
    setDialogAssessment(
      Array.isArray(assessment) && assessment.length > 0
        ? assessment
        : [{ title: "", options: ["", "", "", ""] }]
    );
    setDialogIndex(index);
    setDialogOpen(true);
  };

  /* ------------------------------- CLOSE DIALOG ------------------------------- */
  const handleDialogClose = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event) event.preventDefault();
    setDialogOpen(false);
    setDialogIndex(null);
    setDialogAssessment([]);
  };

  /* ------------------------------- SAVE DIALOG -------------------------------- */
  const handleDialogSave = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event) event.preventDefault();
    if (dialogIndex === null) return;

    const newOutlines = outlines.map((o, i) =>
      i === dialogIndex ? { ...o, assessment: dialogAssessment } : o
    );

    setOutlines(newOutlines);
    onOutlinesChange(newOutlines);

    const selectedData = selectedOutlinesIndices
      .map((i) => newOutlines[i])
      .filter(Boolean);
    onSelectedOutlinesChange(selectedData);

    handleDialogClose();
  };

  /* ------------------------- HANDLE ASSESSMENT EDIT ------------------------- */
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

  const handleAddAssessment = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event) event.preventDefault();
    setDialogAssessment((prev) => [
      ...prev,
      { title: "", options: ["", "", "", ""] },
    ]);
  };

  const handleRemoveAssessment = (
    qIndex: number,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (event) event.preventDefault();
    setDialogAssessment((prev) => prev.filter((_, index) => index !== qIndex));
  };

  /* ------------------------------ RENDER SECTION ------------------------------ */
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

      {/* ---------------------------- ASSESSMENT DIALOG ---------------------------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* Overlay */}
        {dialogOpen && (
          <div
            className="fixed inset-0 top-0 bg-black/40 backdrop-blur-sm z-[99999] transition-opacity duration-200"
            aria-hidden="true"
          />
        )}

        {/* Dialog content */}
        <DialogContent
          className="fixed z-[100000] bg-white rounded-xl shadow-lg p-6 max-h-[80vh] overflow-y-auto w-[90%] sm:w-[600px] mx-auto"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Edit Assessments
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Modify or add assessment questions below.
            </DialogDescription>
          </DialogHeader>

          {/* Assessment questions list */}
          {dialogAssessment.map((q, qIndex) => (
            <div key={qIndex} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-800">
                  Question {qIndex + 1}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAssessment(qIndex)}
                >
                  <Trash className="h-4 w-4 text-red-600" />
                </Button>
              </div>

              <TextArea
                value={q.title}
                onChange={(e) =>
                  handleDialogAssessmentChange(qIndex, "title", e.target.value)
                }
                placeholder="Question Title"
                className="w-full mb-3"
              />

              <p className="font-semibold text-gray-700 mb-1">Options</p>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center mb-2">
                  <span className="mr-2 text-sm text-gray-600">
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

          {/* Add Question Button */}
          <Button
            onClick={handleAddAssessment}
            variant="ghost"
            className="w-full flex justify-center items-center gap-2 border border-gray-300 text-gray-700"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>

          {/* Footer Buttons */}
          <div className="flex justify-end mt-6 gap-3">
            <Button
              variant="outline"
              onClick={handleDialogClose}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <button
              onClick={handleDialogSave}
              className="bg-[#6200EE] text-white hover:bg-[#4e00c8] px-4 py-2 rounded-full transition"
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { OutlineInputs };
