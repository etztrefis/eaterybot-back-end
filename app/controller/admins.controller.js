const db = require("../models");
const jwt = require("jsonwebtoken");
const cryptoJS = require("crypto-js");
require("dotenv").config({ path: "../../.env" });
const Op = db.Sequelize.Op;

// Create and Save a new Admin
exports.create = async (req, res) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];

		jwt.verify(token, process.env.TOKEN, async (err) => {
			if (err) {
				return res.sendStatus(403);
			} else {
				await db.admins
					.findAll({
						where: { Login: { [Op.eq]: req.params.username } },
					})
					.then(async (value) => {
						if (value == "") {
							await db.admins
								.create({
									Login: req.params.username,
									Password: req.params.password,
									Availialbe: true,
								})
								.then(async () => {
									await db.codes.update(
										{ Available: false },
										{ where: { Code: req.params.code } }
									);
									return res.sendStatus(200);
								})
								.catch(() => {
									return res.sendStatus(404);
								});
						} else {
							return res.json({ message: "Already exists." });
						}
					})
					.catch(() => {
						return res.sendStatus(404);
					});
			}
		});
	}
};

// Retrieve all Admins from the database.
exports.findAll = async (req, res) => {
	await db.admins.findAll().then((getAdmins) => {
		res.json(getAdmins);
	});
};

// Find a single Admin with indicated username and password
exports.findOne = async (req, res) => {
	await db.admins
		.findOne({
			where: {
				Login: { [Op.eq]: req.params.username },
				Availiable: { [Op.eq]: true },
			},
		})
		.then((getAdmin) => {
			if (getAdmin == null) {
				res.sendStatus(404);
			} else {
				const responseBytes = cryptoJS.AES.decrypt(
					req.params.password,
					process.env.REACT_APP_CRYPT
				);
				const databadeBytes = cryptoJS.AES.decrypt(
					getAdmin["Password"],
					process.env.REACT_APP_CRYPT
				);

				const originalResponse = responseBytes.toString(
					cryptoJS.enc.Utf8
				);
				const originalDataBase = databadeBytes.toString(
					cryptoJS.enc.Utf8
				);

				if (originalResponse === originalDataBase) {
					res.json(Math.floor(Math.random() * 16777215).toString(16));
				} else {
					res.sendStatus(404);
				}
			}
		})
		.catch((e) => {
			 console.log(e);
			res.sendStatus(404);
		});
};

// Update an Admin by the id in the request
exports.update = (req, res) => {};

// Delete an Admin with the specified id in the request
exports.delete = (req, res) => {};

// Find all availiable Admins
exports.findAllAvailiable = (req, res) => {};
