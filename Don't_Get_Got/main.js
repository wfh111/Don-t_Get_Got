var AM = new AssetManager();
var sheetHeight = 490;
var myScore;


function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

//Score to display on canvas
/*function scoreChange(width, height, color, x, y, type) {
	this.type = type;
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0; 
	this.x = x;
	this.y = y; 
	this.updateScore = function() {
	ctx = myGameArea.context;
	ctx.font = this.width + " " + this.height;
	ctx.fillStyle = color;
	ctx.fillText(this.text, this.x, this.y);
}*/




// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.speed = 1;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    //this.ctx.drawImage(this.spritesheet,
      //             this.x, this.y);
      // Pan background
      this.y += this.speed;
      this.ctx.drawImage(this.spritesheet,
                     this.x, this.y);

      // Draw another image at the top edge of the first image
      this.ctx.drawImage(this.spritesheet,
                     this.x, this.y - sheetHeight);

      // If the image scrolled off the screen, reset
      if (this.y >= sheetHeight)
        this.y = 0;
/*      gameEngine.frameNo += 1;
      myScore.text = "SCORE: " + gameEngine.frameNo;
      myScore.updateScore();*/
};

Background.prototype.update = function () {
};

function Spike (game, spritesheet, lane) {
	this.animation = new Animation(spritesheet, 142, 163, 142, 1, 1, true, 0.4);
	this.speed = 60;
	this.ctx = game.ctx;
	Entity.call(this, game, 75 + (100 * lane), 0);
};

Spike.prototype = new Entity();
Spike.prototype.constructor = Spike;

Spike.prototype.update = function() {
	this.y += this.game.clockTick * this.speed
	Entity.prototype.update.call(this);
};

Spike.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

// inheritance 
function Crate(game, spritesheet, lane) {
    this.animation = new Animation(spritesheet, 512, 512, 512, 1, 1, true, 0.1);
    this.speed = 60;
    this.ctx = game.ctx;
    Entity.call(this, game, (100 * lane) + 75, 0);
};

Crate.prototype = new Entity();
Crate.prototype.constructor = Crate;

Crate.prototype.update = function () {
	this.y += this.game.clockTick * this.speed
	Entity.prototype.update.call(this);
};

Crate.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

function Oil(game, spritesheet, lane) {
    this.animation = new Animation(spritesheet, 776, 484, 776, 1, 1, true, 0.2);
    this.speed = 60;
    this.ctx = game.ctx;
    Entity.call(this, game, (100 * lane) + 25, 0);
};

Oil.prototype = new Entity();
Oil.prototype.constructor = Oil;

Oil.prototype.update = function () {
	this.y += this.game.clockTick * this.speed
	Entity.prototype.update.call(this);
};

Oil.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

function Branch(game, spritesheet, lane) {
    this.animation = new Animation(spritesheet, 800, 600, 800, 1, 1, true, 0.1);
    this.speed = 60;
    this.ctx = game.ctx;
    Entity.call(this, game, (100 * lane) + 65, 0);
};

Branch.prototype = new Entity();
Branch.prototype.constructor = Branch;

Branch.prototype.update = function () {
	this.y += this.game.clockTick * this.speed
	Entity.prototype.update.call(this);
};

Branch.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

AM.queueDownload("./img/Crate.png");
AM.queueDownload("./img/Spikes.png");
AM.queueDownload("./img/bg3.png");
AM.queueDownload("./img/oil.png");
AM.queueDownload("./img/branch.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    //intiate score
    //myScore = new scoreChange("30px", "Consolas", "black", 280, 40, "text");
    gameEngine.start();
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/bg3.png")));
    var type = Math.floor(Math.random() * 100) + 1;
    type %= 4;
    var lane = Math.floor(Math.random() * 10) + 1;
    lane %= 3;
    switch(type) {
    case 0: //Spikes
    	gameEngine.addEntity(new Spike(gameEngine, AM.getAsset("./img/Spikes.png"), lane));
    	break;
    case 1: //Crate
        gameEngine.addEntity(new Crate(gameEngine, AM.getAsset("./img/Crate.png"), lane));
        break;
    case 2: //Oil
    	gameEngine.addEntity(new Oil(gameEngine, AM.getAsset("./img/newOil.png"), lane));
    	break;
    case 3: //Branch
    	gameEngine.addEntity(new Branch(gameEngine, AM.getAsset("./img/branch.png"), lane));
    	break;
    }
    console.log("All Done!");
});
