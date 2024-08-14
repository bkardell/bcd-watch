const fs = require('fs')
const index = require('./index.js').run
const entriesStore = require('./entriesStore.js')

function getRelevantMonday(date, plus=0) {
    const result = new Date(date);
    const day = result.getDay();
    if (day==1) {
    	result.setDate(result.getDate() + plus);
    	return result
    }
    const diff = (day === 0 ? 1 : 8 - day); // If it's Sunday (day 0), add 1 day. Otherwise, add the difference to Monday.
    result.setDate(result.getDate() + diff);
    return result;
}


function shortDate(date) {
  let dateParts = date.toDateString().split(' ')
  dateParts.shift()
  return dateParts.join('-')
}

function jsonForDate(date) {
	return shortDate(date) + ".json"
}


let result = {}
let list = entriesStore.getSortedListOfJSONEntries("./store", true).map(item => new Date(item))
let start = list[0], 
    end = list[1], 
    firstMonday = getRelevantMonday(end),
    today = new Date(),
    mondays = [], 
    prevLastDate

for (let currentMonday = firstMonday; currentMonday <= today; currentMonday = getRelevantMonday(currentMonday, 7)) {
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
   		jsonForDate(start), 
   		jsonForDate(list[lastRelevantIndex]), 
   		shortDate(monday)
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
