import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to handle form submission
export const submitContactForm = createAsyncThunk(
  "contactUs/submitContactForm",
  async (formData, thunkAPI) => {
    try {
      const response = await fetch("https://modion.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to send contact message");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Redux slice
const contactUsSlice = createSlice({
  name: "contactUs",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetContactForm: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetContactForm } = contactUsSlice.actions;
export default contactUsSlice.reducer;