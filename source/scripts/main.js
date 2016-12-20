main = {
    settings : null,
    canvasWindow : null,
    
    states : {},
    currentState : null,
    
    level : null,
    
    init : function( pSettings, pCanvasWindow ) {
        settings = pSettings;
        canvasWindow = pCanvasWindow;
        
        window.addEventListener( "mousedown", main.click, false );
        window.addEventListener( "keydown", main.click, false );
        window.addEventListener( "keyup", main.click, false );
        
        level = initLevel();
        console.log( level );
    },
    
    update : function() {
    },
    
    draw : function() {
        // Fill background
        canvasWindow.fillStyle = "#333333";
        canvasWindow.fillRect( 0, 0, settings.width, settings.height );
    },
    
    // Events
    click : function( event )
    {
    },
    
    keydown : function( event )
    {
    },
    
    keyup : function( event )
    {
    }
};

