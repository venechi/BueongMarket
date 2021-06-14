var mysql = require("mysql");
import { dbInfo } from "../privates";
var connection = mysql.createConnection();

connection.connect(dbInfo);

// connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
//   if (error) throw error;
//   console.log("The solution is: ", results[0].solution);
// });

module.exports = connection;
