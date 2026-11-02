import React, { useEffect, useState } from "react";  
import {
  Stack,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  CircularProgress,
  TextField,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import background from "../img/bg.jpg";
import axios from "axios";
import ItemCard from "./ItemCard";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-hot-toast";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';

const MySwal = withReactContent(Swal);

const colors = {
  primary: "#0B996E",
  dark: "#064C3B",
  lightBg: "#E6F4F1",
  neutral: "#F5F5F5",
  text: "#000000",
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Home = () => {
  const isLoggedIn = JSON.parse(window.localStorage.getItem("user"));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  const showLoginAlert = (action = "access this feature") => {
    MySwal.fire({
      title: "Login Required",
      text: `You need to log in first to ${action}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Go to Login",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0B996E",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/log-in");
      }
    });
  };

  const handleButtonClick = () => {
    showLoginAlert("report an item");
  };

  const handleButtonClickLost = () => {
    showLoginAlert("view lost items");
  };

  const handleButtonClickFound = () => {
    showLoginAlert("view found items");
  };

  const handleViewAllItems = () => {
    showLoginAlert("view all items");
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items`);
        if (res.data?.items) {
          setItems(res.data.items);
        } else if (Array.isArray(res.data)) {
          setItems(res.data);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleOpenCommentsFromHome = (item) => {
    showLoginAlert("view item details");
  };

  const foundItems = items.filter((i) => i.type === "Found");
  const lostItems = items.filter((i) => i.type === "Lost");
  const allItems = [...foundItems, ...lostItems];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/contact/send`, {
        name,
        email,
        message,
      });
      if (res.data.success) {
        toast.success("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  return (
    <Stack
      width="100%"
      alignItems="center"
      sx={{ backgroundColor: "#FFFFFF" }}
    >
      {/* 🌟 HERO SECTION — responsive landing redesign */}
      <Box sx={{ width: "100%", position: "relative", overflow: "hidden", background: "linear-gradient(125deg, #F4FBF5 0%, #FFFFFF 48%, #EDF9EE 100%)", pt: { xs: 5, md: 8 }, pb: { xs: 5, md: 7 } }}>
        <Box sx={{ position: "absolute", top: -110, left: -130, width: { xs: 270, md: 500 }, height: 220, borderRadius: "50%", bgcolor: "#E1F6DF", opacity: 0.65, pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", right: -90, bottom: -110, width: 360, height: 280, borderRadius: "50%", bgcolor: "#DDF5DC", opacity: 0.7, pointerEvents: "none" }} />
        <Box sx={{ width: "100%", maxWidth: "1460px", mx: "auto", px: { xs: 2.5, sm: 4, md: 6, lg: 8 }, position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.12fr) minmax(0, 1fr)" }, alignItems: "center", columnGap: { md: 3, lg: 5 }, rowGap: { xs: 3, md: 0 }, minHeight: { md: 410 } }}>
            <Box sx={{ minWidth: 0, textAlign: { xs: "center", md: "left" }, py: { xs: 0, md: 3 } }}>
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Typography component="h1" sx={{ color: colors.dark, fontWeight: 800, fontSize: { xs: "clamp(1.7rem, 7vw, 2.7rem)", md: "clamp(2.15rem, 3.45vw, 3.45rem)" }, lineHeight: 1.13, letterSpacing: "-0.02em", whiteSpace: { md: "nowrap" } }}>ARAULLO SOUTH CAMPUS</Typography>
                <Typography component="h2" sx={{ color: "#064C3B", mt: 1, fontSize: { xs: "clamp(1.25rem, 4.3vw, 1.85rem)", md: "clamp(1.55rem, 2.5vw, 2.3rem)" }, fontWeight: 700, lineHeight: 1.25 }}>Lost And Found Tracking System</Typography>
                <Typography sx={{ mt: 2.5, mb: 4, color: "#4B5563", fontSize: { xs: "0.95rem", sm: "1.05rem" }, lineHeight: 1.65 }}>Easily report and retrieve lost items with our system.</Typography>
              </motion.div>
              <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: { xs: "center", md: "flex-start" }, gap: 1.5, "& .MuiButton-root": { textTransform: "none", borderRadius: "28px", px: { xs: 2, sm: 3 }, minHeight: 46, fontWeight: 700, fontSize: { xs: "0.83rem", sm: "0.95rem" }, whiteSpace: "nowrap" } }}>
                <Button startIcon={<DescriptionIcon />} variant="contained" onClick={handleButtonClick} sx={{ bgcolor: colors.primary, color: "#fff", "&:hover": { bgcolor: colors.dark } }}>Report Item</Button>
                <Button startIcon={<DescriptionIcon />} variant="outlined" onClick={handleButtonClickLost} sx={{ borderColor: colors.primary, color: colors.dark, bgcolor: "#F6FFF7", "&:hover": { borderColor: colors.dark, bgcolor: "#E9F8EC" } }}>Lost Items</Button>
                <Button startIcon={<SearchIcon />} variant="outlined" onClick={handleButtonClickFound} sx={{ borderColor: colors.primary, color: colors.dark, bgcolor: "#FFFFFF", "&:hover": { borderColor: colors.dark, bgcolor: "#E9F8EC" } }}>Found Item</Button>
              </Box>
            </Box>
            <Box sx={{ minWidth: 0, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box component="img" src="/images/MintBackground.png" alt="Lost and found belongings: backpack, phone, student ID, keys, wallet, notebook and umbrella" sx={{ display: "block", width: "100%", maxWidth: { xs: 500, md: 670 }, height: "auto", objectFit: "contain" }} />
            </Box>
          </Box>
          <Box sx={{ mt: { xs: 4, md: 3 }, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, gap: 2 }}>
            {[
              { title: "Report Easily", desc: "Quickly and simply report lost or found items on campus.", icon: <DescriptionIcon sx={{ fontSize: 31 }} /> },
              { title: "Track Requests", desc: "Stay updated on the status of your reported items.", icon: <LocationOnIcon sx={{ fontSize: 31 }} /> },
              { title: "Claim Securely", desc: "Retrieve your items through a safe and verified process.", icon: <SearchIcon sx={{ fontSize: 31 }} /> },
            ].map((feature) => (
              <Paper key={feature.title} elevation={0} sx={{ minWidth: 0, p: { xs: 2, md: 2.5 }, display: "flex", alignItems: "center", gap: 2, borderRadius: "20px", bgcolor: "#FFFFFF", border: "1px solid #E6F0E8", boxShadow: "0 7px 22px rgba(16, 78, 49, 0.07)" }}>
                <Box sx={{ flexShrink: 0, width: 60, height: 60, display: "grid", placeItems: "center", borderRadius: "18px", bgcolor: "#E4F6E6", color: "#07814E" }}>{feature.icon}</Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, color: colors.dark, fontSize: { xs: "1rem", md: "1.1rem" } }}>{feature.title}</Typography>
                  <Typography sx={{ color: "#58645E", mt: 0.4, lineHeight: 1.45, fontSize: "0.87rem" }}>{feature.desc}</Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      {/* HOW IT WORKS — existing section retained below hero */}
      <Stack
        alignItems="center"
        mt={{ xs: 0, md: 3 }}
        px={{ xs: 2.5, md: 3 }}
        width="100%"
        sx={{ backgroundColor: "#FFFFFF", py: { xs: 5, md: 8 }, textAlign: "center" }}
      >
        <Typography variant="h5" fontWeight="bold" color="#064C3B" mb={1}>How It Works</Typography>
        <Typography color="text.secondary" textAlign="center" mb={{ xs: 3, md: 5 }}>Our system makes it easy to report and find lost items</Typography>
        <Grid container spacing={3} justifyContent="center" maxWidth="1000px">
          {[
            { title: "Report Lost Items", desc: "Add detailed descriptions and images. Quickly report any items you've lost.", icon: <DescriptionIcon sx={{ fontSize: 40, color: "#0A7A5A" }} /> },
            { title: "Find Items", desc: "Browse through reported items to see if someone found what you're looking for.", icon: <SearchIcon sx={{ fontSize: 40, color: "#2d4d88ff" }} /> },
            { title: "Get Notified", desc: "Receive notifications when items matching your description are found.", icon: <NotificationsIcon sx={{ fontSize: 40, color: "#c3a70bff" }} /> },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: "20px", textAlign: "center", backgroundColor: "#FFFFFF", border: "1px solid #E0E0E0", transition: "0.3s", "&:hover": { boxShadow: "0px 8px 20px rgba(0,0,0,0.15)", transform: "translateY(-5px)" } }}>
                {item.icon}
                <Typography variant="h6" fontWeight="bold" color="#0A7A5A" mt={1} mb={1}>{item.title}</Typography>
                <Typography color="text.secondary">{item.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Stack>

      {/* 🔷 Carousel Section */}
      <Stack
        alignItems="center"
        mt={12}
        py={8}
        width="100%"
        sx={{
          background: "linear-gradient(180deg, #E6F4F1 0%, #ffffff 100%)",
          borderRadius: "40px",
          px: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="#064C3B" mb={1}>
          Recently Found Items and Lost Items
        </Typography>
        <Typography color="text.secondary" mb={5} textAlign="center">
          Check out these recently found and lost items waiting to be claimed
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <Button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === 0 ? allItems.length - 1 : prev - 1
                  )
                }
                sx={{
                  minWidth: "40px",
                  bgcolor: colors.primary,
                  color: "#fff",
                  borderRadius: "50%",
                  "&:hover": { bgcolor: colors.dark },
                }}
              >
                {"<"}
              </Button>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "80%",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {allItems
                    .slice(currentIndex, currentIndex + 5)
                    .map((it, index) => (
                      <motion.div
                        key={it._id}
                        onClick={() => handleOpenCommentsFromHome(it)}
                        animate={{
                          scale: index === 2 ? 0.97 : 0.95,
                          opacity: 1,
                        }}
                        transition={{ duration: 0.3 }}
                        style={{
                          margin: "0 15px",
                          cursor: "pointer",
                          filter: index === 2 ? "none" : "brightness(95%)",
                        }}
                      >
                        <ItemCard item={it} />
                      </motion.div>
                    ))}
                </motion.div>
              </Box>

              <Button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === allItems.length - 1 ? 0 : prev + 1
                  )
                }
                sx={{
                  minWidth: "40px",
                  bgcolor: colors.primary,
                  color: "#fff",
                  borderRadius: "50%",
                  "&:hover": { bgcolor: colors.dark },
                }}
              >
                {">"}
              </Button>
            </Stack>
          </Box>
        )}

        <Stack direction="row" spacing={2} mt={6}>
          <Button
            sx={{
              bgcolor: colors.primary,
              color: "#fff",
              px: 4,
              py: 1.2,
              borderRadius: "25px",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { bgcolor: colors.dark },
            }}
            onClick={handleViewAllItems}
          >
            View All Items
          </Button>
        </Stack>
      </Stack>

      {/* Divider */}
      <Divider
        sx={{
          width: "80%",
          borderColor: colors.primary,
          borderWidth: "2px",
          borderRadius: "2px",
        }}
      />

      {/* ABOUT SECTION */}
      <Stack
        id="about"
        direction={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="space-between"
        py={10}
        px={4}
        maxWidth="1200px"
        width="100%"
        gap={{ xs: 6, md: 10 }}
        sx={{
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* About Content (Left) */}
        <Stack
          width={{ xs: "100%", md: "48%" }}
          gap="30px"
          alignSelf="center"
          sx={{
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography
            color="#064C3B"
            variant="h2"
            fontWeight="bold"
            sx={{ textTransform: "uppercase", fontSize: { xs: "2rem", md: "2.8rem" } }}
          >
            About Us
          </Typography>

          <Typography
            color="black"
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.8,
              maxWidth: "600px",
              mx: { xs: "auto", md: 0 },
            }}
          >
            This system was created for South Campus students to make it easier to track lost and found items. Whether you misplaced something in the classroom, library, or anywhere in the campus, our goal is to help you reconnect with your belongings quickly and safely.
          </Typography>

          {/* Buttons */}
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: { xs: "center", md: "flex-start" },
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Paper
                elevation={4}
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  minWidth: "150px",
                  textAlign: "center",
                  bgcolor: "#0B996E",
                }}
              >
                <Button
                  fullWidth
                  onClick={handleButtonClickLost}
                  sx={{
                    flexDirection: "column",
                    alignItems: "center",
                    color: "#fff",
                    fontWeight: "700",
                    textTransform: "none",
                    py: "20px",
                  }}
                >
                  <img
                    src="https://i.ibb.co/5rKZCdX/Main-Logo-2.png"
                    alt="Lost Item"
                    width="40px"
                    style={{ marginBottom: "10px" }}
                  />
                  Lost Item
                </Button>
              </Paper>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Paper
                elevation={4}
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  minWidth: "150px",
                  textAlign: "center",
                  bgcolor: "black",
                }}
              >
                <Button
                  fullWidth
                  onClick={handleButtonClickFound}
                  sx={{
                    flexDirection: "column",
                    alignItems: "center",
                    color: "#fff",
                    fontWeight: "700",
                    textTransform: "none",
                    py: "20px",
                  }}
                >
                  <img
                    src="https://i.ibb.co/5rKZCdX/Main-Logo-2.png"
                    alt="Found Item"
                    width="40px"
                    style={{ marginBottom: "10px" }}
                  />
                  Found Item
                </Button>
              </Paper>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Paper
                elevation={4}
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  minWidth: "180px",
                  textAlign: "center",
                  bgcolor: "#0B996E",
                }}
              >
                <Button
                  fullWidth
                  onClick={handleButtonClick}
                  sx={{
                    flexDirection: "column",
                    alignItems: "center",
                    color: "#fff",
                    fontWeight: "700",
                    textTransform: "none",
                    py: "20px",
                  }}
                >
                  <img
                    src="https://i.ibb.co/5rKZCdX/Main-Logo-2.png"
                    alt="Post Item"
                    width="40px"
                    style={{ marginBottom: "10px" }}
                  />
                  Report Item
                </Button>
              </Paper>
            </motion.div>
          </Stack>
        </Stack>

        {/* Image (Right Side) */}
        <Stack
          justifyContent="center"
          width={{ xs: "100%", md: "48%" }}
          height={{ xs: "280px", md: "480px" }}
          sx={{
            position: "relative",
            borderRadius: "25px",
            overflow: "hidden",
            boxShadow: "0px 6px 25px rgba(0,0,0,0.2)",
            backgroundImage: `url(${background})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "linear-gradient(180deg, rgba(0,0,0,0.25)",
            }}
          />
        </Stack>
      </Stack>

      {/* ✅ CONTACT SECTION */}
      <Stack
        id="contact"
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="flex-start"
        py={{ xs: 5, md: 10 }}
        px={{ xs: 2.5, sm: 4, md: 5 }}
        width="100%"
        maxWidth="1200px"
        gap={{ xs: 3, md: 5 }}
        sx={{
          backgroundColor: "#FFFFFF",
          borderTop: `3px solid ${colors.primary}`,
          boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
          borderRadius: "16px",
        }}
      >
        {/* 📍 Left Side - Contact Info */}
        <Stack spacing={3} width={{ xs: "100%", md: "48%" }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="#064C3B"
            textTransform="uppercase"
            letterSpacing={1}
          >
            Contact Us
          </Typography>

          <Typography color="text.secondary" maxWidth="500px" sx={{ lineHeight: 1.7 }}>
            Have questions or need assistance? Feel free to reach out to us. We're
            here to help you with any concerns related to lost and found items.
          </Typography>

          <Stack spacing={2.5} mt={2}>
            {/* 📍 Location */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{
                backgroundColor: "#E6F4F1",
                p: 1.5,
                borderRadius: "12px",
                transition: "0.3s",
                "&:hover": { backgroundColor: "#D8F0EA" },
              }}
            >
              <LocationOnIcon sx={{ fontSize: "2rem", color: "#0B996E" }} />
              <Typography color={colors.dark} fontWeight={500}>
                471 & 1, Cabanatuan City, Nueva Ecija
              </Typography>
            </Stack>

            {/* ✉️ Email */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{
                backgroundColor: "#E6F4F1",
                p: 1.5,
                borderRadius: "12px",
                transition: "0.3s",
                "&:hover": { backgroundColor: "#D8F0EA" },
              }}
            >
              <EmailIcon sx={{ fontSize: "2rem", color: "#0B996E" }} />
              <Typography color={colors.dark} fontWeight={500}>
                lostandfoundsystem@gmail.com
              </Typography>
            </Stack>

            {/* 📞 Phone */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{
                backgroundColor: "#E6F4F1",
                p: 1.5,
                borderRadius: "12px",
                transition: "0.3s",
                "&:hover": { backgroundColor: "#D8F0EA" },
              }}
            >
              <PhoneIcon sx={{ fontSize: "2rem", color: "#0B996E" }} />
              <Typography color={colors.dark} fontWeight={500}>
                09553127553
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* ✉️ Contact Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: { xs: 0, md: 0 },
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            width: { xs: "100%", md: "48%" },
            backgroundColor: "#F9FBFB",
            p: { xs: 2.5, sm: 3, md: 4 },
            borderRadius: "16px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          }}
        >
          <TextField
            placeholder="Your Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            InputLabelProps={{ shrink: false }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#B0DCD1" },
                "&:hover fieldset": { borderColor: "#0B996E" },
                "&.Mui-focused fieldset": { borderColor: "#0B996E" },
              },
              "& input::placeholder": { color: "#888", opacity: 1 },
            }}
          />

          <TextField
            placeholder="Your Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputLabelProps={{ shrink: false }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#B0DCD1" },
                "&:hover fieldset": { borderColor: "#0B996E" },
                "&.Mui-focused fieldset": { borderColor: "#0B996E" },
              },
              "& input::placeholder": { color: "#888", opacity: 1 },
            }}
          />

          <TextField
            placeholder="Your Message"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            InputLabelProps={{ shrink: false }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#B0DCD1" },
                "&:hover fieldset": { borderColor: "#0B996E" },
                "&.Mui-focused fieldset": { borderColor: "#0B996E" },
              },
              "& textarea::placeholder": { color: "#888", opacity: 1 },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#0B996E",
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "10px",
              py: 1.2,
              px: 4,
              alignSelf: { xs: "stretch", sm: "flex-start" },
              textTransform: "none",
              transition: "0.3s",
              "&:hover": { bgcolor: "#09785A", transform: "translateY(-2px)" },
            }}
          >
            Send Message
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Home;