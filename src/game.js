kontra.init();  // Initilize the kontra library.

var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

var drawingScale = 5; // Distance between grid references used in drawing. Int.

function getRandomInt(max) {
  /*
    Syntactic sugar for generating random integers.
   */
  return Math.floor(Math.random() * Math.floor(max));
}

function Office(xPos, yPos){
  /*
    Object to handle an office building. Write once and reuse.
   */
  this.context = context; // The context object to use for drawing.
  this.x = xPos;  // X coordinate of the sprite.
  this.y = yPos;  // Y coordinate of the sprite.
  this.color = "grey";  // Primary color of the sprite.
  this.consumption = 0;  // Amount of power the building is consuming.

  this.update = function (){  // Update the state of the object.

  };
  this.render = function r(){  // Render the sprite.
    // Draw walls.
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, 13 * drawingScale, 12 * drawingScale);
    // Draw windows.
    this.context.fillStyle = "black";
    this.context.fillRect(this.x + drawingScale, this.y + drawingScale, 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(this.x + (4 * drawingScale), this.y + drawingScale, 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(this.x + (7 * drawingScale), this.y + drawingScale, 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(this.x + (10 * drawingScale), this.y + drawingScale, 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(this.x + drawingScale, this.y + (5 * drawingScale), 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(this.x + (4 * drawingScale), this.y + (5 * drawingScale), 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(this.x + (7 * drawingScale), this.y + (5 * drawingScale), 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(this.x + (10 * drawingScale), this.y + (5 * drawingScale), 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(this.x + drawingScale, this.y + (9 * drawingScale), 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(this.x + (10 * drawingScale), this.y + (9 * drawingScale), 2 * drawingScale, 2 * drawingScale);
    // Draw door.
    this.context.fillStyle = "black";
    this.context.fillRect(this.x + (5 * drawingScale), this.y + (8 * drawingScale), 3 * drawingScale, 4 * drawingScale);
  };
};

var office1 = new Office(20, 20);
var office2 = new Office(100, 20);

var loop = kontra.gameLoop({  // Create the kontra endless game loop.
  update: function(){
    office1.update();
    office2.update();
  },
  render: function() {
    office1.render();
    office2.render();
  }
});

loop.start(); // Start game loop.
