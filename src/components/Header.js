import React from "react";
import { Box } from "@mui/material";

const Header = () => {
  const headerStyles = {
    textDecoration: "underline",
    cursor: "pointer",
    marginLeft: "2rem",
    height: "36px",
    padding: "8px",
    paddingBottom: "0px",
    fontFamily: "Langar",
    fontSize: "30px",
    color: "red"
  };

  return (
    <Box style={headerStyles} className="header">
      <Box>ADMIN-UI</Box>
    </Box>
  );
};

export default Header;