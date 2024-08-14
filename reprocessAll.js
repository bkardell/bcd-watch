const fs = require('fs')
const index = require('./index.js').run
const entriesStore = require('./entriesStore.js')
const utils = require('./utils.js')

let result = {}
let list = entriesStore.getSortedListOfJSONEntries("./store", true).map(item => utils.dateFromISODateString(item))
let start = list[0], 
    end = list[1], 
    firstMonday = utils.findNextMonday(end),
    today = new Date(),
    mondays = [], 
    prevLastDate

for (let currentMonday = firstMonday; currentMonday <= today; currentMonday = utils.findNextMonday(currentMonday, true)) {
  mondays.push(currentMonday)
}

let used = [start]

mondays.forEach(monday => {
	lastRelevantIndex = list.findIndex(date => date > monday) - 1

	if (prevLastDate == list[lastRelevantIndex]) {
		console.log(`\n\n${monday.toDateString()} => nothing new to report`)
	} else {
   	console.log(`\n\n${monday.toDateString()} =>
      from: ${start}
   	  lastDate: ${list[lastRelevantIndex]}`)

   	index(
   		utils.jsonForDate(start), 
   		utils.jsonForDate(list[lastRelevantIndex]), 
   		utils.toISODateString(monday)
   	)
   	used.push(list[lastRelevantIndex])
	}
   prevLastDate = list[lastRelevantIndex]
   start = list[lastRelevantIndex]
})

/* 
This can be used to log the ones we aren't using, 
if we want to trim a bunch of them

console.log('unused: ', list.filter(item => {
	return !used.includes(item)
}))
*/
