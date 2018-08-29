kontra.init();  // Initilize the kontra library.

var canvas = document.querySelector("canvas");  // Find the canvas that we will be using.
var context = canvas.getContext("2d");  // Create the context used for drawing.
var canvasHeight; // The height of the canvas.
var canvasWidth; // The width of the canvas.
var drawingScale; // Distance between grid references used in drawing.
resizeCanvas()

function resizeCanvas(){
  /*
    Set the size of the canvas to maintain a constant aspect ratio.
   */
  if (window.innerWidth > window.innerHeight / 2){
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth / 2;
  } else {
    canvas.height = window.innerHeight;
    canvas.width = window.innerHeight * 2;
  };
  canvasHeight = canvas.height; // Set the height of the canvas.
  canvasWidth = canvas.width; // Set the width of the canvas.
  drawingScale = canvasWidth / 512; // Set the distance between grid references.
}

function getRandomInt(max) {
  /*
    Syntactic sugar for generating random integers.
  */
  return Math.floor(Math.random() * Math.floor(max));
}

function endGame(day, time){
  /*
    Display the end game screen.
  */
}
function game(){
  /*
    Object to track and update the game's state.
  */
  this.context = context; // The context object to use for drawing.
  this.color = "blue";  // The primary color used in the GUI.

  this.time = 9000;  // The time of day in the game.
  this.day = 1;   // How many in game days have elapsed.
  this.weather = 0; // The in game weather state.
  this.weatherDelay = 0;  // How many cycles before the weather changes. Stops the weather from changing every cycle.
  this.powerGenerated = 0; // How much power is being generated.
  this.powerConsumed = 10; // How much power is being consumed.
  this.gridFail = 300;  // Counts down to fail if the amount of power being consumend exceded the power being generated.

  this.friendlyTime = function(){ // Return the game time in a 24 hour format.
    this.hours = Math.round(this.time / 750);
    if(this.hours < 10){  // If the hours are fewer than 10 then add a leading zero.
      this.hours = "0" + this.hours;
    }
    this.mins = Math.round(this.time / 12.5) % 60;
    if(this.mins < 10){  // If the mins are fewer than 10 then add a leading zero.
      this.mins = "0" + this.mins;
    }
    return this.hours + ":" + this.mins;
  }

  this.generate = function(power){ // Add to the powerGenerated tally.
    this.powerGenerated = this.powerGenerated + power;
  }
  this.consume = function(power){  // Add to the powerConsumed tally.
    this.powerConsumed = this.powerConsumed + power;
  }

  this.update = function (){  // Update the game's state.
    // Update the in game time and day.
    this.time++;
    if(this.time >= 18000){  // If it is the next day.
      this.day++;
      this.time = this.time - 18000;
    }
    // Check that the amount of power being consumend does not excede the power being generated.
    if (this.powerGenerated < this.powerConsumed){
      if (this.gridFail <= 0){  // Test for end game condition.
        endGame(this.day, this.time);
      }
      this.gridFail--;  // Continue the countdown.
    } else {  // If the grid is fine
      this.gridFail = 300;  // Reset the count down.
    }
  };
  this.backLayer = function (){ // Render the background for the map.
    context.fillStyle = "green";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
  };
  this.gui = function (){  // Render the game's GUI.
    // Clock and date.
    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(canvasWidth, 8 * drawingScale);
    context.lineTo(canvasWidth - (60 * drawingScale), 8 * drawingScale);
    context.lineTo(canvasWidth - (64 * drawingScale), 4 * drawingScale);
    context.lineTo(canvasWidth - (64 * drawingScale), 0);
    context.lineTo(canvasWidth, 0);
    context.fill();
    context.font = Math.round(6 * drawingScale) + "px Nova Flat";
    context.fillStyle = "white";
    context.fillText(this.friendlyTime() + "  Day " + this.day, canvasWidth - (54 * drawingScale), 6 * drawingScale);
  }
};

function House(xPos, yPos){
  /*
    Object to handle a house building. Write once and reuse.
  */
  this.context = context; // The context object to use for drawing.
  this.x = xPos;  // X coordinate of the sprite.
  this.y = yPos;  // Y coordinate of the sprite.
  this.color = "grey";  // Primary color of the sprite.
  this.color2 = ""; // Secondary color of the sprite.
  this.consumption = 0;  // Amount of power the building is consuming.

  this.color2Possibles = ["blue", "red", "lightgreen", "orange"];
  this.color2 = this.color2Possibles[getRandomInt(4)];  // Choose a random secondary color.

  this.update = function (){  // Update the state of the object.

  };
  this.render = function (){  // Render the sprite.
    // Move the coordinate system.
    this.context.save();
    this.context.translate(this.x, this.y);
    // Draw chimney.
    this.context.fillStyle = this.color;
    this.context.fillRect(drawingScale, 0, drawingScale, 2 * drawingScale);
    // Draw roof.
    this.context.fillStyle = this.color2;
    this.context.beginPath();
    this.context.moveTo(0, 2 * drawingScale);
    this.context.lineTo(4 * drawingScale, 0);
    this.context.lineTo(8 * drawingScale, 2 * drawingScale);
    this.context.fill();
    // Draw walls.
    this.context.fillStyle = this.color;
    this.context.fillRect(0, 2 * drawingScale, 8 * drawingScale, 4 * drawingScale);
    // Draw window.
    this.context.fillStyle = "black";
    this.context.fillRect(drawingScale, 3 * drawingScale, 2 * drawingScale, 2 * drawingScale);
    // Draw door.
    this.context.fillStyle = "black";
    this.context.fillRect(5 * drawingScale, 3 * drawingScale, 2 * drawingScale, 3 * drawingScale);
    // Restore the coordinate system.
    this.context.restore();
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
  this.render = function (){  // Render the sprite.
    // Move the coordinate system.
    this.context.save();
    this.context.translate(this.x, this.y);
    // Draw walls.
    this.context.fillStyle = this.color;
    this.context.fillRect(0, 0, 13 * drawingScale, 12 * drawingScale);
    // Draw windows.
    this.context.fillStyle = "black";
    this.context.fillRect(drawingScale, drawingScale, 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(4 * drawingScale, drawingScale, 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(7 * drawingScale, drawingScale, 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(10 * drawingScale, drawingScale, 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(drawingScale, (5 * drawingScale), 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(4 * drawingScale, 5 * drawingScale, 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(7 * drawingScale, 5 * drawingScale, 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(10 * drawingScale, 5 * drawingScale, 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(drawingScale, 9 * drawingScale, 2 * drawingScale, 2 * drawingScale);
    this.context.fillRect(10 * drawingScale, 9 * drawingScale, 2 * drawingScale, 2 * drawingScale);
    // Draw door.
    this.context.fillStyle = "black";
    this.context.fillRect(5 * drawingScale, 8 * drawingScale, 3 * drawingScale, 4 * drawingScale);
    // Restore the coordinate system.
    this.context.restore();
  };
};
  };
};

var gameState = new game(); // Create a new game() object.
var buildings = [new Office(80 * drawingScale, 25  * drawingScale),  // Create an array with all the buildings in it.
                 new Office(105 * drawingScale, 25  * drawingScale),
                 new House(80  * drawingScale, 50 * drawingScale),
                 new House(92.5  * drawingScale, 50 * drawingScale),
                 new House(105  * drawingScale, 50 * drawingScale)]
var buildingsLength = buildings.length;

var loop = kontra.gameLoop({  // Create the kontra endless game loop.
  update: function(){
    gameState.update();
    for (var i = 0; i < buildingsLength; i++){  // Update all the buildings in the array.
      buildings[i].update();
    }
  },
  render: function() {
    gameState.backLayer();
    for (var i = 0; i < buildingsLength; i++){  // Render all the building sprites.
      buildings[i].render();
    }
    gameState.gui();
  }
});

loop.start(); // Start game loop.
