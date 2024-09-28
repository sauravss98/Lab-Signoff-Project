import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth";
import settingsPageReducer from "./settingsPageState";

// Persist config for auth slice
const authPersistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: { auth: persistedAuthReducer, settingsPage: settingsPageReducer },
});

const persistor = persistStore(store);

export { store, persistor };
