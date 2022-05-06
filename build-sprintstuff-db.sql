DROP DATABASE IF EXISTS sprintstuff_db;

CREATE DATABASE IF NOT EXISTS sprintstuff_db;

USE sprintstuff_db;

CREATE TABLE products
(
    product_id	INT unsigned NOT NULL AUTO_INCREMENT,
    name        VARCHAR(150) NOT NULL,
    price       INT unsigned,
    shipping    INT unsigned,
    image       VARCHAR(150),
    description VARCHAR(500),
    category    ENUM( "Winged", "Non-Winged", "Modified" ),
    type        ENUM( "Clothing", "Hand-Painted" ),
    PRIMARY KEY (product_id)
);

INSERT INTO products ( name, price, shipping, image, description, category, type ) 
VALUES
        ( "Men's Hat", 20, 7, "mens-hat", 
        "100% cotton twill front panels and bill with 100% polyester mesh backing",
        "Winged", "Clothing" ),
        ( "Winged Pull Back", 20, 7, "Winged-pullback", "Custom hand painted pull Back toy cars",
        "Winged", "Hand-Painted" ),
        ( "On-Board T-Shirt", 20, 2, "onboard", "100% cotton pre-shrunk men's T-shirt",
        "Winged", "Clothing" ),
        ( "1/24th Racing Champion", 100, 10, "1-24-winged", "All Sponsor's are recaptured EXCEPT contingency decals",
        "Winged", "Hand-Painted" ),
	( "1/18th GMP", 200, 15, "1-18-winged", "All Sponsor's are recaptured EXCEPT contingency decals",
        "Winged", "Hand-Painted" ),
	( "Non-Wing 1/24th Racing Champion", 90, 10, "1-24-non-winged", "All Sponsor's are recaptured EXCEPT contingency decals",
        "Non-Winged", "Hand-Painted" ),
	( "Non-Wing 1/18th GMP", 200, 15, "1-18-non-winged", "All Sponsor's are recaptured EXCEPT contingency decals",
        "Non-Winged", "Hand-Painted" ),
	( "Kid's Non-Wing T-Shirt", 15, 2, "kids-non-winged", "100% cotton pre-shrunk kid's glow in the dark T-shirt",
        "Non-Winged", "Clothing" ),
	( "9\" Hangers", 40, 8, "modified-hanger", "9\" hanger can be customized to look like your car with your name and number",
        "Modified", "Hand-Painted" );

CREATE TABLE cart
(
    user_id      INT unsigned NOT NULL,
    product_id   INT unsigned NOT NULL,
    quantity     INT unsigned NOT NULL,
    size         VARCHAR(10),
    color_id	 INT unsigned,
    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE colors
(
    product_id	INT unsigned NOT NULL,
    color_id	INT unsigned NOT NULL AUTO_INCREMENT,
    color_name	VARCHAR(150) NOT NULL,
	PRIMARY KEY (color_id),
        FOREIGN KEY (product_id)
            REFERENCES products(product_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

INSERT INTO colors ( product_id, color_name ) VALUES
	( 1, "Black with Flourescent Orange"),
    ( 3, "Black and White"),
	( 8, "Black"  );

CREATE TABLE sizes
(
	product_id      INT unsigned NOT NULL,
        is_youth	BOOLEAN DEFAULT False,
        XS      	BOOLEAN DEFAULT False,
        SM		BOOLEAN DEFAULT False,
        MED		BOOLEAN DEFAULT False,
        LRG		BOOLEAN DEFAULT False,
        XL	        BOOLEAN DEFAULT False,
        2XL	        BOOLEAN DEFAULT False,
        3XL	        BOOLEAN DEFAULT False,
        4XL	        BOOLEAN DEFAULT False,
        one_size	BOOLEAN DEFAULT False,
	PRIMARY KEY (product_id),
        FOREIGN KEY (product_id)
                REFERENCES products(product_id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
);

INSERT INTO sizes ( product_id, is_youth, XS, SM, MED, LRG, XL,
	2XL, 3XL, 4XL, one_size) VALUES
    ( 1, False, False, False, False, False, False, False, False, False, True  ),
    ( 3, False, False, True, True, True, True, True, True, False, False  ),
	( 8, True, True, True, True, True, False, False, False, False, False  );





