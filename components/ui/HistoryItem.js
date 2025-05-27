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
import { getLocalTimeFromISO } from "../../utils/strings";
import Icon from "./CustomIcon";

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const HistoryItem = ({
  color = Colors.statusColors.checked_in,
  date = "2025-01-05",
  isDinas = false,
  dinasDescription = "",
  address = "Gedung utama Kementrian Kelautan dan Perikanan",
  checkin_time = "-",
  checkout_time = "-",
  time = "08:00",
  hideTopLine = false,
  hideBottomLine = false,
  maxLength = 50,
  // out
}) => {
  // date = "2025-01-05";
  // address = ellipsizeString(address, maxLength);
  let status = isDinas ? "Perjalanan Dinas" : "Hadir";

  // color = "rgba(82, 189, 148, 1)";

  let text = address;
  if (isDinas) {
    color = Colors.statusColors.dinas;
    text = dinasDescription;
  }

  if (checkin_time && checkin_time != "-") {
    checkin_time = getLocalTimeFromISO(checkin_time); // Gets "09:20"
  }

  if (checkout_time && checkout_time != "-") {
    checkout_time = getLocalTimeFromISO(checkout_time); // Gets "09:20"
  }

  let day = HARI[new Date(date).getDay()];
  return (
    <View style={styles.container}>
      <View style={[styles.box, styles.leftBox]}>
        <TimelineIndicator
          dotColor={color}
          hideTopLine={hideTopLine}
          hideBottomLine={hideBottomLine}
        />
        <View style={[styles.box, styles.dateBox]}>
          <Text>{day}</Text>
          <Text>{date.split("-")[2]}</Text>
        </View>
      </View>
      <View style={[styles.box, styles.historyBox]}>
        <RNText style={[styles.statusText, { color }]}>{status}</RNText>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.addressText}>
          {text}
        </Text>
        <View style={styles.timeBox}>
          <Icon name="check-in" size={12} color="rgba(0, 0, 0, 0.25)" />
          <Text style={styles.timeText}> {checkin_time} -</Text>
          <Icon name="check-out" size={12} color="rgba(0, 0, 0, 0.25)" />
          <Text style={styles.timeText}> {checkout_time}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  box: {
    // flex: 1,
    // borderWidth: 1,
    height: 75,
  },
  leftBox: {
    // flex: 1,
    // marginRight: 8,
    flexDirection: "row",
    width: 70,
  },
  dateBox: {
    // flex: 1,
    justifyContent: "center",
    marginLeft: 8,

    // borderWidth: 1,
    // alignItems: "center",
  },
  historyBox: {
    // borderWidth: 1,
    flex: 1,
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
  timeBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.25)",
  },
});

export default HistoryItem;
