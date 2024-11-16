const LoadingToolDetails = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex items-center space-x-4">
        <svg
          className="animate-spin h-10 w-10 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4zm2 5h10v2H6v-2z"
          ></path>
        </svg>
        <p className="text-lg font-medium text-gray-700">
          Loading tool details...
        </p>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Please wait while we fetch the latest information for you.
      </p>
    </div>
  );
};

export default LoadingToolDetails;
