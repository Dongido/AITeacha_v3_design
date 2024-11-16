import React, { useState, useRef } from "react";
import { Button } from "./Button";

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    const newPreviewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);

    console.log(
      "Files selected:",
      selectedFiles.map((file) => file.name)
    );
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    console.log("File removed at index:", index);
  };

  const handleBrowseClick = () => {
    console.log("Browse Files button clicked");
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-md bg-gray-50">
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center justify-center w-full h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="text-center text-gray-500">
          {/* <p>Drag and drop files here</p>
          <p>or</p> */}
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
          multiple
        />
      </label>

      {files.length > 0 && (
        <div className="w-full mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center space-x-4">
              {file.type.startsWith("image/") && previewUrls[index] ? (
                <img
                  src={previewUrls[index]}
                  alt={`Preview ${index}`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <p className="text-gray-500">File ready to be uploaded</p>
              )}
              <p className="text-gray-700 font-semibold flex-1">{file.name}</p>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveFile(index);
                }}
                className="text-red-500"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
