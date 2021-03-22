# REST API for [eatrybot.trefis.net](https://github.com/etztrefis/eaterybot.trefis.net)

This is a documentation of a EateryBot application providing a REST
API to a DataMapper-backed model.

Made with `Node.JS express` library. `Sequelize.js` as a model-querying promise-based ORM server.

The entire application is contained within the `server.js` file.

## Install

	npm i

## Settings

	create a db.config.js file in app/config/ folder that includes: 

	module.exports = {
		HOST: host,
		USER: user,
		PASSWORD: password,
		DB: database,
		dialect: "mysql",
		pool: {}
	};

## Run the app

	node server.js


| REQUEST     | MEANING        | REQUIREMENTS |
| ----------- | --------------- |--------------- |
| `/api/admins/availiable/`| retrive all availiable admins | authorization |
| `/api/admins/delete/:username/`| delete an admin with the specified id | authorization & sender |
| `/api/admins/create/:username/:password/:code/`| create an admin | authorization & sender |
| `/api/admins/username/:oldusername/:newusername/` | update username on | authorization & sender |specified admin
| `/api/admins/password/:username/:oldpassword/:newpassword/` | update password on specified admin | authorization & sender |
| | |
| `/api/products/` | retrive all products | authorization |
| `/api/products/less/`| retrive all products with =< 10 amount | authorization |
| `/api/products/delete/:id/`| delete product with specified product | authorization & sender |
| `/api/products/create/:name/:amount/:units/`| create a product | authorization & sender |
| `/api/products/update/:id/:name/:amount/:units/`| update specified product | authorization & sender |
| | |
| `/api/dishes/` | retrieve all dishes | authorization |
| `/api/dishes/delete/:id/` | delete specified dish | authorization & sender |
| `/api/dishes/create/:id/:name/:energy/:price/` | create a dish | authorization & sender |
| `/api/dishes/update/:id/:name/:energy/:price/` | update specified dish | authorization & sender |
| | |
| `/api/compositions/` | retrieve all compositions | authorization |
| `/api/compositions/delete/:did/:pname/` | delete specified composition | authorization & sender |
| `/api/compositions/create/:did/:pname/:amount/` | create a composition | authorization & sender |
| `/api/compositions/update/:did/:pname/:amount/` | update specified composition | authorization & sender |
| | |
| `/api/menu/` | retrive full menu list | authorization |
| `/api/menu/:day/` | retrive menu for specified day of week | authorization |
| `/api/menu/destroy/` | destroy full menu list | authorization & sender |
| `/api/menu/delete/:dayofweek/:dishid/` | delete specified dish from menu list | authorization & sender |
| `/api/menu/create/:dayofweek/:dishid/` | add a new dish in menu list | authorization & sender |
| | |
| `/api/orders/` | retrive all orders from `orders_logs` | authorization |
| `/api/orders/update/:id/:state/` | update state of specified order | authorization & sender |
| | |
