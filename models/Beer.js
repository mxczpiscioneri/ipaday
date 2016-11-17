var mongoose = require("mongoose");

var BeerSchema = new mongoose.Schema({
	name: String,
	style: String,
	brewery: String,
	city: String,
	ABV: Number,
	IBU: Number,
	details: String,
	image: String,
	year: Number
});

module.exports = mongoose.model('Beer', BeerSchema);