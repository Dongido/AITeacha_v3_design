// src/features/result/resultSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { filterExam, getAllSubject } from "../../api/result";



interface ResultState {
  results: any[];
  subject:any[]
  loading: boolean;
  error: string | null;
}

const initialState: ResultState = {
  results: [],
  subject: [],
  loading: false,
  error: null,
};


export const fetchResults = createAsyncThunk(
  "result/fetchResults",
  async ({ grade,session,term,source, subject}:{ grade:string,session:number,source?:string, term:number, subject?:string}, { rejectWithValue }) => {
    try {
      const res = await filterExam({grade, session, term, source,subject})
      return res
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch results");
    }
  }
);

export const allSubject = createAsyncThunk("result/subject", 
async(__dirname, { rejectWithValue }) => {
    try {
        const response = await  getAllSubject()
        return response
    } catch (error:any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch subject");  
    }

})

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload || [];
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(allSubject.pending , (state, action) => {
        state.loading = true
        state.error = null;
      })
      .addCase(allSubject.fulfilled, (state, action) => {
        state.loading = false 
        state.subject = action.payload || []
      })
      .addCase(allSubject.rejected, (state, action) => {
        state.loading = false,
        state.error = action.payload as string;
      })
      ;
  },
});

export const { clearResults } = resultSlice.actions;
export default resultSlice.reducer;
