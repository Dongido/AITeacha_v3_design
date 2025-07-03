import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
export type SelectedTestType = "test" | "exam" | null;

interface UiState {
  selectedTestType: SelectedTestType;
}

const initialState: UiState = {
  selectedTestType: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSelectedTestType: (state, action: PayloadAction<SelectedTestType>) => {
      state.selectedTestType = action.payload;
    },
  },
});

export const { setSelectedTestType } = uiSlice.actions;

export const selectSelectedTestType = (state: RootState) =>
  state.ui.selectedTestType;

export default uiSlice.reducer;
