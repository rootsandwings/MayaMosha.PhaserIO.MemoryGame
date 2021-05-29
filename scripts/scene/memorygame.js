KGames.MemoryGame = function(){};

//Prototype
KGames.MemoryGame.prototype = {

    // Functions //

    // Variable Declaration
    declarevariable: function(){

        //Boolean
        this.challengemode_bol = false;
        this.gamereplay_bol = false ;

        //Image
        this.bg_img = null;

        //Value
        this.swidth_val = this.game.config.width; // stage width
        this.sheight_val = this.game.config.height; // stage height
        this.centerx_val = this.swidth_val * 0.5;
        this.centery_val = this.sheight_val * 0.5;

        //Sound
        this.right_snd = null;
        this.wrong_snd = null;
        this.intro_snd = null;
        this.bg_snd = null;
        this.cintro_snd = null;

        //Animation
        this.sparkle_anim = null;

        //Container
        this.timer_ctr = null;

        //Array
        this.correctsnd_arr = null;
        this.incorrectsnd_arr = null;

    },
      
    // SCALE IMAGE
    scaleimage: function(tpe,obj){
        if(tpe == "bg"){
            if (this.swidth_val / this.sheight_val > 1920 / 1080) {
                obj.setScale((1 / obj.width) * this.swidth_val);
            } else {
                obj.setScale((1 / obj.height) * this.sheight_val);
            }
        }
    },

    // CREATE ANIMATION
    createanim: function(id,name,texture,frate,repeat){
        if(texture && name && id){
            var frameNames = this.anims.generateFrameNames(id, {
                start: 1, end: (texture.frameTotal-1), zeroPad: 4,
                prefix: '', suffix: '.png'
            });
            this.anims.create({
                key: name,
                frames: frameNames,
                frameRate: frate,
                repeat: repeat
            })
        }
    },

    // AUDIO
    addaudio: function(){
        let thisclass = this;
        //CHECK RIGHT SOUND
        if(this.CONFIG.SOUNDS.RIGHT){
            this.right_snd = this.sound.add(this.CONFIG.ID+"-"+this.CONFIG.SOUNDS.RIGHT.ID);
        }
        //CORRECT & IN CORRECT SOUND
        if (this.correctsnd_arr == null){
            this.correctsnd_arr = [];
            this.incorrectsnd_arr = [];
            for (const key in this.CONFIG.SOUNDS) {
                if(key.search("CORRECT") == 0){
                    this.correctsnd_arr[ this.correctsnd_arr.length ] = this.sound.add(this.CONFIG.ID+"-"+this.CONFIG.SOUNDS[key].ID);
                }else if(key.search("INCORRECT") == 0){
                    this.incorrectsnd_arr[ this.incorrectsnd_arr.length ] = this.sound.add(this.CONFIG.ID+"-"+this.CONFIG.SOUNDS[key].ID);
                }
            }
        }
        //CHECK WRONG SOUND
        if(this.CONFIG.SOUNDS.WRONG){ 
            this.wrong_snd = this.sound.add(this.CONFIG.ID+"-"+this.CONFIG.SOUNDS.WRONG.ID);
        }
        //CHECK INTRO SOUND
        if(this.CONFIG.SOUNDS.INTRO){ 
            this.intro_snd = this.sound.add(this.CONFIG.ID+"-"+this.CONFIG.SOUNDS.INTRO.ID);
            this.intro_snd.on('complete',function(){
                if(thisclass.CONFIG.SOUNDS.INTRO && thisclass.CONFIG.SOUNDS.INTRO.FORCE_PLAY){
                    if(thisclass.CONFIG.SOUNDS.INTRO.END_DELAY){
                        thisclass.introsnd_tmr = thisclass.time.addEvent({
                            delay: thisclass.CONFIG.SOUNDS.INTRO.END_DELAY,               
                            callback:()=>{
                                thisclass.introsnd_tmr = thisclass.cleartimer(thisclass.introsnd_tmr);
                                // START GAME
                            },
                            loop: false,
                        });
                    }else{
                        // START GAME
                    }
                }
            });
        }
        //CHECK CHALLENGE INTRO SOUND
        if(this.CONFIG.SOUNDS.CHALLENGE_INTRO){ 
            this.cintro_snd = this.sound.add(this.CONFIG.ID+"-"+this.CONFIG.SOUNDS.CHALLENGE_INTRO.ID);
            this.cintro_snd.on('complete',function(){
                if(thisclass.CONFIG.SOUNDS.CHALLENGE_INTRO && thisclass.CONFIG.SOUNDS.CHALLENGE_INTRO.FORCE_PLAY){
                    if(thisclass.CONFIG.SOUNDS.CHALLENGE_INTRO.END_DELAY){
                        thisclass.introsnd_tmr = thisclass.time.addEvent({
                            delay: thisclass.CONFIG.SOUNDS.CHALLENGE_INTRO.END_DELAY,               
                            callback:()=>{
                                thisclass.introsnd_tmr = thisclass.cleartimer(thisclass.introsnd_tmr);
                                // START GAME
                            },
                            loop: false,
                        });
                    }else{
                        // START GAME
                    }
                }
            });
        }
        //CHECK BG MUSIC
        if(this.CONFIG.SOUNDS.BGMUSIC){ 
            this.bg_snd = this.sound.add(this.CONFIG.ID+"-"+this.CONFIG.SOUNDS.BGMUSIC.ID);
        }
    },

    playcorrectsnd: function(){
        if(this.correctsnd_arr != null && this.correctsnd_arr.length > 0){
            let rand = Global.GetRandomInt(this.correctsnd_arr.length);
            if(this.correctsnd_arr[rand]){
                this.correctsnd_arr[rand].play();
            }
        }
    },

    stopcorrectsnd: function(){
        if(this.correctsnd_arr && this.correctsnd_arr.length > 0){
            for(let j=0; j<this.correctsnd_arr.length; j++){
                this.correctsnd_arr[j].stop();
            }
        }
    },

    playincorrectsnd: function(){
        if(this.incorrectsnd_arr != null && this.incorrectsnd_arr.length > 0){
            let rand = Global.GetRandomInt(this.incorrectsnd_arr.length);
            if(this.incorrectsnd_arr[rand]){
                this.incorrectsnd_arr[rand].play();
            }
        }
    },

    stopincorrectsnd: function(){
        if(this.incorrectsnd_arr && this.incorrectsnd_arr.length > 0){
            for(let j=0; j<this.incorrectsnd_arr.length; j++){
                this.incorrectsnd_arr[j].stop();
            }
        }
    },

    playrightsnd: function(){
        if(this.right_snd){
            this.right_snd.play();
        }
    },

    stoprightsnd: function(){
        if(this.right_snd){
            this.right_snd.stop();
        }
    },

    playwrongsnd: function(){
        if(this.wrong_snd){
            this.wrong_snd.play();
        }
    },

    stopwrongsnd: function(){
        if(this.wrong_snd){
            this.wrong_snd.stop();
        }
    },

    playintrosnd: function(){
        let flag = true;
        if(this.challengemode_bol){
            if(this.cintro_snd){
                flag = false;
                if(this.CONFIG.SOUNDS.CHALLENGE_INTRO.VOLUME){
                    this.cintro_snd.volume = this.CONFIG.SOUNDS.INTRO.VOLUME;
                }
                this.cintro_snd.play();
            }
        }
        if(flag && this.intro_snd){
            if(this.CONFIG.SOUNDS.INTRO.VOLUME){
                this.intro_snd.volume = this.CONFIG.SOUNDS.INTRO.VOLUME;
            }
            this.intro_snd.play();
        }
    },

    stopintrosnd: function(){
        if(this.intro_snd){
            this.intro_snd.stop();
        }
        if(this.cintro_snd){
            this.cintro_snd.stop();
        }
    },

    playbgsnd: function(){
        if(this.bg_snd){
            if(this.CONFIG.SOUNDS.BGMUSIC.LOOP){
                this.bg_snd.loop = true;
            }
            if(this.CONFIG.SOUNDS.BGMUSIC.VOLUME){
                this.bg_snd.volume = this.CONFIG.SOUNDS.BGMUSIC.VOLUME;
            }
            this.bg_snd.play();
        }
    },

    stopbgsnd: function(){
        if(this.bg_snd){
            this.bg_snd.stop();
        }
    },

    stopallsnd: function(params){
        if(params && params.stopbg){
            this.stopbgsnd();
        }
        if(params && params.stopright){
            this.stoprightsnd();
        }
        if(params && params.stopceleb){
            this.stopincorrectsnd();
            this.stopcorrectsnd();
        }
        this.stopwrongsnd();
        this.stopintrosnd();
    },

    // UI
    createbg: function(){
        this.bg_img = this.add.image(0, 0, (this.CONFIG.ID+"-"+this.CONFIG.BG.ID));
        this.bg_img.setOrigin(0.5);
        this.scaleimage("bg",this.bg_img);
        this.bg_img.setPosition(this.centerx_val, this.centery_val);
    },

    createbtn: function(){
        let thisclass = this;
        if(APPCONFIG.MENU){
            for (const key in APPCONFIG.MENU.BTN) {
                let ID = APPCONFIG.MENU.BTN[key].ID;
                let POS = APPCONFIG.MENU.BTN[key].POS;
                this[key.toLowerCase()+"_btn"] = this.add.image(0, 0, (APPCONFIG.ID+"-"+ID));
                this[key.toLowerCase()+"_btn"].ID = ID;
                this[key.toLowerCase()+"_btn"].setScale((1/this[key.toLowerCase()+"_btn"].displayWidth) * this.swidth_val * 0.05);
                this[key.toLowerCase()+"_btn"].setPosition(
                    this.swidth_val * POS.X,
                    this.sheight_val * POS.Y
                );
                this[key.toLowerCase()+"_btn"].setInteractive();
                this[key.toLowerCase()+"_btn"].on('pointerup',function(pointer, px, py, event){
                    Global.Log("BTN: "+(this.ID));
                    if(this.ID == "MENU-REPLAY"){
                        thisclass.gamereplay_bol = true;
                        thisclass.replaytask({chareset: true});
                    }
                });
            }
        }
    },

    createtimebox: function(){
        let POS = APPCONFIG.GTIMER.POS;
        this.timer_ctr = this.add.container();
            //IMAGE
            let tframe = this.add.image(0, 0, (APPCONFIG.ID+"-"+APPCONFIG.GTIMER.ID));
            tframe.setScale((1/tframe.displayWidth) * this.swidth_val * 0.05);
            this.timer_ctr.add(tframe);
            //LABEL
            let fntsize = 0.6 * tframe.displayHeight + "px"
            let txtlbl = this.add.text(0, 0, "00", { fontFamily: 'Arial', fontSize: fntsize, fill: '#000000', align: 'center', });
            txtlbl.setOrigin(0.5);
            this.timer_ctr.add(txtlbl);
        this.timer_ctr.setPosition(this.swidth_val * POS.X, this.sheight_val * POS.Y);
        this.timer_ctr.show = function(flag){
            this.visible = flag;
        }
        this.timer_ctr.show(false);
        //INIT Game Timer
        GTimer.Init({
            view: this.timer_ctr,
            time: 0,
            scene: this
        });
    },

    createsparkle: function(){
        let sparkletex = this.textures.get(APPCONFIG.ID+"-"+APPCONFIG.SPARKLE.ID);
        this.createanim((APPCONFIG.ID+"-"+APPCONFIG.SPARKLE.ID),"sparkle",sparkletex,APPCONFIG.SPARKLE.FRAME_RATE,0)
        this.sparkle_anim = this.add.sprite(200, 200, (APPCONFIG.ID+"-"+APPCONFIG.SPARKLE.ID));
        this.sparkle_anim.setScale(this.swidth_val * 0.18 * (1/this.sparkle_anim.displayWidth));
        this.sparkle_anim.play('sparkle');
        this.sparkle_anim.visible = false;
    },

    creatememorygrid: function(){
        
    },

    //CHALLENGE
    challengetimeend: function(){
        
    },

    startchallenge: function(params){
        this.challengemode_bol = params.flag;
    },

    checktimermode: function(){
        if(!this.challengemode_bol){
            if(this.CONFIG.GTIMER != null){
                if(this.CONFIG.GTIMER.FLAG){
                    this.startchallenge({
                        init: true,
                        time: this.CONFIG.GTIMER.TIME
                    })
                }
            }
        }
    },

    createui: function(){
        this.createbg();
        this.createtimebox();
        this.createsparkle();
        this.createbtn();
    },

    // Game Methods //

    //Preload function
    preload: function(){

    },

    //init function
    init: function(){
        this.CONFIG = gamejson.CONFIG;
        this.DATA = gamejson.DATA;
        Global.Log(this.CONFIG.NAME+": "+this.CONFIG.VERSION);
    },

    //create function
    create: function(){
        this.declarevariable();
        this.addaudio();
        this.createui();
        this.playbgsnd();
        this.playintrosnd();
        this.checktimermode();
        this.creatememorygrid();
    },

    //update function
    update: function(){

    },

}