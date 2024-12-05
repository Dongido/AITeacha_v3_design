import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loadUserResources } from "../../store/slices/resourcesSlice";
import { Skeleton } from "../../components/ui/Skeleton";
import { resourceColumns } from "./_components/column.resourse";
import BaseTable from "../../components/table/BaseTable";
const WorkHistory = () => {
  const dispatch = useAppDispatch();
  const resources = useAppSelector((state) => state.resources.resources);
  const loading = useAppSelector((state) => state.resources.loading);
  const error = useAppSelector((state) => state.resources.error);

  useEffect(() => {
    dispatch(loadUserResources());
  }, [dispatch]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }
  }, []);
  return (
    <div className="mt-4">
      {userDetails && isEmailVerified === 1 && (
        <div className="bg-yellow-100 mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center">
          <span className="text-center">Teachers Are Heroes🎉</span>
        </div>
      )}
      <h2 className="text-lg font-bold mb-4">Work History</h2>
      {loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {[...Array(5)].map((_, index) => (
                  <th key={index} className="p-4 border-b">
                    <Skeleton className="h-4 w-16 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  {[...Array(5)].map((_, colIndex) => (
                    <td key={colIndex} className="p-4">
                      <Skeleton className="h-4 w-full rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <BaseTable data={resources} columns={resourceColumns} />
      )}
    </div>
  );
};

export default WorkHistory;
