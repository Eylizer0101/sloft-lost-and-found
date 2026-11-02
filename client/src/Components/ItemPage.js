import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import SendIcon from "@mui/icons-material/Send";

// MUI Components
import {
  Modal,
  Button,
  Typography,
  Avatar,
  Stack,
  TextField,
  Paper,
  Divider,
  Box,
  IconButton,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import { MdDateRange } from "react-icons/md";
import { GrMap } from "react-icons/gr";
import { FaBook, FaGraduationCap, FaPhoneAlt } from "react-icons/fa";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Carousel
import { Carousel } from "react-carousel-minimal";

// Custom constraint
import { setConstraint } from "../constraints";

function ItemPage() {
  const [item, setItem] = useState(null);
  const [slidesData, setSlidesData] = useState([]);
  const slides = useMemo(() => slidesData, [slidesData]);
  const [showDelete, setShowDelete] = useState(false);
  const [comments, setComments] = useState([]);
  const [showCommentProfile, setShowCommentProfile] = useState(false);
  const [commentUser, setCommentUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Helper function to show relative time
  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000); // difference in seconds

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 31536000) return `${Math.floor(diff / 86400)}d`;
    return `${Math.floor(diff / 31536000)}y`;
  };

  const handleBack = () => {
    if (item?.type === "Lost") {
      navigate("/lostitems");
    } else if (item?.type === "Found") {
      navigate("/founditems");
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    setConstraint(true);
  }, []);

  const queryParams = new URLSearchParams(window.location.search);
  const item_id = queryParams.get("cid");
  const current_user = queryParams.get("type")?.split("/")[1];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items/${item_id}`)
      .then((res) => {
        const data = res.data.item;
        const imgs = (Array.isArray(data.img) ? data.img : data.img ? [data.img] : [])
          .filter(Boolean)
          .map((img) => ({
            image: /^https?:\/\//i.test(img)
              ? img
              : `${(process.env.REACT_APP_API_URL || "http://localhost:4000").replace(/\/$/, "")}/${img.replace(/^\/+/, "")}`,
          }));
        setSlidesData(imgs);
        setItem(data);
        setComments(data.comments || []);
      })
      .catch((err) => {
        console.log("Error fetching item:", err);
      });
  }, [item_id]);

  const delete_item = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items/delete/${item_id}`)
      .then(() => {
        handleCloseDelete();
        toast.success("Item deleted successfully 🗑️", {
          position: "bottom-right",
          autoClose: 1000,
        });
        window.location.href = "/mylistings";
      })
      .catch((err) => {
        console.log("Error deleting item:", err);
      });
  };

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleOpenCommentProfile = (user) => {
    setCommentUser(user);
    setShowCommentProfile(true);
  };
  const handleCloseCommentProfile = () => {
    setCommentUser(null);
    setShowCommentProfile(false);
  };

  const ItemHeader = () => (
    <Box sx={{ width: "100%", py: 2, px: 3, borderBottom: "1px solid #e0e0e0" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        variant="outlined"
        sx={{
          color: "#0B996E",
          borderColor: "#0B996E",
          textTransform: "none",
          borderRadius: "6px",
          mb: 2,
          '&:hover': {
            backgroundColor: '#f5f5f5',
            borderColor: '#0B996E',
          }
        }}
      >
        Back
      </Button>
     
    </Box>
  );

  const CommentsSection = React.memo(({ item_id, comments, setComments }) => {
    const [newComment, setNewComment] = useState("");

    const handleAddComment = async () => {
      if (!newComment.trim()) return;
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items/${item_id}/comment`,
          { text: newComment },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (res.data.ok) {
          setComments(res.data.comments);
          setNewComment("");
          toast.success("Comment added!", {
            position: "bottom-right",
            autoClose: 800,
          });
        }
      } catch (err) {
        console.log("Error adding comment:", err);
        toast.error("Failed to add comment!", {
          position: "bottom-right",
          autoClose: 1000,
        });
      }
    };

    return (
      <Box sx={{ width: "100%", mt: 4 }}>
        {item?.type === "Found" && (
         <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
  <Button
    variant="contained"
    sx={{
      textTransform: "none",
      borderRadius: "6px",
      width: "20%",
      backgroundColor: "#0B996E",
      textAlign: "center",
      py: 1.5,
      fontWeight: "bold",
      "&:hover": { backgroundColor: "#098562" },
    }}
    onClick={async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/claims/create`,
          { itemId: item._id },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        if (res.data.ok) {
          toast.success("Claim request sent to admin", {
            position: "bottom-right",
            autoClose: 1500,
          });
        } else {
          toast.info(res.data.msg || "Request already sent or pending.", {
            position: "bottom-right",
            autoClose: 1500,
          });
        }
      } catch (err) {
        console.error("Error sending claim request:", err);
        toast.error("Failed to send claim request ❌", {
          position: "bottom-right",
          autoClose: 1500,
        });
      }
    }}
  >
  Claim
  </Button>
</Box>

        )}
 <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="#0B996E" gutterBottom>
            Comments
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              size="small"
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: "6px",
                "& .MuiInputBase-input": { fontSize: "14px" },
              }}
              autoComplete="off"
            />
            <IconButton
              onClick={handleAddComment}
              sx={{
                backgroundColor: "#0B996E",
                color: "#fff",
                borderRadius: "6px",
                "&:hover": { backgroundColor: "#098562" },
              }}
            >
              <SendIcon />
            </IconButton>
          </Stack>

          <Box
            sx={{
              maxHeight: "300px",
              overflowY: "auto",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              p: 2,
              backgroundColor: "#fafafa",
            }}
          >
            {comments.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{ fontStyle: "italic", textAlign: "center", py: 4 }}
              >
                No comments yet...
              </Typography>
            ) : (
              comments.map((c) => (
                <Box
                  key={c._id}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: "6px",
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar
                      src={c.userId?.img}
                      sx={{
                        width: 40,
                        height: 40,
                        cursor: "pointer",
                        border: "2px solid #0B996E",
                      }}
                      onClick={() => handleOpenCommentProfile(c.userId)}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          fontWeight="bold"
                          sx={{
                            cursor: "pointer",
                            color: "#0B996E",
                            fontSize: "14px",
                          }}
                          onClick={() => handleOpenCommentProfile(c.userId)}
                        >
                          {c.userId?.fullname}
                        </Typography>
                        <Typography fontSize="12px" sx={{ color: "#777" }}>
                          {timeAgo(c.date)}
                        </Typography>
                      </Stack>
                      <Typography
                        fontSize="14px"
                        sx={{
                          color: "#333",
                          mt: 0.5,
                          lineHeight: 1.4,
                        }}
                      >
                        {c.text}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>
    );
  });

  const ItemDetails = () => (
    <Box sx={{ width: "100%", p: 3, maxWidth: "1200px", margin: "0 auto" }}>
      <Stack spacing={4}>
      
          <Box
                         sx={{
                           border: "1px solid #e0e0e0",
                           borderRadius: "12px",
                           p: 3,
                           backgroundColor: "#f8fdfb",
                         }}
                       >
                         <Box
                           sx={{
                             display: "flex",
                             justifyContent: "center",
                             mb: 2,
                           }}
                         >
                           <Carousel
                             data={slides.map((slide) => ({ image: slide.image }))}
                             width="100%"
                             height="240px"
                             radius="8px"
                             dots={true}
                             automatic={false}
                             thumbnails={false}
                             slideImageFit="contain"
                           />
                         </Box>
                                 {/* Item Details */}
        <Box>
          <Typography variant="h6" fontWeight="bold" color="#0B996E" gutterBottom>
            Item Details
          </Typography>
          
          <Stack spacing={3}>
            {/* Item Name */}
            <Box>
              <Typography fontWeight="bold" color="#333" gutterBottom>
                Item Name:
              </Typography>
              <Typography 
                sx={{ 
                  p: 2,
                  borderRadius: "6px",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #e0e0e0",
                }}
              >
                {item?.name}
              </Typography>
            </Box>

            {/* Description */}
            <Box>
              <Typography fontWeight="bold" color="#333" gutterBottom>
                Description of Item:
              </Typography>
              <Typography 
                sx={{ 
                  p: 2,
                  borderRadius: "6px",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #e0e0e0",
                  minHeight: "100px",
                  lineHeight: 1.6
                }}
              >
                {item?.description}
              </Typography>
            </Box>

            {/* Location and Date */}
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <GrMap size={20} color="#0B996E" />
                <Box>
                  <Typography fontWeight="bold" color="#333">
                    {item?.type === "Lost" ? "Possible Location:" : "Location Found:"}
                  </Typography>
                  <Typography>{item?.room}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <MdDateRange size={20} color="#0B996E" />
                <Box>
                  <Typography fontWeight="bold" color="#333">
                    {item?.type === "Lost" ? "Date Lost:" : "Date Found:"}
                  </Typography>
                  <Typography>{item?.date}</Typography>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Box>

                  <Divider sx={{ my: 2 }} />

        {/* Uploader Information */}
        <Box>
          <Typography variant="h6" fontWeight="bold" color="#0B996E" gutterBottom>
            Uploader Information
          </Typography>
          
          <Stack spacing={3}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar
                src={item?.userId?.img}
                sx={{
                  width: 80,
                  height: 80,
                  border: "3px solid #0B996E",
                }}
              />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {item?.userId?.fullname}
                </Typography>
             
              </Box>
            </Stack>

            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FaBook size={18} color="#0B996E" />
                <Box>
                  <Typography fontWeight="bold">Course:</Typography>
                  <Typography>{item?.userId?.course}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FaGraduationCap size={18} color="#0B996E" />
                <Box>
                  <Typography fontWeight="bold">Year Level:</Typography>
                  <Typography>{item?.userId?.yearLevel}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FaPhoneAlt size={18} color="#0B996E" />
                <Box>
                  <Typography fontWeight="bold">Contact Number:</Typography>
                  <Typography>{item?.userId?.contact || "No contact"}</Typography>
                </Box>
              </Box>
            </Stack>

            {current_user === "true" && (
              <Button
                startIcon={<DeleteIcon />}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  borderColor: "#d32f2f",
                  color: "#d32f2f",
                  py: 1,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#ffebee",
                    borderColor: "#b71c1c",
                  },
                }}
                onClick={handleShowDelete}
              >
                Delete Post
              </Button>
            )}
          </Stack>
        </Box>

        {/* Comments Section */}
        <Box>
          <CommentsSection item_id={item_id} comments={comments} setComments={setComments} />
        </Box>
        </Box>


      </Stack>
    </Box>
  );

  const DeleteModal = () => (
    <Modal open={showDelete} onClose={handleCloseDelete}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Confirm Delete
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Are you sure you want to delete this item? This action cannot be undone.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={handleCloseDelete}
            sx={{
              borderColor: "#0B996E",
              color: "#0B996E",
              '&:hover': {
                borderColor: "#098562",
                backgroundColor: "#f5f5f5"
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={delete_item}
            sx={{
              backgroundColor: "#d32f2f",
              '&:hover': {
                backgroundColor: "#b71c1c"
              }
            }}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Modal>
  );

  const CommentProfileModal = () => (
    <Modal open={showCommentProfile} onClose={handleCloseCommentProfile}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 350,
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
        }}
      >
        {commentUser ? (
          <Stack spacing={2} alignItems="center">
            <Avatar
              src={commentUser.img}
              sx={{ width: 80, height: 80, border: "3px solid #0B996E" }}
            />
            <Typography variant="h6" fontWeight="bold">
              {commentUser.fullname}
            </Typography>
            <Stack spacing={1} width="100%">
              <Typography><strong>Student ID:</strong> {commentUser.studentId}</Typography>
              <Typography><strong>Course:</strong> {commentUser.course}</Typography>
              <Typography><strong>Year Level:</strong> {commentUser.yearLevel}</Typography>
              <Typography><strong>Contact:</strong> {commentUser.contact || "No contact info"}</Typography>
            </Stack>
          </Stack>
        ) : (
          <Typography>No user data available.</Typography>
        )}
      </Box>
    </Modal>
  );

  return (
    <Box sx={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      {item ? (
        <>
          <ItemHeader />
          <ItemDetails />
          <DeleteModal />
          <CommentProfileModal />
        </>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Typography variant="h6" color="#888" fontStyle="italic">
            Loading item details...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ItemPage;