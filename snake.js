document.addEventListener('DOMContentLoaded', () => {
    const GAME_SPEED = 80
    const CANVAS_BORDER_COLOR = '#F5F5F5' //'#212121'
    const CANVAS_BACKGROUND_COLOR = '#F5F5F5'
    const SNAKE_COLOR = '#B39DDB'
    const SNAKE_BORDER_COLOR = '#7E57C2'
    const FOOD_COLOR = '#FFC107'
    const FOOD_BORDER_COLOR = '#FFA000'

    // Get canvas element 
    let canvas = document.getElementById('canvas')

    // Return two dimensional drawing context 
    let ctx = canvas.getContext('2d')

    // Set up the game board 
    ctx.fillStyle = CANVAS_BACKGROUND_COLOR
    ctx.strokeStyle = CANVAS_BORDER_COLOR
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    // Set up horizontal snake 
    let snake = [
        { x: 150, y: 150 },
        { x: 140, y: 150 },
        { x: 130, y: 150 },
        { x: 120, y: 150 },
        { x: 110, y: 150 }
    ]

    // Horizontal velocity 
    let dx = 10
    // Vertical velocity 
    let dy = 0
    // Food coordinate X 
    let foodX
    // Food coordinate Y 
    let foodY
    // Default 
    let changingDirection = false

    // Start game 
    main()
    // Create first food location 
    createFood()
    // Listen for key events 
    document.addEventListener('keydown', changeDirection)

    // Draw snake part 
    function drawSnakePart(snakePart) {
        ctx.fillStyle = SNAKE_COLOR
        ctx.strokeStyle = SNAKE_BORDER_COLOR
        ctx.fillRect(snakePart.x, snakePart.y, 10, 10)
        ctx.strokeRect(snakePart.x, snakePart.y, 10, 10)
    }

    // Change snake's direction 
    function changeDirection(event) {
        const LEFT_KEY = 37
        const RIGHT_KEY = 39
        const UP_KEY = 38
        const DOWN_KEY = 40
        const keyPressed = event.keyCode
        const goingUp = dy === -10
        const goingDown = dy === 10
        const goingRight = dx === 10
        const goingLeft = dx === -10


        if (!changingDirection) {
            changingDirection = true

            /**
             * Check that snake isn't going in the opposite direction 
             * Prevents snake from reversing and crashing into itself 
             */
            if (keyPressed === LEFT_KEY && !goingRight) {
                dx = -10
                dy = 0
            }
            if (keyPressed === UP_KEY && !goingDown) {
                dx = 0
                dy = -10
            }
            if (keyPressed === RIGHT_KEY && !goingLeft) {
                dx = 10
                dy = 0
            }
            if (keyPressed === DOWN_KEY && !goingUp) {
                dx = 0
                dy = 10
            }
        }

    }

    // Return random ten 
    function randomTen(min, max) {
        return Math.round((Math.random() * (max - min) + min) / 10) * 10
    }

    // Generate food in a random coordinate 
    function createFood() {
        foodX = randomTen(0, canvas.width - 10)
        foodY = randomTen(0, canvas.height - 10)
        // Make sure food is not where snake currently is 
        // If so, generate new food location 
        snake.forEach(function (part) {
            if (part.x === foodX && part.y === foodY) {
                createFood()
            }
        })
    }

    // Draw snake on canvas 
    function drawSnake() {
        snake.forEach(drawSnakePart)
    }

    // Move snake by dx and dy 
    function updateSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy }
        snake.unshift(head)

        const didEatFood = snake[0].x === foodX && snake[0].y == foodY
        if (didEatFood) {
            createFood()
        } else {
            snake.pop()
        }
    }

    // Draw food on canvas 
    function drawFood() {
        ctx.fillStyle = FOOD_COLOR
        ctx.strokeStyle = FOOD_BORDER_COLOR
        ctx.fillRect(foodX, foodY, 10, 10)
        ctx.strokeRect(foodX, foodY, 10, 10)
    }

    // Set up the board 
    function clearCanvas() {
        ctx.fillStyle = CANVAS_BACKGROUND_COLOR
        ctx.strokeStyle = CANVAS_BORDER_COLOR
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.strokeRect(0, 0, canvas.width, canvas.height)
    }

    // Check collision 
    function gameEnd() {
        // Collision with itself 
        for (let i = 4; i < snake.length; i++) {
            const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y
            if (didCollide) {
                return true
            }
        }

        // Collision with walls 
        const hitLeftWall = snake[0].x < 0
        const hitRightWall = snake[0].x > canvas.width - 10
        const hitTopWall = snake[0].y < 0
        const hitBottomWall = snake[0].y > canvas.height - 10
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
    }

    // Reset variables 
    function reset() {
        dx = 10
        dy = 0
        snake = [
            { x: 150, y: 150 },
            { x: 140, y: 150 },
            { x: 130, y: 150 },
            { x: 120, y: 150 },
            { x: 110, y: 150 }
        ]
    }

    // Every 100ms, reset board, move snake, draw snake, then call itself 
    function main() {
        if (gameEnd()) {
            /**
             * Create a restart button that resets the game 
             * Delete button once it's click 
             */
            let div = document.getElementById('button-container')
            let button = document.createElement('button')
            let text = document.createTextNode('Restart')
            button.appendChild(text)
            div.appendChild(button)
            button.addEventListener('click', function () {
                let div = document.getElementById('button-container')
                let button = document.querySelector('button')
                div.removeChild(button)

                clearCanvas()
                reset()
                createFood()
                updateSnake()
                drawSnake()
                main()
            })
            return
        }

        setTimeout(function tick() {
            changingDirection = false
            clearCanvas()
            drawFood()
            updateSnake()
            drawSnake()
            main()
        }, GAME_SPEED)
    }

})




