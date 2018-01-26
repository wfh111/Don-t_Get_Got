var AM = new AssetManager();
var sheetHeight = 490;
var right_lane = 100;
var left_lane = -100;
var middle_lane = 0;
var lane_size = 100;
var left_change = 0;
var right_change = 0;
var gameScore = 0;

//function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
//    this.spriteSheet = spriteSheet;
//    this.frameWidth = frameWidth;
//    this.frameDuration = frameDuration;
//    this.frameHeight = frameHeight;
//    this.sheetWidth = sheetWidth;
//    this.frames = frames;
//    this.totalTime = frameDuration * frames;
//    this.elapsedTime = 0;
//    this.loop = loop;
//    this.scale = scale;
//}
//
//Animation.prototype.drawFrame = function (tick, ctx, x, y) {
//    this.elapsedTime += tick;
//    if (this.isDone()) {
//        if (this.loop) this.elapsedTime = 0;
//    }
//    var frame = this.currentFrame();
//    var xindex = 0;
//    var yindex = 0;
//    xindex = frame % this.sheetWidth;
//    yindex = Math.floor(frame / this.sheetWidth);
//
//    ctx.drawImage(this.spriteSheet,
//                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
//                 this.frameWidth, this.frameHeight,
//                 x, y,
//                 this.frameWidth * this.scale,
//                 this.frameHeight * this.scale);
//}
//
//Animation.prototype.currentFrame = function () {
//    return Math.floor(this.elapsedTime / this.frameDuration);
//}
//
//Animation.prototype.isDone = function () {
//    return (this.elapsedTime >= this.totalTime);
//}

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
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

function Score(game, score, color, x, y) {
	this.color = color;
	this.x = x;
	this.y = y;
	this.ctx = game.ctx;
	this.score = score;
	this.ctx.font = "10px Arial";
	this.ctx.fillStyle = color;
	this.ctx.fillText("SCORE: " + this.score, this.x, this.y);
	Entity.call(this, game, x, y);
}

//Score.prototype = new Entity();
Score.prototype.constructor = Score;
Score.prototype.update = function() {
	this.score += 1;
	this.ctx.fillText("SCORE: " + this.score, this.x, this.y);
	//Entity.prototype.update.call(this);
};
Score.prototype.draw = function() {
	this.ctx.fillText("SCORE: " + this.score, this.x, this.y);
};

//original animation spritesheet, 189, 230, 5, 0.10, 14, true,1
function MushroomDude(game, spritesheet) {
    this.animation = new Animation(spritesheet, 0, 0, 189, 230, 0.10, 14, true);
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
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x + 150, this.y + 100, 0.5);
}

MushroomDude.prototype.update = function () {
    //if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
    //this.x += this.game.clockTick * this.speed;
    //if (this.x > 400) this.x = 0;

    if (this.game.rightButton) {
      this.Right = true;
    } else {
      if (this.x >= right_lane || this.Left) {
        right_change = 0;
        this.Right = false;
      }
    }
    if (this.Right) {
      if (this.x < right_lane && right_change < lane_size) {
        this.x += this.game.clockTick * this.speed;
        right_change += this.game.clockTick * this.speed;
      } else {
        right_change = 0;
        this.Right = false;
      }
    }

    if (this.game.leftButton) {
      this.Left = true;
    } else {
      if (this.x <= left_lane || this.Right) {
        left_change = 0;
        this.Left = false;
      }
    }
    if (this.Left) {
      if (this.x > left_lane && left_change < lane_size) {
        this.x -= this.game.clockTick * this.speed;
        left_change += this.game.clockTick * this.speed;
      } else {
        left_change = 0;
        this.Left = false;
      }
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
	this.animation = new Animation(spritesheet, 0, 520, 142, 163, 810, 1, 1, true);
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
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0.4);//0.4
    Entity.prototype.draw.call(this);
};
//0,0
// inheritance
function Crate(game, spritesheet, lane) {
    this.animation = new Animation(spritesheet, 0, 0, 512, 512, 810, 1, 1, true);
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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0.1);//.1
    Entity.prototype.draw.call(this);
};
//0, 1300
function Oil(game, spritesheet, lane) {
    this.animation = new Animation(spritesheet, 0, 1450, 776, 450, 810, 1, 1, true);
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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0.2);//.2
    Entity.prototype.draw.call(this);
};
//0, 675
function Branch(game, spritesheet, lane) {
    this.animation = new Animation(spritesheet, 0, 675, 800, 600, 810, 1, 1, true);
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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0.1); //0.1
    Entity.prototype.draw.call(this);
};

function Obstacle_Spawner(game, spritesheet) {
	this.obstacles = [];
	this.game = game;
	this.spritesheet = spritesheet;
	this.counter = 0;
};

Obstacle_Spawner.prototype = new Entity();
Obstacle_Spawner.prototype.constructor = Obstacle_Spawner;

Obstacle_Spawner.prototype.update = function () {
	if(this.counter % 250 === 0){
		var type = Math.floor(Math.random() * 100) + 1;
		  type %= 4;
		//  var type = 0;
		  var lane = Math.floor(Math.random() * 10) + 1;
		  lane %= 3;
		//  var lane = 2;
		  switch(type) {
		  case 0: //Spikes
		  	this.obstacles.push(new Spike(this.game, this.spritesheet, lane));
		  	break;
		  case 1: //Crate
		      this.obstacles.push(new Crate(this.game, this.spritesheet, lane));
		      break;
		  case 2: //Oil
		  	this.obstacles.push(new Oil(this.game, this.spritesheet, lane));
		  	break;
		  case 3: //Branch
		  	this.obstacles.push(new Branch(this.game, this.spritesheet, lane));
		  	break;
		  }
	}
	var numObstacle = this.obstacles.length;
	for(i = 0; i < numObstacle; i++) {
		this.obstacles[i].update();
	}
	this.counter++;
};

Obstacle_Spawner.prototype.draw = function () {
	var numObstacle = this.obstacles.length;
	for(i = 0; i < numObstacle; i++) {
		this.obstacles[i].draw();
	}
};

//AM.queueDownload("./img/Crate.png");
//AM.queueDownload("./img/Spikes.png");
AM.queueDownload("./img/bg3.png");
AM.queueDownload("./img/obstacles.png");
//AM.queueDownload("./img/newOil.png");
//AM.queueDownload("./img/branch.png");
AM.queueDownload("./img/mushroomdude.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/bg3.png")));
    gameEngine.addEntity(new Score(gameEngine, gameScore, "#FF0000", 325, 10));
    gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    var type = Math.floor(Math.random() * 100) + 1;
    type %= 4;
//    var type = 0;
    var lane = Math.floor(Math.random() * 10) + 1;
    lane %= 3;
//    var lane = 2;
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
/*    gameEngine.start();
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/bg3.png")));
    gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));*/

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
        gameEngine.addEntity(new Crate(gameEngine, AM.getAsset("./img/Crate.png"), 2));
//        break;
//    case 2: //Oil
    	gameEngine.addEntity(new Oil(gameEngine, AM.getAsset("./img/newOil.png"), 0));
//    	break;
//    case 3: //Branch
//    	gameEngine.addEntity(new Branch(gameEngine, AM.getAsset("./img/branch.png"), lane));
//    	break;
//    }
//    gameEngine.addEntity(new Obstacle_Spawner(gameEngine, AM.getAsset("./img/obstacles.png")))
    
    /*gameEngine.addEntity(new Score(gameEngine, gameScore, "#000000", 390, 10));*/
    /*gameEngine.addEntity(new Score(gameEngine, gameScore, "Red", 390, 10));*/
    gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    gameEngine.addEntity(new Obstacle_Spawner(gameEngine, AM.getAsset("./img/obstacles.png")))
    console.log("All Done!");
});
