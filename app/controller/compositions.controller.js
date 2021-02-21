const db = require("../models");
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

// Idk but here im using raw sequelize queries since there is no JOINS in
//  sequelize model querieing as i know

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
                    (`SELECT Compositions.DishID, Products.Name, Compositions.AmountProduct, Products.MeasurmentUnits
                    FROM Compositions
                    INNER JOIN Products ON Compositions.ProductID = Products.ProductID`)
                    .then((getProducts) => {
                        res.status(200).send({ type: "OK", message: getProducts })
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

exports.create = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN, async (err) => {
            if (err) {
                return res.status(403).send({ type: "error", message: "Invalid token" })
            } else {
                let dishID = parseInt(req.params.did, 10);
                await db.sequelize.query(`SELECT Compositions.DishID, Products.Name, Compositions.AmountProduct, Products.MeasurmentUnits
                    FROM Compositions
                    INNER JOIN Products ON Compositions.ProductID = Products.ProductID
                    AND Compositions.DishID = ${dishID} AND Products.Name LIKE "%${req.params.pname}%"`)
                    .then(async (value) => {
                        if (value.toString() === ",") {
                            await db.sequelize.query(`SELECT ProductID FROM Products WHERE Name LIKE "%${req.params.pname}%"`)
                                .then(async (data) => {
                                    // Argument has to be with dot, for example : 0.2
                                    const amount = parseFloat(req.params.amount);
                                    await db.compositions
                                        .create({
                                            DishID: dishID,
                                            ProductID: data[0][0].ProductID,
                                            AmountProduct: amount,
                                        })
                                        .then(() => {
                                            return res.status(200).send({ type: "OK", message: "Successfully created" });
                                        })
                                        .catch((e) => {
                                            console.log(e);
                                            return res.status(404).send({ type: "Error", message: "Error while composition creating" });
                                        })
                                }).catch(() => {
                                    return res.status(403).send({ type: "Error", message: "Error while searching for ID" })
                                })
                        } else {
                            return res.status(404).send({ type: "Error", message: "Already exists." });
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                        return res.status(404).send({ type: "Error", message: "Error while searching" });
                    });
            }
        });
    } else {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
    }
};

exports.delete = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN, async (err) => {
            if (err) {
                console.log(err);
                return res.status(403).send({ type: "Error", message: "Invalid token" })
            } else {
                let dishID = parseInt(req.params.did, 10);
                await db.sequelize.query(`SELECT Compositions.DishID, Products.Name, Compositions.AmountProduct, Products.MeasurmentUnits
                    FROM Compositions
                    INNER JOIN Products ON Compositions.ProductID = Products.ProductID
                    AND Compositions.DishID = ${dishID} AND Products.Name LIKE "%${req.params.pname}%"`)
                    .then(async (value) => {
                        if (value.toString() === ",") {
                            return res.status(404).send({ type: "Error", message: "Already exists." });
                        } else {
                            await db.sequelize.query(`SELECT ProductID FROM Products WHERE Name LIKE "%${req.params.pname}%"`)
                                .then(async (data) => {
                                    await db.compositions
                                        .destroy({ where: { DishID: { [Op.eq]: dishID }, ProductID: { [Op.eq]: data[0][0].ProductID } } })
                                        .then(() => {
                                            res.status(200).send({ type: "OK", message: "Successfully deleted" })
                                        })
                                        .catch((e) => {
                                            console.log(e);
                                            res.status(404).send({ type: "Error", message: "Eror while deleting" })
                                        })
                                }).catch(() => {
                                    return res.status(403).send({ type: "Error", message: "Error while searching for ID" })
                                })
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                        return res.status(404).send({ type: "Error", message: "Error while searching" });
                    });
            }
        });
    } else {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
    }
};

exports.update = (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN, async (err) => {
            if (err) {
                return res.status(403).send({ type: "error", message: "Invalid token" })
            } else {
                let dishID = parseInt(req.params.did, 10);
                await db.sequelize.query(`SELECT Compositions.DishID, Products.Name, Compositions.AmountProduct, Products.MeasurmentUnits
                    FROM Compositions
                    INNER JOIN Products ON Compositions.ProductID = Products.ProductID
                    AND Compositions.DishID = ${dishID} AND Products.Name LIKE "%${req.params.pname}%"`)
                    .then(async (value) => {
                        if (value.toString() === ",") {
                            return res.status(404).send({ type: "Error", message: "Data doesnt exists." });
                        } else {
                            await db.sequelize.query(`SELECT ProductID FROM Products WHERE Name LIKE "%${req.params.pname}%"`)
                                .then(async (data) => {
                                    await db.compositions.findOne({ where: { DishID: { [Op.eq]: dishID }, ProductID: { [Op.eq]: data[0][0].ProductID } } })
                                        .then((project) => {
                                            // Argument has to be with dot, for example : 0.2
                                            const amount = parseFloat(req.params.amount);
                                            project.update({
                                                DishID: dishID,
                                                ProductID: data[0][0].ProductID,
                                                AmountProduct: amount,
                                            })
                                                .then(() => {
                                                    res.status(200).send({ type: "OK", message: "Successfully updated" })
                                                })
                                                .catch((e) => {
                                                    console.log(e);
                                                    res.status(403).send({ type: "OK", message: "Error while updating" })
                                                })
                                        })
                                        .catch((e) => {
                                            console.log(e);
                                            return res.status(403).send({ type: "Error", message: "Error while final serching" })
                                        })
                                }).catch(() => {
                                    return res.status(403).send({ type: "Error", message: "Error while searching for ID" })
                                })
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                        return res.status(404).send({ type: "Error", message: "Error while searching" });
                    });
            }
        });
    } else {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
    }
};