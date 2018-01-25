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
//function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
//    this.spriteSheet = spriteSheet;
//    this.startX = startX;
//    this.startY = startY;
//    this.frameWidth = frameWidth;
//    this.frameDuration = frameDuration;
//    this.frameHeight = frameHeight;
//    this.frames = frames;
//    this.totalTime = frameDuration * frames;
//    this.elapsedTime = 0;
//    this.loop = loop;
//    this.reverse = reverse;
//}
//
//Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
//    var scaleBy = scaleBy || 1;
//    this.elapsedTime += tick;
//    if (this.loop) {
//        if (this.isDone()) {
//            this.elapsedTime = 0;
//        }
//    } else if (this.isDone()) {
//        return;
//    }
//    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
//    var vindex = 0;
//    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
//        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
//        vindex++;
//    }
//    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
//        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
//        vindex++;
//    }
//
//    var locX = x;
//    var locY = y;
//    var offset = vindex === 0 ? this.startX : 0;
//    ctx.drawImage(this.spriteSheet,
//                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
//                  this.frameWidth, this.frameHeight,
//                  locX, locY,
//                  this.frameWidth * scaleBy,
//                  this.frameHeight * scaleBy);
//}
//
//Animation.prototype.currentFrame = function () {
//    return Math.floor(this.elapsedTime / this.frameDuration);
//}
//
//Animation.prototype.isDone = function () {
//    return (this.elapsedTime >= this.totalTime);
//}
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

function MushroomDude(game, spritesheet) {
    this.animation = new Animation(spritesheet, 189, 230, 5, 0.10, 14, true,1);
    this.x = 0;
    this.y = 0;
    this.speed = 200;
    this.game = game;
    this.Right = false;
    this.Left = false;
    this.Up = false;
    this.ctx = game.ctx;
}

MushroomDude.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x + 150, this.y + 100);
}

MushroomDude.prototype.update = function () {
    //if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
    //this.x += this.game.clockTick * this.speed;
    //if (this.x > 400) this.x = 0;

    if (this.game.rightButton) {
      this.Right = true;
    } else {
      
      this.Right = false;
    }
    if (this.Right) {
      this.x += this.game.clockTick * this.speed;
    }

    if (this.game.leftButton) {
      this.Left = true;
    } else {
      this.Left = false;
    }
    if (this.Left) {
      this.x -= this.game.clockTick * this.speed;
    }

    if (this.game.upButton) {
      this.Up = true;
    } else {
      this.Up = false;
    }
    if (this.Up) {
      this.y -= this.game.clockTick * this.speed;
    }
}

//0,512
function Spike (game, spritesheet, lane) {
	this.animation = new Animation(spritesheet, 142, 163, 810, 1, 1, true,1);
	this.speed = 60;
	this.ctx = game.ctx;
	if (lane === 0) {
    	Entity.call(this, game, 85, 0);
    } else if (lane === 1) {
    	Entity.call(this, game, 173, 0);
    } else {
    	Entity.call(this, game, 260, 0);
    }
};

Spike.prototype = new Entity();
Spike.prototype.constructor = Spike;

Spike.prototype.update = function() {
	this.y += this.game.clockTick * this.speed
	Entity.prototype.update.call(this);
};

Spike.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);//0.4
    Entity.prototype.draw.call(this);
};
//0,0
// inheritance
function Crate(game, spritesheet, lane) {
    this.animation = new Animation(spritesheet, 512, 512, 810, 1, 1, true,1);
    this.speed = 60;
    this.ctx = game.ctx;
    if (lane === 0) {
    	Entity.call(this, game, 87, 0);
    } else if (lane === 1) {
    	Entity.call(this, game, 175, 0);
    } else {
    	Entity.call(this, game, 260, 0);
    }
};

Crate.prototype = new Entity();
Crate.prototype.constructor = Crate;

Crate.prototype.update = function () {
	this.y += this.game.clockTick * this.speed
	Entity.prototype.update.call(this);
};

Crate.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);//.1
    Entity.prototype.draw.call(this);
};
//0, 1300
function Oil(game, spritesheet, lane) {
    this.animation = new Animation(spritesheet, 776, 484, 810, 1, 1, true,1);
    this.speed = 60;
    this.ctx = game.ctx;
    if (lane === 0) {
    	Entity.call(this, game, 40, 0);
    } else if (lane === 1) {
    	Entity.call(this, game, 128, 0);
    } else {
    	Entity.call(this, game, 215, 0);
    }
};

Oil.prototype = new Entity();
Oil.prototype.constructor = Oil;

Oil.prototype.update = function () {
	this.y += this.game.clockTick * this.speed
	Entity.prototype.update.call(this);
};

Oil.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);//.2
    Entity.prototype.draw.call(this);
};
//0, 675
function Branch(game, spritesheet, lane) {
    this.animation = new Animation(spritesheet, 800, 600, 810, 1, 1, true,1);
    this.speed = 60;
    this.ctx = game.ctx;
    if (lane === 0) {
    	Entity.call(this, game, 70, 0);
    } else if (lane === 1) {
    	Entity.call(this, game, 160, 0);
    } else {
    	Entity.call(this, game, 240, 0);
    }

};

Branch.prototype = new Entity();
Branch.prototype.constructor = Branch;

Branch.prototype.update = function () {
	this.y += this.game.clockTick * this.speed
	Entity.prototype.update.call(this);
};

Branch.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y); //0.1
    Entity.prototype.draw.call(this);
};

function Obstacle_Spawner(game, spritesheet) {
	var obstacles = [];
	
};

AM.queueDownload("./img/Crate.png");
AM.queueDownload("./img/Spikes.png");
AM.queueDownload("./img/bg3.png");
AM.queueDownload("./img/obstacles.png");
AM.queueDownload("./img/newOil.png");
AM.queueDownload("./img/branch.png");
AM.queueDownload("./img/mushroomdude.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    //intiate score
    //myScore = new scoreChange("30px", "Consolas", "black", 280, 40, "text");
    gameEngine.start();
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/bg3.png")));
    gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
//    var type = Math.floor(Math.random() * 100) + 1;
//    type %= 4;
////    var type = 0;
//    var lane = Math.floor(Math.random() * 10) + 1;
//    lane %= 3;
////    var lane = 2;
//    switch(type) {
//    case 0: //Spikes
    	gameEngine.addEntity(new Spike(gameEngine, AM.getAsset("./img/Spikes.png"), 1));
//    	break;
//    case 1: //Crate
//        gameEngine.addEntity(new Crate(gameEngine, AM.getAsset("./img/Crate.png"), lane));
//        break;
//    case 2: //Oil
//    	gameEngine.addEntity(new Oil(gameEngine, AM.getAsset("./img/newOil.png"), lane));
//    	break;
//    case 3: //Branch
//    	gameEngine.addEntity(new Branch(gameEngine, AM.getAsset("./img/branch.png"), lane));
//    	break;
//    }
//    gameEngine.addEntity(new Obstacle_Spawner(gameEngine, AM.getAsset("./img/obstacles.png")))
    console.log("All Done!");
});
