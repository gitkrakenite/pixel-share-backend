const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const db = require("./config/db");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const PORT = process.env.PORT || 5000;

// db connection
db();

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);

// listener
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
