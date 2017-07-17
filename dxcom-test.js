
const assert = require( "assert" );
const dxcom = require( "./dxcom.js" );

assert.equal( dxcom( "gedit", true ), true, "should be true" );

dxcom( "gedit" )( function done( error, result ){
	assert.equal( result, true, "should be true" );

	console.log( "ok" );
} );
