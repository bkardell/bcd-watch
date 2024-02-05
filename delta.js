const browsers = ['firefox', 'chrome', 'safari']
const unimplemented = {
    "support" : {
        "fake": {},
        "chrome": {
            "version_added": false
          },
          "edge": {
            "version_added": false
          },
          "firefox": {
            "version_added": false
          },
          "firefox_android": {
            "version_added": false
          },
          "opera": {
            "version_added": false
          },
          "safari": {
            "version_added": false
          },
          "safari_ios": {
            "version_added": false
          } 
        }
    }

function union(setA, setB) {
  const _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

/*
	@key The node name/path
	@past the past bcd entry under that name
	@cur the cur bcd entry under that name, modified by ref where relevant
	@out the output object, modified by ref	(added/removed)

	returns whether or not there was any delta
*/
function deltaSupport(key, past, cur, out) {
	let added = [], removed = [], total = 0
	let changed = false
    
    browsers.forEach(browser => {
        if(cur.support[browser].version_added) {
            total++
        }
		if (!past.support[browser].version_added && cur.support[browser].version_added) {
			//out.addedImplementations.push(key)
            cur.key = key
			added.push(cur)
			if (!changed){ out.addedImplementations.push(cur) }
			changed = true
		} else if (past.support[browser].version_added && !cur.support[browser].version_added) {
			//out.removedImplementations.push(key)
			removed.push(browser)
			changed = true
		}
	})
    if (added.length > 0) {
        cur.addedImplementations = added
    }

    if (removed.length > 0) {
        cur.removedImplementsions = removed
    }
    cur.totalImplementations = total;
	return changed
}

function delta (bcdObjA, bcdObjB) {
    let out = { added: [], removed: [], changed: {}, addedImplementations: [], removedImplementations: [] }
    let keySetA = new Set(Object.keys(bcdObjA))
    let keySetB = new Set(Object.keys(bcdObjB))
    let allKeys = union(keySetA, keySetB)
    for (const key of allKeys) {
        let inA = keySetA.has(key)
        let inB = keySetB.has(key)

        let cur = bcdObjB[key] || unimplemented
        let past = bcdObjA[key] || unimplemented


        if (inA && !inB) {
            out.removed.push(key)
        } else if (!inA && inB) {
            out.added.push(key)
        }
        let hasChanges = deltaSupport(key, past, cur, out)
        if (hasChanges) {
        	out.changed[key] = cur[key]
        }
    }
    return out
}

exports.delta = delta