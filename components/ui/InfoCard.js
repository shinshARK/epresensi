import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

/**
 * A customizable info card component.
 *
 * Props:
 * - icon: a React element (e.g. an icon component)
 * - iconBackgroundColor: background color of the icon container
 * - title: small header text
 * - value: large main text
 * - subtitle: smaller text below the value (can be clickable)
 * - onPressSubtitle: function to call when subtitle is pressed
 * - style: additional style for the card container
 * - titleStyle, valueStyle, subtitleStyle: style overrides for texts
 */
export default function InfoCard({
  icon,
  iconBackgroundColor = "#E0F7FA",
  title = "",
  value = "",
  subtitle = "",
  onPressSubtitle = null,
  style = {},
  titleStyle = {},
  valueStyle = {},
  subtitleStyle = {},
}) {
  return (
    <View style={[styles.card, style]}>
      <View
        style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}
      >
        {icon}
      </View>
      <Text style={[styles.title, titleStyle]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
      {subtitle ? (
        onPressSubtitle ? (
          <TouchableOpacity onPress={onPressSubtitle}>
            <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    // width: 150,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: "#666",
    // marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    // marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#888",
  },
});
