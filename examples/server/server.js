var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {
  console.log('request starting...');

  var filePath = '.' + request.url;
  var extname = path.extname(filePath);

  fs.readFile(filePath, function (error, content) {
    if (error) {
      if (error.code == 'ENOENT') {
        response.writeHead(404);
        response.end('File not found', 'utf-8');
      } else {
        response.writeHead(500);
        response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
      }
    } else {
      var contentType = extname === '.json' ? 'application/json' : 'application/dicom';

      // Set the contentType header
      response.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      });

      response.end(content, 'utf-8');
    }
  });
}).listen(4000);

console.log('Server running at http://127.0.0.1:4000/');
