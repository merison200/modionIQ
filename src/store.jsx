import { configureStore } from "@reduxjs/toolkit";
import darkModeReducer from "./slices/darkModeSlice";
import articlesSlice from "./slices/articlesSlice";
import articleSlice from "./slices/articleSlice";
import contactUsSlice from "./slices/contactSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    articles: articlesSlice,
    article: articleSlice,
    auth: authReducer,
    contactUs: contactUsSlice,
  },
});
