var mysql = require('mysql');

var con = mysql.createConnection({
    host: "106.15.204.243",
    user: "root",
    password: "ABCsujie168168",
    database: "nodedb"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE products (id INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255), href VARCHAR(255), description VARCHAR(255))";
    // var sql = "ALTER TABLE customers ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY";

    // var sql = "ALTER TABLE customers ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY";
    // var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
    // var sql = "INSERT INTO customers (name, address) VALUES ?";
    // var values = [
    //     ['John', 'Highway 71'],
    //     ['Peter', 'Lowstreet 4'],
    //     ['Amy', 'Apple st 652'],
    //     ['Hannah', 'Mountain 21'],
    //     ['Michael', 'Valley 345'],
    //     ['Sandy', 'Ocean blvd 2'],
    //     ['Betty', 'Green Grass 1'],
    //     ['Richard', 'Sky st 331'],
    //     ['Susan', 'One way 98'],
    //     ['Vicky', 'Yellow Garden 2'],
    //     ['Ben', 'Park Lane 38'],
    //     ['William', 'Central st 954'],
    //     ['Chuck', 'Main Road 989'],
    //     ['Viola', 'Sideway 1633']
    // ];

    // var sql = "SELECT * FROM customers WHERE address LIKE 'S%'";
    // var adr = 'Mountain 21';
    // var sql = 'SELECT * FROM customers WHERE address = ' + mysql.escape(adr);
    // con.query(sql, function (err, result,fields) {
    //     if (err) throw err;
    //     console.log(JSON.stringify(result));
    // });

    // var adr = 'Mountain 21';
    // var sql = 'SELECT * FROM customers WHERE address = ?';
    // con.query(sql, [adr], function (err, result) {
    //     if (err) throw err;
    //     console.log(result);
    // });    

    // var name = 'Amy';
    // var adr = 'Mountain 21';
    // var sql = 'SELECT * FROM customers WHERE name = ? OR address = ?';
    // con.query(sql, [name, adr], function (err, result) {
    //     if (err) throw err;
    //     console.log(JSON.stringify(result));
    // });

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });

    // con.query("SELECT * FROM customers ORDER BY name DESC", function (err, result) {
    //     if (err) throw err;
    //     console.log(JSON.stringify(result));
    // });

});