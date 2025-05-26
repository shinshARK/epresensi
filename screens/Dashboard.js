import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomTextTest from "../components/ui/CustomTextTest";

const Dashboard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Header Line 1</Text>
        <Text>Header Line 2</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.box}>
          <Text>Box 1</Text>
        </View>
        <View style={styles.box}>
          <Text>Box 2</Text>
        </View>
      </View>

      <View style={styles.middleBlock}>
        <Text>Middle Block</Text>
      </View>

      <View style={styles.bottomBlock}>
        <CustomTextTest></CustomTextTest>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  box: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderWidth: 1,
  },
  middleBlock: {
    height: 100,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
  },
  bottomBlock: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
  },
});

export default Dashboard;
