const db = require("../models");
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

// Retrieve all products from the database where amount =< 10
exports.findAllLess = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN, async (err) => {
      if (err) {
        console.log(err);
        return res.status(403).send({ type: "Error", message: "Invalid token" })
      } else {
        await db.products
          .findAll({ where: { Amount: { [Op.lte]: 10 } } })
          .then((getProducts) => {
            res.status(200).send({ type: "OK", message: getProducts })
          });
      }
    });
  } else {
    return res.status(403).send({ type: "Error", message: "Authorization token required" })
  }
};

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
        return res.status(403).send({ type: "Error", message: "Invalid token" })
      } else {
        await db.products
          .findAll({
            where: { Name: { [Op.eq]: req.params.name } },
          })
          .then(async (value) => {
            if (value.toString() === "") {
              await db.products
                .create({
                  Name: req.params.name,
                  Amount: req.params.amount,
                  MeasurmentUnits: req.params.units,
                })
                .then(() => {
                  res.status(200).send({ type: "OK", message: "Successfully created" });
                  db.logs.create({
                    Action: "CREATE",
                    Table: "Products",
                    Login: req.params.sender
                  })
                })
                .catch((e) => {
                  console.log(e);
                  return res.status(404).send({ type: "Error", message: "Error while product creating" });
                })
            } else {
              return res.status(404).send({ type: "Error", message: "Already exists." });
            }
          })
          .catch((e) => {
            console.log(e)
            return res.status(404).send({ type: "Error", message: "Error while product searching" });
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
                  db.logs.create({
                    Action: "DELETE",
                    Table: "Products",
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

//Update specified product
exports.update = (req, res) => {
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
          .then((project) => {
            if (project) {
              project.update({
                Name: req.params.name,
                Amount: req.params.amount,
                MeasurmentUnits: req.params.units,
              })
                .then(() => {
                  res.status(200).send({ type: "OK", message: "Successfully updated" })
                  db.logs.create({
                    Action: "UPDATE",
                    Table: "Products",
                    Login: req.params.sender
                  })
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