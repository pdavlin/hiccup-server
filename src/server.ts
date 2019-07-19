// tslint:disable no-console
// -- imports --
import express = require("express");
import mariadb = require("mariadb");
// import Secrets = require("./Secrets");

// -- configuration --
const app: express.Application = express();
const port = 80;
// const secrets = new Secrets();
const pool = mariadb.createPool({
    database: "hiccup",
    socketPath: "/run/mysqld/mysqld.sock",
    user: "root",
});

async function findRouteInDb(routeString): Promise<string> {
    let conn: mariadb.PoolConnection;
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM routes WHERE route = '${routeString}'`);
    delete rows.meta;
    if (rows.length === 0) {
        return null;
    } else {
        return rows[0].url;
    }
}

app.get("*", (req, res) => {
    const routeString = req.originalUrl.substr(1);
    findRouteInDb(routeString).then((result) => {
        if (result !== null) {
            res.redirect(result);
        } else {
            res.sendFile("/home/pi/go-server/templates/noRoute.html");
        }
    });
});

app.listen(port, () => console.log(`listening on ${port}`));
