function changeLedState(NewState: boolean) {
    
    
    
    
    if (NewState === true) {
        // Show the current block
        if (x_position > 0) {
            led.plotBrightness(x_position - 1, y_position, Math.max(block[0][0], tetris[y_position][x_position]))
        }
        
        if (x_position < 5) {
            led.plotBrightness(x_position - 1 + 1, y_position, Math.max(block[0][1], tetris[y_position][x_position + 1]))
        }
        
        if (x_position > 0 && y_position < 4) {
            led.plotBrightness(x_position - 1, y_position + 1, Math.max(block[1][0], tetris[y_position + 1][x_position]))
        }
        
        if (x_position < 5 && y_position < 4) {
            led.plotBrightness(x_position - 1 + 1, y_position + 1, Math.max(block[1][1], tetris[y_position + 1][x_position + 1]))
        }
        
    } else {
        // Hide the current block
        if (x_position > 0) {
            led.plotBrightness(x_position - 1, y_position, tetris[y_position][x_position])
        }
        
        if (x_position < 5) {
            led.plotBrightness(x_position - 1 + 1, y_position, tetris[y_position][x_position + 1])
        }
        
        if (x_position > 0 && y_position < 4) {
            led.plotBrightness(x_position - 1, y_position + 1, tetris[y_position + 1][x_position])
        }
        
        if (x_position < 5 && y_position < 4) {
            led.plotBrightness(x_position - 1 + 1, y_position + 1, tetris[y_position + 1][x_position + 1])
        }
        
    }
    
    
}

//  Apply the rotation to the current block position
// Move the block in the tetris x_position (left and right) and y_position(down)
function moveBlock(x_move: number, y_move: number): boolean {
    
    let move = false
    //  Verify that the movement is possible
    //  No collision with other blocks or borders of the tetris
    if (x_move == -1 && x_position > 0) {
        if (!(tetris[y_position][x_position - 1] > 0 && block[0][0] > 0 || tetris[y_position][x_position + 1 - 1] > 0 && block[0][1] > 0 || tetris[y_position + 1][x_position - 1] > 0 && block[1][0] > 0 || tetris[y_position + 1][x_position + 1 - 1] > 0 && block[1][1] > 0)) {
            move = true
        }
        
    } else if (x_move == 1 && x_position < 5) {
        if (!(tetris[y_position][x_position + 1] > 0 && block[0][0] > 0 || tetris[y_position][x_position + 1 + 1] > 0 && block[0][1] > 0 || tetris[y_position + 1][x_position + 1] > 0 && block[1][0] > 0 || tetris[y_position + 1][x_position + 1 + 1] > 0 && block[1][1] > 0)) {
            move = true
        }
        
    } else if (y_move == 1 && y_position < 4) {
        if (!(tetris[y_position + 1][x_position] > 0 && block[0][0] > 0 || tetris[y_position + 1][x_position + 1] > 0 && block[0][1] > 0 || tetris[y_position + 1 + 1][x_position] > 0 && block[1][0] > 0 || tetris[y_position + 1 + 1][x_position + 1] > 0 && block[1][1] > 0)) {
            move = true
        }
        
    }
    
    //  If the movement is possible you can update the new value of the x_position and y_position of the block
    if (move) {
        changeLedState(false)
        // hideblock()
        x_position += x_move
        y_position += y_move
        changeLedState(true)
    }
    
    //  Return True or False to confirm if the move is possible
    return move
}

function moveblockDown(): boolean {
    let x_move = 0
    let y_move = 1
    return moveBlock(x_move, y_move)
}

//  Check the lines of the tetris if any of them is completed
function checkCompletedLines(): boolean {
    let i: number;
    let j: number;
    
    
    
    
    
    let removeLine = false
    //  check each line one at a time
    for (i = 0; i < 5; i++) {
        //  If a line is completed then the score must be incremented and the line must be removed
        if (tetris[i][1] + tetris[i][2] + tetris[i][3] + tetris[i][4] + tetris[i][5] == on_led_value * 5) {
            removeLine = true
            //  Increment the score
            score += winingScore
            //  Remove the line and make all lines above fall by 1:
            for (j = i; j < 0; j += -1) {
                tetris[j] = tetris[j - 1]
            }
            tetris[0] = [1, 0, 0, 0, 0, 0, 1]
        }
        
    }
    if (removeLine) {
        //  Refresh the LED screen
        for (i = 0; i < 5; i++) {
            for (j = 0; j < 5; j++) {
                led.plotBrightness(i, j, tetris[j][i + 1])
            }
        }
    }
    
    return removeLine
}

function play_music() {
    music.startMelody(music.builtInMelody(Melodies.Dadadadum))
}

function init_game() {
    // Starting Text
    basic.showNumber(3)
    basic.showNumber(2)
    basic.showNumber(1)
    basic.showString("GO")
    //  init sensors events --------------------------------------------
    //  Touch logo sensors event
    input.onLogoEvent(TouchButtonEvent.Pressed, function rotateblock() {
        let block00: number;
        
        
        
        
        // Check if the rotation is possible at least one of the cells of the block is not null
        if (!(tetris[y_position][x_position] > 0 && block[0][0] > 0 || tetris[y_position + 1][x_position] > 0 && block[1][0] > 0 || tetris[y_position][x_position + 1] > 0 && block[0][1] > 0 || tetris[y_position + 1][x_position + 1] > 0 && block[1][1] > 0)) {
            // Hide the block to apply the rotation
            // hideblock()
            changeLedState(false)
            // Aplly the rotation
            block00 = block[0][0]
            block[0][0] = block[1][0]
            block[1][0] = block[1][1]
            block[1][1] = block[0][1]
            block[0][1] = block00
            // showblock()
            changeLedState(true)
        }
        
    })
    //  buttons  event
    input.onButtonPressed(Button.A, function moveblockLeft() {
        let x_move = -1
        let y_move = 0
        moveBlock(x_move, y_move)
    })
    input.onButtonPressed(Button.B, function moveblockRight(): boolean {
        let x_move = 1
        let y_move = 0
        return moveBlock(x_move, y_move)
    })
    // Microphone
    play_music()
    // geroscope
    input.onGesture(Gesture.Shake, function on_gesture_shake() {
        control.reset()
        
    })
}

//  --------------------------------------------
// Programe Starting -------------------------------------------->>>>>>>>>>>>
init_game()
// Max intencity of the led
let on_led_value = 255
// Score added on line completed
let winingScore = 10
//  Create my tetris 6 x_position 7 array with borders defined by value = 1
let tetris = [[1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1]]
//  Create generated game block possibility
let blocks = [[[on_led_value, on_led_value], [on_led_value, 0]], [[on_led_value, on_led_value], [0, on_led_value]], [[on_led_value, on_led_value], [on_led_value, on_led_value]], [[on_led_value, on_led_value], [0, 0]]]
//  Select randomly the block at this
// You must note that x_position position on the tetris array represente the led position + 1
//  (Tetris is 7 x 6 array vs Leds 5 x 5 array)
let block = blocks[randint(0, blocks.length - 1)]
//  Initial position of the first block
let x_position = 2
let y_position = 0
let coutFrame = 0
let gameOn = true
let score = 0
changeLedState(true)
//  Main Program Loop - iterates every 50ms
basic.forever(function on_forever() {
    let coutFrame: number;
    
    
    
    
    
    
    basic.pause(750)
    let moveResult = moveblockDown()
    if (moveResult == false) {
        coutFrame = 0
        //  The move was not possible, the block stays in position
        tetris[y_position][x_position] = Math.max(block[0][0], tetris[y_position][x_position])
        tetris[y_position][x_position + 1] = Math.max(block[0][1], tetris[y_position][x_position + 1])
        tetris[y_position + 1][x_position] = Math.max(block[1][0], tetris[y_position + 1][x_position])
        tetris[y_position + 1][x_position + 1] = Math.max(block[1][1], tetris[y_position + 1][x_position + 1])
        if (checkCompletedLines() == false && y_position == 0) {
            //  The block has reached the top of the tetris - Game Over
            gameOn = false
            // End of Game
            pause(2000)
            game.gameOver()
            basic.showString("Game Over")
            basic.showString("Score: ")
            basic.showString("" + score)
        } else {
            //  select a new block randomly
            x_position = 3
            y_position = 0
            //  random select first block
            block = blocks[randint(0, blocks.length - 1)]
            changeLedState(true)
        }
        
    }
    
})
