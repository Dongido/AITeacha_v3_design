import apiClient from "../lib/apiClient";

export interface HeroesWall {
  id: number;
  post_url: string;
  source: string;
  thumbnail: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export const fetchHeroesWall = async (): Promise<HeroesWall[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: HeroesWall[];
    }>("/home/display/heroeswalls");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch heroes wall. Please try again."
    );
  }
};

// Create a new heroes wall entry
export const createHeroesWall = async (data: {
  post_url: string;
  source: string;
  thumbnail?: File | null;
}): Promise<HeroesWall> => {
  try {
    const formData = new FormData();
    formData.append("post_url", data.post_url);
    formData.append("source", data.source);
    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    const response = await apiClient.post<{
      status: string;
      message: string;
      data: HeroesWall;
    }>("/admin/add/heroeswall", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to create heroes wall. Please try again."
    );
  }
};

// Update an existing heroes wall entry (excluding thumbnail)
export const updateHeroesWall = async (
  id: number,
  data: {
    post_url: string;
    source: string;
    status: string;
  }
): Promise<HeroesWall> => {
  try {
    const response = await apiClient.put<{
      status: string;
      message: string;
      data: HeroesWall;
    }>(`/admin/update/heroeswall/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to update heroes wall. Please try again."
    );
  }
};

// Update the thumbnail of an existing heroes wall entry
export const updateHeroesWallThumbnail = async (
  id: number,
  thumbnail: File
): Promise<HeroesWall> => {
  try {
    const formData = new FormData();
    formData.append("thumbnail", thumbnail);

    const response = await apiClient.put<{
      status: string;
      message: string;
      data: HeroesWall;
    }>(`/admin/update/heroeswall/image/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to update heroes wall thumbnail. Please try again."
    );
  }
};
// Delete a heroes wall entry
export const deleteHeroesWall = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/admin/delete/heroeswall/${id}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to delete heroes wall. Please try again."
    );
  }
};
