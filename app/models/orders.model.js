const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
	const Order = sequelize.define(
		"Orders_Logs",
		{
			UserID: {
				type: Sequelize.STRING,
			},
			DishID: {
				type: Sequelize.INTEGER,
			},
            Date: {
                type: Sequelize.DATE,
            },
			State: {
                type: Sequelize.STRING,
            },
            ID: {
                type: Sequelize.INTEGER,
				primarkey: true,
            }
		},
		{ timestamps: false }
	);

	return Order;
};