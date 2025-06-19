import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_API_URL = "https://modion.onrender.com/api/articles";

export const fetchArticleById = createAsyncThunk(
  "articleSlice/fetchArticleById",
  async (articleId) => {
    try {
      // Use the actual article ID from your backend (not adjusted)
      const response = await fetch(`${BACKEND_API_URL}/${articleId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const article = await response.json();
      console.log("Fetched single article from backend:", article); // Debug log
      return article;
    } catch (error) {
      console.error("Error fetching article by ID from backend:", error);
      throw error;
    }
  }
);

export const articleSlice = createSlice({
  name: "articleSlice",
  initialState: {
    article: null,
    loading: false,
    error: null
  },
  reducers: {
    clearArticle: (state) => {
      state.article = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.loading = false;
        state.article = action.payload;
        state.error = null;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.article = null;
      });
  },
});

export const { clearArticle } = articleSlice.actions;
export default articleSlice.reducer;
