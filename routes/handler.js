// this is where all the routes will be handled

const express = require('express');
const router = express.Router();
const orm = require('../mySql/orm');


// get requests for the home page
router.get('/', (req, res) => {
    res.render('index', { title: ' - Home Page' });
});

// get requests for the products page
router.get('/products', (req, res) => {
    // get the search parameters
    const {category} = req.query;
    const {type} = req.query;
    let filters = false;
    if( category || type )
    {
        filters = true;
    }
    // get the product information from a mySQL database
    orm.selectAllFiltered( category, type, function (error, data) {
        if (error) {
            return res.status(501).send(
                '<h1>Unable to Query the database</h1>');
        }
        // render the products page
        res.render('./products', {
            title: ` - Products Page`,
            products: data,
            filters: filters,
            category: category,
            type: type,
            style: "/css/products.css"
        }, (err, html) => {
            if (err) {
                // if the page can't be found send 404
                console.log( err );
                res.status(404).send('<h1>Page doesn\'t exist</h1>');
            }
            else {
                // if no error send the page as normal
                res.send(html);
            }
        });
    });
});

// get requests for the cart page
router.get('/my-cart', (req, res) => {
    // get the userid
    const userid = 1;
    // get the product information from a mySQL database
    orm.getCart( userid, function (error, data) {
        if (error) {
            return res.status(501).send(
                '<h1>Unable to Query the database</h1>');
        }
        // render the users cart
        res.render('./my-cart', {
            title: ` - My Shopping Cart`,
            products: data,
            style: "/css/my-cart.css"
        }, (err, html) => {
            if (err) {
                // if the page can't be found send 404
                console.log( err );
                res.status(404).send('<h1>Page doesn\'t exist</h1>');
            }
            else {
                // if no error send the page as normal
                res.send(html);
            }
        });
    });
});

// get requests for all other main pages
router.all('/:page', (req, res) => {
    // get the pages name
    let { page } = req.params;
    // give the page name a capitol letter for the title
    let pagename = page[0].toUpperCase() + page.substring(1);
    res.render( page, { title: ` - ${pagename} Page` }, (err, html) => {
        if (err) {
            // if the page can't be found send 404
            res.status(404).send('<h1>Page doesn\'t exist</h1>');
        }
        else {
            // if no error send the page as normal
            res.send(html);
        }
    });
});

// get requests for all individual product pages
router.get('/p/:product_id', (req, res) => {
    // get the product id
    let { product_id } = req.params;
    // get the product information from a mySQL database
    orm.getProduct(product_id, function (error, data) {
        if (error) {
            return res.status(501).send(
                '<h1>Unable to Query the database</h1>');
        }
        // get the products name from a mySQL database
        let pagename = data[0].name;
        // render the individual products page
        res.render('./p/individual-product', {
            title: ` - ${pagename} Page`,
            data: data[0],
            style: "/css/individual-products.css"
        }, (err, html) => {
            if (err) {
                // if the page can't be found send 404
                res.status(404).send('<h1>Page doesn\'t exist</h1>');
            }
            else {
                // if no error send the page as normal
                res.send(html);
            }
        });
    });
});

// post requests for adding a product to the cart
router.post('/addToCart/:product_id', (req, res) => {
    // get the user's id
    const userid = 1;
    // get the product id
    let { product_id } = req.params;
    // get the size of the size
    const {size} = req.query;
    console.log( 'size:', size );
    // get the color of the size
    const {color} = req.query;
    // get the quantity of the size
    const {quantity} = req.query;
    // get the product information from a mySQL database
    orm.addToCart( userid, product_id, quantity, size, color );
    res.redirect( 'back' );
});

// post requests for removing a product from the cart
router.post('/removeFromCart/:product_id', (req, res) => {
    // get the user's id
    const userid = 1;
    // get the product id
    let { product_id } = req.params;
    // get the product information from a mySQL database
    orm.removeFromCart( userid, product_id );
    res.redirect( 'back' );
});

// covers all non get requests
router.all('*', (req, res) => {
    // if the page can't be found send 404
    res.status(404).send('<h1>Page doesn\'t exist</h1>');
});

// export the router
module.exports = router;