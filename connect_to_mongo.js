var mongoose = require( 'mongoose' );
var express = require( 'express' );

mongoose.connect( 'localhost:27017' );

var db = mongoose.connection;
db.on( 'error', function () {
	console.log( 'error' );
} );

db.once( 'open', run );

function run () {
	var foodSchema = mongoose.Schema( {
		name: String,
		group: String,
	} );

	var Food = mongoose.model( 'food', foodSchema );

	var apple = new Food( {
		name: 'apple',
		group: 'fruit',
	} );

	apple.save( ( err, result ) => {
		if ( err ) {
			console.log( err );
		}
	} );

	Food.find( { name: 'apple' }, console.log );
}
