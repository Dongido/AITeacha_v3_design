import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  HeroesWall,
  fetchHeroesWall,
  createHeroesWall,
  updateHeroesWall,
  deleteHeroesWall,
  updateHeroesWallThumbnail, // New API for updating thumbnail
} from "../../api/heroeswall";

interface HeroesWallState {
  heroesWall: HeroesWall[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: HeroesWallState = {
  heroesWall: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
};

// Fetch Heroes Wall Thunk
export const fetchHeroesWallThunk = createAsyncThunk(
  "heroesWall/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchHeroesWall();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create Heroes Wall Thunk
export const createHeroesWallThunk = createAsyncThunk(
  "heroesWall/create",
  async (
    data: { post_url: string; source: string; thumbnail?: File },
    { rejectWithValue }
  ) => {
    try {
      return await createHeroesWall(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Heroes Wall Thunk
export const updateHeroesWallThunk = createAsyncThunk(
  "heroesWall/update",
  async (
    {
      id,
      data,
    }: {
      id: number;
      data: {
        post_url: string;
        source: string;
        status: string;
        // thumbnail?: File | null;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      return await updateHeroesWall(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Heroes Wall Thumbnail Thunk
export const updateHeroesWallThumbnailThunk = createAsyncThunk(
  "heroesWall/updateThumbnail",
  async (
    { id, thumbnail }: { id: number; thumbnail: File },
    { rejectWithValue }
  ) => {
    try {
      return await updateHeroesWallThumbnail(id, thumbnail);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Heroes Wall Thunk
export const deleteHeroesWallThunk = createAsyncThunk(
  "heroesWall/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteHeroesWall(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const heroesWallSlice = createSlice({
  name: "heroesWall",
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchHeroesWallThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchHeroesWallThunk.fulfilled,
        (state, action: PayloadAction<HeroesWall[]>) => {
          state.loading = false;
          state.heroesWall = action.payload;
        }
      )
      .addCase(
        fetchHeroesWallThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      // Create
      .addCase(createHeroesWallThunk.pending, (state) => {
        state.creating = true;
      })
      .addCase(
        createHeroesWallThunk.fulfilled,
        (state, action: PayloadAction<HeroesWall>) => {
          state.creating = false;
          //    state.heroesWall.push(action.payload);
        }
      )
      .addCase(
        createHeroesWallThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.creating = false;
          state.error = action.payload;
        }
      )
      // Update
      .addCase(updateHeroesWallThunk.pending, (state) => {
        state.updating = true;
      })
      .addCase(
        updateHeroesWallThunk.fulfilled,
        (state, action: PayloadAction<HeroesWall>) => {
          state.updating = false;
          state.heroesWall = state.heroesWall.map((wall) =>
            wall.id === action.payload.id ? action.payload : wall
          );
        }
      )
      .addCase(
        updateHeroesWallThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.updating = false;
          state.error = action.payload;
        }
      )
      // Update Thumbnail
      .addCase(updateHeroesWallThumbnailThunk.pending, (state) => {
        state.updating = true;
      })
      .addCase(
        updateHeroesWallThumbnailThunk.fulfilled,
        (state, action: PayloadAction<HeroesWall>) => {
          state.updating = false;
          state.heroesWall = state.heroesWall.map((wall) =>
            wall.id === action.payload.id ? action.payload : wall
          );
        }
      )
      .addCase(
        updateHeroesWallThumbnailThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.updating = false;
          state.error = action.payload;
        }
      )
      // Delete
      .addCase(deleteHeroesWallThunk.pending, (state) => {
        state.deleting = true;
      })
      .addCase(
        deleteHeroesWallThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.deleting = false;
          state.heroesWall = state.heroesWall.filter(
            (wall) => wall.id !== action.payload
          );
        }
      )
      .addCase(
        deleteHeroesWallThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.deleting = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetError } = heroesWallSlice.actions;

export default heroesWallSlice.reducer;
