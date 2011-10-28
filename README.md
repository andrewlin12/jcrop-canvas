jcrop-canvas
============
Integrates the jQuery Jcrop plugin with an HTML5 canvas so you can do
client-side cropping.  Also supports drag and drop of files.

Prerequisites
=============
 - jQuery
 - Jcrop (https://github.com/tapmodo/Jcrop)

Browser Support
===============
 - Chrome 8+
 - FF 4+
 - Safari nightly-builds (needs window.URL.createObjectURL)

Options
=======
 - boxWidth: the width of the source image
 - height: the height of the crop
 - mimeType: 'image/jpg' or 'image/png'
 - sourceImageSelector: the <img> which will house the image to be cropped
 - previewContainerSelector: the element which will house the crop
 - width: the width of the crop

Example Usage
=============
See example.html 

NOTE: Run it through a webserver, not as a local file (python -m 
SimpleHTTPServer)
