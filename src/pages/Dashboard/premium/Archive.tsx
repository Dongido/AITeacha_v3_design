import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../../../store";
import {
  fetchArchivedAssistantsThunk,
  removeArchivedAssistantThunk,
  uploadArchivedAssistantThunk,
} from "../../../store/slices/archivedAssistantsSlice";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/Dialogue";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import GeneralRestrictedPage from "../_components/GeneralRestrictedPage";
import { useNavigate } from "react-router-dom";

const ArchivedAssistants = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { archivedAssistants, loading, error } = useSelector(
    (state: RootState) => state.archivedAssistants
  );
  const navigate = useNavigate();

  const [deleteRef, setDeleteRef] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
  const [userDetails, setUserDetails] = useState<any>(null);
  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      console.log(parsedDetails);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }
  }, []);
  useEffect(() => {
    dispatch(fetchArchivedAssistantsThunk());
  }, [dispatch]);

  const handleDelete = () => {
    if (deleteRef) {
      setIsDeleting(true);
      dispatch(removeArchivedAssistantThunk(deleteRef))
        .then(() => dispatch(fetchArchivedAssistantsThunk()))
        .finally(() => {
          setDeleteRef(null);
          setIsDeleting(false);
        });
    }
  };

  const handleVerifyEmail = () => {
    navigate("/dashboard/verify-email");
  };

  const handleUpload = () => {
    if (uploadTitle && uploadFile.length > 0) {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("title", uploadTitle);
      uploadFile.forEach((file) => formData.append("documents", file));

      dispatch(uploadArchivedAssistantThunk(formData))
        .then(() => dispatch(fetchArchivedAssistantsThunk()))
        .finally(() => {
          setUploadTitle("");
          setUploadFile([]);
          setIsUploading(false);
        });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 mt-12 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (
    error === "Permission restricted: upgrade to premium account to gain access"
  ) {
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
        <GeneralRestrictedPage error={error} />
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
        <GeneralRestrictedPage error={error} />
      </div>
    );
  }
  if (error === "Permission restricted: email not verified") {
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
        <GeneralRestrictedPage error={error} />
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
    <div className="mt-6">
      <h2>Archived Assistants</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="my-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"gradient"} className="rounded-md">
              Upload Archive
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Upload Doc</DialogTitle>
            <Input
              type="text"
              placeholder="Title"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />

            <input
              type="file"
              multiple
              accept=".pdf, .png, .jpeg, .jpg, .doc, .docx"
              onChange={(e) => {
                const files = Array.from(e.target.files || []).filter((file) =>
                  [
                    "application/pdf",
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ].includes(file.type)
                );

                if (files.length === 0) {
                  alert(
                    "Only PDF, PNG, JPEG, DOC, and DOCX files are allowed."
                  );
                  return;
                }

                setUploadFile(files);
              }}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant={"destructive"}
                  className="rounded-md"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleUpload}
                className="rounded-md"
                disabled={!uploadTitle || !uploadFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {archivedAssistants.map((assistant: any) => (
          <div
            key={assistant.ref}
            className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white"
          >
            <h3 className="text-lg font-semibold">{assistant.title}</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setDeleteRef(assistant.ref)}
                  variant="destructive"
                  className="mt-4 rounded-md"
                >
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this archived assistant?
                </DialogDescription>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="rounded-md"
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    className="rounded-md"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Confirm"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchivedAssistants;
