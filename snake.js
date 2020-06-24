class Theme {
	constructor(background_color, canvas_color, snake_color, snake_head_color) {
		this.background_color = background_color;
		this.canvas_color = canvas_color;
		this.snake_color = snake_color;
		this.snake_head_color = snake_head_color;
	}
}
theme1 = new Theme("#fcf195", "#0bad41c0", "#b30303", "#000000");
theme2 = new Theme("#5d77a7", "#000000", "#0b3788", "#ffffff");

function init() {
	// console.log("in init");
	canvas = document.getElementById('mycanvas');
	pen = canvas.getContext('2d');
	canHt = canvas.height = 570;
	canWdt = canvas.width = 1330;
	canHt = canvas.height;
	canWdt = canvas.width;
	current_theme= theme2;
	pen.fillStyle = current_theme.canvas_color;
	pen.fillRect(0,0,canWdt,canHt); 	
	celldim = 38;
	food_image = new Image();
	food_image.src = "apple.png";
	keypress_sound = new sound("keypress_sound1.mp3");
	keypress_sound2 = new sound("keypress_sound2.mp3");
	food_eating_sound = new sound("food_eating_sound.mp3");
	level_up_sound = new sound("level_up_sound.mp3");
	game_over_sound = new sound("game_over_sound.mp3");

	food = makeFood();
	score = 0;
	difficulty = 1;
	d_interval = 2;
	speed_change = 30;
	speed = 180;
	
	// canvas.background-color = current_theme.canvas_color;
	
	document.body.style.background = current_theme.background_color;
	
	gameOver = false;
	snake = {
		initLen: 4,
		snakedir: "right",
		color: current_theme.snake_color,
		// color: "#0b3788",
		cells: [],

		createSnake: function () {
			for (var i = this.initLen; i > 0; i--) {
				this.cells.push({ x: i, y: 0 });
			}
		},

		drawSnake: function () {
			// console.log("in drawSake");
			pen.fillStyle = current_theme.snake_head_color;
			// pen.fillStyle = "#ffffff";
			for (var i = 0; i < this.cells.length; i++) {
				// console.log("in loop");
				pen.fillRect((this.cells[i].x * celldim) + 1, (this.cells[i].y * celldim) + 1, celldim - 1, celldim - 1);
				pen.fillStyle = this.color;
			}
		},

		updateSnake: function () {

			var xhead = this.cells[0].x;
			var yhead = this.cells[0].y;
			//check if food is eaten
			if (food.x === xhead && food.y === yhead) {
				console.log("food eaten");
				food_eating_sound.play();
				food = makeFood();
				score++;
				if (score % d_interval === 0) {
					difficulty++;
					level_up_sound.play();
					speed = Math.max(speed - speed_change, 40);
					console.log(speed);
					// speed = Math.max((200 + d_interval) - (difficulty * d_interval), 40);
					change_theme();
					speedincrease();
				}
				if (score > 2) {
					d_interval = 5;
					speed_change = 20;
				}
				// if(score>10){
				// 	d_interval=5;
				// }
			}
			else {
				this.cells.pop();
			}
			var xnext;
			var ynext;
			if (this.snakedir === "right") {
				xnext = xhead + 1;
				ynext = yhead;
			}
			else if (this.snakedir === "left") {
				xnext = xhead - 1;
				ynext = yhead;
			}
			else if (this.snakedir === "up") {
				xnext = xhead;
				ynext = yhead - 1;
			}
			else if (this.snakedir === "down") {
				xnext = xhead;
				ynext = yhead + 1;
			}
			//check if snake is not out of boundaries
			var right_bound = Math.round(canWdt / celldim);
			var bottom_bound = Math.round(canHt / celldim);
			if (this.cells[0].x < 0 || this.cells[0].y < 0 || this.cells[0].x >= right_bound || this.cells[0].y >= bottom_bound) {
				gameOver = true;
			}


			this.cells.unshift({ x: xnext, y: ynext });
		}
	}
	snake.createSnake();
	function keypress(evnt) {
		// console.log("key pressed", evnt.key);
		if (has_game_started == true) {

			if ((evnt.key === "ArrowRight" || evnt.key === "d") && snake.snakedir != "left" && snake.snakedir != "right") {
				snake.snakedir = "right";
				keypress_sound.play();
			}
			else if ((evnt.key === "ArrowLeft" || evnt.key === "a") && snake.snakedir != "right" && snake.snakedir != "left") {
				snake.snakedir = "left";
				keypress_sound.play();
			}
			else if ((evnt.key === "ArrowDown" || evnt.key === "s") && snake.snakedir != "up" && snake.snakedir != "down") {
				snake.snakedir = "down";
				keypress_sound.play();
			}
			else if ((evnt.key === "ArrowUp" || evnt.key === "w") && snake.snakedir != "down" && snake.snakedir != "up") {
				snake.snakedir = "up";
				keypress_sound.play();
			}
		}

		// console.log("direction", snake.snakedir);
	}
	document.addEventListener("keydown", keypress);
}
function change_theme() {
	if (current_theme===theme1){
		current_theme=theme2;
	}
	else if(current_theme===theme2){
		current_theme=theme1;
	}
	snake.color=current_theme.snake_color;
	document.body.style.background = current_theme.background_color;
}
function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function () {
		this.sound.play();
	}
	this.stop = function () {
		this.sound.pause();
	}
}

function draw() {
	// console.log("in draw");
	pen.clearRect(0, 0, canWdt, canHt);
	pen.fillStyle = current_theme.canvas_color;
	pen.fillRect(0,0,canWdt,canHt); 
	snake.drawSnake();
	// pen.fillStyle = food.color;
	// pen.fillRect(food.x * celldim, food.y * celldim, celldim, celldim);
	pen.drawImage(food_image, food.x * celldim, food.y * celldim, celldim, celldim);
	var display_score = document.getElementById("score");
	display_score.innerHTML = " Score: " + score;
	var display_difficulty = document.getElementById("difficulty");
	if (score % d_interval == 0 && score != 0) {

		display_difficulty.innerHTML = " Level: " + difficulty;
	}
}

function update() {
	// console.log("in update");
	snake.updateSnake();
}
function makeFood() {
	var food_x = Math.round(Math.random() * (canWdt - celldim) / celldim);
	var food_y = Math.round(Math.random() * (canHt - celldim) / celldim);
	var food = {
		x: food_x,
		y: food_y,
		color: "red"
	}
	return food;
}

function gameloop() {
	if (gameOver === true) {
		clearInterval(run);

		keypress_sound.stop();
		keypress_sound2.stop();
		level_up_sound.stop();

		game_over_sound.play();

		keypress_sound.stop();
		keypress_sound2.stop();
		level_up_sound.stop();

		var message = document.getElementById("start_pause");
		message.innerHTML = "Game Over!! Press Ctrl+R to restart the game";
		setTimeout(function () {
			alert("Game Over!! Press Ctrl+R to restart the game");
		}, 500)
	}
	draw();
	update();

	console.log("in gameloop");
}
function speedincrease() {
	clearInterval(run);
	run = setInterval(gameloop, speed);
}
var has_game_started = false;
var run;
function startgame(e) {
	if (gameOver === false) {
		if ((e.key === "Enter" || e.key === " ") && has_game_started === false) {
			// console.log("in startgame");
			keypress_sound2.play();
			var message = document.getElementById("start_pause");
			has_game_started = true;
			message.innerHTML = "Press Enter or Space To Pause The Game";
			run = setInterval(gameloop, speed);
		}
		else if ((e.key === "Enter" || e.key === " ") && has_game_started === true) {
			// console.log("in startgame");
			keypress_sound2.play();
			var message = document.getElementById("start_pause");
			message.innerHTML = "Press Enter or Space To Un-pause The Game";
			has_game_started = false;
			clearInterval(run);
		}
	}
}
init();
draw();
document.addEventListener("keydown", startgame);



