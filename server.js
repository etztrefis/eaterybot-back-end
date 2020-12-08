const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminController = require("./app/controller/admins.controller");

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
	res.json("redirect test");
});

app.get("/api/admins/", adminController.findAll);
app.get("/api/admins/:username", adminController.findOne);

app.get("/api/admins/create/:username/:password", adminController.create);

const db = require("./app/models");
db.sequelize.sync().then(() => {
	console.log("Database sync.");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is runnung on port ${PORT}`);
});
