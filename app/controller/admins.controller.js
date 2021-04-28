const db = require("../models");
const jwt = require("jsonwebtoken");
const cryptoJS = require("crypto-js");
require("dotenv").config({ path: "../../.env" });
const Op = db.Sequelize.Op;

// Create and Save a new Admin
exports.create = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN, async (err) => {
      if (err) {
        return res.status(403).send({ type: "error", message: "Authorization token required" })
      } else {
        await db.admins
          .findAll({
            where: { Login: { [Op.eq]: req.params.username } },
          })
          .then(async (value) => {
            if (value == "") {
              await db.admins
                .create({
                  Login: req.params.username,
                  Password: req.params.password,
                  Availialbe: true,
                })
                .then(async () => {
                  await db.codes.update(
                    { Available: false },
                    { where: { Code: req.params.code } }
                  );
                  return res.status(200).send({ type: "OK", message: "Successfully created" });
                })
                .catch(() => {
                  return res.status(403).send({ type: "Error", message: "Error while admin creating" });
                });
            } else {
              return res.status(200).send({ message: "Already exists." });
            }
          })
          .catch(() => {
            return res.status(403).send({ type: "Error", message: "Error while admin searching" });
          });
      }
    });
  } else {
    return res.status(403).send({ type: "Error", message: "Authorization token required" })
  }
};

// Retrieve all Admins from the database.
exports.findAll = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN, async (err) => {
      if (err) {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
      } else {
        await db.admins.findAll().then((getAdmins) => {
          res.status(200).send(getAdmins);
        });
      }
    });
  } else {
    return res.status(403).send({ type: "Error", message: "Authorization token required" })
  }
};
// Find a single Admin with indicated username and password
exports.findOne = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN, async (err) => {
      if (err) {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
      } else {
        await db.admins
          .findOne({
            where: {
              Login: { [Op.eq]: req.params.username },
              Availiable: { [Op.eq]: true },
            },
          })
          .then((getAdmin) => {
            if (getAdmin == null) {
              return res.status(403).send({ type: "Error", message: "Admin doesn't exists" });
            } else {
              const responseBytes = cryptoJS.AES.decrypt(
                req.params.password,
                process.env.REACT_APP_CRYPT
              );
              const databadeBytes = cryptoJS.AES.decrypt(
                getAdmin["Password"],
                process.env.REACT_APP_CRYPT
              );

              const originalResponse = responseBytes.toString(cryptoJS.enc.Utf8);
              const originalDataBase = databadeBytes.toString(cryptoJS.enc.Utf8);

              if (getAdmin.isSuperAdmin == 1) {
                if (originalResponse === originalDataBase) {
                  res.status(200).send(`${Math.floor(Math.random() * 16777215).toString(16)} ${getAdmin["Login"]}1`);
                } else {
                  return res.status(403).send({ type: "Error", message: "Tokens does not match" });
                }
              } else {
                if (originalResponse === originalDataBase) {
                  res.status(200).send(`${Math.floor(Math.random() * 16777215).toString(16)} ${getAdmin["Login"]}0`);
                } else {
                  return res.status(403).send({ type: "Error", message: "Tokens does not match" });
                }
              }
            }
          })
          .catch((e) => {
            console.log(e);
            return res.status(403).send({ type: "Error", message: "Admin doesn't exists" });
          });
      }
    });
  } else {
    return res.status(403).send({ type: "Error", message: "Authorization token required" })
  }
};

// Delete an Admin with the specified id in the request
exports.delete = (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN, async (err) => {
      if (err) {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
      } else {
        await db.admins.findOne({ where: { Login: { [Op.eq]: req.params.username } } })
          .then((admin) => {
            if (admin) {
              admin.update({
                Password: null,
                Availiable: false,
              })
                .then(() => {
                  res.status(200).send({ type: "OK", message: "Successfully deleted" });
                  db.logs.create({
                    Action: "DELETE",
                    Table: "Admin",
                    Login: req.params.sender
                  })
                })
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

// Find all availiable Admins
exports.findAllAvailiable = (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN, async (err) => {
      if (err) {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
      } else {
        await db.admins.findAll({ where: { Availiable: { [Op.eq]: 1 } } }).then((getAdmins) => {
          res.status(200).send(getAdmins);
        });
      }
    });
  } else {
    return res.status(403).send({ type: "Error", message: "Authorization token required" })
  }
};

// Update users password by current password
exports.updatePassword = (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN, async (err) => {
      if (err) {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
      } else {
        await db.admins
          .findOne({
            where: {
              Login: { [Op.eq]: req.params.username },
              Availiable: { [Op.eq]: true },
            },
          })
          .then((getAdmin) => {
            if (getAdmin == null) {
              return res.status(403).send({ type: "Error", message: "Admin doesn't exists" });
            } else {
              const responseBytes = cryptoJS.AES.decrypt(
                req.params.oldpassword,
                process.env.REACT_APP_CRYPT
              );
              const databadeBytes = cryptoJS.AES.decrypt(
                getAdmin["Password"],
                process.env.REACT_APP_CRYPT
              );

              const originalResponse = responseBytes.toString(cryptoJS.enc.Utf8);
              const originalDataBase = databadeBytes.toString(cryptoJS.enc.Utf8);
              console.log(`${originalResponse} === ${originalDataBase}`)
              if (originalResponse == originalDataBase && originalResponse != "") {
                getAdmin.update({
                  Password: req.params.newpassword
                })
                  .then(() => {
                    res.status(200).send({ type: "OK", message: "Successfully updated" })
                  })
                  .catch(() => {
                    return res.status(403).send({ type: "Error", message: "Error while updating" });
                  })
              } else {
                return res.status(403).send({ type: "Error", message: "Tokens does not match" });
              }
            }
          })
          .catch((e) => {
            console.log(e);
            return res.status(403).send({ type: "Error", message: "Admin doesn't exists" });
          });
      }
    });
  } else {
    return res.status(403).send({ type: "Error", message: "Authorization token required" })
  }
};

// Update username by current username
exports.updateUsername = (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN, async (err) => {
      if (err) {
        return res.status(403).send({ type: "Error", message: "Authorization token required" })
      } else {
        await db.admins
          .findOne({
            where: {
              Login: { [Op.eq]: req.params.oldusername },
              Availiable: { [Op.eq]: true },
            },
          })
          .then((getAdmin) => {
            if (getAdmin == null) {
              return res.status(403).send({ type: "Error", message: "Admin doesn't exists" });
            } else {
              getAdmin.update({
                Login: req.params.newusername
              })
                .then(() => {
                  res.status(200).send({ type: "OK", message: "Successfully updated" })
                })
                .catch(() => {
                  return res.status(403).send({ type: "Error", message: "Error while updating" });
                })
            }
          })
          .catch((e) => {
            console.log(e);
            return res.status(403).send({ type: "Error", message: "Admin doesn't exists" });
          });
      }
    });
  } else {
    return res.status(403).send({ type: "Error", message: "Authorization token required" })
  }
};
