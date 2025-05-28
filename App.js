import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Alert, AppState } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import * as Device from "expo-device";
import * as ScreenOrientation from "expo-screen-orientation";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent splash from auto-hiding
SplashScreen.preventAutoHideAsync();

// Redux
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, resetAllStates } from "./store";
import {
  logout as logoutAction,
  fetchStoredToken,
  setAuthToken,
} from "./store/authSlice";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens & UI
import Auth from "./screens/Auth";
import Presensi from "./screens/Presensi";
import History from "./screens/History";
import Dashboard from "./screens/Dashboard";
import Debug from "./screens/Debug";
import IconButton from "./components/ui/IconButton";
import Icon from "./components/ui/CustomIcon";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "./constants/styles";

// Firebase utils
import { refreshIdToken } from "./utils/firebase/auth/authApi";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
      screenOptions={{
        tabBarActiveTintColor: "rgba(0,0,0,0.75)",
        tabBarInactiveTintColor: "rgba(0,0,0,0.5)",
        sceneStyle: { backgroundColor: "white" },
      }}
    >
      <BottomTabs.Screen
        name="Presensi"
        component={Presensi}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-line" color={color} size={size} />
          ),
          headerStyle: { backgroundColor: Colors.primary300, height: 60 },
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
        headerShown: false,
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="AttendanceTabs" component={AttendanceBottomTabs} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

function AppContent() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStoredToken()).then(() => setIsTryingLogin(false));

    const interval = setInterval(async () => {
      const storedRefresh = await AsyncStorage.getItem("refreshToken");
      if (storedRefresh) {
        const { idToken, refreshToken } = await refreshIdToken(storedRefresh);
        await AsyncStorage.setItem("token", idToken);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        dispatch(setAuthToken(idToken));
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (isTryingLogin) return null;
  return <Navigation />;
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isDeviceSecure, setIsDeviceSecure] = useState(null);

  // Device security check
  useEffect(() => {
    (async () => {
      try {
        const rooted = await Device.isRootedExperimentalAsync();
        if (rooted) {
          Alert.alert(
            "Device Compromised",
            "This application cannot run on a rooted or jailbroken device for security reasons."
          );
          setIsDeviceSecure(false);
        } else {
          setIsDeviceSecure(true);
        }
      } catch (e) {
        Alert.alert(
          "Security Check Failed",
          "Could not verify device security. Some features may be limited."
        );
        setIsDeviceSecure(false);
      }
    })();
  }, []);

  // Lock orientation
  useEffect(() => {
    const lock = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      } catch (e) {
        console.warn("Failed to lock orientation:", e);
      }
    };
    lock();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") lock();
    });
    return () => sub.remove();
  }, []);

  // Load fonts
  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  // Hide splash when ready
  useEffect(() => {
    if (fontsLoaded && isDeviceSecure !== null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isDeviceSecure]);

  if (!fontsLoaded || isDeviceSecure === null) {
    return null;
  }

  if (isDeviceSecure === false) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ color: "red", textAlign: "center", fontSize: 16 }}>
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
        <AppContent />
      </Provider>
    </>
  );
}
