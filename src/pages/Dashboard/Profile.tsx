import React, { useState, useEffect, useRef, useMemo } from "react";
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
import ChangePasswordDialog from "../../components/layout/ChangePasswordDialog";
import Withdrawals from "./_components/Withdrawals";
import { fetchBalance } from "../../api/bankaccount";
import { Skeleton } from "../../components/ui/Skeleton";

import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";

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
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [walletBalances, setWalletBalances] = useState<any>({
    usd: 0,
    ngn: 0,
    gbp: 0,
  });
  const [isFetchingBalance, setIsFetchingBalance] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const allCountries: ICountry[] = useMemo(() => Country.getAllCountries(), []);

  const statesOfSelectedCountry: IState[] = useMemo(() => {
    if (selectedCountryCode) {
      return State.getStatesOfCountry(selectedCountryCode);
    }
    return [];
  }, [selectedCountryCode]);

  const citiesOfSelectedState: ICity[] = useMemo(() => {
    if (selectedCountryCode && selectedStateCode) {
      return City.getCitiesOfState(selectedCountryCode, selectedStateCode);
    }
    return [];
  }, [selectedCountryCode, selectedStateCode]);

  const userDetails = JSON.parse(
    localStorage.getItem("ai-teacha-user") || "{}"
  );

  useEffect(() => {
    if (activeTab === "wallet" && userDetails.role_id !== 3) {
      handleFetchBalance();
    }
  }, [activeTab, userDetails.role_id]);

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
      setGender(user.gender || "");
      setSelectedCountryCode(user.country || "");
      setSelectedStateCode(user.state || "");
      setSelectedCityName(user.city || "");
    }
  }, [user]);

  const handleFetchBalance = async () => {
    setIsFetchingBalance(true);
    setBalanceError(null);
    try {
      const data = await fetchBalance();
      setWalletBalances(data[0]);
    } catch (err: any) {
      setBalanceError(err.message || "Failed to load balance.");
    } finally {
      setIsFetchingBalance(false);
    }
  };

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
          gender,
          country: selectedCountryCode, // Send ISO code
          state: selectedStateCode, // Send ISO code
          city: selectedCityName,
        })
      ).unwrap();
      await dispatch(loadUserProfile()).unwrap();

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

  const handleCancel = () => {
    if (user) {
      setFirstName(user.firstname || "");
      setLastName(user.lastname || "");
      setPhone(user.phone || "N/A");
      setEmail(user.email || "N/A");
      setAbout(user.about || "N/A");
      setReferral_code(user.referral_code || "");
      setRole(user.role_id || 3);
      setGender(user.gender || "");

      // Reset to user's country and state ISO codes
      setSelectedCountryCode(user.country || "");
      setSelectedStateCode(user.state || "");
      setSelectedCityName(user.city || "");
    }
    setProfilePicture(null);
    setEditMode(false);
  };

  const passwordDialogRef = useRef<any>(null);

  const getCountryDisplayName = (isoCode: string) => {
    const country = allCountries.find((c) => c.isoCode === isoCode);
    return country ? country.name : "N/A";
  };

  const getStateDisplayName = (stateCode: string, countryCode: string) => {
    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    return state ? state.name : "N/A";
  };
  const isStudent = (userDetails.role_id || userDetails.role) === 3;

  return (
    <ToastProvider>
      <div className="container mx-auto mt-3  p-3 ">
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
                    ? "bg-purple-50"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile Details
              </button>
              {!isStudent && (
                <button
                  className={`px-4 py-2 rounded-t-lg ${
                    activeTab === "wallet"
                      ? "bg-purple-50"
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
                  <div className="flex-1 p-3 rounded-md border bg-white border-gray-200">
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
                          className="w-full rounded-full"
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
                          className="w-full rounded-full"
                          readOnly={!editMode}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Phone
                        </label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your Phone Number"
                          className="w-full rounded-full"
                          readOnly={!editMode}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Email
                        </label>
                        <Input
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full rounded-full"
                          readOnly
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Country
                        </label>
                        {editMode ? (
                          <select
                            id="country"
                            value={selectedCountryCode}
                            onChange={(e) => {
                              setSelectedCountryCode(e.target.value);
                              setSelectedStateCode("");
                              setSelectedCityName("");
                            }}
                            className="w-full border p-2 rounded-full border-gray-300"
                          >
                            <option value="">Select Country</option>
                            {allCountries.map((country) => (
                              <option
                                key={country.isoCode}
                                value={country.isoCode}
                              >
                                {country.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            id="country"
                            value={getCountryDisplayName(selectedCountryCode)}
                            readOnly
                            className="w-full rounded-full"
                          />
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          State
                        </label>
                        {editMode ? (
                          <select
                            id="state"
                            value={selectedStateCode}
                            onChange={(e) => {
                              setSelectedStateCode(e.target.value);
                              setSelectedCityName("");
                            }}
                            className="w-full border p-2 rounded-full border-gray-300"
                            disabled={!selectedCountryCode}
                          >
                            <option value="">Select State</option>
                            {statesOfSelectedCountry.map((state) => (
                              <option key={state.isoCode} value={state.isoCode}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            id="state"
                            value={getStateDisplayName(
                              selectedStateCode,
                              selectedCountryCode
                            )}
                            readOnly
                            className="w-full rounded-full"
                          />
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          City
                        </label>
                        {editMode ? (
                          <select
                            id="city"
                            value={selectedCityName}
                            onChange={(e) =>
                              setSelectedCityName(e.target.value)
                            }
                            className="w-full rounded-full border p-2  border-gray-300"
                            disabled={!selectedStateCode}
                          >
                            <option value="">Select City</option>
                            {citiesOfSelectedState.map((city) => (
                              <option key={city.name} value={city.name}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            id="city"
                            value={selectedCityName || "N/A"}
                            readOnly
                            className="w-full rounded-full"
                          />
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="gender"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Gender
                        </label>
                        {editMode ? (
                          <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full border p-2 rounded-full border-gray-300"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <Input
                            id="gender"
                            value={gender || "N/A"}
                            readOnly
                            className="w-full rounded-full"
                          />
                        )}
                      </div>
                    </div>

                    <div className="mb-2">
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Role
                      </label>
                      <p className="w-full border p-2 rounded-full border-gray-300 bg-gray-100">
                        {role === 3
                          ? "Student"
                          : role === 2
                          ? "Educator"
                          : role === 1
                          ? "Admin"
                          : role === 4
                          ? "School"
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
                          <p className="w-full border p-2 rounded-full border-gray-300 bg-gray-100">
                            {referral_code}
                          </p>
                          <button
                            onClick={handleCopyReferralLink}
                            className="w-full bg-primary text-white p-2 rounded-full"
                          >
                            {copied ? "Copied!" : "Copy Referral Link"}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={generateReferralCode}
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
                        htmlFor="about"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        About
                      </label>
                      <TextArea
                        id="about"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Write about yourself"
                        className="w-full"
                        readOnly={!editMode}
                      />
                    </div>
                    <hr className="my-6 border-t border-gray-300" />

                    <div className="flex justify-end">
                      <button
                        className="bg-primary text-white py-2 px-4 rounded-md"
                        onClick={() => passwordDialogRef.current?.openDialog()}
                      >
                        Change Password
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-72 flex items-center justify-center flex-col gap-4 lg:w-1/3 bg-white p-6 rounded-md shadow-sm">
                    
                    {!editMode ? (
                      <>
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

                        <h3 className="text-lg text-center font-semibold mb-4">
                      Profile Picture
                    </h3>
                    </>
                    ) : (
                      <div className="flex flex-col items-center">
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

                        
                        <h3 className="text-lg text-center font-semibold mb-4">
                      Profile Picture
                    </h3>
                      <div className="">

                        <UploadPicture
                          onFileChange={handleProfilePictureChange}
                          />
                        {profilePicture && (
                          <div className="flex justify-center items-center mx-auto">
                            <Button
                              onClick={handleUpdatePhoto}
                              className="mt-3  text-white py-2 px-6 "
                              >
                              {updatePhotoLoading
                                ? "Updating..."
                                : "Update Photo"}
                            </Button>
                          </div>
                        )}
                        </div>
                      </div>
                    )}

                  

                  </div>
                </div>
              </>
            )}

            {activeTab === "wallet" && (
              <div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Wallet Balances</h2>
                    <button
                      onClick={handleFetchBalance}
                      disabled={isFetchingBalance}
                      className="px-4 py-2 bg-purple-50 rounded-full text-black font-bold  "
                    >
                      {isFetchingBalance ? "Refreshing..." : "Refresh Balance"}
                    </button>
                  </div>
                  {balanceError && (
                    <p className="text-red-600 mb-4">{balanceError}</p>
                  )}
                  {isFetchingBalance ? (
                    <tr>
                      {[...Array(6)].map((_, index) => (
                        <th key={index} className="p-4 border-b">
                          <Skeleton className="h-4 w-20 rounded" />
                        </th>
                      ))}
                    </tr>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center space-x-4">
                        <div>
                          <p className="font-semibold">USD Balance</p>
                          <p className="text-lg">
                            ${walletBalances.wallet_balance_usd?.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center space-x-4">
                        <div>
                          <p className="font-semibold">NGN Balance</p>
                          <p className="text-lg">
                            ₦{walletBalances.wallet_balance_ngn?.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center space-x-4">
                        <div>
                          <p className="font-semibold">GBP Balance</p>
                          <p className="text-lg">
                            £{walletBalances.wallet_balance_gbp?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Withdrawals />
              </div>
            )}
          </>
        )}
        <ChangePasswordDialog
          ref={passwordDialogRef}
          onChangePassword={async (current, newPass) => {}}
        />
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
