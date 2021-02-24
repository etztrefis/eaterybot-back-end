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
						res.status(200).send({ type: "OK", message: getProducts[0] })
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
				let dayofweek = parseInt(req.params.dayofweek, 10);
				let dishid = parseInt(req.params.dishid, 10);
				await db.menu
					.findAll({
						where: { DayOfWeek: { [Op.eq]: dayofweek }, DishID: { [Op.eq]: dishid } },
					})
					.then(async (value) => {
						if (value.toString() === "") {
							await db.menu
								.create({
									DayOfWeek: dayofweek,
									DishID: dishid
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
						return res.status(404).send({ type: "Error", message: "Error while searching" });
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
				let dayofweek = parseInt(req.params.dayofweek, 10);
				let dishid = parseInt(req.params.dishid, 10);
				await db.menu.findAll({ where: { DayOfWeek: { [Op.eq]: dayofweek }, DishID: { [Op.eq]: dishid } } })
					.then(async (getMenu) => {
						if (getMenu == null) {
							res.status(403).send({ type: "Error", message: "Menu doesn't exists" })
						} else {
							await db.menu
								.destroy({ where: { DayOfWeek: { [Op.eq]: dayofweek }, DishID: { [Op.eq]: dishid } } })
								.then(() => {
									res.status(200).send({ type: "OK", message: "Successfully deleted" })
								})
								.catch((e) => {
									res.status(403).send({ type: "Error", message: "Eror while deleting", stack: e })
								})
						}
					})
					.catch(e => {
						console.log(e);
						res.status(403).send({ type: "Error", message: "Error while searching" });
					});
			}
		});
	} else {
		return res.status(403).send({ type: "Error", message: "Authorization token required" })
	}
};

exports.findAllProducts = (req, res) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, process.env.TOKEN, async (err) => {
			if (err) {
				console.log(err);
				return res.status(403).send({ type: "Error", message: "Invalid token" })
			} else {
				await db.products
					.findAll()
					.then((getProducts) => {
						let obj = {};
						let i = 1;
						for (const product in getProducts) {
							obj[i] = getProducts[product].Name;
							i++;
						}
						res.status(200).send({ type: "OK", message: obj })
					})
					.catch((e) => {
						console.log(e);
						return res.status(403).send({ type: "Error", message: "Error while fetching" })
					})
			}
		});
	} else {
		return res.status(403).send({ type: "Error", message: "Authorization token required" })
	}
};