import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "../../constants/styles";

const TimelineIndicator = ({ dotColor = Colors.statusColors.checked_in }) => {
  return (
    <View style={styles.container}>
      <View style={styles.lineSegment} />
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <View style={styles.lineSegment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 30,
    alignItems: "center",
  },
  lineSegment: {
    width: 2,
    flex: 1,
    backgroundColor: "#ccc",
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginVertical: 4,
    zIndex: 1,
  },
});

export default TimelineIndicator;
