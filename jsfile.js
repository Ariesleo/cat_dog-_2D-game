var dog;
var max = 560;
var min = 0;
var catimg;
var score;
var high_score;
var high_score_msg;
var game_over_msg;
var restart_game;
var back_image;
var score_list = [];
var dog_down;
var dog_up;
var dog_right;


//audio part
const bg_sound = new Audio();
const catscream = new Audio();
const dog_bark = new Audio();

bg_sound.src = "gamesound/bg.wav";
catscream.src = "gamesound/cat_scream.wav";
dog_bark.src = "gamesound/dog_bark.wav";


// StartGame function is invoked whenever the page is load
function startGame(){
    myGameArea.start();

    document.getElementById("restart").style.display = "none";
    
    //generating the cat component at ranom places using max and min value
    catimg = new component(60, 40, "characters/kitten.png", Math.floor(Math.random()*(max-min) + min), Math.floor(Math.random()*(max-min) + min), "image");
    dog = new component(90, 60,"characters/dog.png", myGameArea.canvas.width/2, myGameArea.canvas.height/2, "image");
    back_image = new component(myGameArea.canvas.width,myGameArea.canvas.height, "background/g1.jpg", 0, 0, "image");
    score = new component("20px", "The Serif Hand Light", "yellow", 570, 30, "text");
    game_over_msg = new component("20px", "The Serif Hand Light", "white", myGameArea.canvas.width/2.5, myGameArea.canvas.height/1.5, "text");


    //FUTURE WORK
    //dog_down = new component(30, 30,"characters/dog_down.png", 400, 400, "image");
    //dog_up = new component(30, 30,"characters/dog_up.png", myGameArea.canvas.width/2, myGameArea.canvas.height/2, "image");
    //dog_right = new component(30, 30,"characters/dog_right.png", myGameArea.canvas.width/2, myGameArea.canvas.height/2, "image");
}

//object myGameArea created for the canvas
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function(){
        this.canvas.width = 900;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);


        this.frameNo = 0; //initializing the frameNo value to 0
        this.interval = setInterval(updateGameArea, 7);//update the updateGameArea function every 5 millisecond

        
        this.execute = setTimeout(gameExecute, 10000); //executes the function gameExecute after 2 minutes
        

        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false; 
        })

    },
    clear : function() { //this clear function clears the entire canvas so that it wont leave a trial
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    //stop the game when the time is out
    stop : function() {
        clearInterval(this.interval);
    }
}

//below function is for the cat and dog properties
function component(width, height, color, x, y, type){
    this.type = type;
    if(type == "image"){
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    this.update = function(){ //this update function handle the drawing of component
        ctx = myGameArea.context;

        if (type == "image"){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else if (this.type == "text"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    } 
    
}

//UpdateGameArea function updates every properties and conditions for the defined interval of time
function updateGameArea(){
    bg_sound.play();
    myGameArea.clear(); 
    back_image.update();
    catimg.update();
    dog.speedX = 0;
    dog.speedY = 0;

    if (myGameArea.keys && myGameArea.keys[37]) {  //check the event created by pressing the LEFT arrow key
        if (dog.x == 0){  //the dog component horizontal speed is set to 0 if dog hits the left canvas border
            dog.speedX = 0;
        }else{
            dog.speedX = -3; 
        }
    }

    if (myGameArea.keys && myGameArea.keys[39]) {  //check the event created by pressing the RIGHT arrow key
        if(dog.x + 30 == myGameArea.canvas.width){
            dog.speedX = 0;
        }else{
            dog.speedX = 3; 
        }
    }

    if (myGameArea.keys && myGameArea.keys[38]) {  //check the event created by pressing the UP arrow key
        if (dog.y == 0){
            dog.speedY = 0;
        }else{
            dog.speedY = -3;
        } 
    }

    if (myGameArea.keys && myGameArea.keys[40]) {  //check the event created by pressing the DOWN arrow key
        if(dog.y + 30 == myGameArea.canvas.height){
            dog.speedY = 0;
        }else{
            dog.speedY = 3;
        }
    }
    dog.newPos();
    dog.update();

    //Any arrow keys pressed will increase the frame count as
    if (myGameArea.keys && myGameArea.keys[37] || myGameArea.keys && myGameArea.keys[39] || myGameArea.keys && myGameArea.keys[38] || myGameArea.keys && myGameArea.keys[40]){
        myGameArea.frameNo += 0.05; //using frameNo properties
    }
    
    //identify the distances between the cat and the dog every 5 millisecond or every time the frame updates
    dist = Math.sqrt((catimg.x - dog.x)*(catimg.x - dog.x) + (catimg.y - dog.y)*(catimg.y - dog.y));

    if(dist <= 50){  //this if conditions checks the distance between cat and dog coordinated is less than or euquals to 30 or no and accordingly updates the cat position
        myGameArea.frameNo += 100; //if dog hit cat score value increase by 100
        catscream.play();
        catimg = new component(70, 40, "characters/kitten.png", Math.floor(Math.random()*(max-min) + min), Math.floor(Math.random()*(max-min) + min), "image");
    }
    
    score.text = "SCORE: " + Math.floor(myGameArea.frameNo); //using the floor value to remove the decimal score value
    score.update();

    return myGameArea.frameNo;
}


//below function will get executed and will display top 10 scores
function gameExecute(){
    myGameArea.stop();
    game_over_msg.text = "Game Over: TIMEOUT";
    game_over_msg.update();
    document.getElementById("restart").style.display = "block";


    //below is the code for the score to store in the list
    score_list.push(Math.floor(myGameArea.frameNo));
    var sorted_lst = score_list.sort();
    var sorted_desc_list = sorted_lst.reverse();

    //console.log(score_list[0])
    high_score_msg = new component("20px", "The Serif Hand Light", "yellow", 230, 30, "text");
    high_score_msg.text = "Top 10 scores: ";
    high_score_msg.update();
    var i;
    for (i=0; i<sorted_desc_list.length; i++){
        if (i < 10) {
            console.log(sorted_desc_list[i]);
            high_score = new component("20px", "The Serif Hand Light", "yellow", 350, 30*(i+1), "text");
        
            high_score.text = sorted_desc_list[i];
            high_score.update();
            high_score.newPos();
        }
        else {
            //literally do nothing i.e. will help me to not print undefined unnecessarly
        }
    }
}