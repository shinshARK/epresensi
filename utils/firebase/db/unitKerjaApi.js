import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "../../../constants/firebase";
import api from "../api";

const databaseURL = firebaseConfig.databaseURL;

export const fetchUnitKerjaFromFirebase = async (email) => {
  try {
    const formattedEmail = email.replace("@", "(at)").replace(".", "(dot)");
    const token = await AsyncStorage.getItem("token");
    const endpointURL = `${databaseURL}/users/${formattedEmail}/unit_kerja.json?auth=${token}`;

    const unitKerjaResponse = await api.get(endpointURL, {
      headers: { "Content-Type": "application/json" },
    });

    const unitKerjaData = unitKerjaResponse.data;
    console.log("Unit Kerja data fetched:", unitKerjaData);
    return unitKerjaData;
  } catch (error) {
    console.error("Error fetching Unit Kerja data:", error);
    return null;
  }
};
