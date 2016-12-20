main = {
    settings : null,
    canvasWindow : null,
    
    image : null;
    
    init : function( pSettings, pCanvasWindow ) {
        main.settings = pSettings;
        main.canvasWindow = pCanvasWindow;
        
        window.addEventListener( "mousedown",   main.click, false );
        window.addEventListener( "keydown",     main.keydown, false );
        window.addEventListener( "keyup",       main.keyup, false );
        
        main.image = new Image();
        main.image.src = "catship.png";
    },
    
    update : function() {
    },
    
    draw : function() {
        // Fill background
        main.canvasWindow.fillStyle = "#333333";
        main.canvasWindow.fillRect( 0, 0, main.settings.width, main.settings.height );
        
        // Draw image
        main.canvasWindow.drawImage( main.image, 0, 0 );
    },
    
    // Events
    click : function( event )
    {
        console.log( event );
    },
    
    keydown : function( event )
    {
        console.log( event );
    },
    
    keyup : function( event )
    {
        console.log( event );
    }
};

