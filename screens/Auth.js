import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import {
  login as loginAction,
  signup as signupAction,
} from "../store/authSlice";

import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "../constants/styles";

const windowWidth = Dimensions.get("window").width;

const Auth = () => {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Login logic using Redux
  const handleLogin = async () => {
    console.log("Logging in with", { email, password });
    try {
      await dispatch(loginAction({ email, password })).unwrap();
      // navigate or handle success
    } catch (error) {
      // console.error("Login failed", err);
      // show error alert
      let alertTitle = "Login Failed";
      let alertMessage =
        "An unexpected error occurred. Please try again later."; // Default message

      // Try to extract the error code. Adjust this based on your actual error object structure.
      // Common places for error codes: error.code, error.message (if it's the code itself),
      // or error.payload.code if you used rejectWithValue({ code: '...', ...}) in your thunk.
      const errorCode =
        typeof error === "string"
          ? error
          : error.code ||
            (error.payload && error.payload.code) ||
            error.message;

      console.log(errorCode);

      switch (errorCode) {
        case "INVALID_EMAIL":
          alertMessage =
            "The email address provided is invalid or not supported. Please check the format and try again.";
          break;
        case "EMAIL_NOT_FOUND": // If your backend sends a more specific code for this
        case "INVALID_PASSWORD":
          alertMessage = "Invalid credentials, wrong email or password";
          break;
        case "USER_DISABLED":
          // This is less common for a new registration attempt unless the email was previously registered and then disabled.
          alertMessage =
            "This account is currently disabled. If you believe this is an error, please contact support.";
          break;

        default:
          // For unhandled specific codes or if errorCode is null/undefined,
          // the default "An unexpected error occurred..." message will be used.
          // You might also check if 'error.message' contains a somewhat user-friendly string from backend for other errors:
          if (
            typeof error.message === "string" &&
            error.message !== errorCode &&
            errorCode !== null
          ) {
            // Avoid showing generic "[object Object]" or the code again
            // alertMessage = error.message; // Uncomment this cautiously: only if you trust your backend to send user-friendly messages.
          }
          break;
      }
      Alert.alert(alertTitle, alertMessage);
    }
  };

  // Registration logic using Redux
  const handleRegister = async () => {
    console.log("Registering with", {
      email,
      confirmEmail,
      password,
      confirmPassword,
    });

    if (!isLogin && password !== confirmPassword) {
      Alert.alert("Registration Failed", "Passwords do not match.");
      return;
    }
    if (!isLogin && email !== confirmEmail) {
      // Only check confirmEmail if in signup mode and it's relevant
      Alert.alert("Registration Failed", "Email addresses do not match.");
      return;
    }

    try {
      await dispatch(signupAction({ email, password })).unwrap();
      // navigate or handle success
    } catch (error) {
      // console.error("Registration failed", err);
      // Alert.alert("Registration failed", err);

      // show error alert
      let alertTitle = "Registration Failed";
      let alertMessage =
        "An unexpected error occurred. Please try again later."; // Default message

      // Try to extract the error code. Adjust this based on your actual error object structure.
      // Common places for error codes: error.code, error.message (if it's the code itself),
      // or error.payload.code if you used rejectWithValue({ code: '...', ...}) in your thunk.
      console.log(error);
      const errorCode =
        typeof error === "string"
          ? error
          : error.code ||
            (error.payload && error.payload.code) ||
            error.message;

      console.log(errorCode);

      switch (errorCode) {
        case "INVALID_EMAIL":
          alertMessage =
            "The email address provided is invalid or not supported. Please check the format and try again.";
          break;
        case "EMAIL_EXISTS": // If your backend sends a more specific code for this
        case "INVALID_PASSWORD":
          alertMessage = "Invalid credentials, wrong email or password";
          break;
        default:
          // For unhandled specific codes or if errorCode is null/undefined,
          // the default "An unexpected error occurred..." message will be used.
          // You might also check if 'error.message' contains a somewhat user-friendly string from backend for other errors:
          if (
            typeof error.message === "string" &&
            error.message !== errorCode &&
            errorCode !== null
          ) {
            // Avoid showing generic "[object Object]" or the code again
            // alertMessage = error.message; // Uncomment this cautiously: only if you trust your backend to send user-friendly messages.
          }
          break;
      }
      Alert.alert(alertTitle, alertMessage);
    }
  };

  function switchModeHandler() {
    setIsLogin((prev) => !prev);
    setEmail("");
    setConfirmEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  function submitHandler() {
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        // enabled={true}
        keyboardVerticalOffset={-50}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={styles.inner}
      >
        {/* Logo section stays fixed at top */}
        <View style={styles.half}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/logo_fixed.png")}
              style={styles.logo}
            />
          </View>
        </View>

        {/* Form section at bottom with enough space for register fields */}
        <View style={styles.half}>
          <View style={styles.formContainer}>
            {Platform.OS === "android" && (
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.15)"]}
                style={{
                  position: "absolute",
                  top: 0, // Or a slight negative offset if you want it "above" the border
                  left: 0,
                  right: 0,
                  height: 10, // Adjust height of the shadow
                  borderTopLeftRadius: 20, // Match parent
                  borderTopRightRadius: 20, // Match parent
                }}
              />
            )}
            <Text style={styles.title}>
              {isLogin ? "Login e-Presensi" : "Register e-Presensi"}
            </Text>

            <Text style={styles.label}>Alamat Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Alamat Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {!isLogin && (
              <>
                <Text style={styles.label}>Konfirmasi Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan ulang Alamat Email"
                  value={confirmEmail}
                  onChangeText={setConfirmEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </>
            )}

            <Text style={styles.label}>Kata Sandi</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Kata Sandi"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {!isLogin && (
              <>
                <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan ulang Kata Sandi"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </>
            )}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={submitHandler}
            >
              <Text style={styles.loginButtonText}>
                {isLogin ? "Log In" : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={switchModeHandler}
            >
              <Text style={styles.registerText}>
                {isLogin ? "Buat Pengguna Baru" : "Log in instead"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    flex: 1,
    justifyContent: "space-between",
  },
  half: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    padding: 2,
    marginTop: 100,
  },
  logo: {
    width: Math.floor(windowWidth / 2),
    height: Math.floor(windowWidth / 2),
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: -10 },
    shadowRadius: 4,
    // borderTopWidth: 1,
    // elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "left",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: Colors.primary300,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    borderWidth: 1,
    borderColor: "#cfcfcf",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  registerText: {
    color: "rgba(0, 0, 0, 0.75)",
    fontSize: 14,
    textAlign: "center",
  },
});

export default Auth;
