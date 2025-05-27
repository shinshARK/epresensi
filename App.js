// ui
import { StatusBar } from "expo-status-bar";
import { AppState, StyleSheet, Text, View, Alert } from "react-native"; // <--- Add Alert
import AppLoading from "expo-app-loading";
import { Colors } from "./constants/styles";
import IconButton from "./components/ui/IconButton";
import * as Font from "expo-font";
import * as Device from "expo-device"; // <--- Import expo-device

// icons
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

// nav
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

// screens
import Auth from "./screens/Auth";
import Presensi from "./screens/Presensi";
import History from "./screens/History";
import Dashboard from "./screens/Dashboard";
import Debug from "./screens/Debug";

// react
import { useCallback, useEffect, useState } from "react";

// redux
import { Provider, useDispatch, useSelector } from "react-redux";
import { resetAllStates, store } from "./store";
import {
  logout as logoutAction,
  fetchStoredToken,
  setAuthToken,
} from "./store/authSlice";
import Icon from "./components/ui/CustomIcon";
import { refreshIdToken } from "./utils/firebase/auth/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenOrientation from "expo-screen-orientation";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={Auth} />
    </Stack.Navigator>
  );
}

function AttendanceBottomTabs() {
  const dispatch = useDispatch();
  const logoutHandler = useCallback(() => {
    dispatch(logoutAction());
    dispatch(resetAllStates());
  }, [dispatch]);

  return (
    <BottomTabs.Navigator
      screenOptions={({}) => ({
        tabBarActiveTintColor: "rgba(0, 0, 0, 0.75)",
        tabBarInactiveTintColor: "rgba(0, 0, 0, 0.50)",
        sceneStyle: {
          backgroundColor: "white",
        },
      })}
    >
      <BottomTabs.Screen
        name="Presensi"
        component={Presensi}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-line" color={color} size={size} />
          ),
          headerStyle: {
            backgroundColor: Colors.primary300,
            height: 60,
          },
          headerShadowVisible: false,
          headerTitle: "",
        }}
      />
      <BottomTabs.Screen
        name="Riwayat"
        component={History}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" color={color} size={size} />
          ),
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 16,
            fontFamily: "sans-serif",
          },
        }}
      />
      <BottomTabs.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="podium-outline" color={color} size={size} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Debug"
        component={Debug}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bug-outline" color={color} size={size} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
        headerShown: false,
      }}
    >
      <Stack.Screen name="AttendanceTabs" component={AttendanceBottomTabs} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log(`is authenticated? ${isAuthenticated}`);
  return (
    <NavigationContainer>
      {!isAuthenticated && <AuthStack />}
      {isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshTokenInterval = setInterval(async () => {
      const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
      if (storedRefreshToken) {
        const { idToken: newToken, refreshToken: newRefresh } =
          await refreshIdToken(storedRefreshToken);
        await AsyncStorage.setItem("token", newToken);
        await AsyncStorage.setItem("refreshToken", newRefresh);
        dispatch(setAuthToken(newToken));
      }
    }, 50 * 60 * 1000); // every 50 minutes

    return () => clearInterval(refreshTokenInterval);
  }, [dispatch]); // <--- Added dispatch to dependency array for consistency

  useEffect(() => {
    dispatch(fetchStoredToken()).then(() => {
      setIsTryingLogin(false);
    });
  }, [dispatch]);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  return <Navigation />;
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isDeviceSecure, setIsDeviceSecure] = useState(null); // null: checking, true: secure, false: compromised

  // ---- START: Root/Jailbreak Check useEffect ----
  useEffect(() => {
    const checkDeviceSecurity = async () => {
      try {
        const isRooted = await Device.isRootedExperimentalAsync();
        if (isRooted) {
          console.warn("Device is rooted/jailbroken.");
          Alert.alert(
            "Device Compromised",
            "This application cannot run on a rooted or jailbroken device for security reasons. Please use a secure device.",
            [{ text: "OK", onPress: () => {} }] // You might want to exit the app here: BackHandler.exitApp() on Android
            // or prevent further navigation.
          );
          setIsDeviceSecure(false);
          // Depending on your app's policy, you might want to:
          // 1. Prevent rendering the rest of the app.
          // 2. Log this event to your server.
          // 3. For Android, you could use `BackHandler.exitApp();` after the alert.
        } else {
          console.log("Device is not rooted/jailbroken.");
          setIsDeviceSecure(true);
        }
      } catch (error) {
        console.error("Failed to check device security:", error);
        Alert.alert(
          "Security Check Failed",
          "Could not verify device security. For your protection, some features might be limited or the app may not run correctly."
        );
        setIsDeviceSecure(false); // Treat as compromised if check fails
      }
    };

    checkDeviceSecurity();
  }, []); // Empty dependency array: run once on mount
  // ---- END: Root/Jailbreak Check useEffect ----

  // ---- START: Screen Orientation Lock useEffect ----
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
        console.log("Screen orientation locked to PORTRAIT_UP.");
      } catch (error) {
        console.warn("Failed to lock screen orientation:", error);
      }
    };

    lockOrientation();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        console.log("App is active, re-locking orientation to portrait.");
        lockOrientation();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  // ---- END: Screen Orientation Lock useEffect ----

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Inter-Black": require("./assets/fonts/Inter/Inter-Black.ttf"),
        "Inter-BlackItalic": require("./assets/fonts/Inter/Inter-BlackItalic.ttf"),
        "Inter-Bold": require("./assets/fonts/Inter/Inter-Bold.ttf"),
        "Inter-BoldItalic": require("./assets/fonts/Inter/Inter-BoldItalic.ttf"),
        "Inter-ExtraBold": require("./assets/fonts/Inter/Inter-ExtraBold.ttf"),
        "Inter-ExtraBoldItalic": require("./assets/fonts/Inter/Inter-ExtraBoldItalic.ttf"),
        "Inter-ExtraLight": require("./assets/fonts/Inter/Inter-ExtraLight.ttf"),
        "Inter-ExtraLightItalic": require("./assets/fonts/Inter/Inter-ExtraLightItalic.ttf"),
        "Inter-Italic": require("./assets/fonts/Inter/Inter-Italic.ttf"),
        "Inter-Light": require("./assets/fonts/Inter/Inter-Light.ttf"),
        "Inter-LightItalic": require("./assets/fonts/Inter/Inter-LightItalic.ttf"),
        "Inter-Medium": require("./assets/fonts/Inter/Inter-Medium.ttf"),
        "Inter-MediumItalic": require("./assets/fonts/Inter/Inter-MediumItalic.ttf"),
        "Inter-Regular": require("./assets/fonts/Inter/Inter-Regular.ttf"),
        "Inter-SemiBold": require("./assets/fonts/Inter/Inter-SemiBold.ttf"),
        "Inter-SemiBoldItalic": require("./assets/fonts/Inter/Inter-SemiBoldItalic.ttf"),
        "Inter-Thin": require("./assets/fonts/Inter/Inter-Thin.ttf"),
        "Inter-ThinItalic": require("./assets/fonts/Inter/Inter-ThinItalic.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded || isDeviceSecure === null) {
    // <--- Also wait for device security check
    return <AppLoading />;
  }

  if (isDeviceSecure === false) {
    // Optionally, render a specific "Device Compromised" screen instead of AppLoading or null
    // For now, AppLoading will show until the alert is dismissed, then it might show a blank screen
    // or the app might crash depending on how you handle navigation after the alert.
    // A dedicated screen is a better user experience.
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 16, color: "red" }}>
          This application cannot run on a rooted or jailbroken device for
          security reasons.
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Provider store={store}>
        <Root />
      </Provider>
    </>
  );
}
