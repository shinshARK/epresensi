import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";
import { store } from "../store"; // Import your Redux store
import { setBiometricAvailability } from "../store/biometricSlice"; // Import the action

/**
 * Checks if biometric authentication is available and enrolled on the device.
 * Dispatches an action to update the biometric availability status in Redux store.
 */
export const checkBiometricAvailability = async () => {
  try {
    // Check if hardware supports biometric authentication
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      console.log(
        "Biometric Authentication Not Supported: Hardware not available"
      );
      store.dispatch(setBiometricAvailability(false)); // Dispatch false to Redux
      return false;
    }

    // Check if biometrics are enrolled
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert(
        "Biometrics Not Enrolled",
        "No biometrics are enrolled on your device. Please set up fingerprint or face recognition in your device settings."
      );
      store.dispatch(setBiometricAvailability(false)); // Dispatch false to Redux
      return false;
    }

    console.log("Biometric Authentication Available and Enrolled");
    store.dispatch(setBiometricAvailability(true)); // Dispatch true to Redux
    return true; // Biometric authentication is available and enrolled
  } catch (error) {
    console.error("Error checking biometric availability:", error);
    store.dispatch(setBiometricAvailability(false)); // Dispatch false on error
    return false; // Assume not available on error
  }
};

/**
 * Prompts the user for biometric authentication.
 * Assumes biometric availability has already been checked.
 *
 * @returns {Promise<boolean>} - A promise that resolves to true if authentication is successful, false otherwise.
 */
export const promptBiometricAuth = async () => {
  try {
    // Authenticate user with biometrics (Availability already checked)
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to Check In", // Customize prompt message
      fallbackLabel: "Use Passcode", // Customize fallback button label (iOS only)
      cancelLabel: "Cancel", // Customize cancel button label (Android only)
    });

    return result.success; // Return true if authentication was successful
  } catch (error) {
    console.error("Biometric authentication prompt error:", error);
    Alert.alert(
      "Biometric Authentication Failed",
      "There was an error during biometric authentication. Please try again."
    );
    return false; // Authentication failed due to error
  }
};
