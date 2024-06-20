import { createSlice } from "@reduxjs/toolkit";
import { getAuthToken } from "../utils/token";

const initialAuthState = { isAuthenticated: false, token: "" };
const newToken = getAuthToken();

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
      if (state.token) {
        state.token = newToken;
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = "";
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
