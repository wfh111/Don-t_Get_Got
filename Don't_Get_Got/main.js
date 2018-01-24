var AM = new AssetManager();

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

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function Spike (game, spritesheet, lane) {
	this.animation = new Animation(spritesheet, 0, 0, 16, 1, 1, true, 0.5);
	this.speed = 1;
	this.ctx = game.ctx;
	Entity.call(this, game, 100 + (100 * lane), 0);
};

Spike.prototype.update = function() {
	this.y += this.game.clockTick * this.speed
	Entity.prototype.update.call(this);
}

Spike.prototype = new Entity();
Spike.prototype.constructor = Spike;

Spike.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

// inheritance 
function Crate(game, spritesheet, lane) {
    this.animation = new Animation(spritesheet, 154, 215, 4, 0.15, 8, true, 0.5);
    this.speed = 1;
    this.ctx = game.ctx;
    Entity.call(this, game, (100 * lane) + 100, 0);
};

Crate.prototype = new Entity();
Crate.prototype.constructor = Crate;

Crate.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    Entity.prototype.update.call(this);
}

Crate.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}


AM.queueDownload("./img/Crate.png");
AM.queueDownload("./img/Spikes.png");
//AM.queueDownload("./img/background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

//    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    var type = Math.floor(Math.random() * 10) + 1;
    type %= 2;
    var lane = Math.floor(Math.random() * 10) + 1;
    lane %= 3;
    switch(type) {
    case 0:
    	gameEngine.addEntity(new Spike(gameEngine, AM.getAsset("./img/Spikes.png"), lane));
    	break;
    case 1:
        gameEngine.addEntity(new Crate(gameEngine, AM.getAsset("./img/Crate.png"), lane));
    }
    
    console.log("All Done!");
});