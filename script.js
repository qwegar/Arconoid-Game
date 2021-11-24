let btnStart = document.querySelector('#start')

let cnv = document.querySelector('#cnv')
let ctx = cnv.getContext('2d')

let w = cnv.width = 600
let h = cnv.height = 450

let game = true, toLeft = true, toRihgt = true, score = 0, start = 'on', win = false

let rowLength = 6
let colLength = 20

let bg = new Image()

let BALL = function (x, y) {
	this.x = x
	this.y = y

	this.color = 'red'
	this.radius = 5
	this.vx = 3
	this.vy = -4
}

let PLATFORMA = function (x, y) {
	this.x = x
	this.y = y

	this.color = 'black'
	this.width = 140
	this.saveWidth = 140
	this.height = 10
	this.vx = 10
}

let BLOCKS = function (width, height, rows, cols) {
	this.width = width
	this.height = height
	this.rows = rows
	this.cols = cols

	this.color = 'orange'
	this.colorArr = ['orange', 'red', 'green', 'blue', 'grey', 'white', 'orangered', 'aqua', 'magenta', 'brown', 'pink', 'yellow']
	this.stroke = 'orangered'
	this.padding = 2
	this.obj
	this.lives = []
}

let ball = new BALL(w / 2, h / 2 + 50)
ball.move = false
let platforma = new PLATFORMA(w / 2, h - 20)
platforma.x -= platforma.width / 2
let blocks = new BLOCKS((w / 20) - 2, 20, rowLength, colLength)
let rowHeight, row, col
let colorCount = 0
let bonus = []
let bonusChangeWidthPlatform = 1

let soundStartGame = new Audio('sound/start_game.mp3')
let soundBrokeBlock = new Audio('sound/bkoke_block.ogg')
let soundTouchPaddle = new Audio('sound/touch_paddle.wav')
let soundBallLost = new Audio('sound/ball_lost.wav')


blocks.obj = []
for (let i = 0; i < blocks.rows; i++) {
	blocks.obj[i] = []
	for (let j = 0; j < blocks.cols; j++) {
		blocks.obj[i][j] = 1
	}
}

btnStart.addEventListener('click', () => {
	if (start == 'on') {
		start = 10
		init()

		soundStartGame.load()
		soundBrokeBlock.load()
		soundTouchPaddle.load()

		btnStart.style.display = 'none'
	} else if (start == 'off') {
		console.log('restart');
		restart()
	}
})
backg(1)

document.addEventListener('keydown', function (e) {
	if (e.keyCode == 32) {
		ball.move = !ball.move
	}
})

cnv.addEventListener('mousemove', function (e) {
	let x = e.offsetX
	platforma.x = x - platforma.width / 2
	if (x < 0) { platforma.x == 0 }
	if (x > w) { platforma.x == w - platforma.width }
})

function init() {
	if (game) {
		ctx.clearRect(0, 0, w, h)
		backg(1)

		if (ball.move == true) {
			ball.x += ball.vx
			ball.y += ball.vy
		}

		let tempScore = 'Score: ' + score

		ctx.font = "15px Verdana";
		ctx.fillStyle = 'lime'
		ctx.fillText(tempScore, 10, h / 2)

		if ((ball.x + ball.radius) + ball.vx > w || (ball.x - ball.radius) + ball.vx < 0) {
			ball.vx = -ball.vx
		}
		if ((ball.y - ball.radius) + ball.vy < 0) {
			ball.vy = -ball.vy
		}
		if ((ball.y + ball.radius) + ball.vy >= h - 20 && (ball.y + ball.radius) + ball.vy < h) {
			if ((ball.x + ball.radius) >= platforma.x && ball.x + ball.radius <= (platforma.x + platforma.width)) {
				ball.vy = -ball.vy
				ball.vx = 10 * (ball.x - (platforma.x + platforma.width / 2)) / platforma.width
				soundTouchPaddle.play()
			} else {
				game = false
			}
		}

		rowHeight = blocks.height + blocks.padding
		row = Math.floor(ball.y / (rowHeight))
		col = Math.floor(ball.x / (blocks.width + blocks.padding))

		if (ball.y < blocks.rows * rowHeight && row >= 0 && col >= 0 && blocks.obj[row][col] == 1) {
			if (blocks.lives[row][col] > 2) {
				blocks.lives[row][col]--
			} else {
				blocks.obj[row][col] = 0
				score++

				if (bonus[row][col] == 1 && bonusChangeWidthPlatform > 0) {
					bonus[row][col] = 0
					platforma.width = platforma.width / 2
					bonusChangeWidthPlatform = 0
					setTimeout(() => {
						platforma.width += platforma.width
						bonusChangeWidthPlatform = 1
					}, 5000)
				}

			}
			ball.vy = -ball.vy
			soundBrokeBlock.play()
			if (score == colLength * rowLength) {
				game = false
				win = true
			} else {
				win = false
			}
		}

		ctx.fillStyle = ball.color
		ctx.beginPath()
		ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true)
		ctx.closePath()
		ctx.fill()

		ctx.fillStyle = platforma.color
		ctx.beginPath()
		ctx.rect(platforma.x, platforma.y, platforma.width, platforma.height)
		ctx.closePath()
		ctx.fill()

		ctx.strokeStyle = blocks.stroke
		for (let i = 0; i < blocks.rows; i++) {
			ctx.fillStyle = blocks.colorArr[i]
			bonus[i] = []
			blocks.lives[i] = []
			for (let j = 0; j < blocks.cols; j++) {
				if (blocks.obj[i][j] == 1) {
					ctx.beginPath()
					ctx.fillRect(j * (blocks.width + blocks.padding), i * (blocks.height + blocks.padding), blocks.width, blocks.height)
					ctx.strokeRect(j * (blocks.width + blocks.padding), i * (blocks.height + blocks.padding), blocks.width, blocks.height)
					ctx.closePath()

					bonus[i][j] = Math.floor(Math.random() * 2)
				}
			}

			for (let k = 0; k < blocks.cols; k++) {
				blocks.lives[i][k] = 2
			}
		}

		window.requestAnimationFrame(init)
	} else if (!win) {
		gameOver()
	} else if (win) {
		gameWin()
	}
}

function gameWin() {
	backg(2)
	let text1 = 'You Win'
	let text2 = 'Score: ' + score

	ctx.beginPath()
	ctx.font = "90px Verdana";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText(text1, w / 2, 160);

	ctx.font = "50px Verdana";
	ctx.textAlign = "center";
	ctx.fillText(text2, w / 2, 260);
	ctx.closePath()

	btnStart.innerHTML = 'Play again?'
	btnStart.style.display = 'block'
	btnStart.style.top = '300px'

	start = 'off'
	soundBallLost.play()
}

function gameOver() {
	let text1 = 'Game Over'
	let text2 = 'Score: ' + score

	ctx.beginPath()
	ctx.font = "90px Verdana";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText(text1, w / 2, 160);

	ctx.font = "50px Verdana";
	ctx.textAlign = "center";
	ctx.fillText(text2, w / 2, 260);
	ctx.closePath()

	btnStart.innerHTML = 'Play again?'
	btnStart.style.display = 'block'
	btnStart.style.top = '300px'

	start = 'off'
	soundBallLost.play()
}

function backg(value) {
	switch (value) {
		case 1:
			bg.src = 'bg.jpg'
			ctx.drawImage(bg, 0, 0, w, h)
			break
		case 2:
			bg.src = 'bg2.png'
			ctx.drawImage(bg, 0, 0, w, h)
			break
		default: 1
			break
	}
}

function restart() {

	BALL.vx = 3
	BALL.vy = -4

	btnStart.style.display = 'none'

	ctx.font = "15px Verdana";
	ctx.textAlign = "left";
	score = 0
	tempScore = 'Score: ' + score
	ctx.fillStyle = 'lime'
	ctx.fillText(tempScore, 10, h / 2)

	game = true, toLeft = true, toRihgt = true, score = 0, start = 0
	ball = new BALL(w / 2, h / 2 + 50)
	platforma = new PLATFORMA(w / 2, h - 20)
	platforma.x -= platforma.width / 2
	blocks = new BLOCKS((w / 20) - 2, 20, 6, 20)
	blocks.obj = []
	for (let i = 0; i < blocks.rows; i++) {
		blocks.obj[i] = []
		for (let j = 0; j < blocks.cols; j++) {
			blocks.obj[i][j] = 1
		}
	}
	ctx.clearRect(0, 0, w, h)
	init()

}