'use strict';

var mainState = {

    preload: function() {

        this.diamonds = 0;
        this.scoreText = '';

        this.level = 1;
        this.MAX_LEVELS = 2;

        this.left = false;
        this.right = false;
        this.jump = false;

        /* load tilemap */
        game.load.tilemap('map', 'assets/maps/level' + this.level + '.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset', 'assets/maps/tileset.png');

        /* load sprites */
        game.load.spritesheet('player', 'assets/images/dude.png', 32, 48);
        game.load.image('coin', 'assets/images/diamond.png');
        game.load.image('stars', 'assets/images/background.png');

        /* load audio */
        game.load.audio('coin_', 'assets/audio/coin.mp3');
        game.load.audio('jump', 'assets/audio/jump.mp3');
        game.load.audio('music', 'assets/audio/bodenstaendig.mp3');

        /* gamepad buttons */
        if(!game.device.desktop)
        {
            game.load.spritesheet('button', 'assets/images/button.png', 96, 96);
        }
    },

    create: function() {

    	//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        //game.scale.refresh();

        //if (!game.device.desktop) { game.input.onDown.add(this.gofull, this); }

        /////////////////////////////////////////////////////////////////////////////////
        // set the main background for the game                                        //
        /////////////////////////////////////////////////////////////////////////////////
        
        game.stage.backgroundColor = '#097FA6';
        //game.add.sprite(0, 0, 'stars');
    	
        //this.bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'stars');
    	
        /* set it to be fixed */
        //this.bg.fixedToCamera = true;

    	/////////////////////////////////////////////////////////////////////////////////
        // set the game physics                                                        //
        /////////////////////////////////////////////////////////////////////////////////

        /* start the Arcade Physics system */
        game.physics.startSystem(Phaser.Physics.ARCADE);

    	game.world.enableBody = true;

    	/////////////////////////////////////////////////////////////////////////////////
        // add the before loaded tilemap to the game                                   //
        /////////////////////////////////////////////////////////////////////////////////

        var map = game.add.tilemap('map');
    	
        /* add tileset image */
        map.addTilesetImage('tileset');
    	
        /* set what tiles can collide */
        map.setCollision(1);
        map.setCollision(5);
        map.setCollision(7);

        /* create the Tile Layer */
        this.layer = map.createLayer('Tile Layer 1');
        
        /* change the world size to match the size of this layer */
        this.layer.resizeWorld();

        /////////////////////////////////////////////////////////////////////////////////
        // create a collection of the coins                                            //
        /////////////////////////////////////////////////////////////////////////////////

        /* create an empty group */
        this.coins = game.add.group();
        
        /* enable physics for any object that is created in this group */
        this.coins.enableBody = true;

        map.createFromObjects('Object Layer 1', 51, 'coin', 0, true, false, this.coins);

        /* set properties for every coin */
        this.coins.forEach(function(coin) {
            
            /* disable physics */
            coin.body.allowGravity = false;
            coin.body.immovable = true;
            
            /* add some tween */
            coin.anchor.setTo(0.5, 0.5);
            coin.x += coin.width / 2;
            //coin.y -= coin.width / 2;
            var t = game.add.tween(coin).to({y:"-5"}, 400).to({y:"+5"}, 400);
            t.loop(true).start();

        },this);

        /////////////////////////////////////////////////////////////////////////////////
        // set callback for all tiles with GID 3 (our lava)                            //
        /////////////////////////////////////////////////////////////////////////////////

        //map.setTileIndexCallback(3, this.hitLava, this);

        /////////////////////////////////////////////////////////////////////////////////
        // set callback for tile with GID 6 (next level)                               //
        /////////////////////////////////////////////////////////////////////////////////

        //map.setTileIndexCallback(6, this.nextLevel, this);

    	/////////////////////////////////////////////////////////////////////////////////
        // add the main hero                                                           //
        /////////////////////////////////////////////////////////////////////////////////

        this.player = game.add.sprite(48, 528, 'player');
    	
        /* default frame */
        this.player.frame = 4;

        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        /* set the camera to follow the player */
        game.camera.follow(this.player);

        /////////////////////////////////////////////////////////////////////////////////
        // set some physics on the sprite                                              //
        /////////////////////////////////////////////////////////////////////////////////
    	
        /* enable physics on the player */
        this.game.physics.enable(this.player);

        /* set a slight bounce */
        //this.player.body.bounce.y = 0.2;
    	
        /* set the gravity */
        this.player.body.gravity.y = 300;

        /* set to collide against the world bounds */
        this.player.body.collideWorldBounds = true;

    	/////////////////////////////////////////////////////////////////////////////////
        // add sounds for getting coins & jumping                                      //
        /////////////////////////////////////////////////////////////////////////////////

        this.coin_ = game.add.audio('coin_');
    	this.jump = game.add.audio('jump');

        /////////////////////////////////////////////////////////////////////////////////
        // add the background music                                                    //
        /////////////////////////////////////////////////////////////////////////////////

        //this.music = game.add.audio('music');
        //this.music.volume = 0.4;
        //this.music.loopFull();
        //this.music.play();

    	/////////////////////////////////////////////////////////////////////////////////
        // enable the cursor keys so we can create some controls                       //
        /////////////////////////////////////////////////////////////////////////////////

        /* create our virtual game controller buttons */
        if(!game.device.desktop)
        {
            this.buttonleft = game.add.button(32, game.height-96, 'button', null, this, 0, 1, 0, 1);
            this.buttonleft.fixedToCamera = true;
            this.buttonleft.events.onInputOver.add(function(){this.left=true;});
            this.buttonleft.events.onInputOut.add(function(){this.left=false;});
            this.buttonleft.events.onInputDown.add(function(){this.left=true;});
            this.buttonleft.events.onInputUp.add(function(){this.left=false;});
            
            this.buttonright = game.add.button(160, game.height-96, 'button', null, this, 0, 1, 0, 1);
            this.buttonright.fixedToCamera = true;
            this.buttonright.events.onInputOver.add(function(){this.right=true;});
            this.buttonright.events.onInputOut.add(function(){this.right=false;});
            this.buttonright.events.onInputDown.add(function(){this.right=true;});
            this.buttonright.events.onInputUp.add(function(){this.right=false;});

            this.buttonjump = game.add.button(game.width-160, game.height-96, 'button', null, this, 0, 1, 0, 1);
            this.buttonjump.fixedToCamera = true;
            this.buttonjump.events.onInputOver.add(function(){this.jump=true;});
            this.buttonjump.events.onInputOut.add(function(){this.jump=false;});
            this.buttonjump.events.onInputDown.add(function(){this.jump=true;});
            this.buttonjump.events.onInputUp.add(function(){this.jump=false;});
        }
        else
        {
            this.cursors = game.input.keyboard.createCursorKeys();
        }

    	/////////////////////////////////////////////////////////////////////////////////
        // display the collected diamonds                                              //
        /////////////////////////////////////////////////////////////////////////////////

        this.s = game.add.sprite(40, 30, 'coin');
        this.s.fixedToCamera = true;

        //game.debug.text(diamonds + ' / ' + this.coins.length, 85, 50);

        this.diamondsText = game.add.text(85, 37, this.diamonds + ' / ' + this.coins.length,
                {font: "16px Courier", fill: "#fff"});

        this.diamondsText.fixedToCamera = true;

        /////////////////////////////////////////////////////////////////////////////////
        // display the current level                                                   //
        /////////////////////////////////////////////////////////////////////////////////

        //this.levelText = game.debug.text('Level ' + level, 680, 50);

        this.levelText = game.add.text(680, 37, 'Level ' + this.level,
                {font: "16px Courier", fill: "#fff"});

        this.levelText.fixedToCamera = true;
    },

    update: function() {

        if(game.isRunning)
        {
            /* reset the player's velocity (movement) */
            this.player.body.velocity.x = 0;

            /* set the collision against the platforms */
            game.physics.arcade.collide(this.player, this.layer);
            
            /* check to see if the player overlaps with an diamond */
            game.physics.arcade.overlap(this.player, this.coins, this.hitCoin, null, this);

            this.diamondsText.text = this.diamonds + ' / ' + this.coins.length;

            this.levelText.text = 'Level ' + this.level;

            if(game.device.desktop)
            {
                if(this.cursors.left.isDown)
                {
                    this.player.body.velocity.x = -200;

                    if(this.cursors.up.isDown || !this.player.body.onFloor())
                    {
                        this.player.animations.stop();
                        this.player.frame = 1;
                    }
                    else
                    {
                        this.player.animations.play('left');
                    }
                }
                else if(this.cursors.right.isDown)
                {
                    this.player.body.velocity.x = 200;

                    if(this.cursors.up.isDown || !this.player.body.onFloor())
                    {
                        this.player.animations.stop();
                        this.player.frame = 6;
                    }
                    else
                    {
                        this.player.animations.play('right');
                    }
                }
                else
                {
                    this.player.animations.stop();
                    this.player.frame = 4;
                }

                if(this.cursors.up.isDown && this.player.body.onFloor())
                {
                    this.player.body.velocity.y = -250;
                    this.jump.play();
                }
            }

            else
            {
                if (this.left) {
                    //this.player.scale.x = -1;
                    this.player.body.velocity.x = -200;

                    if(jump || !this.player.body.onFloor())
                    {
                        this.player.animations.stop();
                        this.player.frame = 1;
                    }
                    else
                    {
                        this.player.animations.play('left');
                    }
                }
                else if (this.right) {
                    //this.player.scale.x = -1;
                    this.player.body.velocity.x = 200;

                    if(jump || !this.player.body.onFloor())
                    {
                        this.player.animations.stop();
                        this.player.frame = 6;
                    }
                    else
                    {
                        this.player.animations.play('right');
                    }
                }
                else
                {
                    this.player.animations.stop();
                    this.player.frame = 4;
                }

                if (this.jump && this.player.body.onFloor()) {
                    //this.player.scale.x = -1;
                    this.player.body.velocity.y = -250;
                    this.jump.play();
                    //player.animations.play('walk');
                }
            }
        }
    },

    gofull: function() { game.scale.startFullScreen(false);},

    hitCoin: function(player, coin) {
    	
        coin.kill();
    	this.coin_.play();
    	this.diamonds++;
    },

    hitLava: function() {
        
        this.music.stop();
        game.state.start('main');
        this.diamonds = 0;
    },

    nextLevel: function() {
        
        this.music.stop();
        this.layer.destroy();
        this.coins.destroy();
        
        this.diamonds = 0;
        this.level++;

        if(this.level > MAX_LEVELS)
        {
            game.isRunning = false;

            this.bg.destroy();
            this.s.destroy();

            this.diamondsText.destroy();
            this.levelText.destroy();

            game.camera.unfollow();
            this.player.body.collideWorldBounds = false;
            this.player.x = game.width + 800;
            this.player.y = game.height + 600;

            this.text = game.add.text(0, 0, "YOU ARE THE WINNER",
                {font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" });
            this.text.setTextBounds(0, 0, game.width, game.height);
            this.text.fixedToCamera = true;
        }
        else
        {
            game.state.start('main');
        }
    },

	// hitCoin: function(player, tile) {
	// 	tile.alpha = 0.4;
	// 	layer.dirty = true;
	// 	coin.play();
	// 	return false;
	// },
};