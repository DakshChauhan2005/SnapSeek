import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from '../config/db.js';
import authRoutes from '../routes/auth.routes.js'
import cors from 'cors';
import morgan from 'morgan';
import chatRouter from '../routes/chat.routes.js';


const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Adjust this to your frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser());
app.use(express.json());
connectDB();
app.use(morgan('dev'));


app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRouter);
// Example route
app.get('/', (req, res) => {
  console.log("ip",req.ip);
  console.log("headers",req.headers);
  res.json({ message: 'Hello, World!' });
});

export default app;
