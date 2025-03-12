import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../axios/baseUrl";
import { closeModal } from "./productsSlice";

const createProductThunk = createAsyncThunk(
  "products/createProduct",
  async (formData, thunkAPI) => {
    try {
      const { data } = await baseUrl.post("/products", formData);
      thunkAPI.dispatch(getProductsThunk());
      return data.msg;
    } catch (error) {
      const errors =
        error.response?.data?.errors?.msg || "something went wrong";
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

const getProductsThunk = createAsyncThunk(
  "products/getProcuts",
  async (_, thunkAPI) => {
    try {
      const { data } = await baseUrl("/products");
      return data;
    } catch (error) {
      const errors =
        error.response?.data?.errors?.msg ||
        "Unfortunately, There is something wrong with your api";
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

const getSingleProductThunk = createAsyncThunk(
  "products/getSingleProduct",
  async (id, thunkAPI) => {
    try {
      const { data } = await baseUrl(`/products/${id}`);
      return data.result;
    } catch (error) {
      const errors =
        error.response?.data?.errors?.msg ||
        "Unfortunately, There is something wrong with your api";
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

const getFilteredProducts = createAsyncThunk(
  "products/filteredProducts",
  async (params, thunkAPI) => {
    try {
      const { data } = await baseUrl("/products/filteredProducts", {
        params,
      });
      return data;
    } catch (error) {
      const errors =
        error.response?.data?.errors?.msg ||
        "Unfortunately, There is something wrong with your api";
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

const getCurrentUserProductsThunk = createAsyncThunk(
  "products/currentUserProducts",
  async (_, thunkAPI) => {
    try {
      const { data } = await baseUrl("/products/currentUserProducts");
      return data;
    } catch (error) {
      const errors =
        error.response?.data?.errors?.msg ||
        "Unfortunately, There is something wrong with your api";
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

const updateProductsThunk = createAsyncThunk(
  "products/updateProducts",
  async ({ id, formData }, thunkAPI) => {
    try {
      const { data } = await baseUrl.patch(`/products/${id}`, formData);
      thunkAPI.dispatch(closeModal());
      thunkAPI.dispatch(getCurrentUserProductsThunk());
      return data.msg;
    } catch (error) {
      const errors =
        error.response?.data?.errors?.msg ||
        "Unfortunately, There is something wrong with your api";
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

const deleteProductThunk = createAsyncThunk(
  "products/deleteProducts",
  async (id, thunkAPI) => {
    try {
      const { data } = await baseUrl.delete(`/products/${id}`);
      thunkAPI.dispatch(getCurrentUserProductsThunk());
      return data.msg;
    } catch (error) {
      const errors =
        error.response?.data?.errors?.msg ||
        "Unfortunately, There is something wrong with your api";
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

export {
  createProductThunk,
  getProductsThunk,
  getSingleProductThunk,
  getFilteredProducts,
  getCurrentUserProductsThunk,
  updateProductsThunk,
  deleteProductThunk,
};
