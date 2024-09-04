import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./axiosConfig"; 

const Navbar = ({handleLogout}) => {
  const navigate = useNavigate();

  

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sports Events
        </Typography>
        <Button color="inherit" component={Link} to="/home">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/my-teams">
          My Teams
        </Button>
        <Button color="inherit" onClick={() => handleLogout(false)}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
