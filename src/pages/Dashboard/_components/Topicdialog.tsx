import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Button } from "../../../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/Dialogue";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";

interface CreateTopicDialogProps {
  onCreate: (
    topic: string,
    category: string,
    description: string,
    thumbnail?: File | null
  ) => void;
  loading: boolean;
}

const CreateTopicDialog = forwardRef(
  ({ onCreate, loading }: CreateTopicDialogProps, ref) => {
    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<
      "default" | "destructive"
    >("default");


    console.log("thumb", thumbnail)
    useImperativeHandle(ref, () => ({
      openDialog: () => setOpen(true),
    }));

    const handleSubmit = () => {
      if (!selectedCategory) {
        showToast("Please select a category.", "destructive");
        return;
      }

      if (!topic.trim()) {
        showToast("Topic name cannot be empty.", "destructive");
        return;
      }

      if (description.trim().length < 50) {
        showToast("Description must be at least 50 characters long.", "destructive");
        return;
      }
      

      onCreate(topic.trim(), selectedCategory, description.trim(), thumbnail);
      showToast("Topic created successfully!", "default");
      resetForm();
    };

    const showToast = (msg: string, variant: "default" | "destructive") => {
      setToastMessage(msg);
      setToastVariant(variant);
      setToastOpen(true);
    };

    const resetForm = () => {
      setOpen(false);
      setTopic("");
      setSelectedCategory("");
      setDescription("");
      setThumbnail(null);
      setPreviewURL(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setThumbnail(file);
        setPreviewURL(URL.createObjectURL(file));
      }
    };

    const categories = [
      "General Discussions",
      "Exam Timetables",
      "Events & Activities",
      "Public Holidays",
      "Results & Reports",
      "School Fees",
      "Discipline & Conduct",
      "Academic Calendar",
    ];

    return (
      <ToastProvider>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto text-gray-800">
            <DialogHeader>
              <DialogTitle>Create New Topic</DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700"
                >
                  <option value="">Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. WAEC 2025 Schedule"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type detailed description..."
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-700"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 50 characters. ({description.length}/50)
                </p>
              </div>

              <div>
                <Label className="text-purple-700 font-semibold" htmlFor="thumbnail">
                  Upload Thumbnail
                </Label>

                <label
                  htmlFor="thumbnail"
                  className="mt-2 flex items-center justify-center w-full h-20 border-2 border-dashed border-purple-400 rounded-md cursor-pointer bg-purple-50 hover:bg-purple-100 transition"
                >
                  <div className="text-center text-sm text-purple-700 font-medium">
                    Click to select image
                  </div>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {previewURL && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Preview:</p>
                    <img
                      src={previewURL}
                      alt="Preview"
                      className="w-24 h-16 object-cover rounded border border-purple-300"
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                variant="gradient"
                onClick={handleSubmit}
                className="rounded-md"
                disabled={loading}
              >
                {loading ? <>Loading...</> : <>Create</>}
              </Button>
              <Button variant="default" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toast open={toastOpen} onOpenChange={setToastOpen} variant={toastVariant}>
          <ToastTitle>{toastMessage}</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
  }
);

export default CreateTopicDialog;
