require("dotenv").config();

module.exports = {
	HOST: process.env.SERVERNAME,
	USER: process.env.USERNAME,
	PASSWORD: process.env.PASSWORD,
	DB: process.env.DBNAME,
	dialect: "mysql",
	pool: {
		max: 15,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
};
