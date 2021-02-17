const db = require("../models");
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const cryptoJS = require("crypto-js");
require("dotenv").config({ path: "../../.env" });

// Retrieve all products from the database.
exports.findAll = async (req, res) => {
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
            res.status(200).send({ type: "OK", message: getProducts })
          });
      }
    });
  } else {
    return res.status(403).send({ type: "Error", message: "Authorization token required" })
  }
};

// Create and Save a new product
exports.create = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN, async (err) => {
      if (err) {
        return res.status(403).send({ type: "error", message: "Invalid token" })
      } else {
        await db.products
          .findAll({
            where: { Name: { [Op.eq]: req.params.name } },
          })
          .then(async (value) => {
            if (value == "") {
              let units;
              if (req.params.units == 1) {
                units = "кг.";
              } else if (req.params.units == 2) {
                units = "шт."
              } else if (req.params.units == 3) {
                units = "литр."
              } else {
                units = "кг.";
              }
              await db.products
                .create({
                  Name: req.params.name,
                  Amount: req.params.amount,
                  MeasurmentUnits: units,
                })
                .then(async () => {
                  return res.status(200).send({ type: "OK", message: "Successfully created" });
                })
            } else {
              return res.status(404).send({ type: "Error", message: "Already exists." });
            }
          })
          .catch(() => {
            return res.status(404).send({ type: "Error", message: "Error while admin searching" });
          });
      }
    });
  } else {
    return res.status(403).send({ type: "Error", message: "Authorization token required" })
  }
};

// Delete a product with the specified id in the request
exports.delete = (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN, async (err) => {
      if (err) {
        console.log(err);
        return res.status(403).send({ type: "Error", message: "Invalid token" })
      } else {
        let respID = parseInt(req.params.id, 10);
        await db.products.findOne({ where: { ProductID: { [Op.eq]: respID } } })
          .then(async (getProduct) => {
            if (getProduct == null) {
              res.status(403).send({ type: "Error", message: "Product doesn't exists" })
            } else {
              await db.products
                .destroy({ where: { ProductID: { [Op.eq]: respID } } })
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
