// CLIENT/src/Components/VerifyEmail.js
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get email passed from Signup (via navigate state)
  const emailFromSignup = location.state?.email || "";
  const [email, setEmail] = useState(emailFromSignup);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async () => {
    if (!email || !otp) {
      Swal.fire("Missing Info", "Please enter your email and OTP code.", "warning");
      return;
    }

    setLoading(true);
    try {
      // ✅ FIXED: Removed /api from URL to match backend route
      const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/users/verify-otp`, {
        email: email.trim(),
        otp: String(otp).trim(), // ✅ force as string
      });

      if (res.data.ok) {
        Swal.fire({
          icon: "success",
          title: "Verified!",
          text: res.data.msg,
        }).then(() => navigate("/log-in"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.data.msg,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Verification failed",
        text: err.response?.data?.msg || "Server error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      Swal.fire("Email Required", "Please enter your email address.", "warning");
      return;
    }

    setResendLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/users/resend-otp`, {
        email: email.trim(),
      });

      if (res.data.ok) {
        Swal.fire({
          icon: "success",
          title: "OTP Resent!",
          text: res.data.msg,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.data.msg,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to resend OTP",
        text: err.response?.data?.msg || "Server error. Please try again.",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "100vh",
        backgroundColor: "#F4F9F8", // soft mint background
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: 400,
          borderRadius: "16px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          mb={1.5}
          sx={{ color: "#0B996E", letterSpacing: 0.8 }}
        >
          Verify Your Email
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          mb={3}
          sx={{ color: "text.secondary" }}
        >
          Please enter the 6-digit code sent to your email address.
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!!emailFromSignup}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                "& fieldset": { borderColor: "#B0DCD1" },
                "&:hover fieldset": { borderColor: "#0B996E" },
                "&.Mui-focused fieldset": { borderColor: "#0B996E" },
              },
            }}
          />

          <TextField
            label="6-Digit OTP"
            variant="outlined"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputProps={{ maxLength: 6 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                "& fieldset": { borderColor: "#B0DCD1" },
                "&:hover fieldset": { borderColor: "#0B996E" },
                "&.Mui-focused fieldset": { borderColor: "#0B996E" },
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleVerify}
            disabled={loading}
            sx={{
              py: 1.4,
              fontWeight: "bold",
              borderRadius: "10px",
              fontSize: "0.95rem",
              textTransform: "none",
              bgcolor: "#0B996E",
              "&:hover": {
                bgcolor: "#09785A",
                transform: "translateY(-2px)",
                transition: "0.3s",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
              "Verify Email"
            )}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleResendOtp}
            disabled={resendLoading}
            sx={{
              py: 1.2,
              fontWeight: "bold",
              borderRadius: "10px",
              fontSize: "0.95rem",
              textTransform: "none",
              color: "#0B996E",
              borderColor: "#0B996E",
              "&:hover": {
                bgcolor: "#F0F9F6",
                borderColor: "#09785A",
                transform: "translateY(-2px)",
                transition: "0.3s",
              },
            }}
          >
            {resendLoading ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
              "Resend OTP Code"
            )}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default VerifyEmail;