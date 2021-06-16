const express = require("express");
const transactions = express.Router();
const transactionsData = require("../models/transactions");

const dataVerification = (req, res, next) => {
    next();
}

transactions.get("/", (req, res) => {
    res.json(transactionsData);
})

transactions.get("/:id", (req, res) => {
    const { id } = req.params;
    transactionsData[id - 1] ? res.json(transactionsData[id - 1]) : res.redirect("/404");
})

transactions.post("/", dataVerification, (req, res) => {
    transactionsData.push(req.body);
    res.json(transactionsData[transactionsData.length - 1]);
})

transactions.put("/:id", dataVerification, (req, res) => {
    const { id } = req.params;
    if (!transactionsData[id - 1])
        return res.redirect("/404");

    transactionsData[id - 1] = req.body;
    res.json(transactionsData[id - 1]);
})

transactions.delete("/:id", (req, res) => {
    const { id } = req.params;
    if (!transactionsData[id - 1])
        return res.redirect("/404");

    const deleted = transactionsData.splice(id - 1, 1);
    res.json(deleted);
})

module.exports = transactions;
