var game = new Phaser.Game(window.innerWidth, window.innerHeight);
game.state.add('main', mainState);
game.state.start('main');