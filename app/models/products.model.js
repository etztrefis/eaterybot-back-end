const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
	const Product = sequelize.define(
		"Products",
		{
			ProductID: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			Name: {
				type: Sequelize.STRING,
			},
			Amount: {
				type: Sequelize.DOUBLE,
			},
			MeasurmentUnits: {
				type: Sequelize.STRING,
			},
		},
		{ timestamps: false }
	);

	return Product;
};
