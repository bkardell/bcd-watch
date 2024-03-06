const index = require('./index.js').run

//rerun index stuff with those
//index(bookkeeping.previous.file, bookkeeping.latest.file)

index("Jan 24 2024.json", "Jan 30 2024.json")
