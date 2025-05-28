import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

/**
 * ActionButton
 *
 * A customizable button component with text and an optional icon.
 *
 * Props:
 * - text: string (The text displayed on the button)
 * - icon: React.Node (An optional icon component to display next to the text)
 * - onPress: function (Callback function when the button is pressed)
 * - backgroundColor: string (Background color of the button)
 * - textColor: string (Text color of the button)
 * - isSecondary: boolean (If true, applies secondary button styles like border)
 * - style: object (Optional style overrides for the button container)
 * - textStyle: object (Optional style overrides for the button text)
 */
export default function ActionButton({
  text,
  icon,
  onPress,
  backgroundColor,
  textColor,
  isSecondary = false,
  disabled = false,
  style = {},
  textStyle = {},
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.button,
        isSecondary && styles.secondaryButton,
        { backgroundColor },
        style,
      ]}
      onPress={onPress}
    >
      <View style={styles.buttonContent}>
        <Text style={[styles.buttonText, { color: textColor }, textStyle]}>
          {text}
        </Text>
        {icon}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Styles moved to ActionButton component or apply to all buttons
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
