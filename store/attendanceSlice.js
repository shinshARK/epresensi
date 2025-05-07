import { createSlice } from "@reduxjs/toolkit";
import { AttendanceStatus } from "../constants/attendance";

const initialState = {
  status: AttendanceStatus.CHECKING_IN,
  lastUpdated: null,
  isDinas: false,
  dinasDescription: "",
  checkInTime: null,
  checkOutTime: null,
  loading: false,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload.status;
      // Use lastUpdated from payload, which will be NTP time

      if (action.payload.lastUpdated !== undefined) {
        state.lastUpdated = action.payload.lastUpdated;
      }
      if (action.payload.isDinas !== undefined) {
        state.isDinas = action.payload.isDinas;
      }
      if (action.payload.dinasDescription !== undefined) {
        state.dinasDescription = action.payload.dinasDescription;
      }
      if (action.payload.checkInTime !== undefined) {
        state.checkInTime = action.payload.checkInTime;
      }
      if (action.payload.checkOutTime !== undefined) {
        state.checkOutTime = action.payload.checkOutTime;
      }
    },
  },
});

export const { setStatus } = attendanceSlice.actions;
export default attendanceSlice.reducer;
