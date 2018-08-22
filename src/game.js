kontra.init();  // Initilize the kontra library.

var drawingScale = 5; // Distance between grid references used in drawing. Int.

function getRandomInt(max) {
  /*
    Syntactic sugar for generating random integers.
   */
  return Math.floor(Math.random() * Math.floor(max));
}

function officeRender(context, color, powerConsumption) {
  /*
    Function to draw an office building sprite. Write once and reuse.
    context: The context object that will be used to draw the sprite.
    color: The main color of the sprite.
    powerConsumption: Amount of power this building is consuming. Int 0-20.
   */

  // Draw walls.
  this.context.fillStyle(this.color);
  this.context.fillRect(this.x, this.y, 13 * drawingScale, 12 * drawingScale);
  // Draw windows.
  this.context.fillStyle("black");
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
  this.context.fillStyle("black");
  this.context.fillRect(this.x + (5 * drawingScale), this.y + (8 * drawingScale), 3 * drawingScale, 4 * drawingScale);
};

var office = kontra.sprite({
  x: 10,
  y: 10,
  color: "grey",
  powerConsumption: 0,

  render: officeRender(this.context, this.color, this.powerConsumption)
});

var loop = kontra.gameLoop({  // Create the kontra endless game loop.
  update: function(){
    office1.update();
  },
  render: function() {
    office1.render();
  }
});

loop.start(); // Start game loop.
