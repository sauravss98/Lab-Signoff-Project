import { createSlice } from "@reduxjs/toolkit";

const initialSettingsState = {
  selected_settings: "user_profile",
};

const settingSlice = createSlice({
  name: "settingsPage",
  initialState: initialSettingsState,
  reducers: {
    setSelectedSettings(state, action) {
      state.selected_settings = action.payload;
    },
  },
});

export const { setSelectedSettings } = settingSlice.actions;
export default settingSlice.reducer;
