var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var path = require('path');
var auth = require('./routes/auth');
var beers = require('./routes/beers');
var users = require('./routes/users');
var db = require('./mongoose');

app.use('/css', express.static(__dirname + '/node_modules/acsset/css'));
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// Auth
app.post('/api/authenticate', auth.authenticate);
app.post('/api/isAuthenticated', auth.isAuthenticated);

// User
app.get('/api/users', auth.isAuthenticated, users.findAll);
app.get('/api/users/:id', auth.isAuthenticated, users.findById);
app.post('/api/users', users.addUser);
app.put('/api/users/:id', auth.isAuthenticated, users.updateUser);
app.delete('/api/users/:id', auth.isAuthenticated, users.deleteUser);

// Beer
app.get('/api/beers', beers.findAll);
app.get('/api/beers/:year', beers.findYear);
app.get('/api/beers/view/:id', beers.findById);
app.post('/api/beers', auth.isAuthenticated, beers.addBeer);
app.post('/api/beers/upload', auth.isAuthenticated, multipartMiddleware, beers.upload);
app.put('/api/beers/:id', auth.isAuthenticated, beers.updateBeer);
app.delete('/api/beers/:id', auth.isAuthenticated, beers.deleteBeer);

app.use('*', function(req, res, next) {
	var indexFile = path.resolve(__dirname + '/public/index.html');
	res.sendFile(indexFile);
});

app.listen(process.env.PORT || 8080, function() {
	console.log('App listening on port 8080!');
});