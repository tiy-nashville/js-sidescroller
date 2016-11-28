class Boot extends Phaser.State {
  create() {
    // Set the background color for the game

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

  // Create a default Game gravity measurement

  // Create a default Game jump measurement


  create() {
    // Set starting score
    this.score = 0;

    // Setup game level map the "terrain" and "collectibles"
    this.map = this.game.add.tilemap('level');
    // Set image for game level
    this.map.addTilesetImage('tiles', 'gameTiles');

    // Show the tile/map layers
    this.blockedLayer = this.map.createLayer('blockedLayer');
    this.backgroundLayer = this.map.createLayer('backgroundLayer');

    // Set phsysics so the player can't "Fall through" the map
    this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

    // Make the game large enough to fit the full game

    // Setup the player
    this.player = this.game.add.sprite(64, 64 * 8, 'player');

    // The player sprite is too big for our map, so let's make it 0.6x the size
    this.player.scale.setTo(0.6, 0.6);


    // Make the player have physics (collisions, momentum, gravity, etc)
    this.game.physics.arcade.enable(this.player);

    // Make the player hit box match the sprite
    this.player.body.setSize(90, 270, 44, 30);

    // Make the player a bit bouncy

    // Make the player fall with gravity

    // Setup player animations
    this.player.run = this.player.animations.add('run', [0, 1, 2, 3, 4, 5], 20);
    this.player.run = this.player.animations.add('jump', [7], 20);
    this.player.idle = this.player.animations.add('idle', [12, 13], 4);

    // Start the player with the "idle" animation

    // Setup keyboard listeners
    this.cursors = this.game.input.keyboard.createCursorKeys();

    // Make a group of sprites together collectibles
    this.collectibles = this.game.add.group();
    // Make the collectibles have hit boxes

    this.map.objects.collectibles.forEach((collectible) => {
      // Create a collectible sprite for each object in the map (tile 50 is the gem stone)
    });

    // Show the score to the user
    this.scoreText = this.game.add.text(16, 16, `score: ${this.score}`, { fontSize: '32px', fill: '#000' });
    // Make the score text stay put


    // Make the camera follow the player so it's a "sidescroller"

    // Make a restart button
    this.restartButton = this.game.add.button(16, 16 + 32 + 16, 'button', this.restartGame, this);
    // Make the restart button stay put
  }

  // Restart the "Game" state to start from the beginning
  restartGame() {
    this.game.state.start('Game');
  }

  update() {
    // Make the user collide with the floor

    // Make the user collide with collectibles, but instead of stoping, call the "this.collect" method

    // Check Left keyboard: set the x velocity and play the "run" animations

    // Check Right keyboard: set the x velocity and play the "run" animations

    // If no left/right: set the x velocity to 0 and play the "idle" animations

    // Check if the user is moving up or down and play the "jump" animation

    // If the user is not moving up or down already, check if Up keyboard: set the y velocity

  }

  // Logic for running into collectibles
  collect(player, collectible) {
    // Remove the collectible from the screen

    // Change the player score
    this.score = 1;
    // Change the scoreText display
  }

  // Logic for checking if the player is moving vertically or not
  isFallingOrJumpin() {
    // Set a variable threshold of what is considered "movement"
    const threshold = 64;

    // Return true/false if the user movement is above or below the threshold
    return false;
  }
}

// Create a new Phaser Game
const game = new Phaser.Game(960, 960, Phaser.AUTO, '');

// Add the different named game states
game.state.add('Boot', Boot);
game.state.add('Preload', Preload);
game.state.add('Game', Game);

// Start the game on the "Boot" game state
game.state.start('Boot')
