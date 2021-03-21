const db = require("../models");
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

// Retrieve menu from the database.
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
						res.status(403).send({ type: "Error", message: "Error while selecting" })
					})
			}
		});
	} else {
		return res.status(403).send({ type: "Error", message: "Authorization token required" })
	}
};

// Create and Save a new row into menu table
exports.create = async (req, res) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, process.env.TOKEN, async (err) => {
			if (err) {
				return res.status(403).send({ type: "error", message: "Invalid token" })
			} else {
				let dayOfWeek;
				if (req.params.dayofweek == "Понедельник") {
					dayOfWeek = 1
				} else if (req.params.dayofweek == "Вторник") {
					dayOfWeek = 2
				} else if (req.params.dayofweek == "Среда") {
					dayOfWeek = 3
				} else if (req.params.dayofweek == "Четверг") {
					dayOfWeek = 4
				} else if (req.params.dayofweek == "Пятница") {
					dayOfWeek = 5
				}

				await db.dishes.findOne({ where: { Name: { [Op.eq]: req.params.dishid } } })
					.then(async (getDish) => {
						await db.menu
							.findAll({
								where: { DayOfWeek: { [Op.eq]: dayOfWeek }, DishID: { [Op.eq]: getDish.DishID } },
							})
							.then(async (value) => {
								if (value.toString() === "") {
									await db.menu
										.create({
											DayOfWeek: dayOfWeek,
											DishID: getDish.DishID
										})
										.then(() => {
											res.status(200).send({ type: "OK", message: "Successfully created" });
											db.logs.create({
												Action: "CREATE",
												Table: "Menu",
												Login: req.params.sender
											  })
										})
										.catch((e) => {
											console.log(e);
											return res.status(404).send({ type: "Error", message: "Error while row creating" });
										})
								} else {
									return res.status(404).send({ type: "Error", message: "Already exists." });
								}
							})
							.catch((e) => {
								console.log(e)
								return res.status(404).send({ type: "Error", message: "Error while searching" });
							});
					})

			}
		});
	} else {
		return res.status(403).send({ type: "Error", message: "Authorization token required" })
	}
};

// Delete a menu row with the specified id in the request
exports.delete = (req, res) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, process.env.TOKEN, async (err) => {
			if (err) {
				console.log(err);
				return res.status(403).send({ type: "Error", message: "Invalid token" })
			} else {

				let dayOfWeek;
				if (req.params.dayofweek == "Понедельник") {
					dayOfWeek = 1
				} else if (req.params.dayofweek == "Вторник") {
					dayOfWeek = 2
				} else if (req.params.dayofweek == "Среда") {
					dayOfWeek = 3
				} else if (req.params.dayofweek == "Четверг") {
					dayOfWeek = 4
				} else if (req.params.dayofweek == "Пятница") {
					dayOfWeek = 5
				}

				await db.dishes.findOne({ where: { Name: { [Op.eq]: req.params.dishid } } })
					.then(async (getDish) => {
						await db.menu
							.findOne({
								where: { DayOfWeek: { [Op.eq]: dayOfWeek }, DishID: { [Op.eq]: getDish.DishID } },
							})
							.then(async getDishID => {
								await db.menu.findAll({ where: { DayOfWeek: { [Op.eq]: dayOfWeek }, DishID: { [Op.eq]: getDishID.DishID } } })
									.then(async (getMenu) => {
										if (getMenu == null) {
											res.status(403).send({ type: "Error", message: "Menu doesn't exists" })
										} else {
											await db.menu
												.destroy({ where: { DayOfWeek: { [Op.eq]: dayOfWeek }, DishID: { [Op.eq]: getDishID.DishID } } })
												.then(() => {
													res.status(200).send({ type: "OK", message: "Successfully deleted" })
													db.logs.create({
														Action: "DELETE",
														Table: "Menu",
														Login: req.params.sender
													  })
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
							})
					})
			}
		});
	} else {
		return res.status(403).send({ type: "Error", message: "Authorization token required" })
	}
};

// Retrive all products from another database table for future use in menu lookup
exports.findAllProducts = (req, res) => {
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
					.then((getProducts) => {
						let obj = {};
						let i = 1;
						for (const product in getProducts) {
							obj[getProducts[product].Name] = getProducts[product].Name;
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

// DELETE FROM Menu table
exports.destroyAll = (req, res) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, process.env.TOKEN, async (err) => {
			if (err) {
				console.log(err);
				return res.status(403).send({ type: "Error", message: "Invalid token" })
			} else {
				await db.dishes
					.destroy()
					.then((getProducts) => {
						res.status(200).send({ type: "OK", message: obj })
						db.logs.create({
							Action: "DELETE ALL",
							Table: "Menu",
							Login: req.params.sender
						  })
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

// Retrive menu by day of week
exports.findByDay = async (req, res) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, process.env.TOKEN, async (err) => {
			if (err) {
				console.log(err);
				return res.status(403).send({ type: "Error", message: "Invalid token" })
			} else {
				await db.sequelize.query
					(`SELECT Dishes.Name, Dishes.EnergyValue, Dishes.Price
					FROM Menu
					INNER JOIN Dishes ON Dishes.DishID = Menu.DishID
				 	WHERE Menu.DayOfWeek = ${req.params.day}`)
					.then((getMenu) => {
						if(getMenu.toString() == ","){
							res.status(403).send({ type: "Error", message: 'No menu for specified day.' })
						}else{
							res.status(200).send({ type: "OK", message: getMenu[0] })
						}
					})
					.catch((e) => {
						console.log(e);
						res.status(403).send({ type: "Error", message: "Error while selecting" })
					})
			}
		});
	} else {
		return res.status(403).send({ type: "Error", message: "Authorization token required" })
	}
};