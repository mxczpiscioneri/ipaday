var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var beers = require('./routes/beers');
var db = require('./mongoose');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.get('/beers', beers.findAll);
app.get('/beers/:id', beers.findById);
app.post('/beers', beers.addBeer);
app.put('/beers/:id', beers.updateBeer);
app.delete('/beers/:id', beers.deleteBeer);

app.listen(process.env.PORT || 8080, function() {
	console.log('App listening on port 8080!');
});