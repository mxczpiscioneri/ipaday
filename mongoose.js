var mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.load();

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DB}`);
var db = mongoose.connection;

db.on('error', function(err) {
	console.error('MongoDB connection error:', err);
});
db.once('open', function callback() {
	console.info('MongoDB connection is established');
});