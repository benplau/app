import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../AuthContext";
import { useAppContext } from "../AppContext";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { clearAllTabs } = useAppContext();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems = [
    {
      text: "Late Payment Interest",
      icon: <CalculateIcon />,
      route: "/judgment-debt",
    },
    {
      text: "Relevant information",
      icon: (
        <InfoIcon
          sx={{
            color: "white",
            backgroundColor: "grey",
            borderRadius: "100%",
            fontSize: 20,
            ml: 0.4,
          }}
        />
      ),
      route: "/relevant-information",
    },
    ...(user && user.username
      ? [
          {
            text: "Past Records",
            icon: <HistoryIcon />,
            route: "/past-records",
          },
        ]
      : []),
  ];

  const secondaryItems = [
    user && user.username != null
      ? { text: "Sign out", icon: <LogoutIcon />, route: "/logout" }
      : { text: "Sign in", icon: <LoginIcon />, route: "/login" },
  ];

  useEffect(() => {
    const activeRouteIndex = menuItems
      .concat(secondaryItems)
      .findIndex((item) => item.route === location.pathname);
    if (activeRouteIndex !== -1) {
      setSelectedIndex(activeRouteIndex);
    }
  }, [location.pathname]);

  const handleListItemClick = (index, route) => {
    setSelectedIndex(index);
    if (route === "/logout") {
      logout();
      clearAllTabs();
      navigate("/login");
    } else {
      navigate(route);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 260,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <div>
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={selectedIndex === index}
                  onClick={() => handleListItemClick(index, item.route)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </div>
      <div>
        <Divider />
        <List>
          {secondaryItems.map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={selectedIndex === index + menuItems.length}
                onClick={() =>
                  handleListItemClick(index + menuItems.length, item.route)
                }
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default SideBar;
