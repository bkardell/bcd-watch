let lastTopic = "",
    Handlebars = require('handlebars')

Handlebars.registerHelper('formatFeatureStr', (str, topic) => {
	let ret = str.replace("bcd ::: ", "")
	if (topic) {
		ret = ret.replace(`${topic} :::`, '')
	}
	return ret.replaceAll(':::', "➞")
})

Handlebars.registerHelper('mdnLink', (o) =>{
	return o.mdn_url || o.spec_url
})

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
	let reportDate = rTS.toDateString();

	const compiledTemplate = require("./templates/weekly.handlebars");
	const dtOptions = {
		weekday:'long',
	  year: 'numeric',
  	month: 'long',
	  day: 'numeric'
	}

	return compiledTemplate({
		olderReleaseDate: delta.__meta[0].older.releaseDate.toLocaleDateString('en-GB',dtOptions),
		laterReleaseDate: delta.__meta[0].newer.releaseDate.toLocaleDateString('en-GB',dtOptions),
		olderReleaseDateTime: delta.__meta[0].older.releaseDate,
		laterReleaseDateTime: delta.__meta[0].newer.releaseDate,
		reportDate: reportDate,
		addedFeaturesCt: addedFeaturesCt,
		addedFeatures: delta.addedFeatures,
		removedFeaturesCt: removedFeaturesCt,
		removedFeatures: delta.removedFeatures,
		addedImplmentationsCt: addedImplmentationsCt,
		addedImplementations: delta.addedImplementations,
		removedImplementationsCt: removedImplementationsCt,
		removedImplementations: delta.removedImplementations
	})
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
	let reportDate = rTS.toDateString();

	const compiledTemplate = require("./templates/baseline.handlebars");
	const dtOptions = {
		weekday:'long',
	  year: 'numeric',
  	month: 'long',
	  day: 'numeric'
	}

	return compiledTemplate({
		olderReleaseDate: delta.__meta[0].older.releaseDate.toLocaleDateString('en-GB',dtOptions),
		laterReleaseDate: delta.__meta[0].newer.releaseDate.toLocaleDateString('en-GB',dtOptions),
		olderReleaseDateTime: delta.__meta[0].older.releaseDate,
		laterReleaseDateTime: delta.__meta[0].newer.releaseDate,
		reportDate: reportDate,
		completedCt: ct,
		completedImplementations: complete,
	})
}

exports.formatSummary = formatSummary
exports.formatCompleted = formatCompleted
