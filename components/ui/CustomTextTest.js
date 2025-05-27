import React from "react";
import { View, StyleSheet, ScrollView } from "react-native"; // Import ScrollView for longer lists

// Import your custom Text component
import Text from "./CustomText"; // Adjust the path if your Text component is in a different location

const CustomTextTest = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Inter Font Weights (Normal)</Text>
        {/* Test each font weight */}
        <Text style={{ fontWeight: "100" }}>Weight 100 (Thin)</Text>
        <Text style={{ fontWeight: "200" }}>Weight 200 (ExtraLight)</Text>
        <Text style={{ fontWeight: "300" }}>Weight 300 (Light)</Text>
        <Text style={{ fontWeight: "400" }}>Weight 400 (Regular)</Text>
        {/* Default */}
        <Text style={{ fontWeight: "500" }}>Weight 500 (Medium)</Text>
        <Text style={{ fontWeight: "600" }}>Weight 600 (SemiBold)</Text>
        <Text style={{ fontWeight: "700" }}>Weight 700 (Bold)</Text>
        <Text style={{ fontWeight: "800" }}>Weight 800 (ExtraBold)</Text>
        <Text style={{ fontWeight: "900" }}>Weight 900 (Black)</Text>
        <Text>No fontWeight specified (should be 400 Regular)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Inter Font Weights (Italic)</Text>
        {/* Test each font weight with italic */}
        <Text style={{ fontWeight: "100", fontStyle: "italic" }}>
          Weight 100 (Thin Italic)
        </Text>
        <Text style={{ fontWeight: "200", fontStyle: "italic" }}>
          Weight 200 (ExtraLight Italic)
        </Text>
        <Text style={{ fontWeight: "300", fontStyle: "italic" }}>
          Weight 300 (Light Italic)
        </Text>
        <Text style={{ fontWeight: "400", fontStyle: "italic" }}>
          Weight 400 (Regular Italic)
        </Text>
        <Text style={{ fontWeight: "500", fontStyle: "italic" }}>
          Weight 500 (Medium Italic)
        </Text>
        <Text style={{ fontWeight: "600", fontStyle: "italic" }}>
          Weight 600 (SemiBold Italic)
        </Text>
        <Text style={{ fontWeight: "700", fontStyle: "italic" }}>
          Weight 700 (Bold Italic)
        </Text>
        <Text style={{ fontWeight: "800", fontStyle: "italic" }}>
          Weight 800 (ExtraBold Italic)
        </Text>
        <Text style={{ fontWeight: "900", fontStyle: "italic" }}>
          Weight 900 (Black Italic)
        </Text>
        <Text style={{ fontStyle: "italic" }}>
          No fontWeight specified (should be 400 Italic)
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Combining Styles</Text>
        {/* Test combining with other styles */}
        <Text style={{ fontWeight: "700", fontSize: 24, color: "blue" }}>
          Bold Blue Text (Size 24)
        </Text>
        <Text
          style={{
            fontWeight: "500",
            fontStyle: "italic",
            textDecorationLine: "underline",
          }}
        >
          Medium Italic Underlined
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff", // Or your desired background
  },
  section: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold", // This will use your custom Text's bold logic
    marginBottom: 10,
  },
  // You can add specific styles here if needed, but the goal is to test
  // the fontWeight mapping in your custom Text component
});

export default CustomTextTest;
