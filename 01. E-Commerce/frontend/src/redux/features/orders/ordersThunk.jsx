import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../axios/baseUrl";

const createOrderThunk = createAsyncThunk(
  "orders/createOrder",
  async (orderData, thunkAPI) => {
    try {
      const { data } = await baseUrl.post("/orders", orderData);
      return data;
    } catch (error) {
      const errors = error.response?.data?.errors?.msg;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

const confirmPayment = createAsyncThunk(
  "orders/confirmPayment",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await baseUrl.post("/orders/confirm-payment", {
        orderId,
      });
      return data.msg;
    } catch (error) {
      const errors = error.response?.data?.errors?.msg;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

export { createOrderThunk, confirmPayment };
