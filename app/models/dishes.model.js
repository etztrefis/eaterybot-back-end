const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
	const Dish = sequelize.define(
		"Dishes",
		{
			DishID: {
				type: Sequelize.INTEGER,
				primaryKey: true,
			},
			Name: {
				type: Sequelize.STRING,
			},
			EnergyValue: {
				type: Sequelize.DOUBLE,
			},
			Price: {
				type: Sequelize.DOUBLE,
			},
		},
		{ timestamps: false }
	);

	return Dish;
};
