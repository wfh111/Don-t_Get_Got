var AM = new AssetManager();
var sheetHeight = 490;

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
};

Background.prototype.update = function () {
};

<<<<<<< HEAD
function Spike (game, spritesheet, lane) {
	this.animation = new Animation(spritesheet, 0, 0, 16, 1, 1, true, 0.5);
	this.speed = 1;
	this.ctx = game.ctx;
	Entity.call(this, game, 100 + (100 * lane), 0);
};

Spike.prototype.update = function() {
	this.y += this.game.clockTick * this.speed
	Entity.prototype.update.call(this);
=======
function MushroomDude(game, spritesheet) {
    this.animation = new Animation(spritesheet, 189, 230, 5, 0.10, 14, true, 1);
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
>>>>>>> branch 'master' of https://github.com/wfh111/Don-t_Get_Got.git
}

<<<<<<< HEAD
Spike.prototype = new Entity();
Spike.prototype.constructor = Spike;
=======
MushroomDude.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x + 150, this.y + 100);
}
>>>>>>> branch 'master' of https://github.com/wfh111/Don-t_Get_Got.git

<<<<<<< HEAD
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
=======
MushroomDude.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
        this.x += this.game.clockTick * this.speed;
    if (this.x > 400) this.x = 0;
}


// inheritance
function Cheetah(game, spritesheet) {
    this.animation = new Animation(spritesheet, 512, 256, 2, 0.05, 8, true, 0.5);
    this.speed = 350;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 250);
}

Cheetah.prototype = new Entity();
Cheetah.prototype.constructor = Cheetah;

Cheetah.prototype.update = function () {
>>>>>>> branch 'master' of https://github.com/wfh111/Don-t_Get_Got.git
    this.x += this.game.clockTick * this.speed;
    Entity.prototype.update.call(this);
}

<<<<<<< HEAD
Crate.prototype.draw = function () {
=======
Cheetah.prototype.draw = function () {
>>>>>>> branch 'master' of https://github.com/wfh111/Don-t_Get_Got.git
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}


<<<<<<< HEAD
AM.queueDownload("./img/Crate.png");
AM.queueDownload("./img/Spikes.png");
//AM.queueDownload("./img/background.jpg");
=======
AM.queueDownload("./img/mushroomdude.png");
AM.queueDownload("./img/runningcat.png");
AM.queueDownload("./img/bg3.png");
>>>>>>> branch 'master' of https://github.com/wfh111/Don-t_Get_Got.git

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

<<<<<<< HEAD
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
    
=======
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/bg3.png")));
    gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./img/runningcat.png")));

>>>>>>> branch 'master' of https://github.com/wfh111/Don-t_Get_Got.git
    console.log("All Done!");
});
