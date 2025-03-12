import { Link } from "react-router";

const Profile = ({
  profileRef,
  isProfileSubmenu,
  logoutUser,
  closeSubmenu,
}) => {
  return (
    <aside
      className={`nav-profile-submenu ${
        isProfileSubmenu ? "show-profile-submenu" : ""
      }`}
      ref={profileRef}
    >
      <Link
        to={"/myProducts"}
        className="btn-block nav-profile-btn"
        onClick={closeSubmenu}
      >
        my products
      </Link>

      <button className="btn-block nav-profile-btn" onClick={closeSubmenu}>
        settings
      </button>
      <button
        className="btn-block nav-profile-btn"
        onClick={() => {
          logoutUser();
          closeSubmenu();
        }}
      >
        logout
      </button>
    </aside>
  );
};

export default Profile;
