// api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "../../constants/firebase";

// Decode JWT and check expiry 30s early
function parseJwt(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

async function isTokenExpired(token) {
  const payload = parseJwt(token);
  console.log(payload);
  if (!payload?.exp) return true;
  return Date.now() > payload.exp * 1000 - 30_000;
}

// Refresh via REST API
async function refreshIdToken(refreshToken) {
  console.log("refreshing token...");
  const url = `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`;
  const { data } = await axios.post(url, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const newId = data.id_token;
  const newRefresh = data.refresh_token;
  await AsyncStorage.setItem("token", newId);
  await AsyncStorage.setItem("refreshToken", newRefresh);
  return newId;
}

// Axios instance
const api = axios.create();

api.interceptors.request.use(async (config) => {
  const original = config.url || "";
  console.log("intercepted");
  // only touch URLs that already include ?auth= or &auth=
  if (/(?:\?|&)auth=[^&]+/.test(original)) {
    console.log("has auth=");
    let idToken = await AsyncStorage.getItem("token");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (idToken && refreshToken && (await isTokenExpired(idToken))) {
      console.log("token expired");
      idToken = await refreshIdToken(refreshToken);
    }
    // replace the old auth=... in the URL
    config.url = original.replace(
      /(auth=)[^&]+/,
      `$1${encodeURIComponent(idToken)}`
    );
  }
  return config;
});

export default api;
