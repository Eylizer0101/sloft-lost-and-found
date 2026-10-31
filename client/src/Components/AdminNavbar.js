// client/src/Components/AdminNavbar.js
import React from "react";
import { Stack, Typography, Button, Avatar } from "@mui/material";

export default function AdminNavbar() {
  const signout = () => {
    localStorage.clear();
    window.location.href = "/admin/login";
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
       background: "#0B996E", 
        color: "#fff",
        px: 3,
        py: 2.5,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
    </Stack>
  );
}
