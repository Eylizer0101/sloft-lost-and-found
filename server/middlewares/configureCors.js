import cors from 'cors';

// Add additional frontend origins using FRONTEND_URL (comma-separated).
const allowedOrigins = new Set([
  'https://sloft-frontend.onrender.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(process.env.FRONTEND_URL || '').split(',').map(origin => origin.trim()).filter(Boolean),
]);

const corsOptions = {
  origin(origin, callback) {
    // Requests without an Origin header include server-to-server requests.
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  credentials: true,
};

export const configureCors = cors(corsOptions);
