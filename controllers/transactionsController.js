const express = require("express");
const transactions = express.Router();
const transactionsData = require("../models/transactions");

transactions.get("/", (req, res) => {
    res.json([transactionsData[0]])
})

module.exports = transactions;
