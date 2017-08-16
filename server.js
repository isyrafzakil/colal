var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/colal', {
    useMongoClient: true,
});

var Product = require('./model/product');
var Wishlist = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add product data
app.post('/product', function (req, res) {
    var product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    product.save(function (err, savedProduct) {
        if (err) {
            res.status(500).send({ error: "Could not add product!" });
        }
        else {
            res.send(savedProduct);
        }
    });
});

// Fetch product data
app.get('/product', function (req, res) {
    Product.find({}, function (err, products) {
        if (err) {
            res.status(500).send({ error: "Could not fetch product!" });
        }
        else {
            res.send(products);
        }
    });
});

app.get('/wishlist', function (req, res) {
    Wishlist.find({}).populate({ path: 'products', model: 'Product' }).exec(function (err, wishlists) {
        if (err) {
            res.status(500).send({ error: "Could not fetch wishlists!" });
        }
        else {
            res.send(wishlists);
        }
    }     
)});

// Add wishlist data
app.post('/wishlist', function (req, res) {
    var wishlist = new Wishlist();
    wishlist.title = req.body.title;
    wishlist.price = req.body.price;
    wishlist.save(function (err, savedWishlist) {
        if (err) {
            res.status(500).send({ error: "Could not add wishlist!" });
        }
        else {
            res.send(savedWishlist);
        }
    });
})


// Fetch wishlist data
app.get('/wishlist', function (req, res) {
    Wishlist.find({}, function (err, wishlists) {
        if (err) {
            res.status(500).send({ error: "Could not fetch wishlists!" });
        }
        else {
            res.send(wishlists);
        }
    });
});

// Update wishlist data
app.put('/wishlist/product/add', function (req, res) {
    Product.findOne({ _id: req.body.productId }, function (err, product) {
        if (err) {
            res.status(500).send({ error: "Could not update wishlists!" });
        }
        else {
            Wishlist.update({ _id: req.body.wishlistId }, { $addToSet: { products: product._id } }, function (err, wishlist) {
                if (err) {
                    res.status(500).send({ error: "Could not update wishlists!" });
                }
                else {
                    res.send("Wishlist successfully updated!");
                }
            });
        }
    });
});

app.listen(4200, function () {
    console.log("Colal API running on port 4200");
});