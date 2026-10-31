import {
  Badge,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  School,
} from "@mui/icons-material";
import { InputAdornment, IconButton, MenuItem } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import mini from "../img/mini.png";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Typography,
  Button,
  Stack,
  Divider,
  TextField,
  Paper,
  Box,
  useMediaQuery,
} from "@mui/material";

function Signup() {
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  async function handleSubmit(values) {
    const { fullname, studentId, email, password, course, yearLevel } = values;

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("studentId", studentId);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("course", course);
    formData.append("yearLevel", yearLevel);
    if (image) {
      formData.append("img", image);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/users/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.ok) {
        toast.success("You are now successfully Signed up!", {
          position: "bottom-right",
          autoClose: 800,
          theme: "light",
        });
        navigate("/log-in", { replace: true });
      } else {
        toast.error(response.data.msg || "Something went wrong!", {
          position: "bottom-right",
          autoClose: 1000,
          theme: "light",
        });
      }
    } catch (error) {
      console.log("Error occurred:", error);
      toast.error("Signup failed. Try again!", {
        position: "bottom-right",
        autoClose: 1000,
        theme: "light",
      });
    }
  }

  const SignupSchema = Yup.object().shape({
    fullname: Yup.string()
      .min(6, "Full Name should have at least 6 characters")
      .matches(/^[^0-9]*$/, "Full Name should not contain numbers")
      .required("Full Name is required"),
    studentId: Yup.string()
     .matches(/^\d{2}-\d{4}-\d{5,6}$/, "Please use your PHINMA AU student ID")
      .required("Student ID is required"),
    email: Yup.string()
      .email("Please enter a valid email address")
      .matches(/@phinmaed\.com$/, "Use only your PHINMA AU email")
      .required("Email is required"),
    course: Yup.string().required("Course is required"),
    yearLevel: Yup.string().required("Year Level is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[!@#$%^&*(),.?":{}|<>])/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
  });

  const yearLevels = [
    "1st Year College",
    "2nd Year College",
    "3rd Year College",
    "4th Year College",
  ];

  const courses = [
    "BS Accountancy",
    "BS Business Administration",
    "BS Business Administration (Marketing Management)",
    "BS Business Administration (Banking and Microfinance)",
    "BS Business Administration (Financial Management)",
    "BS Business Administration (Human Resource Management)",
    "BS Entrepreneurship",
    "BS Hospitality Management",
    "BS Tourism Management",
    "BS Criminology",
    "BS Civil Engineering",
    "BS Electrical Engineering",
    "BS Information Technology",
    "BS Information Technology (Business Informatics)",
    "BS Information Technology (System Development)",
    "BS Nursing",
    "BS Pharmacy",
    "BS Medical Laboratory Science",
    "BS Psychology",
    "BSED (Bachelor of Secondary Education)",
    "BSED (Science)",
    "BSED (Mathematics)",
    "BSED (English)",
    "BSED (Filipino)",
    "BA Political Science",
    "BA English Language",
  ];

  return (
    <Stack
     justifyContent="center"
  alignItems="center"
  width="100%"
  height="100vh"
  gap="20px"
  sx={{
    background: "linear-gradient(180deg, #D7FEC8 0%, #ffffffff 100%)",
    minHeight: "100vh",
    overflow: "hidden",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: "75px", // ✅ DAGDAG MO ITO - pwedeng 30px, 50px, 70px depende sa gusto mong ibaba
  }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        mt={3}
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
  alignItems="center"
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
      
        {/* ✅ Signup Form Section */}
        <Paper
  elevation={6}
  sx={{
    width: { xs: "90%", md: "450px" },
    padding: "1.5rem",
    borderRadius: "16px",
    background: "white",
    border: "1px solid #CFEAE2",
    boxShadow: "0px 6px 20px rgba(10, 122, 90, 0.15)",
    maxHeight: "595px", // 🔹 limitahan height
  
  }}
>

          <Formik
            initialValues={{
              fullname: "",
              studentId: "",
              email: "",
              password: "",
              course: "",
              yearLevel: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ values, handleChange, errors, touched }) => (
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
                    Create Your Account
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

                <Box sx={{ mt: 2, width: "100%" }}>
  <TextField
    fullWidth
    type="text"
    name="fullname"
    margin="dense"
    placeholder="Full Name"
    size="small"
    required
    onChange={handleChange}
    value={values.fullname}
    error={touched.fullname && Boolean(errors.fullname)}
    helperText={touched.fullname && errors.fullname}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Badge sx={{ color: "#1E1E1E" }} />
        </InputAdornment>
      ),
    }}
    sx={{
      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
    }}
  />
  <TextField
    fullWidth
    type="text"
    name="studentId"
    margin="dense"
    placeholder="Student ID Number"
    size="small"
    required
    onChange={handleChange}
    value={values.studentId}
    error={touched.studentId && Boolean(errors.studentId)}
    helperText={touched.studentId && errors.studentId}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Badge sx={{ color: "#1E1E1E" }} />
        </InputAdornment>
      ),
    }}
    sx={{
      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
    }}
  />

  {/* ✅ Year Level Dropdown with visible placeholder */}
<TextField
  select
  fullWidth
  name="yearLevel"
  margin="dense"
  size="small"
  required
  onChange={handleChange}
  value={values.yearLevel || ""}
  error={touched.yearLevel && Boolean(errors.yearLevel)}
  helperText={touched.yearLevel && errors.yearLevel}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SchoolIcon sx={{ color: "#1E1E1E" }} />
      </InputAdornment>
    ),
  }}
  sx={{
    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
  }}
  SelectProps={{
    displayEmpty: true,
    renderValue: (selected) => {
      if (!selected) {
        return <span style={{ color: "#9e9e9e" }}>Select Year Level</span>;
      }
      return selected;
    },
  }}
>
  {yearLevels.map((level, index) => (
    <MenuItem key={index} value={level}>
      {level}
    </MenuItem>
  ))}
</TextField>



  {/* ✅ Course Dropdown with visible placeholder */}
<TextField
  select
  fullWidth
  name="course"
  margin="dense"
  size="small"
  required
  onChange={handleChange}
  value={values.course || ""}
  error={touched.course && Boolean(errors.course)}
  helperText={touched.course && errors.course}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <School sx={{ color: "#1E1E1E" }} />
      </InputAdornment>
    ),
  }}
  sx={{
    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
  }}
  SelectProps={{
    displayEmpty: true,
    renderValue: (selected) => {
      if (!selected) {
        return <span style={{ color: "#9e9e9e" }}>Select Course</span>;
      }
      return selected;
    },
  }}
>
  {courses.map((course, index) => (
    <MenuItem key={index} value={course}>
      {course}
    </MenuItem>
  ))}
</TextField>

  <TextField
    fullWidth
    type="email"
    name="email"
    margin="dense"
    placeholder="Email"
    size="small"
    required
    onChange={handleChange}
    value={values.email}
    error={touched.email && Boolean(errors.email)}
    helperText={touched.email && errors.email}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Email sx={{ color: "#1E1E1E" }} />
        </InputAdornment>
      ),
    }}
    sx={{
      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
    }}
  />
  <TextField
    fullWidth
    type={showPassword ? "text" : "password"}
    name="password"
    margin="dense"
    placeholder="Password"
    size="small"
    required
    onChange={handleChange}
    value={values.password}
    error={touched.password && Boolean(errors.password)}
    helperText={touched.password && errors.password}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Lock sx={{ color: "#1E1E1E" }} />
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword((prev) => !prev)}
            edge="end"
          >
            {showPassword ? (
              <VisibilityOff sx={{ color: "#1E1E1E" }} />
            ) : (
              <Visibility sx={{ color: "#1E1E1E" }} />
            )}
          </IconButton>
        </InputAdornment>
      ),
    }}
    sx={{
      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
    }}
  />
</Box>


                  {/* ✅ Submit Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
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
                    Register
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>

         

          <Stack
            justifyContent="center"
            direction="row"
            gap="10px"
            margin="1rem 0"
          >
            <Typography fontSize="15px" color="text.secondary">
              Already have an account?
            </Typography>
            <Typography
              component={Link}
              to="/log-in"
              fontSize="15px"
              sx={{
                color: "#0A7A5A", // Darker shade for better contrast
                fontWeight: "bold",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Login
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
}

export default Signup;