require("dotenv").config();
const mysql = require("mysql");

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

const con = mysql.createConnection({
  host: DB_HOST || "127.0.0.1",
  user: DB_USER || "root",
  password: DB_PASS,
  database: DB_NAME || "twitter",
  multipleStatements: true
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  let sql = "DROP TABLE if exists access_keys; CREATE TABLE access_keys(id INT NOT NULL AUTO_INCREMENT, token VARCHAR(500) NOT NULL, token_secret VARCHAR(500) NOT NULL, username VARCHAR(500) NOT NULL, handle VARCHAR(500) NOT NULL, user_description VARCHAR(500) NOT NULL, followers VARCHAR(500) NOT NULL, friends VARCHAR(500) NOT NULL, profile_image VARCHAR(500) NOT NULL, PRIMARY KEY (id)); INSERT INTO access_keys(token, token_secret, username, handle, user_description, followers, friends, profile_image) VALUES('','','','','','','','');";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table creation `twitter` was successful!");

    console.log("Closing...");
  });

  con.end();
});


