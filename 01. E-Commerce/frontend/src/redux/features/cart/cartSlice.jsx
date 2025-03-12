import { createSlice } from "@reduxjs/toolkit";

const getCartFromStorage = () => {
  const item = localStorage.getItem("cart");
  if (item) {
    return JSON.parse(localStorage.getItem("cart"));
  } else {
    return [];
  }
};

const initialState = {
  cart: getCartFromStorage(),
  subtotal: 0,
  shippingFee: 0,
  tax: 0,
  totalPrice: 0,
  totalAmount: 0,
  alert: {
    type: "",
    msg: "",
    show: false,
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    calculateTotals: (state, action) => {
      const subtotal = action.payload.subtotal;
      const totalAmount = action.payload.totalAmount;
      const tax = subtotal * 0.005;
      const shippingFee = subtotal > 50 ? 5 : 10;
      const totalPrice = subtotal + shippingFee + tax;

      state.subtotal = subtotal;
      state.tax = tax;
      state.shippingFee = shippingFee;
      state.totalAmount = totalAmount;
      state.totalPrice = totalPrice;
    },
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existItem = state.cart.find(item => item.id === newItem.id);

      if (existItem) {
        state.cart = state.cart.map(item => {
          if (item.id === existItem.id) {
            let newAmount = item.amount + newItem.amount;

            if (newAmount > item.stock) {
              newAmount = item.stock;
              state.alert = {
                type: "danger",
                msg: "stock is full",
                show: true,
              };
              return { ...item, amount: newAmount };
            } else {
              state.alert = {
                type: "success",
                msg: "product successfully added to cart",
                show: true,
              };
              return { ...item, amount: item.amount + newItem.amount };
            }
          }
          return item;
        });
      } else {
        state.alert = {
          type: "success",
          msg: "product successfully added to cart",
          show: true,
        };
        state.cart.push(newItem);
      }

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    hideAlert: state => {
      state.alert = {
        type: "",
        msg: "",
        show: false,
      };
    },
    clearCart: () => {
      localStorage.removeItem("cart");
      return initialState;
    },
    deleteItem: (state, action) => {
      state.cart = action.payload;
    },
    increaseAmount: (state, action) => {
      state.cart = action.payload;
    },
    decreaseAmount: (state, action) => {
      state.cart = action.payload;
    },
  },
});

export default cartSlice.reducer;
export const {
  calculateTotals,
  addToCart,
  hideAlert,
  deleteItem,
  increaseAmount,
  decreaseAmount,
  clearCart,
} = cartSlice.actions;
