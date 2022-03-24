// orm - Object Relational Mapper
// holds the code to turn data from a database into js objects

const connection = require('./connection');

const orm = {
    selectAll(cb) {
        connection.query("SELECT * FROM products", function(err, data){
            if(err){
                cb(err, null);
            }
            cb(null, data);
        })
    },
    getProduct( id, cb ) {
        const sqlQuery = `SELECT * FROM products WHERE id = ${id};`;
        connection.query( sqlQuery, function(err, data) {
            if(err){
                cb(err, null);
            }
            cb(null, data);
        })
    }
}

module.exports = orm;