// CLIENT/src/pages/AdminClaimView.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
  TextField,
  Grid,
  Chip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function AdminClaimView() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const claim = state?.claim;

  const [commentText, setCommentText] = useState("");

  if (!claim) {
    return (
      <Box
        sx={{
          textAlign: "center",
          mt: 10,
          color: "#0B996E",
          fontWeight: "bold",
        }}
      >
        <Typography color="error">No claim details found.</Typography>
      </Box>
    );
  }

  // ✅ UPDATED: Mark as Claimed function - move to archive and remove from table
  const handleUpdateStatus = async () => {
    try {
      // Step 1: Update the item status to "Claimed" (this should trigger archive)
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/items/${claim.itemId._id}/status`,
        { status: "Claimed" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data.ok) {
        toast.success(" Item marked as claimed and moved to archive!");
        
        // Step 2: Update the claim notification status to "Claimed"
        try {
          await axios.put(
            `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/claims/${claim._id}/status`,
            { status: "Claimed" },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          console.log(" Claim notification status updated to Claimed");
        } catch (claimError) {
          console.error("❌ Error updating claim notification:", claimError);
          // Continue even if claim status update fails
        }

        // Step 3: Navigate back to claim notifications
        setTimeout(() => {
          navigate("/admin/claim-notifications");
        }, 1500);
        
      } else {
        toast.info(res.data.msg || "Unable to update status");
      }
    } catch (error) {
      console.error("❌ Error marking as claimed:", error);
      toast.error("Failed to update status ❌");
    }
  };

  //  Send comment to user via backend API
  const handleSendComment = async () => {
    if (!commentText.trim()) {
      toast.error("Please type a Message before sending!");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items/sendComment/${claim.itemId._id}`,
        { comment: commentText },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data.ok) {
        toast.success("Message sent to user ");
        setCommentText(""); // clear input
      } else {
        toast.error(res.data.msg || "Failed to send comment ❌");
      }
    } catch (error) {
      console.error("❌ Failed to send comment:", error);
      toast.error("Failed to send comment ❌");
    }
  };

  return (
    <Box sx={{ p: 3, ml: "210px" }}>
      {/* Title */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/admin/claim-notifications")}
        sx={{
          textTransform: "none",
          color: "#0A7A5A",
          border: "1px solid #0A7A5A",
          borderRadius: "8px",
          mr: 2,
          mb: 3
        }}
      >
        Back
      </Button>
      
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#0B996E"
        mb={3}
        sx={{ textAlign: "left" }}
      >
        Claim Details
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - Item Information */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "16px",
              backgroundColor: "#fff",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="#0B996E" mb={2}>
              Item Information
            </Typography>

            {/* Item Image */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <img
                src={
                  claim.itemId?.img?.[0] ||
                  "https://i.ibb.co/DpZ3qy2/Untitled-design-10.png"
                }
                alt="Item"
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  border: "2px solid #0B996E",
                }}
              />
            </Box>

            {/* Item Details */}
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Item Name
                </Typography>
                <Typography fontWeight="medium">
                  {claim.itemId?.name || "Unnamed Item"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
                <Typography fontWeight="medium">
                  {claim.itemId?.description || "Without description"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Location
                </Typography>
                <Typography fontWeight="medium">
                  {claim.itemId?.room || "No Room Info"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Date Found
                </Typography>
                <Typography fontWeight="medium">
                  {claim.itemId?.date || "No Date Provided"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={claim.status || "Pending"} 
                  size="small"
                  sx={{
                    backgroundColor: claim.status === "Claimed" ? "#0B996E" : "#B68D00",
                    color: "white",
                    fontWeight: "bold"
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column - Claimant Information & Actions */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "16px",
              backgroundColor: "#fff",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="#0B996E" mb={2}>
              Claim By
            </Typography>

            {/* Claimant Details */}
            <Stack spacing={1.5} mb={3}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography fontWeight="medium">
                  {claim.userId?.fullname || "N/A"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Student ID
                </Typography>
                <Typography fontWeight="medium">
                  {claim.userId?.studentId || "N/A"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Course
                </Typography>
                <Chip 
                  label={claim.userId?.course || "N/A"} 
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderColor: "#0B996E", 
                    color: "#0B996E",
                    backgroundColor: "#F0F5FF"
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Contact
                </Typography>
                <Typography fontWeight="medium">
                  {claim.userId?.contact || "N/A"}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Action Buttons */}
            <Box sx={{ mt: 'auto' }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  textTransform: "none",
                  backgroundColor: "#0B996E",
                  "&:hover": { backgroundColor: "#098562" },
                  borderRadius: "10px",
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "16px",
                  mb: 2,
                }}
                onClick={handleUpdateStatus}
              >
                Mark as Claimed
              </Button>

              {/* Comment Section */}
              <TextField
                label="Write a Message to the user"
                multiline
                rows={2}
                fullWidth
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  textTransform: "none",
                  borderColor: "#0B996E",
                  color: "#0B996E",
                  "&:hover": { 
                    borderColor: "#098562",
                    backgroundColor: "#E6F4F1"
                  },
                  borderRadius: "10px",
                  py: 1,
                  fontWeight: "bold",
                  mt: 1,
                }}
                onClick={handleSendComment}
              >
                Send Message
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminClaimView;