const fs = require('fs')
const index = require('./index.js').run
const utils = require('./utils.js')

if (process.argv.length !== 5) { 
 console.error('Expected 3 date strings yyyy-mm-dd representing the starting diff date, the ending diff date (both must be in /store) and an output date (must be a monday)!'); 
 process.exit(1); 
} 

outputDate = utils.dateFromISODateString(process.argv[4])
if(outputDate.getDay() !== 1) {
	console.error('the third argument (output date) must currently be a monday!'); 
 	process.exit(1); 
}


//rerun index stuff with those
index(
	process.argv[2] + ".json", 
	process.argv[3] + ".json", 
	process.argv[4]
)