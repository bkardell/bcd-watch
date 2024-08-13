const fs = require('fs')
const index = require('./index.js').run
const entriesStore = require('./entriesStore.js')

let listOfEntries = entriesStore.getSortedListOfJSONEntries("./out/weekly")
listOfEntries.forEach((earlier, i) => {
		let later = listOfEntries[i + 1]
		if (later) {	
			console.log(`re-processing timespan from ${earlier} - ${later}`)
			index(earlier, later)
		}
	})