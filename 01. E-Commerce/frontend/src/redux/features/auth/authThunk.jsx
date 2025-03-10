import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../axios/baseUrl";

const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async ({ url, params }, thunkAPI) => {
    try {
      const { data } = await baseUrl.post(url, params);
      return data.msg;
    } catch (error) {
      const msg = error.response?.data?.errors?.msg || "something went wrong";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async ({ url, params }, thunkAPI) => {
    try {
      const { data } = await baseUrl.post(url, params);
      return data;
    } catch (error) {
      const msg = error.response?.data?.errors?.msg || "something went wrong";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async ({ url, params }, thunkAPI) => {
    try {
      const { data } = await baseUrl.post(url, params);
      return data.msg;
    } catch (error) {
      const msg = error.response?.data?.errors?.msg || "something went wrong";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async ({ url, params }, thunkAPI) => {
    try {
      const { data } = await baseUrl.patch(url, params);
      return data.msg;
    } catch (error) {
      const msg = error.response?.data?.errors?.msg || "something went wrong";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const logoutThunk = createAsyncThunk(
  "auth/logoutUser",
  async (url, thunkAPI) => {
    try {
      await baseUrl.patch(url);
    } catch (error) {
      const msg = error.response?.data?.errors?.msg || "something went wrong";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export {
  registerUserThunk,
  loginUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  logoutThunk,
};
