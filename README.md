# RSNA Measurement Crowd Sourcing tool
Based on crowdQuant


### Setup and Run
- git clone https://github.com/QTIM-Lab/rsnaCrowdQuant
- npm install
- npm start

This will start a local server that communicates with a live Couch DB. 

### DB 
http://rsnacrowdquant.cloudapp.net:5984/_utils/

### Build Views in the DB
https://github.com/pieper/Chronicle/blob/master/design/views.py



### TODO

- tag (with collection-tag (by anatomy e.g. liver, lung)) images on upload to database
- build view per collection-tag
    by enhancing views.py
- include seriesUID with measurements (PR pending)
- include slice index with measurements
- select next image with tag and fewest measurements
- livereload is timing out on the real site: Fix or Remove
- (bug) in a session: first case sends 1 measurement, second sends 2, third 3, etc.
