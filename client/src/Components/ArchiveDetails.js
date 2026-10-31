// CLIENT/src/Components/ArchiveDetails.js 
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Grid,
  CircularProgress,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const ArchiveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ✅ Fetch archived item
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/archive/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItem(res.data.archive);
      } catch (err) {
        console.error("❌ Error fetching archived item:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  // ✅ RESTORE FUNCTION - GAMITIN ANG ADMIN ENDPOINT
  const restoreItem = async (itemId) => {
    Swal.fire({
      title: "Restore this item?",
      text: "The report will be moved back to active reports.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, restore it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ✅ GAMITIN ANG ADMIN ENDPOINT
          await axios.put(
            `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/archive/${itemId}/restore`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.fire("Restored!", "The item has been restored successfully.", "success");
          navigate("/admin/archive");
        } catch (err) {
          console.error("❌ Error restoring item:", err);
          Swal.fire("Error!", "Failed to restore the item.", "error");
        }
      }
    });
  };

  // ✅ DELETE PERMANENT FUNCTION - GAMITIN ANG ADMIN ENDPOINT
  const deleteItemPermanently = async (itemId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to permanently delete this item. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it permanently!",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ✅ GAMITIN ANG ADMIN ENDPOINT
          await axios.delete(
            `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/archive/${itemId}/permanent`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.fire("Deleted!", "The item has been permanently deleted.", "success");
          navigate("/admin/archive");
        } catch (err) {
          console.error("❌ Error deleting item permanently:", err);
          Swal.fire("Error!", "Failed to delete the item permanently.", "error");
        }
      }
    });
  };

  // ✅ Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: "#0A7A5A" }} />
      </Box>
    );
  }

  // ✅ If no item found
  if (!item) {
    return (
      <Box sx={{ p: 3, ml: "210px", textAlign: "center" }}>
        <Typography color="textSecondary">
          ❌ Archived item not found.
        </Typography>
      </Box>
    );
  }

  const user = item.userId || {};
  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");

  return (
    <Box sx={{ p: 3, ml: "210px" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          component={Link}
          to="/admin/archive"
          startIcon={<ArrowBack />}
          sx={{
            textTransform: "none",
            color: "#0A7A5A",
            border: "1px solid #0A7A5A",
            borderRadius: "8px",
            mr: 2,
          }}
        >
          Back
        </Button>
        <Typography variant="h5" fontWeight="bold" color="#0A7A5A">
          Archived Report Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Item Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}>
            <Typography variant="h6" fontWeight="bold" color="#0A7A5A" mb={2}>
              Item Information
            </Typography>

            {/* Item Image */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <img
                src={
                  item.img?.[0]
                    ? `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/${item.img[0]}`
                    : "https://i.ibb.co/DpZ3qy2/Untitled-design-10.png"
                }
                alt={item.name}
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  border: "2px solid #0A7A5A",
                }}
              />
            </Box>

            {/* Item Details */}
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Item Name
                </Typography>
                <Typography fontWeight="medium">{item.name}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
                <Typography fontWeight="medium">
                  {item.description || "No description provided"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Category
                </Typography>
                <Chip 
                  label={item.category || "N/A"} 
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderColor: "#0A7A5A", 
                    color: "#0A7A5A",
                    backgroundColor: "#F0F5FF"
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Location Found
                </Typography>
                <Typography fontWeight="medium">{item.room || "N/A"}</Typography>
              </Box>

            
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column - Uploader & Status Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}>
            <Typography variant="h6" fontWeight="bold" color="#0A7A5A" mb={2}>
              Uploader Information
            </Typography>

            {/* Uploader Details */}
            <Stack spacing={2} mb={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={user.img}
                  alt={user.fullname}
                  sx={{
                    width: 60,
                    height: 60,
                    border: "2px solid #0A7A5A",
                  }}
                />
                <Box>
                  <Typography fontWeight="medium">{user.fullname || "N/A"}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.studentId || "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Course
                </Typography>
                <Chip 
                  label={user.course || "N/A"} 
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderColor: "#0A7A5A", 
                    color: "#0A7A5A",
                    backgroundColor: "#F0F5FF"
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Contact
                </Typography>
                <Typography fontWeight="medium">{user.contact || "N/A"}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* ✅ DAGDAG: Claimed By Information - ONLY SHOW IF ITEM WAS CLAIMED */}
            {item.claimedBy && (
              <>
                <Typography variant="h6" fontWeight="bold" color="#0A7A5A" mb={2}>
                  Claimed By
                </Typography>
                
                <Stack spacing={2} mb={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography fontWeight="medium">
                      {item.claimedBy.fullname || "N/A"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Student ID
                    </Typography>
                    <Typography fontWeight="medium">
                      {item.claimedBy.studentId || "N/A"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Course
                    </Typography>
                    <Chip 
                      label={item.claimedBy.course || "N/A"} 
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderColor: "#0A7A5A", 
                        color: "#0A7A5A",
                        backgroundColor: "#F0F5FF"
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Contact
                    </Typography>
                    <Typography fontWeight="medium">
                      {item.claimedBy.contact || "N/A"}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />
              </>
            )}

            {/* Status Information */}
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Status
              </Typography>
              <Chip
                label={item.status || "N/A"}
                size="medium"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: 
                    item.status === "Deleted" || item.status === "Removed" ? "#d32f2f" :
                    item.status === "Claimed" ? "#0A7A5A" : "#B68D00",
                  color: "white",
                  minWidth: "100px"
                }}
              />
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Date Archived
              </Typography>
              <Typography fontWeight="medium">{formatDate(item.createdAt)}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
        {/* Delete Permanently Button - ALWAYS SHOW */}
        <Button
          variant="contained"
          onClick={() => deleteItemPermanently(item._id)}
          sx={{
            textTransform: "none",
            backgroundColor: "#d32f2f",
            "&:hover": { backgroundColor: "#b71c1c" },
            borderRadius: "10px",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Delete Permanently
        </Button>

        {/* ✅ RESTORE BUTTON - SHOW ONLY IF STATUS IS NOT "Claimed" */}
        {item.status !== "Claimed" && (
          <Button
            variant="contained"
            onClick={() => restoreItem(item._id)}
            sx={{
              textTransform: "none",
              backgroundColor: "#0A7A5A",
              "&:hover": { backgroundColor: "#08684D" },
              borderRadius: "10px",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Restore Item
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ArchiveDetails;