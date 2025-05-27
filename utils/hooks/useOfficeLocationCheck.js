// utils/hooks/useOfficeLocationCheck.js
import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { haversine } from "../location"; // Assuming this is your haversine function file
import { useSelector } from "react-redux";
import { isMockingLocation } from "react-native-turbo-mock-location-detector"; // <--- Import the library

const OFFICE_RADIUS_METERS = 50;

const useOfficeLocationCheck = () => {
  const {
    alamat: OFFICE_ADDRESS,
    latitude: officeLatitudeFromStore,
    longitude: officeLongitudeFromStore,
    nama_unit_kerja: OFFICE_NAME,
  } = useSelector((state) => state.unitKerja);

  const officeCoordsRef = useRef({ latitude: null, longitude: null });

  useEffect(() => {
    officeCoordsRef.current = {
      latitude: officeLatitudeFromStore,
      longitude: officeLongitudeFromStore,
    };
    console.log("Office coordinates ref updated:", officeCoordsRef.current);
  }, [officeLatitudeFromStore, officeLongitudeFromStore]);

  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [mockLocationDetected, setMockLocationDetected] = useState(false); // <--- Add state for mock detection

  const isLocationInOfficeRange = async () => {
    setIsLocationLoading(true);
    setMockLocationDetected(false); // Reset mock detection status at the start of a check
    const { latitude: latestOfficeLat, longitude: latestOfficeLng } =
      officeCoordsRef.current;

    if (
      latestOfficeLat === null ||
      latestOfficeLng === null ||
      latestOfficeLat === undefined ||
      latestOfficeLng === undefined
    ) {
      console.warn(
        "Attempted location check before office coordinates were loaded into ref."
      );
      setIsLocationLoading(false);
      return false;
    }

    try {
      let { status: permissionStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (permissionStatus !== "granted") {
        Alert.alert(
          "Location permission not granted",
          "Please grant location permission to check attendance."
        );
        setIsLocationLoading(false);
        return false;
      }

      // --- Mock Location Check ---
      try {
        const mockResult = await isMockingLocation();
        if (mockResult && mockResult.isLocationMocked) {
          console.warn(
            "Mock location detected via turbo-mock-location-detector."
          );
          Alert.alert(
            "Mock Location Detected",
            "Please disable mock location services to proceed with attendance."
          );
          setMockLocationDetected(true); // Set mock detection status
          setIsLocationLoading(false);
          return false; // Prevent further action if mock location is detected
        }
      } catch (mockError) {
        console.error("Error checking for mock location:", mockError);
        // Optionally, decide if you want to block attendance if the check itself fails
        // For now, we'll allow it to proceed but log the error.
        // Alert.alert("Mock Check Error", "Could not verify if location is mocked. Please try again.");
        // setIsLocationLoading(false);
        // return false;
      }
      // --- End Mock Location Check ---

      let location = await Location.getCurrentPositionAsync({});
      console.log(`current coords ${JSON.stringify(location.coords)}`);

      // --- Additional check with Expo's built-in mock detection (if available and for robustness) ---
      if (location.mocked) {
        console.warn("Mock location detected via Expo Location API.");
        Alert.alert(
          "Mock Location Detected",
          "Please disable mock location services to proceed with attendance (Expo)."
        );
        setMockLocationDetected(true); // Set mock detection status
        setIsLocationLoading(false);
        return false;
      }
      // --- End Expo Mock Check ---

      const distance = haversine(
        location.coords.latitude,
        location.coords.longitude,
        latestOfficeLat,
        latestOfficeLng
      );
      console.log(`distance: ${distance}`);
      return distance <= OFFICE_RADIUS_METERS;
    } catch (error) {
      console.error("Location Error:", error); // Log the actual error
      Alert.alert(
        "Location Error",
        "Could not get location. Please try again."
      );
      return false;
    } finally {
      setIsLocationLoading(false);
    }
  };

  return { isLocationInOfficeRange, isLocationLoading, mockLocationDetected }; // <--- Expose mockLocationDetected
};

export default useOfficeLocationCheck;
