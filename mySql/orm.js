// orm - Object Relational Mapper
// holds the code to turn data from a database into js objects

const connection = require('./connection');

const orm = {
    selectAll(cb) {
        connection.query("SELECT * FROM products", function (err, data) {
            if (err) {
                cb(err, null);
            }
            cb(null, data);
        });
    },
    selectAllFiltered(category, type, cb) {
        let sqlQuery = 'SELECT * FROM products';
        if (category && type) {
            sqlQuery = `SELECT * FROM products WHERE category = "${category}"
                AND type = "${type}";`;
        }
        else if (category) {
            sqlQuery = `SELECT * FROM products WHERE category = "${category}";`;
        }
        else if (type) {
            sqlQuery = `SELECT * FROM products WHERE type = "${type}";`;
        }
        connection.query(sqlQuery, function (err, data) {
            if (err) {
                cb(err, null);
            }
            cb(null, data);
        });
    },
    getProduct(id, cb) {
        const sqlQuery = `SELECT * FROM products WHERE product_id = ${id};`;
        connection.query(sqlQuery, function (err, data) {
            if (err) {
                cb(err, null);
            }
            // get the similar products
            const simQuery = `SELECT product_id, name, category, type, image FROM products 
                            WHERE product_id != ${id}
                            ORDER BY FIELD( category, "${data[0].category}") DESC, 
                                     FIELD( type, "${data[0].type}") DESC
                            LIMIT 5;`;
            connection.query(simQuery, function (err, simData) {
                if (err) {
                    cb(err, null);
                }
                data[0]['similarProducts'] = simData;
                if (data[0].type == 'Clothing') {
                    // get the sizes
                    const sizeQuery = `SELECT s.* FROM sizes as s 
                        JOIN products as p ON s.product_id = p.product_id
                        WHERE p.product_id = ${id};`;
                    connection.query(sizeQuery, function (err, sizeData) {
                        if (err) {
                            cb(err, null);
                        }
                        data[0]['sizes'] = sizeData[0];
                        // get the colors
                        const colorQuery = `SELECT c.color_id, c.color_name 
                            FROM colors as c 
                            JOIN products as p ON c.product_id = p.product_id
                            WHERE p.product_id = ${id};`;
                        connection.query(colorQuery, function (err, colorData) {
                            if (err) {
                                cb(err, null);
                            }
                            data[0]['colors'] = {}
                            for (d in colorData) {
                                data[0]['colors'][colorData[d].color_id] = colorData[d].color_name;
                            }
                            cb(null, data)
                        })
                    })
                }
                else {
                    cb(null, data)
                }
            })
        });
    },
    addToCart(userid, productid, qty = 1, size = null, color = null) {
        // check if product is in the cart
        let sqlQuery = '';
        // if it doesn't have a size or a color change the query
        let clothing = (size != null && color != null);
        if (clothing) {
            sqlQuery = `SELECT quantity FROM cart 
                            WHERE user_id = ${userid} 
                            AND product_id = ${productid}
                            AND size = "${size}"
                            AND color_id = ${color};`;

        }
        else {
            sqlQuery = `SELECT quantity FROM cart 
                            WHERE user_id = ${userid} 
                            AND product_id = ${productid};`;
        }
        connection.query(sqlQuery, function (err, data) {
            if (err) {
                console.log(err);
            }
            if (data.length === 0) {
                if( clothing ) {
                    sqlQuery = `INSERT INTO cart ( user_id, product_id, quantity, 
                    size, color_id ) VALUES
                    ( ${userid}, ${productid}, ${qty}, "${size}", ${color} );`
                }
                else {
                    sqlQuery = `INSERT INTO cart ( user_id, product_id, quantity ) VALUES
                        ( ${userid}, ${productid}, ${qty} );`
                }
                
                connection.query(sqlQuery);
            }
            else {
                let quantity = qty + data[0].quantity;
                if (clothing) {
                    sqlQuery = `UPDATE cart SET quantity = ${quantity} 
                                WHERE user_id = ${userid} 
                                AND product_id = ${productid}
                                AND size = "${size}"
                                AND color_id = ${color};`
                }
                else {
                    sqlQuery = `UPDATE cart SET quantity = ${quantity} 
                                WHERE user_id = ${userid} 
                                AND product_id = ${productid};`
                }

                connection.query(sqlQuery);
            }
        });
    },
    removeFromCart(userid, productid, qty = 1, size = null, color = null) {
        // check if product is in the cart
        let sqlQuery = '';
        // if it doesn't have a size or a color change the query
        let clothing = (size != null && color != null);
        if (clothing) {
            sqlQuery = `SELECT quantity FROM cart 
                        WHERE user_id = ${userid} 
                        AND product_id = ${productid}
                        AND size = "${size}"
                        AND color_id = ${color};`;

        }
        else {
            sqlQuery = `SELECT quantity FROM cart 
                        WHERE user_id = ${userid} 
                        AND product_id = ${productid};`;
        }
        connection.query(sqlQuery, function (err, data) {
            if (data.length === 0) {
                return;
            }
            else {
                if (clothing) {
                    sqlQuery = `DELETE FROM cart 
                                WHERE user_id = ${userid} 
                                AND product_id = ${productid}
                                AND size = "${size}"
                                AND color_id = ${color};`
                }
                else {
                    sqlQuery = `DELETE FROM cart 
                                WHERE user_id = ${userid} 
                                AND product_id = ${productid};`
                }
                connection.query(sqlQuery);
            }
        });
    },
    getCart(userid, cb) {
        const sqlQuery = `SELECT p.name, p.category, p.type, p.image, p.price, c.*, 
            p.price * c.quantity AS "totalprice", colors.color_name
            FROM cart c
            JOIN products p ON p.product_id = c.product_id
            LEFT JOIN colors ON c.color_id = colors.color_id
            WHERE c.user_id = ${userid};`;
        connection.query(sqlQuery, function (err, data) {
            if (err) {
                cb(err, null);
            }
            cb(null, data);
        });
    }

}

module.exports = orm;