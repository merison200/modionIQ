import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_API_URL = "https://modion.onrender.com/api/articles";

export const fetchArticles = createAsyncThunk(
  "articlesSlice/fetchArticles",
  async () => {
    try {
      const response = await fetch(BACKEND_API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const articles = await response.json();
      console.log("Fetched articles from backend:", articles); // Debug log
      return articles;
    } catch (error) {
      console.error("Error fetching articles from backend:", error);
      throw error;
    }
  }
);

export const articlesSlice = createSlice({
  name: "articlesSlice",
  initialState: {
    articles: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
        state.error = null;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.articles = [];
      });
  },
});

export const { clearError } = articlesSlice.actions;
export default articlesSlice.reducer;
