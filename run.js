const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const index = require('./index.js').run
const bookkeepingPath = './store/bookkeeping.json';
const bookkeeping = JSON.parse(fs.readFileSync(bookkeepingPath));
const utils = require('./utils.js');


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
    console.log(`url: `, jsonURL)
    let resp = await fetch(jsonURL)
    let data = await resp.json()

    console.log(`we have the new one:`)

    // we have the new one!document.querySelectorAll('[datetime]').forEach(item => console.log(item.getAttribute('datetime')) )
    let updatedDate = new Date(data.__meta.timestamp || Date.now())
    let latestReleaseDate = new Date(bookkeeping.latest.timestamp)

    let deltaInDays = Math.round((updatedDate - latestReleaseDate) / 86400000)
    let calendarDeltaInDays = Math.round((updatedDate - new Date()) / 86400000)

    console.log("meta:", JSON.stringify(data.__meta))
    console.log("updated %s, latest %s", updatedDate, latestReleaseDate)
    console.log(`It's been ${calendarDeltaInDays} days since then.`)

    if (
      (updatedDate > latestReleaseDate)
    ) {
      console.log("A new release is available...")
      let dateStr = utils.toISODateString(updatedDate)

      //write the store to the file
      let filename = `${dateStr}.json`
      fs.writeFileSync(`./store/${filename}`, JSON.stringify(data), 'utf8')


      //update bookkeeping values
      bookkeeping.previous = bookkeeping.latest
      bookkeeping.latest = {
        "file": filename,
        "timestamp": data.__meta.timestamp,
        "version": data.__meta.version
      }

      //rerun index stuff with those
      index(
        bookkeeping.previous.file,
        bookkeeping.latest.file,
        utils.toISODateString(new Date())
      )

      //only write the update has happened, whne it has happened
      fs.writeFileSync(bookkeepingPath, JSON.stringify(bookkeeping, null, 2), 'utf8')

      console.log("********** UPDATED *************")
      console.log(dateStr, JSON.stringify(data.__meta))

    } else {
      console.log("No updates to the store, but we'll write a new report...")
      //rerun index stuff with those
      index(
        bookkeeping.latest.file,
        bookkeeping.latest.file,
        new Date()
      )
    }
    console.log("I'll check again later...")
  });