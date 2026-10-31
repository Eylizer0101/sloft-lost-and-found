import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Stack,
  Chip,
  IconButton,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Tooltip as MuiTooltip,
  useTheme,
  Fade,
  Card as MuiCard,
  TextField,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import CategoryIcon from "@mui/icons-material/Category";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import FilterListIcon from "@mui/icons-material/FilterList";
import DateRangeIcon from "@mui/icons-material/DateRange";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";

// Base sa iyong dashboard design - green theme
const COLORS = {
  primary: "#0B996E",      // Main green from your dashboard
  primaryDark: "#113e33ff",  // Dark green for text
  primaryLight: "#E6F4F1", // Light green background
  success: "#4CAF50",      // Success green
  warning: "#FF9800",      // Orange for warnings
  error: "#F44336",        // Red for errors
  purple: "#9C27B0",       // Purple for variety
  gray: "#757575",         // Gray for text
  lightGray: "#F5F5F5",    // Light gray background
  white: "#FFFFFF",        // White
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.success,
  COLORS.warning,
  COLORS.error,
  COLORS.purple,
  "#2196F3",
  "#FFC107"
];

const CARD_BG = COLORS.white;
const SUBTLE_BG = COLORS.lightGray;
const HEADER_BG = "#f1f5f9";

const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const buildEmptyMonthlyData = (year = new Date().getFullYear()) => {
  return monthNamesShort.map((m, i) => ({ month: m, lost: 0, found: 0, users: 0, monthIndex: i, year }));
};

const normalizeMonthlyData = (raw) => {
  const template = buildEmptyMonthlyData();
  const map = new Map((raw || []).map((r) => [r.month, r]));
  return template.map((t) => {
    const r = map.get(t.month);
    if (!r) return t;
    return { ...t, lost: r.lost || 0, found: r.found || 0, users: r.users || 0 };
  });
};

const sumSeries = (arr = [], key) => arr.reduce((acc, cur) => acc + (cur[key] || 0), 0);

const Card = ({ children, sx, ...rest }) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      borderRadius: "16px",
      background: CARD_BG,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      ...sx,
    }}
    {...rest}
  >
    {children}
  </Paper>
);

const ANALYTICS_VIEWS = {
  REPORTS: "reports",
  MONTHLY: "monthly",
  STATUS: "status",
  CATEGORIES: "categories",
  USERS: "users",
};

const DATE_FILTERS = {
  TODAY: "today",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
  CUSTOM: "custom"
};

const Analytics = () => {
  const theme = useTheme();

  // raw backend data
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);

  // UI state - REPORTS ang default view
  const [activeView, setActiveView] = useState(ANALYTICS_VIEWS.REPORTS);

  // filter controls
  const [year, setYear] = useState(new Date().getFullYear());
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState(DATE_FILTERS.MONTH);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Function to reset all filters to default values
  const resetFilters = () => {
    setTypeFilter("All");
    setDateFilter(DATE_FILTERS.MONTH);
    setCustomStartDate("");
    setCustomEndDate("");
  };

  // Function to build date parameters based on selected filter
  const buildDateParams = () => {
    let startDate = '';
    let endDate = '';

    switch (dateFilter) {
      case DATE_FILTERS.TODAY:
        const today = new Date();
        startDate = today.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case DATE_FILTERS.WEEK:
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        startDate = weekAgo.toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case DATE_FILTERS.MONTH:
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        startDate = monthAgo.toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case DATE_FILTERS.YEAR:
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        startDate = yearAgo.toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case DATE_FILTERS.CUSTOM:
        if (customStartDate && customEndDate) {
          startDate = customStartDate;
          endDate = customEndDate;
        }
        break;
      default:
        // No date filter
        break;
    }

    return { startDate, endDate };
  };

  // fetch analytics
  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const { startDate, endDate } = buildDateParams();
      
      let url = "http://localhost:4000/admin/analytics";
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.ok) {
        const monthlyData = normalizeMonthlyData(res.data.monthlyData || []);
        const categorySummary = res.data.categorySummary || [];
        const statusSummary = res.data.statusSummary || { pending: 0, claimed: 0, percentage: {} };
        setRaw({
          ...res.data,
          monthlyData,
          categorySummary,
          statusSummary,
        });
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err?.response?.data?.msg || err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingClaimsCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const { startDate, endDate } = buildDateParams();
      
      let url = "http://localhost:4000/claims/pending-count";
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      console.log(" Fetching pending claims from:", url);
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data && res.data.ok) {
        console.log(" Pending claims count:", res.data.count);
        setPendingClaimsCount(res.data.count);
      } else {
        console.log("❌ Invalid response for pending claims");
        setPendingClaimsCount(0);
      }
    } catch (error) {
      console.error("❌ Error fetching pending claims count:", error);
      console.error("❌ Error details:", error.response?.data || error.message);
      setPendingClaimsCount(0);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAnalytics();
    fetchPendingClaimsCount();
  }, []);

  // 🔥 IMPORTANT FIX: Refresh BOTH analytics and pending claims when filters change
  useEffect(() => {
    if (raw) { // Only refresh if we already have data
      console.log(" Filters changed, refreshing data...");
      fetchAnalytics();
      fetchPendingClaimsCount();
    }
  }, [dateFilter, customStartDate, customEndDate]);

  // Refresh when type filter changes (for charts only)
  useEffect(() => {
    if (raw) {
      // Type filter doesn't affect pending claims count, so we don't need to refetch
      // Just update the local state for charts
      console.log(" Type filter changed, updating charts...");
    }
  }, [typeFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchAnalytics(),
      fetchPendingClaimsCount()
    ]);
    setTimeout(() => setRefreshing(false), 350);
  };

  const handleViewChange = (event, next) => {
    if (!next) return;
    setActiveView(next);
  };

  // Filtered data based on date range
  const filteredMonthlyData = useMemo(() => {
    if (!raw) return buildEmptyMonthlyData(year);
    
    let baseData = raw.monthlyData.map((m) => ({ ...m }));
    
    // Apply type filter
    baseData = baseData.map((m) => {
      const e = { ...m };
      if (typeFilter === "Lost") e.found = 0;
      else if (typeFilter === "Found") e.lost = 0;
      return e;
    });

    return baseData;
  }, [raw, typeFilter, year]);

  const filteredTotalReports = useMemo(() => {
    if (!raw) return 0;
    if (typeFilter === "All") return raw.totalReports || 0;
    if (typeFilter === "Lost") return sumSeries(filteredMonthlyData, "lost");
    if (typeFilter === "Found") return sumSeries(filteredMonthlyData, "found");
    return raw.totalReports || 0;
  }, [raw, typeFilter, filteredMonthlyData]);

  const statusSummary = useMemo(() => {
    if (!raw) return { pending: 0, claimed: 0, percentage: {} };
    
    const pendingCount = pendingClaimsCount;
    const claimedCount = raw.statusSummary?.claimed || 0;
    
    const totalStatus = pendingCount + claimedCount;
    const statusPercent = {
      pending: totalStatus > 0 ? Math.round((pendingCount / totalStatus) * 100) : 0,
      claimed: totalStatus > 0 ? Math.round((claimedCount / totalStatus) * 100) : 0,
    };
    
    return { 
      pending: pendingCount,
      claimed: claimedCount, 
      percentage: statusPercent
    };
  }, [raw, pendingClaimsCount]);

  const categories = useMemo(() => {
    if (!raw) return [];
    const arr = raw.categorySummary ? [...raw.categorySummary] : [];
    arr.sort((a, b) => b.count - a.count);
    return arr.slice(0, 8); // Limit to top 8 categories
  }, [raw]);

  const userStats = useMemo(() => {
    if (!raw) return null;
    
    return {
      totalUsers: raw.totalUsers || 0,
      recentRegistrations: raw.recentRegistrations || 0,
      verifiedUsers: raw.verifiedUsers || 0,
      unverifiedUsers: raw.unverifiedUsers || 0,
      userRoles: raw.userRoles || [],
      usersByCourse: raw.usersByCourse || [],
      monthlyUserData: raw.monthlyData || []
    };
  }, [raw]);

  const pieStatusData = useMemo(() => {
    const s = statusSummary || {};
    return [
      { name: "Pending", value: s.pending || 0 },
      { name: "Claimed", value: s.claimed || 0 },
    ];
  }, [statusSummary]);

  const userRoleData = useMemo(() => {
    if (!userStats) return [];
    return userStats.userRoles.map(role => ({
      name: role._id === 'admin' ? 'Admin' : 'Users',
      value: role.count,
      role: role._id
    }));
  }, [userStats]);

  // Reports Section - Main View
  function ReportsSection() {
    return (
      <Fade in={activeView === ANALYTICS_VIEWS.REPORTS} timeout={300} unmountOnExit>
        <Box sx={{ ml: "210px", p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" color={COLORS.primaryDark} gutterBottom>
                  Reports Analytics
                </Typography>
                <Typography variant="body2" color={COLORS.gray} sx={{ mb: 3 }}>
                  Comprehensive overview of all lost and found reports
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Card sx={{ p: 2, textAlign: 'center', backgroundColor: COLORS.primaryLight, borderRadius: "12px" }}>
                      <Typography variant="h4" fontWeight="bold" color={COLORS.primary}>
                        {filteredTotalReports}
                      </Typography>
                      <Typography variant="body2" color={COLORS.primaryDark}>
                        Total Reports
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card sx={{ p: 2, textAlign: 'center', backgroundColor: "#FFF3E0", borderRadius: "12px" }}>
                      <Typography variant="h4" fontWeight="bold" color={COLORS.warning}>
                        {sumSeries(filteredMonthlyData, "lost")}
                      </Typography>
                      <Typography variant="body2" color={COLORS.primaryDark}>
                        Lost Items
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card sx={{ p: 2, textAlign: 'center', backgroundColor: "#E8F5E9", borderRadius: "12px" }}>
                      <Typography variant="h4" fontWeight="bold" color={COLORS.success}>
                        {sumSeries(filteredMonthlyData, "found")}
                      </Typography>
                      <Typography variant="body2" color={COLORS.primaryDark}>
                        Found Items
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card sx={{ p: 2, textAlign: 'center', backgroundColor: "#F3E5F5", borderRadius: "12px" }}>
                      <Typography variant="h4" fontWeight="bold" color={COLORS.purple}>
                        {pendingClaimsCount}
                      </Typography>
                      <Typography variant="body2" color={COLORS.primaryDark}>
                        Pending Claims
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredMonthlyData}>
                      <defs>
                        <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.warning} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={COLORS.warning} stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorFound" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="month" stroke={COLORS.gray} />
                      <YAxis stroke={COLORS.gray} />
                      <Tooltip />
                      <Area type="monotone" dataKey="lost" stroke={COLORS.warning} fillOpacity={1} fill="url(#colorLost)" name="Lost Items" />
                      <Area type="monotone" dataKey="found" stroke={COLORS.success} fillOpacity={1} fill="url(#colorFound)" name="Found Items" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    );
  }

  // Enhanced Monthly Section
  function MonthlySection() {
    return (
      <Fade in={activeView === ANALYTICS_VIEWS.MONTHLY} timeout={300} unmountOnExit>
        <Box sx={{ ml: "210px", p: 3 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" color={COLORS.primaryDark} gutterBottom>
              Monthly Trends
            </Typography>
            <Typography variant="body2" color={COLORS.gray} sx={{ mb: 3 }}>
              Detailed monthly breakdown of lost and found items
            </Typography>

            <Box sx={{ height: 400, mt: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke={COLORS.gray} />
                  <YAxis stroke={COLORS.gray} />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="lost" 
                    fill={COLORS.warning} 
                    name="Lost Items"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="found" 
                    fill={COLORS.success} 
                    name="Found Items"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Box>
      </Fade>
    );
  }

  // Enhanced Status Section
  function StatusSection() {
    return (
      <Fade in={activeView === ANALYTICS_VIEWS.STATUS} timeout={300} unmountOnExit>
        <Box sx={{ ml: "210px", p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" color={COLORS.primaryDark} gutterBottom>
                  Claim Status Overview
                </Typography>
                <ResponsiveContainer width="100%" height={340}>
                  <PieChart>
                    <Pie
                      data={pieStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.name === "Pending" ? COLORS.warning : COLORS.success}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" color={COLORS.primaryDark} gutterBottom>
                  Status Details
                </Typography>
                <Stack spacing={3} sx={{ mt: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 3, backgroundColor: "#FFF3E0", borderRadius: 3 }}>
                    <Typography variant="h3" fontWeight="bold" color={COLORS.warning}>
                      {statusSummary.pending}
                    </Typography>
                    <Typography variant="body2" color={COLORS.primaryDark}>
                      Pending Claims
                    </Typography>
                    <Typography variant="caption" color={COLORS.warning} sx={{ mt: 1 }}>
                      {statusSummary.percentage.pending}% of total
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 3, backgroundColor: "#E8F5E9", borderRadius: 3 }}>
                    <Typography variant="h3" fontWeight="bold" color={COLORS.success}>
                      {statusSummary.claimed}
                    </Typography>
                    <Typography variant="body2" color={COLORS.primaryDark}>
                      Successfully Claimed
                    </Typography>
                    <Typography variant="caption" color={COLORS.success} sx={{ mt: 1 }}>
                      {statusSummary.percentage.claimed}% of total
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    );
  }

  // Enhanced Categories Section
  function CategoriesSection() {
    return (
      <Fade in={activeView === ANALYTICS_VIEWS.CATEGORIES} timeout={300} unmountOnExit>
        <Box sx={{ ml: "210px", p: 3 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" color={COLORS.primaryDark} gutterBottom>
              Item Categories Distribution
            </Typography>
            <Typography variant="body2" color={COLORS.gray} sx={{ mb: 3 }}>
              Most common categories of lost and found items
            </Typography>

            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categories}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis type="number" stroke={COLORS.gray} />
                  <YAxis 
                    dataKey="category" 
                    type="category" 
                    stroke={COLORS.gray}
                    width={80}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill={COLORS.primary}
                    radius={[0, 4, 4, 0]}
                  >
                    <LabelList 
                      dataKey="count" 
                      position="right" 
                      fill={COLORS.primaryDark}
                      fontWeight={600}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Box>
      </Fade>
    );
  }

  // Enhanced Users Section
  function UsersSection() {
    if (!userStats) return null;

    return (
      <Fade in={activeView === ANALYTICS_VIEWS.USERS} timeout={300} unmountOnExit>
        <Box sx={{ ml: "210px", p: 3 }}>
          <Grid container spacing={3}>
            {/* User Statistics Cards */}
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 3, textAlign: 'center', bgcolor: COLORS.primaryLight, borderRadius: "12px", boxShadow: 3 }}>
                <Typography variant="body1" color={COLORS.primaryDark}>
                  Total Users
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={COLORS.primary}>
                  {userStats.totalUsers}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ p: 3, textAlign: 'center', bgcolor: "#E3F2FD", borderRadius: "12px", boxShadow: 3 }}>
                <Typography variant="body1" color={COLORS.primaryDark}>
                  New Users (7 days)
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="#2196F3">
                  {userStats.recentRegistrations}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ p: 3, textAlign: 'center', bgcolor: "#E8F5E9", borderRadius: "12px", boxShadow: 3 }}>
                <Typography variant="body1" color={COLORS.primaryDark}>
                  Verified Users
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={COLORS.success}>
                  {userStats.verifiedUsers}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ p: 3, textAlign: 'center', bgcolor: "#F3E5F5", borderRadius: "12px", boxShadow: 3 }}>
                <Typography variant="body1" color={COLORS.primaryDark}>
                  Verification Rate
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={COLORS.purple}>
                  {Math.round((userStats.verifiedUsers / userStats.totalUsers) * 100) || 0}%
                </Typography>
              </Card>
            </Grid>

            {/* User Growth Chart */}
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" color={COLORS.primaryDark} gutterBottom>
                  User Registration Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userStats.monthlyUserData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" stroke={COLORS.gray} />
                    <YAxis stroke={COLORS.gray} />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

          

            {/* Users by Course */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" color={COLORS.primaryDark} gutterBottom>
                  Users by Course
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {userStats.usersByCourse.slice(0, 6).map((course, index) => (
                    <Grid item xs={12} md={4} key={course._id}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        p: 2,
                        backgroundColor: CHART_COLORS[index % CHART_COLORS.length] + '20',
                        borderRadius: 2
                      }}>
                        <Typography variant="body2" fontWeight={500} color={COLORS.primaryDark}>
                          {course._id || 'Not Specified'}
                        </Typography>
                        <Chip 
                          label={course.count} 
                          size="small" 
                          sx={{ 
                            backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                            color: 'white',
                            fontWeight: 600
                          }} 
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    );
  }

  const TopControls = () => {
    return (
      <Box sx={{ ml: "210px", mt: 2, pr: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={3}
          height={80}
        >
          {/* Left Side - Title */}
          <Box>
            <Typography variant="h4" fontWeight="bold" color={COLORS.primaryDark}>
              Analytics Dashboard
            </Typography>
            <Typography variant="body2" color={COLORS.gray}>
              Comprehensive insights and performance metrics
            </Typography>
          </Box>

          {/* Right Side - Controls */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
            justifyContent="flex-end"
          >
            {/* Date Filter */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateFilter}
                label="Date Range"
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <MenuItem value={DATE_FILTERS.TODAY}>Today</MenuItem>
                <MenuItem value={DATE_FILTERS.WEEK}>This Week</MenuItem>
                <MenuItem value={DATE_FILTERS.MONTH}>This Month</MenuItem>
                <MenuItem value={DATE_FILTERS.YEAR}>This Year</MenuItem>
                <MenuItem value={DATE_FILTERS.CUSTOM}>Custom Date</MenuItem>
              </Select>
            </FormControl>

            {/* Custom Date Range */}
            {dateFilter === DATE_FILTERS.CUSTOM && (
              <>
                <TextField
                  size="small"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 140 }}
                />
                <TextField
                  size="small"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 140 }}
                />
              </>
            )}

            {/* Type Filter */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Item Type</InputLabel>
              <Select
                value={typeFilter}
                label="Item Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="All">All Items</MenuItem>
                <MenuItem value="Lost">Lost Only</MenuItem>
                <MenuItem value="Found">Found Only</MenuItem>
              </Select>
            </FormControl>

            {/* Reset Filters Button */}
            <MuiTooltip title="Reset all filters to default">
              <IconButton
                onClick={resetFilters}
                sx={{
                  bgcolor: 'white',
                  border: '1px solid #e0e0e0',
                  "&:hover": { 
                    bgcolor: COLORS.primaryLight,
                    borderColor: COLORS.primary 
                  },
                }}
              >
                <RestartAltIcon />
              </IconButton>
            </MuiTooltip>

            {/* Toggle Buttons - WALANG OVERVIEW */}
            <ToggleButtonGroup
              value={activeView}
              exclusive
              onChange={handleViewChange}
              aria-label="analytics view"
              size="small"
              sx={{
                background: SUBTLE_BG,
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  border: "none",
                  px: 2,
                  py: 0.8,
                  borderRadius: 1.5,
                  transition: "all 0.2s ease",
                  fontWeight: 500,
                  color: COLORS.gray,
                },
                "& .MuiToggleButton-root.Mui-selected": {
                  background: COLORS.primary,
                  color: 'white',
                  boxShadow: "0 2px 4px rgba(11, 153, 110, 0.3)",
                },
              }}
            >
              <ToggleButton value={ANALYTICS_VIEWS.REPORTS} aria-label="reports">
                Reports
              </ToggleButton>
              <ToggleButton value={ANALYTICS_VIEWS.MONTHLY} aria-label="monthly">
                Monthly
              </ToggleButton>
              <ToggleButton value={ANALYTICS_VIEWS.STATUS} aria-label="status">
                Status
              </ToggleButton>
              <ToggleButton value={ANALYTICS_VIEWS.CATEGORIES} aria-label="categories">
                Categories
              </ToggleButton>
              <ToggleButton value={ANALYTICS_VIEWS.USERS} aria-label="users">
                Users
              </ToggleButton>
            </ToggleButtonGroup>

           
          </Stack>
        </Stack>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box p={3} display="flex" alignItems="center" justifyContent="center" minHeight="70vh" sx={{ background: SUBTLE_BG, ml: "210px" }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress sx={{ color: COLORS.primary }} />
          <Typography variant="body2" color={COLORS.gray}>
            Loading analytics data...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} sx={{ ml: "210px" }}>
        <Card>
          <Typography variant="h6" color="error" gutterBottom>
            Error loading analytics
          </Typography>
          <Typography variant="body2" color={COLORS.gray} sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleRefresh} 
            startIcon={<RefreshIcon />}
            sx={{
              backgroundColor: COLORS.primary,
              '&:hover': {
                backgroundColor: COLORS.primaryDark,
              },
            }}
          >
            Retry
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ background: SUBTLE_BG, minHeight: "100vh" }}>
      <TopControls />

      <Box>
        {activeView === ANALYTICS_VIEWS.REPORTS && <ReportsSection />}
        {activeView === ANALYTICS_VIEWS.MONTHLY && <MonthlySection />}
        {activeView === ANALYTICS_VIEWS.STATUS && <StatusSection />}
        {activeView === ANALYTICS_VIEWS.CATEGORIES && <CategoriesSection />}
        {activeView === ANALYTICS_VIEWS.USERS && <UsersSection />}
      </Box>

      <Box mt={3} display="flex" justifyContent="center" sx={{ pb: 3, ml: "210px" }}>
        <Typography variant="caption" color={COLORS.gray}>
          Data last updated: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default Analytics