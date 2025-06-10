import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPastSubscribers } from "../../../store/slices/userSlice";
import { RootState, AppDispatch } from "../../../store";
import { formatDateWithSuffix } from "./Date";
import { Button } from "../../../components/ui/Button"; // Assuming you have a Button component

interface PastSubscriber {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  subscription_expiry_date: string;
  package: string;
}

const PastUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pastSubscribers, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;

  useEffect(() => {
    dispatch(fetchPastSubscribers());
  }, [dispatch]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = pastSubscribers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(pastSubscribers.length / usersPerPage);

  const downloadCSV = () => {
    if (!pastSubscribers || pastSubscribers.length === 0) {
      alert("No past subscriber data to download.");
      return;
    }

    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Subscription Expiry",
      "Package",
    ];
    const csvRows = [headers.join(",")];

    pastSubscribers.forEach((user) => {
      const row = [
        user.firstname,
        user.lastname,
        user.email,
        user.phone,
        formatDateWithSuffix(user.subscription_expiry_date),
        user.package,
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "past_subscribers.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Past Subscribers</h2>
        {pastSubscribers && pastSubscribers.length > 0 && (
          <Button
            onClick={downloadCSV}
            variant="gradient"
            className="rounded-md"
          >
            Download as CSV
          </Button>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border p-3">First Name</th>
              <th className="border p-3">Last Name</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Phone</th>
              <th className="border p-3">Subscription Expiry</th>
              <th className="border p-3">Package</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                key={user.email}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border p-3">{user.firstname}</td>
                <td className="border p-3">{user.lastname}</td>
                <td className="border p-3">{user.email}</td>
                <td className="border p-3">{user.phone}</td>
                <td className="border p-3">
                  {formatDateWithSuffix(user.subscription_expiry_date)}
                </td>
                <td className="border p-3">{user.package}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={indexOfLastUser >= pastSubscribers.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PastUsers;
