/*
*   Global namespace for the project
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WinGame;
(function (WinGame) {
    /*
    *  Main renderer class
    */
    var Renderer = (function () {
        function Renderer() {
            this._isPaused = false;
            this._objectsList = [];
            this._buttonList = [];
            this._left = 0;
            if (Renderer._instance) {
                throw Error("An instance of the renderer was already instatiated");
                return;
            }
            Renderer._instance = this;
            // Creating the DOM Autoscaled contaienr
            this.CreateDOMAutoscaled();
            // Craeting the Canvas
            this.CreateCanvas();
            // Starting the rendering loop
            requestAnimationFrame(this.UpdateLoop.bind(this));
        }
        /*
        *  Creates a div container that autoscales depending on the size of the screen
        */
        Renderer.prototype.CreateDOMAutoscaled = function () {
            // Creating the game container
            this._autoscaleContainer = document.createElement("div");
            this._autoscaleContainer.style.width = WinGame.properties.width + "px";
            this._autoscaleContainer.style.height = WinGame.properties.height + "px";
            this._autoscaleContainer.style.transformOrigin = "top left";
            this._autoscaleContainer.id = "game_container";
            document.body.appendChild(this._autoscaleContainer);
            var _this = this;
            window.onresize = function () {
                var availW = window.innerWidth;
                var availH = window.innerHeight;
                var scale = (availW / WinGame.properties.width).toFixed(2);
                if (availH < (WinGame.properties.height * parseFloat(scale))) {
                    scale = (availH / WinGame.properties.height).toFixed(2);
                }
                _this._scale = parseFloat(scale);
                _this._autoscaleContainer.style.transform = "scale(" + scale + ")";
                if ((WinGame.properties.width * _this._scale) < availW) {
                    _this._left = ((availW - (WinGame.properties.width * _this._scale)) * 0.5);
                    _this._autoscaleContainer.style.left = _this._left + "px";
                }
            };
            window.onresize(null);
        };
        /*
        *  Creates a canvas element inside the autoscale container
        *  Gets the 2d context from the canvas
        */
        Renderer.prototype.CreateCanvas = function () {
            this._canvasElemement = document.createElement("canvas");
            this._canvasElemement.width = WinGame.properties.width;
            this._canvasElemement.height = WinGame.properties.height;
            this._autoscaleContainer.appendChild(this._canvasElemement);
            this._context = this._canvasElemement.getContext("2d");
            var _this = this;
            // Canvas click functionality
            if (!WinGame.properties.isMobile) {
                this._canvasElemement.addEventListener("mousedown", function (ev) {
                    var position = { x: ((ev.pageX - _this._left) / _this._scale), y: ev.pageY / _this._scale };
                    _this.HandleClick(position);
                });
            }
            else {
                this._canvasElemement.addEventListener("touchstart", function (ev) {
                    var position = { x: ((ev.touches[0].pageX - _this._left) / _this._scale), y: ev.touches[0].pageY / _this._scale };
                    _this.HandleClick(position);
                });
            }
        };
        /*
        *   Checks the position of the click to see if a button is on that location
        *   and executes its callback if true
        */
        Renderer.prototype.HandleClick = function (position) {
            var i;
            for (i = 0; i < this._buttonList.length; ++i) {
                if (!this._buttonList[i].isDisabled &&
                    position.x >= this._buttonList[i].getPosition.x && position.x <= (this._buttonList[i].getPosition.x + this._buttonList[i].getWidth) &&
                    position.y >= this._buttonList[i].getPosition.y && position.y <= (this._buttonList[i].getPosition.y + this._buttonList[i].getHeight)) {
                    this._buttonList[i].Callback();
                    return;
                }
            }
        };
        /*
        *  Main loop rendering
        */
        Renderer.prototype.UpdateLoop = function () {
            if (this._isPaused) {
                requestAnimationFrame(this.UpdateLoop.bind(this));
                return;
            }
            // Clearing the canvas
            this._context.clearRect(0, 0, WinGame.properties.width, WinGame.properties.height);
            var i;
            for (i = 0; i < this._objectsList.length; ++i) {
                this._objectsList[i].Update(this._context);
            }
            requestAnimationFrame(this.UpdateLoop.bind(this));
        };
        /*
        *   Removes an object from the renderer queue
        *   @param {String} id of the object to remove
        */
        Renderer.prototype.RemoveObject = function (id) {
            var i;
            for (i = 0; i < this._buttonList.length; ++i) {
                if (this._buttonList[i].Id === id) {
                    this._buttonList.splice(i, 1);
                    break;
                }
            }
            for (i = 0; i < this._objectsList.length; ++i) {
                if (this._objectsList[i].Id === id) {
                    this._objectsList.splice(i, 1);
                    return;
                }
            }
        };
        /*
        *   Creates a color box on a position
        *   @param {string} id of the object
        *   @param {number} x position X
        *   @param {number} y position Y
        *   @param {number} width Width of the box
        *   @param {number} height height of the box
        *   @param {number[]} color rgb values of the color
        *   @return {ColorBox} ColoBox object
        */
        Renderer.prototype.CreateColorBox = function (id, x, y, width, height, colorrgb) {
            var colorbox = new ColorBox(id, x, y, width, height, colorrgb);
            this._objectsList.push(colorbox);
            return colorbox;
        };
        /*
        *   Creates a bitmap on a position
        *   @param {string} id of the object
        *   @param {number} x position X
        *   @param {number} y position Y
        *   @param {number} width Width of the box
        *   @param {number} height height of the box
        *   @param {string} src Source of the image
        *   @return {Bitmap} Bitmap object
        */
        Renderer.prototype.CreateBitmap = function (id, x, y, width, height, src) {
            var bitmap = new Bitmap(id, x, y, width, height, src);
            this._objectsList.push(bitmap);
            return bitmap;
        };
        /*
        *   Creates a bitmap button on a position
        *   @param {string} id of the object
        *   @param {number} x position X
        *   @param {number} y position Y
        *   @param {number} width Width of the box
        *   @param {number} height height of the box
        *   @param {string} src Source of the image
        *   @param {Function} callback Call back when the button is pressed
        *   @return {BitmapButton} BitmapButton object
        */
        Renderer.prototype.CreateBitmapButton = function (id, x, y, width, height, src, callback) {
            var bitmapbuton = new BitmapButton(id, x, y, width, height, src, callback);
            this._objectsList.push(bitmapbuton);
            this._buttonList.push(bitmapbuton);
            return bitmapbuton;
        };
        /*
        *   Creates a Text on a position
        *   @param {string} id of the object
        *   @param {number} x position X
        *   @param {number} y position Y
        *   @param {number} width Width of the box
        *   @param {number} height height of the box
        *   @param {string[]} font values for the font
        *   @param {string} text Text that will be displayed
        *   @param {number} color color rgb values of the color
        *   @return {Text} Text object
        */
        Renderer.prototype.CreateText = function (id, x, y, width, height, font, text, color) {
            var canvastext = new Text(id, x, y, width, height, font, text, color);
            this._objectsList.push(canvastext);
            return canvastext;
        };
        return Renderer;
    })();
    WinGame.Renderer = Renderer;
    /*
     *   Basic object for the renderer
    */
    var BaseGfxObject = (function () {
        function BaseGfxObject(id, x, y, width, height) {
            this._alpha = 1;
            this._visible = true;
            this._id = id;
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
        }
        Object.defineProperty(BaseGfxObject.prototype, "getWidth", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGfxObject.prototype, "setWidth", {
            set: function (w) {
                this._width = w;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGfxObject.prototype, "getHeight", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGfxObject.prototype, "setHeight", {
            set: function (h) {
                this._height = h;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGfxObject.prototype, "getAlpha", {
            get: function () {
                return this._alpha;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGfxObject.prototype, "setAlpha", {
            set: function (a) {
                this._alpha = a;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGfxObject.prototype, "getPosition", {
            get: function () {
                return { x: this._x, y: this._y };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGfxObject.prototype, "setVisible", {
            set: function (visible) {
                this._visible = visible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGfxObject.prototype, "Id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        BaseGfxObject.prototype.Update = function (context) { };
        ;
        return BaseGfxObject;
    })();
    WinGame.BaseGfxObject = BaseGfxObject;
    /*
     *   ColorBox object for the renderer
    */
    var ColorBox = (function (_super) {
        __extends(ColorBox, _super);
        function ColorBox(id, x, y, width, heigh, colorrgb) {
            _super.call(this, id, x, y, width, heigh);
            this._colorrgb = colorrgb;
            return this;
        }
        ColorBox.prototype.Update = function (context) {
            if (this._visible) {
                context.fillStyle = "rgba(" + this._colorrgb[0] + "," + this._colorrgb[1] + "," + this._colorrgb[2] + "," + this._alpha + ")";
                context.fillRect(this._x, this._y, this._width, this._height);
            }
        };
        return ColorBox;
    })(BaseGfxObject);
    WinGame.ColorBox = ColorBox;
    /*
     *   Bitmap object for the renderer
    */
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap(id, x, y, width, heigh, src) {
            _super.call(this, id, x, y, width, heigh);
            this._image = new Image();
            this._image.src = src;
            return this;
        }
        Bitmap.prototype.Update = function (context) {
            if (this._visible) {
                context.save();
                context.globalAlpha = this._alpha;
                context.translate(this._x + (this._width * 0.5), this._y + (this._height * 0.5));
                context.drawImage(this._image, -(this._width * 0.5), -(this._height * 0.5), this._width, this._height);
                context.restore();
            }
        };
        return Bitmap;
    })(BaseGfxObject);
    WinGame.Bitmap = Bitmap;
    /*
     *   BitmapButton object for the renderer
    */
    var BitmapButton = (function (_super) {
        __extends(BitmapButton, _super);
        function BitmapButton(id, x, y, width, heigh, src, callback) {
            _super.call(this, id, x, y, width, heigh, src);
            this._isDisabled = false;
            this._clickCallback = callback;
            return this;
        }
        Object.defineProperty(BitmapButton.prototype, "Callback", {
            get: function () {
                return this._clickCallback;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitmapButton.prototype, "isDisabled", {
            get: function () {
                return this._isDisabled;
            },
            enumerable: true,
            configurable: true
        });
        BitmapButton.prototype.setDisabled = function (disabled) {
            this._isDisabled = disabled;
            if (this._isDisabled)
                this.setAlpha = 0.5;
            else
                this.setAlpha = 1;
        };
        return BitmapButton;
    })(Bitmap);
    WinGame.BitmapButton = BitmapButton;
    /*
     *   Text object for the renderer
    */
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(id, x, y, width, heigh, font, text, color) {
            _super.call(this, id, x, y, width, heigh);
            this._text = text;
            this._color = color;
            this._font = font;
            return this;
        }
        Object.defineProperty(Text.prototype, "getText", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "setText", {
            set: function (text) {
                this._text = text;
            },
            enumerable: true,
            configurable: true
        });
        Text.prototype.Update = function (context) {
            if (this._visible) {
                context.font = this._font[0] + this._font[1] + "px " + this._font[2];
                context.fillStyle = "rgba(" + this._color[0] + "," + this._color[1] + "," + this._color[2] + "," + this._alpha + ")";
                context.fillText(this._text, this._x, this._y, this._width);
            }
        };
        return Text;
    })(BaseGfxObject);
    WinGame.Text = Text;
})(WinGame || (WinGame = {}));
//# sourceMappingURL=gfx.js.map