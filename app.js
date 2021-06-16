// Dependencies
const express = require("express");
const cors = require("cors");

// Configuration
const app = express();
const transactionsController = require("./controllers/transactionsController");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/transactions", transactionsController);

app.get("*", (req, res) => {
  res.status(404).send("Not Found");
});

module.exports = app;
