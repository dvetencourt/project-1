let moving = '';

let leftPressed = false;
let rightPressed = false;
let jumpPressed = false;
let kickPressed = false;

document.addEventListener('keydown', ({key}) => {
    if(player.state === fall || player.state === win) return;
    switch(key) {
        case 'x':
            alert();
            break;
        case ' ':
            if(notJumpFallKick() && !kickPressed) {
                kickPressed = true;
                player.frame = 0;
                player.state = highKick;
            }
            break;
        case 'ArrowUp':
            if(notJumpFallKick() && !jumpPressed) {
                jumpPressed = true;
                player.state = jumping;
                player.frame = 0;
                player.jumping = true;
                player.grounded = false;
            }
            break;
        case 'ArrowLeft':
            leftPressed = true;
            goLeft();
            break;
        case 'ArrowRight':
            rightPressed = true;
            goRight();
            break;
    }
});

document.addEventListener('keyup', ({key}) => {
    switch(key) {
        case ' ':
            kickPressed = false;
            break;
        case 'ArrowUp':
            jumpPressed = false;
            break;
        case 'ArrowLeft':
            leftPressed = false;
            if(moving !== 'right') {
                player.move = 0;
                if(notJumpFallKick()) player.state = stand;
            }
            if(rightPressed) {
                goRight();
            }
            break;
        case 'ArrowRight':
            rightPressed = false;
            if(moving !== 'left') {
                player.move = 0;
                if(notJumpFallKick()) player.state = stand;
            }
            if(leftPressed) {
                goLeft();
            }
            break;

    }
});

const goLeft = () => {
    moving = 'left';
    if(player.direction === 'right') {
        player.move = -1;
        if(notJumpFallKick()) player.state = walking;
    }
    player.move = -1;
    if(notJumpFallKick()) player.state = walkingBackward;
}

const goRight = () => {
    moving = 'right';
    if(player.direction === 'right') {
        player.move = 1;
        if(notJumpFallKick()) player.state = walkingBackward;
    }
    player.move = 1;
    if(notJumpFallKick()) player.state = walking;
}

const notJumpFallKick = () => ![jumping, falling, highKick].includes(player.state);