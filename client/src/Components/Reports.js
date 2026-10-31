// 📄 client/src/Components/Reports.js  
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Avatar,
  Tooltip,
  IconButton,
  Divider,
  Button,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { Visibility, FilterList, Refresh } from "@mui/icons-material";
import { FaClipboardList } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reports = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // ✅ Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // ✅ Fetch all items
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/items?all=true");
      setItems(response.data.items || []);
      setFilteredItems(response.data.items || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ Apply filters
  useEffect(() => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.room?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "All") {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  }, [searchTerm, typeFilter, categoryFilter, items]);

  // ✅ Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("All");
    setCategoryFilter("All");
  };

  // ✅ Get unique categories and types for filters
  const uniqueCategories = [...new Set(items.map(item => item.category).filter(Boolean))];
  const uniqueTypes = [...new Set(items.map(item => item.type).filter(Boolean))];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", duration: 0.7 },
    },
  };

  const tableHeaderStyle = {
    fontWeight: "bold",
    fontSize: "0.9rem",
    backgroundColor: "#0B996E",
    color: "#fff",
  };

  return (
    <motion.div
      className="reports-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        flex: 1,
        padding: "20px 40px",
        backgroundColor: "#E6F4F1",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          ml: "160px",
        }}
      >
       
       {/* 🧾 Header Section */}
<Paper
  elevation={3}
  sx={{
    p: 3,
    mb: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #0B996E 30%, #0BD6A5 90%)",
    color: "#fff",
  }}
>
  <Box display="flex" alignItems="center" gap={2}>
    <FaClipboardList size={35} />
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Lost & Found Reports
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        Detailed list of all reported items
      </Typography>
    </Box>
  </Box>

  {/* 🆕 Add Report Button */}
  <Button
    variant="contained"
    sx={{
      backgroundColor: "#fff",
      color: "#0B996E",
      fontWeight: "bold",
      textTransform: "none",
      borderRadius: "10px",
      "&:hover": { backgroundColor: "#e6f4f1" },
    }}
    onClick={() => (window.location.href = "/admin/add-report")}
  >
    + Add Report
  </Button>
</Paper>

        {/* 🔍 Filter Section */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "12px",
            backgroundColor: "#F9FDFC",
            ml: "5px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <FilterList sx={{ color: "#0B996E" }} />
            
            {/* Search Filter */}
            <TextField
              size="small"
              placeholder="Search by name, description, category, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 600 }}
            />

            {/* Type Filter */}
            <TextField
              select
              size="small"
              label="Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="All">All Types</MenuItem>
              {uniqueTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            {/* Category Filter */}
            <TextField
              select
              size="small"
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="All">All Categories</MenuItem>
              {uniqueCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            {/* Reset Filters Button */}
            <IconButton
              sx={{
                color: "#0B996E",
                border: "1px solid #0B996E",
                "&:hover": { 
                  backgroundColor: "#E6F4F1",
                  color: "#098562" 
                },
              }}
              onClick={resetFilters}
              title="Reset all filters"
            >
              <Refresh />
            </IconButton>

            {/* Results Count */}
            <Chip 
              label={`${filteredItems.length} results`}
              variant="outlined"
              sx={{ color: "#0B996E", borderColor: "#0B996E" }}
            />
          </Box>
        </Paper>

        {/* 📊 Table Section */}
        <Paper
          elevation={2}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "#fff",
            p: 2,
            ml: "5px",
          }}
        >
          <TableContainer sx={{ maxHeight: "150vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeaderStyle}>Report No.</TableCell>
                  <TableCell sx={tableHeaderStyle}>Image Item</TableCell>
                  <TableCell sx={tableHeaderStyle}>Item Name</TableCell>
                  <TableCell sx={tableHeaderStyle}>Description</TableCell>
                  <TableCell sx={tableHeaderStyle}>Category</TableCell>
                  <TableCell sx={tableHeaderStyle}>Type</TableCell>
                  <TableCell sx={tableHeaderStyle}>Possible Location</TableCell>
                  <TableCell sx={tableHeaderStyle}>Date Reported</TableCell>
                  
                  <TableCell sx={tableHeaderStyle} align="center">
                    View
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <CircularProgress sx={{ color: "#0B996E" }} />
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography variant="body1" color="textSecondary">
                        No reports found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item, index) => (
                    <motion.tr
                      key={index}
                      whileHover={{ backgroundColor: "#f4f8f7" }}
                      transition={{ duration: 0.2 }}
                      style={{
                        cursor: "pointer",
                        borderBottom: "1px solid #e0f0ec",
                      }}
                    >
                      {/* 🔢 Report Numbering */}
                      <TableCell>{index + 1}</TableCell>

                      {/* 📸 Item Image */}
                      <TableCell>
                        <Avatar
                          src={
                            item.img?.[0]
                              ? `http://localhost:4000/${item.img[0]}`
                              : "https://i.ibb.co/DpZ3qy2/Untitled-design-10.png"
                          }
                          alt={item.name}
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "12px",
                            objectFit: "cover",
                            border: "2px solid #0B996E",
                          }}
                          variant="rounded"
                        />
                      </TableCell>

                      {/* 👤 item Name */}
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {item.name}
                      </TableCell>

                      {/* 📝 Description */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#555",
                            maxWidth: "250px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.description}
                        </Typography>
                      </TableCell>

                      {/* 🏷️ Category */}
                      <TableCell>
                        <Chip 
                          label={item.category || "N/A"} 
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderColor: "#0B996E", 
                            color: "#0B996E",
                            backgroundColor: "#F0F5FF"
                          }}
                        />
                      </TableCell>

                      {/* 🆕 Type Column (Lost/Found) */}
                      <TableCell>
                        <Chip
                          label={item.type || "N/A"}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: item.type === "Found" ? "#0B996E" : "#d32f2f",
                            color: "white",
                            minWidth: "80px"
                          }}
                        />
                      </TableCell>

                      {/* 🏫 Room */}
                      <TableCell>{item.room || "N/A"}</TableCell>

                      {/* 📅 Date */}
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>

                      {/* 👁️ View Button */}
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            sx={{
                              color: "#fff",
                              bgcolor: "#0B996E",
                              "&:hover": { bgcolor: "#0BD6A5" },
                            }}
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

        <Divider sx={{ my: 4 }} />
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ opacity: 0.6 }}
        >
          © {new Date().getFullYear()} CSDL Lost & Found | Admin Reports
          Dashboard
        </Typography>
      </Box>
    </motion.div>
  );
};

export default Reports;