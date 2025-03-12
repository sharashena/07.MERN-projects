import {
  About,
  Cart,
  Error,
  Home,
  Products,
  SingleProduct,
  Checkout,
  AddProducts,
  MyProducts,
  ConfirmPayment,
} from "../pages";

const pages = [
  { path: "/", element: <Home /> },
  { path: "about", element: <About /> },
  { path: "products", element: <Products /> },
  { path: "products/:id", element: <SingleProduct /> },
  { path: "cart", element: <Cart /> },
  { path: "checkout", element: <Checkout /> },
  { path: "addProducts", element: <AddProducts /> },
  { path: "myProducts", element: <MyProducts /> },
  { path: "orders/:id/pay", element: <ConfirmPayment /> },
  { path: "*", element: <Error /> },
];

export default pages;
