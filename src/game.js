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
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvasHeight = canvas.height; // Set the height of the canvas.
  canvasWidth = canvas.width; // Set the width of the canvas.
  drawingScale = canvasWidth / 384; // Set the distance between grid references.
};

function getRandomInt(max) {
  /*
    Syntactic sugar for generating random integers.
  */
  return Math.floor(Math.random() * Math.floor(max));
};

function endGame(day, time){
  /*
    Display the end game screen.
  */
  loop.stop()  // Stop the game loop.
  canvas.removeEventListener("mousedown");
};

function Element(){
  /*
    Function to handle clickable elements on the GUI.
   */
  this.function = function(){}; // Function to run if the element is clicked.
  this.set = function(x, y, x2, y2){
    this.x = x; // Top of the element.
    this.y = y; // Top of the element.
    this.x2 = x2; // Top of the element.
    this.y2 = y2; // Top of the element.
    this.active = true;
  };
  this.clear = function(){
    this.active = false;
  };
  this.onClick = function(){
    this.function();
  };

  this.set(-1, -1, -1, -1, "");
  this.clear();
};

function defaultSidebar(){
  /*
    Function to hold the default values and draw the sidebar when nothing is selected.
    It also handles the selection cursor.
   */
  this.width = 70 * drawingScale;
  this.color = "#0077c2";  // The primary color used in the sidebars.
  this.color2 = "#0d47a1"; // The secondary color used in the sidebars.
  this.color3 = "#0d47a1"; // The accent color used in the sidebars.
  this.buttonColor = "#00bcd4"; // The primary color used for buttons.
  this.buttonColor2 = "#008ba3";  // The accent color used for buttons.
  this.buttonColor3 = "#e0f7fa"; // The color used when the button has been pressed.
  this.textColor = "#fafafa"; // The color used for the text.
  this.font = "px Nova Flat"; // The font used for the sidebars (Scale will be provided when drawing).
  this.selectionColor = "#ef5350"; // The color of the selection cursor.

  this.buttonAnimation = 0; // The frame the button animation is on.
  this.cursorAnimation = 0; // The frame the cursor animation is on.
  this.cursorExpanding = true;  // If the cursor is currently expanding or contracting.
  this.elements = [new Element()]; // Array of interactive elements in the active sidebar. Used for click detection.

  this.relScale = function(x, y, x2, y2){ // Function to get a relative scale and coordinates for drawing a sprite on the sidebar.
    var sizeX = (x2 - x);
    var sizeY = (y2 - y);
    if (sizeX >= sizeY){
      return [9 * drawingScale, (30 * drawingScale) + ((sizeX - sizeY) / 2) * drawingScale, (51 * drawingScale * drawingScale) / sizeX];
    }else{
      return [(9 * drawingScale) + ((sizeY - sizeX) / 2) * drawingScale, 30 * drawingScale, (48 * drawingScale * drawingScale) / sizeY];
    };
  };
  this.backdrop = function(){
    // Move the coordinate system.
    context.save();
    context.translate(0, 8 * drawingScale);
    // Draw dackdrop.
    context.fillStyle = this.color;
    context.fillRect(0, 0, this.width, canvasHeight);
    // Draw edge.
    context.fillStyle = this.color2;
    context.fillRect(this.width, 0, drawingScale / -2, canvasHeight);
    // Restore the coordinate system.
    context.restore();
  };
  this.building = function(name, active, generation, consumption){  // Draw the default sidebar for when gameState.buildings are selected.
    this.backdrop();
    // Move the coordinate system.
    context.save();
    context.translate(0, 8 * drawingScale);
    // Draw name box.
    context.fillStyle = this.color3;
    context.fillRect(drawingScale, drawingScale, this.width - (3 * drawingScale), 13 * drawingScale);
    context.font = Math.round(6 * drawingScale) + this.font;
    context.fillStyle = this.textColor;
    context.fillText(name, 2 * drawingScale, 6 * drawingScale);
    // Draw sprite box.
    context.fillStyle = "#909090";
    context.fillRect(5.5 * drawingScale, 18.5 * drawingScale, this.width - (12 * drawingScale), 55 * drawingScale);
    context.fillStyle = gameState.backgroundColor;
    context.fillRect(6 * drawingScale, 19 * drawingScale, this.width - (13 * drawingScale), 54 * drawingScale);
    // Draw stats box.
    context.fillStyle = this.color3;
    context.fillRect(drawingScale, 78 * drawingScale, this.width - (3 * drawingScale), 40 * drawingScale);
    context.fillStyle = this.textColor;
    context.fillText("Stats:", 2 * drawingScale, 83 * drawingScale);
    if(active){
      var status = "Online";
    }else{
      var status = "Offline";
    };
    context.fillText("Status:         " + status, 7 * drawingScale, 89 * drawingScale);
    context.fillText("Generating:  " + (Math.floor(generation * 10) / 10), 7 * drawingScale, 95 * drawingScale);
    context.fillText("Consuming: " + (Math.floor(consumption * 10) / 10), 7 * drawingScale, 101 * drawingScale);
    // Draw buttons.
    context.fillStyle = this.buttonColor2;
    context.fillRect(15 * drawingScale, 122 * drawingScale, this.width - (34.5 * drawingScale), 10.5 * drawingScale);
    if(this.buttonAnimation > 0){
      this.buttonAnimation--;
      context.fillStyle = this.buttonColor3;
    }else{
      context.fillStyle = this.buttonColor;
    };
    context.fillRect(15 * drawingScale, 122 * drawingScale, this.width - (35 * drawingScale), 10 * drawingScale);
    context.font = Math.round(6 * drawingScale) + this.font;
    context.fillStyle = this.buttonColor3;
    context.fillText("SWITCH", 21 * drawingScale, 129 * drawingScale);
    // Restore the coordinate system.
    context.restore();
  };

  this.update = function(){
    // Update elements.
    if(gameState.buildingSelected === false){
      this.elements[0].clear();
    }else{
      this.elements[0].set(15 * drawingScale, 130 * drawingScale, this.width - (20 * drawingScale), 140 * drawingScale);
      this.elements[0].function = function(){
        gameState.buildings[gameState.buildingSelected].togglePwd();
        defaultSidebar.buttonAnimation = 5;
      }
    };
    // Advance the cursor animation.
    if(this.cursorExpanding == true){
      this.cursorAnimation = this.cursorAnimation + (drawingScale / 60);
      if(this.cursorAnimation >= drawingScale/2){
        this.cursorExpanding = false;
      };
    }else{
      this.cursorAnimation = this.cursorAnimation - (drawingScale / 60);
      if(this.cursorAnimation <= 0){
        this.cursorExpanding = true;
      };
    };
  };
  this.render = function(){ // Draw the sidebar when nothing is selected(otherwise drawing is handled by the selected object).
    // Draw the default backdrop.
    this.backdrop();
    // Move the coordinate system.
    context.save();
    context.translate(0, 8 * drawingScale);
    // Draw boxes.
    context.fillStyle = this.color2;
    context.fillRect(drawingScale, drawingScale, this.width - (3 * drawingScale), 13 * drawingScale);
    context.fillRect(drawingScale, 15 * drawingScale, this.width - (3 * drawingScale), 31 * drawingScale);
    // Draw text.
    context.font = Math.round(6 * drawingScale) + this.font;
    context.fillStyle = this.textColor;
    context.fillText("Score", 2 * drawingScale, 6 * drawingScale);
    context.fillText(Math.floor(gameState.score) + " kWH", 7 * drawingScale, 12 * drawingScale);
    context.fillText("Weather Forecast", 2 * drawingScale, 20 * drawingScale);
    context.fillText("1hr - " + gameState.weatherAtTime(750), 7 * drawingScale, 26 * drawingScale);
    context.fillText("2hr - " + gameState.weatherAtTime(1500), 7 * drawingScale, 32 * drawingScale);
    context.fillText("5hr - " + gameState.weatherAtTime(3750), 7 * drawingScale, 38 * drawingScale);
    context.fillText("12hr - " + gameState.weatherAtTime(9000), 4 * drawingScale, 44 * drawingScale);
    // Restore the coordinate system.
    context.restore();
  };
  this.cursor = function(x, y, x2, y2){
    // Calculate the size of the sprite in pixels.
    var dx = (x2 - x);
    var dy = (y2 - y);
    // Move the coordinate system.
    context.save();
    context.translate(x, y);
    // Draw.
    context.fillStyle = this.selectionColor;
    context.fillRect(-drawingScale - this.cursorAnimation, -drawingScale - this.cursorAnimation, 2 * drawingScale, drawingScale / 2);
    context.fillRect(-drawingScale - this.cursorAnimation, -drawingScale - this.cursorAnimation, drawingScale / 2, 2 * drawingScale);
    context.fillRect(dx + drawingScale + this.cursorAnimation, -drawingScale - this.cursorAnimation, -2 * drawingScale, drawingScale / 2);
    context.fillRect(dx + drawingScale + this.cursorAnimation, -drawingScale - this.cursorAnimation, drawingScale / -2, 2 * drawingScale);
    context.fillRect(-drawingScale - this.cursorAnimation, dy + drawingScale + this.cursorAnimation, 2 * drawingScale, drawingScale / -2);
    context.fillRect(-drawingScale - this.cursorAnimation, dy + drawingScale + this.cursorAnimation, drawingScale / 2, -2 * drawingScale);
    context.fillRect(dx + drawingScale + this.cursorAnimation, dy + drawingScale + this.cursorAnimation, -2 * drawingScale, drawingScale / -2);
    context.fillRect(dx + drawingScale + this.cursorAnimation, dy + drawingScale + this.cursorAnimation, drawingScale / -2, -2 * drawingScale);
    // Restore the coordinate system.
    context.restore();
  };
};

function game(){
  /*
    Object to track and update the game's state.
  */
  this.color = "#0d47a1";  // The primary color used in the GUI.
  this.textColor = "#fafafa"; // The color used for the text.
  this.font = "px Nova Flat"; // The font used for the GUI (Scale will be provided when drawing).

  this.buildings = [];  // Array of buildings in the game.
  this.buildingSelected = false; // The index of the building selected.
  this.score = 0; // The player's score.
  this.time = 9000;  // The time of day in the game.
  this.day = 1;   // How many in game days have elapsed.
  this.backgroundColor = "";  // The color of the grass background.
  this.sunlight = 10; // Brightness of the sun(dependent on time, independent of cloud cover).
  this.weather = ""; // Description of the in game weather state.
  this.wind = 0;  // The amount of wind.
  this.clouds = 0;  // Density of cloud cover.
  this.weatherDelay = 0;  // How many cycles before the weather changes. Stops the weather from changing every cycle.
  this.futureWeather = [[7, 2, "Windy, Clear", 1800]];  // Array to hold at least 12hrs worth of pre-generated weather. Required for the weather forecast.
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
  };
  this.friendlyWeather = function(iWind, iClouds){  // Return a description of the input weather.
    if(iWind < 2){
      frWeather = "Calm";
    }else if (iWind < 5) {
      frWeather = "Breezy";
    } else if (iWind < 7) {
      frWeather = "Windy";
    } else {
      frWeather = "Gale";
    };
    if(iClouds > 7){
      frWeather = frWeather + ", Overcast";
    } else if (iClouds > 3) {
      frWeather = frWeather + ", Cloudy";
    } else{
      frWeather = frWeather + ", Clear"
    }
    return frWeather;
  };
  this.weatherAtTime = function(cycles){  // Return the description of the weather at the cycle provided.
    var duration = this.weatherDelay;
    if(duration >= cycles){
      return this.weather;
    };
    var futureWeatherLength = this.futureWeather.length;
    for(var i = 0; i < futureWeatherLength; i++){
      duration = duration + this.futureWeather[i][3];
      if(duration >= cycles){
        return this.futureWeather[i][2];
      };
    };
  };
  this.futureWeatherDuration = function(){  // Find how many cycles worth of weather are stored in futureWeather[].
    var duration = 0;
    var futureWeatherLength = this.futureWeather.length;
    for(var i = 0; i < futureWeatherLength; i++){
      duration = duration + this.futureWeather[i][3];
    };
    return duration;
  };

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
    var times = [[0, 3000,"#0d3010", 0],
                 [3001, 3750,"#154f1a", 3],
                 [3751, 4500,"#1f7827", 6],
                 [4501, 5250,"#279931", 8],
                 [5251, 6000,"#2aa835", 9],
                 [6001, 12000,"#4bbf4d", 10],
                 [12001, 12750,"#2aa835", 8],
                 [12751, 13500,"#279931", 6],
                 [13501, 14250,"#1f7827", 4],
                 [14251, 15000,"#154f1a", 2],
                 [15001, 18000,"#0d3010", 0]];
    timesLength = times.length;
    for(var i = 0; i < timesLength; i++){
      if(this.time >= times[i][0] && this.time <= times[i][1]){
        this.backgroundColor = times[i][2];
        this.sunlight = times[i][3];
        break;
      };
    };
    // Check that the amount of power being consumend does not excede the power being generated.
    if (this.powerGenerated < this.powerConsumed){
      if (this.gridFail <= 0){  // Test for end game condition.
        endGame(this.day, this.time);
      };
      this.gridFail--;  // Continue the countdown.
    } else {  // If the grid is fine
      this.gridFail = 300;  // Reset the count down.
      this.score = this.score + (this.powerConsumed / 750); // If all is well, add to the player's score.
    };
    // Clear the power variables for the next turn.
    this.powerGenerated = 1;
    this.powerConsumed = 0;
    // Update the weather.
    this.weatherDelay--;
    // Generate new weather.
    while(this.futureWeatherDuration() < 9000){ // If there is less than 12hrs of weather pre-generated
      var newWind = getRandomInt(11);
      var newClouds = getRandomInt(11)
      this.futureWeather.push([newWind, newClouds, this.friendlyWeather(newWind, newClouds), getRandomInt(18000) + 360]);
    };
    if (this.weatherDelay <= 0){  // If the weather must be changed.
      // Get the next weather.
      this.wind = this.futureWeather[0][0];
      this.clouds = this.futureWeather[0][1];
      this.weather = this.futureWeather[0][2];
      this.weatherDelay = this.futureWeather[0][3];
      this.futureWeather.shift();
    };
  };
  this.backLayer = function (){ // Render the background for the map.
    context.fillStyle = this.backgroundColor;
    context.fillRect(0, 0, canvasWidth, canvasHeight);
  };
  this.gui = function (){  // Render the game's GUI.
    // Panic message.
    if(this.gridFail < 300){  // If the grid is failing
      var failTime = Math.floor((this.gridFail / 60) * 10) / 10;
      if((failTime % 1) == 0){
        failTime = failTime + ".0";
      };
      if(failTime < 0){
        failTime = "0.0";
      };
      context.fillStyle = "#e53935";
      context.fillRect(0, 0, canvasWidth, 8 * drawingScale);
      context.font = Math.round(6 * drawingScale) + this.font;
      context.fillStyle = this.textColor;
      context.fillText("Warning! Grid going offline in " + failTime + "s", 165 * drawingScale, 6 * drawingScale);
    };
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
    if(this.powerGenerated <= this.powerConsumed){  // If the grid is overloaded.
      context.fillStyle = "#e53935";
    }else{
      context.fillStyle = this.textColor;
    };
    context.fillText(Math.floor(this.powerGenerated) + " / "+ Math.floor(this.powerConsumed) + "  " + Math.floor((this.powerConsumed / this.powerGenerated) * 100) + "%", 5 * drawingScale, 6 * drawingScale);
    context.fillStyle = this.textColor;
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
  };
};

function House(xPos, yPos){
  /*
    Object to handle a house building. Write once and reuse.
  */
  this.x = xPos;  // X coordinate of the sprite.
  this.y = yPos;  // Y coordinate of the sprite.
  this.x2 = xPos + (8 * drawingScale);  // Bottom corner X of the sprite. Used for click detection.
  this.y2 = yPos + (6 * drawingScale);  // Bottom corner Y of the sprite. Used for click detection.
  this.color = "grey";  // Primary color of the sprite.
  this.color2 = ""; // Secondary color of the sprite.
  this.powered = true;  // If the building is active.
  this.lights = [false, 0, 9002];  // If the window should be lit, when it should be lit and when it should turn off.
  this.consumption = 0;  // Amount of power the building is consuming.

  this.color2Possibles = ["#3949ab", "#d32f2f", "#d4e157", "#c56000"];
  this.color2 = this.color2Possibles[getRandomInt(4)];  // Choose a random secondary color.

  this.update = function (){  // Update the state of the object.
    // Check if the lights should be on.
    if(gameState.time == this.lights[1]){ // If it is time to turn on the lights
      this.lights[0] = true;  // Turn on the light.
    };
    if(gameState.time == this.lights[2]){ // If it is time to turn off the lights.
      this.lights[0] = false; // Turn off the light.
      this.lights[1] = getRandomInt(1500) + 13500;  // Set tommorrow's turn on time.
      this.lights[2] = getRandomInt(3000) + 3000; // Set tommorrow's turn off time.
    };
    // Calculate the consumption.
    if(this.powered){
      this.consumption = 2; // Base consumption.
      if(this.lights[0]){ // If the light is on
        this.consumption = this.consumption + 1;
      };
      gameState.consume(this.consumption);  // Update the gameState's variables.
    }else{
      this.consumption = 0;
    };

  };
  this.render = function (){
    this.sprite(this.x, this.y, drawingScale);
  };
  this.sprite = function(x, y, scale){ // Render the sprite.
    // Move the coordinate system.
    context.save();
    context.translate(x, y);
    // Draw chimney.
    context.fillStyle = this.color;
    context.fillRect(scale, 0, scale, 2 * scale);
    // Draw roof.
    context.fillStyle = this.color2;
    context.beginPath();
    context.moveTo(0, 2 * scale);
    context.lineTo(4 * scale, 0);
    context.lineTo(8 * scale, 2 * scale);
    context.fill();
    // Draw walls.
    context.fillStyle = this.color;
    context.fillRect(0, 2 * scale, 8 * scale, 4 * scale);
    // Draw window.
    if(this.lights[0] && this.powered){  // Check if the lights should be on or off.
      context.fillStyle = "#ffff8b";
    } else {
      context.fillStyle = "#000000";
    };
    context.fillRect(scale, 3 * scale, 2 * scale, 2 * scale);
    // Draw door.
    context.fillStyle = "#000000";
    context.fillRect(5 * scale, 3 * scale, 2 * scale, 3 * scale);
    // Restore the coordinate system.
    context.restore();
  };
  this.sidebar = function(){
    defaultSidebar.building("House", this.powered, 0, this.consumption);
    var sidebarSprite = defaultSidebar.relScale(this.x, this.y, this.x2, this.y2);  // Get the coordinates and relative scale to draw the sprite at.
    this.sprite(sidebarSprite[0], sidebarSprite[1], sidebarSprite[2]);  // Draw the sprite on the sidebar.
  };
  this.togglePwd = function(){
    if(this.powered){
      this.powered = false;
    }else{
      this.powered = true;
    };
  };
  this.onClick = function(){

  };
};

function Office(xPos, yPos){
  /*
    Object to handle an office building. Write once and reuse.
  */
  this.x = xPos;  // X coordinate of the sprite.
  this.y = yPos;  // Y coordinate of the sprite.
  this.x2 = xPos + (13 * drawingScale);  // Bottom corner X of the sprite. Used for click detection.
  this.y2 = yPos + (12 * drawingScale);  // Bottom corner Y of the sprite. Used for click detection.
  this.color = "grey";  // Primary color of the sprite.
  this.powered = true;  // If the building is active.
  this.lights = [[false, 0, 9002]]  // If the window should be lit, when it should be lit and when it should turn off.
  this.consumption = 0;  // Amount of power the building is consuming.

  for(var i = 0; i < 9; i++){ // Populate the windows array.
    this.lights.push([false, 0, 9002])
  };

  this.update = function (){  // Update the state of the object.
    // Check if the lights should be on.
    var lightsLength = this.lights.length;
    for(var i = 0; i < lightsLength; i++){
      if(gameState.time == this.lights[i][1]){ // If it is time to turn on the lights
        this.lights[i][0] = true;  // Turn on the light.
      };
      if(gameState.time == this.lights[i][2]){ // If it is time to turn off the lights.
        this.lights[i][0] = false; // Turn off the light.
        this.lights[i][1] = getRandomInt(1500) + 13500;  // Set tommorrow's turn on time.
        this.lights[i][2] = getRandomInt(3000) + 3000; // Set tommorrow's turn off time.
      };
    };
    // Calculate the consumption.
    if(this.powered){
      this.consumption = 2; // Base consumption.
      for(var i = 0; i < lightsLength; i++){
        if(this.lights[i][0]){ // If the light is on
          this.consumption = this.consumption + 0.5;
        };
      };
      gameState.consume(this.consumption);  // Update the gameState's variables.
    }else{
      this.consumption = 0;
    };
  };
  this.render = function(){
    this.sprite(this.x, this.y, drawingScale);
  };
  this.sprite = function(x, y, scale){  // Render the sprite.
    // Move the coordinate system.
    context.save();
    context.translate(x, y);
    // Draw walls.
    context.fillStyle = this.color;
    context.fillRect(0, 0, 13 * scale, 12 * scale);
    // Draw windows.
    var windows = [[scale, scale, 2 * scale, 2 * scale],
                   [4 * scale, scale, 2 * scale, 2 * scale],
                   [7 * scale, scale, 2 * scale, 2 * scale],
                   [10 * scale, scale, 2 * scale, 2 * scale],
                   [scale, (5 * scale), 2 * scale, 2 * scale],
                   [4 * scale, 5 * scale, 2 * scale, 2 * scale],
                   [7 * scale, 5 * scale, 2 * scale, 2 * scale],
                   [10 * scale, 5 * scale, 2 * scale, 2 * scale],
                   [scale, 9 * scale, 2 * scale, 2 * scale],
                   [10 * scale, 9 * scale, 2 * scale, 2 * scale]]
    var lightsLength = this.lights.length;
    if(this.powered){
      context.fillStyle = "#ffff8b";
      for(var i = 0; i < lightsLength; i++){
        if(this.lights[i][0]){  // Check if the lights should be on or off.
          context.fillRect(windows[i][0], windows[i][1], windows[i][2], windows[i][3]);
        };
      };
    };
    context.fillStyle = "#000000";
    for(var i =0; i < lightsLength; i++){
      if(!(this.powered) || !(this.lights[i][0])){
        context.fillRect(windows[i][0], windows[i][1], windows[i][2], windows[i][3]);
      };
    };
    // Draw door.
    context.fillStyle = "#000000";
    context.fillRect(5 * scale, 8 * scale, 3 * scale, 4 * scale);
    // Restore the coordinate system.
    context.restore();
  };
  this.sidebar = function(){
    defaultSidebar.building("Office", this.powered, 0, this.consumption);
    var sidebarSprite = defaultSidebar.relScale(this.x, this.y, this.x2, this.y2);  // Get the coordinates and relative scale to draw the sprite at.
    this.sprite(sidebarSprite[0], sidebarSprite[1], sidebarSprite[2]);  // Draw the sprite on the sidebar.
  };
  this.togglePwd = function(){
    if(this.powered){
      this.powered = false;
    }else{
      this.powered = true;
    };
  };
  this.onClick = function(){

  };
};

function Factory(xPos, yPos){
  /*
    Object to handle a factory building. Write once and reuse.
  */
  this.x = xPos;  // X coordinate of the sprite.
  this.y = yPos;  // Y coordinate of the sprite.
  this.x2 = xPos + (12 * drawingScale);  // Bottom corner X of the sprite. Used for click detection.
  this.y2 = yPos + (10 * drawingScale);  // Bottom corner Y of the sprite. Used for click detection.
  this.color = "grey";  // Primary color of the sprite.
  this.color2 = ""; // Secondary color of the sprite.
  this.powered = true;  // If the building is powered
  this.consumption = 0;  // Amount of power the building is consuming.

  this.color2Possibles = ["#3949ab", "#d32f2f", "#d4e157", "#c56000"];
  this.color2 = this.color2Possibles[getRandomInt(4)];  // Choose a random secondary color.

  this.update = function(){
    if(this.powered){
      this.consumption = 30;
      gameState.consume(this.consumption);  // Update the gameState's variables.
    }else{
      this.consumption = 0;
    };
  };
  this.render = function(){
    this.sprite(this.x, this.y, drawingScale);
  };
  this.sprite = function(x, y, scale){
    // Move the coordinate system.
    context.save();
    context.translate(x, y);
    // Draw chimneys.
    context.fillStyle = this.color;
    context.fillRect(scale, 0, scale, 4 * scale);
    context.fillRect(4 * scale, 0, scale, 4 * scale);
    // Draw walls.
    context.fillStyle = this.color;
    context.fillRect(0, 4 * scale, 12 * scale, 6 * scale);
    // Draw door.
    context.fillStyle = "black";
    context.fillRect(9 * scale, 7 * scale, 2 * scale, 3 * scale);
    // Draw windows.
    if((gameState.time >= 13500 || gameState.time <= 4875) && this.powered){  // Check if the lights should be on or off.
      context.fillStyle = "#ffff8b";
    } else {
      context.fillStyle = "#000000";
    };
    context.fillRect(scale, 5 * scale, 2 * scale, scale);
    context.fillRect(4 * scale, 5 * scale, 2 * scale, scale);
    context.fillRect(7 * scale, 5 * scale, 2 * scale, scale);
    // Draw roof.
    context.fillStyle = this.color2;
    context.beginPath();
    context.moveTo(0, 4 * scale);
    context.lineTo(0, 2 * scale);
    context.lineTo(3 * scale, 4 * scale);
    context.lineTo(3 * scale, 2 * scale);
    context.lineTo(6 * scale, 4 * scale);
    context.lineTo(6 * scale, 2 * scale);
    context.lineTo(9 * scale, 4 * scale);
    context.lineTo(9 * scale, 2 * scale);
    context.lineTo(12 * scale, 4 * scale);
    context.fill();
    // Restore the coordinate system.
    context.restore();
  };
  this.sidebar = function(){
    defaultSidebar.building("Factory", this.powered, 0, this.consumption);
    var sidebarSprite = defaultSidebar.relScale(this.x, this.y, this.x2, this.y2);  // Get the coordinates and relative scale to draw the sprite at.
    this.sprite(sidebarSprite[0], sidebarSprite[1], sidebarSprite[2]);  // Draw the sprite on the sidebar.
  };
  this.togglePwd = function(){
    if(this.powered){
      this.powered = false;
    }else{
      this.powered = true;
    };
  };
  this.onClick = function(){

  };
};

function WindTurbine(xPos, yPos){
  /*
    Object to handle a wind turbine. Write once and reuse.
  */
  this.x = xPos;  // X coordinate of the sprite.
  this.y = yPos;  // Y coordinate of the sprite.
  this.x2 = xPos + (5 * drawingScale);  // Bottom corner X of the sprite. Used for click detection.
  this.y2 = yPos + (9 * drawingScale);  // Bottom corner Y of the sprite. Used for click detection.
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
    this.sprite(this.x, this.y, drawingScale);
  };
  this.sprite = function(x, y, scale){
    // Move the coordinate system.
    context.save();
    context.translate(x, y);
    // Draw base.
    context.fillStyle = this.color;
    context.fillRect(2 * scale, 2 * scale, scale, 7 * scale);
    context.fillStyle = this.color2;
    context.fillRect(3 * scale,8 * scale, scale, scale);
    // Draw blades.
    context.translate(2.5 * scale, 2.5 * scale);
    context.rotate((Math.floor(this.frame / 20) * 15 ) * (Math.PI / 180));
    for(var r = 0; r < 4; r++){
      context.fillStyle = this.color;
      context.beginPath();
      context.moveTo(-2.5 * scale, -2.5 * scale);
      context.lineTo(-1.5 * scale, -2.5 * scale);
      context.lineTo(0.5 * scale, -0.5 * scale);
      context.lineTo(-0.5 * scale, 0.5 * scale);
      context.lineTo(-2.5 * scale, -1.5 * scale);
      context.fill();
      context.rotate(90 * (Math.PI / 180));
    };
    for(var r = 0; r < 4; r++){
      context.fillStyle = this.color2;
      context.beginPath();
      context.moveTo(-1.5 * scale, -2.5 * scale);
      context.lineTo(0.5 * scale, -0.5 * scale);
      context.lineTo(-0.5 * scale, -0.5 * scale);
      context.lineTo(-1.5 * scale, -1.5 * scale);
      context.fill();
      context.rotate(90 * Math.PI / 180);
    };
    context.fillStyle = this.color;
    context.fillRect(-0.5, -0.5, 0.5, 0.5);
    // Restore the coordinate system.
    context.restore();
  };
  this.sidebar = function(){
    defaultSidebar.building("Wind Turbine", this.powered, this.generation, 0);
    var sidebarSprite = defaultSidebar.relScale(this.x, this.y, this.x2, this.y2);  // Get the coordinates and relative scale to draw the sprite at.
    this.sprite(sidebarSprite[0], sidebarSprite[1], sidebarSprite[2]);  // Draw the sprite on the sidebar.
  };
  this.togglePwd = function(){
    if(this.powered){
      this.powered = false;
    }else{
      this.powered = true;
    };
  };
  this.onClick = function(){

  };
};

function SolarPanel(xPos, yPos){
  /*
    Object to handle a solar panal. Write once and reuse.
  */
  this.x = xPos;  // X coordinate of the sprite.
  this.y = yPos;  // Y coordinate of the sprite.
  this.x2 = xPos + (2 * drawingScale);  // Bottom corner X of the sprite. Used for click detection.
  this.y2 = yPos + (3 * drawingScale);  // Bottom corner Y of the sprite. Used for click detection.
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
      };
    }else{
      this.generation = 0;
    };
    gameState.generate(this.generation);  // Update the gameState's variables.
  };
  this.render = function(){
    this.sprite(this.x, this.y, drawingScale);
  };
  this.sprite = function(x, y, scale){
    // Move the coordinate system.
    context.save()
    context.translate(x, y);
    // Draw the base.
    context.fillStyle = this.color;
    context.fillRect(0, scale, scale, 2 * scale);
    // Draw panel.
    context.fillStyle = this.color2;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(scale, scale);
    context.lineTo(0, scale);
    context.fill();
    context.beginPath();
    context.moveTo(scale, scale);
    context.lineTo(2 * scale, 2 * scale);
    context.lineTo(scale, 2 * scale);
    context.fill();
    context.beginPath();
    context.fillStyle = this.color3;
    context.moveTo(0, scale);
    context.lineTo(scale, scale);
    context.lineTo(scale, 2 * scale);
    context.fill();
    // Restore the coordinate system.
    context.restore();
  };
  this.sidebar = function(){
    defaultSidebar.building("Solar Panel", this.powered, this.generation, 0);
    var sidebarSprite = defaultSidebar.relScale(this.x, this.y, this.x2, this.y2);  // Get the coordinates and relative scale to draw the sprite at.
    this.sprite(sidebarSprite[0], sidebarSprite[1], sidebarSprite[2]);  // Draw the sprite on the sidebar.
  };
  this.togglePwd = function(){
    if(this.powered){
      this.powered = false;
    }else{
      this.powered = true;
    };
  };
  this.onClick = function(){

  };
}

function newGame(){
  gameState = new game(); // Create a new game() object.
  defaultSidebar = new defaultSidebar();
  gameState.buildings = [new WindTurbine(80 * drawingScale, 25  * drawingScale),  // Create an array with all the gameState.buildings in it.
                   new WindTurbine(90 * drawingScale, 25  * drawingScale),
                   new WindTurbine(100 * drawingScale, 25 * drawingScale),
                   new WindTurbine(85  * drawingScale, 35 * drawingScale),
                   new WindTurbine(95  * drawingScale, 35 * drawingScale),
                   new WindTurbine(105  * drawingScale, 35 * drawingScale),
                   new House(200 * drawingScale, 40 * drawingScale),
                   new House(210 * drawingScale, 40 * drawingScale),
                   new House(220 * drawingScale, 40 * drawingScale),
                   new House(230 * drawingScale, 40 * drawingScale),
                   new House(200 * drawingScale, 50 * drawingScale),
                   new House(210 * drawingScale, 50 * drawingScale),
                   new House(220 * drawingScale, 50 * drawingScale),
                   new House(230 * drawingScale, 50 * drawingScale),
                   new House(240 * drawingScale, 45 * drawingScale),
                   new Office(200 * drawingScale, 80 * drawingScale),
                   new Office(215 * drawingScale, 80 * drawingScale),
                   new Office(230 * drawingScale, 80 * drawingScale),
                   new SolarPanel(227.5 * drawingScale, 15 * drawingScale),
                   new SolarPanel(232.5 * drawingScale, 15 * drawingScale),
                   new SolarPanel(237.5 * drawingScale, 15 * drawingScale),
                   new SolarPanel(242.5 * drawingScale, 15 * drawingScale),
                   new SolarPanel(247.5 * drawingScale, 15 * drawingScale),
                   new SolarPanel(230 * drawingScale, 20 * drawingScale),
                   new SolarPanel(235 * drawingScale, 20 * drawingScale),
                   new SolarPanel(240 * drawingScale, 20 * drawingScale),
                   new SolarPanel(245 * drawingScale, 20 * drawingScale),
                   new SolarPanel(250 * drawingScale, 20 * drawingScale),
                   new Factory(80 * drawingScale, 100 * drawingScale),
                   new Factory(100 * drawingScale, 100 * drawingScale)]
  var buildingsLength = gameState.buildings.length;

  loop = kontra.gameLoop({  // Create the kontra endless game loop.
    update: function(){
      gameState.update();
      defaultSidebar.update();
      for (var i = 0; i < buildingsLength; i++){  // Update all the gameState.buildings in the array.
        gameState.buildings[i].update();
      }
    },
    render: function(){
      context.setTransform(1, 0, 0, 1, 0, 0); // Reset current transformation matrix to the identity matrix
      gameState.backLayer();  // Draw the background.
      for (var i = 0; i < buildingsLength; i++){  // Render all the building sprites.
        gameState.buildings[i].render();
      };
      if(gameState.buildingSelected !== false){ // If there is a building selected
        defaultSidebar.cursor(gameState.buildings[gameState.buildingSelected].x, gameState.buildings[gameState.buildingSelected].y, gameState.buildings[gameState.buildingSelected].x2, gameState.buildings[gameState.buildingSelected].y2);  // Draw the selection cursor.
        gameState.buildings[gameState.buildingSelected].sidebar();  // Use that building's sidebar.
      }else{  // If there is no building selected
        defaultSidebar.render();  // Draw the default sidebar.
      };
      gameState.gui();  // Draw the game's GUI.
    }
  });

  canvas.addEventListener("mousedown", function(event){
    if (event.which == 1){
      console.log("Clicked (" + event.pageX + ", " + event.pageY + ")   (" + Math.round(event.pageX / drawingScale) + ", " + Math.round(event.pageY / drawingScale) + ")"); // Temporary code to help me debug and place elements. Really kick me if I leave this in! :-P
      if(event.pageX > defaultSidebar.width){ // If the event does not land on the sidebar.
        for(var i = 0; i < buildingsLength; i++){ // Try to find a building that was clicked on.
          if(event.pageX >= gameState.buildings[i].x && event.pageX <= gameState.buildings[i].x2 && event.pageY >= gameState.buildings[i].y && event.pageY <= gameState.buildings[i].y2){
            gameState.buildings[i].onClick();
            if(gameState.buildingSelected === i){  // If the user clicked on the selected building
              gameState.buildingSelected = false; // Deselect the building.
              defaultSidebar.elements[0].empty();
            }else{
              gameState.buildingSelected = i; // Select the building.

            };
            return; // No need to keep looping.
          };
        };
        gameState.buildingSelected = false; // If nothing was clicked on, deselect the current selection.
      }else{  // If the event does land on the sidebar
        var sidebarElementsLength = defaultSidebar.elements.length;
        for(var i = 0; i < sidebarElementsLength; i++){
          if(event.pageX >= defaultSidebar.elements[i].x && event.pageX <= defaultSidebar.elements[i].x2 && event.pageY >= defaultSidebar.elements[i].y && event.pageY <= defaultSidebar.elements[i].y2){
            defaultSidebar.elements[i].onClick();
            return; // No need to keep looping.
          };
        };
      };
    };
  });

  loop.start(); // Start game loop.
};
