const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
	const Admin = sequelize.define(
		"Admin",
		{
			Login: {
				type: Sequelize.STRING,
			},
			Password: {
				type: Sequelize.STRING,
			},
			Availiable: {
				type: Sequelize.BOOLEAN,
			},
		},
		{ timestamps: false }
	);

	return Admin;
};
