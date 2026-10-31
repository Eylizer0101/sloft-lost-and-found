// CLIENT/src/pages/AdminClaimNotifications.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh"; // ✅ ADDED REFRESH ICON
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminClaimNotifications() {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Filter states
  const [statusFilter, setStatusFilter] = useState("Pending"); // ✅ DEFAULT TO PENDING
  const [courseFilter, setCourseFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch all claim notifications
  const fetchClaims = async () => {
    try {
      const res = await axios.get("http://localhost:4000/claims", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.ok && res.data.claims) {
        // ✅ ADD DEBUGGING HERE
        console.log("📊 ALL CLAIMS DATA:", res.data.claims);
        console.log("🔍 CHECKING COURSE DATA:");
        
        res.data.claims.forEach((claim, index) => {
          console.log(`Claim ${index + 1}:`, {
            id: claim._id,
            directCourse: claim.course,
            userCourse: claim.userId?.course,
            studentId: claim.userId?.studentId,
            fullname: claim.userId?.fullname
          });
        });

        setClaims(res.data.claims);
        
        // ✅ AUTO-FILTER TO PENDING ON INITIAL LOAD
        const pendingOnly = res.data.claims.filter(claim => claim.status === "Pending");
        setFilteredClaims(pendingOnly);
      } else {
        setClaims([]);
        setFilteredClaims([]);
      }
    } catch (error) {
      console.error("Error fetching claim notifications:", error);
      toast.error("Failed to fetch claim notifications ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // ✅ Refresh filters function - RESET TO PENDING ONLY
  const refreshFilters = () => {
    setStatusFilter("Pending"); // ✅ DEFAULT TO PENDING
    setCourseFilter("All");
    setSearchTerm("");
    
    // ✅ AUTO-APPLY PENDING FILTER
    const pendingOnly = claims.filter(claim => claim.status === "Pending");
    setFilteredClaims(pendingOnly);
  };

  // ✅ Apply filters
  useEffect(() => {
    let filtered = claims;

    // Status filter - DEFAULT SHOW ONLY PENDING
    if (statusFilter !== "All") {
      filtered = filtered.filter(claim => claim.status === statusFilter);
    } else {
      // ✅ IF "All" IS SELECTED, STILL SHOW ONLY PENDING BY DEFAULT
      filtered = filtered.filter(claim => claim.status === "Pending");
    }

    // Course filter - TRY BOTH FIELDS
    if (courseFilter !== "All") {
      filtered = filtered.filter(claim => {
        const course = claim.course || claim.userId?.course;
        return course?.toLowerCase().includes(courseFilter.toLowerCase());
      });
    }

    // Search filter - TRY BOTH FIELDS
    if (searchTerm) {
      filtered = filtered.filter(claim =>
        claim.userId?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.userId?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.itemId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (claim.course || claim.userId?.course)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredClaims(filtered);
  }, [claims, statusFilter, courseFilter, searchTerm]);

  // ✅ Get unique courses for filter dropdown - TRY BOTH FIELDS
  const getUniqueCourses = () => {
    const courses = claims.map(claim => claim.course || claim.userId?.course).filter(Boolean);
    return [...new Set(courses)];
  };

  const uniqueCourses = getUniqueCourses();

  // ✅ Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Claimed": return "#0B996E";
      case "Pending": return "#B68D00";
      case "Rejected": return "#d32f2f";
      default: return "#000";
    }
  };

  // ✅ Get course for display - TRY BOTH FIELDS
  const getDisplayCourse = (claim) => {
    return claim.course || claim.userId?.course || "N/A";
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress sx={{ color: "#0B996E" }} />
      </Box>
    );

  return (
   <Box sx={{ p: 3 }}>
  {/* ✅ Title on the LEFT side */}
  <Typography
    variant="h5"
    fontWeight="bold"
    color="#0B996E"
    mb={2}
    sx={{ 
      textAlign: "left", // ✅ Sa left side
      marginLeft: "210px" // ✅ Same alignment with table
    }}
  >
    Claim Notifications
  </Typography>


      {/* ✅ FILTER SECTION */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          backgroundColor: "#F9FDFC",
           ml: "210px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <FilterListIcon sx={{ color: "#0B996E" }} />
          
          {/* Search Filter */}
          <TextField
            size="small"
            placeholder="Search by name, student ID, item, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 750 }}
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

          {/* ✅ REFRESH BUTTON */}
          <IconButton
            sx={{
              color: "#0B996E",
              border: "1px solid #0B996E",
              "&:hover": { 
                backgroundColor: "#E6F4F1",
                color: "#098562" 
              },
            }}
            onClick={refreshFilters}
            title="Reset all filters"
          >
            <RefreshIcon />
          </IconButton>

          {/* Results Count */}
          <Chip 
            label={`${filteredClaims.length} results`}
            variant="outlined"
            sx={{ color: "#0B996E", borderColor: "#0B996E" }}
          />
        </Box>
      </Paper>

      {/* ✅ MAIN TABLE - NOW SHOWING ONLY PENDING BY DEFAULT */}
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
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E", width: "70px" }}>
                #
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>
                Student ID
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>
                Full Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>
                Course
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>
                Item Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0B996E" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredClaims.length > 0 ? (
              filteredClaims.map((claim, index) => (
                <TableRow
                  key={claim._id}
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
                  <TableCell>{claim.userId?.studentId || "N/A"}</TableCell>
                  <TableCell>{claim.userId?.fullname || "N/A"}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getDisplayCourse(claim)}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderColor: "#0B996E", 
                        color: "#0B996E",
                        backgroundColor: "#F0F5FF"
                      }}
                    />
                  </TableCell>
                  <TableCell>{claim.itemId?.name || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(claim.createdAt).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={claim.status}
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: getStatusColor(claim.status),
                        color: "white",
                        minWidth: "80px"
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center">
                      <IconButton
                        sx={{
                          color: "#0B996E",
                          "&:hover": { 
                            backgroundColor: "#E6F4F1",
                            color: "#098562" 
                          },
                        }}
                        onClick={() =>
                          navigate(`/admin/claim/${claim._id}`, {
                            state: { claim },
                          })
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No pending claim notifications found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default AdminClaimNotifications;