let lastTopic = ""

function formatFeatureStr(str, topic) {
	let ret = str.replace("bcd ::: ", "")
	if (topic) {
		ret = ret.replace(`${topic} :::`, '')
	}
	return ret.replaceAll(':::', "➞")
}

function toSimpleList(simpleList) {
	return Object.keys(simpleList).map(topic => {
	 			return `
	 				<h4>${topic}</h4>
	 				<ol>
	 				${simpleList[topic].map((feature) => {
	 					return `<li>${formatFeatureStr(feature, topic).trim()}</li>\n`
	 				}).join('')}
	 				</ol>`
	 		}).join('')
}
	 		
function formatSummary(delta, data) {
	let addedFeaturesCt = 0, 
			removedFeaturesCt = 0, 
			addedImplmentationsCt = 0
			removedImplementationsCt = 0;

	Object.keys(delta.addedFeatures).forEach(topic => {
		addedFeaturesCt += delta.addedFeatures[topic].length
	})
	Object.keys(delta.removedFeatures).forEach(topic => {
		removedFeaturesCt += delta.removedFeatures[topic].length
	})
	Object.keys(delta.addedImplementations).forEach(topic => {
		addedImplmentationsCt += delta.addedImplementations[topic].length
	})
	Object.keys(delta.removedImplementations).forEach(topic => {
		removedImplementationsCt += delta.removedImplementations[topic].length
	})
	let rTS = new Date(Date.parse(delta.__meta[0].newer.releaseDate)); // 'reportTimeStamp'
	let reportDate = `${rTS.toDateString()}`;
	let out = `
	<h1>BCD Changes Report, <time>${reportDate}</time></h1>
	<div>
		<p><strong>Summary of BCD changes</strong> <br>
		<span>from <time>${delta.__meta[0].older.releaseDate}</time></span><br>
		<span>to <time>${delta.__meta[0].newer.releaseDate}</time></span></p>
	</div>
	<h2>Added Features: ${addedFeaturesCt}</h2>`
	 	if (addedFeaturesCt > 0) {
	 	out += `
	 <details class="added features">
	 		<summary>Expand to see the full list</summary>
	 		${toSimpleList(delta.addedFeatures)}
	 </details>`
	 }

	 	if (removedFeaturesCt > 0) {
	 out += `
	 <h2>Removed Features: ${removedFeaturesCt}</h2>
	 <details class="removed features">
	 		<summary>Expand to see the full list</summary>
	 		${toSimpleList(delta.removedFeatures)}
	 </details>`
	 }
	separ = ' &nbsp;&nbsp;➞&nbsp;&nbsp; ';
	 out += `<h2>Implementation Status Changes: +${addedImplmentationsCt}, -${removedImplementationsCt}</h2>

		<h3>Added (${addedImplmentationsCt})</h3>`;
		out += `<section class="added implementations">`;
		out += `
		${Object.keys(delta.addedImplementations).map(topic => {
 			return `
 				<h4>${topic}</h4><ol>

 				${delta.addedImplementations[topic].map((feature) => {
 					return `
	 					<li ${(feature.addedImplementations.length == 3) ? 'class="all3"' : ''}>
	 					${(() => {
	 						if (feature.mdn_url || feature.spec_url) {
	 						   return `<a href="${feature.mdn_url || feature.spec_url}">${formatFeatureStr(feature.key, topic)}</a>` 
	 						} else {
	 							return `<span>${formatFeatureStr(feature.key, topic)}</span>`
	 						}
	 					})()}
		 				<b><br></b> 
		 				<span class="browsers">Added to <strong>${feature.addedImplementations.join(', ')}</strong></span> 
		 			  <b>&nbsp;➞&nbsp;</b>
 			    	<span class="ni${feature.totalImplementations} engines"><strong>${feature.totalImplementations} of 3</strong> engines</span></li>\n`;
 			}).join('')}`
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
	let complete = {}, ct = 0
	Object.keys(delta.addedImplementations).forEach(topic => {
		delta.addedImplementations[topic].forEach(feature => {
			if (feature.totalImplementations === 3) {
				complete[topic] = complete[topic] || []
				complete[topic].push(feature)
				ct++
			}
		})
	})
	
	let rTS = new Date(Date.parse(delta.__meta[0].newer.releaseDate)); // 'reportTimeStamp'
	let reportDate = `${rTS.toDateString()}`;

	let out = `<h1>BCD New Baselines Report, <time>${reportDate}</time></h1>
		<div>
			<p><strong>Summary of <a href="https://web.dev/baseline/">Baseline</a> changes</strong><br>
			<span>from <time>${delta.__meta[0].older.releaseDate}</time></span><br>
			<span>to <time>${delta.__meta[0].newer.releaseDate}</time></span></p>
		</div>
		<p>${ct>0?ct:'No'} new Baseline implementation${ct== 1?'':'s'}${ct==0?' to report 🙁':''}</p>`;
		if (ct> 0) {
			out += `
			<section class="added implementations">
			${Object.keys(complete).map((topic) => {
				return `
					<h4>${topic}</h4><ol>
					${complete[topic].map((feature) => {
 						return `
		 					<li ${(feature.addedImplementations.length == 3) ? 'class="all3"' : ''}>
		 					${(() => {
		 						if (feature.mdn_url || feature.spec_url) {
		 						   return `<a href="${feature.mdn_url || feature.spec_url}">${formatFeatureStr(feature.key, topic)}</a>` 
		 						} else {
		 							return `<span>${formatFeatureStr(feature.key, topic)}</span>`
		 						}
		 					})()}
			 				<b><br></b> 
			 				<span class="browsers">Added to <strong>${feature.addedImplementations.join(', ')}</strong></span> 
			 			    <b>&nbsp;➞&nbsp;</b>
			 			    <span class="ni${feature.totalImplementations} engines"><strong>${feature.totalImplementations} of 3</strong> engines</span></li>\n`;
 					}).join('')}`
			}).join('')}
			</ol>
			</section>
		 `;
		}

	 return out
}
exports.formatSummary = formatSummary
exports.formatCompleted = formatCompleted
