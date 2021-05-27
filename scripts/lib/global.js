//GLOBAL Variable
let Global = {}

//Property
Global.debug = false;

//Method
Global.Log = function(msg){
    if(this.debug){
        console.log(msg);
    }
}

Global.Shuffle = function (array) {
    if(array.length > 0){
        array.sort(() => Math.random() - 0.5);
    }
}

Global.GetRandomInt = function(max) {
    return (Math.floor(Math.random() * max));
}

Global.GetLength = function(arr){
    let cnt = 0;
    if(arr != null){
        for(const key in arr){
            cnt = cnt + 1;
        }
    }
    return cnt;
}

Global.GetLetterText = function(lang, txt){
    lang = lang.toLowerCase();
    if( Letter != null && lang != null ){
        if( Letter[lang] != null && Letter[lang][txt] != null ){
            return Letter[lang][txt];
        }
    }
    return txt;
}