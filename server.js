const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
	origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.json({ message: "Welcome to trefis`s test." });
});

const PORT = process.env.POST || 8080;
app.listen(PORT, () => {
	console.log(`Server is runnung on port ${PORT}`);
});
