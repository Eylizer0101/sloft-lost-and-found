// client/src/Components/UserDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  CircularProgress,
  Button,
  Divider,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data?.user || res.data);
      } catch (err) {
        console.error("❌ Failed to fetch user details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress sx={{ color: "#0B996E" }} />
      </Box>
    );

  if (!user)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="text.secondary">
          User not found.
        </Typography>
      </Box>
    );

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "#FF6B6B";
      case "student":
        return "#4ECDC4";
      case "faculty":
        return "#45B7D1";
      default:
        return "#95A5A6";
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: "#F8FAFC",
        minHeight: "100vh",
        ml: "210px",
        background: "linear-gradient(135deg, #F8FAFC 0%, #E6F4F1 100%)",
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #0B996E 0%, #0BAE88 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 32px rgba(11, 153, 110, 0.2)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          },
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            User Profile
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Detailed information about the user
          </Typography>
        </Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.6)",
            textTransform: "none",
            borderRadius: 3,
            px: 3,
            py: 1,
            fontWeight: "bold",
            backdropFilter: "blur(10px)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.2)",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Go Back
        </Button>
      </Paper>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1000, margin: "auto" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          {/* Left Side - Profile Card */}
          <Card
            elevation={6}
            sx={{
              width: { xs: "100%", md: 350 },
              borderRadius: 4,
              overflow: "hidden",
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              border: "1px solid rgba(11, 153, 110, 0.1)",
            }}
          >
            <Box
              sx={{
                height: 120,
                background: "linear-gradient(135deg, #0B996E 0%, #0BAE88 100%)",
                position: "relative",
              }}
            />
            <CardContent sx={{ p: 3, mt: -8, position: "relative" }}>
              <Stack alignItems="center" spacing={2}>
                <Avatar
                  src={user.img}
                  sx={{
                    width: 120,
                    height: 120,
                    border: "4px solid white",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold" color="#2D3748" gutterBottom>
                    {user.fullname || "No Name Provided"}
                  </Typography>
                  <Chip
                    label={user.role?.toUpperCase() || "USER"}
                    sx={{
                      backgroundColor: getRoleColor(user.role),
                      color: "white",
                      fontWeight: "bold",
                      px: 1,
                    }}
                  />
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Quick Info */}
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <BadgeIcon sx={{ color: "#0B996E", fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Student ID:</strong> {user.studentId || "N/A"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <SchoolIcon sx={{ color: "#0B996E", fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Course:</strong> {user.course || "N/A"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <SchoolIcon sx={{ color: "#0B996E", fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Year Level:</strong> {user.yearLevel || "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Right Side - Details Card */}
          <Card
            elevation={4}
            sx={{
              flex: 1,
              borderRadius: 4,
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              border: "1px solid rgba(11, 153, 110, 0.1)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" color="#2D3748" gutterBottom sx={{ mb: 3 }}>
                Personal Information
              </Typography>

              <Stack spacing={3}>
                {/* Contact Information */}
                <Box>
                  <Typography variant="subtitle2" color="#0B996E" fontWeight="bold" gutterBottom>
                    CONTACT INFORMATION
                  </Typography>
                  <Stack spacing={2} sx={{ pl: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <EmailIcon sx={{ color: "#0B996E", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email Address
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user.email || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <PhoneIcon sx={{ color: "#0B996E", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Contact Number
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user.contact || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
                      <HomeIcon sx={{ color: "#0B996E", fontSize: 20, mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Address
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user.address || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                {/* Account Information */}
                <Box>
                  <Typography variant="subtitle2" color="#0B996E" fontWeight="bold" gutterBottom>
                    ACCOUNT INFORMATION
                  </Typography>
                  <Stack spacing={2} sx={{ pl: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <CalendarTodayIcon sx={{ color: "#0B996E", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Date Registered
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <CalendarTodayIcon sx={{ color: "#0B996E", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Last Updated
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {new Date(user.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}