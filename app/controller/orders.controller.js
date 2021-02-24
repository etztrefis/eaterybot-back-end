const db = require("../models");
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
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
                    INNER JOIN Dishes ON Orders_Logs.DishID = Dishes.DishID`)
                    .then((getOrders) => {
                        for(const order in getOrders[0]){
                            getOrders[0][order].Date = setTimeToNormal(getOrders[0][order].Date);
                        }
                        res.status(200).send({ type: "OK", message: getOrders[0] })
                    })
                    .catch(() => {
                        res.status(403).send({ type: "OK", message: "Error while selecting" })
                    })
            }
        });
    } else {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
    }
};

//Update specified order
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
                    .then((project) => {
                        if (project) {
                            project.update({
                                State: req.params.state
                            })
                                .then(() => {
                                    res.status(200).send({ type: "OK", message: "Successfully updated" })
                                })
                                .catch((e) => {
                                    console.log(e);
                                    res.status(403).send({ type: "OK", message: "Error while updating" })
                                })
                        } else {
                            res.status(403).send({ type: "OK", message: "Error while searching" })
                        }
                    });
            }
        });
    } else {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
    }
};


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
