import React, { useState, useRef } from "react";
import { Button } from "./Button";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(selectedFile.type)) {
      alert("Please upload a valid image or PDF file.");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    onFilesChange([selectedFile]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    onFilesChange([]);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-md bg-gray-50">
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center justify-center w-full h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="text-center text-gray-500">
          <Button
            variant="outline"
            className="mt-2 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              handleBrowseClick();
            }}
          >
            Browse Files
          </Button>
        </div>
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,application/pdf"
        />
      </label>

      {file && (
        <div className="w-full mt-4 space-y-2">
          <div className="flex items-center space-x-4">
            {file.type.startsWith("image/") && previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-500">PDF ready to be uploaded</p>
            )}
            <p className="text-gray-700 font-semibold flex-1">{file.name}</p>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                handleRemoveFile();
              }}
              className="text-red-500"
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
