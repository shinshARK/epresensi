import NTPSync from "@ruanitto/react-native-ntp-sync";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { AttendanceStatus } from "../constants/attendance";
import { store } from "../store";
import { setStatus } from "../store/attendanceSlice";
import { setNtpTime } from "../store/timeSlice"; // Import setNtpTime action

const BACKGROUND_FETCH_TASK = "attendance-background-fetch";

// Initialize NTPSync outside of the task function for periodic syncing
const ntpSyncInstance = new NTPSync({
  servers: [
    { server: "id.pool.ntp.org", port: 123 },
    { server: "sg.pool.ntp.org", port: 123 },
  ],
  syncInterval: 300000, // 5 minutes in milliseconds
  syncOnCreation: true,
  autoSync: true,
});

// Function to perform NTP time sync and update Redux state
export const syncNTPTime = async () => {
  try {
    await ntpSyncInstance.syncTime();
    const syncedTime = ntpSyncInstance.getTime();
    console.log(`time: ${syncedTime}`);
    store.dispatch(setNtpTime({ ntpTime: syncedTime })); // Dispatch action to update timeSlice
    console.log(
      `[NTP Sync] NTP Time synced and updated in Redux: ${syncedTime}`
    );
  } catch (error) {
    console.error("[NTP Sync] Error syncing NTP time:", error);
  }
};

// Function to perform attendance check (can be called manually)
export const performAttendanceCheck = async () => {
  let syncedTime = store.getState().time.ntpTime; // Get NTP time from Redux state

  if (!syncedTime) {
    console.warn(
      "[] NTP Time not yet available from Redux state. Using device time temporarily."
    );
    syncedTime = new Date().getTime(); // Fallback to device time if NTP not available immediately
  }

  try {
    const now = new Date(syncedTime); // Use syncedTime from Redux state
    const hour = now.getHours();

    console.log(`[] Using NTP Time from Redux State: ${syncedTime} `);
    console.log(`[] Current NTP Hour (from Redux): ${hour}`);

    const currentStatus = store.getState().attendance.status;
    const currentIsDinas = store.getState().attendance.isDinas;
    const currentDinasDescription =
      store.getState().attendance.dinasDescription;
    const currentCheckInTime = store.getState().attendance.checkInTime;
    const currentCheckOutTime = store.getState().attendance.checkOutTime;
    const userId = store.getState().auth.token;

    let newStatus;

    if (
      hour < 8 ||
      !currentStatus ||
      currentStatus === AttendanceStatus.CHECKING_IN
    ) {
      newStatus = AttendanceStatus.CHECKING_IN;
    } else if (
      currentStatus === AttendanceStatus.CHECKED_IN &&
      hour >= 14 &&
      hour < 20
    ) {
      newStatus = AttendanceStatus.CHECKING_OUT;
    } else {
      newStatus = currentStatus;
    }

    if (newStatus !== currentStatus) {
      const payload = { status: newStatus };
      let updatedPayload = { ...payload }; // Start with status payload

      if (newStatus === AttendanceStatus.CHECKED_IN && !currentCheckInTime) {
        updatedPayload.checkInTime = new Date(syncedTime).toISOString(); // Set NTP check-in time from Redux state
      } else if (
        newStatus === AttendanceStatus.CHECKED_OUT &&
        !currentCheckOutTime
      ) {
        updatedPayload.checkOutTime = new Date(syncedTime).toISOString(); // Set NTP check-out time from Redux state
      }
      // Include lastUpdated with NTP time in payload for slice update
      updatedPayload.lastUpdated = new Date(syncedTime).toISOString(); // Set NTP lastUpdated from Redux state

      store.dispatch(setStatus(updatedPayload)); // Dispatch status and time updates

      console.log(
        `[] Updated status to ${newStatus} with NTP time from Redux State and lastUpdated`
      );

      // const today = new Date(syncedTime).toISOString().split("T")[0]; // NTP date for date key (from Redux state)
      // let checkInDetails = updatedPayload.checkInTime
      //   ? { time: updatedPayload.checkInTime }
      //   : currentCheckInTime
      //   ? { time: currentCheckInTime }
      //   : null; // Use NTP time if newly set, else existing or null
      // let checkOutDetails = updatedPayload.checkOutTime
      //   ? { time: updatedPayload.checkOutTime }
      //   : currentCheckOutTime
      //   ? { time: currentCheckOutTime }
      //   : null; // Use NTP time if newly set, else existing or null

      // const attendanceData = {
      //   status: newStatus,
      //   isDinas: currentIsDinas,
      //   dinasDescription: currentDinasDescription,
      //   checkIn: checkInDetails,
      //   checkOut: checkOutDetails,
      //   lastUpdated: new Date(syncedTime).toISOString(), // Log NTP time as lastUpdated as well for consistency
      // };

      // console.log(`new status: ${newStatus}`);
      // if (userId && newStatus > 1) {
      //   await logAttendanceData(today, attendanceData);
      // } else {
      //   console.warn(
      //     "User ID not found, cannot log attendance to Firebase (background task)."
      //   );
      // }
    } else {
      console.log(
        `[] No change: attendance status remains ${currentStatus} at ${now.toISOString()}`
      );
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.error("[] Error updating attendance status:", err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
};

// Register background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  await syncNTPTime(); // Sync NTP time at the beginning of the background task
  return await performAttendanceCheck();
});

export { BACKGROUND_FETCH_TASK }; // Export syncNTPTime for manual sync if needed
