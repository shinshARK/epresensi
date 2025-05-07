import axios from "axios";
import { firebaseConfig } from "../../../constants/firebase";

// TODO: how to refresh token automatically?

export async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${firebaseConfig.apiKey}`;

  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  // console.log(JSON.stringify(response));

  const token = response.data.idToken;

  return token;
}
