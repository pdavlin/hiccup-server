import mariadb = require("mariadb");

class MariaImpl {
    public connection = mariadb.createConnection({
        database: "hiccup",
        socketPath: "/run/mysqld/mysqld.sock",
        user: "root",
    });
}
module.exports = MariaImpl;