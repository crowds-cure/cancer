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
- include slice index with measurements
- select next image with tag and fewest measurements
- livereload is timing out on the real site: Fix or Remove
- (bug) save in hamburger does not record annotator 
- remove hamburger
- (bug) logging in as existing user starts with series index 0 again (already measured cases)
- need to record position of start/end of line drawn

### DONE
- include seriesUID with measurements (still need to see if this is the right way)
- (bug) in a session: first case sends 1 measurement, second sends 2, third 3, etc.
