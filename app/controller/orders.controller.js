const db = require("../models");
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const VKBot = require("node-vk-bot-api");
require("dotenv").config({ path: "../../.env" });

// Retrieve all orders from the database.
exports.findAll = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN, async (err) => {
            if (err) {
                console.log(err);
                return res.status(403).send({ type: "Error", message: "Invalid token" })
            } else {
                await db.sequelize.query
                    (`SELECT Orders_Logs.ID, Users.FirstName, Users.LastName, Dishes.Name, Orders_Logs.Date, Orders_Logs.State
                    FROM Orders_Logs
                    INNER JOIN Users ON Orders_Logs.UserID = Users.UID
                    INNER JOIN Dishes ON Orders_Logs.DishID = Dishes.DishID
                    WHERE `)
                    .then((getOrders) => {
                        for (const order in getOrders[0]) {
                            getOrders[0][order].Date = setTimeToNormal(getOrders[0][order].Date);
                        }
                        res.status(200).send({ type: "OK", message: getOrders[0] })
                    })
                    .catch(() => {
                        res.status(403).send({ type: "Error", message: "Error while selecting" })
                    })
            }
        });
    } else {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
    }
};

//Update order specified by ID
exports.update = (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN, async (err) => {
            if (err) {
                console.log(err);
                return res.status(403).send({ type: "Error", message: "Invalid token" })
            } else {
                let id = parseInt(req.params.id, 10);
                await db.orders.findOne({ where: { ID: { [Op.eq]: id } } })
                    .then(async (project) => {
                        if (project) {
                            project.update({
                                State: req.params.state
                            })
                                .then(() => {
                                    res.status(200).send({ type: "OK", message: "Successfully updated" })
                                    db.logs.create({
                                        Action: "UPDATE",
                                        Table: "Orders",
                                        Login: req.params.sender
                                    })
                                })
                                .catch((e) => {
                                    console.log(e);
                                    res.status(403).send({ type: "Error", message: "Error while updating" })
                                })

                            let now = new Date(),
                                mday = now.getDate();
                            const bot = new VKBot({
                                token: process.env.BOTTOKEN,
                                group_id: process.env.GROUP_ID,
                                secret: process.env.SECRET,
                                confirmation: process.env.CONFIRMATION,
                            });

                            await db.sequelize.query(`SELECT State, Dishes.Name
                                    FROM Orders_Logs
                                    INNER JOIN Dishes ON Orders_Logs.DishID = Dishes.DishID
                                    WHERE Orders_Logs.UserID = "${project.dataValues.UserID}" AND DAY(DATE) = ${mday - 1}`)
                                .then(async (data) => {
                                    console.log(data[0]);
                                    if (data.toString() !== ",") {
                                        let message = "\n";
                                        for (let i = 0; i < data[0].length; i++) {
                                            message += `${data[0][i].Name} : ${data[0][i].State} \n`
                                        }
                                        await bot.sendMessage(project.dataValues.UserID, `🍔 Статус вашего обновился: ${message}`);
                                    }
                                });
                        } else {
                            res.status(403).send({ type: "Error", message: "Error while searching" })
                        }
                    });
            }
        });
    } else {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
    }
};

// Funcion that converts mysql datetime to readable time for database user
function setTimeToNormal() {
    var date;
    date = new Date();
    date =
        date.getUTCFullYear() +
        "-" +
        ("00" + (date.getUTCMonth() + 1)).slice(-2) +
        "-" +
        ("00" + date.getUTCDate()).slice(-2) +
        " " +
        ("00" + date.getUTCHours()).slice(-2) +
        ":" +
        ("00" + date.getUTCMinutes()).slice(-2) +
        ":" +
        ("00" + date.getUTCSeconds()).slice(-2);
    return date;
}
