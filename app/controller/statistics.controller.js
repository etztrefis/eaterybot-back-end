const db = require("../models");
const jwt = require("jsonwebtoken");
const cryptoJS = require("crypto-js");
require("dotenv").config({ path: "../../.env" });
const Op = db.Sequelize.Op;

// Retrive all Dish.Name | Amount per day from orders_logs
exports.getDishesStats = (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN, async (err) => {
            if (err) {
                console.log(err);
                return res.status(403).send({ type: "Error", message: "Invalid token" })
            } else {
                await db.sequelize.query
                    (`SELECT d.Name, COUNT(o.DishID) AS "Amount"
                    FROM Orders_Logs o
                    INNER JOIN Dishes d ON o.DishID = d.DishID
                    GROUP BY d.DishID LIMIT 10`)
                    .then((getDishesStats) => {
                        res.status(200).send({ type: "OK", message: getDishesStats[0] })
                    })
                    .catch(() => {
                        res.status(403).send({ type: "Error", message: "Error while selecting" })
                    })
            }
        });
    } else {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
    }
};

// Retrive amount of users messages per day from messages_logs
exports.getUsersMessagesStats = (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN, async (err) => {
            if (err) {
                console.log(err);
                return res.status(403).send({ type: "Error", message: "Invalid token" })
            } else {
                await db.sequelize.query
                    (`SELECT DATE(m.Date) AS 'day',  COUNT(m.Message) AS 'amount'
                    FROM Messages_Logs m
                    GROUP BY DAY(m.Date) LIMIT 10`)
                    .then((getMessagesStats) => {
                        res.status(200).send({ type: "OK", message: getMessagesStats[0] })
                    })
                    .catch(() => {
                        res.status(403).send({ type: "Error", message: "Error while selecting" })
                    })
            }
        });
    } else {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
    }
};

// Retrive amount of ordered dishes per day from orders_logs
exports.getMenuDishesStats = (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN, async (err) => {
            if (err) {
                console.log(err);
                return res.status(403).send({ type: "Error", message: "Invalid token" })
            } else {
                await db.sequelize.query
                    (`SELECT DATE(o.Date) AS 'day',  COUNT(o.ID) AS 'amount'
                    FROM Orders_Logs o
                    GROUP BY DAY(o.Date) LIMIT 10`)
                    .then((getMenuDishesStats) => {
                        res.status(200).send({ type: "OK", message: getMenuDishesStats[0] })
                    })
                    .catch(() => {
                        res.status(403).send({ type: "Error", message: "Error while selecting" })
                    })
            }
        });
    } else {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
    }
};

// Retrive get all admins action per day from API_logs table
exports.getAdminActions = (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN, async (err) => {
            if (err) {
                console.log(err);
                return res.status(403).send({ type: "Error", message: "Invalid token" })
            } else {
                await db.sequelize.query
                    (`SELECT COUNT(a.Action) as 'actions',  a.Login AS 'login'
                    FROM API_Logs a
                    GROUP BY a.Login LIMIT 10`)
                    .then((getAdminActionsStats) => {
                        res.status(200).send({ type: "OK", message: getAdminActionsStats[0] })
                    })
                    .catch(() => {
                        res.status(403).send({ type: "Error", message: "Error while selecting" })
                    })
            }
        });
    } else {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
    }
};