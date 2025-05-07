import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authenticate } from "../utils/firebase/auth/authApi";

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const token = await authenticate("signUp", email, password);

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("email", email);

      return token;
    } catch (error) {
      return rejectWithValue(
        error.response.data.error.message || "Signup failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const token = await authenticate("signInWithPassword", email, password);

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("email", email);

      return token;
    } catch (error) {
      return rejectWithValue(
        error.response.data.error.message || "Login failed"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("email");

      console.log("asyncstorage remove finished.");
      return null; // Token is removed, return null to reset state
    } catch (error) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const fetchStoredToken = createAsyncThunk(
  "auth/fetchStoredToken",
  async (_, { rejectWithValue }) => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      return storedToken;
    } catch (error) {
      return rejectWithValue(error.message || "Could not fetch token");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    isAuthenticated: false,
    isAuthenticating: false,
    error: null,
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signup.pending, (state) => {
      state.isAuthenticating = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.isAuthenticating = false;
      state.isAuthenticated = true;
      state.token = action.payload;
      state.error = null;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.isAuthenticating = false;
      state.isAuthenticated = false;
      state.token = null;
      state.error = action.payload;
    });
    // Login reducers
    builder.addCase(login.pending, (state) => {
      state.isAuthenticating = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isAuthenticating = false;
      state.isAuthenticated = true;
      state.token = action.payload;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isAuthenticating = false;
      state.isAuthenticated = false;
      state.token = null;
      state.error = action.payload;
    });
    // Logout reducers
    builder.addCase(logout.pending, (state) => {
      state.isAuthenticating = true; // maybe not needed for logout, depends on UI
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isAuthenticating = false;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      // rootReducer(undefined, { type: RESET_STATE });
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isAuthenticating = false;
      state.error = action.payload;
      // State is already reset in fulfilled, maybe handle error display if needed
    });
    // fetchStoredToken reducers
    builder.addCase(fetchStoredToken.pending, (state) => {
      state.isAuthenticating = true;
      state.error = null;
    });
    builder.addCase(fetchStoredToken.fulfilled, (state, action) => {
      state.isAuthenticating = false;
      state.token = action.payload || null; // handle null token
      state.isAuthenticated = !!action.payload;
      state.error = null;
    });
    builder.addCase(fetchStoredToken.rejected, (state, action) => {
      state.isAuthenticating = false;
      state.error = action.payload;
    });
  },
});

export const { setAuthToken } = authSlice.actions;
export default authSlice.reducer;
