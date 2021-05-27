KGames.Preloader = function(){};

//Prototype
KGames.Preloader.prototype = {

    //COMMON CONFIG
    preloadcommon: function(){
        if(typeof(APPCONFIG) != "undefined"){
            //MENU BTN
            if(APPCONFIG.MENU && APPCONFIG.MENU.BTN){
                for (const key in APPCONFIG.MENU.BTN) {
                    this.load.image(APPCONFIG.ID+"-"+APPCONFIG.MENU.BTN[key].ID, APPCONFIG.MENU.BTN[key].PATH);
                }
            }
            //SPARKLE ANIM
            if(APPCONFIG.SPARKLE){
                this.load.atlas((APPCONFIG.ID+"-"+APPCONFIG.SPARKLE.ID), APPCONFIG.SPARKLE.PATH, APPCONFIG.SPARKLE.JSON);
            }
            //CELEBRATION ANIM
            if(APPCONFIG.CELEBRATION){
                if(APPCONFIG.CELEBRATION.ANIMATION){
                    this.load.atlas((APPCONFIG.ID+"-"+APPCONFIG.CELEBRATION.ANIMATION.ID), APPCONFIG.CELEBRATION.ANIMATION.PATH, APPCONFIG.CELEBRATION.ANIMATION.JSON);
                }
                //PRELOAD SOUNDS
                if(APPCONFIG.CELEBRATION.SOUNDS){
                    for (const key in APPCONFIG.CELEBRATION.SOUNDS) {
                        this.load.audio(APPCONFIG.ID+"-"+APPCONFIG.CELEBRATION.SOUNDS[key].ID, APPCONFIG.CELEBRATION.SOUNDS[key].PATH);
                    }
                }
            }
            //PRELOAD GTIMER
            if(APPCONFIG.GTIMER){
                this.load.image(APPCONFIG.ID+"-"+APPCONFIG.GTIMER.ID, APPCONFIG.GTIMER.PATH);
            }
            //SUMMARY
            if(APPCONFIG.SUMMARY){
                for (const key in APPCONFIG.SUMMARY) {
                    if(APPCONFIG.SUMMARY[key].ID){
                        if(APPCONFIG.SUMMARY[key].IMAGES){
                            for( const keyi in APPCONFIG.SUMMARY[key].IMAGES){
                                this.load.image(APPCONFIG.ID+"-"+APPCONFIG.SUMMARY[key].IMAGES[keyi].ID, APPCONFIG.SUMMARY[key].IMAGES[keyi].PATH);
                            }
                        }
                        //LOAD BTN
                        for( const keyb in APPCONFIG.SUMMARY[key].BTN){
                            this.load.image(APPCONFIG.ID+"-"+APPCONFIG.SUMMARY[key].BTN[keyb].ID, APPCONFIG.SUMMARY[key].BTN[keyb].PATH);
                        }
                    }
                }
                //PRELOAD SOUNDS
                if(APPCONFIG.SUMMARY.SOUNDS){
                    for (const key in APPCONFIG.SUMMARY.SOUNDS) {
                        this.load.audio(APPCONFIG.ID+"-"+APPCONFIG.SUMMARY.SOUNDS[key].ID, APPCONFIG.SUMMARY.SOUNDS[key].PATH);
                    }
                }
                //PRELOAD FONT
                if(APPCONFIG.SUMMARY.FONTS){
                    for (const key in APPCONFIG.SUMMARY.FONTS) {
                        this.load.bitmapFont(APPCONFIG.ID+"-"+APPCONFIG.SUMMARY.FONTS[key].ID, APPCONFIG.SUMMARY.FONTS[key].PATH, APPCONFIG.SUMMARY.FONTS[key].XML);
                    }
                }
            }
        }
    },

    //GAME PAGE
    preloadgame: function(){
        let CONFIG = gamejson.CONFIG;
        let DATA = gamejson.DATA;
        if(typeof(CONFIG) != "undefined"){
            //BG
            if(CONFIG.BG){
                this.load.image(CONFIG.ID+"-"+CONFIG.BG.ID,CONFIG.BG.PATH);
            }
            //PRELOAD SOUNDS
            for (const key in CONFIG.SOUNDS) {
                this.load.audio(CONFIG.ID+"-"+CONFIG.SOUNDS[key].ID, CONFIG.SOUNDS[key].PATH);
            }
            //BOX FONT
            if(CONFIG.BOX){
                if(CONFIG.BOX.FONT){
                    this.load.bitmapFont(CONFIG.ID+"-"+CONFIG.BOX.FONT.ID, CONFIG.BOX.FONT.PATH, CONFIG.BOX.FONT.XML);
                }
            }
        }
        if(typeof(DATA) != "undefined"){
            //PRELOAD GAME DATA
            for( const key in DATA){
                for( const keyt in DATA[key]){
                    if(keyt == "CNT"){
                        for( const keyc in DATA[key][keyt]){
                            let content = DATA[key][keyt][keyc];
                            if(content.IMG){
                                this.load.image(CONFIG.ID+"-"+content.ID, content.IMG);
                            }
                            if(content.BOX_SND){
                                this.load.audio(CONFIG.ID+"-"+content.ID, content.BOX_SND);
                            }
                            if(content.BOX_GIF){
                                this.load.atlas((CONFIG.ID+"-"+content.BOX_GIF.ID), content.BOX_GIF.PATH, content.BOX_GIF.JSON);
                            }
                        }
                    }
                }
            }
        }
    },

    //CREATE UI
    createui: function(){
        let width = this.game.config.width;
        let height = this.game.config.height;

        this.progressbar_shp = this.add.rectangle(0, 0, (width * 0.3), (height * 0.05));
        this.progressbar_shp.setOrigin(0,0.5);
        this.progressbar_shp.x = width * 0.5 - this.progressbar_shp.displayWidth * 0.5;
        this.progressbar_shp.y = height * 0.85;
        this.progressbar_shp.setFillStyle(0x000000);
        this.progressbar_shp.scaleX = 0.01;

        this.loadinglbl_txt = this.add.text(
            width * 0.5, 
            height * 0.5, 
            "Loading.. 0%", 
            { 
                fontFamily: 'Arial', 
                fontSize: Math.floor(height * 0.05), 
                fill: '#000000', 
                align: 'left', 
            }
        );
        this.loadinglbl_txt.setOrigin(0.5);
    },

    //PRE-LOAD LISTENER
    preloadlistener: function(){
        let thisclass = this;

        this.load.on('progress', function (value) {
            let progress_val = Math.floor(value * 100);
            //Global.Log("PRELOAD: PROGRESS - "+progress_val);
            thisclass.loadinglbl_txt.text = "Loading.. "+progress_val+"%";
            thisclass.progressbar_shp.scaleX = (progress_val/100);
        });
                    
        this.load.on('fileprogress', function (file) {
            //Global.Log("PRELOAD: FILE - "+(file.src));
        });

        this.load.on('complete', function () {
            Global.Log('PRELOAD: COMPLETE');
            thisclass.scene.start('memorygame');
        });
    },

    //Preload function
    preload: function(){
        this.createui();
        this.preloadlistener();
        this.preloadcommon();
        this.preloadgame();
    },

    //init function
    init: function(){
        
    },

    //create function
    create: function(){
        
    },

    //update function
    update: function(){

    },

}