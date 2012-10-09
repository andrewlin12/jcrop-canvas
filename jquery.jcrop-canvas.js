(function($) {
    window.URL = window.webkitURL || window.URL;

    // From http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
    function dataURItoBlob(dataURI, callback) {

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var binary = atob(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: mimeString});

    }

    var methods = {
        init: function(options) {
            var self = this;
            var cropper = {};

            self.options = {
                boxWidth: 600,
                boxHeight: 300,
                height: 100,
                mimeType: 'image/png',
                sourceImageSelector: 'img.source',
                previewContainerSelector: 'div.preview-container',
                showPreview : true,
                width: 100
            };

            var updatePreview = function(coords) {
                self.currentCrop = coords;
                var context = self.preview.get(0).getContext('2d');
                if (self.currentCrop.w > 0 && self.currentCrop.h > 0) {
                    context.drawImage(self.source.get(0),
                        self.currentCrop.x, self.currentCrop.y,
                        self.currentCrop.w, self.currentCrop.h,
                        0, 0, self.options.width, self.options.height);
                }
            };

            self.setupCropper = function() {
                self.source.Jcrop({
                    onChange: updatePreview,
                    onSelect: updatePreview,
                    aspectRatio: self.options.width / self.options.height,
                    boxWidth: self.options.boxWidth,
                    boxHeight: self.options.boxHeight
                });
            };

            self.loadImage = function(file) {
                if (!window.URL) {
                    self.trigger('error.jcrop-canvas',
                        'Please use Chrome 10+ or FF 4+ to ' +
                            'use the image cropper.');
                    return;
                }

                var jcropHolder = $('.jcrop-holder');
                if (jcropHolder.length > 0) {
                    // remove jcrop
                    $.Jcrop(self.source).destroy();
                    jcropHolder.remove();
                }

                self.source.unbind('load');
                self.source.load(function(e) {
                    // Cleanup the saved data
                    window.URL.revokeObjectURL(self.source.src);

                    self.setupCropper();

                    self.source.show();

                    if (self.options.showPreview === true) {
                        self.previewContainer.show();
                    } else {
                        self.previewContainer.hide();
                    }

                    self.trigger('load');
                });

                self.source.attr('src', window.URL.createObjectURL(file));
            };

            $.extend(self.options, options);

            self.bind('dragover',function(e) {
                e.preventDefault();
                return true;
            });

            self.bind('drop', function(e) {
                e.preventDefault();
                self.loadImage(e.originalEvent.dataTransfer.files[0]);
            });

            self.source = $(self.options.sourceImageSelector);

            self.previewContainer = $(self.options.previewContainerSelector);
            self.previewContainer.html('<canvas class="preview"></canvas>');
            self.preview = self.previewContainer.find('.preview');
            self.preview.attr('width', self.options.width).attr('height', self.options.height);

            self.find('input[type=file]').change(function() {
                if (this.files.length > 0) {
                    self.loadImage(this.files[0]);
                }
            });

            self.previewContainer.css(
                'height', self.options.height
            ).css(
                'width', self.options.width
            );

            return this;
        },
        rotate: function() {
            var self = this;
            // Need to create a new properly-sized canvas, draw the image
            // into the canvas then set the src attrs on both source and preview
            // Then re-apply jcrop.  Fun.
            var canvas = $('<canvas></canvas>');

            // Create a canvas rotated by 90 degrees
            var w = self.source.height();
            var h = self.source.width();
            canvas.attr('width', w);
            canvas.attr('height', h);
            canvas.hide();
            self.previewContainer.after(canvas);

            var context = canvas.get(0).getContext('2d');
            context.translate(w, 0);
            context.rotate(Math.PI / 2);
            context.drawImage(self.source.get(0), 0, 0);

            self.loadImage(dataURItoBlob(canvas.get(0).toDataURL('image/png')));

            canvas.remove();
        },
        // Returns a data URI
        createCrop: function() {
            var self = this;
            if (!self.currentCrop) {
                return null;
            }

            var imgData = self.preview.get(0).toDataURL('image/png');

            return imgData.split(";base64,")[1];
        }
    };

    $.fn.jcropCanvas = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof(method === 'object') || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + method + ' does not exist on jQuery.jcropCanvas.');
        }
    };
})(jQuery);
