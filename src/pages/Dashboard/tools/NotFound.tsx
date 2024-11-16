import React from "react";
import { Button } from "../../../components/ui/Button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Tool Not Found
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Sorry, we couldn't find the tool you're looking for.
        </p>
        <Button
          onClick={() => window.history.back()}
          variant={"gradient"}
          className="text-white font-medium py-2 px-4 rounded-md shadow-lg transition duration-300"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
