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
} from "react-native";
import { useDispatch } from "react-redux";
import {
  login as loginAction,
  signup as signupAction,
} from "../store/authSlice";

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
    } catch (err) {
      console.error("Login failed", err);
      // show error alert
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
    try {
      await dispatch(signupAction({ email, password })).unwrap();
      // navigate or handle success
    } catch (err) {
      console.error("Registration failed", err);
      // show error alert
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
    elevation: 8,
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
