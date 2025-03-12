import { createSlice } from "@reduxjs/toolkit";
import { createOrderThunk, confirmPayment } from "./ordersThunk";

const initialState = {
  orders: {
    orderId: "",
    orderItems: [],
    paymentMethod: "",
    isPaid: false,
    paidAt: null,
  },
  client_secret: "",
  subtotal: 0,
  tax: 0,
  shippingFee: 0,
  totalPrice: 0,
  loading: false,
  error: null,
  msg: "",
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addToOrder: (state, action) => {
      const { subtotal, totalPrice, shippingFee, tax, cart } = action.payload;

      state.subtotal = subtotal;
      state.tax = tax;
      state.shippingFee = shippingFee;
      state.totalPrice = totalPrice;
      state.orders.orderItems = cart.map(item => ({
        name: item.name,
        image: item.image,
        amount: item.amount,
        stock: item.stock,
        price: item.price,
        product: item.id,
      }));
      state.orders.paymentMethod = "card";
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(createOrderThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(createOrderThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.client_secret = action.payload.clientSecret;
      state.orders.orderId = action.payload.orderId;
    });
    builder.addCase(createOrderThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(confirmPayment.pending, state => {
      state.loading = true;
    });
    builder.addCase(confirmPayment.fulfilled, (state, action) => {
      state.loading = false;
      state.msg = action.payload;
    });
    builder.addCase(confirmPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default ordersSlice.reducer;
export const { addToOrder, setError } = ordersSlice.actions;
