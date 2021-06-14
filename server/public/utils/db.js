var mysql = require("mysql");
var privates = require("../privates");
var connection = mysql.createConnection(privates.dbInfo);

connection.connect();

// connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
//   if (error) throw error;
//   console.log("The solution is: ", results[0].solution);
// });

module.exports = connection;
