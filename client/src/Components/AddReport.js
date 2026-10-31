// 📄 client/src/Components/AddReport.js
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import React, { useState } from "react";
import axios from "axios";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Grid,
  Button,
  Typography,
  Stack,
  TextField,
  MenuItem,
  FormHelperText,
  FormControl,
  CircularProgress,
  Divider,
  InputLabel,
  Select,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const AddReport = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const usertoken = window.localStorage.getItem("token");

  const getUserId = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return user ? user._id : null;
  };

  const config = { headers: { token: usertoken } };

  const schema = Yup.object().shape({
    name: Yup.string().required("Item name is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    room: Yup.string().required("Room is required"),
    date: Yup.string().required("Date is required"),
    number: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  });

  const handleImageUpload = (e) => {
    setImage(e.target.files);
  };

  const handleSubmit = async (values) => {
    try {
      await schema.validate(values, { abortEarly: false });
    } catch (error) {
      const errorMessages = error.inner.map((err) => err.message);
      toast.error(errorMessages.join("\n"), { position: "bottom-right" });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (image && image.length > 0) {
      for (let i = 0; i < image.length; i++) {
        formData.append("images", image[i]);
      }
    } else {
      formData.append("images", "");
    }

    formData.append("name", values.name);
    formData.append("userId", getUserId());
    formData.append("description", values.description);
    formData.append("type", "Found"); // ✅ AUTO-FOUND
    formData.append("category", values.category);
    formData.append("room", values.room);
    formData.append("date", values.date);
    formData.append("number", values.number);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items/newItem`, formData, {
        ...config,
        headers: { "Content-Type": "multipart/form-data", token: usertoken },
      });
      toast.success("Wohoo 🤩! Item listed successfully.", {
        position: "bottom-right",
        autoClose: 1000,
      });
      setLoading(false);
      window.location.href = "/admin/reports";
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Oops 🙁! Something went wrong.", { position: "bottom-right" });
      setLoading(false);
    }
  };

  // Room options based on your list
  const roomOptions = [
    "Room 101",
    "Room 201",
    "Room 202",
    "Room 203 - CL1",
    "Room 204 - CL2",
    "Room 208",
    "Room 209",
    "Room 301",
    "Room 302",
    "Room 304",
    "Room 305",
    "Room 306",
    "Room 307",
    "Room 308",
    "Room 309",
    "Room 401",
    "Room 402",
    "Room 403",
    "Room 404",
    "Room 405",
    "Room 406 - CL3",
    "Room 407 - CL4",
    "Room 408",
    "Room 409",
    "Library",
    "Canteen",
    "Entrance"
  ];

  return (
    <Box sx={{ p: 3, ml: "210px", minHeight: "100vh" }}>
      {/* Header */}
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#0A7A5A"
        mb={2}
        sx={{ textAlign: "left" }}
      >
        Add Found Item Report
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mb={4}
      >
        Report a found item within PHINMA AU South Campus to help reunite it with its owner.
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <Formik
        initialValues={{
          name: "",
          userId: getUserId(),
          description: "",
          category: "",
          room: "",
          date: "",
          number: "",
        }}
        validationSchema={schema}
        onSubmit={async (values) => {
          await handleSubmit(values);
        }}
      >
        {({ values, handleChange, errors, touched, setFieldValue }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                {/* Upload Section */}
                <Box mb={3}>
                  <Typography variant="h6" fontWeight="bold" color="#0A7A5A" mb={2}>
                    Upload Item Picture (Optional)
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PhotoCamera />}
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        borderColor: "#0A7A5A",
                        color: "#0A7A5A",
                        "&:hover": { 
                          borderColor: "#08684D",
                          backgroundColor: "#E6F4F1"
                        },
                      }}
                    >
                      Choose Files
                      <input
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                        onChange={handleImageUpload}
                      />
                    </Button>
                    {image ? (
                      <Typography variant="body2" color="text.secondary">
                        {image.length} file(s) selected
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No image selected
                      </Typography>
                    )}
                  </Stack>
                </Box>

                {/* Item Name */}
                <Box mb={3}>
                  <TextField
                    required
                    id="name"
                    name="name"
                    label="Item Name"
                    fullWidth
                    variant="outlined"
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Box>

                {/* Description */}
                <Box mb={3}>
                  <TextField
                    label="Description"
                    id="description"
                    name="description"
                    multiline
                    rows={3}
                    required
                    fullWidth
                    variant="outlined"
                    value={values.description}
                    onChange={handleChange}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Box>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6}>
                {/* Room Selector - UPDATED */}
                <Box mb={3}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Location Found</InputLabel>
                    <Select
                      name="room"
                      value={values.room}
                      onChange={handleChange}
                      label="Location Found"
                      error={touched.room && Boolean(errors.room)}
                    >
                      {roomOptions.map((room, index) => (
                        <MenuItem key={index} value={room}>
                          {room}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.room && errors.room && (
                      <FormHelperText error>{errors.room}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                {/* Date Found */}
                <Box mb={3}>
                  <TextField
                    required
                    fullWidth
                    variant="outlined"
                    id="date"
                    name="date"
                    label="Date Found"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={values.date}
                    onChange={handleChange}
                    error={touched.date && Boolean(errors.date)}
                    helperText={touched.date && errors.date}
                  />
                </Box>

                {/* Contact Number */}
                <Box mb={3}>
                  <TextField
                    required
                    fullWidth
                    variant="outlined"
                    id="number"
                    name="number"
                    label="Contact Number"
                    value={values.number}
                    onChange={handleChange}
                    error={touched.number && Boolean(errors.number)}
                    helperText={touched.number && errors.number}
                  />
                </Box>

                {/* Category */}
                <Box mb={3}>
                  <FormControl fullWidth variant="outlined" error={touched.category && Boolean(errors.category)}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      label="Category"
                    >
                      <MenuItem value="Electronics">Electronics</MenuItem>
                      <MenuItem value="Clothes">Clothes</MenuItem>
                      <MenuItem value="Books">Books</MenuItem>
                      <MenuItem value="Accessories">Accessories</MenuItem>
                      <MenuItem value="Documents">Documents</MenuItem>
                      <MenuItem value="Shoes">Shoes</MenuItem>
                      <MenuItem value="Sports">Sports Equipment</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                    {touched.category && errors.category && (
                      <FormHelperText error>{errors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                {/* Submit Button */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        borderRadius: "10px",
                        py: 1.5,
                        px: 4,
                        fontSize: "16px",
                        fontWeight: "bold",
                        textTransform: "none",
                        backgroundColor: "#0A7A5A",
                        "&:hover": { backgroundColor: "#08684D" },
                        minWidth: "200px",
                      }}
                      disabled={loading}
                      startIcon={
                        loading ? <CircularProgress size={20} color="inherit" /> : null
                      }
                    >
                      {loading ? "Submitting..." : "Submit Report"}
                    </Button>
                  </motion.div>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddReport;