import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data.js";

const SideMenu = ({ activeMenu }) => {
  const { user, loading, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (loading) return; // 🛑 Don't run until loading is done

    if (user) {
      setSideMenuData(
        user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    } else {
      // Not logged in or cleared
      setSideMenuData([]);
    }
  }, [user, loading]); // 💡 Watch both

  return (
    <div className="w-full sm:w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/500 sticky top-[61px] z-20">
      <Link to="/profile">
        <div className="flex flex-col items-center justify-center mb-7 pt-5">
          <div className="relative">
            <img
              src={user?.profileImageUrl || null}
              alt="Profile Image"
              className="w-20 h-20 bg-slate-400 rounded-full"
            />
          </div>

          {user?.role === "admin" && <div className="">Admin</div>}

          <h5 className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            {user?.name || ""}
          </h5>

          <p className="text-gray-950 font-medium leading-6 mt-3">
            {user?.email || ""}
          </p>
        </div>
      </Link>

      {sideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label
              ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
              : ""
          } py-3 px-6 mb-3 cursor-pointer`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl " />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
