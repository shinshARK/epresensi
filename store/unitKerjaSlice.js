import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUnitKerjaFromFirebase } from "../utils/firebase/db/unitKerjaApi"; // Import the API function

const initialState = {
  alamat: null,
  latitude: null,
  longitude: null,
  nama_unit_kerja: null,
  loading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchUnitKerja = createAsyncThunk(
  "unitKerja/fetchUnitKerja",
  async (email, { rejectWithValue }) => {
    try {
      const unitKerjaData = await fetchUnitKerjaFromFirebase(email);
      return unitKerjaData;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

const unitKerjaSlice = createSlice({
  name: "unitKerja",
  initialState,
  reducers: {
    setUnitKerjaData: (state, action) => {
      // Directly update top-level properties
      state.alamat = action.payload?.alamat;
      state.latitude = action.payload?.latitude;
      state.longitude = action.payload?.longitude;
      state.nama_unit_kerja = action.payload?.nama_unit_kerja;
    },
    clearUnitKerjaData: (state) => {
      state.alamat = null;
      state.latitude = null;
      state.longitude = null;
      state.nama_unit_kerja = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnitKerja.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchUnitKerja.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.unitKerjaData = action.payload;
      })
      .addCase(fetchUnitKerja.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload.error;
        state.unitKerjaData = null;
      });
  },
});

export const { setUnitKerjaData, clearUnitKerjaData } = unitKerjaSlice.actions;
export default unitKerjaSlice.reducer;
