var cases = [];
tciaDataEntries.forEach(entry => {
	const subjectID = entry.SubjectID.replace(' ', '');
	const collectionName = entry.Collection.replace(' ', '');
	cases.push({
        Collection: entry.Collection,
        SubjectID: entry.SubjectID,
		studies: [{
			StudyInstanceUID: entry.StudyInstanceUID,
			StudyDescription: entry.StudyDescription,
			StudyDate: entry.StudyDate,
			series: [{
				SeriesInstanceUID: entry.SeriesInstanceUID,
				SeriesDescription: entry.SeriesDescription,
				NumberOfImages: entry.NumberOfImages,
			}]
		}]
	})
});

const couchDBJSON = {
	cases
};

console.log(JSON.stringify(couchDBJSON, null, 2));

var series = cases.map(a => a.studies[0].series[0].SeriesInstanceUID)

console.log(JSON.stringify(series, null, 2));