// resources/js/components/TopBar.jsx
import React from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
} from "@mui/icons-material";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "white",
  color: theme.palette.text.primary,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
}));

const TopBar = ({ open, toggleDrawer }) => {
  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          Agri-Trek Platform
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="inherit"
          >
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default TopBar;

