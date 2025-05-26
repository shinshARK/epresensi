import { firebaseConfig } from "../../../constants/firebase";
import api from "../api";

// TODO: how to refresh token automatically?

export async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${firebaseConfig.apiKey}`;

  const response = await api.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  // console.log(JSON.stringify(response));

  const { idToken, refreshToken } = response.data;

  return { idToken, refreshToken };
}

export async function refreshIdToken(refreshToken) {
  const url = `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`;

  const response = await api.post(url, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  return {
    idToken: response.data.id_token,
    refreshToken: response.data.refresh_token, // New refresh token
  };
}
