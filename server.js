require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminController = require("./app/controller/admins.controller");
const codesController = require("./app/controller/codes.controller");

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

const db = require("./app/models");
db.sequelize.sync().then(() => {
	console.log("Database sync.");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is runnung on port ${PORT}`);
});
