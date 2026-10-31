// client/src/Components/ItemCard.js
import React from "react";
import {
  Card,
  CardContent,
  Stack,
  Avatar,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import ImageIcon from "@mui/icons-material/Image";

export default function ItemCard({ item }) {
  const getTimeDifference = (dateString) => {
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdDate) / 1000);
    
    if (diffInSeconds < 60) {
      return "just now";
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}w`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}month${diffInMonths > 1 ? 's' : ''}`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}year${diffInYears > 1 ? 's' : ''}`;
  };

  const postedTime = getTimeDifference(item.createdAt || item.date || Date.now());
  const profilePic =
    item.userId?.img || "https://i.ibb.co/QP8C4R3/default-avatar.png";
  
  // Format student ID to hide last 5-6 digits
  const formatStudentId = (studentId) => {
    if (!studentId || studentId === "Unknown ID") return "Unknown ID";
    
    // Check if the ID matches the format XX-XXXX-XXXXXX
    const idParts = studentId.split('-');
    if (idParts.length === 3) {
      const firstPart = idParts[0]; // 01
      const secondPart = idParts[1]; // 2023
      const thirdPart = idParts[2]; // 049878
      
      // Hide last 5-6 digits with X's
      const hiddenDigits = 'X'.repeat(thirdPart.length);
      return `${firstPart}-${secondPart}-${hiddenDigits}`;
    }
    
    return studentId;
  };

  const studentId = formatStudentId(item.userId?.studentId || "Unknown ID");

  return (
    <motion.div
      whileHover={{ scale: [null, 1.03, 1.03] }}
      transition={{ duration: 0.3 }}
      style={{ cursor: "pointer" }}
    >
      <Card
        sx={{
          width: "340px",
          height: "460px",
          borderRadius: "18px",
          backgroundColor: "#ffffff",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
         border: "1.5px solid #111111ff", // 🟢 Brevo Elf Green
          position: "relative",
          transition: "0.4s ease",
          "&:hover": {
            boxShadow: "0px 8px 25px rgba(11, 153, 110, 0.2)",
            transform: "translateY(-4px)",
          },
        }}
      >
         {/* 🏷 Chip - Lost or Found - Removed background */}
        <Chip
          label={item.type === "Found" ? "FOUND ITEM" : "LOST ITEM"}
          variant="outlined"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            fontWeight: "bold",
            fontSize: "0.7rem",
            px: 1,
            color: "#0A7A5A",
            borderColor: "#ffffffff",
            backgroundColor: "transparent",
          }}
        />


        <CardContent
          sx={{
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {/* 👤 Header */}
          <Stack direction="row" alignItems="center" gap={1.2}>
            <Avatar
              src={profilePic}
              alt="profile"
              sx={{
                width: 42,
                height: 42,
                border: "2px solid #c8e6c9",
              }}
            />
            <Stack>
              <Typography variant="subtitle2" fontWeight="bold">
                {studentId}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.75rem" }}
              >
              {postedTime}
              </Typography>
            </Stack>
          </Stack>

          {/* 🖼️ Image */}
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              height: "210px",
              borderRadius: "14px",
              overflow: "hidden",
              mt: 1.5,
              border: "1px solid #e0e0e0",
              backgroundColor: "#f9f9f9",
            }}
          >
            {item.img && item.img.length > 0 ? (
              <Box
                component="img"
                src={
                  Array.isArray(item.img)
                    ? `http://localhost:4000/${item.img[0]}`
                    : `http://localhost:4000/${item.img}`
                }
                alt={item.name || item.itemName || "Item"}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: "100%",
                  height: "160px",
                  borderRadius: "12px",
                  backgroundColor: "#f0f7f4",
                  border: "2px dashed #9eb9a6",
                  color: "#607d8b",
                  textAlign: "center",
                  p: 2,
                }}
              >
                <ImageIcon sx={{ fontSize: 50, color: "#9eb9a6" }} />
                <Typography variant="body2" fontWeight="bold">
                  No Image Available
                </Typography>
              </Stack>
            )}
          </Stack>

          {/* 📄 Info */}
         {/* 📄 Info */}
<Stack spacing={0.6} sx={{ mt: 1.2 }}>
 <Typography variant="body2" color="text.secondary">
                     Item Name: <strong style={{ color: "#2c2f2eff" }}>{item.name || "Unnamed Item"}</strong>
                   </Typography>

   <Typography variant="body2" color="text.secondary">
                                      Description of Item: <strong style={{ color: "#2c2f2eff" }}>{item.description || "No description available"}</strong>
                                    </Typography>

  {/* Show Location only if item is Lost */}
  {item.type !== "Found" && (
    <Typography variant="body2" color="text.secondary">
      Possible Location : <strong style={{ color: "#2c2f2eff" }}>{item.room || "Unknown Room"}</strong>
    </Typography>
  )}

  <Typography variant="body2" color="text.secondary">
    {item.type === "Found" ? "Date Found:" : "Date Lost:"}{" "}
    <strong style={{ color: "#2c2f2eff" }}>
      {item.date || item.createdAt
        ? new Date(item.createdAt || item.date).toLocaleDateString()
        : "N/A"}
    </strong>
  </Typography>
</Stack>

        </CardContent>
      </Card>
    </motion.div>
  );
}