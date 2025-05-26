import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  eachMonthOfInterval,
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  subMonths,
  format,
} from "date-fns";
import { id as idLocale } from "date-fns/locale"; // ← import Indonesian
import HistoryList from "../components/ui/HistoryList";
import Icon from "../components/ui/CustomIcon";
import { useSelector } from "react-redux";
import { AttendanceStatus } from "../constants/attendance";

export default function History() {
  const [today] = useState(() => new Date());

  const { status: attendanceStatus } = useSelector((state) => state.attendance);
  const [warningShown, setWarningShown] = useState(false);

  useEffect(() => {
    if (attendanceStatus === AttendanceStatus.CHECKING_IN) {
      setWarningShown(true);
    } else {
      setWarningShown(false);
    }
  }, [attendanceStatus]); // Only re-run the effect if attendanceStatus changes

  const monthOptions = useMemo(
    () =>
      eachMonthOfInterval({
        start: subMonths(today, 11),
        end: today,
      }).map((d) => ({
        // now “Mei 2025”, “Juni 2025”, etc.
        label: format(d, "MMMM yyyy", { locale: idLocale }),
        start: startOfMonth(d),
        end: endOfMonth(d),
      })),
    [today]
  );

  const weekOptions = useMemo(() => {
    const first = startOfMonth(today);
    const last = endOfMonth(today);
    return eachWeekOfInterval(
      { start: first, end: last },
      { weekStartsOn: 1 }
    ).map((d) => ({
      // now “05 Mei – 11 Mei”, etc.
      label: `${format(d, "dd MMMM", { locale: idLocale })} – ${format(
        endOfWeek(d, { weekStartsOn: 1 }),
        "dd MMMM",
        { locale: idLocale }
      )}`,
      start: d,
      end: endOfWeek(d, { weekStartsOn: 1 }),
    }));
  }, [today]);

  const [mode, setMode] = useState("month");
  const [selIdx, setSelIdx] = useState(monthOptions.length - 1);

  useEffect(() => {
    const opts = mode === "month" ? monthOptions : weekOptions;
    setSelIdx(opts.length > 0 ? opts.length - 1 : 0);
  }, [mode]);

  const { startDate, endDate } = useMemo(() => {
    const options = mode === "month" ? monthOptions : weekOptions;
    const sel = options[selIdx];
    return {
      startDate: sel?.start ?? today,
      endDate: sel?.end ?? today,
    };
  }, [mode, selIdx, monthOptions, weekOptions, today]);
  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Riwayat Absensi</Text> */}
      {warningShown && (
        <View style={styles.warning}>
          <View style={{ flex: 1 }}>
            <Icon name={"error-warning"} color="rgba(255, 86, 48, 1)"></Icon>
          </View>
          <View style={{ flex: 9 }}>
            <Text style={{ color: "rgba(255, 86, 48, 1)" }}>
              Anda belum mengisi presensi hari ini, segera isi presensi
            </Text>
          </View>
        </View>
      )}

      <View style={styles.dropdownContainer}>
        <Picker
          mode="dropdown"
          selectedValue={mode}
          onValueChange={setMode}
          style={styles.picker}
        >
          <Picker.Item label="Bulan" value="month" />
          <Picker.Item label="Minggu" value="week" />
        </Picker>

        <Picker
          mode="dropdown"
          selectedValue={selIdx}
          onValueChange={setSelIdx}
          style={styles.picker}
        >
          {(mode === "month" ? monthOptions : weekOptions).map(
            ({ label }, i) => (
              <Picker.Item key={i} label={label} value={i} />
            )
          )}
        </Picker>
      </View>

      <HistoryList
        startDate={startDate}
        endDate={endDate}
        maxLength={49}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  warning: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    padding: 8,
    backgroundColor: "rgba(255, 245, 243, 1)",
    borderWidth: 1,
    borderColor: "rgba(255, 116, 82, 1)",
    borderRadius: 8,
    maxHeight: "9%",
  },
  dropdownContainer: { flexDirection: "row" },
  header: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  picker: { flex: 1, marginBottom: 12 },
  list: { flex: 1 },
});
