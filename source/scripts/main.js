main = {    
    settings : null,
    canvasWindow : null,
    level : null,
    player : {
        x : 0,
        y : 0,
        width : 0,
        height : 0,
        speed : 10,
        xVel : 0,
        
        move : function( settings ) {
            this.x += ( this.xVel * this.speed );
            
            if ( this.x < 0 )
                this.x = 0;
            else if ( this.x + this.width > settings.width )
                this.x = settings.width - this.width;
        }
    },
    
    bullets : [],
    bulletImage : null,
    
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
        
        main.bulletImage = new Image();
        main.bulletImage.src = "assets/bullet.png";        
    },
    
    update : function() {
        main.player.move( main.settings );
        
        deleteMe = [];
        for ( index = 0; index < main.bullets.length; index++ )
        {
            main.bullets[index].y -= main.bullets[index].speed;
            
            if ( main.bullets[index].y < -main.bullets[index].height )
            {
                // Destroy me
                deleteMe.push( index );
            }
        }
        
        // Remove bullets that are off-screen or have hit an object
        for ( index = 0; index < deleteMe.length; index++ )
        {
            main.bullets.splice( deleteMe[ index ], 1 );
        }
    },
    
    draw : function() {
        if ( main.canvasWindow == null ) { return; }
        // Fill background
        main.canvasWindow.fillStyle = "#333333";
        main.canvasWindow.fillRect( 0, 0, main.settings.width, main.settings.height );
        
        main.canvasWindow.drawImage( main.player.image, main.player.x, main.player.y );
        
        for ( index = 0; index < main.bullets.length; index++ )
        {
            main.canvasWindow.drawImage( main.bulletImage, main.bullets[index].x, main.bullets[index].y );
        }
    },
    
    // Special
    createBullet : function( x, y ) {
        var newBullet = {};
        newBullet.width = 16;
        newBullet.height = 16;
        newBullet.x = x - newBullet.width / 2;
        newBullet.y = y - newBullet.height;
        newBullet.speed = 20;
        
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
            main.createBullet( main.player.x + main.player.width / 2, main.player.y );
        }
    },
    
    keyup : function( event ) {
        if ( event.key == "a" || event.key == "d" )
        {
            main.player.xVel = 0;
        }
    }
};

