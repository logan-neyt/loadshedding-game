kontra.init();  // Initilize the kontra library.

var canvas = document.querySelector("canvas");  // Find the canvas that we will be using.
var context = canvas.getContext("2d");  // Create the context used for drawing.
var canvasHeight; // The height of the canvas.
var canvasWidth; // The width of the canvas.
var drawingScale; // Distance between grid references used in drawing.
resizeCanvas()

var loop; // Create a global loop variable.
var gameState;  // Create a global gameState variable.
newGame();  // Start the first game.

function resizeCanvas(){
  /*
    Set the size of the canvas to maintain a constant aspect ratio.
   */
  canvas.height = window.innerHeight * 2;
  canvas.width = window.innerWidth * 2;
  canvasHeight = canvas.height; // Set the height of the canvas.
  canvasWidth = canvas.width; // Set the width of the canvas.
  drawingScale = canvasWidth / 384; // Set the distance between grid references.
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
  loop.stop()  // Stop the game loop.
};

function game(){
  /*
    Object to track and update the game's state.
  */
  this.context = context; // The context object to use for drawing.
  this.color = "#0077c2";  // The primary color used in the GUI.
  this.textColor = "#fafafa"; // The color used for the text.
  this.font = "px Nova Flat"; // The font used for the GUI (Scale will be provided when drawing.).

  this.time = 9000;  // The time of day in the game.
  this.day = 1;   // How many in game days have elapsed.
  this.sunlight = 10; // Brightness of the sun(dependent on time, independent of cloud cover).
  this.weather = ""; // The in game weather state.
  this.wind = 0;  // The amount of wind.
  this.clouds = 0;  // Density of cloud cover.
  this.weatherDelay = 0;  // How many cycles before the weather changes. Stops the weather from changing every cycle.
  this.powerGenerated = 1; // How much power is being generated.
  this.powerConsumed = 0; // How much power is being consumed.
  this.gridFail = 300;  // Counts down to fail if the amount of power being consumend exceded the power being generated.

  this.friendlyTime = function(){ // Return the game time in a 24 hour format.
    this.hours = Math.floor(this.time / 750);
    if(this.hours < 10){  // If the hours are fewer than 10 then add a leading zero.
      this.hours = "0" + this.hours;
    }
    this.mins = Math.floor(this.time / 12.5) % 60;
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
    };
    // Check that the amount of power being consumend does not excede the power being generated.
    if (this.powerGenerated < this.powerConsumed){
      if (this.gridFail <= 0){  // Test for end game condition.
        endGame(this.day, this.time);
      };
      this.gridFail--;  // Continue the countdown.
    } else {  // If the grid is fine
      this.gridFail = 300;  // Reset the count down.
    };
    // Clear the power variables for the next turn.
    this.powerGenerated = 1;
    this.powerConsumed = 0;
    // Update the weather.
    this.weatherDelay--;
    if (this.weatherDelay <= 0){  // If the weather must be changed.
      this.wind = getRandomInt(11);
      this.clouds = getRandomInt(11);
      if(this.wind < 2){
        this.weather = "Calm";
      }else if (this.wind < 5) {
        this.weather = "Breezy";
      } else if (this.wind < 7) {
        this.weather = "Windy";
      } else {
        this.weather = "Gale";
      }
      if(this.clouds > 7){
        this.weather = this.weather + ", Overcast";
      } else if (this.clouds > 3) {
        this.weather = this.weather + ", Cloudy";
      } else{
        this.weather = this.weather + ", Clear"
      }
      this.weatherDelay = getRandomInt(18000) + 360;
    };
  };
  this.backLayer = function (){ // Render the background for the map.
    context.fillStyle = "green";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
  };
  this.gui = function (){  // Render the game's GUI.
    // Running stats.
    context.save();
    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(0, 8 * drawingScale);
    context.lineTo(100 * drawingScale, 8 * drawingScale);
    context.lineTo(104 * drawingScale, 4 * drawingScale);
    context.lineTo(104 * drawingScale, 0);
    context.lineTo(0, 0);
    context.fill();
    context.font = Math.round(6 * drawingScale) + this.font;
    context.fillStyle = this.textColor;
    context.fillText(Math.floor(this.powerGenerated) + " / "+ Math.floor(this.powerConsumed), 30 * drawingScale, 6 * drawingScale);
    context.fillText(this.weather, 58 * drawingScale, 6 * drawingScale);
    // Clock and date.
    context.save()
    context.translate(canvasWidth, 0);  // Move the coordinate system.
    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(0, 8 * drawingScale);
    context.lineTo(-60 * drawingScale, 8 * drawingScale);
    context.lineTo(-64 * drawingScale, 4 * drawingScale);
    context.lineTo(-64 * drawingScale, 0);
    context.lineTo(0, 0);
    context.fill();
    context.font = Math.round(6 * drawingScale) + this.font;
    context.fillStyle = this.textColor;
    context.fillText(this.friendlyTime() + "  Day " + this.day, -54 * drawingScale, 6 * drawingScale);
    context.restore();  // Restore the coordinate system.
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
  this.powered = true;  // If the building is active.
  this.consumption = 0;  // Amount of power the building is consuming.

  this.color2Possibles = ["blue", "red", "lightgreen", "orange"];
  this.color2 = this.color2Possibles[getRandomInt(4)];  // Choose a random secondary color.

  this.update = function (){  // Update the state of the object.
    gameState.consume(this.consumption);  // Update the gameState's variables.
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
    if((gameState.time >= 13500 || gameState.time <= 4875) && this.powered){  // Check if the lights should be on or off.
      this.context.fillStyle = "#ffff8b";
    } else {
      this.context.fillStyle = "#000000";
    };
    this.context.fillRect(drawingScale, 3 * drawingScale, 2 * drawingScale, 2 * drawingScale);
    // Draw door.
    this.context.fillStyle = "#000000";
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
  this.powered = true;  // If the building is active.
  this.consumption = 0;  // Amount of power the building is consuming.

  this.update = function (){  // Update the state of the object.
    gameState.consume(this.consumption);  // Update the gameState's variables.
  };
  this.render = function (){  // Render the sprite.
    // Move the coordinate system.
    this.context.save();
    this.context.translate(this.x, this.y);
    // Draw walls.
    this.context.fillStyle = this.color;
    this.context.fillRect(0, 0, 13 * drawingScale, 12 * drawingScale);
    // Draw windows.
    if((gameState.time >= 13500 || gameState.time <= 4875) && this.powered){  // Check if the lights should be on or off.
      this.context.fillStyle = "#ffff8b";
    } else {
      this.context.fillStyle = "#000000";
    };
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
    this.context.fillStyle = "#000000";
    this.context.fillRect(5 * drawingScale, 8 * drawingScale, 3 * drawingScale, 4 * drawingScale);
    // Restore the coordinate system.
    this.context.restore();
  };
};

function Factory(xPos, yPos){
  /*
    Object to handle a factory building. Write once and reuse.
  */
  this.context = context; // The context object to use for drawing.
  this.x = xPos;  // X coordinate of the sprite.
  this.y = yPos;  // Y coordinate of the sprite.
  this.color = "grey";  // Primary color of the sprite.
  this.color2 = ""; // Secondary color of the sprite.
  this.powered = true;  // If the building is powered
  this.consumption = 0;  // Amount of power the building is consuming.

  this.color2Possibles = ["blue", "red", "lightgreen", "orange"];
  this.color2 = this.color2Possibles[getRandomInt(4)];  // Choose a random secondary color.

  this.update = function(){
    //gameState.consume(this.consumption);  // Update the gameState's variables.
  };
  this.render = function(){
    // Move the coordinate system.
    this.context.save();
    this.context.translate(this.x, this.y);
    // Draw chimneys.
    this.context.fillStyle = this.color;
    this.context.fillRect(drawingScale, 0, drawingScale, 4 * drawingScale);
    this.context.fillRect(4 * drawingScale, 0, drawingScale, 4 * drawingScale);
    // Draw walls.
    this.context.fillStyle = this.color;
    this.context.fillRect(0, 4 * drawingScale, 12 * drawingScale, 6 * drawingScale);
    // Draw door.
    this.context.fillStyle = "black";
    this.context.fillRect(9 * drawingScale, 7 * drawingScale, 2 * drawingScale, 3 * drawingScale);
    // Draw windows.
    if((gameState.time >= 13500 || gameState.time <= 4875) && this.powered){  // Check if the lights should be on or off.
      this.context.fillStyle = "#ffff8b";
    } else {
      this.context.fillStyle = "#000000";
    };
    this.context.fillRect(drawingScale, 5 * drawingScale, 2 * drawingScale, drawingScale);
    this.context.fillRect(4 * drawingScale, 5 * drawingScale, 2 * drawingScale, drawingScale);
    this.context.fillRect(7 * drawingScale, 5 * drawingScale, 2 * drawingScale, drawingScale);
    // Draw roof.
    this.context.fillStyle = this.color2;
    this.context.beginPath();
    this.context.moveTo(0, 4 * drawingScale);
    this.context.lineTo(0, 2 * drawingScale);
    this.context.lineTo(3 * drawingScale, 4 * drawingScale);
    this.context.lineTo(3 * drawingScale, 2 * drawingScale);
    this.context.lineTo(6 * drawingScale, 4 * drawingScale);
    this.context.lineTo(6 * drawingScale, 2 * drawingScale);
    this.context.lineTo(9 * drawingScale, 4 * drawingScale);
    this.context.lineTo(9 * drawingScale, 2 * drawingScale);
    this.context.lineTo(12 * drawingScale, 4 * drawingScale);
    this.context.fill();
    // Restore the coordinate system.
    this.context.restore();
  };
};

function WindTurbine(xPos, yPos){
  /*
    Object to handle a wind turbine. Write once and reuse.
  */
  this.context = context; // The context object to use for drawing.
  this.x = xPos;  // X coordinate of the sprite.
  this.y = yPos;  // Y coordinate of the sprite.
  this.color = "grey";  // Primary color of the sprite.
  this.color2 = "darkgrey"; // Secondary color of the sprite.
  this.frame = getRandomInt(8) * 15; // The animation frame the sprite is currently in.
  this.powered = true;  // If the building is active.
  this.generation = 0;  // Amount of power the building is generating.

  this.update = function(){
    // Increment the animation.
    if(this.powered && gameState.wind > 0){  // If building is active and there is wind
      this.frame = this.frame + gameState.wind;
      if(this.frame >= 120){
        this.frame = 0;
      };
    };
    // Calculate generation.
    if(this.powered){
      this.generation = 1.5 * gameState.wind;
    } else {
      this.generation = 0;
    }
    gameState.generate(this.generation);  // Update the gameState's variables.
  };
  this.render = function(){
    // Move the coordinate system.
    this.context.save();
    this.context.translate(this.x, this.y);
    // Draw base.
    this.context.fillStyle = this.color;
    this.context.fillRect(2 * drawingScale, 2 * drawingScale, drawingScale, 7 * drawingScale);
    this.context.fillStyle = this.color2;
    this.context.fillRect(3 * drawingScale,8 * drawingScale, drawingScale, drawingScale);
    // Draw blades.
    this.context.translate(2.5 * drawingScale, 2.5 * drawingScale);
    this.context.rotate((Math.floor(this.frame / 20) * 15 ) * (Math.PI / 180));
    for(var r = 0; r < 4; r++){
      this.context.fillStyle = this.color;
      this.context.beginPath();
      this.context.moveTo(-2.5 * drawingScale, -2.5 * drawingScale);
      this.context.lineTo(-1.5 * drawingScale, -2.5 * drawingScale);
      this.context.lineTo(0.5 * drawingScale, -0.5 * drawingScale);
      this.context.lineTo(-0.5 * drawingScale, 0.5 * drawingScale);
      this.context.lineTo(-2.5 * drawingScale, -1.5 * drawingScale);
      this.context.fill();
      this.context.rotate(90 * (Math.PI / 180));
    };
    for(var r = 0; r < 4; r++){
      this.context.fillStyle = this.color2;
      this.context.beginPath();
      this.context.moveTo(-1.5 * drawingScale, -2.5 * drawingScale);
      this.context.lineTo(0.5 * drawingScale, -0.5 * drawingScale);
      this.context.lineTo(-0.5 * drawingScale, -0.5 * drawingScale);
      this.context.lineTo(-1.5 * drawingScale, -1.5 * drawingScale);
      this.context.fill();
      this.context.rotate(90 * Math.PI / 180);
    };
    this.context.fillStyle = this.color;
    this.context.fillRect(-0.5, -0.5, 0.5, 0.5);
    // Restore the coordinate system.
    this.context.restore();
  };
};

function SolarPanel(xPos, yPos){
  /*
    Object to handle a solar panal. Write once and reuse.
  */
  this.context = context; // The context object to use for drawing.
  this.x = xPos;  // X coordinate of the sprite.
  this.y = yPos;  // Y coordinate of the sprite.
  this.color = "grey";  // Primary color of the sprite.
  this.color2 = "blue"; // Secondary color of the sprite.
  this.color3 = "lightblue"; // Third color for the sprite.
  this.powered = true;  // If this building is active.
  this.generation = 0;  // Amount of power the building is generating.

  this.update = function(){
    // Calculate generation.
    if(this.powered){
      if(gameState.clouds == 0){  // Protect against zero devisions.
        this.generation = gameState.sunlight;
      }else{
        this.generation = gameState.sunlight / gameState.clouds;
      }
    }else{
      this.generation = 0;
    }
    gameState.generate(this.generation);  // Update the gameState's variables.
  }
  this.render = function(){
    // Move the coordinate system.
    this.context.save()
    this.context.translate(this.x, this.y);
    // Draw the base.
    this.context.fillStyle = this.color;
    this.context.fillRect(0, drawingScale, drawingScale, 2 * drawingScale);
    // Draw panel.
    this.context.fillStyle = this.color2;
    this.context.beginPath();
    this.context.moveTo(0, 0);
    this.context.lineTo(drawingScale, drawingScale);
    this.context.lineTo(0, drawingScale);
    this.context.fill();
    this.context.beginPath();
    this.context.moveTo(drawingScale, drawingScale);
    this.context.lineTo(2 * drawingScale, 2 * drawingScale);
    this.context.lineTo(drawingScale, 2 * drawingScale);
    this.context.fill();
    this.context.beginPath();
    this.context.fillStyle = this.color3;
    this.context.moveTo(0, drawingScale);
    this.context.lineTo(drawingScale, drawingScale);
    this.context.lineTo(drawingScale, 2 * drawingScale);
    this.context.fill()
    // Restore the coordinate system.
    this.context.restore();
  }
}

function newGame(){
  gameState = new game(); // Create a new game() object.
  var buildings = [new Office(80 * drawingScale, 25  * drawingScale),  // Create an array with all the buildings in it.
                   new Office(105 * drawingScale, 25  * drawingScale),
                   new House(80  * drawingScale, 50 * drawingScale),
                   new House(92.5  * drawingScale, 50 * drawingScale),
                   new House(105  * drawingScale, 50 * drawingScale),
                   new WindTurbine(250 * drawingScale, 60 * drawingScale),
                   new WindTurbine(230 * drawingScale, 60 * drawingScale),
                   new WindTurbine(210 * drawingScale, 60 * drawingScale),
                   new SolarPanel(250 * drawingScale, 20 * drawingScale),
                   new Factory(80 * drawingScale, 100 * drawingScale)]
  var buildingsLength = buildings.length;

  loop = kontra.gameLoop({  // Create the kontra endless game loop.
    update: function(){
      gameState.update();
      for (var i = 0; i < buildingsLength; i++){  // Update all the buildings in the array.
        buildings[i].update();
      }
    },
    render: function() {
      context.setTransform(1, 0, 0, 1, 0, 0); // Reset current transformation matrix to the identity matrix
      gameState.backLayer();  // Draw the background.
      for (var i = 0; i < buildingsLength; i++){  // Render all the building sprites.
        buildings[i].render();
      }
      gameState.gui();  // Draw the game's GUI.
    }
  });

  loop.start(); // Start game loop.
};
