const express = require("express");
const transactions = express.Router();
const transactionsData = require("../models/transactions");
const { v4: uuidv4 } = require('uuid');

const dataVerification = (req, res, next) => {
    const REQURE_INPUT_OBJECT_PAIRS = 4;

    const checkInputDataType = (type, objContainsSameType) => {
        for (const key in objContainsSameType) {
            if (typeof objContainsSameType[key] !== type)
                return { passed: false, invalid: key };
        }
        return { passed: true };
    }

    const checkTransaction = (inputObj, index) => {
        if (Object.keys(inputObj).length !== REQURE_INPUT_OBJECT_PAIRS)
            return res.status(400).send(`There are missing or additional pairs(key/value) at index ${index}. Please submit again with correct pairs.`);

        const { date, name, amount, from } = inputObj;
        let validateResult = null;

        validateResult = checkInputDataType("string", { date, name, from });
        if (!validateResult.passed) 
            return res.status(400).send(`Opps, Key ${validateResult.invalid} at Index ${index} is missing or its value is not a string`);

        validateResult = checkInputDataType("number", { amount });
        if (!validateResult.passed)
            return res.status(400).send(`Opps, Key ${validateResult.invalid} at Index ${index} is missing or its value is not a number`);
        
        return "passed";
    }

    const inputData = req.body;
    if (!inputData.length) {
        const result = checkTransaction(inputData, 0);
        return result === "passed" ? next() : null;
    }

    for (let i = 0; i < inputData.length; i++) {
        const result = checkTransaction(inputData[i], i);
        if (result !== "passed")
            return;
    }

    next();
}

transactions.get("/", (req, res) => {
    res.json(transactionsData);
})

transactions.get("/:id", (req, res) => {
    const { id } = req.params;
    if (!id.includes(",")) {
        const found = transactionsData.find(tran => tran.id === id);
        return found ? res.json([ found ]) : res.redirect("/404");
    }

    const ids = id.split(",");
    const transactionsArr = [];
    ids.forEach(id => {
        const found = transactionsData.find(tran => tran.id === id);
        found ? transactionsArr.push(found) : null;
    })
    res.json(transactionsArr);
})

transactions.post("/", dataVerification, (req, res) => {
    if (!req.body.length) {
        transactionsData.push({ ...req.body, id: uuidv4() });
        return res.json([ transactionsData[transactionsData.length - 1] ]);
    }

    const index = transactionsData.length;
    req.body.forEach(tran => {
        transactionsData.push({ ...tran, id: uuidv4() })
    });
    return res.json(transactionsData.slice(index));
})

transactions.put("/:id", dataVerification, (req, res) => {
    const { id } = req.params;
    if (!id.includes(",")) {
        const foundIndex = transactionsData.findIndex(tran => tran.id === id);
        if (foundIndex < 0)
            return res.redirect("/404");
    
        transactionsData[foundIndex] = { ...req.body, id: transactionsData[foundIndex].id };
        return res.json(transactionsData[foundIndex]);
    }

    const ids = id.split(",");
    if (ids.length !== req.body.length)
        return res.send(`Number of IDs ${ids.length} does not match number of input ${req.body.length}`);

    const transactionsArr = [];
    ids.forEach((id, i) => {
        const foundIndex = transactionsData.findIndex(tran => tran.id === id);
        if (foundIndex >= 0) {
            transactionsData[foundIndex] = { ...req.body[i], id: transactionsData[foundIndex].id };
            transactionsArr.push(transactionsData[foundIndex])
        }
    })
    res.json(transactionsArr);
})

transactions.delete("/:id", (req, res) => {
    const { id } = req.params;
    if (!id.includes(",")) {
        const foundIndex = transactionsData.findIndex(tran => tran.id === id);
        if (foundIndex < 0)
            return res.redirect("/404");
    
        const deleted = transactionsData.splice(foundIndex, 1);
        return res.json(deleted[0]);
    }

    const ids = id.split(",");
    const transactionsArr = [];
    ids.forEach(id => {
        const foundIndex = transactionsData.findIndex(tran => tran.id === id);
        if (foundIndex >= 0) {
            transactionsArr.push(transactionsData.splice(foundIndex, 1)[0]);
        }
    })
    res.json(transactionsArr);
})

module.exports = transactions;
