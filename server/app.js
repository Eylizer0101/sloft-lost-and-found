
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import userRoutes from './routes/userRoutes.js'
import ItemRoutes from './routes/ItemRoutes.js'
import adminRoutes from './routes/adminRoutes.js';
import NotificationRoutes from './routes/NotificationRoutes.js';
import ClaimRoutes from './routes/ClaimRoutes.js';
import contactRoutes from "./routes/contactRoutes.js";

const app = express()
dotenv.config()

// 📂 Para gumana __dirname sa ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ✅ Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.json())

// ✅ Allow local frontend and deployed frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use('/users', userRoutes)
app.use('/items', ItemRoutes) // ✅ lowercase and consistent

// --&gt; register admin routes
app.use('/admin', adminRoutes)
app.use('/notifications', NotificationRoutes);
app.use('/claims', ClaimRoutes);
app.use("/contact", contactRoutes);


const port = process.env.PORT || 4000
const db = process.env.DB

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(port, () =>
      console.log('Connection done and running on PORT :' + port)
    )
  )
  .catch((err) => console.log(err.message))
