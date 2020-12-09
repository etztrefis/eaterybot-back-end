const db = require("../models");
const Op = db.Sequelize.Op;

// Retrieve all codes from the database.
exports.findAll = async (req, res) => {
	await db.codes
		.findAll({ where: { Code: { [Op.eq]: req.params.code } } })
		.then((getCode) => {
			if (getCode == "") {
				res.sendStatus(404);
			} else {
				res.sendStatus(200);
			}
		});
};
// Update a code by the id in the request
exports.update = (req, res) => {};

// Delete a code with the specified id in the request
exports.delete = (req, res) => {};

// Find all availiable codes
exports.findAllCodes = async (req, res) => {
	await db.codes.findAll().then((getCode) => {
		res.json(getCode);
	});
};
