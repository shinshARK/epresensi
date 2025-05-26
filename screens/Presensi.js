import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, View } from "react-native"; // Removed RNText, FlatList as not directly used for this component
import Text from "../components/ui/CustomText";
import { Picker } from "@react-native-picker/picker";
import {
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval, // Import isWithinInterval
} from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/styles";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Icon from "../components/ui/CustomIcon";

import InfoCard from "../components/ui/InfoCard";
import AttendanceCard from "../components/ui/AttendanceCard";
import CustomModal from "../components/ui/DinasModal";
import HistoryList from "../components/ui/HistoryList";
import ActionButton from "../components/ui/ActionButton";

import { resetAllStates } from "../store";
import { logout as logoutAction } from "../store/authSlice";
import { AttendanceStatus } from "../constants/attendance";

export default function Presensi() {
  const dispatch = useDispatch();
  const logoutHandler = useCallback(() => {
    dispatch(logoutAction());
    dispatch(resetAllStates());
  }, [dispatch]);

  const { status: attendanceStatus } = useSelector((state) => state.attendance);
  const historyData = useSelector((s) => s.history.historyData) ?? [];

  // console.log("presensi");
  // console.log(historyData);

  // const counts = historyData.reduce((acc, obj) => {
  //   const value = obj["status"];
  //   acc[value] = ()
  // })

  const [today] = useState(() => new Date());
  const [dinasModalVisible, setDinasModalVisible] = useState(false);

  // New useMemo hook to calculate counts for the current month
  const { hadirCountCurrentMonth, dinasCountCurrentMonth } = useMemo(() => {
    if (!historyData || historyData.length === 0) {
      return {
        hadirCountCurrentMonth: 0,
        dinasCountCurrentMonth: 0,
      };
    }

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed (0 = January, ..., 11 = December)

    let hadir = 0;
    let dinas = 0;

    historyData.forEach((item) => {
      // The date in historyData is a string like "2025-05-23"
      // We need to parse it to compare year and month
      const itemDate = new Date(item.date); // Parses "YYYY-MM-DD" in local timezone

      if (
        itemDate.getFullYear() === currentYear &&
        itemDate.getMonth() === currentMonth
      ) {
        if (item.status === 3 && !item.isDinas) {
          // Typically 'Hadir' (Present)
          hadir++;
        } else if (item.status === 2 && item.isDinas === true) {
          // 'Perjalanan Dinas' (Business Trip)
          dinas++;
        }
        // You can add more conditions here if you need to count other statuses
        // e.g., item.status === 0 for leave/holiday
      }
    });

    return {
      hadirCountCurrentMonth: hadir,
      dinasCountCurrentMonth: dinas,
    };
  }, [historyData, today]); // Recalculate if historyData or today changes

  const currentMonthWeekOptions = useMemo(() => {
    const firstDayCurrentMonth = startOfMonth(today);
    const lastDayCurrentMonth = endOfMonth(today);
    return eachWeekOfInterval(
      { start: firstDayCurrentMonth, end: lastDayCurrentMonth },
      { weekStartsOn: 1 } // Monday as the start of the week
    ).map((d) => ({
      label: `${format(d, "dd MMMM", { locale: idLocale })} – ${format(
        endOfWeek(d, { weekStartsOn: 1 }),
        "dd MMMM yyyy",
        { locale: idLocale }
      )}`,
      start: d,
      end: endOfWeek(d, { weekStartsOn: 1 }),
    }));
  }, [today]); // idLocale can be omitted from deps if it's a static import

  // Initialize with 0, useEffect will set the correct default
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);

  // Effect to set the selected week to the one containing 'today'
  // or default if 'today' is outside the generated options (e.g. different month)
  useEffect(() => {
    if (currentMonthWeekOptions.length > 0) {
      const currentWeekIndex = currentMonthWeekOptions.findIndex((option) =>
        isWithinInterval(today, { start: option.start, end: option.end })
      );

      if (currentWeekIndex !== -1) {
        setSelectedWeekIdx(currentWeekIndex);
      } else {
        // Fallback: if today is not in any week (e.g. viewing a past/future month's shell)
        // select the last week of the options available.
        setSelectedWeekIdx(currentMonthWeekOptions.length - 1);
      }
    } else {
      setSelectedWeekIdx(0); // Or handle appropriately if no options
    }
  }, [currentMonthWeekOptions, today]); // Rerun if options or 'today' changes

  const { startDate, endDate } = useMemo(() => {
    if (
      currentMonthWeekOptions.length === 0 ||
      selectedWeekIdx === undefined ||
      selectedWeekIdx < 0 ||
      selectedWeekIdx >= currentMonthWeekOptions.length
    ) {
      const now = new Date(); // Fallback to current month if selection is invalid
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      };
    }
    const selectedOption = currentMonthWeekOptions[selectedWeekIdx];
    return {
      startDate: selectedOption.start,
      endDate: selectedOption.end,
    };
  }, [selectedWeekIdx, currentMonthWeekOptions]);

  let middleBlockActive =
    attendanceStatus === AttendanceStatus.CHECKED_IN ||
    attendanceStatus === AttendanceStatus.CHECKING_OUT;

  return (
    <LinearGradient
      colors={[Colors.primary300, Colors.primary300, "white"]}
      locations={[0, 0.25, 0]}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <Text style={styles.title}>Selamat pagi, User</Text>
          <Text style={styles.subtitle}>Silahkan check-in pada hari ini</Text>
        </View>
        <View style={styles.rightHeader}>
          <ActionButton
            text="Keluar"
            icon={<Icon name="logout" size={20} color="rgba(0, 0, 0, 0.75)" />}
            onPress={logoutHandler}
            backgroundColor={"white"}
            textColor={"black"}
            style={{ marginBottom: 2 }}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.box}>
          <InfoCard
            style={{ marginRight: 6 }}
            icon={
              <MaterialCommunityIcons
                name="account-check-outline"
                size={24}
                color="#00796B"
              />
            }
            iconBackgroundColor="#E0F2F1"
            title="Hadir"
            value={hadirCountCurrentMonth}
            subtitle="pada Bulan ini  ›"
            onPressSubtitle={() => console.log("Subtitle pressed")}
          />
        </View>
        <View style={styles.box}>
          <InfoCard
            style={{ marginLeft: 6 }}
            icon={
              <Icon
                name="roadster-line"
                size={20}
                color="rgba(51, 102, 255, 1)"
              />
            }
            iconBackgroundColor="rgba(214, 224, 255, 1)"
            title="Perjalanan Dinas"
            value={dinasCountCurrentMonth}
            subtitle="pada Bulan ini  ›"
            onPressSubtitle={() => console.log("Subtitle pressed")}
          />
        </View>
      </View>

      <View
        style={[
          styles.middleBlock,
          middleBlockActive && styles.middleBlockActive,
        ]}
      >
        <AttendanceCard
          dateLabel={`Hari ini - ${format(today, "dd MMMM yyyy", {
            locale: idLocale,
          })}`}
          timeRange="08.00 - 17.00"
          primaryAction={{
            text: "Check-in",
            icon: <Icon name="check-in" size={20} color="#fff" />,
            backgroundColor: Colors.primary300,
            textColor: "#fff",
          }}
          secondaryAction={{
            text: "Perjalanan Dinas",
            icon: <Icon name="route-line" size={20} color="#333" />,
            onPress: () => {
              setDinasModalVisible((prev) => !prev);
            },
            backgroundColor: "#fff",
            textColor: "#333",
          }}
        />
      </View>
      {dinasModalVisible && (
        <CustomModal
          visible={dinasModalVisible}
          onClose={() => setDinasModalVisible(false)}
        />
      )}

      <View style={styles.bottomBlock}>
        <View style={styles.historyHeaderContainer}>
          <Text style={styles.historyHeaderText}>Riwayat Kehadiran</Text>
          {currentMonthWeekOptions.length > 0 && (
            <Picker
              mode="dropdown"
              selectedValue={selectedWeekIdx}
              onValueChange={(itemValue) => setSelectedWeekIdx(itemValue)}
              style={[
                styles.weekPicker,
                { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] },
              ]}
              itemStyle={styles.weekPickerItem} // Controls the style of items in the dropdown
              dropdownIconColor={Colors.primary500}
            >
              {currentMonthWeekOptions.map(({ label }, i) => (
                <Picker.Item key={i} label={label} value={i} />
              ))}
            </Picker>
          )}
        </View>
        <HistoryList
          startDate={startDate}
          endDate={endDate}
          style={styles.list}
          // Force re-render if data might not update otherwise
          key={`${startDate.toISOString()}-${endDate.toISOString()}`}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 0,
  },
  header: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,
    justifyContent: "space-between",
  },
  leftHeader: {},
  rightHeader: {},
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.75)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  box: {
    flex: 1,
  },
  middleBlock: {
    marginBottom: 10,
  },
  middleBlockActive: {},
  bottomBlock: {
    flex: 1,
    paddingHorizontal: 1,
  },
  historyHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  historyHeaderText: {
    fontSize: 16,
    fontWeight: "500",
    flexShrink: 1,
  },
  weekPicker: {
    height: 50,
    minWidth: 180, // Adjust as needed
    maxWidth: "65%", // Adjust as needed
    fontStyle: 12,
    // To style the text of the selected item when the picker is closed,
    // you might need to wrap Picker in a View and style a Text component
    // or rely on platform defaults. itemStyle is for the dropdown items.
  },
  weekPickerItem: {
    // This styles the items *inside* the dropdown list
    fontSize: 12, // Changed from 6 to 12 for better readability. Adjust as you like.
    // You can add other text properties here like color, fontFamily (for Android)
    // Note: iOS styling for Picker items is more limited.
  },
  list: {
    flex: 1,
  },
});
