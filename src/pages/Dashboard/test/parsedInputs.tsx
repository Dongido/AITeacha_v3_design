import React, { useState, useEffect } from "react";
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
  DialogTrigger,
} from "../../../components/ui/Dialogue";
import { Edit, Trash, Plus, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Label } from "../../../components/ui/Label";

export interface QuestionOption {
  [key: string]: string;
}

export interface GeneratedQuestion {
  question: string;
  options: QuestionOption;
}

export interface EditableQuestion {
  title: string;
  options: string[];
  correctOption?: string;
  mark?: number;
}

interface QuestionInputsProps {
  initialQuestions: EditableQuestion[];
  grade: string;
  onQuestionsChange: (updatedQuestions: EditableQuestion[]) => void;
  onGenerateMoreQuestions: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isGeneratingMore: boolean;
}

const QuestionInputs = ({
  initialQuestions,
  grade,
  onQuestionsChange,
  onGenerateMoreQuestions,
  isGeneratingMore,
}: QuestionInputsProps) => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [loading, setLoading] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogQuestion, setDialogQuestion] = useState<EditableQuestion>({
    title: "",
    options: ["", "", "", ""],
    correctOption: undefined,
    mark: 1,
  });
  const [dialogIndex, setDialogIndex] = useState<number | null>(null);

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const handleQuestionTitleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = questions.map((question, i) =>
      i === index ? { ...question, title: event.target.value } : question
    );
    setQuestions(newQuestions);
    onQuestionsChange(newQuestions);
  };

  const addQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newQuestion: EditableQuestion = {
      title: "",
      options: ["", "", "", ""],
      correctOption: undefined,
      mark: 1,
    };
    const newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    onQuestionsChange(newQuestions);
  };

  const removeQuestion = (
    index: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    onQuestionsChange(newQuestions);
  };

  const handleDialogOpen = (
    index: number,
    question: EditableQuestion,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (event) {
      event.preventDefault();
    }
    setDialogQuestion(question);
    setDialogIndex(index);
    setDialogOpen(true);
  };

  const handleDialogClose = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault();
    }
    setDialogOpen(false);
    setDialogIndex(null);
    setDialogQuestion({
      title: "",
      options: ["", "", "", ""],
      correctOption: undefined,
      mark: 1,
    });
  };

  const handleDialogSave = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault();
    }
    if (dialogIndex !== null) {
      const newQuestions = questions.map((q, i) =>
        i === dialogIndex ? dialogQuestion : q
      );
      setQuestions(newQuestions);
      onQuestionsChange(newQuestions);
    }
    handleDialogClose();
  };

  const handleDialogQuestionChange = (
    field: "title" | "options" | "correctOption" | "mark",
    value: string,
    optionIndex?: number
  ) => {
    setDialogQuestion((prevQuestion) => {
      const newQuestion = { ...prevQuestion };
      if (field === "title") {
        newQuestion.title = value;
      } else if (field === "options" && optionIndex !== undefined) {
        newQuestion.options = newQuestion.options.map((opt, j) =>
          j === optionIndex ? value : opt
        );
      } else if (field === "correctOption") {
        newQuestion.correctOption = value;
      }
      return newQuestion;
    });
  };

  const handleAddOption = () => {
    setDialogQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: [...prevQuestion.options, ""],
    }));
  };

  const handleRemoveOption = (optionIndex: number) => {
    setDialogQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: prevQuestion.options.filter((_, index) => index !== optionIndex),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {questions.map((question, questionIndex) => (
          <div
            key={questionIndex}
            className="p-4 border rounded-lg bg-white shadow-sm flex flex-col md:flex-row md:items-start md:justify-between gap-4"
          >
            <div className="flex-1 space-y-2">
              <Input
                type="text"
                value={question.title}
                onChange={(e) => handleQuestionTitleChange(questionIndex, e)}
                placeholder={`Question ${questionIndex + 1} Title`}
                className="border rounded-lg p-2 text-sm md:text-base w-full"
              />
              <Label className="text-gray-700 mt-4">Mark Allocated</Label>
              <Input
                type="number"
                placeholder="Mark Allocated"
                min={1}
                value={dialogQuestion.mark}
                onChange={(e) =>
                  handleDialogQuestionChange("mark", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col md:items-end gap-2">
              <Button
                onClick={(event) =>
                  handleDialogOpen(questionIndex, question, event)
                }
                variant="ghost"
                className="p-2 sm:p-3 md:p-4 flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Edit</span>
                <span className="sr-only">Edit</span>
              </Button>

              <Button
                onClick={(event) => removeQuestion(questionIndex, event)}
                variant="ghost"
                className="p-2 sm:p-3 md:p-4"
              >
                <Trash className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Delete</span>
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={addQuestion}
          className="w-full md:w-auto rounded-lg px-6"
          variant="gradient"
        >
          Add Question
        </Button>
        {questions.length > 0 && (
          <Button
            onClick={onGenerateMoreQuestions}
            variant="outline"
            className="w-full md:w-auto rounded-lg px-6 bg-gray-300"
            disabled={isGeneratingMore}
          >
            {isGeneratingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate More Questions"
            )}
          </Button>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Modify the question and its options.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4 space-y-4">
            <TextArea
              value={dialogQuestion.title}
              onChange={(e) =>
                handleDialogQuestionChange("title", e.target.value)
              }
              placeholder="Question Title"
              className="w-full"
            />
            <Label className="text-gray-700 mt-4">Mark Allocated</Label>
            <Input
              type="number"
              placeholder="Mark allocated"
              min={1}
              value={dialogQuestion.mark}
              onChange={(e) =>
                handleDialogQuestionChange("mark", e.target.value)
              }
            />
            <p className="font-semibold">Options</p>
            {dialogQuestion.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center">
                <span className="mr-2">
                  {String.fromCharCode(65 + optionIndex)}.
                </span>
                <Input
                  type="text"
                  value={option}
                  onChange={(e) =>
                    handleDialogQuestionChange(
                      "options",
                      e.target.value,
                      optionIndex
                    )
                  }
                  placeholder={`Option ${String.fromCharCode(
                    65 + optionIndex
                  )}`}
                  className="w-full"
                />

                {dialogQuestion.options.length > 2 && (
                  <Button
                    onClick={() => handleRemoveOption(optionIndex)}
                    variant="ghost"
                    className="ml-2"
                    size="icon"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove Option</span>
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={handleAddOption}
              variant="ghost"
              className="w-full flex justify-center items-center gap-2 mt-2"
            >
              <Plus className="h-4 w-4" />
              Add Option
            </Button>
            <div className="mt-4">
              <label className="text-sm font-semibold block mb-2">
                Correct Answer:
              </label>
              <div className="flex items-center space-x-2">
                {dialogQuestion.options.map((_, optionIndex) => (
                  <div
                    key={`dialog-correct-${optionIndex}`}
                    className="flex items-center"
                  >
                    <input
                      type="radio"
                      name="dialogCorrectOption"
                      value={String.fromCharCode(65 + optionIndex)}
                      id={`dialog-option-${optionIndex}`}
                      checked={
                        dialogQuestion.correctOption ===
                        String.fromCharCode(65 + optionIndex)
                      }
                      onChange={(e) =>
                        handleDialogQuestionChange(
                          "correctOption",
                          e.target.value
                        )
                      }
                      className="aspect-square h-4 w-4 border border-primary text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <label
                      htmlFor={`dialog-option-${optionIndex}`}
                      className="ml-1 text-sm"
                    >
                      {String.fromCharCode(65 + optionIndex)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

export { QuestionInputs };
