const express = require("express");
const transactions = express.Router();
const transactionsData = require("../models/transactions");
const { v4: uuidv4 } = require('uuid');

const dataVerification = (req, res, next) => {
    const REQURE_INPUT_OBJECT_PAIRS = 4;
    const passedObj = { passed: true };

    const checkInputDataType = (type, objContainsSameType) => {
        for (const key in objContainsSameType) {
            if (typeof objContainsSameType[key] !== type)
                return { passed: false, invalid: key };
        }
        return passedObj;
    }

    const checkNameEmpty = (nameStr) => {
        if (!nameStr.trim())
            return { passed: false, invalid: "name can not be empty or spaces." };

        return passedObj;
    }

    const checkInputDateValid = (dateStr) => {
        const dateArr = dateStr.split("/");
        if (dateArr.length !== 3)
            return { passed: false, invalid: "invalid date format, please use mm/dd/yy." };

        for (const value of dateArr) {
            if (value.length !== 2)
                return { passed: false, invalid: "invalid date format, please use mm/dd/yy." };
        }

        const numYear = Number(dateArr[2]);
        if (!(numYear >= 20 && numYear <= 60))
            return { passed: false, invalid: "invalid year or exceeds the range." };

        const invalidDayObj = { passed: false, invalid: "invalid day." };
        const numDay = Number(dateArr[1]);
        const validDay = (min, max) => numDay >= min && numDay <= max ? passedObj : invalidDayObj;
        switch (dateArr[0]) {
            case "01":
            case "03":
            case "05":
            case "07":
            case "08":
            case "10":
            case "12":
                return validDay(1, 31);
            case "04":
            case "06":
            case "09":
            case "11":
                return validDay(1, 30);
            case "02":
                const year = 2000 + numYear;
                const leapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
                return leapYear ? validDay(1, 29) : validDay(1, 28);
            default:
                return { passed: false, invalid: "invalid month." };
        }
    }

    const checkInputNumberValid = (num) => {
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER)
            return { passed: false, invalid: "invalid number or the number exceeds range." };

        const decimalPart = num.toString().split(".")[1];
        if (!decimalPart || decimalPart.length <= 2)
            return passedObj;

        return { passed: false, invalid: "invalid decimal digits, more than 2 is not allowed." };
    }

    const checkTransaction = (inputObj, index) => {
        if (Object.keys(inputObj).length !== REQURE_INPUT_OBJECT_PAIRS)
            return res.status(400).json(`Keys at index ${index}, there are missing or additional pairs (key/value). Please submit again with correct format.`);

        const { date, name, amount, from } = inputObj;
        let result = checkInputDataType("string", { date, name, from });
        if (!result.passed) 
            return res.status(400).json(`Key ${result.invalid} at index ${index}, it is missing or its value is not a string.`);

        result = checkInputDataType("number", { amount });
        if (!result.passed)
            return res.status(400).json(`Key ${result.invalid} at index ${index}, it is missing or its value is not a number.`);

        result = checkNameEmpty(name);
        if (!result.passed)
            return res.status(400).json(`Key name at index ${index}, ${result.invalid}`);
    
        result = checkInputDateValid(date);
        if (!result.passed)
            return res.status(400).json(`Key date at index ${index}, ${result.invalid}`);

        result = checkInputNumberValid(amount);
        if (!result.passed)
            return res.status(400).json(`Key amount at index ${index}, ${result.invalid}`);
        
        return "passed";
    }

    const inputData = req.body;
    if (!inputData.length) {
        delete inputData.id;
        const result = checkTransaction(inputData, 0);
        return result === "passed" ? next() : null;
    }

    for (let i = 0; i < inputData.length; i++) {
        delete inputData[i].id;
        const result = checkTransaction(inputData[i], i);
        if (result !== "passed")
            return null;
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
        transactionsData.push({ ...tran, id: uuidv4() });
    });
    res.json(transactionsData.slice(index));
})

transactions.put("/:id", dataVerification, (req, res) => {
    const updateTransaction = (objData) => {
        const foundIndex = transactionsData.findIndex(tran => tran.id === id);
        if (foundIndex < 0)
            return res.redirect("/404");

        transactionsData[foundIndex] = { ...objData, id: transactionsData[foundIndex].id };
        return res.json([ transactionsData[foundIndex] ]);
    }

    const { id } = req.params;
    if (!id.includes(",")) {
        if (!req.body.length)
            return updateTransaction(req.body);

        if (req.body.length !== 1)
            return res.json(`Number of ID 1 does not match number of input ${req.body.length}`);

        return updateTransaction(req.body[0]);
    }

    const ids = id.split(",");
    if (ids.length !== req.body.length)
        return res.json(`Number of IDs ${ids.length} does not match number of input ${req.body.length}`);

    const transactionsArr = [];
    ids.forEach((id, i) => {
        const foundIndex = transactionsData.findIndex(tran => tran.id === id);
        if (foundIndex >= 0) {
            transactionsData[foundIndex] = { ...req.body[i], id: transactionsData[foundIndex].id };
            transactionsArr.push(transactionsData[foundIndex]);
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

        return res.json(transactionsData.splice(foundIndex, 1));
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
