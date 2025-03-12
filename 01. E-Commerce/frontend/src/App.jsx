import { useEffect, useState, useRef, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useLocation } from "react-router";
import routePages from "./helpers/routePages";
import Cookies from "js-cookie";

// components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Modal from "./components/Modal";

// pages
import {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
  PrivateRoute,
} from "./pages";

// redux
import { useSelector, useDispatch } from "react-redux";
import { currentUserThunk } from "./redux/features/users/usersThunk";
import { calculateTotals } from "./redux/features/cart/cartSlice";

const App = () => {
  const { theme } = useSelector(state => state.users);
  const { cart } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const [isSidebar, setIsSidebar] = useState(false);
  const sidebarRef = useRef(null);
  const user = Cookies.get("user");

  const location = useLocation();
  const navigate = useNavigate();

  const authRoutes = [
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ];

  const openSidebar = () => setIsSidebar(true);
  const closeSidebar = () => setIsSidebar(false);

  const clickOutside = useCallback(
    e => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        closeSidebar();
      }
    },
    [closeSidebar]
  );

  useEffect(() => {
    if (!user && !authRoutes.includes(location.pathname)) {
      navigate("/login");
    }
    if (user && authRoutes.includes(location.pathname)) {
      navigate("/");
    }
    if (user && location.pathname === "/checkout" && cart.length === 0) {
      navigate("/");
    }
    if (!authRoutes.includes(location.pathname)) {
      dispatch(currentUserThunk());
    }
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener("click", clickOutside);
    return () => window.removeEventListener("click", clickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    const { totalAmount, subtotal } = cart.reduce(
      (acc, item) => {
        acc.subtotal += item.price * item.amount;
        acc.totalAmount += item.amount;
        return acc;
      },
      {
        totalAmount: 0,
        subtotal: 0,
      }
    );

    dispatch(calculateTotals({ totalAmount, subtotal }));
  }, [cart]);

  return (
    <>
      {!authRoutes.includes(location.pathname) && (
        <header>
          <Navbar openSidebar={openSidebar} />
          <Sidebar
            isSidebar={isSidebar}
            closeSidebar={closeSidebar}
            sidebarRef={sidebarRef}
          />
        </header>
      )}

      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="/" element={<PrivateRoute />}>
          {routePages.map(({ path, element }, index) => {
            return <Route path={path} element={element} key={index} />;
          })}
        </Route>
      </Routes>
      <Modal />
    </>
  );
};

export default App;
