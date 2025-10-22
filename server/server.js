const express = require('express');
const connectDB = require('./config/db')
const session = require('express-session');
const sessionConfig = require('./config/sessionConfig');
const cors = require('./utils/corsConfig');

const authRoutes = require('./routers/authRoutes');
const userRoutes = require('./routers/userRoutes');

const app = express();

// Database connection

connectDB()
// Middleware
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session(sessionConfig));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    session: req.sessionID ? 'Session active' : 'No session'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});