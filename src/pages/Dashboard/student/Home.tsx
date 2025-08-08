import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import dashImg from "../../../assets/img/0e846ab4-992d-48b3-a818-d62a7803bd8e 1.png";
import { classroomColumns } from "./_components/column.classroom";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { loadStudentClassrooms } from "../../../store/slices/studentClassroomSlice";
import { RootState, AppDispatch } from "../../../store";
import BaseTable from "../../../components/table/BaseTable";

interface UserDetails {
  id: string;
  email: string;
  role: string;
  package: string;
  firstname: string;
}

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { classrooms, loading, error } = useSelector(
    (state: RootState) => state.studentClassrooms
  );

  useEffect(() => {
    if (classrooms.length === 0) {
      dispatch(loadStudentClassrooms());
    }
  }, [dispatch, classrooms.length]);

  const displayedClassrooms = classrooms.slice(0, 5);
  const navigate = useNavigate();

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
  const handleVerifyEmail = () => {
    navigate("/dashboard/verify-email");
  };

  return (
    <div className="mt-12">
      {userDetails && isEmailVerified === 0 && (
        <div className="bg-yellow-200 mt-3 text-black p-4 rounded-md flex justify-between items-center">
          <span>Your email is not verified. Please verify your email.</span>
          <button
            onClick={handleVerifyEmail}
            className="text-primary hover:underline"
          >
            Verify Email
          </button>
        </div>
      )}
      <div className="relative mt-4">
        <div className="bg-[#5C3CBB] text-white p-8 rounded-lg overflow-hidden">
          <p className="text-sm font-semibold">Your Journey</p>
          {userDetails ? (
            <h2 className="text-2xl font-bold mt-2 capitalize">
              Hi, {userDetails.firstname} 👋
            </h2>
          ) : (
            <h2 className="text-2xl font-bold mt-2">Hi, there 👋</h2>
          )}
          <p className="text-lg mt-1">You may have some assignments!</p>
          <Link to={"#"}>
            <Link to={"/student/assignments"}>
              <button className="mt-4 flex hover:bg-gray-200 items-center bg-white text-[#5C3CBB] font-semibold py-2 px-4 rounded-full text-sm">
                See All
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
            </Link>
          </Link>
        </div>

        <img
          src={dashImg}
          alt="Robot reading a book"
          className="absolute lg:block hidden"
          style={{
            height: "300px",
            right: "10%",
            top: "28%",
            transform: "translateY(-50%)",
          }}
        />
      </div>
      <div className="mt-8 overflow-x-auto py-4">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-xl font-bold text-gray-900">Your Classes</h2>
          <Link
            to="/student/class"
            className="text-sm text-blue-600 hover:underline"
          >
            <button className="text-sm flex rounded-full px-6 py-2 bg-purple-100 hover:bg-gray-400 text-primary hover:text-black text-white">
              See All
              <ArrowRightIcon className="h-5 w-4 ml-2" />
            </button>
          </Link>
        </div>
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
          <BaseTable
            data={displayedClassrooms}
            showPagination={false}
            columns={classroomColumns}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
