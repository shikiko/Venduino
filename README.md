# Venduino
An ICT1003 Project Application.

Vending machine goodness with Arduino board and Tinycircuits 

# WebServer

Documentation for web server API end points

Requires installation of:
[npm install (module)]
- express
- passport
- passport-http
- bcrypt
- knex

The server hosts itself onto the localhost IP address (127.0.0.1) at port 8000, or any port modified and specified by the user. To access get API point, use any web browser, however it is recommended to use postman to test other API points.

API point: /
Type: GET
Params required: NIL
Usage: Testing connections that has basic auth. Requires user account to access.

API point: /api/getInventory
Type: POST
Params required: machine_id
Usage: Retrieve all items from a specific machine_id specified in the POST request.

API point: /api/buy
Type: POST
Params required: UNK
Usage: Incomplete...

API point: /api/vending/startup
Type: POST
Params required: machine_id, location, ip
Usage: Used by the vending machine arduino to update the database everytime it starts up.

API point: /api/user
Type: GET
Params required: NIL
Usage: Used to obtain all data that is stored in the user database.

API point: /api/user
Type: POST
Params required: username, password
Usage: Create and add a new user to the database.

API point: /api/user
Type: PATCH
Params required: user_id, username, password
Usage: Update database of a specific user specified by the user_id.

API point: /api/user
Type: DELETE
Params required: user_id
Usage: Deletes the user specified by the user_id

API point: /api/user/topup
Type: POST
Params required: value, user_id
Usage: Adds integer to the current user of user_id with value

Other get methods (requireAdmin restricted):
API point: /api/machine
Type: GET
Params required: NIL
Usage: Get all data of machine in the database

API point: /api/sales
Type: GET
Params required: NIL
Usage: Get all data of sales (transactions) in the database

API point: /api/items
Type: GET
Params required: NIL
Usage: Get all data of items in the database

API point: /api/inventory
Type: GET
Params required: NIL
Usage: Get all data of inventory in the database