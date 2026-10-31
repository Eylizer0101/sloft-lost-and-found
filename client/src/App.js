// client/src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import LostItems from "./Components/LostItems";
import FoundItems from "./Components/FoundItems";
import Home from "./Components/Home";
import ItemPage from "./Components/ItemPage";
import EditItem from "./Components/EditItem";
import LostItem from "./Components/Lost_item";
import MyListings from "./Components/MyListings";
import Layout from "./layout";
import AdminLayout from "./Components/AdminLayout";
import AdminDashboard from "./Components/AdminDashboard";
import Reports from "./Components/Reports";
import Details from "./Components/Details";
import UserManagement from "./Components/UserManagement"; // ✅ ADD IMPORT
import Archive from "./Components/Archive";
import 'react-toastify/dist/ReactToastify.css';
import ArchiveDetails from "./Components/ArchiveDetails";
import Analytics from "./Components/Analytics";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import AddReport from "./Components/AddReport";
import AdminClaimNotifications from "./Pages/AdminClaimNotifications";
import AdminClaimView from "./Pages/AdminClaimView";
import UserDetails from "./Components/UserDetails"; // ✅ NEW IMPORT
import MyListingDetails from "./Components/MyListingDetails"; // ⬅️ import this
import UserArchive from "./Components/UserArchive"; // ✅ DAGDAG MO ITO




function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin area (separate layout) */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="reports" element={<Reports />} />
           <Route path="details/:id" element={<Details />} />
           <Route path="user-management" element={<UserManagement />} />
           <Route path="archive" element={<Archive />} />
           <Route path="archive/:id" element={<ArchiveDetails />} />
           <Route path="analytics" element={<Analytics />} />
           <Route path="add-report" element={<AddReport />} />
           <Route path="claim-notifications" element={<AdminClaimNotifications />} />
          <Route path="user/:id" element={<UserDetails />} />
         <Route path="claim/:id" element={<AdminClaimView />} />

          {/* add more admin routes here */}
        </Route>


        

        {/* User area (uses existing layout which shows Navbar/Footer) */}
        <Route path="/*" element={<Layout />}>
          <Route path="edit/:id" element={<EditItem />} />
          <Route path="profile" element={<Profile />} />
          <Route index element={<Home />} />
          <Route path="log-in" element={<Login/>} />
          <Route path="sign-up" element={<Signup/>} />
          <Route path="verify-email" element={<Navigate to="/log-in" replace />} />
          <Route path="lostitems" element={<LostItems/>} />
          <Route path="founditems" element={<FoundItems/>} />
          <Route path="postitem" element={<LostItem/>} />
          <Route path="mylistings" element={<MyListings/>} />
          <Route path=":item" element={<ItemPage/>} />
          <Route path="user-archive" element={<UserArchive/>} /> {/* ✅ DAGDAG MO ITO */}
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
     
<Route path="mylistingdetails" element={<MyListingDetails />} />
          {/* fallback */}
        </Route>
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
