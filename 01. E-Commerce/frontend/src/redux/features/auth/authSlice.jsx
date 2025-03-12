import { createSlice } from "@reduxjs/toolkit";
import {
  registerUserThunk,
  loginUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
} from "./authThunk";

const initialState = {
  loading: false,
  alert: {
    type: "",
    msg: "",
    show: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hideAlert: state => {
      state.alert = {
        type: "",
        msg: "",
        show: false,
      };
    },
  },
  extraReducers: builder => {
    // register
    builder.addCase(registerUserThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.alert = {
        type: "success",
        msg: action.payload,
        show: true,
      };
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.alert = {
        type: "danger",
        msg: action.payload,
        show: true,
      };
    });

    // login
    builder.addCase(loginUserThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.alert = {
        type: "success",
        msg: action.payload.msg,
        show: true,
      };
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.alert = {
        type: "danger",
        msg: action.payload,
        show: true,
      };
    });

    // forgot password
    builder.addCase(forgotPasswordThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(forgotPasswordThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.alert = {
        type: "success",
        msg: action.payload,
        show: true,
      };
    });
    builder.addCase(forgotPasswordThunk.rejected, (state, action) => {
      state.loading = false;
      state.alert = {
        type: "danger",
        msg: action.payload,
        show: true,
      };
    });

    //  reset password
    builder.addCase(resetPasswordThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(resetPasswordThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.alert = {
        type: "success",
        msg: action.payload,
        show: true,
      };
    });
    builder.addCase(resetPasswordThunk.rejected, (state, action) => {
      state.loading = false;
      state.alert = {
        type: "danger",
        msg: action.payload,
        show: true,
      };
    });
  },
});

export default authSlice.reducer;
export const { hideAlert } = authSlice.actions;
