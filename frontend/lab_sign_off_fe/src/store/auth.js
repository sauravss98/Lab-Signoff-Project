import { createSlice } from "@reduxjs/toolkit";
import { getAuthToken } from "../utils/token";

const initialAuthState = {
  isAuthenticated: false,
  token: "",
  user_type: undefined,
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = getAuthToken();
      state.user_type = action.payload.user_type;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = "";
      state.user_type = undefined;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
