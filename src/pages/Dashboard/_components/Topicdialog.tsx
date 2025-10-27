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
  categories: string[];
}

const CreateTopicDialog = forwardRef(
  ({ onCreate, loading, categories }: CreateTopicDialogProps, ref) => {
    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );

    console.log("thumb", thumbnail);
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
        showToast(
          "Description must be at least 50 characters long.",
          "destructive"
        );
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

    return (
      <ToastProvider>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto text-gray-800 rounded-2xl">
            <DialogHeader>
              <DialogTitle>New Chat Topic</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="category" className="font-bold mb-2">
                  Category
                </Label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border rounded-full p-2 text-gray-700 text-sm focus:outline-none focus:ring-[#C2C2C2]"
                >
                  <option value="">Select a Category</option>
                  {categories?.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="topic" className="font-bold mb-2">
                  Topic
                </Label>
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
                  className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none placeholder:text-gray-700 focus:ring-[#6200EE]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 50 characters. ({description.length}/30)
                </p>
              </div>

              <div>
                <Label
                  className="text-gray-500 font-semibold"
                  htmlFor="thumbnail"
                >
                  Upload Thumbnail
                </Label>

                <label
                  htmlFor="thumbnail"
                  className="mt-2 flex items-center justify-center w-full h-20 border-2 border-dashed border-purple-400 rounded-md cursor-pointer bg-purple-50 hover:bg-purple-100 transition"
                >
                  <div className="text-center text-sm text-black font-medium">
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
                    <p className="text-xs text-gray-600 mb-1 font-medium">
                      Preview:
                    </p>
                    <img
                      src={previewURL}
                      alt="Preview"
                      className="w-24 h-16 object-cover rounded border border-purple-300"
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6 flex gap-4">
              <button
                // variant="gradient"
                onClick={handleSubmit}
                className="rounded-full bg-[#6200EE] text-white px-4 py-2"
                disabled={loading}
              >
                {loading ? <>Loading...</> : <>Create</>}
              </button>
              <button
                // variant="default"
                onClick={() => setOpen(false)}
                className="text-[#6200EE]"
              >
                Cancel
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toast
          open={toastOpen}
          onOpenChange={setToastOpen}
          variant={toastVariant}
        >
          <ToastTitle>{toastMessage}</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
  }
);

export default CreateTopicDialog;
