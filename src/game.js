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

function game(){
  /*
    Object to track and update the game's state.
  */
  this.time = 0;  // The time of day in the game.
  this.day = 0;   // How many in game days have elapsed.
  this.weather = 0; // The in game weather state.
  this.power = 0; // How much power is being used.

  this.update = function (){

  };
}
var gameState = new game(); // Create a new game() object.

function House(xPos, yPos){
  /*
    Object to handle an house building. Write once and reuse.
  */
  this.context = context; // The context object to use for drawing.
  this.x = xPos;  // X coordinate of the sprite.
  this.y = yPos;  // Y coordinate of the sprite.
  this.color = "grey";  // Primary color of the sprite.
  this.color2 = "blue"; // Secondary color of the sprite.
  this.consumption = 0;  // Amount of power the building is consuming.

  this.update = function (){  // Update the state of the object.

  };
  this.render = function (){  // Render the sprite.
    // Draw chimney.
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x + drawingScale, this.y, drawingScale, 2 * drawingScale);
    // Draw roof.
    this.context.fillStyle = this.color2;
    this.context.beginPath();
    this.context.moveTo(this.x, this.y + (2 * drawingScale));
    this.context.lineTo(this.x + (4 * drawingScale), this.y);
    this.context.lineTo(this.x + (8 * drawingScale), this.y + (2 * drawingScale));
    this.context.fill();
    // Draw walls.
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y + (2 * drawingScale), 8 * drawingScale, 4 * drawingScale);
    // Draw window.
    this.context.fillStyle = "black";
    this.context.fillRect(this.x + drawingScale, this.y + (3 * drawingScale), 2 * drawingScale, 2 * drawingScale);
    // Draw door.
    this.context.fillStyle = "black";
    this.context.fillRect(this.x + (5 * drawingScale), this.y + (3 * drawingScale), 2 * drawingScale, 3 * drawingScale);
  };
};

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
var house1 = new House(20, 100);

var loop = kontra.gameLoop({  // Create the kontra endless game loop.
  update: function(){
    gameState.update();
    office1.update();
    office2.update();
    house1.update();
  },
  render: function() {
    office1.render();
    office2.render();
    house1.render();
  }
});

loop.start(); // Start game loop.
