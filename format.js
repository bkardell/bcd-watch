let lastTopic = "",
    Handlebars = require('handlebars'),
    utils = require('./utils.js')

Handlebars.registerHelper('formatFeatureStr', (str, topic) => {
	let ret = str.replace("bcd ::: ", "")
	if (topic) {
		ret = ret.replace(`${topic} :::`, '')
	}
	return ret.replaceAll(':::', "➞")
})

Handlebars.registerHelper('mdnLink', (o) =>{
	return o.mdn_url
})

Handlebars.registerHelper('specLink', (o) =>{
	return o.spec_url
})

Handlebars.registerHelper('uppercase', (str) =>{
	return str.toUpperCase()
})

function formatSummary(delta, data) {
	let addedFeaturesCt = 0, 
			removedFeaturesCt = 0, 
			addedImplmentationsCt = 0
			removedImplementationsCt = 0
			backfilledImplementationsCt = 0;

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
	Object.keys(delta.backfilledImplementations).forEach(topic => {
		backfilledImplementationsCt += delta.backfilledImplementations[topic].length
	})
	let rTS = utils.dateFromISODateString(delta.__meta[0].generatedOn); // 'reportTimeStamp'
	let reportDate = rTS.toDateString();

	const compiledTemplate = require("./templates/weekly.handlebars");
	const dtOptions = {
		weekday: 'long',
	  year: 'numeric',
  	month: 'long',
	  day: 'numeric'
	}

	return compiledTemplate({
		olderReleaseDate: delta.__meta[0].older.releaseDate.toLocaleDateString('en-GB',dtOptions),
		laterReleaseDate: delta.__meta[0].newer.releaseDate.toLocaleDateString('en-GB',dtOptions),
		olderReleaseDateTime: delta.__meta[0].older.releaseDate.toLocaleDateString('en-GB',dtOptions),
		laterReleaseDateTime: delta.__meta[0].newer.releaseDate.toLocaleDateString('en-GB',dtOptions),
		olderReleaseDateTime: delta.__meta[0].older.releaseDate.toLocaleDateString('en-GB',dtOptions),
		laterReleaseDateTime: delta.__meta[0].newer.releaseDate.toLocaleDateString('en-GB',dtOptions),
		olderMonday: delta.__meta[0].older.monday.toLocaleDateString('en-GB',dtOptions),
		laterMonday: delta.__meta[0].newer.monday.toLocaleDateString('en-GB',dtOptions),
		previousDate: delta.__meta[0].older.monday.toISOString().split('T')[0],
		previousLink: delta.__meta[0].older.monday.toISOString().split('T')[0] + '.html',
		olderReleaseVersion: delta.__meta[0].older.version,
		laterReleaseVersion: delta.__meta[0].newer.version,
		reportDate: reportDate,
		permalink: delta.permalink + ".html",
		addedFeaturesCt: addedFeaturesCt,
		addedFeatures: delta.addedFeatures,
		removedFeaturesCt: removedFeaturesCt,
		removedFeatures: delta.removedFeatures,
		addedImplmentationsCt: addedImplmentationsCt,
		addedImplementations: delta.addedImplementations,
		removedImplementationsCt: removedImplementationsCt,
		removedImplementations: delta.removedImplementations,
		backfilledImplementationsCt: backfilledImplementationsCt,
		backfilledImplementations: delta.backfilledImplementations,
		allImplementationsCt: addedFeaturesCt + removedFeaturesCt + backfilledImplementationsCt,
		hasNewData: delta.hasNewData
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
	
	let rTS = utils.dateFromISODateString(delta.__meta[0].generatedOn); // 'reportTimeStamp'
	let reportDate = rTS.toDateString();

	const compiledTemplate = require("./templates/baseline.handlebars");
	const dtOptions = {
		weekday: 'long',
	  year: 'numeric',
  	month: 'long',
	  day: 'numeric'
	}

	return compiledTemplate({
		olderReleaseDate: delta.__meta[0].older.releaseDate.toLocaleDateString('en-GB',dtOptions),
		laterReleaseDate: delta.__meta[0].newer.releaseDate.toLocaleDateString('en-GB',dtOptions),
		olderReleaseDateTime: delta.__meta[0].older.releaseDate.toLocaleDateString('en-GB',dtOptions),
		laterReleaseDateTime: delta.__meta[0].newer.releaseDate.toLocaleDateString('en-GB',dtOptions),
		olderReleaseDateTime: delta.__meta[0].older.releaseDate.toLocaleDateString('en-GB',dtOptions),
		laterReleaseDateTime: delta.__meta[0].newer.releaseDate.toLocaleDateString('en-GB',dtOptions),
		olderMonday: delta.__meta[0].older.monday.toLocaleDateString('en-GB',dtOptions),
		laterMonday: delta.__meta[0].newer.monday.toLocaleDateString('en-GB',dtOptions),
		olderReleaseVersion: delta.__meta[0].older.version,
		laterReleaseVersion: delta.__meta[0].newer.version,
		reportDate: reportDate,
		permalink: delta.permalink + ".html",
		hasNewData: delta.hasNewData,
		completedCt: ct,
		completedImplementations: complete
	})
}

exports.formatSummary = formatSummary
exports.formatCompleted = formatCompleted
