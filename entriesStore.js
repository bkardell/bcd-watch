const fs = require('fs')

function stripFileExtension(str) {
  return str.split(".")[0]
}

exports.getSortedListOfHTMLEntries = function (path, _stripFileExtension) {
  let files = fs.readdirSync(path)

  files = files.filter(name => name.endsWith(".html") && name !== "index.html")
  if(_stripFileExtension) {
		files = files.map(name => stripFileExtension(name))
	}
  files.sort(function(a,b){
    return new Date(stripFileExtension(a)) - new Date(stripFileExtension(b));
  })
  return files
}

exports.getSortedListOfJSONEntries = function (path, _stripFileExtension) {
	let files = fs.readdirSync(path)
	files = files.filter(name => name.endsWith(".json") && name !== "bookkeeping.json")
	if(_stripFileExtension) {
		files = files.map(name => stripFileExtension(name))
	}
	files.sort(function(a,b){
    return new Date(stripFileExtension(a)) - new Date(stripFileExtension(b));
  })
  return files
}


