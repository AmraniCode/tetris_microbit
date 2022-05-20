def changeLedState (NewState):
    global x_position
    global y_position
    global tetris
    global block
    
    if NewState is True : #Show the current block
        if x_position > 0 :
            led.plot_brightness(x_position - 1, y_position, max(block[0][0], tetris[y_position][x_position]))
        if x_position < 5:
            led.plot_brightness((x_position - 1) + 1, y_position, max(block[0][1], tetris[y_position][x_position + 1]))
        if x_position > 0 and y_position < 4:
            led.plot_brightness(x_position - 1, y_position + 1, max(block[1][0], tetris[y_position + 1][x_position]))
        if x_position < 5 and y_position < 4:
            led.plot_brightness((x_position - 1) + 1, y_position + 1, max(block[1][1], tetris[y_position + 1][x_position + 1]))
    else: #Hide the current block
        if x_position > 0 :
            led.plot_brightness(x_position - 1, y_position, tetris[y_position][x_position])
        if x_position < 5 :
            led.plot_brightness((x_position - 1) + 1, y_position, tetris[y_position][x_position + 1])
        if x_position > 0 and y_position < 4:
            led.plot_brightness(x_position - 1, y_position + 1, tetris[y_position + 1][x_position])
        if x_position < 5 and y_position < 4:
            led.plot_brightness((x_position - 1) + 1, y_position + 1, tetris[y_position + 1][x_position + 1])
    pass

# Apply the rotation to the current block position
def rotateblock():
    global x_position
    global y_position
    global tetris
    global block
    #Check if the rotation is possible at least one of the cells of the block is not null
    if not (
            (tetris[y_position][x_position] > 0 and block[0][0] > 0)
            or (tetris[y_position + 1][x_position] > 0 and block[1][0] > 0)
            or (tetris[y_position][x_position + 1] > 0 and block[0][1] > 0)
            or (tetris[y_position + 1][x_position + 1] > 0 and block[1][1] > 0)
    ):
        #Hide the block to apply the rotation
        #hideblock()
        changeLedState(False)
        #Aplly the rotation
        block00 = block[0][0]
        block[0][0] = block[1][0]
        block[1][0] = block[1][1]
        block[1][1] = block[0][1]
        block[0][1] = block00
        #showblock()
        changeLedState(True)

#Move the block in the tetris x_position (left and right) and y_position(down)
def moveBlock(x_move, y_move):
    global x_position, y_position
    move = False
    # Verify that the movement is possible
    # No collision with other blocks or borders of the tetris
    if x_move == -1 and x_position > 0:
        if not (
                (tetris[y_position][x_position - 1] > 0 and block[0][0] > 0)
                or (tetris[y_position][x_position + 1 - 1] > 0 and block[0][1] > 0)
                or (tetris[y_position + 1][x_position - 1] > 0 and block[1][0] > 0)
                or (tetris[y_position + 1][x_position + 1 - 1] > 0 and block[1][1] > 0)
        ):
            move = True
    elif x_move == 1 and x_position < 5:
        if not ((tetris[y_position][x_position + 1] > 0 and block[0][0] > 0) or (tetris[y_position][x_position + 1 + 1] > 0 and block[0][1] > 0) or (
                tetris[y_position + 1][x_position + 1] > 0 and block[1][0] > 0) or (tetris[y_position + 1][x_position + 1 + 1] > 0 and block[1][1] > 0)):
            move = True
    elif y_move == 1 and y_position < 4:
        if not ((tetris[y_position + 1][x_position] > 0 and block[0][0] > 0) or (tetris[y_position + 1][x_position + 1] > 0 and block[0][1] > 0) or (
                tetris[y_position + 1 + 1][x_position] > 0 and block[1][0] > 0) or (tetris[y_position + 1 + 1][x_position + 1] > 0 and block[1][1] > 0)):
            move = True
    # If the movement is possible you can update the new value of the x_position and y_position of the block

    if move:
        changeLedState(False)
        #hideblock()
        x_position += x_move
        y_position += y_move
        changeLedState(True)

    # Return True or False to confirm if the move is possible
    return move


def moveblockLeft():
    x_move = -1
    y_move = 0
    moveBlock(x_move, y_move)


def moveblockRight():
    x_move = 1
    y_move = 0
    return moveBlock(x_move, y_move)

def moveblockDown():
    x_move = 0
    y_move = 1
    return moveBlock(x_move, y_move)

# Check the lines of the tetris if any of them is completed
def checkCompletedLines():
    global x_position
    global y_position
    global tetris
    global block
    global score
    removeLine = False

    # check each line one at a time
    for i in range(0, 5):
        # If a line is completed then the score must be incremented and the line must be removed
        if (tetris[i][1] + tetris[i][2] + tetris[i][3] + tetris[i][4] + tetris[i][5]) == on_led_value * 5:
            removeLine = True
            # Increment the score
            score += winingScore
            # Remove the line and make all lines above fall by 1:
            for j in range(i, 0, -1):
                tetris[j] = tetris[j - 1]
            tetris[0] = [1, 0, 0, 0, 0, 0, 1]
    if removeLine:
        # Refresh the LED screen
        for i in range(0, 5):
            for j in range(0, 5):
                led.plot_brightness(i, j, tetris[j][i + 1])
    return removeLine

def play_music():
    music.start_melody(music.built_in_melody(Melodies.DADADADUM))

def on_gesture_shake():
    control.reset()
    pass


def init_game():
    #Starting Text
    basic.show_number(3)
    basic.show_number(2)
    basic.show_number(1)
    basic.show_string("GO")

    # init sensors events --------------------------------------------

    # Touch logo sensors event
    input.on_logo_event(TouchButtonEvent.PRESSED, rotateblock)

    # buttons  event
    input.on_button_pressed(Button.A, moveblockLeft)
    input.on_button_pressed(Button.B, moveblockRight)
    
    #Microphone
    play_music()
    
    #geroscope
    input.on_gesture(Gesture.SHAKE, on_gesture_shake)
    # --------------------------------------------



#Programe Starting -------------------------------------------->>>>>>>>>>>>
init_game()
#Max intencity of the led
on_led_value = 255
#Score added on line completed
winingScore = 10
# Create my tetris 6 x_position 7 array with borders defined by value = 1
tetris = [[1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1]]

# Create generated game block possibility
blocks = [[on_led_value, on_led_value], [on_led_value, 0]], [[on_led_value, on_led_value], [0, on_led_value]], [
    [on_led_value, on_led_value], [on_led_value, on_led_value]], [[on_led_value, on_led_value], [0, 0]]

# Select randomly the block at this
#You must note that x_position position on the tetris array represente the led position + 1
# (Tetris is 7 x 6 array vs Leds 5 x 5 array)
block = blocks[randint(0, blocks.length - 1)]

# Initial position of the first block
x_position = 2
y_position = 0
coutFrame = 0


gameOn = True
score = 0
changeLedState(True)

# Main Program Loop - iterates every 50ms
def on_forever():
    global gameOn
    global x_position
    global y_position
    global tetris
    global block
    global blocks

    basic.pause(750)

    moveResult = moveblockDown() 
    if moveResult == False:
        coutFrame = 0
        # The move was not possible, the block stays in position
        tetris[y_position][x_position] = max(block[0][0], tetris[y_position][x_position])
        tetris[y_position][x_position + 1] = max(block[0][1], tetris[y_position][x_position + 1])
        tetris[y_position + 1][x_position] = max(block[1][0], tetris[y_position + 1][x_position])
        tetris[y_position + 1][x_position + 1] = max(block[1][1], tetris[y_position + 1][x_position + 1])

        if checkCompletedLines() == False and y_position == 0:
            # The block has reached the top of the tetris - Game Over
            gameOn = False
            #End of Game
            pause(2000)
            game.game_over()
            basic.show_string("Game Over")
            basic.show_string("Score: ")
            basic.show_string(str(score))
        else:
            # select a new block randomly
            x_position = 3
            y_position = 0
            # random select first block
            block = blocks[randint(0, blocks.length - 1)]
            changeLedState(True)

basic.forever(on_forever)


    
