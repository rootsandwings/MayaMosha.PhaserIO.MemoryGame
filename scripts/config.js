const APPCONFIG = {
    ID: "CONFIG1",
    //MENU BUTTONS
    MENU: {
        BTN: {
            HOME:{
                ID: "MENU-HOME",
                PATH: 'assets/images/btn/home.png',
                POS:{
                    X: 0.05, // 0.16% of stage width
                    Y: 0.10,  // 0.09% of stage height
                }
            },
            REPLAY:{
                ID: "MENU-REPLAY",
                PATH: 'assets/images/btn/replay.png',
                POS:{
                    X: 0.145,
                    Y: 0.10,
                }
            },
            CLOSE:{
                ID: "MENU-CLOSE",
                PATH: 'assets/images/btn/close.png',
                POS:{
                    X: 0.935,
                    Y: 0.10,
                }
            },
        },
    },
    //TIMER
    GTIMER: {
        ID: "GTIMER",
        PATH: "assets/images/timer.png",
        POS:{
            X: 0.82,
            Y: 0.10,
        },
        FONT: {
            ID: "ROBOTO-BOLD",
            PATH: "assets/fonts/Roboto_Bold.png",
            XML: "assets/fonts/Roboto_Bold.xml"
        },
    },
    //GAME SPARKLE
    SPARKLE: {
        ID: "SPARKLE",
        PATH: "assets/sprite/sparkle.png",
        JSON: "assets/sprite/sparkle.json",
        FRAME_RATE: 8, //ANIMATION SPEED
    },
    //CELEBRATION
    CELEBRATION: {
        ANIMATION:{
            ID: "CELEBRATION",
            PATH: "assets/sprite/celebration.png",
            JSON: "assets/sprite/celebration.json",
        },
        SOUNDS: {
            MAIN: { ID: "CELEBRATION", PATH: "assets/sounds/common/celebration.mp3", VOLUME: 0.6 }
        }
    },
    //SUMMARY WINDOW
    SUMMARY: {
        SOUNDS: {
            CORRECT1: { ID: 'CORRECT1', PATH: "assets/sounds/common/FGSummary.m4a" },
            WRONG1: { ID: 'WRONG1', PATH: "assets/sounds/common/VOTryAgain.m4a" }
        },
        DELAY: 2000, //Delay on showing summary window
        FONTS: {
            ROBOTO_REG: {
                ID: "ROBOTO-REG",
                PATH: "assets/fonts/Roboto_Reg.png",
                XML: "assets/fonts/Roboto_Reg.xml"
            },
            ROBOTO_BOLD: {
                ID: "ROBOTO-BOLD",
                PATH: "assets/fonts/Roboto_Bold.png",
                XML: "assets/fonts/Roboto_Bold.xml"
            }
        },
        //NEGATIVE WINDOW
        NEGATIVE:{
            ID: "NEGATIVE",
            IMAGES: {
                IMG1: { ID: "mosha_fainting", PATH: "assets/images/summary/mosha_fainting.png"},
                IMG2: { ID: "ohuh", PATH: "assets/images/summary/ohuh.png"},
                IMG3: { ID: "tryagain", PATH: "assets/images/summary/tryagain.png"}
            },
            BG_ALPHA: 0.8,
            TIME: 5000
        },
        //POSITIVE WINDOW
        POSITIVE:{
            ID: "POSITIVE",
            IMAGES: {
                IMG1: { ID: "congratulations", PATH: "assets/images/summary/congratulations.png"},
                IMG2: { ID: "mosha_happy", PATH: "assets/images/summary/mosha_happy.png"},
                IMG3: { ID: "star_golden", PATH: "assets/images/summary/star_golden.png"},
                IMG4: { ID: "star_white", PATH: "assets/images/summary/star_white.png"}
            },
            BG_ALPHA: 0.8,
            TIME: 8000
        },
        //NEXT WINDOW
        NEXT:{
            ID: "NEXT",
            IMAGES: {
                IMG1: { ID: "challenge", PATH: "assets/images/summary/challenge.png"},
                IMG2: { ID: "mosha_standing", PATH: "assets/images/summary/mosha_standing.png"},
                IMG3: { ID: "yes", PATH: "assets/images/summary/yes.png"},
                IMG4: { ID: "notnow", PATH: "assets/images/summary/notnow.png"},
                IMG5: { ID: "woohoo", PATH: "assets/images/summary/woohoo.png"}
            },
            BG_ALPHA: 0.8
        }
    }
}