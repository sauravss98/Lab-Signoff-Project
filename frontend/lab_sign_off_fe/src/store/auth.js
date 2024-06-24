import { createSlice } from "@reduxjs/toolkit";
const initialAuthState = {
  isAuthenticated: false,
  user_type: "",
  first_name: "",
  last_name: "",
  email: "",
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user_type = action.payload.user_type;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.email = action.payload.email;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user_type = undefined;
      state.first_name = "";
      state.last_name = "";
      state.email = "";
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
