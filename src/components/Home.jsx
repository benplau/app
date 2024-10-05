import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Box from "@mui/material/Box";
import { AppProvider } from "../AppContext";

const Home = () => {
  return (
    <AppProvider>
      <div>
        <Box sx={{ display: "flex" }}>
          <Header />
          <SideBar />
          <Outlet />
        </Box>
      </div>
    </AppProvider>
  );
};

export default Home;
