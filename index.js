/*
  Exports: run(oldFilePath, latestFilePath)  
  
  Takes file paths for two bcd json files, 
  does some processing, produces a flattened delta
  and outputs out/index.html
 */
  let fs = require('fs'),
  store_path = './store',
  output_path = './out'
  flatten = require('./flatten.js').flatten,
  delta = require('./delta.js').delta,
  formatter = require('./format')


function run(o,l) {
  let inputA = JSON.parse(fs.readFileSync(`${store_path}/${o}`))
  let inputB = JSON.parse(fs.readFileSync(`${store_path}/${l}`))

  let flattenedA = flatten(inputA)
  let flattenedB = flatten(inputB)
  //console.log(JSON.stringify(flattenedA,null,2))


  let data = delta(flattenedA, flattenedB)

  // TODO: this is messy, should probably reconsider
  // how it is stored and recalled, but at least for now
  // this keeps the old thing working 
  data.__meta = [{
      older: { releaseDate: new Date(inputA.__meta.timestamp) },
      newer: { releaseDate: new Date(inputB.__meta.timestamp) }
  }]
  data.addedFeatures = data.added
  data.removedFeatures = data.removed


  let out = formatter.formatSummary(data, flattenedB)
  //console.log(data.addedImplementations)
  console.log(out)
  fs.writeFileSync(
      output_path + '/index.html',
      `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8" />\n<link type="text/css" href="styles.css" rel="stylesheet">\n<title>BCD Changes Report, ${new Date()}</title>\n</head>\n<body>\n` + out + `\n</body>\n</html>`,
      'utf8'
  )
  // console.log(flattenedB[data.added[0]])
}

exports.run = run
