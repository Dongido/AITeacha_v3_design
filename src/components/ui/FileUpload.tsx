import React, { useState, useRef } from "react";
import { Button } from "./Button";
import { IoCloseOutline } from "react-icons/io5";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  onlyDocuments?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  multiple = false,
  maxFiles = 10,
  onlyDocuments = false,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const validTypes = onlyDocuments
      ? [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]
      : ["image/jpeg", "image/png", "application/pdf"];
    const newFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    for (const selectedFile of selectedFiles) {
      if (!validTypes.includes(selectedFile.type)) {
        alert(
          `File "${selectedFile.name}" is not a valid ${
            onlyDocuments ? "PDF or Word" : "image or PDF"
          } file.`
        );
        continue;
      }
      newFiles.push(selectedFile);
      newPreviewUrls.push(URL.createObjectURL(selectedFile));
    }

    if (multiple && files.length + newFiles.length > maxFiles) {
      alert(`You can upload a maximum of ${maxFiles} files.`);
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    onFilesChange([...files, ...newFiles]);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    const updatedPreviewUrls = previewUrls.filter(
      (_, index) => index !== indexToRemove
    );
    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviewUrls);
    onFilesChange(updatedFiles);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const acceptedFileTypes = onlyDocuments
    ? ".pdf, .doc, .docx"
    : "image/*, .pdf";

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
          <p className="text-xs mt-1">Accepts: {acceptedFileTypes}</p>
        </div>
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept={acceptedFileTypes}
          multiple={multiple} // Enable multiple selection based on prop
        />
      </label>

      {files.length > 0 && (
        <div className="w-full mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="items-center space">
              {file.type.startsWith("image/") && previewUrls[index] ? (
                <img
                  src={previewUrls[index]}
                  alt={`Preview ${index}`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <p className="text-gray-500 block">
                  {file.type === "application/pdf"
                    ? "PDF ready to be uploaded"
                    : file.type === "application/msword" ||
                      file.type ===
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ? "Word document ready to be uploaded"
                    : "File ready to be uploaded"}
                </p>
              )}
              <div className="flex items-center bg-white p-3 justify-between">
                <p className="text-gray-700 font-semibold m-0">{file.name}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveFile(index);
                  }}
                  className="text-red-500 flex gap-1 font-semibold items-center "
                >
                  <IoCloseOutline />
                  <span>
                    remove
                  </span>
                </button>
              </div>
            </div>
          ))}

          {multiple && files.length >= maxFiles && (
            <p className="text-yellow-500 text-sm mt-2">
              Maximum of {maxFiles} files uploaded.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
