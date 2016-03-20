
define([], function (){

    var Entity = Class.extend({
        init: function(gridX, gridY) {
            var self = this;
            this.setGridPosition(gridX, gridY);
        },

        setOnPositionChange: function (posChangeCallback){
            this._onPositionChange = posChangeCallback;
        },

        onPositionChange: function(){
            this._onPositionChange();
        },

        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
            if (this._onPositionChange)
                this._onPositionChange();
        },

        setGridPosition: function(x, y) {
            this.gridX = x;
            this.gridY = y;

            this.setPosition(x * 32, y * 32);
        },

        esPosAdyacente: function(gridX,gridY){ // devulve el heading si la pos es adyacente, sino 0
            if ( (gridY === this.gridY) && (gridX === this.gridX +1 ) )
                return Enums.Heading.este;
            if ( (gridY === this.gridY) && (gridX === this.gridX -1 ) )
                return Enums.Heading.oeste;
            if ( (gridX === this.gridX) && (gridY === this.gridY -1 ) )
                return Enums.Heading.norte;
            if ( (gridX === this.gridX) && (gridY === this.gridY +1 ) )
                return Enums.Heading.sur;
            return 0;
        },

        fadeIn: function(currentTime) {
            this.isFading = true;
            this.startFadingTime = currentTime;
        },

        blink: function(speed, callback) {
            var self = this;

            this.blinking = setInterval(function() {
                self.toggleVisibility();
            }, speed);
        },

        stopBlinking: function() {
            if(this.blinking) {
                clearInterval(this.blinking);
            }
            this.setVisible(true);
        },
    });

    return Entity;
});
