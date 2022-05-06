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
    async getProduct( id, cb ) {
        const sqlQuery = `SELECT * FROM products WHERE product_id = ${id};`;
        connection.query( sqlQuery, function(err, data) {
            if(err){
                cb(err, null);
            }
            if( data[0].type == 'Clothing' )
            {
                // get the sizes
                const sizeQuery = `SELECT s.* FROM sizes as s 
                JOIN products as p ON s.product_id = p.product_id
                WHERE p.product_id = ${id};`;
                connection.query( sizeQuery, function(err, sizeData) {
                    if(err){
                        cb(err, null);
                    }
                    data[0]['sizes'] = sizeData[0];
                    // get the colors
                    const colorQuery = `SELECT c.* FROM colors as c 
                    JOIN products as p ON c.product_id = p.product_id
                    WHERE p.product_id = ${id};`;
                    connection.query( colorQuery, function(err, colorData) {
                        if(err){
                            cb(err, null);
                        }
                        data[0]['colors'] = colorData[0];
                        cb( null, data )
                    })
                })
            }
            else
            {
                cb( null, data )
            }
        });
    },
    addToCart( userid, productid, qty = 1, size = null, color = null ) {
        // check if product is in the cart
        let sqlQuery = `SELECT quantity FROM cart 
                        WHERE user_id = ${userid} 
                            AND product_id = ${productid}
                            AND size IS ${size}
                            AND color_id IS ${color};`;
        connection.query( sqlQuery, function(err, data) {
            if( err )
            {
                console.log( err );
            }
            if( data.length === 0 )
            {
                sqlQuery = `INSERT INTO cart ( user_id, product_id, quantity, 
                    size, color_id ) VALUES
                    ( ${userid}, ${productid}, ${qty}, ${size}, ${color} );`
                connection.query( sqlQuery );
            }
            else{
                let quantity = qty + data[0].quantity;
                sqlQuery = `UPDATE cart SET quantity = ${quantity} 
                WHERE user_id = ${userid} 
                    AND product_id = ${productid}
                    AND size = ${size}
                    AND color_id = ${color};`
                connection.query( sqlQuery );
            }
        });
    },
    removeFromCart( userid, productid ) {
        // check if product is in the cart
        let sqlQuery = `SELECT quantity FROM cart WHERE user_id = ${userid} AND
            product_id = ${productid};`;
        connection.query( sqlQuery, function(err, data) {
            if( data.length === 0 )
            {
                return;
            }
            else{
                sqlQuery = `DELETE FROM cart WHERE user_id = ${userid} AND
                    product_id = ${productid};`
                connection.query( sqlQuery );
            }
        });
    },
    getCart( userid, cb ){
        const sqlQuery = `SELECT p.product_id, p.name, p.category, p.type, p.image, p.price, c.quantity, 
            p.price * c.quantity AS "totalprice"
            FROM products AS p JOIN cart c ON p.product_id = c.product_id
            WHERE c.user_id = ${userid};`;
        connection.query( sqlQuery, function(err, data){
            if(err){
                cb(err, null);
            }
            cb(null, data);
        });
    }

}

module.exports = orm;