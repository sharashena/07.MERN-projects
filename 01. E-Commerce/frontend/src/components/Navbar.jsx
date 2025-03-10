// react
import { useState, useRef, useEffect } from "react";

// react icons
import { HiMenuAlt1 } from "react-icons/hi";
import { IoSunnyOutline } from "react-icons/io5";
import { FaMoon, FaPlus } from "react-icons/fa";
import { BsCart2 } from "react-icons/bs";

// router
import { Link, NavLink, useNavigate } from "react-router";

import { links } from "../helpers/navLinks";
import avatar from "../assets/avatar.jpg";
import Profile from "./Profile";

// redux
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../redux/features/auth/authThunk";
import { clearUser, toggleTheme } from "../redux/features/users/usersSlice";

import Cookies from "js-cookie";

const Navbar = ({ openSidebar }) => {
  const { theme, user } = useSelector(state => state.users);
  const { totalAmount } = useSelector(state => state.cart);

  const dispatch = useDispatch();

  const [isProfileSubmenu, setIsProfileSubmenu] = useState(false);
  const profileRef = useRef(null);

  const navigate = useNavigate();

  const logoutUser = async () => {
    Cookies.remove("user");
    dispatch(clearUser());

    const result = await dispatch(logoutThunk("auth/logout"));
    if (logoutThunk.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  const toggleProfile = () => setIsProfileSubmenu(!isProfileSubmenu);

  const handleToggleTheme = () => {
    if (theme === "light-theme") {
      dispatch(toggleTheme("dark-theme"));
    } else {
      dispatch(toggleTheme("light-theme"));
    }
  };

  const outSideClick = e => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setIsProfileSubmenu(false);
    }
  };

  const closeSubmenu = () => {
    setIsProfileSubmenu(false);
  };

  useEffect(() => {
    window.addEventListener("click", outSideClick);
    return () => window.removeEventListener("click", outSideClick);
  }, []);

  return (
    <nav className="nav">
      <div className="section-center nav-center">
        <Link to={"/"} className="logo">
          S
        </Link>
        <button
          className="menu-btn"
          onClick={e => {
            e.stopPropagation();
            openSidebar();
          }}
        >
          <HiMenuAlt1 />
        </button>

        <ul className="navlinks-container">
          {links.map(({ path, title }, index) => {
            return (
              <li key={index}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    isActive ? "nav-link active-link" : "nav-link"
                  }
                >
                  {title}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <ul className="icons-container">
          <Link to={"/addProducts"} className="add-products-btn">
            <FaPlus /> add products
          </Link>

          <div className="nav-profile-container">
            <article className="profile-container">
              <h3>{user?.username}</h3>
              <img
                src={avatar}
                alt="avatar"
                className="nav-profile-img"
                onClick={e => {
                  e.stopPropagation();
                  toggleProfile();
                }}
              />
            </article>
            <Profile
              profileRef={profileRef}
              isProfileSubmenu={isProfileSubmenu}
              logoutUser={logoutUser}
              closeSubmenu={closeSubmenu}
            />
          </div>
          <button className="icon-btn" onClick={handleToggleTheme}>
            {theme === "light-theme" ? <FaMoon /> : <IoSunnyOutline />}
          </button>
          <NavLink to={"/cart"} className="icon-btn cart-icon">
            <BsCart2 />
            <p className="cart-icon-amount">{totalAmount}</p>
          </NavLink>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
