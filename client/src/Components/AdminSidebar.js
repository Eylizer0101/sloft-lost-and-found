// client/src/Components/AdminSidebar.js    
import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Tooltip,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  BarChart as BarChartIcon,
  Category as CategoryIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
  Support as SupportIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 72;

function AdminSidebar({ mobile = false, onClose = () => {} }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleSubMenu = () => setOpenSubMenu(!openSubMenu);

  // Get user info from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userAvatar = storedUser?.img || "https://i.pravatar.cc/40";
  const userFullname = storedUser?.fullname || "Admin User";
  const userEmail = storedUser?.email || "admin@example.com";

  const handleLogout = () => setLogoutDialogOpen(true);
  const confirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setLogoutDialogOpen(false);
    navigate("/log-in");
  };
  const cancelLogout = () => setLogoutDialogOpen(false);

  const mainMenu = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Analytics", icon: <BarChartIcon />, path: "/admin/analytics" },
  ];

  const managementMenu = [
    { text: "Users Profile", icon: <PeopleIcon />, path: "/admin/user-management" },
    { text: "Reports", icon: <AssignmentIcon />, path: "/admin/reports" },
    { text: "Archive", icon: <CategoryIcon />, path: "/admin/archive" },
    { text: "Pending Claim", icon: <NotificationsIcon />, path: "/admin/claim-notifications" },
  ];

  const settingsMenu = [
    { text: "System Settings", icon: <SettingsIcon />, path: "/admin/settings" },
    { text: "Security", icon: <SecurityIcon />, path: "/admin/security" },
    { text: "About", icon: <InfoIcon />, path: "/admin/about" },
    { text: "Support", icon: <SupportIcon />, path: "/admin/support" },
  ];

  // Menu renderer
  const renderMenuItems = (menuArray) =>
    menuArray.map((item) => (
      <ListItem
        key={item.text}
        disablePadding
        sx={{ display: "block" }}
        component={Link}
        to={item.path}
        onClick={mobile ? onClose : undefined}
      >
        <Tooltip title={collapsed ? item.text : ""} placement="right">
          <ListItemButton
            selected={location.pathname === item.path}
            sx={{
              minHeight: 48,
              justifyContent: collapsed ? "center" : "flex-start",
              px: 2.5,
              color: "#0B996E",
              transition: "all 0.25s ease",
              borderRadius: "8px",
              backgroundColor: location.pathname === item.path ? "rgba(11,153,110,0.15)" : "transparent",
              "&:hover": {
                backgroundColor: "rgba(11,153,110,0.1)",
                transform: "translateX(6px)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "#0B996E",
                minWidth: 0,
                mr: collapsed ? "auto" : 2,
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: "500", color: "#064C3B" }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </ListItem>
    ));

  return (
    <Box
      component="nav"
      sx={{
        width: mobile ? "100%" : (collapsed ? drawerWidthCollapsed : drawerWidthExpanded),
        flexShrink: 0,
        position: mobile ? "relative" : "sticky",
        top: 0,
        left: 0,
        height: "100dvh",
        zIndex: mobile ? "auto" : 1200,
        transition: "width 0.3s ease",
      }}
    >
      <Box
        sx={{
          width: mobile ? "100%" : (collapsed ? drawerWidthCollapsed : drawerWidthExpanded),
          height: "100dvh",
          backgroundColor: "#FFFFFF",
          color: "#0B996E",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0px 12px rgba(0,0,0,0.1)",
          transition: "width 0.3s ease",
          overflowX: "hidden",
        }}
      >
        {/* Top Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            p: 2,
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          {!collapsed && <Typography variant="h6" fontWeight="bold" noWrap sx={{ color: "#0f8864ff" }}>Admin Panel</Typography>}
          <IconButton
            aria-label={mobile ? "Close sidebar" : (collapsed ? "Expand sidebar" : "Collapse sidebar")}
            onClick={mobile ? onClose : toggleCollapse}
            sx={{ color: "#0B996E", transition: "0.3s", "&:hover": { bgcolor: "rgba(11,153,110,0.1)" } }}
          >
            {mobile ? <ChevronLeftIcon /> : (collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />)}
          </IconButton>
        </Box>

        {/* MAIN MENU */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 1, px: 1.5 }}>
          {!collapsed && <Typography variant="caption" sx={{ mb: 1, color: "#0c7d5bff" }}>MAIN</Typography>}
          <List>{renderMenuItems(mainMenu)}</List>

          <Divider sx={{ borderColor: "rgba(11,153,110,0.2)", my: 1 }} />

          {/* MANAGEMENT */}
          {!collapsed && <Typography variant="caption" sx={{ mb: 1, color: "#0c7d5bff" }}>MANAGEMENT</Typography>}
          <List>
            {renderMenuItems(managementMenu)}
             <Divider sx={{ mt: 1, mb: 1 }} />
            
            {/* LOGOUT Button under Reports */}
            <ListItem disablePadding sx={{ display: "block" }}>
              <Tooltip title={collapsed ? "Logout" : ""} placement="right">
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: 2.5,
                    color: "#FFFFFF",
                    backgroundColor: "#0B996E",
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#098562", transform: "translateX(6px)" },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "#FFFFFF",
                      minWidth: 0,
                      mr: collapsed ? "auto" : 2,
                      justifyContent: "center",
                    }}
                  >
                    <LogoutIcon />
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: "500", color: "#FFFFFF" }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </List>

          <Divider sx={{ borderColor: "rgba(11,153,110,0.2)", my: 1 }} />
        </Box>

        {/* Bottom Profile */}
     <Box sx={{ p: 3, borderTop: "1px solid rgba(11,153,110,0.2)", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 1 }}>
  <Avatar src={userAvatar} sx={{ width: 32, height: 32, border: "2px solid #0B996E" }} />
  {!collapsed && (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 32 }}>
      <Typography variant="body2" fontWeight="600" sx={{ color: "#343232ff", lineHeight: 1 }}>
        Hello {userFullname.split(' ')[0]}
      </Typography>
       <Typography variant="caption" sx={{ color: "rgba(35, 38, 37, 0.8)", fontSize: "0.65rem", lineHeight: 1 }}>
        ADMIN
      </Typography>
    </Box>
  )}
</Box>

        {/* Logout Confirmation Dialog */}
        <Dialog open={logoutDialogOpen} onClose={cancelLogout}>
          <DialogTitle sx={{ color: "#0B996E" }}>Confirm Logout</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "#064C3B" }}>Are you sure you want to logout?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelLogout} sx={{ color: "#0B996E" }}>Cancel</Button>
            <Button onClick={confirmLogout} sx={{ color: "#FFFFFF", backgroundColor: "#0B996E", "&:hover": { backgroundColor: "#098562" } }}>Logout</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default AdminSidebar;