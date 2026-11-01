// client/src/Components/Login.js
import { Field, Formik, Form } from 'formik'
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import mini from "../img/mini.png";
import {
  Typography,
  Button,
  Stack,
  Divider,
  TextField,
  Paper,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@mui/material'

import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material'

function Login() {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Remove any plain-text password stored by the previous Remember Me flow.
  useEffect(() => {
    localStorage.removeItem('rememberedPassword');
  }, []);

  const login = async (values) => {
    setLoading(true);
    try {
      const payload = {
        email: values.email,
        password: values.password,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/users/login`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.user) {
        // Remember the email only; never persist the user's plain-text password.
        localStorage.removeItem('rememberedPassword');
        if (values.rememberMe) {
          localStorage.setItem('rememberedEmail', values.email);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberMe');
        }

        toast.success('Logged In Successfully!', {
          position: "bottom-right",
          autoClose: 1000,
        });

        setUserInfo(response.data.user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("userId", response.data.user._id);

        if (response.data.user.role === 'admin') {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/lostitems";
        }
      } else {
        setInfo(response.data);
        setLoading(false);
        toast.error('Oops 🙁! Email or Password is incorrect!', {
          position: "bottom-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      
      toast.error(error.response?.data?.msg || 'Oops 🙁! Server error occurred.', {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // ✅ ADDED: Initialize form with saved values
  const initialValues = {
    email: localStorage.getItem('rememberedEmail') || '',
    password: '',
    rememberMe: localStorage.getItem('rememberMe') === 'true'
  };


  return (
  <Stack
  justifyContent="center"
  alignItems="center"
  width="100%"
  minHeight="100dvh"
  gap="20px"
  sx={{
    background: "linear-gradient(180deg, #D7FEC8 0%, #ffffffff 100%)",
    minHeight: "calc(100dvh - 72px)",
    overflowX: "hidden",
    position: "relative",
    py: { xs: 4, sm: 6, md: 8 },
    px: { xs: 2, sm: 3 },
  }}

    >
      <Stack
        alignItems="center"
        justifyContent="center"
        direction={{ xs: "column", md: "row" }}
        width="100%"
        maxWidth="1200px"
        px={3}
        spacing={5}
      >
        {/* ✅ Illustration Section */}
        <Stack
          width={{ xs: "100%", md: "50%" }}
          display={{ xs: "none", md: "flex" }}
          justifyContent="center"
          alignItems="start"
        >
          <img
            width="95%"
            src={mini}
            alt="mini"
            style={{
              borderRadius: "20px",
            }}
          />
        </Stack>

        {/* ✅ Form container */}
        <Stack width={{ xs: '100%', md: '420px' }}>
          {/* ✅ Signup Form Section */}
          <Paper
            elevation={6}
            sx={{
              width: "100%",
              maxWidth: "450px",
              mx: "auto",
              padding: { xs: "1.25rem", sm: "1.5rem" },
              borderRadius: "16px",
              background: "white",
              border: "1px solid #CFEAE2",
              boxShadow: "0px 6px 20px rgba(10, 122, 90, 0.15)",
              height: "auto", // ✅ CHANGED: from maxHeight to auto
              overflow: "visible", // ✅ CHANGED: from auto to visible
            }}
          >
            <Formik
              initialValues={initialValues} // ✅ CHANGED: Use saved values
              onSubmit={(values) => login(values)}
            >
              {({ values, handleChange }) => (
                <Form>
                  <Stack alignItems="start" gap="15px">
                    <Typography
                      fontSize="28px"
                      variant="h5"
                      fontWeight="bold"
                      color="#0A7A5A" // Darker shade for better contrast
                      textAlign="center"
                      width="100%"
                    >
                      Log In
                    </Typography>
                    <Typography
                      fontSize="14px"
                      color="text.secondary"
                      mb={2}
                      textAlign="center"
                      width="100%"
                    >
                      Please, fill your information below
                    </Typography>

                    {/* Email Field */}
                    <TextField
                      fullWidth
                      required
                      id="email"
                      type="email"
                      name="email"
                      margin="dense"
                      placeholder="Email"
                      size="small"
                      value={values.email}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: "#2E2E2E" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />

                    {/* Password Field */}
                    <TextField
                      fullWidth
                      required
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      margin="dense"
                      placeholder="Password"
                      size="small"
                      value={values.password}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: "#2E2E2E" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff sx={{ color: "#2E2E2E" }} />
                              ) : (
                                <Visibility sx={{ color: "#2E2E2E" }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />

                    <Typography
                      component={Link}
                      to="/forgot-password"
                      fontSize="14px"
                      color="#0A7A5A" // Darker shade for better contrast
                      sx={{
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                        mt: 0,
                        mb: 1,
                      }}
                    >
                      Forgot Password?
                    </Typography>

                    <FormControlLabel
                      control={
                        <Checkbox
                          name="rememberMe"
                          checked={values.rememberMe}
                          onChange={handleChange}
                          sx={{
                            color: "#0A7A5A", // Darker shade for better contrast
                            "&.Mui-checked": { color: "#0A7A5A" }, // Darker shade for better contrast
                          }}
                        />
                      }
                      label="Remember me"
                    />

                    <Button
                      variant="contained"
                      type="submit"
                      disabled={loading}
                      sx={{
                      color: "white",
                      textTransform: "none",
                      width: "140px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      alignSelf: "center",
                      mt: 3,
                      py: 1,
                      borderRadius: "12px",
                      background: "linear-gradient(135deg,#0A7A5A,#0FAE7E)", // Darker shades
                      "&:hover": {
                        background: "linear-gradient(135deg,#08684D,#0D9C73)", // Darker hover
                        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                      },
                    }}
                    >
                      {loading ? (
                        <CircularProgress size={22} color="inherit" />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>

            <Divider sx={{ width: '100%', margin: '2rem 0' }} />
            
            <Stack justifyContent="center" direction="row" gap="10px" mb="1rem">
              <Typography fontSize="15px">Don&apos;t have an account?</Typography>
              <Typography
                component={Link}
                to="/sign-up"
                fontSize="15px"
                fontWeight="bold"
                color="#0A7A5A" // Darker shade for better contrast
                sx={{
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
               Register
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Login;