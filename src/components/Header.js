import React, { useState } from "react";
import "../styles/Header.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";

const Header = () => {
  const [modal, setModal] = useState(null);

  return (
    <div className="header">
      <div className="header_img">
        <h1>
          <p className="text">Aditya AI</p>
        </h1>
      </div>
      <div className="header_nav">
        <p className="nav">Chat</p>
      </div>
      <div className="header_user">
        <SettingsIcon
          fontSize="large"
          onClick={() => setModal((prev) => !prev)}
          style={{ cursor: "pointer" }}
        />
        <AccountCircleIcon
          fontSize="large"
          onClick={() => setModal((prev) => !prev)}
          style={{ cursor: "pointer" }}
        />
        {modal && (
          <div className="settings_popup">Functionality is Coming Soon</div>
        )}
      </div>
    </div>
  );
};

export default Header;
