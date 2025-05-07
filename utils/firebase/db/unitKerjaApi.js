import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { firebaseConfig } from "../../../constants/firebase";

const databaseURL = firebaseConfig.databaseURL;

export const fetchUnitKerjaFromFirebase = async (email) => {
  try {
    const formattedEmail = email.replace("@", "(at)").replace(".", "(dot)");
    const token = await AsyncStorage.getItem("token");
    const endpointURL = `${databaseURL}/users/${formattedEmail}/unit_kerja.json?auth=${token}`;

    const unitKerjaResponse = await axios.get(endpointURL, {
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
