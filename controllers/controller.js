const pg = require('pg');
const path = require('path');
const connectionString = "postgres://postgres:postgres@localhost:5432/todo";

module.exports.create = create;
module.exports.read = read;
module.exports.update = update;
module.exports.deleteDB = deleteDB;

function create(req, res){
	const results = [];
  
  const data = {
  	text: req.body.text, 
  	complete: req.body.complete
  };
  
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    
    // SQL Query > Insert Data
    client.query('INSERT INTO items(text, complete) values($1, $2)', [data.text, data.complete]);
    
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC');
    
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });

  });
}

function read(res){
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC;');
    
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
}

function update(req, res){
  const results = [];
  
  // Grab data from the URL parameters
  const id = req.params.id;

  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
  
    // SQL Query > Update Data
    client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)', [data.text, data.complete, id]);
  
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM items ORDER BY id ASC");
  
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
  
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
}

function deleteDB(req, res){
  const results = [];
  
  // Grab data from the URL parameters
  const id = req.params.id;
  
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
  
    // SQL Query > Delete Data
    client.query('DELETE FROM items WHERE id=($1)', [id]);
  
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM items ORDER BY id ASC');
  
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
  
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
}

