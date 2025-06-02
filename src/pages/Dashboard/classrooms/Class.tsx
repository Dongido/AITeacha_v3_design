import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadClassrooms,
  loadTeamClassrooms,
} from "../../../store/slices/classroomSlice";
import { RootState, AppDispatch } from "../../../store";
import { Skeleton } from "../../../components/ui/Skeleton";
import BaseTable from "../../../components/table/BaseTable";
import { classroomColumns } from "./components/column.classroom";
import { Plus, Search, Undo2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Classroom } from "../../../api/interface";
import { Link } from "react-router-dom";
import RestrictedPage from "./RestrictionPage";
import { Switch } from "../../../components/ui/Switch";
import { Label } from "../../../components/ui/Label";
import { cn } from "../../../lib/utils";

const Classrooms = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { classrooms, teamClassrooms, loading, error } = useSelector(
    (state: RootState) => state.classrooms
  );

  const [selectedType, setSelectedType] = useState<
    "classrooms" | "teamClassrooms"
  >("classrooms");
  const [classTypeFilter, setClassTypeFilter] = useState<
    "All" | "Free" | "Paid"
  >("All"); // Added state for class type filter

  useEffect(() => {
    dispatch(loadClassrooms());
    dispatch(loadTeamClassrooms());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleRowClick = (classroom: Classroom) => {
    // navigate(`/dashboard/classrooms/details/${classroom.classroom_id}`);
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleVerifyEmail = () => {
    navigate("/dashboard/verify-email");
  };

  const handleLaunchNewClassroom = () => {
    navigate("/dashboard/classrooms/create");
  };

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

  const filteredClassrooms = () => {
    const classroomsToFilter =
      selectedType === "classrooms" ? classrooms : teamClassrooms;

    if (classTypeFilter === "All") {
      return classroomsToFilter;
    } else {
      return classroomsToFilter.filter(
        (classroom) => classroom.class_type === classTypeFilter
      );
    }
  };

  const videoUrls = [
    "https://youtu.be/aDwj6TI49c8?si=ugg4_ArrJD6NJeU5",
    "https://youtu.be/o688vxKkcPw?si=qCySfi_D-Cd38GpG",
    "https://youtu.be/z7_EvUO4BSA?si=usF4bn01HhRuK6Nm",
  ];
  const displayedClassrooms = filteredClassrooms();

  if (loading) {
    return (
      <>
        {userDetails && isEmailVerified === 1 && (
          <div
            className="bg-[#e5dbff] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
            style={{
              background:
                "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
            }}
          >
            <span className="text-center text-xl font-bold">
              Teachers Are Heroes🎉
            </span>
          </div>
        )}

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
      </>
    );
  }
  if (error === "Permission restricted for unverified email") {
    return (
      <div>
        <div
          className="bg-[#ffe6e6] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
          style={{
            background:
              "linear-gradient(143.6deg, rgba(255, 132, 132, 0) 20.79%, rgba(255, 121, 121, 0.26) 40.92%, rgba(255, 171, 171, 0) 70.35%)",
          }}
        >
          <span className="text-center text-xl font-bold">
            Please verify your email to continue!
          </span>
        </div>
      </div>
    );
  }

  if (error === "Permission restricted: for free account") {
    return (
      <div>
        {userDetails && isEmailVerified === 1 && (
          <div
            className="bg-[#e5dbff] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
            style={{
              background:
                "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
            }}
          >
            <span className="text-center text-xl font-bold">
              Teachers Are Heroes🎉
            </span>
          </div>
        )}
        <RestrictedPage error={error} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {userDetails && isEmailVerified === 1 && (
          <div
            className="bg-[#e5dbff] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
            style={{
              background:
                "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
            }}
          >
            <button
              onClick={handleVerifyEmail}
              className="text-primary hover:underline"
            >
              Verify Email
            </button>
          </div>
        )}
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {userDetails && isEmailVerified === 1 && (
        <div
          className="bg-[#e5dbff] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
          style={{
            background:
              "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
          }}
        >
          <span className="text-center text-xl font-bold">
            Teachers Are Heroes🎉
          </span>
        </div>
      )}

      <div className="flex w-full mt-12 mb-6 items-center justify-between flex-col sm:flex-row">
        <h2 className="text-2xl font-bold text-gray-900 sm:mb-0 mb-4">
          {selectedType === "teamClassrooms"
            ? "Team Classrooms"
            : "My Classrooms"}
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-start sm:items-center">
          <div className="flex items-center space-x-2">
            <Switch
              checked={classTypeFilter === "Paid"}
              onCheckedChange={(checked: any) =>
                setClassTypeFilter(checked ? "Paid" : "Free")
              }
            />
            <Label
              htmlFor="airplane-mode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {classTypeFilter === "All" ? "All" : classTypeFilter} Classes
            </Label>
            {classTypeFilter !== "All" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setClassTypeFilter("All")}
                className="ml-2"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as "classrooms" | "teamClassrooms")
            }
            className="p-2 border rounded-md"
          >
            <option value="classrooms">My Classrooms</option>
            <option value="teamClassrooms">Team Classrooms</option>
          </select>

          <Link
            to={"/dashboard/classrooms/joined"}
            className="w-full sm:w-auto"
          >
            <Button
              variant="ghost"
              className="flex items-center w-full sm:w-fit bg-gray-400 h-full gap-3 rounded-md"
            >
              Joined Classrooms
            </Button>
          </Link>
          <Button
            variant="gradient"
            className="flex items-center w-full sm:w-fit h-full gap-3 rounded-md"
            onClick={handleLaunchNewClassroom}
          >
            <Plus size={"1.1rem"} />
            Launch Classroom
          </Button>

          <Button
            onClick={openPopup}
            variant={"outline"}
            className="flex items-center px-6 py-3 bg-red-500 text-white text-lg font-medium rounded-lg shadow-lg  space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M19.615 3.184c-1.88-.33-9.379-.33-11.258 0C6.018 3.516 5.1 4.437 4.77 6.212c-.33 1.775-.33 5.514 0 7.29.33 1.774 1.248 2.696 3.587 3.03 1.88.33 9.379.33 11.258 0 2.339-.333 3.256-1.255 3.587-3.03.33-1.776.33-5.515 0-7.29-.33-1.775-1.248-2.696-3.587-3.03zm-9.78 5.952l5.723 3.328-5.723 3.33V9.136z" />
            </svg>
            <span className="text-white">Guide</span>
          </Button>

          {isPopupOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-3xl">
                <button
                  onClick={closePopup}
                  className="absolute top-3 right-3 bg-red-500 text-gray-600 hover:bg-gray-300 p-2 rounded-full"
                >
                  <span className="text-white"> ✕</span>
                </button>

                <div className="p-4">
                  <iframe
                    width="100%"
                    height="400"
                    src="https://www.youtube.com/embed/o688vxKkcPw?si=CoKNScNo2C7XA8Dp"
                    title="Community Preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <BaseTable
        data={displayedClassrooms}
        columns={classroomColumns}
        onRowClick={handleRowClick}
      />

      <div className="bg-white rounded-md shadow-md p-4 mb-4 mt-12">
        <h2 className="text-lg font-semibold mb-2">
          Quick videos to get started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videoUrls.map((url, index) => {
            const videoId = url.split("/").pop();
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;

            return (
              <div key={index} className="aspect-w-16 aspect-h-9">
                <iframe
                  className="w-full h-full rounded-md"
                  src={embedUrl}
                  title={`Quick Start Video ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Classrooms;
