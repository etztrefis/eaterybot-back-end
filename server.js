require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminController = require("./app/controller/admins.controller");
const codesController = require("./app/controller/codes.controller");
const productsConrtoller = require("./app/controller/products.controller");
const dishesController = require("./app/controller/dishes.controller");
const compositionsController = require("./app/controller/compositions.controller");

const app = express();

const corsOptions = {
	origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.redirect("/api/");
});

app.get("/api", (req, res) => {
	res.status(200).send({ type: "OK", message: "API endpoint" });
});

app.get("/api/admins/", adminController.findAll);
app.get("/api/admins/:username/:password", adminController.findOne);
app.get("/api/admins/create/:username/:password/:code", adminController.create);

app.get("/api/codes/:code", codesController.findAll);
app.get("/api/codes/", codesController.findAllCodes);

app.get("/api/products/", productsConrtoller.findAll);
app.get("/api/products/less/", productsConrtoller.findAllLess);
app.get("/api/products/create/:name/:amount/:units", productsConrtoller.create);
app.get("/api/products/delete/:id", productsConrtoller.delete);
app.get("/api/products/update/:id/:name/:amount/:units", productsConrtoller.update);

app.get("/api/dishes/", dishesController.findAll);
app.get("/api/dishes/create/:id/:name/:energy/:price", dishesController.create);
app.get("/api/dishes/delete/:id", dishesController.delete);
app.get("/api/dishes/update/:id/:name/:energy/:price", dishesController.update);

app.get("/api/compositions/", compositionsController.findAll);
// app.get("/api/compositions/create/:did/:pid/:amount/", compositionsController.create);
// app.get("/api/compositions/delete/:did/:pid", compositionsController.delete);
// app.get("/api/compositions/update/:did/:pid/:amount/", compositionsController.update);

const db = require("./app/models");
db.sequelize.sync().then(() => {
	console.log("Database sync.");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is runnung on port ${PORT}`);
});
