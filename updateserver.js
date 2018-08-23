const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser')

// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'shop'
});

// Connection
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected');
});

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

/* sample req query params */
// req.query = {
//     min_mrp: 10,
//     max_mrp: 120,
//     min_weight: 1,
//     max_weight:40,
//     min_fat:20,
//     max_fat: 40,
//     order_by: 'weight',
//     order_side: 'DESC'
// };

/* common get fruits route */
app.get('/getfruits', (req, res) => {
    let queryFilters = req.query;
    let addAnd = false;

    let query = 'SELECT items.id as item_id, items.name as item_name, items.mrp as mrp, items.weight as weight, items.fat as fat, items.description as description, outlets.id as outlet_id, outlets.name as outlet_name, outlets.size as outlet_size FROM `items` left join outlets on items.outlet = outlets.id';

    if (queryFilters) {
        query += ' where ';
    }

    if (queryFilters.min_mrp) {
        addAnd = true;
        query += 'mrp >= '+ queryFilters.min_mrp;
    }

    if (queryFilters.max_mrp) {
        if (addAnd) {
            query += ' and ';
        }
        addAnd = true;
        query += 'mrp <= '+ queryFilters.max_mrp;
    }

    if (queryFilters.min_weight) {
        if (addAnd) {
            query += ' and ';
        }
        addAnd = true;
        query += 'weight >= '+ queryFilters.min_weight;
    }

    if (queryFilters.max_weight) {
        if (addAnd) {
            query += ' and ';
        }
        addAnd = true;
        query += 'weight <= '+ queryFilters.max_weight;
    }

    if (queryFilters.min_fat) {
        if (addAnd) {
            query += ' and ';
        }
        addAnd = true;
        query += 'fat >= '+ queryFilters.min_fat;
    }

    if (queryFilters.max_fat) {
        if (addAnd) {
            query += ' and ';
        }
        addAnd = true;
        query += 'fat <= '+ queryFilters.max_fat;
    }

    let orderSide = 'ASC';
    let orderSideValidEntries = ['ASC', 'DESC'];
    if (queryFilters.order_by) {
        if (queryFilters.order_side && orderSideValidEntries.indexOf(queryFilters.order_side) != -1) {
            orderSide = queryFilters.order_side;
        }
        query += ' order by '+queryFilters.order_by+' '+orderSide;
    }

    let querys = db.query(query, (err, results) => {
        if(err) throw err;
        console.log('query results', results);
        res.send(results);
    });
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});
