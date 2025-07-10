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
  >("All");
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
    <div className="mt-4 routes-scroll-area">
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

      <div className="flex w-full mt-12 mb-6 items-center justify-between flex-col sm:flex-row routes-scroll-area">
        <h2 className="text-xl md:text-2xl lg:text-2xl font-bold text-gray-900 sm:mb-0 mb-4 whitespace-nowrap routes-scroll-area ">
          {selectedType === "teamClassrooms"
            ? "Team Classrooms"
            : "My Classrooms"}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 p-0 md:p-2 lg:p-4 md:flex-row md:justify-end">
          <div className="flex items-center space-x-2">
            <Switch
              checked={classTypeFilter === "Paid"}
              onCheckedChange={(checked) =>
                setClassTypeFilter(checked ? "Paid" : "Free")
              }
            />
            <Label
              htmlFor="class-type-switch"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {classTypeFilter === "All" ? "All" : classTypeFilter} Classes
            </Label>
            {classTypeFilter !== "All" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setClassTypeFilter("All")}
                className="ml-2 flex-shrink-0"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(
                  e.target.value as "classrooms" | "teamClassrooms"
                )
              }
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-grow"
            >
              <option value="classrooms">My Classrooms</option>
              <option value="teamClassrooms">Team Classrooms</option>
            </select>

            <Link to={"/dashboard/classrooms/joined"} className="flex-grow">
              <Button
                variant="ghost"
                className="flex items-center w-full sm:w-fit bg-gray-400 h-full gap-3 rounded-md"
              >
                Joined Classrooms
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <Button
              variant="gradient"
              className="flex items-center w-full justify-center sm:w-fit h-10 gap-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex-grow"
              onClick={handleLaunchNewClassroom}
            >
              <Plus size={"1.1rem"} />
              Launch Classroom
            </Button>

            <Button
              onClick={openPopup}
              variant={"outline"}
              className="flex items-center px-6 py-2 bg-red-500 text-white text-base font-medium rounded-lg shadow-md hover:bg-red-600 space-x-2 w-full justify-center sm:w-fit h-10 flex-grow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.615 3.184c-1.88-.33-9.379-.33-11.258 0C6.018 3.516 5.1 4.437 4.77 6.212c-.33 1.775-.33 5.514 0 7.29.33 1.774 1.248 2.696 3.587 3.03 1.88.33 9.379.33 11.258 0 2.339-.333 3.256-1.255 3.587-3.03.33-1.776.33-5.515 0-7.29-.33-1.775-1.248-2.696-3.587-3.03zm-9.78 5.952l5.723 3.328-5.723 3.33V9.136z" />
              </svg>
              <span className="text-white">Guide</span>
            </Button>
          </div>

          {isPopupOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-[100]">
              <div className="relative bg-white rounded-lg shadow-2xl w-[95%] max-w-4xl max-h-[90vh] overflow-hidden">
                <button
                  onClick={closePopup}
                  className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600 p-2 rounded-full text-lg z-10"
                  aria-label="Close Guide"
                >
                  ✕
                </button>

                <div className="p-4 pt-10">
                  <iframe
                    width="100%"
                    height="450"
                    src="https://www.youtube.com/embed/o688vxKkcPw?si=ML-K6a0dBhyH7WqM"
                    title="Community Preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
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
