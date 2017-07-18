var Files = require('./files');
var Tools = require('./tools');
var Commands = require('./commands');

module.exports = {
  initViewer: function () {
    var $viewer = $('.viewer-wrapper');
    $viewer.removeClass('invisible');

    cornerstone.registerImageLoader('example', Files.getExampleImage);

    // THE LOARDER
    var element = document.getElementById('conerstoneViewport');

    Tools.element = element;
    Commands.element = element;

    $(window).on('resize', function () {
      cornerstone.resize(element, true);
    });

    cornerstone.enable(element);

    Tools.initTools(Files.imagesIds);
    Commands.initCommands();

    cornerstone.loadImage(Files.imagesIds[0]).then(function(image) {
      cornerstone.displayImage(element, image);
    });
  }
}
