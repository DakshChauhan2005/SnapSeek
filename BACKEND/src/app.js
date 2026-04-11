import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from '../config/db.js';
import authRoutes from '../routes/auth.routes.js'
import cors from 'cors';
import morgan from 'morgan';


const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser());
app.use(express.json());
connectDB();
app.use(morgan('dev'));



app.use('/api/auth', authRoutes);
// Example route
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

export default app;
