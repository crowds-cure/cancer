# crowdquant
A stripped down viewer for crowdsourcing measurements 

## Install
You have to install all projet's dependecies. Todo so execute this command in this repository root folder:
```
$ npm install
```

## Run
After you have installed everything, execute this command in this repository root folder:
```
$ npm start
```

## DICOM Server
This exaple expects a server running on `http://localhost:4000` which provides a file named *mock.json*. This JSON will contain a list of DICOM URLs to be downloaded by this viewer. Example below:
```
{
  "name": "default case",
  "urls": [
    "http://localhost:4000/1.dcm",
    "http://localhost:4000/2.dcm",
    "http://localhost:4000/3.dcm",
    "http://localhost:4000/4.dcm",
    "http://localhost:4000/5.dcm"
  ]
}
```

OBS: This is not the final implementation. In the end we will expect only one server which will provide one endpoint giving random cases. This cases will contain a list of URLs to be used. All this URLs should be hosted somewhere this viewer can reach.