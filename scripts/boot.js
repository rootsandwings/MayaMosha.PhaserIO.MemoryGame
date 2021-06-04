// Global
const KGames = {}

// Window load
window.onload = function(){
    
    //game config
    const config = {
        type: Phaser.AUTO,
        autoResize: true,
        seed: [ (Date.now() * Math.random()).toString() ],
        scale: {
            mode: Phaser.Scale.FIT,
            width: window.innerWidth * window.devicePixelRatio,
            height: window.innerHeight * window.devicePixelRatio,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            zoom: 1
        },
        physics: {
            default: false,
        },
        fps: {
            min: 30,
            target: 60,
            forceSetTimeOut: true,
            deltaHistory: 10
        },
        autoFocus: true,
        transparent: true,
        autoRound: false,
        gamejson: null
    }

    //NEW GAME WINDOW
    const game = new Phaser.Game(config);

    //PHASER VERSION DETAILS
    Global.Log("VERSION :[ "+Phaser.VERSION+" ]");

    //ADD SCENES TO GAME
    game.scene.add('preloader', KGames.Preloader);
    game.scene.add('memorygame', KGames.MemoryGame);
    game.scene.add('summary', KGames.Summary);

    //GAME URL(FETCH DATA)
    let gameurl = "/json/memory.json";
    fetch(gameurl).then(
        function(data){
            data.json().then(
                function (json) { 
                    this.gamejson = json;
                    game.scene.start('preloader');
                }
            )
        }
    );
    
}