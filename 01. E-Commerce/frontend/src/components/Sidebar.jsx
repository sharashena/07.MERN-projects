import { Link } from "react-router";
import { links } from "../helpers/navLinks";

const Sidebar = ({ isSidebar, sidebarRef, closeSidebar }) => {
  return (
    <div className={`sidebar-overlay ${isSidebar ? "show-sidebar" : ""}`}>
      <ul className="sidebar-container" ref={sidebarRef}>
        {links.map(({ path, title }, index) => {
          return (
            <li key={index}>
              <Link to={path} className="sidebar-link" onClick={closeSidebar}>
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
