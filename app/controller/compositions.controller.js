const db = require("../models");
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

exports.findAll = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN, async (err) => {
            if (err) {
                console.log(err);
                return res.status(403).send({ type: "Error", message: "Invalid token" })
            } else {
                await db.dishes
                    .findAll()
                    .then((getDishes) => {
                        res.status(200).send({ type: "OK", message: getDishes })
                    });
            }
        });
    } else {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
    }
};