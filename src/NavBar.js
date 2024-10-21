import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";

// Styled Button with shadow and hover effects
const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  margin: theme.spacing(0, 1),
  padding: theme.spacing(1, 2),
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#fff", // Change the background color on hover
    color: "#2E3B55", // Change text color to the same as the original background color
  },
}));


// Styled AppBar with shadow
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#2E3B55",
  padding: theme.spacing(1),
  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
}));

const Navbar = ({ handleLogout }) => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            color: "#FFD700",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Sports Events
        </Typography>
        <Box>
          <StyledButton component={Link} to="/home">
            Home
          </StyledButton>
          <StyledButton component={Link} to="/my-teams">
            My Teams
          </StyledButton>
          <StyledButton onClick={() => handleLogout(false)}>
            Logout
          </StyledButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
