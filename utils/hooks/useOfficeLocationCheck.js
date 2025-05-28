// utils/hooks/useOfficeLocationCheck.js
import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
// Remove Alert from here if the hook won't show them
// import { Alert } from "react-native";
import { haversine } from "../location";
import { useSelector } from "react-redux";
import { isMockingLocation } from "react-native-turbo-mock-location-detector";

// Assuming LocationCheckStatus is imported or defined above
export const LocationCheckStatus = {
  IN_RANGE: "IN_RANGE",
  NOT_IN_RANGE: "NOT_IN_RANGE",
  MOCK_DETECTED: "MOCK_DETECTED",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  OFFICE_COORDS_MISSING: "OFFICE_COORDS_MISSING",
  LOCATION_ERROR: "LOCATION_ERROR",
  MOCK_CHECK_ERROR: "MOCK_CHECK_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

const OFFICE_RADIUS_METERS = 50;

const useOfficeLocationCheck = () => {
  const {
    latitude: officeLatitudeFromStore,
    longitude: officeLongitudeFromStore,
  } = useSelector((state) => state.unitKerja);

  const officeCoordsRef = useRef({ latitude: null, longitude: null });
  const [officeCoordsLoaded, setOfficeCoordsLoaded] = useState(false);

  useEffect(() => {
    officeCoordsRef.current = {
      latitude: officeLatitudeFromStore,
      longitude: officeLongitudeFromStore,
    };
    if (
      officeCoordsRef.current.latitude != null &&
      officeCoordsRef.current.longitude != null
    ) {
      // Check for non-null/undefined
      setOfficeCoordsLoaded(true);
      console.log(
        "Office coordinates loaded into ref:",
        officeCoordsRef.current
      );
    } else {
      setOfficeCoordsLoaded(false); // Explicitly set to false if coords are not valid
    }
  }, [officeLatitudeFromStore, officeLongitudeFromStore]);

  const [isLocationLoading, setIsLocationLoading] = useState(false);
  // No need for mockLocationDetected state here if we return status

  const isLocationInOfficeRange = async () => {
    setIsLocationLoading(true);
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
      return {
        status: LocationCheckStatus.OFFICE_COORDS_MISSING,
        message: "Office coordinates are not loaded.",
      };
    }

    try {
      let { status: permissionStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (permissionStatus !== "granted") {
        setIsLocationLoading(false);
        return {
          status: LocationCheckStatus.PERMISSION_DENIED,
          message: "Location permission not granted.",
        };
      }

      // --- Mock Location Check (turbo-mock-location-detector) ---
      try {
        const mockResult = await isMockingLocation();
        if (mockResult && mockResult.isLocationMocked) {
          console.warn(
            "Mock location detected via turbo-mock-location-detector."
          );
          setIsLocationLoading(false);
          return {
            status: LocationCheckStatus.MOCK_DETECTED,
            message: "Mock location detected (turbo).",
          };
        }
      } catch (mockError) {
        console.error("Error checking for mock location (turbo):", mockError);
        // Decide if this is a critical failure or a warning
        // For now, let's consider it an error that prevents accurate check
        setIsLocationLoading(false);
        return {
          status: LocationCheckStatus.MOCK_CHECK_ERROR,
          message: "Failed to verify mock location status (turbo).",
        };
      }

      let location;
      try {
        location = await Location.getCurrentPositionAsync({});
      } catch (posError) {
        console.error(
          "Error getting current position with Expo Location:",
          posError
        );
        setIsLocationLoading(false);
        return {
          status: LocationCheckStatus.LOCATION_ERROR,
          message: "Could not get current location using Expo Location.",
        };
      }
      console.log(`current coords ${JSON.stringify(location.coords)}`);

      // --- Expo's built-in mock detection ---
      if (location.mocked) {
        console.warn("Mock location detected via Expo Location API.");
        setIsLocationLoading(false);
        return {
          status: LocationCheckStatus.MOCK_DETECTED,
          message: "Mock location detected (Expo).",
        };
      }

      const distance = haversine(
        location.coords.latitude,
        location.coords.longitude,
        latestOfficeLat,
        latestOfficeLng
      );
      console.log(`distance: ${distance}`);

      if (distance <= OFFICE_RADIUS_METERS) {
        return {
          status: LocationCheckStatus.IN_RANGE,
          message: "User is within office range.",
        };
      } else {
        return {
          status: LocationCheckStatus.NOT_IN_RANGE,
          message: `User is ${distance.toFixed(
            0
          )}m away. Required: ${OFFICE_RADIUS_METERS}m.`,
        };
      }
    } catch (error) {
      console.error("General Location Check Error:", error);
      return {
        status: LocationCheckStatus.UNKNOWN_ERROR,
        message: "An unexpected error occurred during location check.",
      };
    } finally {
      setIsLocationLoading(false);
    }
  };

  // No need to expose mockLocationDetected if status covers it
  return { isLocationInOfficeRange, isLocationLoading, officeCoordsLoaded };
};

export default useOfficeLocationCheck;
