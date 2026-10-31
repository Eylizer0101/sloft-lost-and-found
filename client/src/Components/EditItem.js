// client/src/Components/EditItem.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Stack,
  MenuItem,
  Grid,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Axios from "axios";
import Swal from "sweetalert2";

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Found",
    category: "Others",
    room: "",
    date: "",
    number: "",
 
  });

  const [images, setImages] = useState([]);

  const categories = [
    "Electronics",
    "Clothes",
    "Books",
    "Accessories",
    "Documents",
    "Shoes",
    "Sports",
    "Others",
  ];

  const rooms = [
    "Room 1", "Room 2", "Room 3", "Room 4", "Room 5",
    "Room 6", "Room 7", "Room 8", "Room 9", "Room 10",
    "Room 11", "Room 12", "Room 13", "Room 14", "Room 15",
    "Room 16", "Room 17", "Room 18", "Room 19", "Room 20",
    "Room 21", "Room 22", "Room 23", "Room 24", "Room 25",
    "Laboratory", "Library", "Canteen", "Entrance",
  ];

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items/${id}`)
      .then((res) => {
        const item = res.data.item;
        setFormData({
          name: item.name,
          description: item.description,
          type: item.type || "Found",
          category: item.category || "Others",
          room: item.room || "",
          date: item.date || "",
          number: item.number || "",
        });
      })
      .catch((err) => console.log("Error fetching item:", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }
    }

    Axios.put(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items/update/${id}`, data, {
      headers: {
        token: token,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Item Updated Successfully!",
          text: "Your item details have been updated.",
          showConfirmButton: false,
          timer: 1800,
          position: "bottom-end",
          toast: true,
          background: "#D7FEC8",
          color: "#0B996E",
          width: "400px",
        });
        setTimeout(() => navigate("/mylistings"), 2000);
      })
      .catch((err) => {
        console.log("Error updating item:", err);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "There was a problem updating your item.",
          confirmButtonColor: "#0B996E",
        });
      });
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={3}
      sx={{
        background: "linear-gradient(180deg, #D7FEC8 0%, #F9FFF5 100%)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 850,
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          p: 5,
          boxShadow: "0px 5px 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/mylistings")}
          variant="contained"
          sx={{
            backgroundColor: "#0B996E",
            "&:hover": { backgroundColor: "#098562" },
            borderRadius: "10px",
            textTransform: "none",
            px: 3,
            py: 0.8,
            fontWeight: "bold",
            mb: 3,
          }}
        >
          Back
        </Button>

        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          sx={{ color: "#0B996E" }}
        >
          Edit Lost Item
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Item Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Item Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                required
              >
                {categories.map((cat, idx) => (
                  <MenuItem key={idx} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Room */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Room"
                name="room"
                value={formData.room}
                onChange={handleChange}
                fullWidth
                required
              >
                {rooms.map((room, idx) => (
                  <MenuItem key={idx} value={room}>
                    {room}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Type"
                name="type"
                value={formData.type}
                fullWidth
                disabled
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f5f5f5",
                  },
                }}
              />
            </Grid>

            {/* Date Lost */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date Lost"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Contact Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact Number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

           

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                required
              />
            </Grid>

            {/* Upload Button */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: "#0B996E",
                  color: "#0B996E",
                  fontWeight: "600",
                  borderRadius: "10px",
                  "&:hover": { backgroundColor: "#D7FEC8" },
                }}
              >
                Upload New Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Stack alignItems="center">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "50%",
                    background: "linear-gradient(90deg, #0B996E, #098F67)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #098F67, #087B58)",
                    },
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "16px",
                    borderRadius: "12px",
                    py: 1.5,
                    boxShadow: "0px 4px 10px rgba(11,153,110,0.3)",
                  }}
                >
                  Save Changes
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Stack>
  );
}