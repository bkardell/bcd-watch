/*
   Takes a complex set of bcd data and 'flattens it'
   into an object with a key for each unique entry.
   'nodes' of the tree are separated by ':::', the 
   root is 'bcd'. example...
   
   {
     "bcd ::: webextensions ::: manifest ::: version": {
       "mdn_url": "https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/manifest.json/version",
       "source_file": "webextensions/manifest/version.json",
       "support": {
         ... the browser support
       }
       ... lots more entries like this
     }
*/

let toSkip = new Set(['browsers', '__meta']) 
let out = {}

function recurse (ctx, name='') {
   if (typeof ctx !== 'undefined') {
      let allKeys = Object.keys(ctx)
      for (const key of allKeys) {
         if (!toSkip.has(key)) { 
               if (key === '__compat') {
                  out[name.trim()] = ctx[key]
               } else {
                  recurse(ctx[key], ` ${name} ::: ${key}`)
               }
         }
      }
  }
}

exports.flatten = function (bcdObj) {
   out = {}
   recurse(bcdObj, 'bcd' )
   return out
}