import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Your backend base URL (change this to your real backend)
const BASE_URL = "https://modion.onrender.com/api/auth";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, userData, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      // Better error handling to extract meaningful messages
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data || 
                          error.message || 
                          "Registration failed";
      
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, credentials, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      // Better error handling to extract meaningful messages
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data || 
                          error.message || 
                          "Login failed";
      
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isLoading: false,
    error: null,
    isAuthenticated: !!JSON.parse(localStorage.getItem("user")),
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null; // Clear errors on logout
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add this reducer to clear error when switching forms
    resetAuthState: (state) => {
      state.error = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // For registration, you might want to NOT automatically log them in
        // Uncomment the lines below if you want auto-login after registration
        // state.user = action.payload;
        // state.isAuthenticated = true;
        // localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user"); // Clear any stale data
      });
  },
});

export const { logout, clearError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;