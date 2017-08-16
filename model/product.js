var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema ({
    title: String,
    price: Number,
    likes: {type: Number, default: 0}
})

module.exports = mongoose.model('Product', Product);