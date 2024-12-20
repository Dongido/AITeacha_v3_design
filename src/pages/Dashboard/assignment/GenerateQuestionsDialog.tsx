import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/Dialogue";
import { Button } from "../../../components/ui/Button";
import { generateQuestion } from "../../../api/assignment";

interface GenerateQuestionsDialogProps {
  classroomId: string | number;
  grade: string;
  description: string;
  onQuestionsGenerated: (questions: { assignment_question: string }[]) => void;
}

const GenerateQuestionsDialog: React.FC<GenerateQuestionsDialogProps> = ({
  classroomId,
  description,
  grade,
  onQuestionsGenerated,
}) => {
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<
    { assignment_question: string }[]
  >([]);

  const handleDialogOpen = async () => {
    if (!classroomId || !description) return;
    setLoading(true);
    try {
      const data = await generateQuestion(description, grade);
      console.log(data);
      //setGeneratedQuestions(data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(isOpen) => isOpen && handleDialogOpen()}>
      <DialogTrigger asChild>
        <Button className="rounded-md bg-gray-800 text-white">
          Generate AI Questions
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generated Questions</DialogTitle>
          <DialogDescription>
            AI-generated questions based on your classroom and description.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="list-disc pl-6">
              {generatedQuestions.map((q, index) => (
                <li key={index} className="text-gray-700">
                  {q.assignment_question}
                </li>
              ))}
            </ul>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="gradient"
            className="rounded-md"
            onClick={() => onQuestionsGenerated(generatedQuestions)}
            disabled={loading}
          >
            Use Questions
          </Button>
          <DialogClose asChild>
            <Button variant="default">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateQuestionsDialog;
