const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const index = require('./index.js').run
const bookkeepingPath = './store/bookkeeping.json';
const bookkeeping = JSON.parse(fs.readFileSync(bookkeepingPath));

console.log("checking...", Date.now())
JSDOM
.fromURL("https://github.com/mdn/browser-compat-data/releases", {})
.then(async dom => {

// inside the github page is a link to the latest release
let el = dom.window.document.querySelector('[href^="/mdn/browser-compat-data/releases/"]');
let curReleaseURL = el.getAttribute('href')

// the last part of the url is the version number
let curReleasePathParts = curReleaseURL.split("/")
let version = curReleasePathParts.pop()

// there is always a .json if we swap in the version
let jsonURL = `https://github.com/mdn/browser-compat-data/releases/download/${version}/data.json`
let resp = await fetch(jsonURL)  
let data = await resp.json()

// we have the new one!
let updatedDate = new Date(data.__meta.timestamp || Date.now())
let latestDate = new Date(bookkeeping.latest.timestamp)

let deltaInDays = Math.round((updatedDate - latestDate  ) /  86400000)
console.log('???', deltaInDays)
if((updatedDate > latestDate) && (deltaInDays >= 5)){
	console.log("I think I should update")

	let dateParts = updatedDate.toDateString().split(' ')
	dateParts.shift()
	let dateStr = dateParts.join(' ')

	//write the store to the file
	let filename = `${dateStr}.json`
	fs.writeFileSync(`./store/${filename}`, JSON.stringify(data), 'utf8')

	//update bookkeeping values
	bookkeeping.previous = bookkeeping.latest 
	bookkeeping.latest = {
	"file": filename, 
	"timestamp":data.__meta.timestamp
	}
	
	//rerun index stuff with those
	index(bookkeeping.previous.file, bookkeeping.latest.file)

	//only write the update has happened, whne it has happened
	fs.writeFileSync(bookkeepingPath, JSON.stringify(bookkeeping,null,2), 'utf8')

	console.log("********** UPDATED *************")
	console.log(dateStr, JSON.stringify(data.__meta))

} else {
	console.log("I think I should NOT update")
}
console.log("I'll check again later...")
});




