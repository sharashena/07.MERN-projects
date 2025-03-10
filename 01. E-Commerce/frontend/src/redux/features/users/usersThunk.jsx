import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../axios/baseUrl";

const currentUserThunk = createAsyncThunk(
  "users/currentUser",
  async (_, thunkAPI) => {
    try {
      const { data } = await baseUrl("/users/currentUser");
      return data.user;
    } catch (error) {
      const msg = error.response?.data?.errors?.msg || "something went wrong";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export { currentUserThunk };
