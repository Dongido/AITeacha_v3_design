import { FiX } from "react-icons/fi";

interface CallPopupProps {
  onClose: () => void;
  isSpeaking: boolean;
  isVoiceRecording: boolean;
  remainingTime: number;
}

const CallPopup: React.FC<CallPopupProps> = ({
  onClose,
  isSpeaking,
  isVoiceRecording,
  remainingTime,
}) => {
  const handleEndCallClick = () => {
    console.log("CallPopup: 'End Call' button clicked. Calling onClose...");
    onClose();
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="relative w-full  mx-auto bg-primary text-white rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col items-center justify-center space-y-6 animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-center drop-shadow-md">
          {isVoiceRecording ? "Active Voice Session" : "Connecting..."}
        </h2>
        <p className="text-lg text-center opacity-90">
          {isVoiceRecording ? "Speak now..." : "Waiting for AI connection..."}
        </p>

        <div className="text-5xl md:text-6xl font-extrabold font-mono my-2 tracking-wide drop-shadow-lg">
          {formatTime(remainingTime)}
        </div>

        <div className="w-full flex justify-center py-4">
          <div className="call-wave-animation">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="bar"
                style={{ animationDelay: `${i * 0.05}s` }}
              ></div>
            ))}
          </div>
        </div>

        {isSpeaking && (
          <div className="flex items-center space-x-2 text-lg font-medium text-blue-200">
            <div className="spinner-blue-light w-5 h-5"></div>
            <span>AI is speaking...</span>
          </div>
        )}

        <button
          onClick={handleEndCallClick}
          className="w-full md:w-auto mt-4 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <FiX className="text-xl" /> <span>End Conversation</span>
        </button>
      </div>
    </div>
  );
};

export default CallPopup;
