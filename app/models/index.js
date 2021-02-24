const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	operatorsAliases: 0,

	pool: {
		max: dbConfig.pool.max,
		min: dbConfig.pool.min,
		acquire: dbConfig.pool.acquire,
		idle: dbConfig.pool.idle,
	},
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admins = require("./admins.model.js")(sequelize, Sequelize);

db.codes = require("./codes.model.js")(sequelize, Sequelize);

db.products = require("./products.model")(sequelize, Sequelize);

db.dishes = require("./dishes.model")(sequelize, Sequelize);

db.compositions = require("./compositions.model")(sequelize, Sequelize);

db.menu = require("./menu.model")(sequelize, Sequelize);

db.orders = require("./orders.model")(sequelize, Sequelize);

module.exports = db;
