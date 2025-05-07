// File: /utils/firebase/rtdb/historyApi.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { firebaseConfig } from "../../../constants/firebase";

const databaseURL = firebaseConfig.databaseURL;

export const fetchHistoryFromFirebase = async () => {
  try {
    let userEmail = await AsyncStorage.getItem("email");
    userEmail = userEmail.replace("@", "(at)").replace(".", "(dot)");
    const token = await AsyncStorage.getItem("token");
    // const endpointURL = `${databaseURL}/attendanceData/${userEmail}.json?auth=${token}`;
    const endpointURL = `${databaseURL}/users/${userEmail}/attendanceData.json?auth=${token}`; // UPDATED PATH
    // console.log(endpointURL);

    const historyResponse = await axios.get(endpointURL, {
      headers: { "Content-Type": "application/json" },
    });
    // console.log(JSON.stringify(historyResponse));

    const firebaseHistoryData = historyResponse.data; // Raw data from Firebase
    console.log("Raw history data from Firebase:", firebaseHistoryData); // Log raw data

    // Transform Firebase object into an array
    const historyArray = firebaseHistoryData
      ? Object.entries(firebaseHistoryData).map(([date, data]) => ({
          date: date, // Keep the date string as is, or format as needed
          ...data, // Spread the rest of the attendance data for that date
        }))
      : []; // Handle case where firebaseHistoryData is null (no history)

    console.log("Transformed history array:", historyArray); // Log transformed array
    return historyArray.reverse(); // Return the transformed array
  } catch (error) {
    console.error("Error fetching attendance history data:", error);
    return null;
  }
};
