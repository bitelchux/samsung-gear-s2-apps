// Generated from stake.coffee.

var Game, game,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Game = (function(_super) {

  __extends(Game, _super);

  function Game(h, w, ps) {
    var canvas_container;
    Game.__super__.constructor.apply(this, arguments);
    atom.input.bind(atom.key.LEFT_ARROW, 'move_left');
    atom.input.bind(atom.key.RIGHT_ARROW, 'move_right');
    atom.input.bind(atom.key.UP_ARROW, 'move_up');
    atom.input.bind(atom.key.DOWN_ARROW, 'move_down');
    atom.input.bind(atom.key.SPACE, 'toggle_pause');
    this.height = h;
    this.width = w;
    this.pixelsize = ps;
    window.onresize = function(e) {};
    canvas_container = document.getElementById('canvas_container');
    canvas_container.style.width = this.width * this.pixelsize + "px";
    atom.canvas.style.position = "relative";
    atom.canvas.height = this.height * this.pixelsize;
    atom.canvas.width = this.width * this.pixelsize;
    
    // Rotary event
    document.addEventListener("rotarydetent", function(ev) 
	{
	   /* Get the direction value from the event */
	   var direction = ev.detail.direction;
	   
	   if (direction == "CW")
	   {
	      /* Add behavior for clockwise rotation */
	      console.log("clockwise");
	      
	      if (game.dir === "right") {
	    	  game.newdir = "down";
	      } else if (game.dir === "down") {
	    	  game.newdir = "left";
	      } else if (game.dir === "left") {
	    	  game.newdir = "up";
	      } else if (game.dir === "up") {
	    	  game.newdir = "right";
	      }	else {
	    	  game.newdir = "down";
	      } 
	   }
	   else if (direction == "CCW")
	   {
	      /* Add behavior for counter-clockwise rotation */
	      console.log("counter-clockwise");
	      if (game.dir === "right") {
	    	  game.newdir = "up";
	      } else if (game.dir === "down") {
	    	  game.newdir = "right";
	      } else if (game.dir === "left") {
	    	  game.newdir = "down";
	      } else if (game.dir === "up") {
	    	  game.newdir = "left";
	      } else {
	    	  game.newdir = "up";
	      }
	   }
	});
    
    this.startGame();
  }

  Game.prototype.startGame = function() {
    var _ref, _x, _y;
    _x = Math.floor(this.width / 2);
    _y = Math.floor(this.height / 2);
    this.snake = [[_x, _y], [--_x, _y], [--_x, _y], [--_x, _y]];
    this.dir = "";
    this.newdir = "right";
    this.score = 0;
    this.gstarted = true;
    this.gpaused = false;
    this.food = [];
    this.last_dt = 0.00;
    this.delay = 0.15;
    this.noshow = true;
    this.gpaused = true;
    _ref = [this.width * this.pixelsize, this.height * this.pixelsize], this.tx = _ref[0], this.ty = _ref[1];
    this.genFood();
    return this.showIntro();
  };

  Game.prototype.genFood = function() {
    var x, y;
    x = void 0;
    y = void 0;
    while (true) {
      x = Math.floor(Math.random() * (this.width - 1));
      y = Math.floor(Math.random() * (this.height - 1));
      if (!this.testCollision(x, y)) break;
    }
    return this.food = [x, y];
  };

  Game.prototype.drawFood = function() {
    atom.context.beginPath();
    atom.context.arc((this.food[0] * this.pixelsize) + this.pixelsize / 2, (this.food[1] * this.pixelsize) + this.pixelsize / 2, this.pixelsize / 2, 0, Math.PI * 2, false);
    return atom.context.fill();
  };

  Game.prototype.drawSnake = function() {
    var i, l, x, y, _results;
    i = 0;
    l = this.snake.length;
    _results = [];
    while (i < l) {
      x = this.snake[i][0];
      y = this.snake[i][1];
      atom.context.fillRect(x * this.pixelsize, y * this.pixelsize, this.pixelsize, this.pixelsize);
      _results.push(i++);
    }
    return _results;
  };

  Game.prototype.testCollision = function(x, y) {
    var i, l;
    //rounded border collision
    if (Math.sqrt(Math.pow(x - (this.width-1)/2, 2) + Math.pow(y - (this.width-1)/2, 2)) > (this.width / 2)) return true;
    //if (x < 0 || x > this.width - 1) return true;
    //if (y < 0 || y > this.height - 1) return true;
    i = 0;
    l = this.snake.length;
    while (i < l) {
      if (x === this.snake[i][0] && y === this.snake[i][1]) return true;
      i++;
    }
    return false;
  };

  Game.prototype.endGame = function() {
    var mess, x, y, _ref, _ref2;
    this.gstarted = false;
    this.noshow = true;
    atom.context.fillStyle = "#fff";
    atom.context.strokeStyle = '#000';
    _ref = ["Game Over", this.tx / 2, this.ty / 2.4], mess = _ref[0], x = _ref[1], y = _ref[2];
    atom.context.font = "bold 50px monospace";
    atom.context.textAlign = "center";
    atom.context.fillText(mess, x, y);
    atom.context.strokeText(mess, x, y);
    atom.context.font = "bold 45px monospace";
    _ref2 = ["Puntos: " + this.score, this.tx / 2, this.ty / 1.7], mess = _ref2[0], x = _ref2[1], y = _ref2[2];
    atom.context.fillText(mess, x, y);
    return atom.context.strokeText(mess, x, y);
  };

  Game.prototype.togglePause = function() {
    var mess, x, y, _ref;
    if (!this.gpaused) {
      this.noshow = true;
      this.gpaused = true;
      _ref = ["Pausado", this.tx / 2, this.ty / 2], mess = _ref[0], x = _ref[1], y = _ref[2];
      atom.context.fillStyle = "#fff";
      atom.context.font = "bold 38px monospace";
      atom.context.textAlign = "center";
      atom.context.fillText(mess, x, y);
      return atom.context.strokeText(mess, x, y);
    } else {
      this.gpaused = false;
      return this.noshow = false;
    }
  };

  Game.prototype.showIntro = function() {
    atom.context.fillStyle = "#fff";
    atom.context.font = "34px sans-serif";
    atom.context.textAlign = "center";
    atom.context.textAlign = "left";
    atom.context.font = "34px monospace";
    atom.context.fillText("Instrucciones:", 1.8 * this.pixelsize, this.ty / 3);
    atom.context.font = "22px monospace";
    atom.context.fillText("Usa el bisel rotatorio para girar.", 1.8 * this.pixelsize, this.ty / 2.1);
    atom.context.fillText("Haz tap para empezar/pausar.", 1.8 * this.pixelsize, this.ty / 1.8);
    return atom.context.fillText("¡Pulsa para empezar!", 1.8 * this.pixelsize, this.ty / 1.4);
  };

  Game.prototype.update = function(dt) {
    var x, y;
    if (atom.input.pressed('toggle_pause')) {
      if (!this.gstarted) {
        this.eraseCanvas();
        this.startGame();
      } else {
        this.togglePause();
      }
    }
    if (this.last_dt < this.delay) {
      this.last_dt += dt;
      return;
    } else {
      this.last_dt = 0.00;
    }
    if (!this.gstarted || this.gpaused) return;
    x = this.snake[0][0];
    y = this.snake[0][1];
    switch (this.newdir) {
      case "up":
        y--;
        break;
      case "right":
        x++;
        break;
      case "down":
        y++;
        break;
      case "left":
        x--;
    }
    if (this.testCollision(x, y)) {
      this.endGame();
      return;
    }
    this.snake.unshift([x, y]);
    if (x === this.food[0] && y === this.food[1]) {
      this.score++;
      this.genFood();
    } else {
      this.snake.pop();
    }
    return this.dir = this.newdir;
  };

  Game.prototype.eraseCanvas = function() {
    atom.context.fillStyle = "#000";
    atom.context.fillRect(0, 0, this.width * this.pixelsize, this.height * this.pixelsize);
    return atom.context.fillStyle = "#fff";
  };

  Game.prototype.draw = function() {
    if (!this.noshow) {
      this.eraseCanvas();
      this.drawFood();
      return this.drawSnake();
    }
  };

  return Game;

})(atom.Game);

game = new Game(screen.height/24, screen.width/24, 24);

game.run();
