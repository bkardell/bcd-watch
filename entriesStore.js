const fs = require('fs')
const index = require('./index.js').run

function stripFileExtension(str) {
  return str.split(".")[0]
}

exports.getSortedListOfHTMLEntries = function (path) {
  let files = fs.readdirSync(path)

  files = files.filter(name => name.endsWith(".html") && name !== "index.html")
  files.sort(function(a,b){
    return new Date(stripFileExtension(a)) - new Date(stripFileExtension(b));
  })
  return files
}

exports.getSortedListOfJSONEntries = function (path) {
  return exports.getSortedListOfHTMLEntries(path)
  			.map(name => { 
  				return name.replace('.html', '.json').replaceAll('-', ' ') 
  			})
}
