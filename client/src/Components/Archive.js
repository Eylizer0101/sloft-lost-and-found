import React, { useEffect, useState } from "react"; 
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  Chip,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Search, Archive as ArchiveIcon, FilterList, Visibility, Refresh } from "@mui/icons-material";
import axios from "axios";

const Archive = () => {
  const [archives, setArchives] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/archive`);
        setArchives(res.data.archives);
        setFiltered(res.data.archives);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArchives();
  }, []);

  // ✅ Filter functionality
  useEffect(() => {
    let filteredData = archives.filter(
      (a) =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.category?.toLowerCase().includes(search.toLowerCase()) ||
        a.location?.toLowerCase().includes(search.toLowerCase()) ||
        a.status?.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter !== "All") {
      filteredData = filteredData.filter((a) => a.status === statusFilter);
    }

    if (categoryFilter !== "All") {
      filteredData = filteredData.filter((a) => a.category === categoryFilter);
    }

    setFiltered(filteredData);
  }, [search, statusFilter, categoryFilter, archives]);

  // ✅ Reset all filters
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
  };

  // ✅ Get unique categories for filter
  const uniqueCategories = [...new Set(archives.map(a => a.category).filter(Boolean))];

  // ✅ Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Claimed": return "#0B996E";
      case "Deleted": return "#d32f2f";
      case "Returned": return "#1976d2";
      default: return "#666";
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress sx={{ color: "#0B996E" }} />
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      {/* Title */}
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#0B996E"
        mb={2}
        sx={{ textAlign: "left", marginLeft: "210px" }}
      >
        Archive Records
      </Typography>

      {/* Filter Section */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: "12px",
          backgroundColor: "#F9FDFC",
          ml: "210px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <FilterList sx={{ color: "#0B996E" }} />
          
          {/* Search Filter */}
          <TextField
            size="small"
            placeholder="Search by name, location, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { xs: 0, md: 260 }, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#0B996E" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Status Filter */}
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Claimed">Claimed</MenuItem>
            <MenuItem value="Deleted">Deleted</MenuItem>
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
            label={`${filtered.length} results`}
            variant="outlined"
            sx={{ color: "#0B996E", borderColor: "#0B996E" }}
          />
        </Box>
      </Paper>

      {/* Table Section */}
      <Paper
        sx={{
          overflow: "hidden",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          ml: "210px",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#E6F4F1" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E", width: "70px" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>Item Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>Date Reported</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>Date Archived</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }} align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((a, index) => (
                <TableRow
                  key={a._id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "#F9FDFC",
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>{a.name || "N/A"}</TableCell>
                  <TableCell>
                    <Chip 
                      label={a.category || "N/A"} 
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
                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString("en-US") : "N/A"}
                  </TableCell>
                  <TableCell>
                    {a.dateArchived
                      ? new Date(a.dateArchived).toLocaleDateString("en-US")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={a.status || "N/A"}
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: getStatusColor(a.status),
                        color: "white",
                        minWidth: "80px"
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      component={Link}
                      to={`/admin/archive/${a._id}`}
                      variant="outlined"
                      size="small"
                      sx={{
                        textTransform: "none",
                        borderRadius: "8px",
                        borderColor: "#0B996E",
                        color: "#0B996E",
                        "&:hover": {
                          backgroundColor: "#0B996E",
                          color: "#fff",
                        },
                      }}
                    >
                      <Visibility fontSize="small" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No archived records found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Archive;