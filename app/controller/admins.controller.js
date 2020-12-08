const db = require("../models");
const Op = db.Sequelize.Op;

// Create and Save a new Admin
exports.create = async (req, res) => {
	await db.admins
		.create({
			Login: req.params.username,
			Password: req.params.password,
			Availialbe: true,
		})
		.then(() => {
			res.sendStatus(200);
		})
		.catch(() => {
			res.sendStatus(404);
		});
};

// Retrieve all Admins from the database.
exports.findAll = async (req, res) => {
	await db.admins.findAll().then((getAdmins) => {
		res.json(getAdmins);
	});
};

// Find a single Admin with an username
exports.findOne = async (req, res) => {
	await db.admins
		.findOne({ where: { Login: { [Op.eq]: req.params.username } } })
		.then((getAdmin) => {
			res.json(getAdmin);
		});
};

// Update an Admin by the id in the request
exports.update = (req, res) => {};

// Delete an Admin with the specified id in the request
exports.delete = (req, res) => {};

// Find all availiable Admins
exports.findAllAvailiable = (req, res) => {};
