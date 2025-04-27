// resources/js/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Terrain as TerrainIcon,
  Assignment as AssignmentIcon,
  CardGiftcard as CardGiftcardIcon,
  CloudUpload as CloudUploadIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";

const drawerWidth = 280;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  ...theme.mixins.toolbar,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    borderRight: "none",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
  },
}));

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Farmers", icon: <PeopleIcon />, path: "/farmers" },
  { text: "Lands", icon: <TerrainIcon />, path: "/lands" },
  { text: "Schemes", icon: <AssignmentIcon />, path: "/schemes" },
  { text: "Beneficiaries", icon: <CardGiftcardIcon />, path: "/beneficiaries" },
  { text: "Aerial Data", icon: <CloudUploadIcon />, path: "/aerial-data" },
];

const Sidebar = ({ open, toggleDrawer }) => {
  const location = useLocation();

  return (
    <StyledDrawer variant="permanent" open={open}>
      <DrawerHeader>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TimelineIcon sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Agri-Trek
          </Typography>
        </Box>
      </DrawerHeader>
      <Divider />
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block", mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                px: 2.5,
                borderRadius: "0 24px 24px 0",
                width: "90%",
                ml: 1,
                ...(location.pathname === item.path && {
                  backgroundColor: "primary.light",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.main",
                  },
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: "center",
                  color: location.pathname === item.path ? "white" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;
