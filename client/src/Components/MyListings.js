import React, { useEffect, useState } from "react";
import { setConstraint } from "../constraints";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  Chip,
  Tooltip,
  Divider,
  Avatar,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import ArchiveIcon from "@mui/icons-material/Archive";
import Axios from "axios";

// Support both permanent hosted URLs and legacy paths saved in MongoDB.
const IMAGE_API_URL = (process.env.REACT_APP_API_URL || "http://localhost:4000").replace(/\/+$/, "");
const resolveListingImage = (value) => {
  if (typeof value !== "string" || !value.trim()) return "";
  const url = value.trim().replace(/\\/g, "/");
  if (/^https?:\/\//i.test(url)) return url;
  if (/^\/\//.test(url)) return `${window.location.protocol}${url}`;
  const cleanPath = url.replace(/^\/+/, "");
  // Historical records may contain server/uploads/ or uploads/ paths.
  return `${IMAGE_API_URL}/${cleanPath.replace(/^server\//i, "")}`;
};

function ListingImage({ item }) {
  const candidate = Array.isArray(item.img) ? item.img.find(Boolean) : item.img;
  const source = candidate || (item.type === "Found" ? item.foundImg : item.lostImg);
  const imageUrl = resolveListingImage(source);
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [imageUrl]);

  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        alt={item.name || "Item"}
        loading="lazy"
        style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: 0, backgroundColor: "#f4f4f4" }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ width: "190px", height: "190px", borderRadius: "12px", backgroundColor: "#f1f8f6", border: "2px dashed #9ED6BE", color: "#607d8b", textAlign: "center", p: 2 }}>
      <ImageIcon sx={{ fontSize: 50, color: "#90a4ae" }} />
      <Typography variant="body2" fontWeight="bold">No Image Available</Typography>
    </Stack>
  );
}

export default function MyListings() {
  const getUserId = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return user ? user : null;
  };
  const user_info = getUserId();
  setConstraint(true);

  const [item, setItem] = useState("");

  const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => setIsReadMore(!isReadMore);

    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: "14px", mt: 1 }}
      >
        {isReadMore ? text.slice(0, 40) : text}
        <Button
          onClick={toggleReadMore}
          size="small"
          sx={{
            ml: 1,
            textTransform: "none",
            color: "#0B996E",
            "&:hover": { color: "#087A57", textDecoration: "underline" },
          }}
        >
          {isReadMore ? "...read more" : "show less"}
        </Button>
      </Typography>
    );
  };

  const renderStatusChip = (status) => {
    return (
      <Typography
        variant="body2"
        sx={{
          fontWeight: "bold",
          color: "#0B996E",
          mt: 0.5,
        }}
      >
        Status: Pending
      </Typography>
    );
  };

  // ✅ Function para i-convert date to 1m, 1h, 1d, 1y format
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInSeconds = Math.floor((now - created) / 1000);

    const years = Math.floor(diffInSeconds / (3600 * 24 * 365));
    if (years > 0) return `${years}y`;

    const days = Math.floor(diffInSeconds / (3600 * 24));
    if (days > 0) return `${days}d`;

    const hours = Math.floor(diffInSeconds / 3600);
    if (hours > 0) return `${hours}h`;

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes > 0) return `${minutes}m`;

    return "Just now";
  };

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/items?all=true`)
      .then((response) => {
        const allitems = response.data.items.reverse();
        let items = [];

        allitems.forEach((item) => {
          const currentUserId =
            user_info?._id || user_info?.id || user_info?.user?._id;

          const userId =
            item?.userId?._id || item?.userId?.id || item?.userId || "";

          // ✅ DAGDAG: Check kung hindi archived at current user ang may-ari
          if (String(userId) === String(currentUserId) && !item.isArchived) {
            let created_date = new Date(item.createdAt);

            // ✅ Replace original createdAt formatting with relative time (e.g. 2h, 3d)
            let createdAt = formatTimeAgo(created_date);

            items.push(
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                key={item._id}
              >
                <Card
                  sx={{
                    width: { xs: "280px", sm: "420px" },
                    minHeight: "520px",
                    borderRadius: "22px",
                    overflow: "hidden",
                    border: "2px solid #E3F2ED",
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #F8FFFC 100%)",
                    boxShadow:
                      "0 6px 22px rgba(0,0,0,0.08), 0 8px 16px rgba(11,153,110,0.1)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow:
                        "0 10px 26px rgba(0,0,0,0.12), 0 12px 24px rgba(11,153,110,0.18)",
                      transform: "translateY(-6px)",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{
                      px: 2.5,
                      pt: 2,
                      pb: 1,
                      backgroundColor: "#EAF8F3",
                      borderBottom: "1px solid #CFEDE1",
                    }}
                  >
                    <Avatar
                      alt={item.userId?.fullname || "User"}
                      src={
                        item.userId?.img
                          ? item.userId.img.startsWith("http")
                            ? item.userId.img
                            : `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/${item.userId.img}`
                          : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png"
                      }
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: "#0B996E",
                        fontWeight: "bold",
                      }}
                    >
                      {item.userId?.fullname
                        ? item.userId.fullname.charAt(0).toUpperCase()
                        : "U"}
                    </Avatar>

                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      fontWeight="bold"
                      sx={{ fontSize: "13px" }}
                    >
                      Student ID:{" "}
                      {item.userId?.studentId ||
                        user_info?.studentId ||
                        "N/A"}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontSize="14px"
                        >
                          {createdAt}
                        </Typography>
                    </Typography>
                  </Stack>
 
                  <Box
                    sx={{
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      background: "#F2FBF8",
                    }}
                  >
                    <ListingImage item={item} />
                  </Box>

                  <CardContent sx={{ p: 2.8 }}>
                    <Stack spacing={1.5}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Item Name:</strong>
                        <strong style={{ color: "#2c2f2eff" }}>
                          {item.name || "Unnamed Item"}
                        </strong>
                      </Typography>

                      <ReadMore>
                        <strong>Description:</strong> {item.description}
                      </ReadMore>

                      <Tooltip title="Status of your item post" arrow>
                        {renderStatusChip(item.status)}
                      </Tooltip>

                      <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                        <Chip
                          label="Lost Item"
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: "#E8F6F2",
                            color: "#0B996E",
                            border: "1px solid #BCE6D3",
                          }}
                        />
                      </Stack>

                      <Divider sx={{ my: 1.5 }} />

                      <Stack direction="row" spacing={1} mt={1}>
                        <motion.div whileTap={{ scale: 0.97 }}>
                          <Button
                            component={Link}
                            to={`/edit/${item._id}`}
                            variant="outlined"
                            fullWidth
                            sx={{
                              textTransform: "none",
                              borderRadius: "10px",
                              py: 1.2,
                              fontWeight: "bold",
                              borderColor: "#0B996E",
                              color: "#0B996E",
                              "&:hover": {
                                backgroundColor: "#E6F4F1",
                                borderColor: "#087A57",
                              },
                            }}
                          >
                            Edit
                          </Button>
                        </motion.div>

                        <motion.div whileTap={{ scale: 0.97 }}>
                          <Button
                            component={Link}
                            to={`/mylistingdetails?cid=${item._id}&type=${item.type}/true`}
                            variant="contained"
                            fullWidth
                            sx={{
                              textTransform: "none",
                              borderRadius: "10px",
                              py: 1.2,
                              fontWeight: "bold",
                              backgroundColor: "#0B996E",
                              "&:hover": { backgroundColor: "#098562" },
                            }}
                          >
                            More Details
                          </Button>
                        </motion.div>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            );
          }
        });

        setItem(items);
      })
      .catch((err) => {
        console.log("Error :", err);
      });
  }, []);

  return (
    <>
      <Stack
        direction="row"
        width="100%"
        sx={{
          color: "#1a1a1a", 
          background: "linear-gradient(180deg, #D7FEC8 0%, #ffffffff 100%)",
        }}
        minHeight="100px"
        alignItems="center"
        justifyContent="center"
      >
        <Stack
          spacing={1}
          position="relative"
          justifyContent="center"
          alignItems="center"
          width="100%"
          maxWidth="1440px"
          textAlign="center"
          px={2}
        >
          <Typography
            fontSize={{ xs: "20px", sm: "24px", md: "26px" }}
            fontWeight="bold"
            sx={{ color: "#0B996E" }}
          >
            Your Posted Items, {user_info?.fullname}
          </Typography>

          <Divider
            sx={{
              width: "80px",
              borderBottom: "3px solid #0B996E",
              mt: 1,
              borderRadius: "2px",
            }}
          />
        </Stack>
      </Stack>

      <Stack
        pt="20px"
        direction="row"
        justifyContent={"center"}
        flexWrap="wrap"
        gap="28px"
        maxWidth="1440px"
        mx="auto"
        px={{ xs: 2, sm: 4, md: 6 }}
      >
        {Array.isArray(item) && item.length > 0 ? (
          item
        ) : (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mt: 5, fontStyle: "italic" }}
          >
            No items posted yet....
          </Typography>
        )}
      </Stack>

      {/* ✅ ADDED: Archive Button - NASA BABA NA */}
      <Stack
        direction="row"
        justifyContent="center"
        width="100%"
        sx={{ mt: 3, mb: 5 }}
      >
        <Button
          component={Link}
          to="/user-archive"
          variant="outlined"
          startIcon={<ArchiveIcon />}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            fontSize: "16px",
            borderColor: "#0B996E",
            color: "#0B996E",
            "&:hover": {
              backgroundColor: "#E6F4F1",
              borderColor: "#087A57",
            },
          }}
        >
          View Archive
        </Button>
      </Stack>
    </>
  );
}