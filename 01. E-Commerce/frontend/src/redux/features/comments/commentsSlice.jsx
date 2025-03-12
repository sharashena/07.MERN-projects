import { createSlice } from "@reduxjs/toolkit";
import {
  createCommentThunk,
  deleteCommentThunk,
  getCommentsThunk,
  updateCommentThunk,
} from "./commentsThunk";

const initialState = {
  comments: {},
  loadingComment: false,
  alert: {
    type: "",
    msg: "",
    show: false,
  },
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    hideAlert: state => {
      state.alert = {
        type: "",
        msg: "",
        show: false,
      };
    },
    errorAlert: (state, action) => {
      state.alert = {
        type: "danger",
        msg: action.payload,
        show: true,
      };
    },
  },
  extraReducers: builder => {
    // create comment
    builder.addCase(createCommentThunk.pending, state => {
      state.loadingComment = true;
    });
    builder.addCase(createCommentThunk.fulfilled, (state, action) => {
      state.loadingComment = false;
      state.alert = {
        type: "success",
        msg: action.payload,
        show: true,
      };
    });
    builder.addCase(createCommentThunk.rejected, (state, action) => {
      state.loadingComment = false;
      state.alert = {
        type: "danger",
        msg: action.payload,
        show: true,
      };
    });

    // get comments
    builder.addCase(getCommentsThunk.fulfilled, (state, action) => {
      state.comments = action.payload;
    });

    // update comment
    builder.addCase(updateCommentThunk.pending, state => {
      state.loadingComment = true;
    });
    builder.addCase(updateCommentThunk.fulfilled, (state, action) => {
      state.loadingComment = false;
      state.alert = {
        type: "success",
        msg: action.payload,
        show: true,
      };
    });
    builder.addCase(updateCommentThunk.rejected, (state, action) => {
      state.loadingComment = false;
      state.alert = {
        type: "danger",
        msg: action.payload,
        show: true,
      };
    });

    // delete comment
    builder.addCase(deleteCommentThunk.pending, state => {
      state.loadingComment = true;
    });
    builder.addCase(deleteCommentThunk.fulfilled, (state, action) => {
      state.loadingComment = false;
      state.alert = {
        type: "danger",
        msg: action.payload,
        show: true,
      };
    });
    builder.addCase(deleteCommentThunk.rejected, (state, action) => {
      state.loadingComment = false;
      state.alert = {
        type: "danger",
        msg: action.payload,
        show: true,
      };
    });
  },
});

export default commentsSlice.reducer;
export const { hideAlert, errorAlert } = commentsSlice.actions;
