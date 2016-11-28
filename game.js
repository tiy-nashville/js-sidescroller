class Boot extends Phaser.State {
  create() {
    // Set the background color for the game
    this.game.stage.backgroundColor = 0x7a59ab;

    // Scale to show the full screen
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // Start physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Start the "preload" state of the game
    this.state.start('Preload');
  }
}

class Preload extends Phaser.State {
  preload() {
    // Load Assets for the Game
    this.load.tilemap('level', 'tile.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'tiles.png');
    this.load.spritesheet('button', 'button.png');
    this.load.spritesheet('player', 'sprites.png', 200, 300);
    this.load.spritesheet('tiles', 'tiles.png', 64, 64);
  }

  create() {
    // Start the "Game" state of the game
    this.state.start('Game');
  }
}

class Game extends Phaser.State {
  // Create a default Game speed measurement
  static get speed() {
    return 400;
  }

  // Create a default Game gravity measurement
  static get gravity() {
    return 1250;
  }

  // Create a default Game jump measurement
  static get jump() {
    return 600;
  }


  create() {
    // Set starting score
    this.score = 0;

    // Setup game level map the "terrain" and "collectibles"
    this.map = this.game.add.tilemap('level');
    // Set image for game level
    this.map.addTilesetImage('tiles', 'gameTiles');

    // Show the tile/map layers
    this.blockedLayer = this.map.createLayer('blockedLayer');

    // Set phsysics so the player can't "Fall through" the map
    this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');
    this.backgroundLayer = this.map.createLayer('backgroundLayer');

    // Make the game large enough to fit the full game
    this.blockedLayer.resizeWorld();

    // Setup the player
    this.player = this.game.add.sprite(64, 64 * 8, 'player');

    // The player sprite is too big for our map, so let's make it 0.6x the size
    this.player.scale.setTo(0.6, 0.6);


    // Make the player have physics (collisions, momentum, gravity, etc)
    this.game.physics.arcade.enable(this.player);

    // Make the player hit box match the sprite
    this.player.body.setSize(90, 270, 44, 30);

    // Make the player a bit bouncy
    this.player.body.bounce.y = 0.3;

    // Make the player fall with gravity
    this.player.body.gravity.y = Game.gravity;

    // Setup player animations
    this.player.run = this.player.animations.add('run', [0, 1, 2, 3, 4, 5], 20);
    this.player.run = this.player.animations.add('jump', [7], 20);
    this.player.idle = this.player.animations.add('idle', [12, 13], 4);
    // Start the player as "idle"
    this.player.animations.play('idle');

    // Setup keyboard listeners
    this.cursors = this.game.input.keyboard.createCursorKeys();

    // Make a group of sprites together collectibles
    this.collectibles = this.game.add.group();
    // Make the collectibles have hit boxes
    this.collectibles.enableBody = true;

    // Create a collectible sprite for each object in the map
    this.map.objects.collectibles.forEach((collectible) => {
      this.collectibles.create(collectible.x, collectible.y - 64, 'tiles', 50);
    });

    // Show the score to the user
    this.scoreText = this.game.add.text(16, 16, `score: ${this.score}`, { fontSize: '32px', fill: '#000' });
    this.scoreText.fixedToCamera = true;

    // Make the camera follow the player so it's a "sidescroller"
    this.game.camera.follow(this.player);

    // Make a restart button
    this.restartButton = this.game.add.button(16, 16 + 32 + 16, 'button', this.restartGame, this);
    this.restartButton.fixedToCamera = true;
  }

  // Restart the "Game" state to start from the beginning
  restartGame() {
    this.game.state.start('Game');
  }

  update() {
    // Make the user collide with the floor
    const hitFloor = this.game.physics.arcade.collide(this.player, this.blockedLayer);

    // Make the user collide with collectibles, but instead of stoping, call the "this.collect" method
    this.game.physics.arcade.overlap(this.player, this.collectibles, this.collect, null, this);

    // Check Left keyboard: set the x velocity and play the "run" animations
    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -Game.speed * 0.7;
      this.player.animations.play('run');
    // Check Right keyboard: set the x velocity and play the "run" animations
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = Game.speed;
      this.player.animations.play('run');
    // Check Right keyboard: set the x velocity and play the "run" animations
    } else {
      this.player.body.velocity.x = 0;
      this.player.animations.play('idle');
    }

    // Check if the user is moving up or down and play the "jump" animation
    if (this.isFallingOrJumpin()) {
      this.player.animations.play('jump');
    } else {
    // If the user is not moving up or down already, check if Up keyboard: set the y velocity
      if (this.cursors.up.isDown) {
        this.player.body.velocity.y = -Game.jump;
      }
    }

  }

  // Logic for running into collectibles
  collect(player, collectible) {
    // Remove the collectible from the screen
    collectible.kill();

    // Change the player score
    this.score += 10;
    // Change the scoreText display
    this.scoreText.text = `score: ${this.score}`;
  }

  // Logic for checking if the player is moving vertically or not
  isFallingOrJumpin() {
    // Set a variable threshold of what is considered "movement"
    const threshold = 64;

    // Return true/false if the user movement is above or below the threshold
    return this.player.body.velocity.y > threshold || this.player.body.velocity.y < -threshold;
  }
}

// Create a new Phaser Game
const game = new Phaser.Game(960, 960, Phaser.AUTO, '');

// Add the different named game states
game.state.add('Boot', Boot);
game.state.add('Preload', Preload);
game.state.add('Game', Game);

// Start the game on the "Boot" game state
game.state.start('Boot');
