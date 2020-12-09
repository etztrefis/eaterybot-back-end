const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
	const Code = sequelize.define(
		"ValidationCods",
		{
			Author: {
				type: Sequelize.STRING,
			},
			Date: {
				type: Sequelize.DATE,
			},
			Code: {
				type: Sequelize.STRING,
			},
			Available: {
				type: Sequelize.BOOLEAN,
			},
		},
		{ timestamps: false }
	);

	return Code;
};
