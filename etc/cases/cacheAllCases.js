var token = window.auth.accessToken;

function getCases(url, data) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
	    xhr.onload = function () {
	      if (this.status >= 200 && this.status < 300) {
	        resolve(xhr.response);
	      } else {
	        reject({
	          status: this.status,
	          statusText: xhr.statusText
	        });
	      }
	    };
	    xhr.onerror = function () {
      	  console.warn(this);
	      reject({
	        status: this.status,
	        statusText: xhr.statusText
	      });
	    };
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', `Bearer ${token}`);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(data));
	});
}

function callSeriesMetadata(url) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
	    xhr.onload = function () {
	      if (this.status >= 200 && this.status < 300) {
	        resolve(xhr.response);
	      } else {
	        reject({
	          status: this.status,
	          statusText: xhr.statusText
	        });
	      }
	    };
	    xhr.onerror = function () {
	      reject({
	        status: this.status,
	        statusText: xhr.statusText
	      });
	    };
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', `Bearer ${token}`);
		xhr.send();
	});
}

var user = '';
var password = '';
var dbURL = 'db.crowds-cure.org';
var url = `https://${user}:${password}@${dbURL}/cases/_find`;
var data = {
	selector: {
		//Collection: 'TCGA-BLCA'
	},
	limit: 3000,
    fields: ["_id", "studies.0.StudyInstanceUID", "studies.0.series.0.SeriesInstanceUID"],
}

getCases(url, data).then(casesJSON => {
	var cases = JSON.parse(casesJSON).docs;
	console.log(cases);
	var casePromises = cases.map(singleCase => {
		var StudyInstanceUID = singleCase.studies[0].StudyInstanceUID;
		var SeriesInstanceUID = singleCase.studies[0].series[0].SeriesInstanceUID;
		var seriesMetadataUrl = `https://cancer.crowds-cure.org/dcm4chee-arc/aets/DCM4CHEE/rs/studies/${StudyInstanceUID}/series/${SeriesInstanceUID}/metadata`;
		return callSeriesMetadata(seriesMetadataUrl);
	});

	console.time('caseMetadata');
	Promise.all(casePromises).then(() => {
		console.warn("All case metadata has been downloaded...");
		console.timeEnd('caseMetadata');
	}, error => {
		console.error(error);
	})
}, error => {
	console.error(error);
});
