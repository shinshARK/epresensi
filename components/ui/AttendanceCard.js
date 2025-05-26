import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import ActionButton from "./ActionButton";
import { useDispatch, useSelector } from "react-redux";

import useOfficeLocationCheck from "../../utils/hooks/useOfficeLocationCheck";
import {
  performAttendanceCheck,
  syncNTPTime,
} from "../../utils/backgroundAttendance";
import * as BackgroundFetch from "expo-background-fetch";
import { BACKGROUND_FETCH_TASK } from "../../utils/backgroundAttendance";
import DinasModal from "./DinasModal";

import {
  AttendanceStatus,
  statusBackgrounds,
  statusColors,
} from "../../constants/attendance";

import { updateCurrentDayAttendanceStatus } from "../../utils/firebase/db/attendanceApi";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { store } from "../../store";
import { setStatus } from "../../store/attendanceSlice";
import Icon from "./CustomIcon";

/**
 * AttendanceCard
 *
 * A card showing a date label, time range, and two customizable action buttons.
 *
 * Props:
 * - dateLabel: string (e.g. "Hari ini - 02 Mei 2025")
 * - timeRange: string (e.g. "08.00 - 17.00")
 * - primaryAction: { text, icon, onPress, backgroundColor, textColor }
 * - secondaryAction: { text, icon, onPress, backgroundColor, textColor }
 * - secondaryActionShown: boolean (Controls visibility of the secondary action button)
 * - style overrides: style, dateStyle, timeStyle, buttonStyle, textStyle
 */

const OFFICE_RADIUS_METERS = 50; // 50 meters radius
const LOCATION_CHECK_INTERVAL_MS = 360 * 1000; // 30 seconds

export default function AttendanceCard({
  dateLabel,
  timeRange,
  primaryAction,
  secondaryAction,
  style = {},
  dateStyle = {},
  timeStyle = {},
  buttonStyle = {},
  textStyle = {},
}) {
  const dispatch = useDispatch();

  const { status: attendanceStatus, lastUpdated } = useSelector(
    (state) => state.attendance
  );

  const recordedIsDinas = useSelector((state) => state.attendance.isDinas);

  const isBiometricAvailable = useSelector(
    (state) => state.biometric.isBiometricAvailable
  );

  let statusShown =
    attendanceStatus === AttendanceStatus.CHECKED_IN ||
    attendanceStatus === AttendanceStatus.CHECKING_OUT;

  const [dinasModalVisible, setDinasModalVisible] = useState(false);
  const [dinasDescription, setDinasDescription] = useState("");
  const [isDinas, setIsDinas] = useState(false);
  const [isInRange, setIsInRange] = useState(null);

  const { isLocationInOfficeRange, isLocationLoading } =
    useOfficeLocationCheck(); // Use the hook

  const intervalRef = useRef(null);
  useEffect(() => {
    // initial check
    (async () => {
      const inRange = await isLocationInOfficeRange();
      setIsInRange(inRange);
    })();

    // set up interval
    intervalRef.current = setInterval(async () => {
      console.log("Periodic location check running...");
      const inRange = await isLocationInOfficeRange();
      console.log(`In range? ${inRange}`);
      setIsInRange(inRange);
    }, LOCATION_CHECK_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    async function registerBackgroundFetchAsync() {
      try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 5 * 60, // 5 minutes in seconds
          stopOnTerminate: false,
          startOnBoot: true,
        });
      } catch (error) {
        console.error("Error registering background fetch task:", error);
      }
    }
    async function effectFunction() {
      // await registerBackgroundFetchAsync();
      await syncNTPTime();
      await checkBiometricAvailability(); // Call at app startup
    }
    effectFunction();
  }, [syncNTPTime]);

  const handleCheckin = async (isDinas = false) => {
    let currentStatus = attendanceStatus;
    if (
      currentStatus === AttendanceStatus.CHECKED_IN ||
      currentStatus === AttendanceStatus.CHECKED_OUT
    ) {
      await syncNTPTime();
      await performAttendanceCheck();
      currentStatus = store.getState().attendance.status;

      if (currentStatus === AttendanceStatus.CHECKED_IN) {
        // alert not yet time shift to check out
        Alert.alert(
          "Not yet time to check out",
          "Please wait until the end of your shift."
        );
        console.log("not yet time to check out!");
        return;
      } else if (currentStatus === AttendanceStatus.CHECKED_OUT) {
        // alert not yet time shift to check out
        Alert.alert(
          "Not yet time to check in",
          "Please wait until your shift starts."
        );
        console.log("not yet time to check in!");
        return;
      }
    }
    // setButtonLoading(true);
    console.log(
      `check dinas bypass, isDinas: ${isDinas}, exp: ${
        !isDinas && !isInRange
      } ${!isDinas} ${!isInRange}`
    );
    if (!isDinas && !isInRange) {
      const recheck = await isLocationInOfficeRange();
      setIsInRange(recheck);
      if (!recheck) {
        Alert.alert(
          "You are not in the office range",
          `Please check in/out when you are within ${OFFICE_RADIUS_METERS} meters of the office.`
        );
        return;
      }
    }

    if (isBiometricAvailable) {
      try {
        const biometricAuthResult =
          await LocalAuthentication.authenticateAsync();
        if (!biometricAuthResult.success) {
          // setButtonLoading(false); // Stop loading on biometric auth failure
          return; // Early return if biometric auth fails
        }
      } catch (error) {
        console.error("Biometric authentication error:", error);
        // setButtonLoading(false); // Stop loading on biometric auth error
        return;
      }
    }

    let newStatus;
    if (currentStatus === AttendanceStatus.CHECKING_IN) {
      newStatus = AttendanceStatus.CHECKED_IN;
    } else if (currentStatus === AttendanceStatus.CHECKING_OUT) {
      newStatus = AttendanceStatus.CHECKED_OUT;
    } else {
      // setButtonLoading(false);
      return;
    }

    let checkIn;
    if (
      newStatus === AttendanceStatus.CHECKED_IN ||
      newStatus === AttendanceStatus.CHECKED_OUT
    ) {
      try {
        const userEmail = await AsyncStorage.getItem("email");
        await syncNTPTime();
        const syncedTime = store.getState().time.ntpTime;
        console.log(new Date(syncedTime).toLocaleTimeString());
        const today = new Date(syncedTime).toISOString().split("T")[0];
        console.log(today);

        // if (attendanceStatus === AttendanceStatus.CHECKING_IN) {
        // } else {
        //   checkIn = store.getState().attendance.checkInTime;
        // }

        const recordedSlice = store.getState().attendance;
        // if we’re checking-in, use the local `isDinas` + desc;
        // if we’re checking-out, carry forward whatever was in the slice:
        const effectiveIsDinas =
          currentStatus === AttendanceStatus.CHECKING_IN
            ? isDinas
            : recordedSlice.isDinas;
        console.log("creating payload");
        console.log(`isDinas: ${isDinas}`);
        console.log(`recordedSlice.isDinas: ${recordedSlice.isDinas}`);
        console.log(`effectiveIsDinas: ${effectiveIsDinas}`);

        const effectiveDinasDescription =
          currentStatus === AttendanceStatus.CHECKING_IN
            ? dinasDescription
            : recordedSlice.dinasDescription;

        const attendanceData = {
          status: newStatus,
          isDinas: effectiveIsDinas,
          dinasDescription: effectiveIsDinas ? effectiveDinasDescription : null,
          checkInTime:
            currentStatus === AttendanceStatus.CHECKING_IN
              ? new Date(syncedTime).toISOString()
              : store.getState().attendance.checkInTime,
          checkOutTime:
            currentStatus === AttendanceStatus.CHECKING_OUT
              ? new Date(syncedTime).toISOString()
              : null,
          lastUpdated: new Date(syncedTime).toISOString(),
        };

        console.log("posting attendance data to be sent");
        console.log(`isDinas: ${isDinas}`);
        console.log(attendanceData);

        if (userEmail) {
          await updateCurrentDayAttendanceStatus(today, attendanceData);
          dispatch(setStatus(attendanceData));
          console.log("Attendance data logged (manual button press).");
        } else {
          console.warn("User email not found, cannot log attendance.");
        }
        // setButtonLoading(false);
      } catch (error) {
        // setButtonLoading(false);
        console.error("Error logging attendance data on button press:", error);
      }
    }
  };

  const handleSubmitDinas = async (desc) => {
    console.log(
      "====================START IS DINAS ATTENDANCE======================"
    );
    if (!desc.trim()) return;

    let updatedIsDinas = true;
    setIsDinas(true);
    console.log(`desc: ${desc}`);
    console.log(`isDinas: ${updatedIsDinas}`);
    setDinasDescription(desc);

    try {
      await handleCheckin(updatedIsDinas);
    } finally {
      setIsDinas(false);
      setDinasDescription("");
      setDinasModalVisible(false);
    }
    console.log(
      "====================STOP IS DINAS ATTENDANCE======================"
    );
  };

  // ui state logic

  let bgColor = statusBackgrounds[attendanceStatus] || "#fff";
  let statusText = "Sudah Check-in";
  let statusIcon = "check-double-line";

  if (
    (attendanceStatus === AttendanceStatus.CHECKED_IN ||
      attendanceStatus === AttendanceStatus.CHECKING_OUT) &&
    recordedIsDinas
  ) {
    bgColor = statusBackgrounds[AttendanceStatus.CHECKED_IN_DINAS];
    statusText = "Sedang Perjalanan Dinas";
    statusIcon = "route-line";
  }

  // Determine if we should show secondary at all
  const secondaryActionShown =
    attendanceStatus === AttendanceStatus.CHECKING_IN;

  console.log(`secondaryActionShown: ${secondaryActionShown}`);
  console.log(`isDinas: ${isDinas}`);

  // Prepare props for the “primary” button
  const primaryProps = { ...primaryAction };
  if (
    attendanceStatus === AttendanceStatus.CHECKED_IN ||
    attendanceStatus === AttendanceStatus.CHECKING_OUT
  ) {
    primaryProps.text = "Check-Out";
    primaryProps.backgroundColor = "#fff";
    primaryProps.textColor = "#000";
    primaryProps.style = {
      borderWidth: 1,
      borderColor: "rgba(255, 208, 121, 1)",
      ...(buttonStyle || {}),
    };

    // you could also add a `disabled` prop if your ActionButton supports it
  } else if (attendanceStatus === AttendanceStatus.CHECKED_OUT) {
    primaryProps.text = "Checked Out";
    primaryProps.backgroundColor = "#ccc";
    primaryProps.textColor = "white";
    primaryProps.style = {
      borderWidth: 1,
      borderColor: "rgb(216, 210, 210)",
      ...(buttonStyle || {}),
    };
  }

  return (
    <>
      <View style={[styles.card, style, { backgroundColor: bgColor }]}>
        <View style={styles.header}>
          <Text style={[styles.dateLabel, dateStyle]}>{dateLabel}</Text>
          <Text style={[styles.timeRange, timeStyle]}>{timeRange}</Text>
        </View>

        {statusShown && (
          <View style={styles.status}>
            <Text style={styles.statusText}>{statusText}</Text>
            <Icon name={statusIcon}></Icon>
          </View>
        )}

        <View style={styles.buttonsRow}>
          <ActionButton
            // text={primaryAction.text}
            // onPress={handleCheckin}
            // backgroundColor={primaryAction.backgroundColor}
            // textColor={primaryAction.textColor}
            // style={buttonStyle} // Pass generic buttonStyle here
            {...primaryProps}
            onPress={handleCheckin.bind(null, false)}
            textStyle={textStyle} // Pass generic textStyle here
          />

          {secondaryActionShown && (
            <ActionButton
              text={secondaryAction.text}
              icon={secondaryAction.icon}
              onPress={() => setDinasModalVisible(true)}
              backgroundColor={secondaryAction.backgroundColor}
              textColor={secondaryAction.textColor}
              isSecondary // Mark as secondary to apply specific styles
              style={buttonStyle} // Pass generic buttonStyle here
              textStyle={textStyle} // Pass generic textStyle here
            />
          )}
        </View>
      </View>

      <DinasModal
        visible={dinasModalVisible}
        description={dinasDescription}
        onChangeDescription={setDinasDescription}
        onCancel={() => setDinasModalVisible(false)}
        onSubmit={handleSubmitDinas}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderColor: "rgba(238, 238, 238, 1)",
    borderWidth: 1,
    // elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    marginHorizontal: 4,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    marginHorizontal: 4,
  },
  statusText: {
    fontWeight: "500",
    marginRight: 6,
  },
  dateLabel: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.75)",
  },
  timeRange: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.75)",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // Styles moved to ActionButton component or apply to all buttons
});
