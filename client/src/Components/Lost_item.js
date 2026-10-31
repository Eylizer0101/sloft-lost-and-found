import PhotoCamera from '@mui/icons-material/PhotoCamera';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import gpt from '../img/gpt.png';
import {
  Container,
  Paper,
  Grid,
  Button,
  Typography,
  Stack,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  CircularProgress,
  Divider,
  Box,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const LostItem = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [hasAgreed, setHasAgreed] = useState(false);
  const usertoken = window.localStorage.getItem("token");
  const navigate = useNavigate();

  // 🔹 Check if user has agreed to terms
  useEffect(() => {
    const agreementStatus = localStorage.getItem('userAgreementAccepted');
    if (!agreementStatus) {
      // If no agreement found, redirect to home and show toast
      toast.error("Please read and accept the User Agreement first!", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
      navigate('/');
    } else {
      setHasAgreed(true);
    }
  }, [navigate]);

  const getUserId = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return user ? user._id : null;
  };

  const config = { headers: { token: usertoken } };

  const schema = Yup.object().shape({
    name: Yup.string().required("Item name is required"),
    description: Yup.string().required("Description is required"),
    type: Yup.string().required("Item type is required"),
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
    formData.append("type", values.type);
    formData.append("category", values.category);
    formData.append("room", values.room);
    formData.append("date", values.date);
    formData.append("number", values.number);

    try {
      await axios.post("http://localhost:4000/items/newItem", formData, {
        ...config,
        headers: { "Content-Type": "multipart/form-data", token: usertoken },
      });
      toast.success("Wohoo 🤩! Item listed successfully.", {
        position: "bottom-right",
        autoClose: 1000,
      });
      setLoading(false);
      window.location.href = "/mylistings";
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

  // 🔹 If user hasn't agreed, don't show the form
  if (!hasAgreed) {
    return (
      <Stack
        width="100%"
        pt="30px"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: "linear-gradient(180deg, #D7FEC8 0%, #F9FFF5 100%)",
          minHeight: "100vh",
        }}
      >
        <CircularProgress sx={{ color: '#0A7A5A' }} />
        <Typography mt={2} color="#0A7A5A">
          Redirecting...
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      width="100%"
      pt="30px"
      alignItems="center"
      spacing={2}
      sx={{
        background: "linear-gradient(180deg, #D7FEC8 0%, #F9FFF5 100%)",
        minHeight: "100vh",
        pb: 4,
      }}
    >
      {/* Header Section - More Compact */}
      <Stack alignItems="center" spacing={1} mb={2}>
        <Typography
          fontSize="32px"
          fontWeight="800"
          color="#0A7A5A"
          textAlign="center"
        >
          Lost & Found Center
        </Typography>

        <Typography
          fontSize="16px"
          color="#4F4F4F"
          textAlign="center"
          px={2}
          maxWidth="700px"
          lineHeight="1.4"
        >
          Lost something within PHINMA AU South Campus?
          Don't worry — we're here to help you find it!
        </Typography>
      </Stack>

      <Divider sx={{ width: "60%", mb: 3, borderColor: "#B0E8A8" }} />

      {/* Main Content - More Compact Layout */}
      <Stack
        width="100%"
        maxWidth="1200px"
        direction={{ xs: "column", md: "row" }}
        justifyContent="center"
        alignItems="flex-start"
        gap={4}
        px={2}
      >
        {/* Form Section */}
        <Formik
          initialValues={{
            name: "",
            userId: getUserId(),
            description: "",
            type: "",
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
            <Container component="main" maxWidth="sm" sx={{ p: 0 }}>
              <Paper
                elevation={8}
                sx={{
                  borderRadius: "16px",
                  p: { xs: 3, md: 4 },
                  background: "#FFFFFF",
                  boxShadow: "0 8px 20px rgba(10, 122, 90, 0.15)",
                  border: "2px solid #B0E8A8",
                }}
              >
                <Form>
                  <Grid container spacing={2}>
                    {/* Upload Section - More Compact */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight="600" mb={1} color="#0A7A5A">
                        Upload Item Picture (Optional)
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Button
                          variant="contained"
                          component="label"
                          endIcon={<PhotoCamera />}
                          sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            px: 2,
                            py: 1,
                            fontSize: "14px",
                            background: "linear-gradient(90deg, #0A7A5A, #08684D)",
                            '&:hover': { background: "linear-gradient(90deg, #08684D, #0A7A5A)" },
                          }}
                        >
                          Upload
                          <input
                            hidden
                            accept="image/*"
                            multiple
                            type="file"
                            onChange={handleImageUpload}
                          />
                        </Button>
                        <Typography fontSize="13px" color="#666">
                          {image ? `${image.length} file(s) selected` : "No image selected"}
                        </Typography>
                      </Stack>
                    </Grid>

                    {/* Item Name */}
                    <Grid item xs={12}>
                      <TextField
                        required
                        name="name"
                        label="Item Name"
                        size="small"
                        fullWidth
                        value={values.name}
                        onChange={handleChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            '& fieldset': { borderColor: '#B0E8A8' },
                            '&:hover fieldset': { borderColor: '#0A7A5A' },
                            '&.Mui-focused fieldset': { borderColor: '#0A7A5A' },
                          },
                        }}
                      />
                    </Grid>

                    {/* Description - Smaller */}
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        name="description"
                        multiline
                        rows={2}
                        size="small"
                        required
                        fullWidth
                        value={values.description}
                        onChange={handleChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            '& fieldset': { borderColor: '#B0E8A8' },
                            '&:hover fieldset': { borderColor: '#0A7A5A' },
                            '&.Mui-focused fieldset': { borderColor: '#0A7A5A' },
                          },
                        }}
                      />
                    </Grid>

                    {/* Room Selector - UPDATED */}
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Room</InputLabel>
                        <Select
                          name="room"
                          value={values.room}
                          onChange={handleChange}
                          label="Room"
                          sx={{
                            borderRadius: '8px',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#B0E8A8' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0A7A5A' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0A7A5A' },
                          }}
                        >
                          {roomOptions.map((room, index) => (
                            <MenuItem key={index} value={room}>
                              {room}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>Select where you lost/found the item</FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Date and Contact - Side by Side */}
                    <Grid item xs={12} container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          required
                          name="date"
                          label="Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          size="small"
                          fullWidth
                          value={values.date}
                          onChange={handleChange}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              '& fieldset': { borderColor: '#B0E8A8' },
                              '&:hover fieldset': { borderColor: '#0A7A5A' },
                              '&.Mui-focused fieldset': { borderColor: '#0A7A5A' },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          required
                          name="number"
                          label="Contact Number"
                          size="small"
                          fullWidth
                          value={values.number}
                          onChange={handleChange}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              '& fieldset': { borderColor: '#B0E8A8' },
                              '&:hover fieldset': { borderColor: '#0A7A5A' },
                              '&.Mui-focused fieldset': { borderColor: '#0A7A5A' },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Item Type and Category - Side by Side */}
                    <Grid item xs={12} container spacing={2}>
                      <Grid item xs={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Item Type</InputLabel>
                          <Select
                            name="type"
                            value={values.type}
                            onChange={handleChange}
                            label="Item Type"
                            sx={{
                              borderRadius: '8px',
                              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#B0E8A8' },
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0A7A5A' },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0A7A5A' },
                            }}
                          >
                            <MenuItem value="Lost">Lost Item</MenuItem>
                            <MenuItem value="Found">Found Item</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Category</InputLabel>
                          <Select
                            name="category"
                            value={values.category}
                            onChange={handleChange}
                            label="Category"
                            sx={{
                              borderRadius: '8px',
                              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#B0E8A8' },
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0A7A5A' },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0A7A5A' },
                            }}
                          >
                           <MenuItem value="Electronics">Electronics (Phone, Laptop, Headphones)</MenuItem>
                                                     <MenuItem value="Clothes">Clothes (T-shirt, Jacket, Pants, Dress)</MenuItem>
                                                     <MenuItem value="Books">Books (Notebook, Novel, Textbook)</MenuItem>
                                                     <MenuItem value="Accessories">Accessories (Watch, Bag, Wallet, Jewelry)</MenuItem>
                                                     <MenuItem value="Documents">Documents (ID, Passport, Papers)</MenuItem>
                                                     <MenuItem value="Shoes">Shoes (Sneakers, Sandals, Formal)</MenuItem>
                                                     <MenuItem value="Sports">Sports Equipment (Ball, Racket, Gloves)</MenuItem>
                                                     <MenuItem value="Others">Others (Miscellaneous)</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12} mt={2}>
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          sx={{
                            borderRadius: "10px",
                            py: 1.5,
                            fontSize: "16px",
                            fontWeight: "600",
                            textTransform: "none",
                            background: "linear-gradient(90deg, #0A7A5A, #08684D)",
                            '&:hover': {
                              background: "linear-gradient(90deg, #075A45, #08684D)",
                            },
                          }}
                          disabled={loading}
                          startIcon={
                            loading ? <CircularProgress size={18} color="inherit" /> : null
                          }
                        >
                          {loading ? "Posting..." : "Submit Item"}
                        </Button>
                      </motion.div>
                    </Grid>
                  </Grid>
                </Form>
              </Paper>
            </Container>
          )}
        </Formik>

        {/* Image Section - More Compact */}
        <Stack
          sx={{ display: { xs: "none", md: "flex" } }}
          width="50%"
          justifyContent="center"
          alignItems="center"
           height= "auto"
        >
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              marginTop: 15,
            }}
          >
            <img
              src={gpt}
              alt="list-item"
              style={{ 
                maxWidth: "100%", 
                height: "auto", 
                borderRadius: "8px",
                display: "block"
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LostItem;