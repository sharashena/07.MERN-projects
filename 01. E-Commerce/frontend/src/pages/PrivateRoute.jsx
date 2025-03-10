import { Navigate, Outlet } from "react-router";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  return user ? <Outlet /> : <Navigate to={"/login"} replace />;
};

export default PrivateRoute;
