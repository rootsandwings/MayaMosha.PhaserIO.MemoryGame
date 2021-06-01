KGames.MemoryGame = function(){};

//Prototype
KGames.MemoryGame.prototype = {

    // Functions //

    // Variable Declaration
    declarevariable: function(){

        //Boolean
        this.challengemode_bol = false;
        this.gamereplay_bol = false ;
        this.gameend_bol = false; 

        //Image
        this.bg_img = null;

        //Value
        this.swidth_val = this.game.config.width; // stage width
        this.sheight_val = this.game.config.height; // stage height
        this.centerx_val = this.swidth_val * 0.5;
        this.centery_val = this.sheight_val * 0.5;
        this.totalcard_val = null;
        this.cardopened_val = 0;

        //Sound
        this.right_snd = null;
        this.wrong_snd = null;
        this.intro_snd = null;
        this.bg_snd = null;
        this.cintro_snd = null;

        //Animation
        this.sparkle_anim = null;

        //Data
        this.game_data = {level: 1, task: 1, tottask: 0};

        //Score
        this.main_score = 0;
        this.task_score = 0;
        this.point_score = this.CONFIG.SCORE.POINTS;

        //Container
        this.timer_ctr = null;
        this.cards_ctr = null;

        //Array
        this.correctsnd_arr = null;
        this.incorrectsnd_arr = null;

        //Card
        this.first_card = null;
        this.second_card = null;
        this.active_card = null;

        //Timer
        this.cardclose_tmr = null;
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

    //Show Sparkle
    showsparkle: function(flag,pos){
        if(this.sparkle_anim){
            if(flag){
                this.sparkle_anim.visible = true;
                this.sparkle_anim.play('sparkle');
                this.sparkle_anim.setPosition(pos.x, pos.y);
                this.children.bringToTop(this.sparkle_anim);
            }else{
                this.sparkle_anim.visible = false;
            }
        }
    },

    //CLEAN
    cleartimer: function(timer){
        if(timer){
            timer.remove();
            this.time.removeEvent(timer);
        }
        return null;
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

    // Card data generation
    generatecarddata: function(tdata){
        let cardarr = []
        let lineval = 1;
        //LINE
        if(tdata.LINE != null){
            lineval = tdata.LINE;
        }
        //TYPE
        if(tdata.TEXT != null && tdata.IMAGE != null && tdata.TEXT && tdata.IMAGE){
            let idatavl = IData["line"+lineval];
            let tdatavl = TData["line"+lineval];
            if(idatavl != null && tdatavl != null){
                let icnt = 0, lcnt = 0;
                for(let j=0; j<this.totalcard_val; j++){
                    if( j >= Math.ceil(this.totalcard_val/2) ){
                        cardarr[ j ] = ["image", idatavl[icnt] || "", icnt];
                        icnt = icnt + 1;
                        if(icnt >= Global.GetLength(idatavl)){
                            icnt = 0;
                        }
                    }else{
                        cardarr[ j ] = ["text", tdatavl[lcnt] || "", lcnt];
                        lcnt = lcnt + 1;
                        if(lcnt >= Global.GetLength(tdatavl)){
                            lcnt = 0;
                        }
                    }
                }
            }
        }else if(tdata.TEXT != null && tdata.TEXT){
            let tdatavl = TData["line"+lineval];
            let lcnt = 0;
            if(tdatavl != null){
                for(let j=0; j<this.totalcard_val; j++){
                    cardarr[ j ] = ["text", tdatavl[lcnt] || "", lcnt];
                    lcnt = lcnt + 1;
                    if(lcnt >= Global.GetLength(tdatavl)){
                        lcnt = 0;
                    }
                }
            }
        }else if(tdata.IMAGE != null && tdata.IMAGE){
            let idatavl = IData["line"+lineval];
            let icnt = 0;
            if(idatavl != null){
                for(let j=0; j<this.totalcard_val; j++){
                    cardarr[ j ] = ["image", idatavl[icnt] || "", icnt];
                    if(icnt >= Global.GetLength(idatavl)){
                        icnt = 0;
                    }
                }
            }
        }
        return cardarr;
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
        this.sparkle_anim.visible = false;
    },

    createcard: function(cdata){
        let cardctr = this.add.container();
            let boxsize_val = this.CONFIG.BOX.SIZE || 0.5;
            let downtile_img = this.add.image(0,0,this.CONFIG.ID+"-"+this.CONFIG.BOX.DOWN_IMG.ID);
            downtile_img.setScale(this.bg_img.displayHeight * boxsize_val);
            cardctr.add(downtile_img);
            if(cdata[0] == "text"){
                let let_str = Global.GetLetterText(TDict,cdata[1]);
                let fontsize = this.CONFIG.BOX.FONT.SIZE || 60;
                fontsize = Math.floor(downtile_img.displayHeight * fontsize);
                let label_btxt = this.add.bitmapText(0, 0, (this.CONFIG.ID+"-"+this.CONFIG.BOX.FONT.ID), let_str, fontsize);
                label_btxt.setOrigin(0.5);
                label_btxt.setTintFill(0x000000);
                if(this.CONFIG.BOX.FONT.COLOR != null){
                    label_btxt.setTintFill(Phaser.Display.Color.HexStringToColor(this.CONFIG.BOX.FONT.COLOR).color);
                }
                label_btxt.displayWidth = label_btxt.width;
                label_btxt.displayHeight = label_btxt.height;
                cardctr.add(label_btxt);
            }else if(cdata[0] == "image"){

            }
            let toptile_img = this.add.image(0,0,this.CONFIG.ID+"-"+this.CONFIG.BOX.TOP_IMG.ID);
            toptile_img.setScale(this.bg_img.displayHeight * boxsize_val);
            cardctr.add(toptile_img);
        return cardctr;
    },

    creatememorygrid: function(){
        this.game_data.tottask = Global.GetLength( this.DATA );
        this.cards_ctr = this.add.container();
        let taskdata = this.DATA[ "TASK"+ this.game_data.task ];
        this.totalcard_val = taskdata[ "TOTAL_CARD" ];
        let cardpairs = this.totalcard_val * 2;
        let carddata = this.generatecarddata(taskdata);
        let gridsize = Global.Split(taskdata.GRID || "3X3", "X");
        let ccnt = 0, cx = 0, cy = 0;
        let space_val = this.CONFIG.BOX.SPACE || 0;
        let bounds = null;
        let positions = [];
        for(let v=0; v<cardpairs; v++){
            let card = this.createcard(carddata[ccnt]);
            this.cards_ctr.add(card);
            //PROPERTY
            card.index = carddata[ccnt][2] || 0;
            //CARD BOUNDS
            bounds = card.getBounds();
            card.setPosition(cx + bounds.width * 0.5, cy + bounds.height * 0.5);
            cx = cx + bounds.width + Math.floor(bounds.width * space_val);
            positions[v] = [card.x, card.y];
            //ENABLE INETRACTIVE
            card.setInteractive(
                new Phaser.Geom.Rectangle((0-bounds.width*0.5),(0-bounds.height*0.5),bounds.width,bounds.height), 
                Phaser.Geom.Rectangle.Contains
            );
            this.enableinteractive(card);
            //NEW ROW
            if((v+1)%gridsize[1] == 0){
                cx = 0;
                cy = cy + bounds.height + Math.floor(bounds.height * space_val);
            }
            //CONTENT COUNT
            ccnt = ccnt + 1;
            if(ccnt >= this.totalcard_val){ ccnt = 0; }
        }
        let cardsbounds = this.cards_ctr.getBounds();
        this.cards_ctr.setPosition(this.centerx_val - cardsbounds.width * 0.5, this.centery_val - cardsbounds.height * 0.4);
        //SHUFFLE CARDS
        this.cards_ctr.shuffle();
        for(let v=0; v<this.cards_ctr.length; v++){
            this.cards_ctr.getAt(v).setPosition(positions[v][0],positions[v][1])
        }
        //RESET VARIABLES
        bounds, space_val, ccnt = null, null, null;
        cx, cy, gridsize, cardsbounds = null, null, null, null;
        carddata, cardpairs, taskdata = null, null, null;
        positions = null;
    },

    enableinteractive: function(object){
        let thisclass = this;
        object.on('pointerdown',function(pointer, dragX, dragY, event){
            thisclass.active_card = this;
        });
        object.on('pointerup',function(pointer, dragX, dragY, event){
            if(thisclass.active_card != null && thisclass.active_card == this){
                if(thisclass.first_card == null){
                    thisclass.first_card = this;
                    this.last.alpha = 0.01;
                }else if(thisclass.first_card != this){
                    if(thisclass.second_card == null){
                        thisclass.second_card = this;
                        this.last.alpha = 0.01;
                        thisclass.checkresult();
                    }
                }
            }else{
                thisclass.active_card = null;
            }
        });
    },

    //RESET OPEN CARDS
    resetopencard: function(flag){
        if(flag){
            if(this.first_card != null){
                this.first_card.last.alpha = 1;
            }
            if(this.second_card != null){
                this.second_card.last.alpha = 1;
            }
        }
        this.second_card = null;
        this.first_card = null;
    },

    //CHECK RESULT
    checkresult: function(){
        let thisclass = this;
        if(this.first_card != null && this.second_card != null){
            if(this.first_card.index == this.second_card.index){
                //CORRECT FOUND
                this.cardopened_val ++;
                this.playrightsnd();
                let cardmat = this.second_card.getWorldTransformMatrix();
                this.showsparkle(true,{x: cardmat.getX(0,0), y: cardmat.getY(0,0)});
                //RESET
                let cdelay = this.CONFIG.BOX.CORRECT_DELAY || 1;
                this.cardclose_tmr = this.cleartimer(this.cardclose_tmr);
                this.cardclose_tmr = this.time.addEvent({
                    delay: (cdelay * 1000),               
                    callback:()=>{
                        thisclass.resetopencard(false);
                    },
                    loop: false,
                });
                cardmat, cdelay = null, null;
                //COMPARE CARD OPENED
                if(this.cardopened_val >= this.totalcard_val){
                    //GAME END
                    console.log("Game End!");
                    this.gameend_bol = true;
                }
            }else{
                //CLOSE CARDS
                this.playwrongsnd();
                let cdelay = this.CONFIG.BOX.CLOSE_DELAY || 1;
                this.cardclose_tmr = this.cleartimer(this.cardclose_tmr);
                this.cardclose_tmr = this.time.addEvent({
                    delay: (cdelay * 1000),               
                    callback:()=>{
                        thisclass.resetopencard(true);
                    },
                    loop: false,
                });
                cdelay = null;
            }
        }
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
        this.creatememorygrid();
    },

    // Game Methods //

    //Preload function
    preload: function(){
        this.applang_val = this.CONFIG.LANG || "";
        this.applang_val = this.applang_val.toLowerCase();
        if(this.applang_val != null && this.applang_val != ""){
            this.load.script('TDictJS', "scripts/dictionary/letter_"+(this.applang_val)+".js");
            this.load.script('TDataJS', 'scripts/data/letter_'+(this.applang_val)+'.js');
            this.load.script('IDictJS', 'scripts/dictionary/image_'+(this.applang_val)+'.js');
            this.load.script('IDataJS', 'scripts/data/image_'+(this.applang_val)+'.js');
        }
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
    },

    //update function
    update: function(){

    },

}