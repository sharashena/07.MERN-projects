import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../axios/baseUrl";

const createCommentThunk = createAsyncThunk(
  "comments/createComment",
  async ({ params }, thunkAPI) => {
    try {
      const { data } = await baseUrl.post("/comments", params);
      thunkAPI.dispatch(getCommentsThunk());
      return data.msg;
    } catch (error) {
      const errors =
        error.response?.data?.errors?.msg ||
        "something went wrong with your api";
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

const getCommentsThunk = createAsyncThunk(
  "comments/getComments",
  async (_, thunkAPI) => {
    try {
      const { data } = await baseUrl("/comments");
      return data;
    } catch (error) {
      const msg =
        error.response?.data?.errors?.msg ||
        "something went wrong with your api";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const updateCommentThunk = createAsyncThunk(
  "comments/updateComment",
  async ({ id, params }, thunkAPI) => {
    try {
      const { data } = await baseUrl.patch(`/comments/${id}`, params);
      thunkAPI.dispatch(getCommentsThunk());
      return data.msg;
    } catch (error) {
      const msg =
        error.response?.data?.errors?.msg ||
        "something went wrong with your api";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const deleteCommentThunk = createAsyncThunk(
  "comments/deleteComment",
  async (id, thunkAPI) => {
    try {
      const { data } = await baseUrl.delete(`/comments/${id}`);
      thunkAPI.dispatch(getCommentsThunk());
      return data.msg;
    } catch (error) {
      const msg =
        error.response?.data?.errors?.msg ||
        "something went wrong with your api";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export {
  createCommentThunk,
  getCommentsThunk,
  updateCommentThunk,
  deleteCommentThunk,
};
