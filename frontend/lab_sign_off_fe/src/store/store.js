import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import settingsPageReducer from "./settingsPageState";

const store = configureStore({
  reducer: { auth: authReducer, settingsPage: settingsPageReducer },
});

export default store;
