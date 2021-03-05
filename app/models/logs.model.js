const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Logs = sequelize.define(
        "API_Logs",
        {
            Id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            Login: {
                type: Sequelize.STRING,
            },
            Action: {
                type: Sequelize.STRING,
            },
            Table: {
                type: Sequelize.STRING,
            },
            Date: {
                type: Sequelize.DATE,
            },
        },
        { timestamps: false, freezeTableName: true, modelName: 'API_Logs' }
    );

    return Logs;
};
