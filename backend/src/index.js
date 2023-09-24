const express = require('express');
const mongoose = require("mongoose");
// const cookieParser = require('cookie-parser')
const cors = require("cors")
// const {logRequest} = require("./helpers/reqLogger")
require("dotenv").config();

// const express = require('express');
// const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Update the path as needed
// const config = require('./config/config');

const app = express();

mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));


app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
// Define your routes and middleware here

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 7000; // Use the environment variable or a default port

app.get("/", (req, res) => {
  res.send("Server running");
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

