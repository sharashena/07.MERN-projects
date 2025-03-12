import { createSlice } from "@reduxjs/toolkit";
import { currentUserThunk } from "./usersThunk";

const getFromLocalStorage = () => {
  let storage = localStorage.getItem("theme");
  if (storage) {
    storage = JSON.parse(localStorage.getItem("theme"));
  } else {
    storage = "light-theme";
  }
  return storage;
};

const initialState = {
  user: {},
  loading: false,
  error: null,
  theme: getFromLocalStorage(),
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUser: state => {
      state.currentUser = null;
    },
    toggleTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
  extraReducers: builder => {
    // current user
    builder.addCase(currentUserThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(currentUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload
    });
    builder.addCase(currentUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default usersSlice.reducer;
export const { clearUser, toggleTheme } = usersSlice.actions;
