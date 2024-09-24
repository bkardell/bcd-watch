# bcd-watch

bcd-watch is based on the idea of diffing two sets of bcd data.  Parts of the code can be used to diff any set of bcd releases (index.js actually does the diffing/writing work). 

Under normal operation, bcd-watch tracks the releases its used in `/store/bookkeeping.json`.  Every few hours a cron job executes `node run.js` (requires node 19).  This fetches the latest bcd data from the bcd github repo and if it is newer than the latest entry, saves a copy within `/store`.  We currently save a copy of every release, whether we generate a diff based on it or not, just so that we can create diffs of any two in the future.  Every Monday it runs the diff and writes the reports to `out/`.

The HTML files are generated with Handlebars templates which live in `/templates/.

Occasionaly, if we change something about templating we may run `reprocessAll.js`, which just looks at the date oriented release files in `/store/` and loops through a simulation of each monday from then until now.
