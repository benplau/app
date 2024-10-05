import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../AuthContext";

function Header() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(user?.username);
  }, [user]);

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h5" noWrap component="div" color="secondary">
          The Calculator
        </Typography>
        {username && (
          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            <Typography sx={{ mr: 2, fontSize: 20 }}>
              {"Hello, " + username}
            </Typography>
            <AccountCircleIcon color="secondary" fontSize="large" />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
