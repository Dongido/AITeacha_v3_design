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
import { generateReferralCode } from "../../api/profile";

import { TextArea } from "../../components/ui/TextArea";

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error, updateNameLoading, updatePhotoLoading } =
    useSelector((state: RootState) => state.profile);
  const [activeTab, setActiveTab] = useState("profile");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [role, setRole] = useState<number>(3);
  const [referral_code, setReferral_code] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);

  const userDetails = JSON.parse(
    localStorage.getItem("ai-teacha-user") || "{}"
  );
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
      setReferral_code(user.referral_code || "");
      setRole(user.role_id || 3);
    }
  }, [user]);

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(
      `https://aiteacha.com/auth/onboarding?referralCode=${referral_code}`
    );
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

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

  const handleGenerateReferralCode = async () => {
    setGenerating(true);
    try {
      const code = await generateReferralCode();
      dispatch(loadUserProfile());
      setReferral_code(code);
    } catch (error) {
      console.error("Error generating referral code:", error);
    } finally {
      setGenerating(false);
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
      <div className="container mx-auto mt-3 bg-white p-3 shadow-sm rounded-md">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : (
          <>
            <div className="mb-4">
              <button
                className={`px-4 py-2 rounded-t-lg mr-2 ${
                  activeTab === "profile"
                    ? "bg-gray-200"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile Details
              </button>
              {userDetails.role !== 3 && (
                <button
                  className={`px-4 py-2 rounded-t-lg ${
                    activeTab === "wallet"
                      ? "bg-gray-200"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("wallet")}
                >
                  Wallet Details
                </button>
              )}
            </div>

            {activeTab === "profile" && (
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
                    <div className="mb-2">
                      <label
                        htmlFor="referralCode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Referral Code
                      </label>
                      {referral_code ? (
                        <div className="flex flex-col gap-2">
                          <p className="w-full border p-2 rounded-md border-gray-300 bg-gray-100">
                            {referral_code}
                          </p>
                          <button
                            onClick={handleCopyReferralLink}
                            className="w-full bg-primary text-white p-2 rounded-md"
                          >
                            {copied ? "Copied!" : "Copy Referral Link"}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleGenerateReferralCode}
                          className="w-full bg-primary text-white p-2 rounded-md"
                          disabled={generating}
                        >
                          {generating
                            ? "Generating..."
                            : "Generate Referral Code"}
                        </button>
                      )}
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
                        <UploadPicture
                          onFileChange={handleProfilePictureChange}
                        />
                        {profilePicture && (
                          <div className="flex justify-center items-center mx-auto">
                            <Button
                              onClick={handleUpdatePhoto}
                              variant={"gradient"}
                              className="mt-3   text-white py-2 px-6 rounded-full"
                            >
                              {updatePhotoLoading
                                ? "Updating..."
                                : "Update Photo"}
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "wallet" && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4">Wallet Balances</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* USD Card */}
                  <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center space-x-4">
                    <div>
                      <p className="font-semibold">USD Balance</p>
                      <p className="text-lg">${user?.wallet_balance_usd}</p>
                    </div>
                  </div>

                  {/* NGN Card */}
                  <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center space-x-4">
                    <div>
                      <p className="font-semibold">NGN Balance</p>
                      <p className="text-lg">₦{user?.wallet_balance_ngn}</p>
                    </div>
                  </div>

                  {/* GBP Card */}
                  <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center space-x-4">
                    <div>
                      <p className="font-semibold">GBP Balance</p>
                      <p className="text-lg">£{user?.wallet_balance_gbp}</p>
                    </div>
                  </div>
                </div>
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
