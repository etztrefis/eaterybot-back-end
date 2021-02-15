const db = require("../models");
const Op = db.Sequelize.Op;

// Retrieve all codes from the database.
exports.findAll = async (req, res) => {
    await db.products
        .findAll()
        .then((getProducts) => {
            res.status(200).send({type:"OK", message: getProducts})
        })
};

// Create and Save a new Admin
exports.create = async (req, res) => {};

// Update a code by the id in the request
exports.update = (req, res) => {};

// Delete a code with the specified id in the request
exports.delete = (req, res) => {};
