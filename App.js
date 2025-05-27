// ui
import { StatusBar } from "expo-status-bar";
import { AppState, StyleSheet, Text, View } from "react-native";
import AppLoading from "expo-app-loading";
import { Colors } from "./constants/styles";
import IconButton from "./components/ui/IconButton";
import * as Font from "expo-font";

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
import * as ScreenOrientation from "expo-screen-orientation"; // <<< IMPORT THIS

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // headerStyle: { backgroundColor: Colors.primary500 },
        // headerTintColor: "white",
        // contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Auth" component={Auth} />
      {/* <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} /> */}
    </Stack.Navigator>
  );
}

function AttendanceBottomTabs() {
  const dispatch = useDispatch();
  const logoutHandler = useCallback(() => {
    dispatch(logoutAction()); // Then dispatch logoutAction
    dispatch(resetAllStates()); // Dispatch resetAllStates FIRST
  }, [dispatch]); // Added `navigation` to dependency array

  return (
    <BottomTabs.Navigator
      screenOptions={({}) => ({
        tabBarActiveTintColor: "rgba(0, 0, 0, 0.75)", // Set the color for the active tab icon and label
        tabBarInactiveTintColor: "rgba(0, 0, 0, 0.50)", // Set the color for inactive tab icons and labels
        sceneStyle: {
          backgroundColor: "white", // Replace with the color you want
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
          // headerShown: false,
          headerStyle: {
            backgroundColor: Colors.primary300,
            height: 60,
          },
          headerShadowVisible: false,
          headerTitle: "",
          // headerRight: () => (
          //   <View style={{ marginRight: 16 }}>
          //     {/* Adjust the value (16) as needed */}
          //     <IconButton
          //       icon="exit"
          //       color="white"
          //       size={24}
          //       onPress={logoutHandler}
          //       // No need to pass style prop to IconButton here
          //     />
          //   </View>
          // ),
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
            fontSize: 16, // <--- Set the desired font size here
            // You can add other text styles like fontFamily, color (though headerTintColor often handles color)
            // color: 'white',
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
        headerShown: false, // Hide header for the entire AuthenticatedStack as tabs will have their own headers if needed
      }}
    >
      <Stack.Screen
        name="AttendanceTabs" // Directly render AttendanceBottomTabs
        component={AttendanceBottomTabs}
      />
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
  }, []);

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

    lockOrientation(); // Attempt to lock when the App component mounts

    // Add a listener to re-apply the lock when the app comes to the foreground
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        console.log("App is active, re-locking orientation to portrait.");
        lockOrientation();
      }
    });

    // Clean up the subscription when the component unmounts
    return () => {
      subscription.remove();
      // You might consider unlocking if your app ever needs other orientations,
      // but for an "always portrait" app, this is typically not needed.
      // ScreenOrientation.unlockAsync();
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount
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

  if (!fontsLoaded) {
    return <AppLoading />;
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
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
