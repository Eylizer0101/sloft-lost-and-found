import React, { useEffect, useState } from "react"; 
import { motion } from "framer-motion";
import { FcOvertime } from "react-icons/fc";
import { Link } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  TextField,
  MenuItem,
  Paper,
  Box,
  Modal,
  IconButton,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import axios from "axios";
import { setConstraint } from "../constraints";

export default function FoundItems() {
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("user")));
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterRoom, setFilterRoom] = useState("All");

  // 🔹 Comment states
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // 🎨 NEW COLOR PALETTE from UserArchive.js
  const colors = {
    primary: "#0B996E",        // Main green
    primaryDark: "#098562",    // Darker green (hover)
    secondary: "#FF6B6B",      // Status red
    backgroundLight: "#FFF8F8", // Light pink background
    backgroundGradient: "#D7FEC8", // Gradient green
    cardHeader: "#FFEFEF",     // Card header background
    imageBg: "#FFF5F5",        // Image container background
    placeholderBg: "#fef0f0",  // No image placeholder
    chipType: "#FFEFEF",       // Type chip background
    chipCategory: "#E8F6F2",   // Category chip background
    borderLight: "#FFE4E4",    // Card border
    borderMedium: "#FFD6D6",   // Header border
    borderChip: "#BCE6D3",     // Category chip border
    textDark: "#2c2f2eff",     // Dark text
    textLight: "#607d8b",      // Light text
    white: "#FFFFFF",          // White
    black: "#1a1a1a"           // Black
  };

  setConstraint(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:4000/items");
        const allItems = Array.isArray(response.data)
          ? response.data
          : response.data.items;
        setItems(allItems.reverse());
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, [userInfo]);

  // 🔹 Function para sa relative time (just now, 1m, 1h, 1d, 1w, 1month, 1year)
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffMs = now - posted;
    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    const week = Math.floor(day / 7);
    const month = Math.floor(day / 30);
    const year = Math.floor(day / 365);

    if (sec < 60) return "just now";
    if (min < 60) return `${min}m`;
    if (hr < 24) return `${hr}h`;
    if (day < 7) return `${day}d`;
    if (week < 4) return `${week}w`;
    if (month < 12) return `${month}month${month > 1 ? 's' : ''}`;
    return `${year}year${year > 1 ? 's' : ''}`;
  };

  // ✅ FIXED: Date filtering helper function
  const isDateInRange = (itemDate, range) => {
    const now = new Date();
    const item = new Date(itemDate);
    
    // Normalize dates to compare only dates (ignore time)
    const normalizeDate = (date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };
    
    const normalizedItem = normalizeDate(item);
    const normalizedNow = normalizeDate(now);
    
    switch (range) {
      case "today":
        return normalizedItem.getTime() === normalizedNow.getTime();
        
      case "week":
        const startOfWeek = new Date(normalizedNow);
        startOfWeek.setDate(normalizedNow.getDate() - normalizedNow.getDay()); // Start from Sunday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday
        return normalizedItem >= startOfWeek && normalizedItem <= endOfWeek;
        
      case "month":
        return item.getMonth() === now.getMonth() && 
               item.getFullYear() === now.getFullYear();
        
      case "custom":
        if (!customDate) return true;
        const custom = new Date(customDate);
        const normalizedCustom = normalizeDate(custom);
        return normalizedItem.getTime() === normalizedCustom.getTime();
        
      default:
        return true;
    }
  };

  // 🔄 Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterDate("all");
    setCustomDate("");
    setFilterCategory("All");
    setFilterRoom("All");
  };

  // 🔹 Filtering
  useEffect(() => {
    let tempItems = items.filter((item) => item.type === "Found");

    // ✅ DAGDAG: Filter out archived items
    tempItems = tempItems.filter(item => !item.isArchived);

    if (searchTerm) {
      tempItems = tempItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // ✅ FIXED: Date filtering with proper range checking
    if (filterDate !== "all") {
      tempItems = tempItems.filter((item) => 
        isDateInRange(item.createdAt, filterDate)
      );
    }

    if (filterCategory !== "All") {
      tempItems = tempItems.filter(
        (item) =>
          item.category &&
          item.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    if (filterRoom !== "All") {
      tempItems = tempItems.filter(
        (item) =>
          item.room &&
          item.room.toLowerCase() === filterRoom.toLowerCase()
      );
    }

    setFilteredItems(tempItems);
  }, [items, searchTerm, filterDate, customDate, filterCategory, filterRoom]);

  // 🔹 Comment modal functions
  const handleOpenComments = async (item) => {
    setSelectedItem(item);
    setOpenCommentModal(true);
    try {
      const res = await axios.get(`http://localhost:4000/items/${item._id}`);
      setComments(res.data.item?.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:4000/items/${selectedItem._id}/comment`,
        { text: newComment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.ok) {
        setComments(res.data.comments);
        setNewComment("");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // 🔹 Item cards
  const itemCards = filteredItems.map((item) => {
    const isUser = item.userId === userInfo?._id;
    const profilePic = item.userId?.img || "https://i.ibb.co/QP8C4R3/default-avatar.png";

    const studentId = item.userId?.studentId || "Unknown ID";

    // ✅ Mask all digits after last dash (e.g. 01-2024-XXXXX)
    const maskedStudentId = studentId.replace(/(?<=-)\d+$/, (match) =>
      match.replace(/\d/g, "X")
    );

    const commentCount = item.comments?.length || 0;
    const commentLabel =
      commentCount === 0 ? "No comments yet" : commentCount === 1 ? "1 Comment" : `${commentCount} Comments`;

    return (
      <motion.div 
        whileHover={{ scale: [null, 1.03, 1.03] }} 
        transition={{ duration: 0.3 }} 
        key={item._id}
      >
        <Card
          sx={{
            width: "340px",
            height: "495px",
            borderRadius: "20px",
            // 🎨 NEW: Gradient background from UserArchive
            background: "linear-gradient(180deg, #ffffff 0%, #FFF8F8 100%)",
            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
            // 🎨 NEW: Border color from UserArchive
            border: "2px solid #FFE4E4",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0px 12px 35px rgba(0, 0, 0, 0.2)",
              transform: "translateY(-6px)",
              // ✅ INALIS: Green border on hover
            }
          }}
        >
          {/* 🎨 NEW: Card Header with UserArchive style */}
          <Box
            sx={{
              px: 2.5,
              pt: 2,
              pb: 1,
              // 🎨 NEW: Header background from UserArchive
              backgroundColor: colors.cardHeader,
              borderBottom: `1px solid ${colors.borderMedium}`,
            }}
          >
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Avatar
                src={profilePic}
                alt="profile"
                sx={{ 
                  width: 42, 
                  height: 42, 
                  // ✅ INALIS: Green border around avatar
                  border: "2px solid #E5E5E5",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Stack>
                <Typography variant="subtitle2" fontWeight="bold" color={colors.black}>
                  {maskedStudentId}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: colors.primary,
                    fontWeight: "600",
                     background: "#FFF5F5",
                    px: 1,
                    py: 0.3,
                    borderRadius: "8px",
                    display: "inline-block"
                  }}
                >
                  {getTimeAgo(item.createdAt)}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* 🎨 NEW: Image Container with UserArchive style */}
          <Box
            sx={{
              height: "220px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              // 🎨 NEW: Background from UserArchive
              background: colors.imageBg,
            }}
          >
            {item.img && item.img.length > 0 ? (
              <img
                src={
                  Array.isArray(item.img)
                    ? `http://localhost:4000/${item.img[0]}`
                    : `http://localhost:4000/${item.img}`
                }
                alt={item.name}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: "190px",
                  height: "190px",
                  borderRadius: "12px",
                  // 🎨 NEW: No image placeholder from UserArchive
                  backgroundColor: colors.placeholderBg,
                  border: "2px dashed #FFB8B8",
                  color: colors.textLight,
                  textAlign: "center",
                  p: 2,
                }}
              >
                <ImageIcon sx={{ fontSize: 50, color: "#90a4ae" }} />
                <Typography variant="body2" fontWeight="bold">
                  No Image Available
                </Typography>
              </Stack>
            )}
          </Box>

          <CardContent sx={{ p: 2.8 }}>
            <Stack spacing={0.8}>
              <Typography variant="body2" color="text.secondary">
                Item Name: <strong style={{ color: colors.textDark }}>{item.name || "Unnamed Item"}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Description of Item: <strong style={{ color: colors.textDark }}>{item.description || "No description available"}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date Found: <strong style={{ color: colors.textDark }}>{item.date || "N/A"}</strong>
              </Typography>
            </Stack>

            <Stack direction="column" spacing={1} mt={2}>
              <Typography
                variant="body2"
                color={colors.primary}
                align="end"
                sx={{
                  mb: 0.5,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => handleOpenComments(item)}
              >
                {commentLabel}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  component={Link}
                  to={`/${item.name}?cid=${item._id}&type=${item.type}/${isUser}`}
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    width: "100%",
                    borderRadius: "8px",
                    // ✅ BINALIK: Original green button
                    backgroundColor: colors.primary,
                    "&:hover": { backgroundColor: colors.primaryDark },
                  }}
                >
                  View Details
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleOpenComments(item)}
                  sx={{
                    textTransform: "none",
                    width: "100%",
                    borderRadius: "8px",
                    // ✅ BINALIK: Original green outline
                    color: colors.primary,
                    borderColor: colors.primary,
                    "&:hover": {
                      backgroundColor: colors.cardHeader,
                      borderColor: colors.primary,
                    },
                  }}
                >
                  Comment
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    );
  });

  return (
    <>
      {/* 🎨 NEW: Header with UserArchive gradient */}
      <Stack
        direction="row"
        width="100%"
        sx={{
          color: colors.black, 
          // 🎨 NEW: Gradient from UserArchive
          background: "linear-gradient(180deg, #D7FEC8 0%, #ffffffff 100%)",
          py: { xs: 4, md: 6 },
          px: { xs: 3, md: 10 },
          borderBottom: `2px solid ${colors.borderMedium}`,
        }}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Left Text Section */}
        <Stack
          spacing={1}
          justifyContent="center"
          alignItems="flex-start"
          width="100%"
          maxWidth="800px"
        >
          <Typography
            fontSize={{ xs: "24px", sm: "33px", md: "39px" }}
            sx={{
              fontWeight: 700,
              // ✅ BINALIK: Green title
              color: colors.primary,
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
            }}
          >
            Lost & Found Tracking System
          </Typography>

          <Typography
            fontSize={{ xs: "16px", sm: "18px", md: "20px" }}
            sx={{
              color: colors.black,
              maxWidth: "600px",
              fontWeight: 400,
              mt: 1,
            }}
          >
            Here you can find the Found Items and track your missing belongings easily.
          </Typography>
        </Stack>
      </Stack>

      {/* 🎨 NEW: Filters with updated colors */}
      <Paper
        elevation={4}
        sx={{
          mt: 3,
          mx: "auto",
          p: 3,
          borderRadius: "16px",
          maxWidth: "1400px",
          width: "100%",
          backgroundColor: colors.white,
          border: `2px solid ${colors.borderLight}`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
        >
          <TextField
            label="Search Item"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              maxWidth: "550px",
              "& .MuiOutlinedInput-root": { 
                borderRadius: "12px",
                // ✅ BINALIK: Green focus
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
            }}
          />
    
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={2} 
            alignItems="center"
            sx={{ minWidth: { xs: "100%", sm: "auto" } }}
          >
            <TextField
              select
              label="Date"
              size="small"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              sx={{ 
                minWidth: 200,
                "& .MuiOutlinedInput-root": { 
                  // ✅ BINALIK: Green focus
                  "&.Mui-focused fieldset": { borderColor: colors.primary },
                },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="custom">Custom Date</MenuItem>
            </TextField>

            {filterDate === "custom" && (
              <TextField
                type="date"
                size="small"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  minWidth: 200,
                  "& .MuiOutlinedInput-root": { 
                    // ✅ BINALIK: Green focus
                    "&.Mui-focused fieldset": { borderColor: colors.primary },
                  },
                }}
              />
            )}
          </Stack>

          <TextField
            select
            label="Category"
            size="small"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            sx={{ 
              minWidth: 150,
              "& .MuiOutlinedInput-root": { 
                // ✅ BINALIK: Green focus
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Clothes">Clothes</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
            <MenuItem value="Accessories">Accessories</MenuItem>
            <MenuItem value="Documents">Documents</MenuItem>
            <MenuItem value="Shoes">Shoes</MenuItem>
            <MenuItem value="Sports">Sports</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </TextField>

          {/* ✅ BINAGO: Room filter na exact match sa backend */}
          <TextField
            select
            label="Possible Location"
            size="small"
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            sx={{ 
              minWidth: 200,
              "& .MuiOutlinedInput-root": { 
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Room 101">Room 101</MenuItem>
            <MenuItem value="Room 201">Room 201</MenuItem>
            <MenuItem value="Room 202">Room 202</MenuItem>
            <MenuItem value="Room 203 - CL1">Room 203 - CL1</MenuItem>
            <MenuItem value="Room 204 - CL2">Room 204 - CL2</MenuItem>
            <MenuItem value="Room 208">Room 208</MenuItem>
            <MenuItem value="Room 209">Room 209</MenuItem>
            <MenuItem value="Room 301">Room 301</MenuItem>
            <MenuItem value="Room 302">Room 302</MenuItem>
            <MenuItem value="Room 304">Room 304</MenuItem>
            <MenuItem value="Room 305">Room 305</MenuItem>
            <MenuItem value="Room 306">Room 306</MenuItem>
            <MenuItem value="Room 307">Room 307</MenuItem>
            <MenuItem value="Room 308">Room 308</MenuItem>
            <MenuItem value="Room 309">Room 309</MenuItem>
            <MenuItem value="Room 401">Room 401</MenuItem>
            <MenuItem value="Room 402">Room 402</MenuItem>
            <MenuItem value="Room 403">Room 403</MenuItem>
            <MenuItem value="Room 404">Room 404</MenuItem>
            <MenuItem value="Room 405">Room 405</MenuItem>
            <MenuItem value="Room 406 - CL3">Room 406 - CL3</MenuItem>
            <MenuItem value="Room 407 - CL4">Room 407 - CL4</MenuItem>
            <MenuItem value="Room 408">Room 408</MenuItem>
            <MenuItem value="Room 409">Room 409</MenuItem>
            <MenuItem value="Library">Library</MenuItem>
            <MenuItem value="Canteen">Canteen</MenuItem>
            <MenuItem value="Entrance">Entrance</MenuItem>
          </TextField>

          {/* 🔄 Refresh/Reset Button */}
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleResetFilters}
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              // ✅ BINALIK: Green button
              color: colors.primary,
              borderColor: colors.primary,
              fontWeight: "600",
              px: 3,
              "&:hover": {
                backgroundColor: colors.cardHeader,
                borderColor: colors.primary,
              },
            }}
          >
            Reset Filters
          </Button>
        </Stack>
      </Paper>

      {/* Items Grid */}
      <Stack
        pt="20px"
        direction="row"
        justifyContent="center"
        flexWrap="wrap"
        gap="24px"
        maxWidth="1440px"
        mx="auto"
      >
        {itemCards.length > 0 ? (
          itemCards
        ) : (
          <Typography variant="h6" color={colors.black} mt={5}>
            No items found matching your filters.
          </Typography>
        )}
      </Stack>

      {/* Comment Modal */}
      <Modal
        open={openCommentModal}
        onClose={() => setOpenCommentModal(false)}
        aria-labelledby="comment-modal-title"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            backgroundColor: colors.white,
            borderRadius: "16px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
            p: 3,
            // ✅ BINALIK: Green border
            border: `2px solid ${colors.primary}`,
            boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
            // ✅ BINALIK: Green title
            color={colors.primary}
            textAlign="center"
          >
            💬 Comments for {selectedItem?.name}
          </Typography>

          {comments.length > 0 ? (
            comments.map((comment, i) => (
              <Stack
                key={i}
                direction="row"
                alignItems="flex-start"
                spacing={2}
                mb={2}
                sx={{
                  backgroundColor: colors.cardHeader,
                  borderRadius: "12px",
                  p: 1.8,
                  border: `1px solid ${colors.borderMedium}`,
                }}
              >
                <Avatar
                  src={
                    comment.userId?.img ||
                    "https://i.ibb.co/QP8C4R3/default-avatar.png"
                  }
                  sx={{
                    width: 40,
                    height: 40,
                    // ✅ BINALIK: Green border
                    border: `2px solid ${colors.primary}`,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color={colors.black}
                        fontWeight="bold"
                      >
                        {comment.userId?.fullname || "Anonymous"}
                      </Typography>
                      <Typography variant="body2" color={colors.black}>
                        {comment.text}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ 
                        // ✅ BINALIK: Green text
                        color: colors.primary,
                        fontWeight: "600",
                        backgroundColor: colors.cardHeader,
                        px: 1,
                        py: 0.3,
                        borderRadius: "8px",
                        minWidth: "50px",
                        textAlign: "right"
                      }}
                    >
                      {getTimeAgo(comment.createdAt || comment.date || Date.now())}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            ))
          ) : (
            <Typography
              variant="body2"
              color={colors.black}
              align="center"
              mt={2}
            >
              No comments yet.
            </Typography>
          )}

          {/* Input box for new comment */}
          <Stack direction="row" spacing={2} mt={3}>
            <TextField
              fullWidth
              label="Write a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              multiline
              rows={1}
              sx={{
                "& .MuiOutlinedInput-root": { 
                  borderRadius: "12px",
                  // ✅ BINALIK: Green focus
                  "&.Mui-focused fieldset": { borderColor: colors.primary },
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleAddComment}
              sx={{
                // ✅ BINALIK: Green button
                backgroundColor: colors.primary,
                color: colors.white,
                borderRadius: "12px",
                "&:hover": { backgroundColor: colors.primaryDark },
              }}
            >
              <SendIcon />
            </IconButton>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}