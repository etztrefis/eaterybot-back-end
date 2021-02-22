const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
	const Menu = sequelize.define(
		"Menu",
		{
			DishID: {
				type: Sequelize.INTEGER,
				primaryKey: true,
			},
			DayOfWeek: {
				type: Sequelize.STRING,
				primaryKey: true,
			},
		},
		{ timestamps: false }
	);

	return Menu;
};
