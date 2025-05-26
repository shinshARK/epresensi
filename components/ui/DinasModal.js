import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

const DinasModal = ({
  visible,
  date = "02 Mei 2025",
  timeRange = "08.00 - 17.00",
  onCancel,
  onSubmit,
  selectedType = "dinas",
  description,
  onChangeDescription,
}) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header: Date and Time */}
          <View style={styles.header}>
            <Text style={styles.headerDate}>Hari ini - {date}</Text>
            <Text style={styles.headerTime}>{timeRange}</Text>
          </View>

          {/* Action Buttons Row */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              {/* Replace with your cancel icon */}
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => onSubmit(description)}
            >
              {/* Replace with your travel icon */}
              <Text style={styles.selectButtonText}>Perjalanan Dinas</Text>
            </TouchableOpacity>
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Masukkan keterangan dinas"
              multiline
              value={description}
              onChangeText={onChangeDescription}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
  },
  header: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerDate: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.75)",
    fontWeight: "500",
  },
  headerTime: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.75)",
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cancelButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(238, 238, 238, 1)",
    marginRight: 8,
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "rgba(255, 86, 48, 1)",
    fontSize: 14,
  },
  selectButton: {
    flex: 5,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(238, 238, 238, 1)",
    borderRadius: 30,
    marginLeft: 8,
    justifyContent: "center",
  },
  selectButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 8,
    minHeight: 100,
  },
  textInput: {
    flex: 1,
    textAlignVertical: "top",
    fontSize: 14,
  },
});

export default DinasModal;
