import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  loadUserProfile,
  updateUserNameThunk,
  loadProfileImage,
  updateProfilePhotoThunk,
} from "../../store/slices/profileSlice";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import UploadPicture from "../../components/ui/UploadPicture";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "../../components/ui/Toast";
import { FiEdit } from "react-icons/fi";

import { TextArea } from "../../components/ui/TextArea";

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error, updateNameLoading, updatePhotoLoading } =
    useSelector((state: RootState) => state.profile);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [role, setRole] = useState<number>(3);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    dispatch(loadUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstname || "");
      setLastName(user.lastname || "");
      setPhone(user.phone || "N/A");
      setEmail(user.email || "N/A");
      setAbout(user.about || "N/A");
      setRole(user.role_id || 3);
    }
  }, [user]);

  const handleProfilePictureChange = (file: File | null) => {
    setProfilePicture(file);
    if (file) {
      console.log("Profile picture selected:", file.name);
    } else {
      console.log("Profile picture removed.");
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(
        updateUserNameThunk({
          firstname: firstName,
          lastname: lastName,
          about,
          phone,
        })
      ).unwrap();
      const updatedProfile = await dispatch(loadUserProfile()).unwrap();

      setToastMessage("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setToastMessage(err as string);
    } finally {
      setToastVisible(true);
    }
  };

  const handleUpdatePhoto = async () => {
    if (profilePicture) {
      try {
        await dispatch(updateProfilePhotoThunk(profilePicture)).unwrap();
        dispatch(loadUserProfile());
        dispatch(loadProfileImage());
        setToastMessage("Profile photo updated successfully!");
        setEditMode(false);
      } catch (err) {
        setToastMessage(err as string);
      } finally {
        setToastVisible(true);
      }
    }
  };
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(Number(e.target.value));
  };

  const handleCancel = () => {
    if (user) {
      setFirstName(user.firstname || "");
      setLastName(user.lastname || "");
    }
    setProfilePicture(null);
    setEditMode(false);
  };

  return (
    <ToastProvider>
      <div className="container mx-auto mt-3 bg-white p-3 shadow-sm rounded-md">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : (
          <>
            {!editMode ? (
              <Button
                variant="ghost"
                onClick={() => setEditMode(true)}
                className="py-2 px-6 rounded-md flex items-center justify-center space-x-2"
              >
                <span>Edit Profile</span>
                <FiEdit className="text-gray-600" />
              </Button>
            ) : (
              <div className="flex space-x-4 my-4">
                <Button
                  onClick={handleSave}
                  variant={"gradient"}
                  className=" text-white py-1 px-6 rounded-full hover:bg-blue-700"
                >
                  {updateNameLoading ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant={"ghost"}
                  className="text-gray-800 py-2 rounded-md "
                >
                  Cancel
                </Button>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Section: Profile Form */}
              <div className="flex-1 p-3 rounded-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      First Name
                    </label>
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      className="w-full"
                      readOnly={!editMode}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Last Name
                    </label>
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      className="w-full"
                      readOnly={!editMode}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Phone
                    </label>
                    <Input
                      id="last-name"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your Phone Number"
                      className="w-full"
                      readOnly={!editMode}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <Input
                      id="last-name"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full"
                      readOnly
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <p className="w-full border p-2 rounded-md border-gray-300 bg-gray-100">
                    {role === 3
                      ? "Student"
                      : role === 2
                      ? "Teacher"
                      : role === 1
                      ? "Educator"
                      : "Unknown Role"}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    About
                  </label>
                  <TextArea
                    id="last-name"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Write about yourself"
                    className="w-full"
                    readOnly={!editMode}
                  />
                </div>
              </div>

              {/* Right Section: Profile Image */}
              <div className="w-full h-72 lg:w-1/3 bg-gray-200 p-6 rounded-md shadow-sm">
                <h3 className="text-lg text-center font-semibold mb-4">
                  Profile Picture
                </h3>
                {!editMode ? (
                  <img
                    src={
                      user?.imageurl?.startsWith("http")
                        ? user?.imageurl
                        : `https://${user?.imageurl}`
                    }
                    loading="lazy"
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://img.freepik.com/premium-photo/cool-asian-head-logo_925613-50527.jpg?w=360";
                    }}
                  />
                ) : (
                  <>
                    <UploadPicture onFileChange={handleProfilePictureChange} />
                    {profilePicture && (
                      <div className="flex justify-center items-center mx-auto">
                        <Button
                          onClick={handleUpdatePhoto}
                          variant={"gradient"}
                          className="mt-3   text-white py-2 px-6 rounded-full"
                        >
                          {updatePhotoLoading ? "Updating..." : "Update Photo"}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {toastVisible && (
        <Toast
          className="mt-4"
          variant={
            toastMessage.includes("successfully") ? "default" : "destructive"
          }
        >
          <ToastTitle>
            {toastMessage.includes("successfully") ? "Success!" : "Error"}
          </ToastTitle>
          <ToastDescription>{toastMessage}</ToastDescription>
        </Toast>
      )}

      <ToastViewport />
    </ToastProvider>
  );
};

export default Profile;
