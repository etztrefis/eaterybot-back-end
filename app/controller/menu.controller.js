const db = require("../models");
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

// Retrieve all dishes from the database.
exports.findAll = async (req, res) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, process.env.TOKEN, async (err) => {
			if (err) {
				console.log(err);
				return res.status(403).send({ type: "Error", message: "Invalid token" })
			} else {
				await db.sequelize.query
					(`SELECT Menu.DayOfWeek, Dishes.Name
                    FROM Menu
                    INNER JOIN Dishes ON Dishes.DishID = Menu.DishID
					ORDER BY Menu.DayOfWeek ASC`)
					.then((getProducts) => {
						for (const [key, value] of Object.entries(getProducts[0])) {
							if (value.DayOfWeek == 1) {
								value.DayOfWeek = "Понедельник"
							} else if (value.DayOfWeek == 2) {
								value.DayOfWeek = "Вторник"
							} else if (value.DayOfWeek == 3) {
								value.DayOfWeek = "Среда"
							} else if (value.DayOfWeek == 4) {
								value.DayOfWeek = "Четверг"
							} else if (value.DayOfWeek == 5) {
								value.DayOfWeek = "Пятница"
							}
						}
						res.status(200).send({ type: "OK", message: getProducts })
					})
					.catch((e) => {
						console.log(e);
						res.status(403).send({ type: "OK", message: "Error while selecting" })
					})
			}
		});
	} else {
		return res.status(403).send({ type: "Error", message: "Authorization token required" })
	}
};

// Create and Save a new dish
exports.create = async (req, res) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, process.env.TOKEN, async (err) => {
			if (err) {
				return res.status(403).send({ type: "error", message: "Invalid token" })
			} else {
				await db.dishes
					.findAll({
						where: { Name: { [Op.eq]: req.params.name } },
					})
					.then(async (value) => {
						if (value.toString() === "") {
							let energy = parseFloat(req.params.energy, 10);
							let price = parseFloat(req.params.price, 10);
							await db.dishes
								.create({
									DishID: req.params.id,
									Name: req.params.name,
									EnergyValue: energy,
									Price: price,
								})
								.then(() => {
									return res.status(200).send({ type: "OK", message: "Successfully created" });
								})
								.catch((e) => {
									console.log(e);
									return res.status(404).send({ type: "Error", message: "Error while dish creating" });
								})
						} else {
							return res.status(404).send({ type: "Error", message: "Already exists." });
						}
					})
					.catch((e) => {
						console.log(e)
						return res.status(404).send({ type: "Error", message: "Error while dish searching" });
					});
			}
		});
	} else {
		return res.status(403).send({ type: "Error", message: "Authorization token required" })
	}
};

// Delete a dish with the specified id in the request
exports.delete = (req, res) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, process.env.TOKEN, async (err) => {
			if (err) {
				console.log(err);
				return res.status(403).send({ type: "Error", message: "Invalid token" })
			} else {
				let dishID = parseInt(req.params.id, 10);
				await db.dishes.findOne({ where: { DishID: { [Op.eq]: dishID } } })
					.then(async (getDish) => {
						if (getDish == null) {
							res.status(403).send({ type: "Error", message: "Product doesn't exists" })
						} else {
							await db.dishes
								.destroy({ where: { DishID: { [Op.eq]: dishID } } })
								.then(() => {
									res.status(200).send({ type: "OK", message: "Successfully deleted" })
								})
								.catch((e) => {
									res.status(404).send({ type: "Error", message: "Eror while deleting", stack: e })
								})
						}
					})
			}
		});
	} else {
		return res.status(403).send({ type: "Error", message: "Authorization token required" })
	}
};

//Update specified dish
exports.update = (req, res) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, process.env.TOKEN, async (err) => {
			if (err) {
				console.log(err);
				return res.status(403).send({ type: "Error", message: "Invalid token" })
			} else {
				let dishID = parseInt(req.params.id, 10);
				let energy = parseFloat(req.params.energy);
				let price = parseFloat(req.params.price);
				await db.dishes.findOne({ where: { DishID: { [Op.eq]: dishID } } })
					.then((project) => {
						if (project) {
							project.update({
								Name: req.params.name,
								EnergyValue: energy,
								Price: price,
							}, {
								where: {
									DishID: null
								}
							})
								.then(() => {
									res.status(200).send({ type: "OK", message: "Successfully updated" })
								})
								.catch((e) => {
									console.log(e);
									res.status(403).send({ type: "OK", message: "Error while updating" })
								})
						} else {
							res.status(403).send({ type: "OK", message: "Error while searching" })
						}
					});
			}
		});
	} else {
		return res.status(403).send({ type: "Error", message: "Authorization token required" })
	}
};