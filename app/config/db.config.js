require("dotenv").config();

module.exports = {
	HOST: "sql25.your-server.de",
	USER: "trefis",
	PASSWORD: "rMkp89hJ9d8765F1",
	DB: "eaterymain",
	dialect: "mysql",
	pool: {
		max: 15,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
};
