/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "dxcom",
			"path": "dxcom/dxcom.js",
			"file": "dxcom.js",
			"module": "dxcom",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/dxcom.git",
			"test": "dxcom-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Execute command as daemon.
	@end-module-documentation

	@include:
		{
			"child": "child_process",
			"depher": "depher",
			"falzy": "falzy",
			"letgo": "letgo",
			"pedon": "pedon",
			"shft": "shft",
			"zelf": "zelf"
		}
	@end-include
*/

const child = require( "child_process" );
const depher = require( "depher" );
const falzy = require( "falzy" );
const letgo = require( "letgo" );
const pedon = require( "pedon" );
const shft = require( "shft" );
const zelf = require( "zelf" );

const dxcom = function dxcom( command, synchronous, option ){
	/*;
		@meta-configuration:
			{
				"command:required": "string",
				"synchronous": "boolean",
				"option": "object"
			}
		@end-meta-configuration
	*/

	if( falzy( command ) || typeof command != "string" ){
		throw new Error( "invalid command" );
	}

	let parameter = shft( arguments );

	synchronous = depher( parameter, BOOLEAN, false );

	option = depher( parameter, OBJECT, { } );

	/*;
		@note:
			This will let us detached from the parent process.
		@end-note
	*/
	option.detached = true;
	option.stdio = "ignore";

	if( !pedon.WINDOWS ){
		command = `nohup "${ command }" &> /dev/null &`

	}else{
		command = `START /B "${ command }" > NUL`
	}

	if( synchronous ){
		try{
			child.execSync( command, option );

			return true;

		}catch( error ){
			return false;
		}

	}else{
		let catcher = letgo.bind( zelf( this ) )( function done( callback ){
			child.exec( command, option, function done( error, output ){
				if( error instanceof Error ){
					callback( error, false );

				}else{
					callback( null, true );
				}
			} )
			.unref( );
		} );

		return catcher;
	}
};

module.exports = dxcom;
