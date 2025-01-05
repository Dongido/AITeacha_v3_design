import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  fetchHeroesWallThunk,
  createHeroesWallThunk,
  updateHeroesWallThunk,
  deleteHeroesWallThunk,
  updateHeroesWallThumbnailThunk,
} from "../../store/slices/HeroesWallSlice";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/Dialogue";
import { AppDispatch } from "../../store";
import { Button } from "../../components/ui/Button";
import { Plus, Trash, Edit } from "lucide-react";

const HeroesWallAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { heroesWall, loading, error, creating, updating, deleting } =
    useSelector((state: RootState) => state.heroesWall);

  const [selectedWall, setSelectedWall] = useState<any>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    post_url: "",
    source: "",
    // thumbnail: null as File | null,
  });

  useEffect(() => {
    // Fetch heroes wall data when the component mounts
    dispatch(fetchHeroesWallThunk());
  }, [dispatch]);

  const handleCreate = async () => {
    // if (!formData.thumbnail) {
    //   console.error("Thumbnail is required.");
    //   return;
    // }

    const res = await dispatch(
      createHeroesWallThunk(formData as { post_url: string; source: string })
    );

    console.log(res);
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(fetchHeroesWallThunk());
      setFormData({ post_url: "", source: "" });
      setCreateDialogOpen(false);
    } else {
      console.error("Failed to create hero wall post:");
    }

    setFormData({ post_url: "", source: "" });
    setCreateDialogOpen(false);
  };

  const handleEdit = async () => {
    if (selectedWall) {
      console.log(formData);
      await dispatch(
        updateHeroesWallThunk({
          id: selectedWall.id,
          data: {
            post_url: formData.post_url,
            source: formData.source,
            status: selectedWall.status, // Keep the status unchanged
          },
        })
      );

      // if (formData.thumbnail) {
      //   const image = await dispatch(
      //     updateHeroesWallThumbnailThunk({
      //       id: selectedWall.id,
      //       thumbnail: formData.thumbnail,
      //     })
      //   );
      //   console.log(image);
      // }

      dispatch(fetchHeroesWallThunk()); // Refresh data
      setEditDialogOpen(false);
      setSelectedWall(null);
    }
  };

  const handleDelete = async () => {
    if (selectedWall) {
      await dispatch(deleteHeroesWallThunk(selectedWall.id));
      dispatch(fetchHeroesWallThunk());
      setDeleteDialogOpen(false);
      setSelectedWall(null);
    }
  };

  return (
    <div className="mt-12">
      <div className="flex w-full mt-12 mb-6 items-center justify-between flex-col sm:flex-row">
        <h2 className="text-xl font-medium text-gray-900 sm:mb-0 mb-4">
          Welcome Back! 👋 Heroes Wall
        </h2>
        <Button
          variant="gradient"
          className="flex items-center gap-3 rounded-md"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus size={"1.1rem"} />
          Add Post
        </Button>
      </div>

      <div className="mt-6">
        {loading && <p>Loading posts...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!heroesWall ? (
          <p className="text-gray-500 text-center">No posts found.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {heroesWall.map((wall) => {
              const thumbnailUrl = wall.thumbnail
                ? wall.thumbnail.startsWith("/home/icedtonline/")
                  ? `https://${wall.thumbnail.replace(
                      "/home/icedtonline/",
                      ""
                    )}`
                  : wall.thumbnail
                : "";
              console.log(thumbnailUrl);

              return (
                <li
                  key={wall.id}
                  className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between items-start"
                >
                  {/* Thumbnail Preview */}
                  {wall.thumbnail ? (
                    <img
                      src={`${thumbnailUrl}`}
                      alt={thumbnailUrl}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md">
                      <p className="text-gray-500 text-sm">No Image</p>
                    </div>
                  )}

                  {/* Post Information */}
                  <div className="mt-4 flex flex-col w-full">
                    <p className="font-medium text-sm truncate">
                      {wall.post_url.length > 20
                        ? `${wall.post_url.slice(0, 20)}...`
                        : wall.post_url}
                    </p>
                    <p className="text-lg text-gray-500">{wall.source}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 w-full">
                    <Button
                      variant="outline"
                      className="flex items-center rounded-md gap-2 w-full"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent link redirection
                        setSelectedWall(wall);
                        setFormData({
                          post_url: wall.post_url,
                          source: wall.source,
                          //    thumbnail: null,
                        });
                        setEditDialogOpen(true);
                      }}
                      //    disabled={updating}
                    >
                      <Edit size={16} />
                      {"Edit"}
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex items-center rounded-md gap-2 w-full"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent link redirection
                        setSelectedWall(wall);
                        setDeleteDialogOpen(true);
                      }}
                      //  disabled={deleting}
                    >
                      <Trash size={16} />
                      {"Delete"}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new post.
            </DialogDescription>
          </DialogHeader>
          <form>
            <input
              type="text"
              placeholder="Post URL"
              className="w-full p-2 border rounded-md mb-2"
              value={formData.post_url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, post_url: e.target.value }))
              }
            />
            <select
              className="w-full p-2 border rounded-md mb-2"
              value={formData.source}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, source: e.target.value }))
              }
            >
              <option value="">Select a source</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
            </select>

            {/* <input
              type="file"
              className="w-full p-2 border rounded-md"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  thumbnail: e.target.files ? e.target.files[0] : null,
                }))
              }
            /> */}
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Update the details of this post.
            </DialogDescription>
          </DialogHeader>
          <form>
            <input
              type="text"
              placeholder="Post URL"
              className="w-full p-2 border rounded-md mb-2"
              value={formData.post_url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, post_url: e.target.value }))
              }
            />
            <select
              className="w-full p-2 border rounded-md mb-2"
              value={formData.source}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, source: e.target.value }))
              }
            >
              <option value="">Select a source</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
            </select>

            {/* <input
              type="file"
              className="w-full p-2 border rounded-md"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  thumbnail: e.target.files ? e.target.files[0] : null,
                }))
              }
            /> */}
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleEdit} disabled={updating}>
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroesWallAdmin;
