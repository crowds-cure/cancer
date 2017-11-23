# RSNA Measurement Crowd Sourcing tool
Based on crowdQuant


### Setup and Run
- git clone https://github.com/QTIM-Lab/rsnaCrowdQuant
- npm install
- npm install connect-livereload --save-dev (?)
- npm start

### Build
To build the application you can run this command in the root filder:
```
$ npm run build
```
This will create the `bundle.js` and the `style.css` files.

This will start a local server that communicates with a live Couch DB. 

### DB 
http://rsnacrowdquant.cloudapp.net:5984/_utils/

### Build Views in the DB
https://github.com/pieper/Chronicle/blob/master/design/views.py



### TODO
- tag (with collection-tag (by anatomy e.g. liver, lung)) images on upload to database - Jayashree
- build view per collection-tag by enhancing views.py - Jayashree -> use filename path to create view
- add kiosk mode as query parameter
-- don't the username
-- login times out after 2 minute
- improve the registration form with a few big buttons for the categories
- statistics page - Steve to make stubs, Jayashree to create infovis
- continuous replication to a backed up disk - operational plan TBD with RSNA docent
- about box with acknowledgements
- tutorial info
- auto window/level to get lung window/liver ? - Rob
- Android (maybe ios?) Can make 2 Length Measurements on the same image
- Potentially change least measured to be an array of all "least measured" and select one at random
- log skipped cases
- annotator is hardcoded -fix that
- make getNextSeriesForAnnotator call parallel
- Zoom resets when the windows is resized - not sure if intentional (ALB)
- address "Uncaught Error: image has not been loaded yet"
- consider moving save button to avoid accidental selection of skip button instead.
- add progress sort on download -Steve
- measurement disappears under certain window - maybe make measurement a different color/line width

#### after RSNA??
- investigate how "U" showed up a annotator in DB ?
- consolidate databases? - probably not needed for now

### DONE
- (bug) If you zoom out extremely far until the original image looks like a dot, it is very hard to zoom back in because the center of the image changes. This might be done by accident, so when someone presses Clear, zoom should reset -- but it isn't. We should fix this. (ALB)
- Map up/down keyboard keys to change slice, in case mouse wheel/pad not available
- You can't submit a measurement if you're not on the same slice as your measurement. Given people's tendencies to "check their work" on other slices, and the difficulty of navigating back to one particular slice, perhaps we should lift this requirement (ALB)
- pinch zoom on mobile?
- include seriesUID with measurements (still need to see if this is the right way)
- (bug) in a session: first case sends 1 measurement, second sends 2, third 3, etc.
- need to record position of start/end of line drawn lengths.data[0].handles.end.y near line 40 commands.js
- include slice index with measurements
- change browser tab title from "lightweight viewer" to "RSNA CrowdQuant"
- (bug) save in hamburger does not record annotator (removed instead)
- remove hamburger
- remember username in localStorage for easier re-login
- include slice UID with measurement
- investigate why scrolling is not working on iPad - works with 3 finger scrolling
- livereload is timing out on the real site: Fix or Remove
- see if we can save a screenshot with measurement document - Steve
- add ability to skip the case (e.g. when there is no tumor)
- select next image with tag and fewest measurements - Steve to make query function
- (bug) logging in as existing user starts with series index 0 again (already measured cases) - Steve to provide query function to suggest next case that is least reviewed and not already reviewed by this user
- investigate 2 finger scrolling for mobile - Rob
- skip case does not work
