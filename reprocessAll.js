const fs = require('fs')
const index = require('./index.js').run

function stripFileExtension(str) {
  return str.split(".")[0]
}

function getSortedListOfEntries(path) {
  let files = fs.readdirSync(path)

  files = files.filter(name => name.endsWith(".html") && name !== "index.html")
  files.sort(function(a,b){
    return new Date(stripFileExtension(a)) - new Date(stripFileExtension(b));
  })
  return files
}

let entries = getSortedListOfEntries("./out/weekly")

entries.forEach((file1, i) => {
	let file2 = entries[i+1]
	if(file2){
		let earlier = file1.replace('.html', '.json').replaceAll('-', ' ')
		let later = file2.replace('.html', '.json').replaceAll('-', ' ')
		console.log(`re-processing timespan from ${earlier} - ${later}`)
		index(earlier, later)
	}
})


