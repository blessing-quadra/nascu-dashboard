import { Avatar, Button } from "@mui/material";
import React from "react";
import { SVGS } from "../../Assets";
import { useSelector } from "react-redux";

function Navbar({ setIsLeftSidebarVisible, setIsRightSidebarVisible }) {
  const user = useSelector((state) => state.userReducer);
  return (
    <nav className="navbar block sm:hidden w-full border-b-2 border-primary-theme fixed z-10 top-0 left-0 bg-white shadow">
      <div className="w-full h-16 flex items-center justify-between px-5">
        <div onClick={() => setIsLeftSidebarVisible((prev) => !prev)}>
          <SVGS.MenuIcon />
        </div>
        <Button
          onClick={() => setIsRightSidebarVisible((prev) => !prev)}
          className="flex items-center gap-2"
        >
          <Avatar about="AB" src="CD" />
          {user.userInfo.firstName}
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
