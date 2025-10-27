import React, { useState, useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

interface UploadPictureProps {
  onFileChange: (file: File | null) => void;
}

const UploadPicture: React.FC<UploadPictureProps> = ({ onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);

      const newPreviewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(newPreviewUrl);

      onFileChange(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    onFileChange(null);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <label
        htmlFor="upload-picture"
        className="cursor-pointer flex  items-center justify-center w-32 bg-white b border-gray-300  hover:bg-gray-100 transition relative"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <>
            <FaCloudUploadAlt
              className="text-gray-500 mx-auto text-3xl hover:text-blue-500 transition"
              onClick={(e) => {
                e.preventDefault();
                handleBrowseClick();
              }}
            />
            <p className="text-sm text-center text-gray-500">
              Browse Picture
            </p>
          </>
        )}

        <input
          ref={fileInputRef}
          id="upload-picture"
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {file && (
          <FaCloudUploadAlt
            className="text-red-500 cursor-pointer absolute top-12 -right-8"
            onClick={handleRemoveFile}
          />
        )}
      </label>
    </div>
  );
};

export default UploadPicture;
