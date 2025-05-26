// constants/attendance.js
export const AttendanceStatus = Object.freeze({
  CHECKING_IN: 0,
  CHECKING_OUT: 1,
  CHECKED_IN: 2,
  CHECKED_OUT: 3,
  CHECKED_IN_DINAS: 4, // just extra not really used except for color
});

export const statusBackgrounds = [
  "white", // CHECKING_IN
  "rgb(248, 248, 228)", // CHECKING_OUT
  "rgba(220, 242, 234, 1)", // CHECKED_IN
  "white", // CHECKED_OUT
  "rgba(214, 224, 255, 1)", // CHECKED_IN_DINAS
];
