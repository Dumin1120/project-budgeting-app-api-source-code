// Dependencies
const express = require("express");
const cors = require("cors");
const path = require("path"); // used tutorial to send html file at https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files

// Configuration
const app = express();
const transactionsController = require("./controllers/transactionsController");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/doc.html"));
});

app.use("/transactions", transactionsController);

app.get("*", (req, res) => {
  res.status(404).send("Not Found");
});

module.exports = app;
