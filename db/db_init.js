const db = require("./db_connection");
const fs = require("fs");


// delete the table if it already exists
const drop_toWatch_table_sql = fs.readFileSync(__dirname + "/queries/init/drop_toWatch_table.sql", { encoding: "UTF-8" })

db.execute(drop_toWatch_table_sql);


// create the table with suitable columns and such
const create_toWatch_table_sql = fs.readFileSync(__dirname + "/queries/init/create_toWatch_table.sql", { encoding: "UTF-8" })

db.execute(create_toWatch_table_sql);


// add some sample data to the table
const insert_toWatch_table_sql = fs.readFileSync(__dirname + "/queries/init/insert_toWatch_table.sql", { encoding: "UTF-8" })

db.execute(insert_toWatch_table_sql, [
    "Moon Knight", "Series", false, null, "currently watching"]);
db.execute(insert_toWatch_table_sql, [
    "The Girl from Plainville", "Series", false, null, "recommended by friend"]);
db.execute(insert_toWatch_table_sql, [
    "Encanto", "Movie", true, 10, "new Pixar movie"]);
db.execute(insert_toWatch_table_sql, [
    "Turning Red", "Movie", true, 10, "also new Pixar movie"]);
db.execute(insert_toWatch_table_sql, [
    "LOST", "Series", true, 10, "and found?"]);
db.execute(insert_toWatch_table_sql, [
    "Spongebob SquarePants", "Series", true, 10, "patrick star"]);


// read the new contents
const read_toWatch_table_sql = fs.readFileSync(__dirname + "/queries/init/read_toWatch_table.sql", { encoding: "UTF-8" })


db.execute(read_toWatch_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'toWatch' initialized with:")
        console.log(results);
    }
);

db.end();