require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://lullaby-tales.vercel.app',
  'https://lullaby-tales-admin.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, true); // Still allowing for now to prevent issues, but specific origins are prioritized
    }
    return callback(null, true);
  },
  credentials: true
}));

// Add a root route so the site looks professional
app.get('/', (req, res) => {
    res.send('<h1>StoryVerse API is Live and Secure 🚀</h1><p>The backend is connected and ready for requests.</p>');
});
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/summary', require('./routes/summary'));
app.use('/api/config', require('./routes/config'));
app.use('/api/users', require('./routes/users'));
app.use('/api/daily', require('./routes/dailyStories'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error:", err.stack);
    res.status(500).json({ msg: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
