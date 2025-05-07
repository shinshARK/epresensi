import { View, StyleSheet, Text } from "react-native";
import HistoryItem from "../components/ui/HistoryItem";
import { Colors } from "../constants/styles";

export default function History() {
  return (
    <View style={styles.container}>
      <Text>History</Text>
      <HistoryItem
        color={Colors.statusColors.dinas}
        day="Sel"
        date="06"
        status="Perjalanan Dinas"
        address="Perjalanan Dinas ke Dinas Kelautan dan Perikanan Provinsi Jawa Barat"
        time="08:03"
      />
      <HistoryItem
        color={Colors.statusColors.checked_in}
        day="Sel"
        date="06"
        status="Hadir"
        address="Perjalanan Dinas ke Dinas Kelautan dan Perikanan Provinsi Jawa Barat"
        time="08:03"
      />
      <HistoryItem
        color={Colors.statusColors.checked_in}
        day="Sel"
        date="06"
        status="Hadir"
        address="Perjalanan Dinas ke Dinas Kelautan dan Perikanan Provinsi Jawa Barat"
        time="08:03"
      />
    </View>
  );
}

const styles = StyleSheet.create({});
