

function init() {
	console.log("in init");
	canvas = document.getElementById('mycanvas');
	canHt = canvas.height = 600;
	canWdt = canvas.width = 600;
	celldim = 65;
	pen = canvas.getContext('2d');

	gameOver = false;
	snake = {
		initLen: 4,
		snakedir: "right",
		color: "#115c2d",
		cells: [],

		createSnake: function () {
			for (var i = this.initLen; i > 0; i--) {
				this.cells.push({ x: i, y: 0 });
			}
		},

		drawSnake: function () {
			// console.log("in drawSake");
			pen.fillStyle = "#000c01";
			for (var i = 0; i < this.cells.length; i++) {
				// console.log("in loop");
				pen.fillRect((this.cells[i].x * celldim) + 1, (this.cells[i].y * celldim) + 1, celldim - 2, celldim - 2);
				pen.fillStyle = this.color;
			}
		},

		updateSnake: function () {
			this.cells.pop();
			var xhead = this.cells[0].x;
			var yhead = this.cells[0].y;
			var xnext = xhead + 1;
			var ynext = yhead;

			this.cells.unshift({ x: xnext, y: ynext });
		}
	}
	snake.createSnake();
	function keypress(e){
		console.log("key pressed",e.key);
	}
	document.addEventListener("keydown", keypress);
}

function draw() {
	// console.log("in draw");
	pen.clearRect(0, 0, canWdt, canHt);
	snake.drawSnake();

}

function update() {
	// console.log("in update");
	snake.updateSnake();
}

function gameloop() {
	if (gameOver === true) {
		clearInterval(run);
	}
	draw();
	update();
	// console.log("in gameloop");
}

init();
var run = setInterval(gameloop, 100);
