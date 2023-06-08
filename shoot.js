var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

let game = new Phaser.Game(config);
let player;
let alien;
let enter;
let shot;
let xSpeed = 0;
let ySpeed = 0;
let alienXSpeed = 0.5;
let alienYSpeed = 0.5;
const SPEED = 230;
let alienAccel = 4;
let accuracy = 50;
let score = 0;
let scoreText = "";
let timerText = "";
let timer = 0;
let interval;
let gameover = false;

function preload () {
    this.load.image('background', 'assets/background.png');
    this.load.image('crosshair', 'assets/crosshair.png');
    this.load.audio('shot', 'assets/assets_shoot.wav');
    this.load.audio('hitsound', 'assets/assets_hit_sound.wav');
    this.load.audio('backgroundmusic', 'assets/assets_piano.mp3');
    this.load.spritesheet('alien', 'assets/alien.png', {frameWidth: 100, frameHeight: 100});
    this.load.spritesheet('explosion', 'assets/explode.png', {frameWidth: 100, frameHeight: 100})
}

function create() {
    this.add.image(400, 300, 'background');
    scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    timerText = this.add.text(600, 16, 'timer: 0', {fontSize: '32px', fill: '#000'});

    alien = this.physics.add.sprite(200, 150, 'alien');
    alien.setCollideWorldBounds(true);
    player = this.physics.add.sprite(400, 300, 'crosshair');
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    shot = this.sound.add('shot');
    backgroundmusic = this.sound.add('backgroundmusic');
    hitsound = this.sound.add('hitsound');

    this.anims.create({
        key: 'cycle',
        frames: this.anims.generateFrameNumbers('alien', { start: 0, end: 9}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 4}),
        frameRate: 10,
        repeat: 0
    });

    alien.anims.play('cycle', true);
    backgroundmusic.play();

    interval = setInterval(function() {
        timer += 1;
        timerText.setText('timer: ' + timer);
        if (timer>= 61) {
            gameover = true;
            endGame();
        }
    }, 1000);

}

function update()
{
    if(gameover){
        return;
    }

    if (alien.x >= 750){
        alien.x = 749;
        alienXSpeed = alienXSpeed * (-1);
        alien.setVelocityX(alienXSpeed);
    } else {
        alien.x = alien.x + alienXSpeed;
    }

    if (alien.x <= 50){
        alien.x = 51;
        alienXSpeed = alienXSpeed * (-1);
        alien.setVelocityX(alienXSpeed);
    } else {
        alien.x = alien.x + alienXSpeed;
    }

    if (alien.y >= 550){
        alien.y = 549;
        alienYSpeed = alienYSpeed * (-1);
        alien.setVelocityY(alienYSpeed);
    } else {
        alien.y = alien.y + alienYSpeed;
    }

    if (alien.y <= 50){
        alien.y = 51;
        alienYSpeed = alienYSpeed * (-1);
        alien.setVelocityY(alienYSpeed);
    } else {
        alien.y = alien.y + alienYSpeed;
    }

    if (cursors.left.isDown){
        xSpeed = -SPEED;
        player.setVelocityX(xSpeed);
    } 
    if (cursors.right.isDown){
        xSpeed = SPEED;
        player.setVelocityX(xSpeed);
    }
    if (cursors.up.isDown){
        ySpeed = -SPEED;
        player.setVelocityY(ySpeed);
    }
    if (cursors.down.isDown){
        ySpeed = SPEED;
        player.setVelocityY(ySpeed);
    }

    if(!cursors.left.isDown && !cursors.right.isDown) {
        player.setVelocityX(0);
    }
    if(!cursors.up.isDown && !cursors.down.isDown) {
        player.setVelocityY(0);
    }

    if (Phaser.Input.Keyboard.JustDown(enter)) {
        shot.play();
        if(Math.abs(player.x - alien.x) < accuracy && Math.abs(player.y - alien.y) < accuracy) {
            hit();
        } else {
            miss();
        }
    }
}

function hit() {
    hitsound.play();
    score = score + 10;
    scoreText.setText('Score: ' + score);
    alien.on('animationcomplete', function() {
        alien.anims.play('cycle', true);
        resetPlayer();
    });

    alien.anims.play('explode', true);
}

function miss() {
    score = score - 1;
    scoreText.setText('Score: ' + score);
}

function resetPlayer() {
    player.x = 400;
    player.y = 300;
    player.setVelocityX(0);
    player.setVelocityY(0);
    xSpeed = 0;
    ySpeed = 0;
}

function endGame() {
    alien.destroy();
    player.destroy();
    timerText.setText('');
    clearInterval(interval);
}