const express = require("express");
const transactions = express.Router();
const transactionsData = require("../models/transactions");
const { v4: uuidv4 } = require('uuid');

const dataVerification = (req, res, next) => {
    next();
}

transactions.get("/", (req, res) => {
    res.json(transactionsData);
})

transactions.get("/:id", (req, res) => {
    const { id } = req.params;
    const found = transactionsData.find(tran => tran.id === id);
    found ? res.json(found) : res.redirect("/404");
})

transactions.post("/", dataVerification, (req, res) => {
    transactionsData.push({ ...req.body, id: uuidv4() });
    res.json(transactionsData[transactionsData.length - 1]);
})

transactions.put("/:id", dataVerification, (req, res) => {
    const { id } = req.params;
    const foundIndex = transactionsData.findIndex(tran => tran.id === id);
    if (foundIndex < 0)
        return res.redirect("/404");

    transactionsData[foundIndex] = { ...req.body, id: transactionsData[foundIndex].id };
    res.json(transactionsData[foundIndex]);
})

transactions.delete("/:id", (req, res) => {
    const { id } = req.params;
    const foundIndex = transactionsData.findIndex(tran => tran.id === id);
    if (foundIndex < 0)
        return res.redirect("/404");

    const deleted = transactionsData.splice(foundIndex, 1);
    res.json(deleted);
})

module.exports = transactions;
