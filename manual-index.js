const fs = require('fs')
const index = require('./index.js').run
const utils = require('./utils.js')

const bookkeeping = JSON.parse(
	fs.readFileSync('./store/bookkeeping.json', 'utf8')
)


let today = new Date(),

	// If today is monday, use today, otherwise fine previous monday
	m = (today.getDay() == 1) ? today : utils.findPreviousMonday(today),
	
	previousReleaseDate = utils.dateFromISODateString(
		utils.stripFileExtension(
			bookkeeping.previous.file
		)
	),

	latestReleaseDate = utils.dateFromISODateString(
		utils.stripFileExtension(
			bookkeeping.latest.file
		)
	),

	diffReportDate = utils.findNextMonday(latestReleaseDate)

	// if the relevant report day would be greater than today,
	// the diff is just between latest and latest (ie, nothing)
	if(diffReportDate < today) {
		bookkeeping.previous = bookkeeping.latest
	}

//rerun index stuff with those
index(
	bookkeeping.previous.file, 
	bookkeeping.latest.file, 
	utils.toISODateString(m)
)