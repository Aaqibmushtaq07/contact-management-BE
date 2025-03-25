const express = require('express');
const app = express();
const env = require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');

const router = require('./routes/contactRoutes');
const router2 = require('./routes/userRoutes');
const errors = require('./middleware/errorHandler');
const connectDb = require('./config/db');

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to database
connectDb();

// Routes
app.use('/v1', router);
app.use('/v1/user', router2);

// Error handling
app.use(errors);

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
const server = app
  .listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  })
  .on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
      server.close();
      app.listen(PORT + 1, () => {
        console.log(
          `Server running in ${process.env.NODE_ENV} mode on port ${PORT + 1}`
        );
      });
    } else {
      console.error('Server error:', err);
    }
  });
