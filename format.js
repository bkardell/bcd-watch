let lastTopic = ""

function formatFeatureStr(str, topic) {
	let ret = str.replace("bcd ::: ", "")
	if (topic) {
		ret = ret.replace(`${topic} :::`, '')
	}
	return ret.replaceAll(':::', "➞")
}

function formatSummary(delta, data) {
	
	let rTS = new Date(Date.parse(delta.__meta[0].newer.releaseDate)); // 'reportTimeStamp'
	let reportDate = `${rTS.toDateString()}`;
	let lastTopic = '';
	let out = `
	<h1>BCD Changes Report, <time>${reportDate}</time></h1>
	<div>
		<p><strong>Summary of BCD changes</strong> <br>
		<span>from <time>${delta.__meta[0].older.releaseDate}</time></span><br>
		<span>to <time>${delta.__meta[0].newer.releaseDate}</time></span></p>
	</div>
	<h2>Added Features: ${delta.addedFeatures.length}</h2>`
	 	if (delta.addedFeatures.length > 0) {
	 	out += `
	 <details class="added features">
	 		<summary>Expand to see the full list</summary>
	 		${delta.addedFeatures.map((feature) => {
	 			let retVal = ''
	 			let topic = feature.match(/bcd ::: (\w)*/)[0].replace("bcd ::: ", "")
	 			if (topic !== lastTopic) {
	 				if (lastTopic) {
	 					retVal += "</ol>"
	 				}
	 				retVal += `<h4>${topic}</h4><ol>`
	 				lastTopic = topic
	 			}
	 			retVal += `<li>${formatFeatureStr(feature, topic).trim()}</li>\n`
	 			return retVal
	 		}).join('')}
	 	</ol>
	 </details>`
	 }

	 	if (delta.removedFeatures.length > 0) {
	 out += `
	 <h2>Removed Features: ${delta.removedFeatures.length}</h2>
	 <details class="removed features">
	 		<summary>Expand to see the full list</summary>
	 		${delta.removedFeatures.map((feature) => {
	 			let retVal = ''
	 			let topic = feature.match(/bcd ::: (\w)*/)[0].replace("bcd ::: ", "")
	 			if (topic !== lastTopic) {
	 				if (lastTopic) {
	 					retVal += "</ol>"
	 				}
	 				retVal += `<h4>${topic}</h4><ol>`
	 				lastTopic = topic
	 			}
	 			retVal += `<li>${formatFeatureStr(feature, topic).trim()}</li>\n`
	 			return retVal
	 		}).join('')}
	 	</ol>
	 </details>`
	 }
	lastTopic = '';
	 out += `<h2>Implementation Status Changes: +${delta.addedImplementations.length}, -${delta.removedImplementations.length}</h2>

		<h3>Added (${delta.addedImplementations.length})</h3>`;
		out += `<section class="added implementations">`;
		out += `
 		${delta.addedImplementations.map((feature) => {
 			let retVal = ''
 			let topic = feature.key.match(/bcd ::: (\w)*/)[0].replace("bcd ::: ", "")
 			if (topic !== lastTopic) {
 				if (lastTopic) {
 					retVal += "</ol>"
 				}
 				retVal += `<h4>${topic}</h4><ol>`
 				lastTopic = topic
 			}
 			retVal +=  `<li`;
 			if (feature.addedImplementations.length == 3) {
 				retVal += ` class="all3"`;
 			}
 			retVal +=  `>`;
 			if (feature.mdn_url || feature.spec_url) {
	 			retVal += `<a href="${feature.mdn_url || feature.spec_url}">`;
	 		} else {
	 			retVal += '<span>';
	 		}
 			retVal += `${formatFeatureStr(feature.key, topic)}`;
 			if (feature.mdn_url || feature.spec_url) {
	 			retVal += `</a>`;
 			} else {
	 			retVal += '</span>';
	 		}
 			retVal += ` <b><br></b> `;
 			retVal += ` <span class="browsers">Added to <strong>${feature.addedImplementations.join(', ')}</strong></span> `;
 			retVal += ` <b>&nbsp;➞&nbsp;</b> `;
 			retVal += ` <span class="ni${feature.totalImplementations} engines"><strong>${feature.totalImplementations} of 3</strong> engines</span></li>\n`;
 			return retVal;
 		}).join('')}
 		</ol>
	 	</section>`
	 	
	 	if (delta.removedImplementations.length > 0) {
			out += `<h3>Removed (${delta.removedImplementations.length})</h3>

			<section class="removed implementations">
				<ol class="removed implementations">
					${delta.removedImplementations.map((feature) => {
						return `<li><a href="${''}">${formatFeatureStr(feature.name)}</a> implementation removed in: ${feature.implementationsRemoved };</li>\n`
					}).join('')}
				</ol>
			</section>
		 `
		}

	 return out
}

function formatCompleted(delta, data) {
	let complete = delta.addedImplementations.filter(feature => { return feature.totalImplementations === 3 })
	let rTS = new Date(Date.parse(delta.__meta[0].newer.releaseDate)); // 'reportTimeStamp'
	let reportDate = `${rTS.toDateString()}`;

	let out = `<h1>BCD New Baselines Report, <time>${reportDate}</time></h1>
		<div>
			<p><strong>Summary of <a href="https://web.dev/baseline/">Baseline</a> changes</strong><br>
			<span>from <time>${delta.__meta[0].older.releaseDate}</time></span><br>
			<span>to <time>${delta.__meta[0].newer.releaseDate}</time></span></p>
		</div>
		<p>${complete.length>0?complete.length:'No'} new Baseline implementation${complete.length== 1?'':'s'}${complete.length==0?' to report 🙁':''}</p>`;
		if (complete.length > 0) {
			out += `
			<section class="added implementations">
			${complete.map((feature) => {
				let retVal = ''
				let topic = feature.key.match(/bcd ::: (\w)*/)[0].replace("bcd ::: ", "")
				if (topic !== lastTopic) {
					if (lastTopic) {
						retVal += "</ol>"
					}
					retVal += `<h4>${topic}</h4><ol>`
					lastTopic = topic
				}
				retVal +=  `<li>`;
				if (feature.mdn_url || feature.spec_url) {
					retVal += `<a href="${feature.mdn_url || feature.spec_url}">`;
				}
				retVal += `${formatFeatureStr(feature.key, topic)}`;
				if (feature.mdn_url || feature.spec_url) {
					retVal += `</a>`;
				}
				retVal += ` <b>&nbsp;➞&nbsp;</b> `;
				retVal += ` <span class="browsers">Added to <strong>${feature.addedImplementations.join(', ')}</strong></span> `;
				retVal += ` <b></b> `;
				retVal += ` </li>\n`;
				return retVal;
			}).join('')}
			</ol>
			</section>
		 `;
		}

	 return out
}
exports.formatSummary = formatSummary
exports.formatCompleted = formatCompleted
