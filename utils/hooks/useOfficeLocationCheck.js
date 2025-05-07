// utils/hooks/useOfficeLocationCheck.js
import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { haversine } from "../location";
import { useSelector } from "react-redux";

const OFFICE_RADIUS_METERS = 50; // Moved constant outside component

const useOfficeLocationCheck = () => {
  const {
    alamat: OFFICE_ADDRESS,
    latitude: officeLatitudeFromStore, // Use different variable names for clarity
    longitude: officeLongitudeFromStore, // Use different variable names for clarity
    nama_unit_kerja: OFFICE_NAME,
  } = useSelector((state) => state.unitKerja);

  // Create a ref to store the latest coordinates
  const officeCoordsRef = useRef({ latitude: null, longitude: null });

  // Update the ref whenever the store coordinates change
  useEffect(() => {
    officeCoordsRef.current = {
      latitude: officeLatitudeFromStore,
      longitude: officeLongitudeFromStore,
    };
    console.log("Office coordinates ref updated:", officeCoordsRef.current); // Add log to see ref updates
  }, [officeLatitudeFromStore, officeLongitudeFromStore]); // Depend on the store values

  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const isLocationInOfficeRange = async () => {
    setIsLocationLoading(true);
    const { latitude: latestOfficeLat, longitude: latestOfficeLng } =
      officeCoordsRef.current;

    // Add the check using the ref values
    if (
      latestOfficeLat === null ||
      latestOfficeLng === null ||
      latestOfficeLat === undefined ||
      latestOfficeLng === undefined
    ) {
      console.warn(
        "Attempted location check before office coordinates were loaded into ref."
      ); // Use warn if periodic
      setIsLocationLoading(false); // Ensure loading is turned off
      return false; // Cannot check location without office coordinates
    }

    try {
      let { status: permissionStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (permissionStatus !== "granted") {
        Alert.alert(
          "Location permission not granted",
          "Please grant location permission to check attendance."
        );
        setIsLocationLoading(false); // Ensure loading is turned off
        return false;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(`current coords ${JSON.stringify(location.coords)}`);
      const distance = haversine(
        location.coords.latitude,
        location.coords.longitude,
        latestOfficeLat,
        latestOfficeLng
      );
      console.log(`distance: ${distance}`);
      return distance <= OFFICE_RADIUS_METERS;
    } catch (error) {
      Alert.alert(
        "Location Error",
        "Could not get location. Please try again."
      );
      return false;
    } finally {
      setIsLocationLoading(false);
    }
  };

  return { isLocationInOfficeRange, isLocationLoading };
};

export default useOfficeLocationCheck;
