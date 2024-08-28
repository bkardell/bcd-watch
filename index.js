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
  RSS = require('./feed-creator.js'),
  entriesStore = require('./entriesStore.js'),
  utils = require('./utils.js')


Handlebars.registerHelper('stripFileExtension', utils.stripFileExtension)
Handlebars.registerHelper('pluralize', function(number, singular, plural) {
    if (number === 1)
        return singular;
    else
        return (typeof plural === 'string' ? plural : singular + 's');
});

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


// TODO: DO We need this?
function getSortedListOfEntries(path) {
  let files = fs.readdirSync(path)

  files = files.filter(name => name.endsWith(".html") && name !== "index.html")
  files.sort(function(a,b){
    return new Date(utils.stripFileExtension(b)) - new Date(utils.stripFileExtension(a));
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

function getLastVersions(browserReleases) {
  return Object.keys(browserReleases).map(n => {
      return parseFloat(n)
    }).sort((a, b) => {
     if(a > b) { return -1; }
     else if (b < a) { return -1; } 
     else return 0
  }).slice(0, 3)
}

function run(o, l, reportName='') {
  let inputA = JSON.parse(fs.readFileSync(`${store_path}/${o}`))
  let inputB = JSON.parse(fs.readFileSync(`${store_path}/${l}`))
  let latestBrowsers = {
    chrome: getLastVersions(inputB.browsers.chrome.releases),
    firefox: getLastVersions(inputB.browsers.firefox.releases),
    safari: getLastVersions(inputB.browsers.safari.releases)
  }

  let flattenedA = flatten(inputA)
  let flattenedB = flatten(inputB)
  let reportDate = utils.dateFromISODateString(reportName)
  let previousReportDate = utils.findPreviousMonday(reportDate)
  let data = delta(flattenedA, flattenedB, latestBrowsers)
  let fromDate = new Date(inputA.__meta.timestamp)
  let toDate =  new Date(inputB.__meta.timestamp)
  let name = reportName

  data.__meta = [{
      generatedOn: name,
      older: { 
        releaseDate: fromDate, 
        monday: previousReportDate,
        version: inputA.__meta.version 
      },
      newer: { 
        releaseDate: toDate, 
        monday: reportDate,
        version: inputB.__meta.version 
      }
  }]
  data.hasNewData = !utils.areSameDate(fromDate, toDate),
  data.addedFeatures = toTopicsFromStrings(data.added)
  data.removedFeatures = toTopicsFromStrings(data.removed)
  data.backfilledImplementations = toTopicsFromObjects(data.backfilledImplementations)
  data.addedImplementations = toTopicsFromObjects(data.addedImplementations)
  data.permalink = name

  let out = formatter.formatSummary(data, flattenedB)
  let title = 'BCD Changes Report, ' + reportDate.toDateString();
         
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
        pubDate: reportDate,
        image: ""
      }]
    },
		{
			title: `BCD changes (weekly)`,
			path: output_path + `/weekly`
		}
  )



  let outComplete = formatter.formatCompleted(data, flattenedB)
  title =  'BCD New Baselines Report, ' + reportDate.toDateString();
  
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
        pubDate: reportDate,
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
