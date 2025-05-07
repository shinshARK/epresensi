import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ntpTime: null,
  lastSync: null,
};

const timeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    setNtpTime: (state, action) => {
      state.ntpTime = action.payload.ntpTime;
      state.lastSync = new Date().toISOString(); // Device time for last sync
    },
  },
});

export const { setNtpTime } = timeSlice.actions;
export const selectNtpTime = (state) => state.time.ntpTime; // Selector to get NTP time
export default timeSlice.reducer;
