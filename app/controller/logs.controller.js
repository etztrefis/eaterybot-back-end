const db = require("../models");
const jwt = require("jsonwebtoken");
const cryptoJS = require("crypto-js");
require("dotenv").config({ path: "../../.env" });
const Op = db.Sequelize.Op;

// Create and Save a new Admin
exports.findAll = async (req, res) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
	  const token = authHeader.split(" ")[1];
	  jwt.verify(token, process.env.TOKEN, async (err) => {
		if (err) {
		  return res.status(403).send({ type: "Error", message: "Authorization token required" })
		} else {
		  await db.logs.findAll().then((getLogs) => {
			res.status(200).send(getLogs);
		  });
		}
	  });
	} else {
	  return res.status(403).send({ type: "Error", message: "Authorization token required" })
	}
};