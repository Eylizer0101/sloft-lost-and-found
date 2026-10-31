// client/src/Components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Stack,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Divider,
  Chip,
  Tooltip,
  IconButton,
  Avatar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingClaims, setPendingClaims] = useState(0);
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.stats);
    } catch (e) {
      console.error("Error fetching stats:", e);
    }
  };

  const fetchPendingClaims = async () => {
    try {
      console.log("🔄 Fetching pending claims count...");
      const res = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/claims/pending-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📊 Pending claims response:", res.data);
      if (res.data && res.data.ok) {
        setPendingClaims(res.data.count || 0);
      } else {
        setPendingClaims(0);
      }
    } catch (error) {
      console.error("❌ Error fetching pending claims:", error);
      console.error("❌ Error details:", error.response?.data);
      setPendingClaims(0);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data.items);
      setFilteredItems(res.data.items);
      setLoading(false);
    } catch (e) {
      console.error("Error fetching items:", e);
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = items;

    if (typeFilter !== "All") {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  }, [typeFilter, categoryFilter, items]);

  useEffect(() => {
    fetchStats();
    fetchItems();
    fetchPendingClaims();
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "refreshDashboard" && event.newValue === "true") {
        fetchStats();
        fetchItems();
        fetchPendingClaims();
        localStorage.setItem("refreshDashboard", "false");
      }
    };

    const handleItemStatusChanged = () => {
      fetchStats();
      fetchItems();
      fetchPendingClaims();
      localStorage.setItem("refreshDashboard", "false");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("itemStatusChanged", handleItemStatusChanged);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("itemStatusChanged", handleItemStatusChanged);
    };
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/items/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.ok && res.data.stats) {
        setStats(res.data.stats);
      } else {
        fetchStats();
      }
      fetchItems();
      fetchPendingClaims();
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Delete item?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/items/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchItems();
        fetchStats();
        fetchPendingClaims();
      } catch (e) {
        console.error("Error deleting item:", e);
      }
    }
  };

  const markAsFound = async (id) => {
    if (window.confirm("Mark this item as Found?")) {
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/items/${id}/found`,
          {
            status: "Pending",
            type: "Found",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.ok && res.data.stats) {
          setStats(res.data.stats);
        } else {
          fetchStats();
        }
        fetchItems();
        fetchPendingClaims();
      } catch (e) {
        console.error("Error marking found:", e);
      }
    }
  };

  const tableHeaderStyle = {
    fontWeight: "bold",
    backgroundColor: "#0A7A5A",
    color: "white",
    textAlign: "center",
  };

  // Get unique categories for filter
  const categories = ["All", ...new Set(items.map(item => item.category).filter(Boolean))];
  const types = ["All", "Lost", "Found"];

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: "#FFFFFF",
        minHeight: "100vh",
        ml: "210px",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight="bold" color="#0A7A5A">
          Admin Dashboard
        </Typography>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h6" mb={2} fontWeight="bold" color="#064C3B">
        Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#E6F4F1", borderRadius: "12px", boxShadow: 3 }}>
            <Typography variant="body1" color="#064C3B">
              Total Lost
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="#0A7A5A">
              {stats?.totalLost ?? 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#E8F5E9", borderRadius: "12px", boxShadow: 3 }}>
            <Typography variant="body1" color="#064C3B">
              Total Found
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="green">
              {stats?.totalFound ?? 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#fff3e0", borderRadius: "12px", boxShadow: 3 }}>
            <Typography variant="body1" color="#064C3B">
              Claimed
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="#0A7A5A">
              {stats?.totalClaimed ?? 0}
            </Typography>
          </Paper>
        </Grid>

        {/* ✅ NEW CARD: Pending Claim Notifications */}
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#F3E5F5", borderRadius: "12px", boxShadow: 3 }}>
            <Typography variant="body1" color="#064C3B">
              Pending Claim
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="#B68D00">
              {pendingClaims}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ mt: 5, mb: 3 }} />

      {/* All Reports Header with Filters on the Right */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="#064C3B">
          All Reports
        </Typography>
        
        {/* Filters on the Right Side */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel> Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body2" color="text.secondary">
            {filteredItems.length} of {items.length}
          </Typography>
        </Box>
      </Box>

      <Paper elevation={2} sx={{ borderRadius: "16px", overflow: "hidden", backgroundColor: "#FFFFFF", p: 2 }}>
        <TableContainer sx={{ maxHeight: "150vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeaderStyle}>Report No.</TableCell>
                <TableCell sx={tableHeaderStyle}>Image Item</TableCell>
                <TableCell sx={tableHeaderStyle}>Item Name</TableCell>
                <TableCell sx={tableHeaderStyle}>Description</TableCell>
                <TableCell sx={tableHeaderStyle}>Category</TableCell>
                <TableCell sx={tableHeaderStyle}>Possible Location</TableCell>
                <TableCell sx={tableHeaderStyle}>Date Reported</TableCell>
                <TableCell sx={tableHeaderStyle}>Type</TableCell>
                <TableCell sx={tableHeaderStyle} align="center">
                  View
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <CircularProgress sx={{ color: "#0A7A5A" }} />
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Typography variant="body1" color="#064C3B">
                      No reports found matching the selected filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item, index) => (
                  <motion.tr
                    key={item._id || index}
                    whileHover={{ backgroundColor: "#f4f9f8" }}
                    transition={{ duration: 0.2 }}
                    style={{
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <Avatar
                        src={
                          item.img?.[0]
                            ? `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/${item.img[0]}`
                            : "https://i.ibb.co/DpZ3qy2/Untitled-design-10.png"
                        }
                        alt={item.name}
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "12px",
                          objectFit: "cover",
                        }}
                        variant="rounded"
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold", color: "#0A7A5A" }}>
                      {item.name}
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#064C3B",
                          maxWidth: "250px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.description}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          bgcolor: "#E6F4F1",
                          color: "#0A7A5A",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                          display: "inline-block",
                        }}
                      >
                        {item.category}
                      </Box>
                    </TableCell>

                    <TableCell>{item.room}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          bgcolor: item.type === "Found" ? "#E8F5E9" : "#FFF3E0",
                          color: item.type === "Found" ? "green" : "orange",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                          display: "inline-block",
                        }}
                      >
                        {item.type || "Lost"}
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          sx={{ color: "#0A7A5A" }}
                          onClick={() => {
                            window.location.href = `details/${item._id}`;
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}