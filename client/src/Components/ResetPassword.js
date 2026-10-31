import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword)
      return Swal.fire("Error", "Fill all fields", "error");
    if (password !== confirmPassword)
      return Swal.fire("Error", "Passwords do not match", "error");

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/reset-password/${token}`,
        { password }
      );
      if (res.data.ok) {
        Swal.fire("Success", res.data.msg, "success");
        navigate("/log-in");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.msg || "Server error", "error");
    }
    setLoading(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundColor: "#F4F9F8",
      }}
    >
      <Paper
        elevation={4}
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
          mb={1}
          align="center"
          fontWeight="bold"
          sx={{ color: "#0B996E", letterSpacing: 0.8 }}
        >
          Reset Password
        </Typography>

        <Typography
          align="center"
          variant="body2"
          sx={{ color: "text.secondary", mb: 3 }}
        >
          Please enter your new password below.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Enter new password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
            placeholder="Confirm new password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
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
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.3,
              fontWeight: "bold",
              borderRadius: "10px",
              fontSize: "0.95rem",
              bgcolor: "#0B996E",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#09785A",
                transform: "translateY(-2px)",
                transition: "0.3s",
              },
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
