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
import dashImg from "../../../assets/img/0e846ab4-992d-48b3-a818-d62a7803bd8e 1.png";
import { IoBookOutline } from "react-icons/io5";
import { PiGraduationCapThin } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";

const Classrooms = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { classrooms, teamClassrooms, loading, error } = useSelector(
    (state: RootState) => state.classrooms
  );
  const [searchQuery, setSearchQuery] = useState("");

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
    navigate(`/dashboard/classrooms/details/${classroom.classroom_id}`);
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

  const handleJoinAClassroom = () => {
    navigate("/dashboard/classrooms/joined");
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

    let result =
      classTypeFilter === "All"
        ? classroomsToFilter
        : classroomsToFilter.filter(
            (classroom) => classroom.class_type === classTypeFilter
          );

    if (searchQuery.trim() !== "") {
      result = result.filter((classroom) =>
        classroom.classroom_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase().trim())
      );
    }

    return result;
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
    <div className="mt-4 routes-scroll-area ">
      {/* {userDetails && isEmailVerified === 1 && (
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
      )} */}

      <div>
        <h1 className="text-black text-xl">My Classrooms</h1>
        <p className="text-[#3B3A3A] text-sm">Manage all your classrooms</p>
      </div>

      <div className="relative mt-4">
        <div className="bg-[#EFE6FD] text-white p-8 rounded-lg overflow-hidden">
          <div className="">
            <p className="text-xl text-black font-[600] flex items-center">
              Teachers are heroes
            </p>
          </div>
          <p className="text-sm text-[#3B3A3A] mx-auto md:mx-0">
            Empower your students and create meaningful learning experiences
            today.
          </p>
          <div className="mt-4 flex lg:flex-row flex-col gap-2">
            <button
              className="gap-2 rounded-full bg-[#6200EE] text-white flex pl-[16px] pr-[16px] pt-[8px] pb-[8px]"
              onClick={handleLaunchNewClassroom}
            >
              <Plus className="mt-1" size={"1.1rem"} />
              Launch Classroom
            </button>
            <button
              className="gap-2 rounded-full border border-[#6200EE] text-[#6200EE] flex pl-[16px] pr-[16px] pt-[8px] pb-[8px]"
              onClick={handleJoinAClassroom}
            >
              Join a Classroom
            </button>
          </div>
        </div>

        <img
          src={dashImg}
          alt="Robot reading a book"
          className="absolute lg:block hidden"
          style={{
            height: "200px",
            right: "10%",
            top: "45%",
            transform: "translateY(-50%)",
          }}
        />
      </div>

      <div className="w-full px-4 lg:-ml-3 mt-6 transition-all duration-300">
        {/* Top Nav Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Teaching / Learning Tabs */}
          <div className="flex items-center gap-4">
            {(["teaching", "learning"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setSelectedType(
                    tab === "teaching" ? "classrooms" : "teamClassrooms"
                  )
                }
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                  selectedType ===
                  (tab === "teaching" ? "classrooms" : "teamClassrooms")
                    ? tab === "teaching"
                      ? "text-white bg-[#0DBA86] px-4 py-2 rounded-md"
                      : "text-white bg-[#0DBA86] px-4 py-2 rounded-md"
                    : "text-[#626161] hover:text-[#0DBA86]"
                }`}
              >
                {tab === "teaching" ? (
                  <IoBookOutline
                    className={`text-lg ${
                      selectedType === "classrooms"
                        ? "text-white"
                        : "text-[#626161]"
                    }`}
                  />
                ) : (
                  <PiGraduationCapThin
                    className={`text-lg ${
                      selectedType === "teamClassrooms"
                        ? "text-white"
                        : "text-[#626161]"
                    }`}
                  />
                )}
                {tab === "teaching" ? "Teaching" : "Learning"}
              </button>
            ))}
          </div>

          {/* Guides button */}
          <Link to="/dashboard/resource/training">
            <button
              onClick={openPopup}
              className="flex items-center text-red-600 border border-red-300 rounded-full py-2 px-4 text-sm font-medium hover:bg-red-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.615 3.184c-1.88-.33-9.379-.33-11.258 0C6.018 3.516 5.1 4.437 4.77 6.212c-.33 1.775-.33 5.514 0 7.29.33 1.774 1.248 2.696 3.587 3.03 1.88.33 9.379.33 11.258 0 2.339-.333 3.256-1.255 3.587-3.03.33-1.776.33-5.515 0-7.29-.33-1.775-1.248-2.696-3.587-3.03zm-9.78 5.952l5.723 3.328-5.723 3.33V9.136z" />
              </svg>
              Guides
            </button>
          </Link>
        </div>

        {/* Subheading */}
        <p className="text-sm text-[#3B3A3A] mt-2">
          These are classrooms you created, and you are the teacher in them.
        </p>

        {/* Tabs (All | Paid | Free) */}
        <div className="flex gap-6 mt-4 border-b border-gray-200">
          {["All", "Paid", "Free"].map((tab) => (
            <button
              key={tab}
              onClick={() => setClassTypeFilter(tab as any)}
              className={cn(
                "pb-2 text-sm font-bold relative",
                classTypeFilter === tab
                  ? "text-[#6200EE] border-b-2 border-[#6200EE]"
                  : "text-[#626161] hover:text-[#6200EE]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dropdown + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-3">
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as "classrooms" | "teamClassrooms")
            }
            className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200EE] w-full sm:w-fit"
          >
            <option value="classrooms">My Classrooms</option>
            <option value="teamClassrooms">Team Classrooms</option>
          </select>
        </div>

        {/* Table Area */}
        <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="m-8 inline-flex gap-2 pl-4 pr-20 py-2 bg-[#EBEBEB] text-[#7C7B7B] rounded-md ">
            <CiSearch className="mt-1" />
            <input
              type="text"
              placeholder="Search classroom by name"
              className="text-sm bg-transparent w-full focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <BaseTable
            data={displayedClassrooms}
            columns={classroomColumns}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Classrooms;
