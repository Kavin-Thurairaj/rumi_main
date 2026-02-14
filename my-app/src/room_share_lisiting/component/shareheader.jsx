import "../styles/shareheader.css";
import rumiLogo from "../assets/Rumi transparent.png";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";


const Header = ({ children }) => {
  return (
    <header className="header-wrapper">
      <div className="header-top">
        <img src={rumiLogo} alt="RUMI" className="logo" />

        
      </div>

      {/* Filter section injected here */}
      <div className="header-filters">
        {children}
      </div>
    </header>
  );
};

export default Header;


