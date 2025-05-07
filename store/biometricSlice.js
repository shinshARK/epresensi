import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isBiometricAvailable: false, // Initially assume biometric is not available
};

const biometricSlice = createSlice({
  name: "biometric",
  initialState,
  reducers: {
    setBiometricAvailability: (state, action) => {
      state.isBiometricAvailable = action.payload; // Set availability status
    },
  },
});

export const { setBiometricAvailability } = biometricSlice.actions;
export default biometricSlice.reducer;
