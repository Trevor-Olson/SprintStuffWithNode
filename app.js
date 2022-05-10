const express = require( 'express' );
const { create } = require( 'express-handlebars' );
const path = require( 'path' );

// get the route handler
const routes = require( "./routes/handler" );

// set the port number
const port = process.env.PORT || 5000;
// create the express server
const app = express();
// create the view engine
const hbs = create({ 
    // sets the default layout to main
    defaultLayout: 'main',
    // set the directory for the layouts
    layoutsDir: path.join( __dirname, 'views/layouts' ),
    // set the directory for the partials
    partialsDir: path.join( __dirname, 'views/partials' ),
    // change the extension name from handlebars to hbs
    extname: '.hbs',
    // add helper function to see if two values are equal
    helpers: {
        ifCond: function( v1, op, v2, options ){
            switch( op ){
                case '==':
                    return v1 == v2 ? options.fn(this): options.inverse(this)
                case '!=':
                    return v1 != v2 ? options.fn(this): options.inverse(this)
            }
            
        }
    }
});

// tells express where to look for static files
app.use( express.static( path.join( __dirname, './public' ) ) );
// register the handlebars engine
app.engine( '.hbs', hbs.engine);
// set the view engine to be handlebars
app.set( 'view engine', '.hbs' );
// explicit setting the directory to the views folder
// default value is ./views
app.set( 'views', './views' );
// tell express to use routes for routing
app.use( '/', routes );

// tell our server to listen on the given port and log it
app.listen( port, () => 
{
    console.log( `Server is listening on port ${port}` );
});