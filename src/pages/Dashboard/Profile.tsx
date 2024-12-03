import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  loadUserProfile,
  updateUserNameThunk,
  updateProfilePhotoThunk,
} from "../../store/slices/profileSlice";
import { Input } from "../../components/ui/Input";
import UploadPicture from "../../components/ui/UploadPicture";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "../../components/ui/Toast";

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error, updateNameLoading, updatePhotoLoading } =
    useSelector((state: RootState) => state.profile);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false); // Edit mode state
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
        updateUserNameThunk({ firstname: firstName, lastname: lastName })
      ).unwrap();
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
        setToastMessage("Profile photo updated successfully!");
      } catch (err) {
        setToastMessage(err as string);
      } finally {
        setToastVisible(true);
      }
    }
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
      <h2 className="text-xl font-bold my-3">Profile</h2>

      <div className="container mx-auto mt-3 bg-white p-4 shadow-sm rounded-md">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg text-center font-semibold">
                Profile Picture
              </h3>
              {!editMode ? (
                <img
                  src={
                    user?.imageurl?.startsWith("http")
                      ? user?.imageurl
                      : `https://${user?.imageurl}`
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/400?text=Image+Unavailable";
                  }}
                />
              ) : (
                <>
                  <UploadPicture onFileChange={handleProfilePictureChange} />
                  {profilePicture && (
                    <button
                      onClick={handleUpdatePhoto}
                      className="mt-3 bg-primary text-white py-2 px-6 rounded-md hover:bg-blue-700"
                    >
                      {updatePhotoLoading ? "Updating..." : "Update Photo"}
                    </button>
                  )}
                </>
              )}
            </div>

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
            </div>

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-primary text-white py-2 px-6 rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="bg-primary text-white py-2 px-6 rounded-md hover:bg-blue-700"
                >
                  {updateNameLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            )}
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
