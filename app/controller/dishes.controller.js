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

// Create and Save a new dish
exports.create = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN, async (err) => {
            if (err) {
                return res.status(403).send({ type: "Error", message: "Invalid token" })
            } else {
                await db.dishes
                    .findAll({
                        where: { Name: { [Op.eq]: req.params.name } },
                    })
                    .then(async (value) => {
                        if (value.toString() === "") {
                            let energy = parseFloat(req.params.energy);
                            let price = parseFloat(req.params.price);
                            await db.dishes
                                .create({
                                    DishID: req.params.id,
                                    Name: req.params.name,
                                    EnergyValue: energy,
                                    Price: price,
                                })
                                .then(() => {
                                    res.status(200).send({ type: "OK", message: "Successfully created" });
                                    db.logs.create({
                                        Action: "CREATE",
                                        Table: "Dishes",
                                        Login: req.params.sender
                                      })
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
                            res.status(403).send({ type: "Error", message: "Dish doesn't exists" })
                        } else {
                            await db.dishes
                                .destroy({ where: { DishID: { [Op.eq]: dishID } } })
                                .then(() => {
                                    res.status(200).send({ type: "OK", message: "Successfully deleted" })
                                    db.logs.create({
                                        Action: "DELETE",
                                        Table: "Dishes",
                                        Login: req.params.sender
                                      })
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
                                    db.logs.create({
                                        Action: "UPDATE",
                                        Table: "Dishes",
                                        Login: req.params.sender
                                      })
                                })
                                .catch((e) => {
                                    console.log(e);
                                    res.status(403).send({ type: "Error", message: "Error while updating" })
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