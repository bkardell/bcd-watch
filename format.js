let lastTopic = ""

function formatFeatureStr(str, topic) {
	let ret = str.replace("bcd ::: ", "")
	if (topic) {
		ret = ret.replace(`${topic} :::`, '')
	}
	return ret.replaceAll(':::', "➞")
}

function formatSummary(delta, data) {
	let out = `
	<div>
		<tt>Summary of BCD changes from ${delta.__meta[0].older.releaseDate} to ${delta.__meta[0].newer.releaseDate}</tt>
	</div>
	<h2>Added Features: ${delta.addedFeatures.length}</h2>
	 <details>
	 	<ol>

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
	 			retVal += `<li>${formatFeatureStr(feature, topic)}</li>`
	 			return retVal
	 		}).join('')}
	 	</ol>
	 </details>

	 <h2>Removed Features: ${delta.removedFeatures.length}</h2>
	 <details>
	 	<ol>
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
	 			retVal += `<li>${formatFeatureStr(feature, topic)}</li>`
	 			return retVal
	 		}).join('')}
	 	</ol>
	 </details>

	 <h2>Implementation Status Changes: +${delta.addedImplementations.length}, -${delta.removedImplementations.length}</h2>

		<h3>Added (${delta.addedImplementations.length})</h3>
		<label>Only Show Completed in All 3 <input type="checkbox" id="filter"></label>
		<script>filter.onchange = () => { 
			document.body.classList.toggle('filtered')
		}</script>
		<ol  class="added implementations"><li>
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
 			retVal +=  `<li><a href="${feature.mdn_url || feature.spec_url}">${formatFeatureStr(feature.key, topic)}</a> <span class="browsers">Added to <strong>${feature.addedImplementations.join(',')}</strong></span> <span class="ni${feature.totalImplementations} engines">Now in <strong>${feature.totalImplementations}</strong> of 3 engines</span></li>`
 			return retVal;
 		}).join('')}
 		</li></ol>

		<h3>Removed (${delta.removedImplementations.length})</h3>

	 	<ol class="removed implementations">
	 		${delta.removedImplementations.map((feature) => {
	 			return `<li><a href="${''}">${formatFeatureStr(feature.name)}</a> implementation removed in: ${feature.implementationsRemoved };</li>`
	 		}).join('')}
	 	</ol>
	 `

	 return out
}

function formatCompleted(data) {
	let out = `<h1>${delta.length} New Universal Implementations Reported!</h2>

 	<ol class="added implementations">
 		${delta.map((feature) => {
 			return `<li>${feature.name}</li>`
 		}).join('')}
 	</ol>

	 
	 `

	 return out
}
exports.formatSummary = formatSummary
exports.formatCompleted = formatCompleted
