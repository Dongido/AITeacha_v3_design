import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { AppDispatch, RootState } from "../../store";
import { useDispatch } from "react-redux";
import {
  fetchExamType,
  fetchSchoolSession,
  fetchSchoolTerm,
} from "../../store/slices/testSlice";
import { allSubject, fetchResults } from "../../store/slices/resultSlice";
import { Link } from "react-router-dom";

const Result = () => {
  const [userInfo, setUserInfo] = useState("");
  const [filters, setFilters] = useState({
    grade: "",
    session: 0,
    term: 0,
    examType: "",
    subject: "",
  });

  const [generatedResults, setGeneratedResults] = useState<any[]>([]);
  const [validationMessage, setValidationMessage] = useState("")

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const user = localStorage.getItem("ai-teacha-user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserInfo(parsedUser.organization || parsedUser?.firstname);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchExamType());
    dispatch(allSubject());
    dispatch(fetchSchoolSession());
    dispatch(fetchSchoolTerm());
  }, [dispatch]);

  const { examType, schoolSession, schoolTerm } = useAppSelector(
    (state: RootState) => state.tests
  );
  const { results, loading, error, subject } = useAppSelector(
    (state: RootState) => state.result
  );

  // Filter handler
  const handleFilter = () => {
    const { grade, session, term, examType, subject } = filters;
    if ( !session || !term) {
      setValidationMessage("Please select Grade, Session, and Term before filtering.");
      return;
    }
    setValidationMessage("");

    dispatch(
      fetchResults({
        grade,
        session,
        term,
        source: examType,
        subject,
      })
    );
  };



  const handleAdd = (item: any) => {
    if (!generatedResults.find((r) => r.id === item.id)) {
      setGeneratedResults([...generatedResults, item]);
    }
  };

  // Remove single result
  const handleRemove = (id: number) => {
    setGeneratedResults(generatedResults.filter((r) => r.id !== id));
  };

  // Add all
  const handleAddAll = () => {
    setGeneratedResults(results);
  };

  const handleRemoveAll = () => {
    setGeneratedResults([]);
    // dispatch({ type: "result/clearResults" });
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <h1 className="text-3xl font-extrabold mb-8 text-purple-700">
        Create Result
      </h1>
      {/* ... your filter table code remains unchanged ... */}
      <div className="overflow-x-auto shadow-lg rounded-2xl border border-purple-200 mb-4">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-purple-100 text-purple-800 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 border-b">Branch</th>
              <th className="px-6 py-4 border-b">Class</th>
              <th className="px-6 py-4 border-b">Session</th>
              <th className="px-6 py-4 border-b">Term</th>
              <th className="px-6 py-4 border-b">Source (Exam/Test)</th>
              <th className="px-6 py-4 border-b">Subject</th>
              <th className="px-6 py-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              {/* Branch/User */}
              <td className="px-6 py-4 border-b">
                <select className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none">
                  <option value="">{userInfo || "Select User"}</option>
                </select>
              </td>

              {/* Class */}
              <td className="px-6 py-4 border-b">
                <select
                  className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  onChange={(e) =>
                    setFilters({ ...filters, grade: e.target.value })
                  }
                >
                  <option value="">Select Grade</option>
                  {[
                    "Pre School",
                    "Early Years",
                    "Nursery 1",
                    "Nursery 2",
                    ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
                    ...Array.from({ length: 5 }, (_, i) => `Higher Institution Year ${i + 1}`),
                  ].map((grade, index) => (
                    <option key={index}>{grade}</option>
                  ))}
                </select>
              </td>
              {/* Session */}
              <td className="px-6 py-4 border-b">
                <select
                  className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  onChange={(e) =>
                    setFilters({ ...filters, session: Number(e.target.value) })
                  }
                >
                  <option value="">Select Session</option>
                  {schoolSession.map((session, index) => (
                    <option key={session.id ?? index} value={session.id}>
                      {session.name}
                    </option>
                  ))}
                </select>
              </td>

              {/* Term */}
              <td className="px-6 py-4 border-b">
                <select
                  className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  onChange={(e) =>
                    setFilters({ ...filters, term: Number(e.target.value) })
                  }
                >
                  <option value="">Select Term</option>
                  {schoolTerm.map((term, index) => (
                    <option key={term.id ?? index} value={term.id}>
                      {term.name}
                    </option>
                  ))}
                </select>
              </td>

              {/* Exam Type */}
              <td className="px-6 py-4 border-b">
                <select
                  className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  onChange={(e) =>
                    setFilters({ ...filters, examType: e.target.value })
                  }
                >
                  <option value="">Select Source</option>
                  {examType.map((type, index) => (
                    <option key={type.id ?? index} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </td>

              <td className="px-6 py-4 border-b">
                <select
                  className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  onChange={(e) =>
                    setFilters({ ...filters, subject: e.target.value })
                  }
                >
                  <option value="">Select Subject</option>
                  {subject.map((subj, index) => (
                    <option key={index} value={subj.subject}>
                      {subj.subject}
                    </option>
                  ))}
                </select>

              </td>
              {/* Action */}
              <td className="px-6 py-4 border-b text-center">
                <button
                  onClick={handleFilter}
                  className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow"
                >
                  Filter
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {validationMessage && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-lg shadow text-sm w-[50%]">
          {validationMessage}
        </div>
      )}

      {/* Results */}
      {loading && <p className="text-gray-600">Loading results...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && results.length === 0 && (
        <p className="text-gray-500 italic">No results found.</p>
      )}

      {results.length > 0 && (
        <div className="overflow-x-auto shadow-lg rounded-2xl border border-purple-200 mb-8">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-purple-100 text-purple-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 border-b">Subject</th>
                <th className="px-6 py-4 border-b">Grade</th>
                <th className="px-6 py-4 border-b">Source</th>
                <th className="px-6 py-4 border-b">Date</th>
                <th className="px-6 py-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {results.map((item: any) => {
                const alreadyAdded = generatedResults.some((r) => r.id === item.id);

                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 border-b">{item.subject}</td>
                    <td className="px-6 py-4 border-b">{item.grade}</td>
                    <td className="px-6 py-4 border-b">{item.examtype}</td>
                    <td className="px-6 py-4 border-b">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 border-b text-center">
                      {!alreadyAdded && (
                        <button
                          onClick={() => handleAdd(item)}
                          className="px-3 py-1 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
                        >
                          Add
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex gap-3 justify-end p-4 border-t bg-gray-50 rounded-b-2xl">
            <button
              onClick={handleAddAll}
              className="px-5 py-2 bg-purple-600 text-white font-medium rounded-xl shadow-md
            hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
            >
              Add All
            </button>
            <button
              onClick={handleRemoveAll}
              className="px-5 py-2 bg-red-500 text-white font-medium rounded-xl shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Generated Result Table */}
      {/* Generated Result Table */}
      {generatedResults.length > 0 && (
        <div className="overflow-x-auto shadow-lg rounded-2xl border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-700 p-4">
            Generated Result
          </h2>
          <table className="min-w-full text-sm text-left">
            <thead className="bg-purple-100 text-purple-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 border-b">Subject</th>
                <th className="px-6 py-4 border-b">Grade</th>
                <th className="px-6 py-4 border-b">Source</th>
                <th className="px-6 py-4 border-b">Date</th>
                <th className="px-6 py-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {generatedResults.map((item: any) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 border-b">{item.subject}</td>
                  <td className="px-6 py-4 border-b">{item.grade}</td>
                  <td className="px-6 py-4 border-b">{item.examtype}</td>
                  <td className="px-6 py-4 border-b">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end p-4 border-t bg-gray-50 rounded-b-2xl">
            <Link to={"/dashboard/saved/result"}
              type="button"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 
              text-white font-semibold shadow-md 
              hover:from-purple-700 hover:to-purple-600 
              active:scale-95 transition duration-200 ease-in-out"
            >
              Save
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default Result;
