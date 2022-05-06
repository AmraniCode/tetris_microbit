// Lighted  led intensiti value
let on_led_value = 255
//  Create tetris grid
let grid = [[1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1]]
//  Store a list of 4 bricks, each brick is a 2x2 grid
let bricks = [[[on_led_value, on_led_value], [on_led_value, 0]], [[on_led_value, on_led_value], [0, on_led_value]], [[on_led_value, on_led_value], [on_led_value, on_led_value]], [[on_led_value, on_led_value], [0, 0]]]
//  random select first brick
let brick = bricks[randint(0, bricks.length)]
let x = 3
let y = 0
let frameCount = 0
//  A function to return the maximum of two values
function max(a: number, b: number): number {
    if (a >= b) {
        return a
    } else {
        return b
    }
    
}

//  A function to hide the 2x2 brick on the LED screen
function hideBrick() {
    if (x > 0) {
        led.plotBrightness(x - 1, y, grid[y][x])
    }
    
    if (x < 5) {
        led.plotBrightness(x + 1 - 1, y, grid[y][x + 1])
    }
    
    if (x > 0 && y < 4) {
        led.plotBrightness(x - 1, y + 1, grid[y + 1][x])
    }
    
    if (x < 5 && y < 4) {
        led.plotBrightness(x + 1 - 1, y + 1, grid[y + 1][x + 1])
    }
    
}

//  A function to show the 2x2 brick on the LED screen
function showBrick() {
    if (x > 0) {
        led.plotBrightness(x - 1, y, max(brick[0][0], grid[y][x]))
    }
    
    if (x < 5) {
        led.plotBrightness(x + 1 - 1, y, max(brick[0][1], grid[y][x + 1]))
    }
    
    if (x > 0 && y < 4) {
        led.plotBrightness(x - 1, y + 1, max(brick[1][0], grid[y + 1][x]))
    }
    
    if (x < 5 && y < 4) {
        led.plotBrightness(x + 1 - 1, y + 1, max(brick[1][1], grid[y + 1][x + 1]))
    }
    
}

//  A function to rotate the 2x2 brick
function rotateBrick() {
    let pixel00 = brick[0][0]
    let pixel01 = brick[0][1]
    let pixel10 = brick[1][0]
    let pixel11 = brick[1][1]
    //  Check if the rotation is possible
    if (!(grid[y][x] > 0 && pixel00 > 0 || grid[y + 1][x] > 0 && pixel10 > 0 || grid[y][x + 1] > 0 && pixel01 > 0 || grid[y + 1][x + 1] > 0 && pixel11 > 0)) {
        hideBrick()
        brick[0][0] = pixel10
        brick[1][0] = pixel11
        brick[1][1] = pixel01
        brick[0][1] = pixel00
        showBrick()
    }
    
}

//  A function to move/translate the brick
function moveBrick(delta_x: number, delta_y: number): boolean {
    
    let move = false
    //  Check if the move if possible: no collision with other blocks or borders of the grid
    if (delta_x == -1 && x > 0) {
        if (!(grid[y][x - 1] > 0 && brick[0][0] > 0 || grid[y][x + 1 - 1] > 0 && brick[0][1] > 0 || grid[y + 1][x - 1] > 0 && brick[1][0] > 0 || grid[y + 1][x + 1 - 1] > 0 && brick[1][1] > 0)) {
            move = true
        }
        
    } else if (delta_x == 1 && x < 5) {
        if (!(grid[y][x + 1] > 0 && brick[0][0] > 0 || grid[y][x + 1 + 1] > 0 && brick[0][1] > 0 || grid[y + 1][x + 1] > 0 && brick[1][0] > 0 || grid[y + 1][x + 1 + 1] > 0 && brick[1][1] > 0)) {
            move = true
        }
        
    } else if (delta_y == 1 && y < 4) {
        if (!(grid[y + 1][x] > 0 && brick[0][0] > 0 || grid[y + 1][x + 1] > 0 && brick[0][1] > 0 || grid[y + 1 + 1][x] > 0 && brick[1][0] > 0 || grid[y + 1 + 1][x + 1] > 0 && brick[1][1] > 0)) {
            move = true
        }
        
    }
    
    //  If the move is possible, update x,y coordinates of the brick
    if (move) {
        hideBrick()
        x += delta_x
        y += delta_y
        showBrick()
    }
    
    //  Return True or False to confirm if the move took place
    return move
}

//  A function to check for and remove completed lines
function checkLines(): boolean {
    let i: number;
    let j: number;
    
    let removeLine = false
    //  check each line one at a time
    for (i = 0; i < 5; i++) {
        if (grid[i][1] + grid[i][2] + grid[i][3] + grid[i][4] + grid[i][5] == on_led_value * 5) {
            removeLine = true
            //  Increment the score (10 pts per line)
            score += 10
            //  Remove the line and make all lines above fall by 1:
            for (j = i; j < 0; j += -1) {
                grid[j] = grid[j - 1]
            }
            grid[0] = [1, 0, 0, 0, 0, 0, 1]
        }
        
    }
    if (removeLine) {
        //  Refresh the LED screen
        for (i = 0; i < 5; i++) {
            for (j = 0; j < 5; j++) {
                led.plotBrightness(i, j, grid[j][i + 1])
            }
        }
    }
    
    return removeLine
}

let gameOn = true
let score = 0
showBrick()
//  Main Program Loop - iterates every 50ms
while (gameOn) {
    basic.pause(50)
    frameCount += 1
    //  Capture user inputs
    if (input.buttonIsPressed(Button.A) && input.buttonIsPressed(Button.B)) {
        rotateBrick()
    } else if (input.buttonIsPressed(Button.A)) {
        moveBrick(-1, 0)
    } else if (input.buttonIsPressed(Button.B)) {
        moveBrick(1, 0)
    }
    
    //  Every 15 frames try to move the brick down
    if (frameCount == 15 && moveBrick(0, 1) == false) {
        frameCount = 0
        //  The move was not possible, the brick stays in position
        grid[y][x] = max(brick[0][0], grid[y][x])
        grid[y][x + 1] = max(brick[0][1], grid[y][x + 1])
        grid[y + 1][x] = max(brick[1][0], grid[y + 1][x])
        grid[y + 1][x + 1] = max(brick[1][1], grid[y + 1][x + 1])
        if (checkLines() == false && y == 0) {
            //  The brick has reached the top of the grid - Game Over
            gameOn = false
        } else {
            //  select a new brick randomly
            x = 3
            y = 0
            brick = bricks[randint(0, bricks.length)]
            showBrick()
        }
        
    }
    
    if (frameCount == 15) {
        frameCount = 0
    }
    
}
//  End of Game
pause(2000)
// game.game_over()
basic.showString("Game Over: Score: " + ("" + score))
