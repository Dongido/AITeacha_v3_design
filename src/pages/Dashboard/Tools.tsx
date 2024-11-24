import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTools } from "../../store/slices/toolsSlice";
import { RootState, AppDispatch } from "../../store";
import { FaHeart } from "react-icons/fa";
import { Skeleton } from "../../components/ui/Skeleton";
import { Link } from "react-router-dom";

const Tools = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tools, loading, error } = useSelector(
    (state: RootState) => state.tools
  );

  useEffect(() => {
    if (tools.length === 0) {
      dispatch(loadTools());
    }
  }, [dispatch, tools.length]);

  return (
    <div className="mt-12 px-4">
      <h2 className="text-xl font-medium text-gray-900 mb-4">
        Welcome Back! 👋 Here are your tools to enhance your teaching experience
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-md" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
          {tools.map((tool) => (
            <Link
              to={`/dashboard/tools/${tool.slug}`}
              key={tool.id}
              className="flex items-center border border-gray-300 px-4 py-3 rounded-3xl bg-white hover:bg-gray-50 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
            >
              <div className="text-primary text-2xl mr-4">
                {tool.thumbnail ? (
                  <img
                    src={
                      tool.thumbnail.startsWith("http")
                        ? tool.thumbnail
                        : `https://${tool.thumbnail}`
                    }
                    alt={tool.name || "Tool Thumbnail"}
                    className="w-8 h-8 object-cover"
                  />
                ) : (
                  <FaHeart className="text-purple-500" />
                )}
              </div>

              <div className="text-left">
                <h3 className="text-base capitalize font-semibold text-gray-900">
                  {tool.name === "math calculator" ? "Solver" : tool.name}
                </h3>
                {tool.description.charAt(0).toUpperCase() +
                  tool.description.slice(1)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tools;
