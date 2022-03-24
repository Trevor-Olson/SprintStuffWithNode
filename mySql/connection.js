// creates the connection to a database server
const mySql = require('mysql');
// local user password can be changed here
const password = require( './password' );
let connection = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: password,
    database: 'sprintstuff_db'
});

connection.connect( (err)=>{
    if( err ){
        return console.error( 'error: ' + err.message );
    }
    console.log( "connected to mySQL database...");
});
module.exports = connection;

