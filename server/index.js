import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import courseRoutes from './routes/course.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGOD).then(() => {
    console.log('DB Connected 🚀 ');
}).catch((err) => {
    console.log("Error: " + err);
});

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(process.env.PORT, () =>{
    console.log(`Server is running on port ${process.env.PORT}`);
}); 

app.use('/api/user', userRoutes);
app.use('api/course', userRoutes);
app.use('api/auth', authRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

app.use((err,res,req,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});