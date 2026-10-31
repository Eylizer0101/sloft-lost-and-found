import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  CircularProgress,
  Avatar,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Chip,
  Paper,
  Skeleton,
  Tooltip,
  Grid,
  Fade,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import InfoIcon from "@mui/icons-material/Info";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [markingAll, setMarkingAll] = useState(false);
  const open = Boolean(anchorEl);
  const rawUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const userId = useMemo(() => {
    try {
      const parsed = JSON.parse(rawUserId);
      if (parsed && typeof parsed === "object") {
        return parsed._id || parsed.id || String(parsed);
      }
      return parsed || rawUserId;
    } catch {
      return rawUserId;
    }
  }, [rawUserId]);

  const fetchNotifications = async () => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/notifications/${userId}`);
      const data = res.data || [];
      const normalized = (Array.isArray(data) ? data : []).map((n) => ({
        _id: n._id || n.id || n.notificationId || Math.random().toString(36).slice(2),
        userId: n.userId || n.user || userId,
        message: n.message || n.text || "You have a new notification",
        isRead: typeof n.isRead === "boolean" ? n.isRead : !!n.read,
        createdAt: n.createdAt || n.created_at || new Date().toISOString(),
        itemId: n.itemId || n.item || n.link || null,
        type: n.type || "ItemUpdate",
        meta: n.meta || {},
      }));
      setNotifications(normalized);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [userId]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const markAsRead = async (id) => {
    try {
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      await axios.put(`http://localhost:4000/notifications/read/${id}`);
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAllVisibleAsRead = async () => {
    const visible = notifications.filter((n) => {
      if (filter === "all") return true;
      if (filter === "unread") return !n.isRead;
      if (filter === "read") return n.isRead;
      return true;
    });
    if (visible.length === 0) return;
    setMarkingAll(true);
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await Promise.all(visible.map((n) => axios.put(`http://localhost:4000/notifications/read/${n._id}`)));
    } catch (err) {
      console.error("Error marking all as read:", err);
      await fetchNotifications();
    } finally {
      setMarkingAll(false);
    }
  };

  const timeAgo = (iso) => {
    try {
      const date = new Date(iso);
      const diff = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diff < 60) return `${diff}s`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
      if (diff < 2592000) return `${Math.floor(diff / 86400)}d`;
      return date.toLocaleDateString();
    } catch {
      return "";
    }
  };

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.isRead);
    if (filter === "read") return notifications.filter((n) => n.isRead);
    return notifications;
  }, [notifications, filter]);

  const typeMeta = {
    ItemUpdate: { icon: <MailOutlineIcon />, color: "#0B996E", label: "Update" },
    Claim: { icon: <HourglassTopIcon />, color: "#FFB020", label: "Claim" },
    System: { icon: <InfoIcon />, color: "#6DD6A6", label: "System" },
    Error: { icon: <ErrorOutlineIcon />, color: "#E74C3C", label: "Error" },
  };

  const EmptyState = () => (
    <Box sx={{ p: 2, textAlign: "center", bgcolor: "#F7FBF8" }}>
      <img
        src="https://i.ibb.co/0F2F7fG/empty-bell.png"
        alt="No notifications"
        style={{ width: 90, opacity: 0.8, marginBottom: 8 }}
      />
      <Typography variant="body2" sx={{ color: "#064E3B" }}>
        You're all caught up — no notifications.
      </Typography>
    </Box>
  );

  const SkeletonList = () => (
    <List sx={{ width: "100%", p: 1 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <ListItem key={i}>
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
          <ListItemText primary={<Skeleton width="80%" />} secondary={<Skeleton width="60%" />} />
        </ListItem>
      ))}
    </List>
  );

  const NotificationRow = ({ notif }) => {
    const meta = typeMeta[notif.type] || typeMeta.ItemUpdate;
    const bg = notif.isRead ? "transparent" : "#D7FEC8";

    const handleNotificationClick = async () => {
      console.log("🔔 Notification clicked:", notif);
      console.log("🆔 Item ID from notification:", notif.itemId);
      console.log("📋 Notification type:", notif.type);
      console.log("💬 Message:", notif.message);

      // Mark as read muna
      if (!notif.isRead) {
        console.log("📝 Marking notification as read...");
        await markAsRead(notif._id);
      }

      // Check if this notification is about an item and has itemId
      if (notif.itemId) {
        console.log("🔄 Redirecting to item page with ID:", notif.itemId);
        
        // Gamitin ang tamang URL format para sa ItemPage
        const itemPageUrl = `/itempage?cid=${notif.itemId}&type=false`;
        console.log("🌐 Navigating to:", itemPageUrl);
        
        navigate(itemPageUrl);
      } else {
        console.log("❌ No itemId found in notification - cannot redirect to item page");
      }

      // Close notification dropdown
      handleClose();
    };

    return (
      <Fade in timeout={350}>
        <ListItem
          button
          onClick={handleNotificationClick}
          sx={{
            alignItems: "flex-start",
            background: bg,
            py: 1,
            px: 1.25,
            borderRadius: 2,
            "&:hover": { background: "#C8F6B8" },
            transition: "all 0.2s ease",
            cursor: notif.itemId ? "pointer" : "default",
          }}
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: meta.color, width: 44, height: 44, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
              {meta.icon}
            </Avatar>
          </ListItemAvatar>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: notif.isRead ? 500 : 700, color: "#064E3B" }}>
                {notif.message}
              </Typography>
              <Typography variant="caption" sx={{ color: "#0B996E" }}>
                {timeAgo(notif.createdAt)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={meta.label} 
                size="small" 
                sx={{ bgcolor: meta.color + "22", borderRadius: 1 }} 
              />
              {!notif.isRead ? (
                <Chip 
                  icon={<MarkEmailReadIcon />} 
                  label="Unread" 
                  size="small" 
                  color="success" 
                />
              ) : (
                <Chip 
                  icon={<DoneAllIcon />} 
                  label="Read" 
                  size="small" 
                />
              )}
              {notif.itemId && (
                <Chip 
                  label="View Item" 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Box>
          </Box>
        </ListItem>
      </Fade>
    );
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleClick}
          sx={{
            position: "relative",
            mr: 1,
            backgroundColor: "#D7FEC8",
            borderRadius: "50%",
            p: "6px",
            "&:hover": { backgroundColor: "#B9F4AC" },
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          <Badge badgeContent={unreadCount} color="error" overlap="circular">
            <NotificationsIcon sx={{ color: "#0B996E", fontSize: 26 }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 6,
          sx: {
            borderRadius: 3,
            width: 380,
            maxWidth: "92vw",
            boxShadow: "0px 10px 30px rgba(2,6,23,0.15)",
            overflow: "hidden",
            background: "#F7FBF8",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.25, bgcolor: "#0B996E", color: "#fff" }}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Notifications
              </Typography>
              <Typography variant="caption">{unreadCount} new</Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  sx={{ color: "#fff", "&:hover": { color: "#D7FEC8" } }}
                  startIcon={<DoneAllIcon />}
                  onClick={markAllVisibleAsRead}
                  disabled={markingAll || notifications.length === 0}
                >
                  {markingAll ? <CircularProgress size={16} color="inherit" /> : "Mark all"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ maxHeight: 420, overflowY: "auto" }}>
          {loading ? (
            <Box sx={{ p: 2 }}>
              <SkeletonList />
            </Box>
          ) : notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <List sx={{ p: 1 }}>
              {filteredNotifications.map((notif) => (
                <Box key={notif._id} sx={{ mb: 1 }}>
                  <NotificationRow notif={notif} />
                </Box>
              ))}
            </List>
          )}
        </Box>

        <Divider />

        <Box sx={{ px: 2, py: 1.25, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" sx={{ color: "#064E3B" }}>
            Showing: {filter === "all" ? "All notifications" : filter === "unread" ? "Unread only" : "Read only"}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              sx={{ color: "#0B996E" }}
              onClick={async () => {
                await fetchNotifications();
              }}
            >
              Refresh
            </Button>
            <Button
              size="small"
              sx={{ color: "#0B996E" }}
              onClick={() => {
                navigate("/notifications");
                handleClose();
              }}
            >
              View all
            </Button>
          </Stack>
        </Box>
      </Menu>
    </>
  );
}

export default NotificationBell;