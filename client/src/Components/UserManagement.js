// client/src/Components/UserManagement.js
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  TablePagination,
  Chip,
  Divider,
  Fade,
  MenuItem,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  FilterList,
  Refresh,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.users ?? res.data?.usersList ?? res.data;
      const resolved = Array.isArray(data)
        ? data
        : Array.isArray(res.data?.users)
        ? res.data.users
        : [];

      const onlyUsers = resolved.filter((u) => u.role === "user");
      setUsers(onlyUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to fetch users (check console).");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0B996E",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    setDeletingIds((s) => [...s, id]);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => String(u._id) !== String(id)));
      toast.success("User deleted successfully.");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("❌ Failed to delete user (check console).");
    } finally {
      setDeletingIds((s) => s.filter((x) => x !== id));
    }
  };

  // ✅ Reset all filters
  const resetFilters = () => {
    setQuery("");
    setCourseFilter("All");
    setStatusFilter("All");
  };

  // ✅ Get unique courses for filter
  const uniqueCourses = [...new Set(users.map(u => u.course).filter(Boolean))];

  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Search filter
    if (query) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter((u) => {
        const fullname = (u.fullname || "").toLowerCase();
        const studentId = (u.studentId || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const course = (u.course || "").toLowerCase();
        return (
          fullname.includes(q) ||
          studentId.includes(q) ||
          email.includes(q) ||
          course.includes(q)
        );
      });
    }

    // Course filter
    if (courseFilter !== "All") {
      filtered = filtered.filter(u => u.course === courseFilter);
    }

    // Status filter (based on last login activity)
    if (statusFilter !== "All") {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      filtered = filtered.filter((u) => {
        const lastActive = u.lastLogin ? new Date(u.lastLogin) : new Date(u.updatedAt || u.createdAt);
        switch (statusFilter) {
          case "Active":
            return lastActive >= thirtyDaysAgo;
          case "Inactive":
            return lastActive < thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [users, query, courseFilter, statusFilter]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleString();
    } catch {
      return "-";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleDateString();
    } catch {
      return "-";
    }
  };

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  return (
    <Box sx={{ p: 3, ml: "210px" }}>
      {/* 🧑‍💻 Header Section */}
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#0B996E"
        mb={2}
        sx={{ textAlign: "left" }}
      >
        User Profile
      </Typography>

      {/* 🔍 Filter Section */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: "12px",
          backgroundColor: "#F9FDFC",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <FilterList sx={{ color: "#0B996E" }} />
          
          {/* Search Filter */}
          <TextField
            size="small"
            placeholder="Search by name, student ID, email, or course..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: 600 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#0B996E" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Course Filter */}
          <TextField
            select
            size="small"
            label="Course"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">All Courses</MenuItem>
            {uniqueCourses.map((course) => (
              <MenuItem key={course} value={course}>
                {course}
              </MenuItem>
            ))}
          </TextField>

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
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
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
            label={`${filteredUsers.length} results`}
            variant="outlined"
            sx={{ color: "#0B996E", borderColor: "#0B996E" }}
          />
        </Box>
      </Paper>

      {/* 📊 Users Table */}
      <Paper
        sx={{
          overflow: "hidden",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <TableContainer sx={{ maxHeight: "150vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#E6F4F1" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#0B996E", width: "70px" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>Profile</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>Date Registered</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>Last Login</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <CircularProgress sx={{ color: "#0B996E" }} />
                  </TableCell>
                </TableRow>
              ) : paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary" fontSize={16}>
                      No users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((u, index) => {
                  const isDeleting = deletingIds.includes(u._id);
                  const rowNumber = page * rowsPerPage + index + 1;
                  
                  // Determine user status
                  const lastActive = u.lastLogin ? new Date(u.lastLogin) : new Date(u.updatedAt || u.createdAt);
                  const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
                  const userStatus = lastActive >= thirtyDaysAgo ? "Active" : "Inactive";

                  return (
                    <TableRow
                      key={u._id}
                      hover
                      sx={{
                        "&:hover": { backgroundColor: "#F9FDFC" },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {rowNumber}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={u.img || u.avatar || undefined}
                            alt={u.fullname || u.studentId}
                            sx={{
                              width: 48,
                              height: 48,
                              border: "2px solid #0B996E",
                            }}
                          />
                          <Stack spacing={0}>
                            <Typography variant="caption" color="text.secondary">
                              {u.studentId ? `ID: ${u.studentId}` : "-"}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      <TableCell>{u.fullname || "-"}</TableCell>
                      <TableCell>{u.email || "-"}</TableCell>
                      <TableCell>{formatDate(u.createdAt)}</TableCell>
                      <TableCell>
                        {formatDateTime(u.lastLogin) !== "-"
                          ? formatDateTime(u.lastLogin)
                          : u.updatedAt
                          ? formatDateTime(u.updatedAt)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={userStatus}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: userStatus === "Active" ? "#0B996E" : "#d32f2f",
                            color: "white",
                            minWidth: "80px"
                          }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                          {/* 🗑️ Delete Button */}
                          <Tooltip title="Delete user">
                            <span>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "#fff",
                                  bgcolor: "#d32f2f",
                                  "&:hover": { bgcolor: "#b71c1c" },
                                }}
                                onClick={() => deleteUser(u._id)}
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <CircularProgress size={18} sx={{ color: "#fff" }} />
                                ) : (
                                  <DeleteIcon fontSize="small" />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>

                          {/* 👁️ View Button */}
                          <Tooltip title="View user details">
                            <IconButton
                              size="small"
                              sx={{
                                color: "#0B996E",
                                bgcolor: "#E6F4F1",
                                "&:hover": { bgcolor: "#b2dfdb" },
                              }}
                              onClick={() => navigate(`/admin/user/${u._id}`)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count}`
          }
          sx={{
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontSize: "0.9rem",
            },
            "& .MuiTablePagination-select": { color: "#0B996E" },
          }}
        />
      </Paper>
    </Box>
  );
}