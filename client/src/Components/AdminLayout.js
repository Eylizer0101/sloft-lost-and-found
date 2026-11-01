// client/src/Components/AdminLayout.js
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { Stack, Box, Drawer, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  React.useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", bgcolor: "#F9FAFB", minWidth: 0 }}>
      <AdminNavbar />
      <Stack direction="row" spacing={{ xs: 0, md: 2 }} sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 1.5, md: 3 }, flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: { xs: "none", md: "block" }, width: 240, flexShrink: 0 }}>
          <AdminSidebar />
        </Box>
        <Drawer anchor="left" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} ModalProps={{ keepMounted: true }} PaperProps={{ sx: { width: "min(85vw, 280px)" } }}>
          <AdminSidebar mobile onClose={() => setMobileMenuOpen(false)} />
        </Drawer>
        <Box component="main" sx={{ flex: 1, minWidth: 0, width: "100%", bgcolor: "#FFFFFF", borderRadius: 2, p: { xs: 1.5, sm: 2, md: 3 }, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", minHeight: "calc(100dvh - 80px)", overflowWrap: "anywhere" }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ display: { xs: "flex", md: "none" }, mb: 2, pb: 1, borderBottom: "1px solid #E5E7EB" }}>
            <IconButton aria-label="Open admin navigation" onClick={() => setMobileMenuOpen(true)} sx={{ minWidth: 44, minHeight: 44, color: "#0B996E" }}><MenuIcon /></IconButton>
            <Typography fontWeight={700} color="#064C3B">Admin Menu</Typography>
          </Stack>
          <Outlet />
        </Box>
      </Stack>
    </Box>
  );
}
