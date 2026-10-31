import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Avatar,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  MenuItem,
  Select,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Dialog,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { ArrowBack } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [reportNumber, setReportNumber] = useState(null);
  const [openImage, setOpenImage] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items/${id}`);
        setItem(res.data.item);
        setStatus(res.data.item?.status || "");

        const allRes = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items?all=true`);
        const allItems = allRes.data.items || [];
        const index = allItems.findIndex((x) => x._id === res.data.item._id);
        if (index !== -1) setReportNumber(index + 1);
      } catch (err) {
        console.error("❌ Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const updateStatus = async (itemId, newStatus) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items/update/${itemId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(newStatus);
      setItem((prev) => ({ ...prev, status: newStatus }));

      window.dispatchEvent(
        new CustomEvent("itemStatusChanged", {
          detail: { id: itemId, newStatus },
        })
      );

      localStorage.setItem("refreshDashboard", "true");
      Swal.fire("Success!", "Status updated successfully!", "success");
    } catch (e) {
      console.error(e);
      Swal.fire("Error!", "Failed to update status.", "error");
    }
  };

  const markAsFound = async (itemId) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/items/${itemId}/found`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { item, stats } = res.data;

      setStatus("Claimed");
      setItem((prev) => ({ ...prev, type: "Found", status: "Claimed" }));

      window.dispatchEvent(
        new CustomEvent("itemStatusChanged", {
          detail: { id: itemId, newStatus: "Claimed", stats },
        })
      );

      Swal.fire({
        icon: "success",
        title: "Item marked as Found!",
        text: "The item has been updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to mark item as found.", "error");
    }
  };

  const deleteItem = async (itemId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/items/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Deleted!", "Item has been deleted.", "success");

          window.dispatchEvent(
            new CustomEvent("itemStatusChanged", {
              detail: { id: itemId, newStatus: "Deleted" },
            })
          );
          localStorage.setItem("refreshDashboard", "true");
          navigate("/admin/reports");
        } catch (err) {
          console.error(err);
          Swal.fire("Error!", "Failed to delete item.", "error");
        }
      }
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!item) {
    return (
      <Typography align="center" sx={{ mt: 5, color: "#999" }}>
        ❌ Item not found or has been removed.
      </Typography>
    );
  }

  const user = item.userId || {};

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: "#f7fbfb",
        minHeight: "100vh",
        padding: "50px 30px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: "20px",
          maxWidth: "1400px",
          mx: "auto",
          p: 5,
          background: "linear-gradient(180deg, #ffffff 0%, #f6fcfb 100%)",
          ml: "210px",
          border: "1px solid #d4f1ed",
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            component={Link}
            to="/admin/reports"
            startIcon={<ArrowBack />}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              color: "#ffffff",
              backgroundColor: "#0B996E",
              borderRadius: "10px",
              px: 2.5,
              "&:hover": { background: "#098562" },
            }}
          >
            Back
          </Button>

          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#0B996E",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Report Details
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 4, color: "#6a7f7a" }}>
          Below is the complete report information and uploader details.
        </Typography>

        {/* Report Information */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 2, color: "#0B996E" }}>
          Report Information
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            mb: 3,
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
            "&:hover": { boxShadow: "0 6px 14px rgba(0,0,0,0.1)" },
          }}
        >
          <Table>
            <TableHead sx={{ background: "linear-gradient(90deg, #0B996E 0%, #19B394 100%)" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Report No.</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Contact Number</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Date Reported</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{reportNumber !== null ? `#${reportNumber}` : "N/A"}</TableCell>
                <TableCell>{item.number || "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: item.status === "Claimed" ? "#0B996E" : "#B68D00",
                      color: "white",
                      minWidth: "80px"
                    }}
                  />
                </TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Uploader Details */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 4, color: "#0B996E" }}>
          Uploader Details
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            mb: 4,
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Table>
            <TableHead sx={{ background: "linear-gradient(90deg, #0B996E 0%, #19B394 100%)" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Profile</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Full Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Student ID</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Course</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Year Level</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Avatar
                    src={user.img}
                    alt={user.fullname}
                    sx={{ width: 60, height: 60, border: "2px solid #0B996E" }}
                  />
                </TableCell>
                <TableCell>{user.fullname || "N/A"}</TableCell>
                <TableCell>{user.studentId || "N/A"}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.course || "N/A"} 
                    size="small"
                    variant="outlined"
                    sx={{ 
                      borderColor: "#0B996E", 
                      color: "#0B996E",
                      backgroundColor: "#F0F5FF"
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.yearLevel || "N/A"} 
                    size="small"
                    variant="outlined"
                    sx={{ 
                      borderColor: "#0B996E", 
                      color: "#0B996E",
                      backgroundColor: "#F0F5FF"
                    }}
                  />
                </TableCell>
                <TableCell>{user.email || "N/A"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Item Details */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 4, color: "#0B996E" }}>
          Item Details
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            mb: 4,
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "300px" },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={
                item.img?.[0]
                  ? `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/${item.img[0]}`
                  : "https://i.ibb.co/DpZ3qy2/Untitled-design-10.png"
              }
              alt={item.name}
              style={{
                width: "100%",
                height: "230px",
                objectFit: "cover",
                borderRadius: "12px",
                border: "3px solid #0B996E",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              onClick={() => setOpenImage(true)}
            />
          </Box>

          <Dialog open={openImage} onClose={() => setOpenImage(false)} maxWidth="md">
            <img
              src={
                item.img?.[0]
                  ? `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/${item.img[0]}`
                  : "https://i.ibb.co/DpZ3qy2/Untitled-design-10.png"
              }
              alt="Full Size"
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          </Dialog> 

          <Grid container spacing={2} sx={{ flex: 1 }}>
            <Grid item xs={12} sm={6}>
              <Typography>
                <b>Item Name:</b> {item.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <b>Category:</b> {item.category}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <b>Type:</b> {item.type}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <b>Location:</b> {item.room}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <b>Description:</b> {item.description || "No description"}
              </Typography>

              {item?.areaImage && (
                <Card
                  elevation={2}
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: "12px",
                    background: "#f4fdfb",
                    border: "1px solid #bdeee1",
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography fontSize="17px" fontWeight="bold" color="#0B996E" mb={1}>
                      Clue Area
                    </Typography>
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                      <img
                        src={`/areas/${item.areaImage.toLowerCase().replace(/ /g, "")}.jpg`}
                        alt={item.areaImage}
                        style={{
                          width: "100%",
                          maxWidth: "420px",
                          borderRadius: "12px",
                          border: "2px solid #0B996E",
                          marginTop: "8px",
                        }}
                      />
                      <Typography variant="body2" mt={1} color="#333">
                        {item.areaImage}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Update Item Status Section */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#0B996E" }}>
          Update Item Status
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={2}>
          {/* For Found Items - Show Mark As Claimed button only */}
          {item.type === "Found" && (
            <Button
              variant="contained"
              onClick={() => updateStatus(item._id, "Claimed")}
              sx={{
                textTransform: "none",
                backgroundColor: "#0B996E",
                fontWeight: "bold",
                borderRadius: "10px",
                px: 4,
                py: 1,
                "&:hover": { backgroundColor: "#098562" },
              }}
            >
              Mark as Claimed
            </Button>
          )}

          {/* For Lost Items - Show Mark as Found button only */}
          {item.type === "Lost" && (
            <Button
              variant="outlined"
              onClick={() => markAsFound(item._id)}
              disabled={item.status === "Claimed"}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                borderColor: "#0B996E",
                color: "#0B996E",
                borderRadius: "10px",
                px: 4,
                py: 1,
                "&:hover": { 
                  borderColor: "#098562",
                  backgroundColor: "#E6F4F1"
                },
                "&.Mui-disabled": {
                  borderColor: "#ccc",
                  color: "#ccc"
                }
              }}
            >
              Mark as Found
            </Button>
          )}

          <Tooltip title="Delete Item">
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => deleteItem(item._id)}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                borderColor: "#d32f2f",
                color: "#d32f2f",
                borderRadius: "10px",
                px: 3,
                py: 1,
                "&:hover": { 
                  borderColor: "#b71c1c",
                  backgroundColor: "#ffebee"
                },
              }}
            >
              Delete
            </Button>
          </Tooltip>
        </Stack>

        {/* Footer */}
        <Box
          sx={{
            mt: 8,
            textAlign: "center",
            color: "#777",
            borderTop: "1px solid #e0e0e0",
            pt: 3,
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Lost & Found System — Admin Dashboard
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            Designed with Brevo-inspired colors for a clean and calm look.
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default Details;