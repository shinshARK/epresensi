import { StyleSheet, View, Text as RNText } from "react-native";
import Text from "../components/ui/CustomText";

import { LinearGradient } from "expo-linear-gradient"; // or "expo-linear-gradient"
import { Colors } from "../constants/styles";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Icon from "../components/ui/CustomIcon";

import InfoCard from "../components/ui/InfoCard";
import AttendanceCard from "../components/ui/AttendanceCard";

export default function Presensi() {
  return (
    <LinearGradient
      colors={[Colors.primary300, Colors.primary300, "white"]}
      locations={[0, 0.25, 0]}
      style={styles.container}
    >
      {/* Texts Container */}
      <View style={styles.header}>
        <Text style={styles.title}>Selamat pagi, User</Text>
        <Text style={styles.subtitle}>Silahkan check-in pada hari ini</Text>
      </View>

      {/* Cards Container */}
      <View style={styles.row}>
        <View style={styles.box}>
          {/* <Text>Box 1</Text> */}
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
            value={12}
            subtitle="pada Bulan ini  ›"
            onPressSubtitle={() => console.log("Subtitle pressed")}
          />
        </View>
        <View style={styles.box}>
          {/* <Text>Box 2</Text>
           */}
          <InfoCard
            style={{ marginLeft: 6 }}
            icon={
              <Ionicons
                name="car-outline"
                size={24}
                color="rgba(205, 171, 30, 1)"
              />
            }
            iconBackgroundColor="rgba(250, 232, 200, 1)"
            title="Perjalanan Dinas"
            value={12}
            subtitle="pada Bulan ini  ›"
            onPressSubtitle={() => console.log("Subtitle pressed")}
          />
        </View>
      </View>

      {/* Attendance Container */}
      <View style={styles.middleBlock}>
        <AttendanceCard
          dateLabel="Hari ini - 02 Mei 2025"
          timeRange="08.00 - 17.00"
          primaryAction={{
            text: "Check-in",
            icon: <Icon name="check-in" size={20} color="#fff" />,
            onPress: () => console.log("Checked in"),
            backgroundColor: Colors.primary300,
            textColor: "#fff",
          }}
          secondaryAction={{
            text: "Perjalanan Dinas",
            icon: <Icon name="route-line" size={20} color="#333" />,
            onPress: () => console.log("Travel log"),
            backgroundColor: "#fff",
            textColor: "#333",
          }}
        />
      </View>

      {/* Weekly History Container */}
      <View style={styles.bottomBlock}>
        <Text>Bottom Block</Text>
        <RNText>Bottom Block</RNText>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    marginBottom: 10,
    padding: 10,
    // borderWidth: 1,
  },
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
    marginHorizontal: 0,
    // padding: 10,
    // borderWidth: 1,
  },
  middleBlock: {
    height: 100,
    marginBottom: 10,
    // padding: 10,
    // borderWidth: 1,
  },
  bottomBlock: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
  },
});
