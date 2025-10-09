import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { FileText, Layout, ClipboardList } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
            Result Template Samples
          </h1>
          <p className="text-gray-600 text-lg">
            Choose any result template design — suitable for all classes
          </p>
        </div>

        {/* Template Cards */}
        <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {/* Classic Template */}
          <div className="group bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-400 transition duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition">
                <FileText className="w-8 h-8 text-blue-700" />
              </div>
              <h2 className="text-2xl font-semibold text-blue-800 mb-2">
                Classic Template
              </h2>
              <p className="text-gray-600 mb-4">
                Simple and clean layout with school header and score tables.
              </p>
              <Link to="/dashboard/primary" className="w-full">
                <Button className="w-full bg-blue-700 hover:bg-blue-800">
                  View Template
                </Button>
              </Link>
            </div>
          </div>

          {/* Modern Template */}
          <div className="group bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-green-400 transition duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition">
                <Layout className="w-8 h-8 text-green-700" />
              </div>
              <h2 className="text-2xl font-semibold text-green-800 mb-2">
                Modern Template
              </h2>
              <p className="text-gray-600 mb-4">
                Professional layout with a modern touch and clear structure.
              </p>
              <Link to="/dashboard/junior" className="w-full">
                <Button className="w-full bg-green-700 hover:bg-green-800">
                  View Template
                </Button>
              </Link>
            </div>
          </div>

          {/* Elegant Template */}
          <div className="group bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-purple-400 transition duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4 group-hover:bg-purple-200 transition">
                <ClipboardList className="w-8 h-8 text-purple-700" />
              </div>
              <h2 className="text-2xl font-semibold text-purple-800 mb-2">
                Elegant Template
              </h2>
              <p className="text-gray-600 mb-4">
                Beautifully structured with soft colors and academic design.
              </p>
              <Link to="/dashboard/secondary" className="w-full">
                <Button className="w-full bg-purple-700 hover:bg-purple-800">
                  View Template
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
