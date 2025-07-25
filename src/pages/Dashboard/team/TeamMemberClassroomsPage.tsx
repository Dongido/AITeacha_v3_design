import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTeamMemberClasses } from "../../../api/teams";
import BaseTable from "../../../components/table/BaseTable";
import { teamMemberClassroomColumns } from "./column.teammemberclass";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";

interface Classroom {
  classroom_id: string;
  classroom_name: string;
}

const TeamMemberClassroomsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [memberClassrooms, setMemberClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberClassrooms = async () => {
      if (!userId) {
        setError("User ID not provided in URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await getTeamMemberClasses(userId);
        setMemberClassrooms(data);
        console.log("Fetched classrooms for member:", data);
      } catch (err: any) {
        console.error("Failed to fetch team member classrooms:", err);
        setError(err.message || "Failed to load classrooms for this member.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberClassrooms();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Loading Classrooms for Team Member...
        </h2>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Button onClick={() => navigate(-1)} className="mb-4">
          &larr; Back
        </Button>
        <h2 className="text-2xl font-semibold mb-4">Error</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button onClick={() => navigate(-1)} className="mb-4">
        &larr; Back
      </Button>

      <BaseTable data={memberClassrooms} columns={teamMemberClassroomColumns} />
    </div>
  );
};

export default TeamMemberClassroomsPage;
