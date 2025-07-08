import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ChatUser, CreateStaffTopic, CreateStudentTopic, getAllStaffTopic, getAllStudentTopic, getforumConversationByforumId, 
  getforumConversationById, getMessage,  getmessageCount,  getParticipant,  getpremiumUser,  getuserChats,  getUserRoles, getZaraChats,  Message, Topics, unreadChat, unreadMessage, ZyraChat, ZyraType  } from "../../api/staffchat";


export type CreateTopicPayload = {
  category: string;
  topic: string;
  description: string,
  thumbnail?: File | null,
  content_from:string,
  classroom_id?:string,
  team_host_id?:string,
};

export type PremiumUsertype = {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  imageurl: string | null;
  organization: string;
  host_team_id: number;
};


interface StaffTopicState {
  topics: Topics[];
  studentTopic: Topics[];
  loading: boolean;
  conversation: any[];
  selectedTopic: any | null;
  error: string | null;
  checkuser:PremiumUsertype[]
  userRole:any | null
  zyrachat:string | null
  zaraloding:boolean
  message:Message[] 
  participant:any[]
  userChat:ChatUser[] 
  messageCount: any[];
  unreadMessageCount: any | null;
}

const initialState: StaffTopicState = {
  topics: [],
  studentTopic:[],
  conversation: [],
  selectedTopic: null,
  loading: false,
  error: null,
  checkuser: [],
  userRole:null,
  zyrachat:null,
  zaraloding:false,
  message: [],
  participant:[],
  userChat:[],
  messageCount: [],
  unreadMessageCount: null,
};

// 🔁 GET all topics
export const getAllStaffTopics = createAsyncThunk(
  "staffTopic/getAllStaffTopics",
  async (id: string, { rejectWithValue }) => {
    try {
      const topics = await getAllStaffTopic(id);
      return topics;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch topics.");
    }
  }
);

export const getAllStudentTopics = createAsyncThunk(
  "staffTopic/getAllStudentTopics",
  async (id: string, { rejectWithValue }) => {
    try {
      const topics = await getAllStudentTopic(id);
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

// get create student topic
export const createStudentTopics = createAsyncThunk(
  "staffTopic/createStudentTopics",
  async (payload: CreateTopicPayload, { rejectWithValue }) => {
    try {
      const topic = await  CreateStudentTopic(payload);
      //  console.log(topic ,"topics")
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

// premiumusers 
export const getpremiumUsers = createAsyncThunk<PremiumUsertype[], void, { rejectValue: string }>(
  "staffTopic/getpremiumUsers",
  async (_, thunkAPI) => {
    try {
      const premiumUsers = await getpremiumUser(); 
      return premiumUsers;  
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch premium users.");
    }
  }
);

//  get user role 
export const getUserRole = createAsyncThunk("staffTopic/getuserrole", async(id: string, { rejectWithValue }) => {
  try {
    const roles = await getUserRoles(id); 
    const role = roles.length > 0 ? roles[0] : null; 
    return role;
  } catch (error: any) {
    return rejectWithValue(error.message || "failed to get user role");
  }
});

 export const createZyraChat = createAsyncThunk("staffTopic/createzyra", async(payload:ZyraType, {rejectWithValue}) => {
  try {
    const  response = await  ZyraChat(payload) 
    return response
  } catch (error:any) {
    
    return rejectWithValue(error.message || "failed to get create zyra chat");
  }
 })

//  get  chat
  export const getMessages = createAsyncThunk("staffTopic/getmessage" , async(payload:getZaraChats, {rejectWithValue}) => {
    try {
      const response = await getMessage(payload)
      return response
    } catch (error:any) {
       return rejectWithValue(error.message || "failed to get chat");  
    }

  })

   export const getParticipants  = createAsyncThunk("staffTopic/participant", async(payload:number , {rejectWithValue}) => {
     try {
      const response = await  getParticipant(payload)
      return response  
     } catch (error:any) {
        return rejectWithValue(error.message || "failed to get chat");  
     }
   })

export const getuserChat = createAsyncThunk(
  "staffTopic/userchat",
  async (_, thunkAPI) => {
    try {
      const response = await getuserChats();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to get chat");
    }
  }
);

// unread message count
   export const unreadMessageCounts  = createAsyncThunk("staffTopic/messagecount", async(payload:any , {rejectWithValue}) => {
     try {
      const response = await  unreadMessage(payload)
      return response  
     } catch (error:any) {
        return rejectWithValue(error.message || "failed to unread message count");  
     }
   })

   // unread message count
   export const  getCount   = createAsyncThunk("staffTopic/unreadmessage", async(_, {rejectWithValue}) => {
     try {
      const response = await  getmessageCount()
      return response  
     } catch (error:any) {
        return rejectWithValue(error.message || "failed to get chat count");  
     }
   })

 

   

 




 


export const staffTopicSlice = createSlice({
  name: "staffTopic",
  initialState,
  reducers: {
  resetZyraChat(state) {
  state.zyrachat = null
  },
  resetConversation(state){
   state.conversation = [] 
  },
  resetParticipant(state){
   state.participant = [] 
  }
  },
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

      // get student topic getAllStudentTopics
       .addCase(getAllStudentTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStudentTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.studentTopic = action.payload;
      })
      .addCase(getAllStudentTopics.rejected, (state, action) => {
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


    // check premium user
     .addCase(getpremiumUsers.pending, (state) => {
      state.loading = true
      state.error = null
     })
     .addCase(getpremiumUsers.fulfilled, (state, action) => {
       state.loading = false
       state.checkuser = action.payload
     })
     .addCase(getpremiumUsers.rejected , (state, action) => {
      state.loading = false 
      state.error = action.payload as string
     })


      // get chat count
     .addCase(getCount.pending, (state) => {
      state.loading = true
      state.error = null
     })
     .addCase(getCount.fulfilled, (state, action) => {
       state.loading = false
       state.messageCount = action.payload
     })
     .addCase(getCount.rejected , (state, action) => {
      state.loading = false
      state.error = action.payload as string
     })


      // get chat count
     .addCase(unreadMessageCounts.pending, (state) => {
      state.loading = true
      state.error = null
     })
     .addCase(unreadMessageCounts.fulfilled, (state, action) => {
       state.loading = false
       state.unreadMessageCount = action.payload
     })
     .addCase(unreadMessageCounts.rejected , (state, action) => {
      state.loading = false
      state.error = action.payload as string
     })


    //  get user role
    .addCase(getUserRole.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(getUserRole.fulfilled, (state, action) => {
      state.loading = false
      state.userRole = action.payload
    })
    .addCase(getUserRole.rejected , (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // create zyra chat 
    .addCase(createZyraChat.pending, (state) => {
      state.zaraloding = true
      state.error = null
    })
    .addCase(createZyraChat.fulfilled, (state, action) => {
      state.zaraloding = false
      state.zyrachat = action.payload
    })
    .addCase(createZyraChat.rejected, (state, action) => {
      state.zaraloding = false
      state.error = action.payload as string
    })

    // get all message 
    .addCase(getMessages.pending , (state) =>{
      state.loading = true
      state.error = null
    })
    .addCase(getMessages.fulfilled, (state, action) => {
      state.loading = false
      state.message = action.payload
    })
    .addCase(getMessages.rejected , (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // get user chats
    .addCase(getuserChat.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(getuserChat.fulfilled, (state,action) => {
      state.loading = false,
      state.userChat = action.payload
    })
    .addCase(getuserChat.rejected, (state, action) => {
      state.loading = false,
      state.error = action.payload as string
    })


    // getparticipant
    .addCase(getParticipants.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(getParticipants.fulfilled, (state, action) => {
      state.loading = false
      state.participant = action.payload
    })
    .addCase(getParticipants.rejected , (state, action) => {
      state.loading = false 
      state.error = action.payload as string
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

    })
    
    // Handle CREATE student topic
    .addCase(createStudentTopics.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createStudentTopics.fulfilled, (state, action) => {
      state.loading = false;
      state.studentTopic.push(action.payload);
    })
    .addCase(createStudentTopics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    

      
  },
});

export default staffTopicSlice.reducer;
export const { resetZyraChat , resetConversation, resetParticipant } = staffTopicSlice.actions;

