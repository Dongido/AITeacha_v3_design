import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ResponseState {
  message: string | null;
}

const initialState: ResponseState = {
  message: null,
};

const responseSlice = createSlice({
  name: "response",
  initialState,
  reducers: {
    setGlobalResponseMessage: (state, action: PayloadAction<string | null>) => {
      state.message = action.payload;
    },
  },
});

export const { setGlobalResponseMessage } = responseSlice.actions;
export default responseSlice.reducer;
