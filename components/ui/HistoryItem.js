import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text as RNText,
} from "react-native";
import Text from "./CustomText";
import TimelineIndicator from "./TimelineIndicator";
import { Colors } from "../../constants/styles";
import { ellipsizeString } from "../../utils/strings";

const HistoryItem = ({
  color = Colors.statusColors.checked_in,
  day = "Sen",
  date = "05",
  status = "Hadir",
  address = "Gedung utama Kementrian Kelautan dan Perikanan",
  time = "Terekam pada pukul 08.03",
}) => {
  address = ellipsizeString(address);
  return (
    <View style={styles.container}>
      <View style={[styles.box, styles.leftBox]}>
        <TimelineIndicator dotColor={color} />
        <View style={[styles.box, styles.dateBox]}>
          <Text>{day}</Text>
          <Text>{date}</Text>
        </View>
      </View>
      <View style={[styles.box, styles.historyBox]}>
        <RNText style={[styles.statusText, { color }]}>{status}</RNText>
        <Text style={styles.addressText}>{address}</Text>
        <Text style={styles.timeText}>Terekam pada pukul {time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  box: {
    flex: 1,
    // borderWidth: 1,
    height: 75,
  },
  leftBox: {
    flex: 1,
    flexDirection: "row",
  },
  dateBox: {
    flex: 3,
    justifyContent: "center",
    marginLeft: 10,
    // borderWidth: 1,
    // alignItems: "center",
  },
  historyBox: {
    flex: 4,
    padding: 8,
  },
  lineBox: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
    // fontFamily: "Inter-Medium",
    color: "rgba(82, 189, 148, 1)",
  },
  addressText: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
  },
  timeText: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.25)",
  },
});

export default HistoryItem;
