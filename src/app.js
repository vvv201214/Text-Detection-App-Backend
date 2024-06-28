const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoute');
const { getData } = require('./controllers/uploadController');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  'https://textdetect.netlify.app'
];

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    // Check if the incoming origin is in the allowedOrigins list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// app.use(cors({
//   credentials: true,
//   origin: "http://localhost:3000",
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
// }));


app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/data', getData);
app.use('/api/v1/user', userRoutes)

// if (process.env.NODE_ENV == 'production') {
//   app.use(express.static('client/build'));
//   const path = require('path');
//   app.get('*', (req, res) => {
//     console.log(path.resolve(__dirname, 'client', 'build', 'index.html'))
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   })
// }

module.exports = app;