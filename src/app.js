const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoute');
const { getData } = require('./controllers/uploadController');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));


app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/data', getData);
app.use('/api/v1/user', userRoutes)

if (process.env.NODE_ENV == 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

module.exports = app;