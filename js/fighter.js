const jumping = 'jumping';
const falling = 'falling';
const fall = 'fall';
const highKick = 'high-kick';
const stand = 'stand';
const walking = 'walking';
const walkingBackward = 'walking-backward';
const win = 'win';

const hitted = (type) => {
    setTimeout(() => { //300ms timeout bcs I want to lower the hp when kick animation ends
        for(let i=0; i<10; i++) { //to shrink hp smoothly there is for loop which loops 10 times
            setTimeout(() => {
                if(type === 'kano') player.hp-=.5; //lowering player hp
                if(type === 'subzero') enemy.hp--; //lowering enemy hp
            }, 50*i); //and creates 10 timeout each of these is 50ms later 50,100,150...
        }
    }, 300);
}

class Fighter {
    constructor(x,y,type,direction) {
        this.x = x;
        this.y = y;
        this.positionX = 0;
        this.positionY = 0;
        this.width = 75;
        this.height = 135;

        this.state = stand;
        this.type = type;
        this.bar =  document.querySelector(`.hp__${this.type === 'kano' ? 'player' : 'enemy'}Bar`);
        this.direction = direction;
        this.frame = 0;
        this.drawed = false;

        this.hp = 100;

        this.move = 0;
        this.speedX = 4;

        this.speedY = 10;
        this.fallingSpeed = 0;
        this.gravity = .3;
        this.grounded = true;
        this.jumping = false;
        this.falling = false;
        this.attacked = false;
        this.end = false;

        this.botTimer = 0;
        this.botMoves = [0, -1, -1, 1, 1];
    }

    draw() {
        this.update();
        ctx.fillStyle = 'red';
        //ctx.fillRect(this.x + this.positionX, this.y + this.positionY, this.width, this.height);
        if(images[this.type][this.direction][this.state][this.frame])
            ctx.drawImage(images[this.type][this.direction][this.state][this.frame], this.x + this.positionX, this.y + this.positionY);
        this.bar.style.width = `${this.hp}%`;
    }

    update() {
        if(this.hp === 0) {
            if(this.type === 'kano') {
                player.state = fall;
                enemy.state = win;
            } else {
                player.state = win;
                enemy.state = fall;
            }
        }


        if(this.state === win || this.state === fall) {
            this.move = 0;
            return;
        }

        if(this.type === 'subzero') this.bot();
        if(this.direction === 'left' && this.state === highKick) {
            this.positionX = -35;
        } else {
            this.positionX = 0;
        }

        if(!this.grounded && !this.jumping) this.falling = true;

        if(this.move !== 0) {
            const tempX = this.x + this.move * this.speedX;
            if(tempX > 0 && tempX < WIDTH - this.width) {
                this.x = tempX;
            }
        }

        if(this.jumping) {
            const tempY = this.y - this.speedY;
            if(tempY > 270) {
                this.y = tempY;
            } else {
                this.falling = true;
                this.jumping = false;
            }
        }

        if(this.falling) {
            const tempY = this.y + this.fallingSpeed;
            this.fallingSpeed += this.gravity;

            if(tempY < 430) {
                this.y = tempY;
            } else {
                this.y = 430;
                this.fallingSpeed = 0;
                this.botTimer = 0;
                this.botMove = this.botMoves[Math.floor(Math.random() * 4)];
                this.grounded = true;
                this.falling = false;
                if(this.move === 0) this.state = stand;
                if((this.move === 1 && this.direction === 'left') ||
                (this.move === -1 && this.direction === 'right')) this.state = walkingBackward;
                if((this.move === -1 && this.direction === 'left') ||
                (this.move === 1 && this.direction === 'right')) this.state = walking;
            }
        }

        if(this.state === highKick) {
            this.width = 110;
            if(player.x + player.positionX < enemy.x + enemy.positionX + enemy.width &&
                player.x + player.positionX + player.width > enemy.x + enemy.positionX &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y && !this.attacked) {
                    this.attacked = true;
                    if(this.type === 'kano') hitted('subzero');
                    if(this.type === 'subzero') hitted('kano');
                }
        } else this.width = 75;
    }

    changeFrame() {
        let maxFrame = 0;
        if(this.state === jumping) maxFrame = 5;
        if(this.state === fall) maxFrame = 6;
        if([stand, walking, walkingBackward].includes(this.state)) maxFrame = 8;
        if(this.state === win) maxFrame = 9;
        if(this.state === highKick) maxFrame = 11;

        this.frame++;
        if(this.frame > maxFrame) {
            this.frame = 0;
            if(this.state === win || this.state === fall) {
                this.frame = maxFrame;
                this.end = true;
                return;
            }
            if(this.state === jumping) {
                this.state = falling;
            }
            if(this.state === highKick) {
                if(this.type === 'kano') this.attacked = false;
                if(this.move === 0) this.state = stand;
                if((this.move === 1 && this.direction === 'left') ||
                (this.move === -1 && this.direction === 'right')) this.state = walkingBackward;
                if((this.move === -1 && this.direction === 'left') ||
                (this.move === 1 && this.direction === 'right')) this.state = walking;
            }
        }
    }

    bot() {
        this.botTimer++;
        if(player.x + player.positionX < enemy.x + enemy.positionX + enemy.width &&
            player.x + player.positionX + player.width > enemy.x + enemy.positionX &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y && !this.attacked && Math.random() < 0.1) {
                this.state = highKick;
                this.attacked = true;
                setTimeout(() => {
                    this.attacked = false;
                }, 1000);
                if(this.type === 'kano') hitted('subzero');
                if(this.type === 'subzero') hitted('kano');
            }
        if(this.state === stand && this.botTimer > 20) {
            this.botTimer = 0;
            this.move = this.botMoves[Math.floor(Math.random() * 5)];
            if(this.move === 0) this.state = stand;
            if((this.move === 1 && this.direction === 'left') ||
            (this.move === -1 && this.direction === 'right')) this.state = walkingBackward;
            if((this.move === -1 && this.direction === 'left') ||
            (this.move === 1 && this.direction === 'right')) this.state = walking;
        }
        if([walking, walkingBackward].includes(this.state) && this.botTimer > 30) {
            this.botTimer = 0;
            this.move = this.botMoves[Math.floor(Math.random() * 5)];
            if(this.move === 0) this.state = stand;
            if((this.move === 1 && this.direction === 'left') ||
            (this.move === -1 && this.direction === 'right')) this.state = walkingBackward;
            if((this.move === -1 && this.direction === 'left') ||
            (this.move === 1 && this.direction === 'right')) this.state = walking;
        }
    }
}