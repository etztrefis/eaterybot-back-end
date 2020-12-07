const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
	const Admin = sequelize.define("Admin", {
		login: {
			type: Sequelize.STRING,
		},
		password: {
			type: Sequelize.STRING,
		},
		availialbe: {
			type: Sequelize.BOOLEAN,
		},
	});

	return Admin;
};
