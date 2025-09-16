import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "../../../../components/ui/Button";


type LaunchClassModalProps = {
  onConfirm: (selected: string) => void;
};

const LaunchClassModal = forwardRef(({ onConfirm }: LaunchClassModalProps, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Mid Term Test");

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  const handleConfirm = () => {
    onConfirm(selectedOption);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-lg font-semibold mb-4">Launch Classroom</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Type
        </label>
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="w-full p-2 border rounded-md mb-6"
        >
          <option>Mid Term Test</option>
          <option>CA</option>
          <option>Assessment</option>
        </select>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-blue-600 text-white">
            Launch
          </Button>
        </div>
      </div>
    </div>
  );
});

export default LaunchClassModal;
