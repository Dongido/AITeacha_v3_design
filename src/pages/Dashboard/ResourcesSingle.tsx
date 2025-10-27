import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { loadUserResourceById } from "../../store/slices/teamResourcesSlice";
import { Skeleton } from "../../components/ui/Skeleton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownRenderer from "./_components/MarkdownRenderer";
import { Button } from "../../components/ui/Button";
import { Undo2 } from "lucide-react";
import { IoChevronBackOutline } from "react-icons/io5";

const ResourceSingle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedResource, loading, error } = useSelector(
    (state: RootState) => state.teamResources
  );


  const navigate = useNavigate()

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
    <div className="min-h-screen  p-[30px] items-center justify-center py-6">
      {selectedResource ? (
        <>
          <h1 className="text-3xl capitalize font-bold text-primary mb-2">
            {selectedResource.category}
          </h1>
          {/* Back Button */}
                <button
                  onClick={() => navigate(-1)}
                  // variant="outline"
                  className="flex items-center gap-2  mb-[40px] font-semibold w-full sm:w-fit  text-gray-700"
                >
                  <IoChevronBackOutline size={18} />
                  Back
                </button>
          <div className="bg-purple-50   p-6 w-full">
            <p className="text-gray-800 mb-6 ">
              <span className="font-bold mb-3 block text-lg">AI Response:</span> <br />
              <MarkdownRenderer
                className="w-full rounded-md resize-none markdown overflow-auto"
                content={selectedResource.returned_answer}
              />
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

export default ResourceSingle;
