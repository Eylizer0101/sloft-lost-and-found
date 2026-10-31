// client/src/Components/AdminLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { Stack, Box } from "@mui/material";

export default function AdminLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#F9FAFB" }}>
      {/* Navbar */}
      <AdminNavbar />

      {/* Main Content */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          flexGrow: 1,
        }}
      >
        {/* Sidebar */}
        <AdminSidebar />

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#FFFFFF",
            borderRadius: 2,
            p: { xs: 2, md: 3 },
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            minHeight: "calc(100vh - 80px)", // adjust for navbar height
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Outlet />
        </Box>
      </Stack>
    </Box>
  );
}
