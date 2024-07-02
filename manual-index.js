const fs = require('fs')
const index = require('./index.js').run

const bookkeeping = JSON.parse(
	fs.readFileSync('./store/bookkeeping.json', 'utf8')
)

//rerun index stuff with those
index(bookkeeping.previous.file, bookkeeping.latest.file)

// You can run this manually locally
// with index("Jan 24 2024.json", "Jan 30 2024.json")
