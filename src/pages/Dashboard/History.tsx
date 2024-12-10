import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { loadUserResourceById } from "../../store/slices/resourcesSlice";
import { Skeleton } from "../../components/ui/Skeleton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const HistoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedResource, loading, error } = useSelector(
    (state: RootState) => state.resources
  );

  useEffect(() => {
    if (id) {
      dispatch(loadUserResourceById(id));
    }
  }, [dispatch, id]);

  if (loading)
    return (
      <div className="mt-6">
        <Skeleton className="h-64 w-full mx-auto rounded-lg" />
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-xl font-semibold">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100  items-center justify-center py-6">
      {selectedResource ? (
        <>
          <h1 className="text-3xl capitalize font-bold text-primary mb-2">
            {selectedResource.category}
          </h1>
          <p className="text-gray-800 text-lg mb-4">
            <span className="font-semibold">Prompt:</span>{" "}
            {selectedResource.prompt}
          </p>
          <div className="bg-white   p-6 w-full">
            <p className="text-gray-800 mb-6 ">
              <span className="font-bold text-lg">AI Response:</span> <br />
              <ReactMarkdown
                className="w-full rounded-md resize-none markdown overflow-auto"
                remarkPlugins={[remarkGfm]}
              >
                {selectedResource.returned_answer}
              </ReactMarkdown>
            </p>

            <p className="text-gray-500 text-sm">
              <strong>Created at:</strong>{" "}
              {new Date(selectedResource.created_at).toLocaleString()}
            </p>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600 text-xl font-medium">
          No resource found
        </div>
      )}
    </div>
  );
};

export default HistoryDetail;
