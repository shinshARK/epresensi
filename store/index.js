// File: /store/index.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";
import attendanceReducer from "./attendanceSlice";
import authReducer from "./authSlice";
import timeReducer from "./timeSlice";
import historyReducer from "./historySlice";
import unitKerjaReducer from "./unitKerjaSlice";
import biometricReducer from "./biometricSlice";
import { listenerMiddleware } from "./listenerMiddleware"; // Import the listener middleware
import AsyncStorage from "@react-native-async-storage/async-storage";

const appReducer = combineReducers({
  attendance: attendanceReducer,
  auth: authReducer,
  time: timeReducer,
  history: historyReducer,
  unitKerja: unitKerjaReducer,
  biometric: biometricReducer,
});

export const rootReducer = (state, action) => {
  if (action.type === "RESET_STATE") {
    console.log("clearing all redux states...");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const RESET_STATE = "RESET_STATE";

export const resetAllStates = () => ({
  type: RESET_STATE,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: false,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(devToolsEnhancer()),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
