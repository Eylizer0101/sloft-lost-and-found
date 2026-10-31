import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Stack,
  Typography,
  Button,
  Box,
  Divider,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RoomIcon from "@mui/icons-material/Room";
import InfoIcon from "@mui/icons-material/Info";
import LabelIcon from "@mui/icons-material/Label";
import { Carousel } from "react-carousel-minimal";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyListingDetails() {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const item_id = queryParams.get("cid");
  const item_type = queryParams.get("type")?.split("/")[0]; // Lost or Found

  const [item, setItem] = useState(null);
  const [slidesData, setSlidesData] = useState([]);
  const slides = useMemo(() => slidesData, [slidesData]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items/${item_id}`)
      .then((res) => {
        const data = res.data.item;
        const imgs =
          data.img?.map((img) => ({
            image: `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/${img}`,
          })) || [];
        setSlidesData(imgs);
        setItem(data);
      })
      .catch((err) => console.log("Error fetching item:", err));
  }, [item_id]);

  const handleBack = () => navigate(-1);

// MyListingDetails.js - I-REPLACE ang handleDelete function
const handleDelete = () => {
  if (window.confirm("Are you sure you want to archive this item?")) {
    axios
      .put(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items/archive/${item_id}`) // ✅ BAGONG ENDPOINT
      .then(() => {
        toast.success("Item moved to archive successfully 📁", {
          position: "bottom-right",
          autoClose: 1000,
        });
        navigate("/mylistings");
      })
      .catch((err) => {
        console.log("Error archiving item:", err);
        toast.error("Failed to archive item", { position: "bottom-right" });
      });
  }
};

  if (!item) {
    return (
      <Stack alignItems="center" justifyContent="center" mt={10}>
        <Typography variant="h6" color="text.secondary">
          Loading item details...
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      width="100%"
      alignItems="center"
      justifyContent="flex-start"
      sx={{
        background: "linear-gradient(180deg, #D7FEC8 0%, #ffffffff 100%)",
        minHeight: "100vh",
        p: 2,
        pt: 3,
      }}
    >
      {/* Top Navigation - Centered */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width={{ xs: "100%", sm: "90%", md: "75%" }}
        mb={3}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          variant="contained"
          sx={{
            backgroundColor: "#0B996E",
            "&:hover": { backgroundColor: "#098562" },
            borderRadius: "10px",
            textTransform: "none",
            px: 3,
            py: 1,
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(11, 153, 110, 0.3)",
          }}
        >
          Back
        </Button>

        <Typography
          variant="h5"
          fontWeight="800"
          color="#0B996E"
          textAlign="center"
          sx={{
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {item_type === "Lost" ? " Lost Item" : " Found Item"}
        </Typography>

        {/* REMOVED: Delete button from top navigation */}
        <Box sx={{ width: "100px" }} /> {/* Spacer to maintain layout */}
      </Stack>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Paper
          elevation={8}
          sx={{
            width: { xs: "95%", sm: "90%", md: "75%" },
            borderRadius: "20px",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 8px 32px rgba(11, 153, 110, 0.15)",
            border: "2px solid #E8F5EE",
          }}
        >
          {/* Image Section - Perfectly Sized */}
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#F8FEFB",
              p: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "500px",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              }}
            >
              {slides.length > 0 ? (
                <Carousel
                  data={slides.map((slide) => ({ image: slide.image }))}
                  width="100%"
                  height="300px"
                  radius="0px"
                  automatic={true}
                  dots={true}
                  slideImageFit="cover"
                  thumbnails={false}
                />
              ) : (
                <Box
                  width="100%"
                  height="300px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    background: "linear-gradient(135deg, #E8FDF2, #D7FEC8)",
                    border: "2px dashed #B0E8A8",
                  }}
                >
                  <Stack alignItems="center" spacing={1}>
                    <LabelIcon sx={{ color: "#0B996E", fontSize: 48 }} />
                    <Typography color="#666" fontWeight="500">
                      No Image Available
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>

          {/* Item Details */}
          <Card sx={{ borderRadius: 0, p: { xs: 2, sm: 4 } }}>
            <CardContent>
              {/* Header */}
              <Typography
                variant="h6"
                fontWeight="700"
                textAlign="center"
                color="#0B996E"
                mb={3}
                sx={{
                  background: "linear-gradient(90deg, #0B996E, #0A8B63)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {item_type === "Lost"
                  ? " Lost Item Information"
                  : " Found Item Information"}
              </Typography>

              <Grid container spacing={3}>
                {/* Item Name */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <LabelIcon sx={{ color: "#0B996E", fontSize: 24 }} />
                      <Typography fontWeight="700" color="#2D3748">
                        Item Name
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body1"
                      sx={{
                        backgroundColor: "#F9FFFB",
                        p: 2,
                        borderRadius: "12px",
                        border: "2px solid #E8F5EE",
                        fontWeight: "500",
                        color: "#1A202C",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)",
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Stack>
                </Grid>

                {/* Date */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <CalendarMonthIcon sx={{ color: "#0B996E", fontSize: 24 }} />
                      <Typography fontWeight="700" color="#2D3748">
                        {item_type === "Lost" ? "Date Lost" : "Date Found"}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body1"
                      sx={{
                        backgroundColor: "#F9FFFB",
                        p: 2,
                        borderRadius: "12px",
                        border: "2px solid #E8F5EE",
                        fontWeight: "500",
                        color: "#1A202C",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)",
                      }}
                    >
                      {item.date}
                    </Typography>
                  </Stack>
                </Grid>

                {/* Location */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <RoomIcon sx={{ color: "#0B996E", fontSize: 24 }} />
                      <Typography fontWeight="700" color="#2D3748">
                        {item_type === "Lost"
                          ? " Possible Location"
                          : " Location Found"}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body1"
                      sx={{
                        backgroundColor: "#F9FFFB",
                        p: 2,
                        borderRadius: "12px",
                        border: "2px solid #E8F5EE",
                        fontWeight: "500",
                        color: "#1A202C",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)",
                      }}
                    >
                      {item.room}
                    </Typography>
                  </Stack>
                </Grid>

                {/* Category (if available) */}
                {item.category && (
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <LabelIcon sx={{ color: "#0B996E", fontSize: 24 }} />
                        <Typography fontWeight="700" color="#2D3748">
                          Category
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body1"
                        sx={{
                          backgroundColor: "#F9FFFB",
                          p: 2,
                          borderRadius: "12px",
                          border: "2px solid #E8F5EE",
                          fontWeight: "500",
                          color: "#1A202C",
                          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)",
                        }}
                      >
                        {item.category}
                      </Typography>
                    </Stack>
                  </Grid>
                )}

                {/* Description */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <InfoIcon sx={{ color: "#0B996E", fontSize: 24 }} />
                      <Typography fontWeight="700" color="#2D3748">
                        Description
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body1"
                      sx={{
                        backgroundColor: "#F9FFFB",
                        p: 2.5,
                        borderRadius: "12px",
                        border: "2px solid #E8F5EE",
                        textAlign: "justify",
                        lineHeight: 1.7,
                        color: "#1A202C",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)",
                        minHeight: "80px",
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>

              {/* Bottom Action - ADDED: Delete button moved here */}
              <Stack
                direction="row"
                justifyContent="flex-end" // ✅ CHANGED: Align to right
                alignItems="center"
                mt={4}
                pt={2}
                sx={{ borderTop: "2px solid #F0F9F5" }}
              >
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  sx={{
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    px: 3,
                    py: 1,
                    boxShadow: "0 4px 12px rgba(255,0,0,0.2)",
                    "&:hover": {
                      backgroundColor: "#C62828",
                      boxShadow: "0 6px 16px rgba(255,0,0,0.3)",
                    },
                  }}
                >
                  Delete
                </Button>
              </Stack>

              {/* Bottom Message */}
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                mt={2}
              >
                <Typography
                  variant="body2"
                  color="#666"
                  textAlign="center"
                  fontStyle="italic"
                >
                  {item_type === "Lost" 
                    ? "Hope you find your item soon! " 
                    : "Thank you for helping return this item! "
                  }
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Paper>
      </motion.div>
      
      <Box height={20} />
    </Stack>
  );
}