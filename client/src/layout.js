import React from "react";
import { Stack } from '@mui/material'
import Navbar from "./Components/Navbar.js";
import Footer from "./Components/footer.js";

// ➕ dagdag imports
import { Outlet, useLocation } from 'react-router-dom';

function Layout(props) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  // ✅ ADD: Check if current route is login page
  const isLoginPage = location.pathname === '/log-in';
  const isSignupPage = location.pathname === '/sign-up';
  const isForgotPasswordPage = location.pathname === '/forgot-password';
  const isResetPasswordPage = location.pathname.startsWith('/reset-password');

  // ➕ Kapag admin route, walang Navbar/Footer
  if (isAdminRoute) {
    return <Outlet />;
  }

  return (
    <Stack
      spacing="0"
      width="100%"
      alignItems="center"
      minHeight="100dvh"
      justifyContent="space-between"
    >
      <Navbar />
      
      {/* Main content area - para hindi mawala spacing ng Stack */}
      <Stack flexGrow={1} width="100%" minWidth={0}>
        {props.children}
        <Outlet />
      </Stack>

      {/* ✅ ADD: Condition - wag mag-show ng Footer sa auth pages */}
      {!isLoginPage && !isSignupPage && !isForgotPasswordPage && !isResetPasswordPage && (
        <Footer />
      )}
    </Stack>
  );
}

export default Layout;