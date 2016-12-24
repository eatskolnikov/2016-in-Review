main = {    
    settings : null,
    canvasWindow : null,
    level : null,
    levelLine : 0,
    levelObjects : null,
    player : {
        x : 0,
        y : 0,
        width : 0,
        height : 0,
        speed : 10,
        xVel : 0,
        bulletWidth : 8,
        bulletHeight : 8,
        
        move : function( settings ) {
            this.x += ( this.xVel * this.speed );
            
            if ( this.x < 0 )
                this.x = 0;
            else if ( this.x + this.width > settings.width )
                this.x = settings.width - this.width;
        }
    },
    powerups : [],
    
    powerupInfo : {
        bulletSpeed : 0,
        bulletSize : "standard"
    },
    
    bullets : [],
    bulletImage : null,
    
    backgroundImage : null,
    
    gameOver : false,
    
    music : null,
    shootSound : null,
    explodeSound : null,
    
    init : function( pSettings, pCanvasWindow ) {
        main.settings = pSettings;
        main.canvasWindow = pCanvasWindow;
        
        window.addEventListener( "mousedown",   main.click, false );
        window.addEventListener( "keydown",     main.keydown, false );
        window.addEventListener( "keyup",       main.keyup, false );
        
        main.level = initLevel();
        
        main.player.image = new Image();
        main.player.image.src = "assets/catship.png";
        main.player.width = 64;
        main.player.height = 64;
        main.player.x = main.settings.width / 2 - main.player.width / 2;
        main.player.y = main.settings.height - main.player.height;
        main.player.bulletSpeed = 20;
        
        main.powerupInfo.bulletSpeed = main.player.bulletSpeed;
        
        main.bulletImage = new Image();
        main.bulletImage.src = "assets/bullet.png";
        
        main.powerupType1Image = new Image();
        main.powerupType1Image.src = "assets/powerup1.png";
        main.powerupType2Image = new Image();
        main.powerupType2Image.src = "assets/powerup2.png";
        
        main.backgroundImage = new Image();
        main.backgroundImage.src = "assets/background.png";
        
        main.music = new Audio( "assets/Cyborg Ninja - Incompetech.mp3" );
        main.music.loop = true;
        main.shootSound = new Audio( "assets/Laser_Shoot2.wav" );
        main.explodeSound = new Audio( "assets/Explosion15.wav" );
        main.powerup = new Audio( "assets/Powerup2.wav" );
        main.powerupGot = new Audio( "assets/Powerup3.wav" );
        
        main.createLevelObjects();
        
        main.music.play();
    },
    
    scroll : function() {
        if ( main.gameOver == true ) { return; }
        
        var isOffscreen = false;
        
        for ( index = 0; index < main.levelObjects.length; index++ )
        {
            main.levelObjects[index].y += main.levelObjects[index].speed;
            if ( main.levelObjects[index].y > main.settings.height + 150 )
            {
                isOffscreen = true;
            }
        }
        
        if ( isOffscreen )
        {
            // Create next object set
            if ( main.levelLine >= main.level.length )
            {
                // End of game
                main.gameOver = true;
            }
            else
            {
                main.createLevelObjects();
            }
        }
    },
    
    createPowerup : function( x, y ) {
        main.powerup.play();
        var newPowerup = {}
        newPowerup.x = x;
        newPowerup.y = y;
        newPowerup.speed = 6;
        newPowerup.width = 32;
        newPowerup.height = 32;
        newPowerup.active = true;
        
        var type = Math.floor( Math.random() * 2 );
        if ( type == 1 )
        {
            newPowerup.type = "speedup";
        }
        else 
        {
            newPowerup.type = "bigbullet";
        }
        
        main.powerups.push( newPowerup );
    },
    
    createLevelObjects : function() {
        // Clear array
        main.levelObjects = [];
        
        var text = main.level[ main.levelLine ];
        
        var leftmost = 10;
        var x = leftmost;
        var y = -100;
        
        var width = 12;
        var height = 20;
        
        var ratio = 3/4;
        
        for ( index = 0; index < text.length; index++ )
        {
            if ( text[index] == " " && x > main.settings.width * ratio )
            {
                x = leftmost;
                y += height;
            }
            
            var newObject = {};
            newObject.x = x;
            newObject.y = y;
            newObject.width = width;
            newObject.height = height;
            newObject.speed = 5;
            newObject.text = text[index];
            main.levelObjects.push( newObject );
            
            x += width;
        }
        
        main.levelLine++;
    },
    
    update : function() {
        if ( main.gameOver == true ) { return; }
        
        main.player.move( main.settings );
        
        deleteMeBullets = [];
        for ( index = 0; index < main.bullets.length; index++ )
        {
            main.bullets[index].y -= main.bullets[index].speed;
            
            if ( main.bullets[index].y < -main.bullets[index].height )
            {
                // Destroy me
                deleteMeBullets.push( index );
            }
        }
        
        deleteMeText = [];
        var x, y;
        // Check bullet collisions
        for ( b = 0; b < main.bullets.length; b++ )
        {
            for ( t = 0; t < main.levelObjects.length; t++ )
            {
                var bullet = main.bullets[b];
                var text = main.levelObjects[t];
                
                if ( bullet.x < text.x + text.width
                    && bullet.x + bullet.width > text.x
                    && bullet.y < text.y + text.height
                    && bullet.y + bullet.height > text.y )
                {
                    x = bullet.x;
                    y = bullet.y;
                    main.explodeSound.play();
                    deleteMeBullets.push( b );
                    deleteMeText.push( t );
                }
            }
        }
        
        if ( deleteMeText.length > 0 )
        {
            var rand = Math.floor( Math.random() * 10 );
            if ( rand == 0 )
            {
                main.createPowerup( x, y );
            }
        }
        
        // Powerups
        deleteMePowerup = [];
        for ( index = 0; index < main.powerups.length; index++ )
        {
            var thisPowerup = main.powerups[index];
            
            thisPowerup.y += thisPowerup.speed;
            
            if ( thisPowerup.y > main.settings.height )
            {
                deleteMePowerup.push( index );
            }
            
            // Collect powerup?
            if ( 
                main.player.x < thisPowerup.x + thisPowerup.width &&
                main.player.x + main.player.width > thisPowerup.x &&
                main.player.y < thisPowerup.y + thisPowerup.height &&
                main.player.y + main.player.height > thisPowerup.y )
            {
                if ( main.powerups[index].type == "speedup" )
                {
                    main.player.bulletSpeed += 2;
                    main.powerupInfo.bulletSpeed = main.player.bulletSpeed;
                }
                else 
                {
                    main.bulletImage.src = "assets/bulletbig.png";
                    main.player.bulletWidth = 16;
                    main.player.bulletHeight = 16;
                    main.powerupInfo.bulletSize = "double";
                }
                deleteMePowerup.push( index );
                main.powerupGot.play();
            }
        }
        
        // Remove bullets that are off-screen or have hit an object
        for ( index = 0; index < deleteMeBullets.length; index++ )
        {
            main.bullets.splice( deleteMeBullets[ index ], 1 );
        }
        
        // Remove text that have been shot
        for ( index = 0; index < deleteMeText.length; index++ )
        {
            main.levelObjects.splice( deleteMeText[ index ], 1 );
        }
        
        // Remove powerups that have been collected or gone off-screen
        for ( index = 0; index < deleteMePowerup.length; index++ )
        {
            main.powerups.splice( deleteMePowerup[ index ], 1 );
        }
        
        main.scroll();
    },
    
    draw : function() {
        if ( main.canvasWindow == null ) { return; }
    
        // Draw background
        main.canvasWindow.drawImage( main.backgroundImage, 0, 0 );
        
        if ( main.gameOver == false ) {
            
            // Draw player
            main.canvasWindow.drawImage( main.player.image, main.player.x, main.player.y );
            
            
            // Draw text
            main.canvasWindow.fillStyle = "#ffff00";
            main.canvasWindow.font = "20px monospace";
            for ( index = 0; index < main.levelObjects.length; index++ )
            {
                var text = main.levelObjects[index].text;
                var x = main.levelObjects[index].x;
                var y = main.levelObjects[index].y;
                
                main.canvasWindow.fillText( text, x, y );
            }
            
            // Draw bullets
            for ( index = 0; index < main.bullets.length; index++ )
            {
                main.canvasWindow.drawImage( main.bulletImage, main.bullets[index].x, main.bullets[index].y );
            }
            
            // Draw powerups
            for ( index = 0; index < main.powerups.length; index++ )
            {
                if ( main.powerups[index].type == "speedup" )
                {
                    main.canvasWindow.drawImage( main.powerupType1Image, main.powerups[index].x, main.powerups[index].y );
                }
                else
                {
                    main.canvasWindow.drawImage( main.powerupType2Image, main.powerups[index].x, main.powerups[index].y );
                }
            }
            
            // Stats
            main.canvasWindow.fillStyle = "#ffffff";
            main.canvasWindow.font = "12px monospace";
            main.canvasWindow.fillText( "Bullet Speed: " + main.powerupInfo.bulletSpeed, 5, main.settings.height - 5 );
            main.canvasWindow.fillText( "Bullet Size: " + main.powerupInfo.bulletSize, 5, main.settings.height - 15 );
            
            main.canvasWindow.fillText( "v1.2", main.settings.width - 40, main.settings.height - 5 );
        }
        else
        {
            main.canvasWindow.fillStyle = "#ffff00";
            main.canvasWindow.font = "40px monospace";
            
            main.canvasWindow.fillText( "YEAR", main.settings.width / 2 - 100, main.settings.height / 2 );
            main.canvasWindow.fillText( "OVER", main.settings.width / 2 - 50, main.settings.height / 2 + 40 );
            
            main.canvasWindow.font = "65px monospace";
            main.canvasWindow.fillText( "2016", main.settings.width / 2 - 100, main.settings.height / 2 - 50 );
        }
        
    },
    
    // Special
    createBullet : function( x, y ) {   
        main.shootSound.play();     
        var newBullet = {};
        newBullet.width = main.player.bulletWidth;
        newBullet.height = main.player.bulletHeight;
        newBullet.x = x - newBullet.width / 2;
        newBullet.y = y;
        newBullet.speed = main.player.bulletSpeed;
        
        main.bullets.push( newBullet );
    },
    
    // Events
    click : function( event ) {
    },
    
    keydown : function( event ) {
        if ( event.key == "a" )
        {
            main.player.xVel = -1;
        }
        else if ( event.key == "d" )
        {
            main.player.xVel = 1;
        }
        else if ( event.key == "j" )
        {
            main.createBullet( main.player.x + main.player.width / 2, main.player.y + 20 );
        }
    },
    
    keyup : function( event ) {
        if ( event.key == "a" || event.key == "d" )
        {
            main.player.xVel = 0;
        }
    }
};

