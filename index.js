/*
  Exports: run(oldFilePath, latestFilePath)  
  
  Takes file paths for two bcd json files, 
  does some processing, produces a flattened delta
  and outputs out/index.html
 */
let fs = require('fs'),
  Handlebars = require('handlebars')
  store_path = './store',
  output_path = './out'
  flatten = require('./flatten.js').flatten,
  delta = require('./delta.js').delta,
  formatter = require('./format'),
  RSS = require('./feed-creator.js')

function stripFileExtension(str) {
  return str.split(".")[0]
}

Handlebars.registerHelper('stripFileExtension', stripFileExtension)
Handlebars.registerHelper('pluralize', function(number, singular, plural) {
    if (number === 1)
        return singular;
    else
        return (typeof plural === 'string' ? plural : singular + 's');
});


function shortDate(date) {
  let dateParts = date.toDateString().split(' ')
  dateParts.shift()
  return dateParts.join('-')
}

function toTopicsFromStrings(list) {
  let ret = {}
  list.forEach(item => {
    let topic = item.match(/bcd ::: (\w)*/)[0].replace("bcd ::: ", "")
    ret[topic] = ret[topic] || []
    ret[topic].push(item)
  })
  return ret
}

function toTopicsFromObjects(list) {
  let ret = {}
  list.forEach(item => {
    let topic = item.key.match(/bcd ::: (\w)*/)[0].replace("bcd ::: ", "")
    ret[topic] = ret[topic] || []
    ret[topic].push(item)
  })
  return ret
}

function getSortedListOfEntries(path) {
  let files = fs.readdirSync(path)

  files = files.filter(name => name.endsWith(".html") && name !== "index.html")
  files.sort(function(a,b){
    return new Date(stripFileExtension(b)) - new Date(stripFileExtension(a));
  })
  return files
}

function makeHistoricalIndex() {
  const compiledTemplate = require("./templates/index.handlebars");
  fs.writeFileSync(
    output_path + "/index.html", 
    compiledTemplate({
      weekly: getSortedListOfEntries(output_path + "/weekly"),
      completed: getSortedListOfEntries(output_path + "/weekly-completed")
    })
  )
}

function run(o,l) {
  let inputA = JSON.parse(fs.readFileSync(`${store_path}/${o}`))
  let inputB = JSON.parse(fs.readFileSync(`${store_path}/${l}`))
  let latestBrowsers = {
    chrome: Object.keys(inputB.browsers.chrome.releases).map(n => parseFloat(n)).slice(-4),
    firefox: Object.keys(inputB.browsers.firefox.releases).map(n => parseFloat(n)).slice(-4),
    safari: Object.keys(inputB.browsers.safari.releases).map(n => parseFloat(n)).slice(-4)
  }

  let flattenedA = flatten(inputA)
  let flattenedB = flatten(inputB)
  
  let data = delta(flattenedA, flattenedB, latestBrowsers)

  let fromDate = new Date(inputA.__meta.timestamp)
  let toDate =  new Date(inputB.__meta.timestamp)
  let name = shortDate(toDate)

  data.__meta = [{
      older: { releaseDate: fromDate },
      newer: { releaseDate: toDate }
  }]
  data.addedFeatures = toTopicsFromStrings(data.added)
  data.removedFeatures = toTopicsFromStrings(data.removed)
  data.backfilledImplementations = toTopicsFromObjects(data.backfilledImplementations)
  data.addedImplementations = toTopicsFromObjects(data.addedImplementations)
  data.permalink = name

  let out = formatter.formatSummary(data, flattenedB)
  let title = `BCD Changes Report, ${fromDate.toDateString()} - ${toDate.toDateString()}`
         
  // current...
  fs.writeFileSync(
      output_path + '/weekly/index.html',
      out,
      'utf8'
  )


  // archived
  fs.writeFileSync(
      output_path + `/weekly/${name}.html`,
      out,
     'utf8'
  )

  RSS({
      items: [{ 
        title: title,
        file: `${name}.html`,
        blurb: 'Weekly summary of changes to BCD data',
        content: out,
        pubDate: toDate, // I guess always use the to date?
        image: ""
      }]
    },
		{
			title: `BCD changes (weekly)`,
			path: output_path + `/weekly`
		}
  )



  let outComplete = formatter.formatCompleted(data, flattenedB)
  title =  `BCD New Baselines Report, ${fromDate.toDateString()} - ${toDate.toDateString()}`
  
  fs.writeFileSync(
      output_path + `/weekly-completed/${name}.html`,
      outComplete,
     'utf8'
  )

  fs.writeFileSync(
      output_path + '/weekly-completed/index.html',
      outComplete,
      'utf8'
  )

  RSS({
      items: [{ 
        title: title,
        file: `${name}-completed.html`,
        blurb: 'Weekly summary of new Baseline items in BCD data',
        content: outComplete,
        pubDate: toDate, // I guess always use the to date?
        image: ""
      }]
  	},
		{
			title: `New baselines (weekly)`,
      path: output_path + `/weekly-completed`
		}
	)

  makeHistoricalIndex()


}

exports.run = run
