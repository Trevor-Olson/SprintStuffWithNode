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
        });
    },
    selectAllFiltered( category, type, cb )
    {
        let sqlQuery = 'SELECT * FROM products';
        if( category && type )
        {
            sqlQuery = `SELECT * FROM products WHERE category = "${category}"
                AND type = "${type}";`;
        }
        else if( category )
        {
            sqlQuery = `SELECT * FROM products WHERE category = "${category}";`;
        }
        else if( type )
        {
            sqlQuery = `SELECT * FROM products WHERE type = "${type}";`;
        }
        connection.query( sqlQuery, function(err, data){
            if(err){
                cb(err, null);
            }
            cb(null, data);
        });
    },
    getProduct( id, cb ) {
        const sqlQuery = `SELECT * FROM products WHERE id = ${id};`;
        connection.query( sqlQuery, function(err, data) {
            if(err){
                cb(err, null);
            }
            cb(null, data);
        });
    },
    addToCart( userid, productid, qty ) {
        // check if product is in the cart
        let sqlQuery = `SELECT quantity FROM cart WHERE userid = ${userid} AND
            productid = ${productid};`;
        connection.query( sqlQuery, function(err, data) {
            if( data.length === 0 )
            {
                sqlQuery = `INSERT INTO cart ( userid, productid, quantity ) VALUES
                ( ${userid}, ${productid}, ${qty} );`
                connection.query( sqlQuery );
            }
            else{
                let quantity = qty + data[0].quantity;
                sqlQuery = `UPDATE cart SET quantity = ${quantity} WHERE 
                    userid = ${userid} AND productid = ${productid};`
                connection.query( sqlQuery );
            }
        });
    },
    removeFromCart( userid, productid ) {
        // check if product is in the cart
        let sqlQuery = `SELECT quantity FROM cart WHERE userid = ${userid} AND
            productid = ${productid};`;
        connection.query( sqlQuery, function(err, data) {
            if( data.length === 0 )
            {
                return;
            }
            else{
                sqlQuery = `DELETE FROM cart WHERE userid = ${userid} AND
                    productid = ${productid};`
                connection.query( sqlQuery );
            }
        });
    },
    getCart( userid, cb ){
        const sqlQuery = `SELECT p.id, p.name, p.image, p.price, c.quantity, 
            p.price * c.quantity AS "totalprice"
            FROM products AS p JOIN cart c ON p.id = c.productid
            WHERE c.userid = ${userid};`;
        connection.query( sqlQuery, function(err, data){
            if(err){
                cb(err, null);
            }
            cb(null, data);
        });
    }

}

module.exports = orm;