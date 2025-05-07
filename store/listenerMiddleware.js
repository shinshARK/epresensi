// File: /store/listenerMiddleware.js
import { createListenerMiddleware } from "@reduxjs/toolkit";
import { login } from "./authSlice"; // Import the login async thunk from authSlice
import { setStatus } from "./attendanceSlice"; // Import the setStatus action from attendanceSlice
import { updateHistoryItem } from "./historySlice"; // Import updateHistoryItem action
import { fetchCurrentDayAttendance } from "../utils/firebase/db/attendanceApi";
import { syncNTPTime } from "../utils/backgroundAttendance";
import { fetchUnitKerja, setUnitKerjaData } from "./unitKerjaSlice";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: login.fulfilled, // Listen for the login.fulfilled action
  effect: async (action, listenerApi) => {
    console.log(
      "Login fulfilled action detected by middleware. Fetching attendance data and hydrating attendanceSlice..."
    );
    const email = action.meta.arg.email; // Extract email from login thunk arguments
    const token = listenerApi.getState().auth.token; // Get token from authSlice

    try {
      const attendanceData = await fetchCurrentDayAttendance(email, token); // Fetch attendance data
      console.log("Attendance Data fetched in middleware:", attendanceData);

      if (attendanceData) {
        listenerApi.dispatch(setStatus(attendanceData)); // Dispatch setStatus with fetched data
        console.log(
          "attendanceSlice hydration dispatched using setStatus with fetched attendanceData."
        );
      }

      // Fetch unit_kerja data
      const unitKerjaData = await listenerApi.dispatch(fetchUnitKerja(email)); // Dispatch the async thunk and wait for it to resolve
      console.log("Unit Kerja Data fetched in middleware:", unitKerjaData);

      if (unitKerjaData.payload) {
        listenerApi.dispatch(setUnitKerjaData(unitKerjaData.payload)); // Dispatch setUnitKerjaData with fetched data
        console.log(
          "unitKerjaSlice hydration dispatched using setUnitKerjaData with fetched unitKerjaData."
        );
      }
    } catch (error) {
      console.error("Error fetching attendance data in middleware:", error);
      // Handle error appropriately, e.g., dispatch an error action or log it
    }
  },
});

listenerMiddleware.startListening({
  // New listener for setStatus action
  actionCreator: setStatus, // Listen for the setStatus action
  effect: async (action, listenerApi) => {
    console.log(
      "setStatus action detected by middleware. Updating historySlice..."
    );
    const currentAttendanceStatus = action.payload; // The payload of setStatus is the current attendance data
    await syncNTPTime();
    const syncedTime = listenerApi.getState().time.ntpTime; // Get NTP time
    const today = new Date(syncedTime).toISOString().split("T")[0]; // Get today's date

    listenerApi.dispatch(
      updateHistoryItem({ date: today, updatedData: currentAttendanceStatus }) // Dispatch updateHistoryItem
    );
    console.log("historySlice updated with current attendance status.");
  },
});
