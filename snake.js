/* 
	Author : Samyak Jain
	Created on : 20 June 2020
*/
/// Theme class definition, this class stores the color scheme
class Theme {
	constructor(background_color, canvas_color, snake_color, snake_head_color, food_image_src) {
		this.background_color = background_color;
		this.canvas_color = canvas_color;
		this.snake_color = snake_color;
		this.snake_head_color = snake_head_color;
		this.food_image_src = food_image_src;
	}
}

/// Theme objects are initialised 
theme1 = new Theme("#fcf195", "#0bad41c0", "#b30303", "#000000", "media/apple_image3.png");
theme2 = new Theme("#5d77a7", "#000000", "#0b3788", "#ffffff", "media/pear_image.png");

/// Initialisation or init function definintion
function init() {
	// console.log("in init");
	/// Initialising canvas 
	canvas = document.getElementById('mycanvas');
	pen = canvas.getContext('2d');
	canHt = canvas.height = 513;
	canWdt = canvas.width = 1197;
	canHt = canvas.height;
	canWdt = canvas.width;

	/// Initialising theme
	current_theme = theme2;
	pen.fillStyle = current_theme.canvas_color;
	pen.fillRect(0, 0, canWdt, canHt);

	/// Initialising media
	food_image = new Image();
	food_image.src = current_theme.food_image_src;
	keypress_sound = new sound("media/keypress_sound1.mp3");
	keypress_sound2 = new sound("media/keypress_sound2.mp3");
	food_eating_sound = new sound("media/food_eating_sound.mp3");
	level_up_sound = new sound("media/level_up_sound.mp3");
	game_over_sound = new sound("media/game_over_sound.mp3");

	// Initialising game parameters
	celldim = 34.2;
	score = 0;
	level = 1;
	level_interval = 2;
	speed_change = 30;
	speed = 170;
	game_over = false;
	directions_queue = [];
	document.body.style.background = current_theme.background_color;

	/// initialising snake object
	snake = {
		/// initialising properties of the snake
		initLen: 4,			/// initial length of snake
		snake_direction: "right",  /// direction of snake
		color: current_theme.snake_color, /// color of snake
		cells: [],		/// stores the coordinates of all the squares in snake

		/// definition for createSnake method, it fills the snake array in beginning
		createSnake: function () {
			for (var i = this.initLen; i > 0; i--) {
				this.cells.push({ x: i, y: 0 });
			}
		},

		/// this method draws the snake on canvas during each iteration of game loop
		drawSnake: function () {
			// console.log("in drawSake");
			pen.fillStyle = current_theme.snake_head_color;

			/// this loops daraw squares at each of the coordinates whic are stored in the cells array
			for (var i = 0; i < this.cells.length; i++) {
				pen.fillRect((this.cells[i].x * celldim) + 1, (this.cells[i].y * celldim) + 1, celldim - 1, celldim - 1);
				pen.fillStyle = this.color;
			}
		},
		/// this method updates score, level and directions of snake
		updateSnake: function () {
			/// current snake head coordinates
			var current_snake_head_x = this.cells[0].x;
			var current_snake_head_y = this.cells[0].y;
			/// check if food is eaten
			if (food.x === current_snake_head_x && food.y === current_snake_head_y) {
				console.log("food eaten");
				food_eating_sound.play();

				/// make new food and increase score
				food = makeFood();
				score++;

				/// check if level is changed
				if (score % level_interval === 0) {
					level++;
					level_up_sound.play();
					speed = Math.max(speed - speed_change, 40);
					console.log("speed", speed);
					change_theme();
					speedincrease();
				}

				/// level parameters change
				if (score > 2) {
					level_interval = 5;
					speed_change = 20;
				}

			}

			/// if food is not eaten, pop last element so that length doesn't increase 
			else {
				this.cells.pop();
			}

			/// new snake head coordinates
			var new_snake_head_x;
			var new_snake_head_y;

			/// direction change logic is implemented, the new coordinates of the snake head is updated
			if (this.snake_direction === "right") {
				new_snake_head_x = current_snake_head_x + 1;
				new_snake_head_y = current_snake_head_y;
			}
			else if (this.snake_direction === "left") {
				new_snake_head_x = current_snake_head_x - 1;
				new_snake_head_y = current_snake_head_y;
			}
			else if (this.snake_direction === "up") {
				new_snake_head_x = current_snake_head_x;
				new_snake_head_y = current_snake_head_y - 1;
			}
			else if (this.snake_direction === "down") {
				new_snake_head_x = current_snake_head_x;
				new_snake_head_y = current_snake_head_y + 1;
			}

			/// check if snake is not out of boundaries
			var right_bound = Math.round(canWdt / celldim);
			var bottom_bound = Math.round(canHt / celldim);
			if (this.cells[0].x < 0 || this.cells[0].y < 0 || this.cells[0].x >= right_bound || this.cells[0].y >= bottom_bound) {
				game_over = true;
			}

			/// check if snake touches its own body
			if (collision(new_snake_head_x, new_snake_head_y)) {
				console.log("collision");
				game_over = true;
			}

			/// new snake head coordinates are pushed in the cells array
			this.cells.unshift({ x: new_snake_head_x, y: new_snake_head_y });
		}
	}
	/// snake is created for the first time
	snake.createSnake();

	/// food is created for the first time 
	food = makeFood();

	// event listener
	document.addEventListener("keydown", keypress);

}

/// function to change theme
function change_theme() {
	if (current_theme === theme1) {
		current_theme = theme2;
	}
	else if (current_theme === theme2) {
		current_theme = theme1;
	}
	snake.color = current_theme.snake_color;
	food_image.src = current_theme.food_image_src;
	document.body.style.background = current_theme.background_color;
}

/// this function returns if collision has occured
function collision(new_snake_head_x, new_snake_head_y) {
	for (let i = 0; i < snake.cells.length; i++) {
		if (snake.cells[i].x === new_snake_head_x && snake.cells[i].y === new_snake_head_y) {
			return true;
		}
	}
	return false;
}
 
/// sound class definition, used to create audio objects 
class sound {
	constructor(src) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);

		/// method definition
		this.play = function () {
			this.sound.play();
		};
		this.stop = function () {
			this.sound.pause();
		};
	}

	/// both method definitions are valid
	// play = function () {
	// 	this.sound.play();
	// };
	// stop = function () {
	// 	this.sound.pause();
	// };
}

/// updates canvas and calls drawSnake method
function draw() {
	// console.log("in draw");
	/// clear old canvas
	pen.clearRect(0, 0, canWdt, canHt);

	/// fill canvas again with background colour
	pen.fillStyle = current_theme.canvas_color;
	pen.fillRect(0, 0, canWdt, canHt);

	/// call drawSnake method of snake object
	snake.drawSnake();

	/// for square food
	// pen.fillStyle = food.color;
	// pen.fillRect(food.x * celldim, food.y * celldim, celldim, celldim);

	/// for image food
	pen.drawImage(food_image, food.x * celldim, food.y * celldim, celldim, celldim);

	/// display updated score and levels
	var display_score = document.getElementById("score");
	display_score.innerHTML = " Score: " + score;
	var display_difficulty = document.getElementById("level");
	if (score % level_interval == 0 && score != 0) {
		display_difficulty.innerHTML = " Level: " + level;
	}
}

/// this function handles the direction change by looking at directions_queue
function change_direction() {
	// console.log("key pressed", front);
	did_change = false;
	while (directions_queue.length != 0 && did_change === false) {
		var front = directions_queue[0];
		if (front === "right" && snake.snake_direction != "left" && snake.snake_direction != "right") {
			snake.snake_direction = "right";
			did_change = true;
			keypress_sound.play();
		}
		else if (front === "left" && snake.snake_direction != "right" && snake.snake_direction != "left") {
			snake.snake_direction = "left";
			did_change = true;
			keypress_sound.play();
		}
		else if (front === "down" && snake.snake_direction != "up" && snake.snake_direction != "down") {
			snake.snake_direction = "down";
			did_change = true;
			keypress_sound.play();
		}
		else if (front === "up" && snake.snake_direction != "down" && snake.snake_direction != "up") {
			snake.snake_direction = "up";
			did_change = true;
			keypress_sound.play();
		}
		else {
			directions_queue.shift();
		}
	}
	// console.log("direction", snake.snake_direction);
}

/// function to call update method of snake object and change direction function
function update() {
	// console.log("in update");
	change_direction();
	snake.updateSnake();
}

/// function to generate and return random food locations
function makeFood() {

	/// keep generating food until we get a food location that is not on snake's body
	var food_on_snake = true;
	while (food_on_snake === true) {
		food_on_snake = false;
		var food_x = Math.round(Math.random() * (canWdt - celldim) / celldim);
		var food_y = Math.round(Math.random() * (canHt - celldim) / celldim);

		for (let i = 0; i < snake.cells.length; i++) {
			if (snake.cells[i].x === food_x && snake.cells[i].y === food_y) {
				console.log("food on snake");
				food_on_snake = true;
			}
		}
	}

	var food = {
		x: food_x,
		y: food_y,
		color: "red"
	}
	return food;
}

/// game loop 
function gameloop() {

	/// check if game is over
	if (game_over === true) {
		
		/// stop game loop
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

	/// call draw and update functions
	draw();
	update();

	console.log("in gameloop");
}

/// function to control speed of game loop (and hence the snake)
function speedincrease() {
	clearInterval(run);
	run = setInterval(gameloop, speed);
}

/// function that stores possible direction changes in directions_queue
function keypress(evnt) {
	if (has_game_started == true) {
		if (evnt.key === "ArrowRight" || evnt.key === "d") {
			directions_queue.push("right");
		}
		else if (evnt.key === "ArrowLeft" || evnt.key === "a") {
			directions_queue.push("left");
		}
		else if (evnt.key === "ArrowDown" || evnt.key === "s") {
			directions_queue.push("down");
		}
		else if (evnt.key === "ArrowUp" || evnt.key === "w") {
			directions_queue.push("up");
		}
	}
}

/// function to control play and pause functionality
var has_game_started = false;
var run;
function start_game(e) {
	if (game_over === false) {

		/// play
		if ((e.key === "Enter" || e.key === " ") && has_game_started === false) {
			// console.log("in start_game");
			keypress_sound2.play();
			var message = document.getElementById("start_pause");
			has_game_started = true;
			message.innerHTML = "Press Enter or Space To Pause The Game";
			run = setInterval(gameloop, speed);
		}

		/// pause
		else if ((e.key === "Enter" || e.key === " ") && has_game_started === true) {
			// console.log("in start_game");
			keypress_sound2.play();
			var message = document.getElementById("start_pause");
			message.innerHTML = "Press Enter or Space To Un-pause The Game";
			has_game_started = false;
			clearInterval(run);
		}
	}
}

/// calling init function
init();

///calling draw function for the first time
draw();

/// adding event listener which calls start_game function
document.addEventListener("keydown", start_game);



