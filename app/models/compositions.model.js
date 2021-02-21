const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
	const Composition = sequelize.define(
		"Compositions",
		{
			DishID: {
				type: Sequelize.INTEGER,
				primaryKey: true,
			},
			ProductID: {
				type: Sequelize.STRING,
				primaryKey: true,
			},
			AmountProduct: {
				type: Sequelize.DOUBLE,
			},
		},
		{ timestamps: false }
	);

	return Composition;
};
