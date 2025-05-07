import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

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
 * - style overrides: style, dateStyle, timeStyle, buttonStyle, textStyle
 */
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
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={[styles.dateLabel, dateStyle]}>{dateLabel}</Text>
        <Text style={[styles.timeRange, timeStyle]}>{timeRange}</Text>
      </View>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: primaryAction.backgroundColor },
            buttonStyle,
          ]}
          onPress={primaryAction.onPress}
        >
          <View style={styles.buttonContent}>
            <Text
              style={[
                styles.buttonText,
                { color: primaryAction.textColor },
                textStyle,
              ]}
            >
              {primaryAction.text}
            </Text>
            {primaryAction.icon}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            { backgroundColor: secondaryAction.backgroundColor },
            buttonStyle,
          ]}
          onPress={secondaryAction.onPress}
        >
          <View style={styles.buttonContent}>
            <Text
              style={[
                styles.buttonText,
                { color: secondaryAction.textColor },
                textStyle,
              ]}
            >
              {secondaryAction.text}
            </Text>
            {secondaryAction.icon}
          </View>
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 12,
    marginHorizontal: 4,
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
    // borderWidth: 1,
  },
  button: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "rgba(238, 238, 238, 1)",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 6,
  },
});
