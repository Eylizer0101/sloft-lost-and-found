// client/src/Components/Footer.js
import React from 'react'
import { Link, Stack, Typography } from '@mui/material'
import { BsFacebook, BsInstagram, BsTwitter } from 'react-icons/bs'

const Footer = () => {
    return (
        <Stack width="100%" sx={{ pt: '85px' }}>
            <Stack
                width="100%"
                height="180px"
                sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#064C3B',
                    borderTop: '2px solid #CFEAE2',
                    boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.05)',
                }}
                py="25px"
                px={{ xs: "20px", md: "60px" }}
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                {/* ✅ System Description */}
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{
                        letterSpacing: "0.5px",
                        color: "#0B996E",
                    }}
                >
                    ARAULLO SOUTH Lost and Found Tracking System
                </Typography>

                <Typography
                    variant="body2"
                    textAlign="center"
                    maxWidth="650px"
                    sx={{
                        color: "#333",
                        opacity: 0.9,
                        mb: 1,
                        lineHeight: 1.6,
                        fontSize: "15px",
                    }}
                >
                    Easily report and retrieve lost items with our smart tracking system — 
                    connecting finders and owners quickly and securely.
                </Typography>

                {/* ✅ Divider Line */}
                <Stack
    width="100%"
    direction="row"
    justifyContent="center"  // <— ito ang magce-center horizontally
    alignItems="center"
    borderTop="1.5px solid #E6F4F1"
    pt="15px"
>
    <Typography
        fontSize="14px"
        fontWeight="light"
        color="#666"
        align="center"        // optional, extra alignment
    >
        © {new Date().getFullYear()} ARAULLO SOUTH Lost and Found. All rights reserved.
    </Typography>
</Stack>

            </Stack>
        </Stack>
    )
}

export default Footer
