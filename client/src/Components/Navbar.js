import React, { useState } from 'react';   
import { setConstraint } from "../constraints";
import { Button, Stack, Typography, Modal, Box, Paper, Grid, Drawer, IconButton, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationBell from "./NotificationBell";
import SecurityIcon from '@mui/icons-material/Security';
import GavelIcon from '@mui/icons-material/Gavel';
import WarningIcon from '@mui/icons-material/Warning';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

function Navbar() {
  const token = window.localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const signout = () => {
    setConstraint(false);
    localStorage.clear();
    window.location.href = "/log-in";
  };

  const buttonStyle = {
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'none',
    color: '#0A7A5A',
    letterSpacing: "0.3px",
    borderRadius: "0",
    padding: "8px 18px",
    transition: "all 0.3s ease",
    '&:hover': {
      backgroundColor: '#E6F4F1',
    },
  };

  const bigButtonStyle = {
    ...buttonStyle,
    fontSize: '17px',
    fontWeight: '700',
  };

  const isActive = (path) => location.pathname === path;
  const mobileNavigate = (path) => { setMobileOpen(false); navigate(path); };
  // Keep the original routes and click behavior; icons and active states are visual only.
  const mobileLinks = token
    ? [
        { label: "Lost Item", icon: <SearchOutlinedIcon />, path: "/lostitems", action: () => mobileNavigate("/lostitems") },
        { label: "Found Item", icon: <Inventory2OutlinedIcon />, path: "/founditems", action: () => mobileNavigate("/founditems") },
        { label: "Report Item", icon: <AddCircleOutlineIcon />, path: "/postitem", action: () => { setMobileOpen(false); setAgreementOpen(true); } },
        { label: "My Posted Item", icon: <ListAltOutlinedIcon />, path: "/mylistings", action: () => mobileNavigate("/mylistings") },
        { label: "Profile", icon: <PersonOutlineIcon />, path: "/profile", action: () => mobileNavigate("/profile") },
      ]
    : [
        { label: "Home", icon: <HomeOutlinedIcon />, path: "/", action: () => mobileNavigate("/") },
        { label: "About", icon: <InfoOutlinedIcon />, action: () => { setMobileOpen(false); scrollToSection("about"); } },
        { label: "Contact", icon: <PhoneOutlinedIcon />, action: () => { setMobileOpen(false); scrollToSection("contact"); } },
        { label: "Log in", icon: <LoginOutlinedIcon />, path: "/log-in", separator: true, action: () => mobileNavigate("/log-in") },
        { label: "Register", icon: <PersonAddAltOutlinedIcon />, path: "/sign-up", action: () => mobileNavigate("/sign-up") },
      ];

  const requireLoginToast = () => {
    toast.error("You need to login or sign up first to view items!", {
      position: "bottom-right",
      autoClose: 2000,
      theme: "colored",
    });
  };

  // 🔹 Handle Report Item Click - Open Agreement Modal
  const handleReportItemClick = () => {
    setAgreementOpen(true);
  };

  // 🔹 Handle Agreement Accept - Redirect to Report Page
  const handleAgree = () => {
    // ✅ SAVE TO LOCALSTORAGE - IMPORTANT!
    localStorage.setItem('userAgreementAccepted', 'true');
    setAgreementOpen(false);
    navigate('/postitem');
  };

  // 🔹 Handle Agreement Close
  const handleCloseAgreement = () => {
    setAgreementOpen(false);
  };

  // 🔹 Scroll function for About, Contact & User Agreement
  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={{ xs: 2, sm: 3, md: 5, lg: 8 }}
        py={{ xs: 1.5, md: 2.5 }}
        zIndex={20}
        sx={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 1px 9px rgba(7, 71, 45, 0.06)",
          position: "sticky",
          top: 0,
        }}
      >
        {/* ✅ Left side logo text - Darker for better contrast */}
        <Typography
          variant="h5"
          sx={{
            color: "#0A7A5A",
            fontWeight: 700,
            fontSize: "26px",
            letterSpacing: "0.5px",
          }}
        >
          S-LOFT
        </Typography>

        {/* ✅ Navigation Menu */}
        <Stack direction="row" gap="36px" display={{ xs: 'none', lg: 'flex' }} alignItems="center">
          {token ? (
            <Stack direction="row" gap="32px" alignItems="center">
              {/* 🔹 Removed Home when logged in */}
              
              {/* 🔹 Separate Lost */}
              <motion.div whileHover={{ scale: [null, 1.05] }}>
                <Button
                  component={Link}
                  to="/lostitems"
                  sx={{
                    ...bigButtonStyle,
                    borderBottom: isActive("/lostitems") ? "2px solid #0A7A5A" : "2px solid transparent",
                  }}
                  disableRipple
                >
                  Lost Item
                </Button>
              </motion.div>

              {/* 🔹 Separate Found */}
              <motion.div whileHover={{ scale: [null, 1.05] }}>
                <Button
                  component={Link}
                  to="/founditems"
                  sx={{
                    ...bigButtonStyle,
                    borderBottom: isActive("/founditems") ? "2px solid #0A7A5A" : "2px solid transparent",
                  }}
                  disableRipple
                >
                  Found Item
                </Button>
              </motion.div>

              {/* 🔹 Report Item Button - Now opens agreement modal */}
              <motion.div whileHover={{ scale: [null, 1.05] }}>
                <Button
                  onClick={handleReportItemClick}
                  sx={{
                    ...buttonStyle,
                    borderBottom: isActive("/postitem") ? "2px solid #0A7A5A" : "2px solid transparent",
                  }}
                  disableRipple
                >
                  Report Item
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: [null, 1.05] }}>
                <Button
                  component={Link}
                  to="/mylistings"
                  sx={{
                    ...buttonStyle,
                    borderBottom: isActive("/mylistings") ? "2px solid #0A7A5A" : "2px solid transparent",
                  }}
                  disableRipple
                >
                  My Posted Item
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: [null, 1.05] }}>
                <Button
                  component={Link}
                  to="/profile"
                  sx={{
                    ...buttonStyle,
                    borderBottom: isActive("/profile") ? "2px solid #0A7A5A" : "2px solid transparent",
                  }}
                  disableRipple
                >
                  Profile
                </Button>
              </motion.div>
            </Stack>
          ) : (
            <Stack direction="row" gap="32px" alignItems="center">
              <motion.div whileHover={{ scale: [null, 1.05] }}>
                <Button
                  component={Link}
                  to="/"
                  sx={{
                    ...bigButtonStyle,
                    borderBottom: isActive("/") ? "2px solid #0A7A5A" : "2px solid transparent",
                  }}
                  disableRipple
                >
                  Home
                </Button>
              </motion.div>

              {/* 🔹 About */}
              <motion.div whileHover={{ scale: [null, 1.05] }}>
                <Button
                  onClick={() => scrollToSection("about")}
                  sx={{
                    ...bigButtonStyle,
                    borderBottom: "2px solid transparent",
                  }}
                  disableRipple
                >
                  About
                </Button>
              </motion.div>

              {/* 🔹 Contact */}
              <motion.div whileHover={{ scale: [null, 1.05] }}>
                <Button
                  onClick={() => scrollToSection("contact")}
                  sx={{
                    ...bigButtonStyle,
                    borderBottom: "2px solid transparent",
                  }}
                  disableRipple
                >
                  Contact
                </Button>
              </motion.div>
            </Stack>
          )}
        </Stack>

        {/* ✅ Notification Bell + Auth Buttons */}
        <Stack direction="row" alignItems="center" gap={{ xs: 1.5, md: 3 }}>
          {token && (
            <Stack
              sx={{
                backgroundColor: '#0A7A5A',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: { xs: 1, md: 2 },
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <NotificationBell />
            </Stack>
          )}

          {token ? (
            <Button
              variant="outlined"
              onClick={signout}
              sx={{
                display: { xs: "none", lg: "inline-flex" },
                textTransform: 'none',
                px: '20px',
                py: '7px',
                borderRadius: "0",
                fontWeight: "600",
                fontSize: "14px",
                color: "#0A7A5A",
                border: "1px solid #0A7A5A",
                '&:hover': {
                  backgroundColor: "#E6F4F1",
                },
              }}
              size="small"
              disableRipple
            >
              Logout
            </Button>
          ) : (
            <Stack
              direction="row"
              gap="10px"
              display={{ xs: 'none', lg: 'flex' }}
              sx={{ pr: "60px" }}
            >
              <Button
                variant="text"
                component={Link}
                to="/log-in"
                sx={{
                  textTransform: 'none',
                  px: '20px',
                  py: '7px',
                  borderRadius: "24px",
                  border: "1px solid #0A7A5A",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#0A7A5A",
                  '&:hover': { backgroundColor: "#E6F4F1" },
                }}
                size="small"
                disableRipple
              >
                Log in
              </Button>

              <Button
                variant="contained"
                component={Link}
                to="/sign-up"
                sx={{
                  textTransform: 'none',
                  px: '20px',
                  py: '7px',
                  borderRadius: "24px",
                  fontWeight: "600",
                  fontSize: "14px",
                  backgroundColor: "#0A7A5A",
                  color: "#FFFFFF",
                  '&:hover': { backgroundColor: "#08684D" },
                }}
                size="small"
                disableRipple
              >
                Register
              </Button>
            </Stack>
          )}
          <IconButton
            aria-label="Open navigation menu"
            aria-controls="sloft-mobile-navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: "inline-flex", lg: "none" }, color: "#0A7A5A", minWidth: 44, minHeight: 44 }}
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      </Stack>
      {/* Mobile/right-side navigation: desktop navbar is unchanged. */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          id: "sloft-mobile-navigation",
          sx: {
            width: "min(82vw, 300px)",
            maxWidth: "100vw",
            boxSizing: "border-box",
            bgcolor: "#FFFFFF",
            borderTopLeftRadius: "18px",
            borderBottomLeftRadius: "18px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box sx={{ px: 1.5, pt: 2, pb: 1.5, position: "relative" }}>
          <Box
            sx={{
              height: 112,
              width: "100%",
              borderRadius: "15px",
              backgroundImage: 'url("/images/Banner.png")',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "100% 100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 2,
              overflow: "hidden",
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ maxWidth: "100%", pt: 1.5 }}>
              <Box component="img" src="/S-LOFT.png" alt="" sx={{ width: 29, height: 29, objectFit: "contain", flexShrink: 0 }} />
              <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF", textShadow: "0 1px 3px rgba(0,0,0,.28)", whiteSpace: "nowrap" }}>
                S-LOFT
              </Typography>
            </Stack>
          </Box>
          <IconButton
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
            sx={{
              position: "absolute", right: 17, top: 22, width: 32, height: 32,
              color: "#FFFFFF", bgcolor: "rgba(0,49,32,.48)",
              "&:hover": { bgcolor: "rgba(0,49,32,.75)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box component="nav" aria-label="Mobile navigation" sx={{ px: 1.5, py: 2, flex: 1, overflowY: "auto", minHeight: 0 }}>
          <Stack spacing={0.7}>
            {mobileLinks.map((item) => (
              <React.Fragment key={item.label}>
                {item.separator && <Divider sx={{ my: 1.6, borderColor: "#DCE6E2" }} />}
                <Button
                  onClick={item.action}
                  fullWidth
                  startIcon={item.icon}
                  aria-current={item.path && isActive(item.path) ? "page" : undefined}
                  sx={{
                    justifyContent: "flex-start",
                    minHeight: 50,
                    px: 1.6,
                    borderRadius: "13px",
                    color: item.path && isActive(item.path) ? "#07563E" : "#173A31",
                    bgcolor: item.path && isActive(item.path) ? "#E0F3E9" : "transparent",
                    fontWeight: item.path && isActive(item.path) ? 700 : 500,
                    textTransform: "none",
                    fontSize: "0.98rem",
                    "& .MuiButton-startIcon": { marginRight: "13px", color: "#0A7A5A" },
                    "&:hover": { bgcolor: "#EDF8F1" },
                  }}
                >
                  {item.label}
                </Button>
              </React.Fragment>
            ))}
            {token && (
              <>
                <Divider sx={{ my: 1.6, borderColor: "#DCE6E2" }} />
                <Button
                  onClick={() => { setMobileOpen(false); signout(); }}
                  fullWidth startIcon={<LogoutOutlinedIcon />}
                  sx={{ justifyContent: "flex-start", px: 1.6, minHeight: 50, borderRadius: "13px", color: "#C93F3F", textTransform: "none", fontSize: "0.98rem", "& .MuiButton-startIcon": { mr: "13px" } }}
                >
                  Logout
                </Button>
              </>
            )}
          </Stack>
        </Box>
        <Box aria-hidden="true" sx={{ height: 49, flexShrink: 0, bgcolor: "#FFFFFF", backgroundImage: "linear-gradient(160deg, transparent 0 36%, #B8F2CF 36% 40%, #087651 40% 76%, #1AC488 76% 80%, #FFFFFF 80%)", backgroundSize: "100% 100%" }} />
      </Drawer>

      {/* 🔹 User Agreement Modal */}
      <Modal
        open={agreementOpen}
        onClose={handleCloseAgreement}
        aria-labelledby="user-agreement-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box sx={{ 
          width: '100%', 
          maxWidth: '1200px', 
          maxHeight: '90vh', 
          overflow: 'auto',
          outline: 'none'
        }}>
          <Paper
            elevation={24}
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: `3px solid #0A7A5A`,
            }}
          >
            <Stack
              alignItems="center"
              py={4}
              px={2}
              width="100%"
              sx={{
                backgroundColor: "#F9FDFC",
              }}
            >
              <Box maxWidth="1200px" width="100%">
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="#064C3B"
                  textAlign="center"
                  mb={1}
                  sx={{ textTransform: "uppercase", fontSize: { xs: "1.5rem", md: "2rem" } }}
                >
                  User Agreement
                </Typography>
                
                <Typography
                  color="text.secondary"
                  textAlign="center"
                  mb={4}
                  sx={{ 
                    maxWidth: "800px", 
                    mx: "auto", 
                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                    px: 2
                  }}
                >
                  Please read and understand our terms before reporting items on S-LOFT
                </Typography>

                <Grid container spacing={3} sx={{ height: "100%" }}>
                  {/* Platform Rules Card */}
                  <Grid item xs={12} md={6} sx={{ height: "100%" }}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 3,
                        borderRadius: "16px",
                        backgroundColor: "#FFFFFF",
                        border: "2px solid #E6F4F1",
                        height: "100%",
                        transition: "0.3s",
                        "&:hover": {
                          boxShadow: "0px 8px 25px rgba(11, 153, 110, 0.15)",
                          transform: "translateY(-5px)",
                        },
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <SecurityIcon sx={{ fontSize: "1.8rem", color: "#0B996E", mr: 1.5 }} />
                        <Typography variant="h6" fontWeight="bold" color="#064C3B" sx={{ fontSize: "1.1rem" }}>
                          Platform Rules
                        </Typography>
                      </Box>

                      <Typography
                        color="text.secondary"
                        sx={{ mb: 2, lineHeight: 1.5, fontSize: "0.85rem", fontStyle: "italic" }}
                      >
                        This system is for lost and found purposes only. We do not allow any misuse of this platform. Please don't use it to make fun of others or post things that are not related to lost and found items.
                      </Typography>

                      <Stack spacing={1.5} sx={{ flexGrow: 1, mb: 2 }}>
                        {[
                          "Post only lost and found items.",
                          "Do not post jokes, memes, or unrelated content.",
                          "Do not use offensive or disrespectful language.",
                          "Always provide truthful and accurate information when posting.",
                          "Respect other users and their belongings.",
                          "All lost items must be surrendered to CSDL, or the won't be covered if wrongly claimed"
                        ].map((rule, index) => (
                          <Box key={index} sx={{ display: "flex", alignItems: "flex-start" }}>
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                backgroundColor: "#0B996E",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 1.5,
                                flexShrink: 0,
                                mt: 0.1
                              }}
                            >
                              <Typography variant="body2" sx={{ color: "white", fontWeight: "bold", fontSize: "0.7rem" }}>
                                {index + 1}
                              </Typography>
                            </Box>
                            <Typography color="text.secondary" sx={{ lineHeight: 1.4, fontSize: "0.8rem" }}>
                              {rule}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>

                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "10px",
                          backgroundColor: "#FFF3E0",
                          border: "2px solid #FFB74D",
                          flexGrow: 11,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center"
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <WarningIcon sx={{ fontSize: "1.5rem", color: "#E65100", mr: 1.5 }} />
                          <Typography variant="h6" fontWeight="bold" color="#E65100" sx={{ fontSize: "1.1rem" }}>
                            Important Notice
                          </Typography>
                        </Box>
                        <Typography color="text.secondary" sx={{ lineHeight: 1.4, fontSize: "0.75rem" }}>
                          By using S-LOFT Lost and Found Tracking System, you agree to abide by these rules and understand the consequences of violations. Let's work together to maintain a safe and respectful environment for all South Campus students.
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Violation Consequences Card */}
                  <Grid item xs={12} md={6} sx={{ height: "100%" }}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 3,
                        borderRadius: "16px",
                        backgroundColor: "#FFFFFF",
                        border: "2px solid #E6F4F1",
                        height: "100%",
                        transition: "0.3s",
                        "&:hover": {
                          boxShadow: "0px 8px 25px rgba(11, 153, 110, 0.15)",
                          transform: "translateY(-5px)",
                        },
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <GavelIcon sx={{ fontSize: "1.8rem", color: "#0B996E", mr: 1.5 }} />
                        <Typography variant="h6" fontWeight="bold" color="#064C3B" sx={{ fontSize: "1.1rem" }}>
                          Violation Consequences
                        </Typography>
                      </Box>

                      <Typography
                        color="text.secondary"
                        sx={{ mb: 3, lineHeight: 1.5, fontSize: "0.85rem" }}
                      >
                        Before you continue using S-Loft, please read and understand this User Agreement:
                      </Typography>

                      <Stack spacing={2} sx={{ flexGrow: 1 }}>
                        {[
                          {
                            offense: "1st OFFENSE",
                            consequence: "If you break the rules, you will receive a warning message from the admin."
                          },
                          {
                            offense: "2nd OFFENSE", 
                            consequence: "If you violate the rules again, the Head Administrator of CSDL will call you for a personal talk to discuss why you are not following the rules."
                          },
                          {
                            offense: "3rd OFFENSE",
                            consequence: "If you continue to break the rules, the Head Administrator of CSDL will require you to bring your parent or guardian (must be a relative like your mom, dad, aunt, or uncle) to the school. You and your parent/guardian will have a meeting with the Head Administrator to discuss your repeated violations."
                          }
                        ].map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              borderRadius: "10px",
                              backgroundColor: index === 2 ? "#FFE8E8" : "#F8F9FA",
                              border: `1px solid ${index === 2 ? "#FFCDD2" : "#E0E0E0"}`,
                              flexGrow: index === 2 ? 1 : 0,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center"
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color={index === 2 ? "#D32F2F" : "#0B996E"}
                              mb={0.5}
                              sx={{ fontSize: "0.8rem" }}
                            >
                              {item.offense}
                            </Typography>
                            <Typography color="text.secondary" sx={{ lineHeight: 1.4, fontSize: "0.75rem" }}>
                              {item.consequence}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>

                {/* 🔹 Agree Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleCloseAgreement}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: '600',
                      fontSize: '16px',
                      borderColor: '#0A7A5A',
                      color: '#0A7A5A',
                      '&:hover': {
                        backgroundColor: '#E6F4F1',
                        borderColor: '#08684D',
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleAgree}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: '600',
                      fontSize: '16px',
                      backgroundColor: '#0A7A5A',
                      '&:hover': {
                        backgroundColor: '#08684D',
                      }
                    }}
                  >
                    I Agree - Continue to Report
                  </Button>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Modal>
    </>
  );
}

export default Navbar;