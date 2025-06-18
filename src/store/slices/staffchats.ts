import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateStaffTopic, getAllStaffTopic, getforumConversationByforumId, getforumConversationById, Topics  } from "../../api/staffchat";

export type CreateTopicPayload = {
  category: string;
  topic: string;
  description: string,
  thumbnail?: File | null
};

interface StaffTopicState {
  topics: Topics[];
  loading: boolean;
   conversation: any[];
  selectedTopic: any | null;
  error: string | null;
}

const initialState: StaffTopicState = {
  topics: [],
  conversation: [],
  selectedTopic: null,
  loading: false,
  error: null,
};

// 🔁 GET all topics
export const getAllStaffTopics = createAsyncThunk(
  "staffTopic/getAllStaffTopics",
  async (_, { rejectWithValue }) => {
    try {
      const topics = await getAllStaffTopic();
      return topics;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch topics.");
    }
  }
);


//  GET all topics
export const getsingleforumById = createAsyncThunk(
  "staffTopic/getforumById",
  async (id: string, { rejectWithValue }) => {
    try {
      const topic = await getforumConversationById(id);
      return topic;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch topic.");
    }
  }
);

//  CREATE topic

export const createStaffTopic = createAsyncThunk(
  "staffTopic/createStaffTopic",
  async (payload: CreateTopicPayload, { rejectWithValue }) => {
    try {
      const topic = await CreateStaffTopic(payload);
       console.log(topic ,"topics")
      return topic;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create topic.");
    }
  }
);



// get forum conversation
export const getForumConversation = createAsyncThunk(
  "staffTopic/getForumConversation",
  async (id: string, { rejectWithValue }) => {
    try {
      const topicConversation = await getforumConversationByforumId(id);
      return topicConversation;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch conversation.");
    }
  }
);


export const staffTopicSlice = createSlice({
  name: "staffTopic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle GET
      .addCase(getAllStaffTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStaffTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(getAllStaffTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // get forum by id
      .addCase(getsingleforumById.pending, (state) => {
      state.loading = true;
      state.error = null;
     })
    .addCase(getsingleforumById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedTopic = action.payload; 
    })
    .addCase(getsingleforumById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

      // get forum conversation by forum ID
    .addCase(getForumConversation.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getForumConversation.fulfilled, (state, action) => {
      state.loading = false;
      state.conversation = action.payload; // or store in a separate `conversation` state if needed
    })
    .addCase(getForumConversation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    // Handle CREATE
    .addCase(createStaffTopic.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createStaffTopic.fulfilled, (state, action) => {
      state.loading = false;
      state.topics.push(action.payload);
    })
    .addCase(createStaffTopic.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

      //  get single forum conversation
        

      

      
  },
});

export default staffTopicSlice.reducer;
