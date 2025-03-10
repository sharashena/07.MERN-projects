import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import usersSlice from "./features/users/usersSlice";
import productsSlice from "./features/products/productsSlice";
import commentsSlice from "./features/comments/commentsSlice";
import cartSlice from "./features/cart/cartSlice";
import ordersSlice from "./features/orders/ordersSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    users: usersSlice,
    products: productsSlice,
    comments: commentsSlice,
    cart: cartSlice,
    orders: ordersSlice,
  },
});

export { store };
