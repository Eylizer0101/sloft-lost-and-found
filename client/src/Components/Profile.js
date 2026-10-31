import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Stack,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  InputAdornment,
  Grid,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    studentId: "",
    contact: "",
    course: "",
    yearLevel: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);

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

  const fetchUserProfile = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        setFormData({
          fullname: response.data.fullname || "",
          email: response.data.email || "",
          studentId: response.data.studentId || "",
          contact: response.data.contact || "",
          course: response.data.course || "",
          yearLevel: response.data.yearLevel || "",
          address: response.data.address || "",
        });
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        fullname: storedUser.fullname || "",
        email: storedUser.email || "",
        studentId: storedUser.studentId || "",
        contact: storedUser.contact || "",
        course: storedUser.course || "",
        yearLevel: storedUser.yearLevel || "",
        address: storedUser.address || "",
      });
      fetchUserProfile(storedUser._id);
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    if (!user?._id) {
      toast.error("No user found!");
      return;
    }

    const form = new FormData();
    for (const key in formData) form.append(key, formData[key]);
    if (image) form.append("img", image);

    try {
      const response = await axios.put(
        `http://localhost:4000/users/update/${user._id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.ok) {
        toast.success("Profile updated successfully!", {
          position: "bottom-right",
          autoClose: 800,
        });
        localStorage.setItem("user", JSON.stringify(response.data.userUpdated));
        setUser(response.data.userUpdated);
        setIsEditing(false);
      } else {
        toast.error(response.data.msg || "Update failed!");
      }
    } catch (error) {
      console.log("Error updating user:", error);
      toast.error("Something went wrong!");
    }
  };

  if (!user) return <Typography>Loading profile...</Typography>;

  return (
    <Box
      sx={{
        width: "90%",
        maxWidth: "1100px",
        mx: "auto",
        mt: 6,
      }}
    >
      {/* Header Section */}
      <Grid container alignItems="center" spacing={3} mb={5}>
        <Grid item xs={12} sm={8} display="flex" alignItems="center">
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              src={image ? URL.createObjectURL(image) : user.img}
              sx={{
                width: 120,
                height: 120,
                mr: 3,
                border: "3px solid #0B996E",
                boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
              }}
            />
            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  id="upload-avatar"
                  style={{ display: "none" }}
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <label htmlFor="upload-avatar">
                  <IconButton
                    component="span"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 15,
                      backgroundColor: "#0B996E",
                      color: "white",
                      "&:hover": { backgroundColor: "#097A5A" },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </label>
              </>
            )}
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#1C1C1C", mb: 0.5 }}
            >
              {user.fullname}
            </Typography>
            <Typography variant="body1" sx={{ color: "#555" }}>
              {user.email}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4} textAlign="right">
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing((prev) => !prev)}
            sx={{
              backgroundColor: "#0B996E",
              textTransform: "none",
              px: 4,
              py: 1.2,
              fontSize: "16px",
              "&:hover": { backgroundColor: "#097A5A" },
            }}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </Grid>
      </Grid>

      {/* Profile Fields */}
      <Grid container spacing={3}>
        {/* Full Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon sx={{ color: "#0B996E" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": { height: 60, fontSize: "16px" },
              "& .MuiInputLabel-root": { fontSize: "16px" },
            }}
          />
        </Grid>

        {/* Student ID (read-only) */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Student ID *"
            name="studentId"
            value={formData.studentId}
            fullWidth
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon sx={{ color: "#0B996E" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": { height: 60, fontSize: "16px" },
              "& .MuiInputLabel-root": { fontSize: "16px" },
            }}
          />
        </Grid>

        {/* Contact (editable) */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact Number"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon sx={{ color: "#0B996E" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": { height: 60, fontSize: "16px" },
              "& .MuiInputLabel-root": { fontSize: "16px" },
            }}
          />
        </Grid>

        {/* Address (editable) */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon sx={{ color: "#0B996E" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": { height: 60, fontSize: "16px" },
              "& .MuiInputLabel-root": { fontSize: "16px" },
            }}
          />
        </Grid>

        {/* Year Level (editable) */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Year Level *"
            name="yearLevel"
            select
            value={formData.yearLevel}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            sx={{
              "& .MuiInputBase-root": { height: 60, fontSize: "16px" },
              "& .MuiInputLabel-root": { fontSize: "16px" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon sx={{ color: "#0B996E" }} />
                </InputAdornment>
              ),
            }}
          >
            {yearLevels.map((lvl, idx) => (
              <MenuItem key={idx} value={lvl}>
                {lvl}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Course (read-only) */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Course *"
            name="course"
            value={formData.course}
            fullWidth
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon sx={{ color: "#0B996E" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": { height: 60, fontSize: "16px" },
              "& .MuiInputLabel-root": { fontSize: "16px" },
            }}
          />
        </Grid>

        {/* Email (read-only) */}
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            fullWidth
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#0B996E" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": { height: 60, fontSize: "16px" },
              "& .MuiInputLabel-root": { fontSize: "16px" },
            }}
          />
        </Grid>
      </Grid>

      {isEditing && (
        <Box textAlign="right" mt={4}>
          <Button
            variant="contained"
            onClick={handleUpdate}
            sx={{
              backgroundColor: "#0B996E",
              textTransform: "none",
              px: 5,
              py: 1.5,
              fontSize: "16px",
              "&:hover": { backgroundColor: "#097A5A" },
            }}
          >
            Save Changes
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Profile;
