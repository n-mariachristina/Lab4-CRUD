// set up the server
const express = require("express");
const res = require("express/lib/response");
const logger = require("morgan");
const app = express();
const port = 8080;

//Configure Express to use EJS
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

const db = require("./db/db_pool");

// configure express to parse URL-encoded POAST request bodies (traditional forms)
app.use(express.urlencoded({ extended: false }))

// defining middleware that logs all incoming requests.
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get("/", (req, res) => {
    res.render('index');
});

const read_toWatch_all_sql = `
    SELECT
        title, type, status, rating, id
    FROM toWatch
`

// define a route for the stuff inventory page
app.get("/stuff", (req, res) => {
    db.execute(read_toWatch_all_sql, (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else
            res.render("stuff", { inventory: results });
    });
});

const read_toWatch_item_sql = `
    SELECT
        title, type, status, rating, details, id
    FROM
        toWatch
    WHERE
        id = ?
`

// define a route for the item detail page
app.get("/stuff/item/:id", (req, res) => {
    db.execute(read_toWatch_item_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); // Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No item found with id = ${req.params.id}`); // NOT FOUND
        else {
            let data = results[0]; // results is still an array
            // { id: __ title: ___ type: ___, status: ___, rating; ___, brother: ___ }
            res.render('item', data)
        }
    })
});

const delete_toWatch_sql = `
    DELETE
    FROM
        toWatch
    WHERE
        id = ?
`

app.get("/stuff/item/:id/delete", (req, res) => {
    db.execute(delete_toWatch_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error);
        else {
            res.redirect("/stuff");
        }
    })
})

const create_item_sql = `
INSERT INTO toWatch
    (title, type, status, rating, details)
VALUES
    (?, ?, ?, ?, ?)
`

const update_item_sql = `
    UPDATE
        toWatch
    SET
        title = ?,
        type = ?,
        status = ?,
        rating = ?,
        details = ?
    WHERE
        id = ?
`

app.post("/stuff/item/:id", (req, res) => {
    let rating = null;
    if (req.body.rating != "") {
        rating = req.body.rating;
    }
    let status = 1;
    if (req.body.status === undefined) {
        status = 0;
    }
    db.execute(update_item_sql, [req.body.title, req.body.type, status, rating, req.body.details, req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error);
        else {
            res.redirect(`/stuff/item/${req.params.id}`);
            // or res.redirect(`/stuff/item/${results.insertId]`;)
        }
    })
})

app.post("/stuff", (req, res) => {
    let rating = null;
    if (req.body.rating != "") {
        rating = req.body.rating;
    }
    let status = 1;
    if (req.body.status === undefined) {
        status = 0;
    }
    db.execute(create_item_sql, [req.body.title, req.body.type, status, rating, req.body.details], (error, results) => {
        if (error)
            res.status(500).send(error); // Internal Server Error
        else {
            res.redirect('stuff');
        }
    })
})

// start the server
app.listen(port, () => {
    console.log(`App server listening on ${port}. (Go to http://localhost:${port})`);
});