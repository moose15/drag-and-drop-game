"use strict";
// http://jsfiddle.net/m1erickson/n6U8D/

// VARIABLES
var canvas;
var ctx;
var canvasOffset;
var offsetX;
var offsetY;

var isDown = false;
var startX;
var startY;

var circle;
var rect;
var imageObj;

var HEIGHT=window.innerHeight-100;
var WIDTH= window.innerWidth;

var mouseX;
var mouseY;

// var doneBtn;
var doneBtnImg;
var playBtnImg;
var continueBtnImg;
var creditsBtnImg;
var goBackMenuBtnImg;

// game screens
var showMenu=true;
var showGame=false;
var showCredits=false;
var showInstructions=false;
var showGameOver=false;

//arrays
var rectangles=[];
var circles=[];
var temp=["images/marley.jpg"];
var wordImages=[];

var numMatches=3;
var gameIsOver=false;
var runUpdate;

var wordsStartingPosX=50;
var wordsStartingPosY=200;

var menuBgImg;
var gameBgImg;

var buttonHeight=50;
var buttonWidth=100;

var timerStarted=false;

var loadedMenuBgImg;
var loadedPlayBtnImg;
var loadedCreditsBtnImg;
var loadedGoBackBtnImg;
var loadedContinueBtnImg;
var loadedDoneBtnImg;

var temp2=[];
var timer;
var timerTime=10;
var interval;
var winningTime;
//initialize function
function init(){
	//grab the canvas and set up context
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	//set canvas height and width
	canvas.height= HEIGHT;
	canvas.width= WIDTH;

	// set the offset. This will be used for detecting collisions
	canvasOffset = $("#canvas").offset();
	offsetX = canvasOffset.left;
	offsetY = canvasOffset.top;
	startX;
	startY;

	// event listeners

	// create and event listener for the buttons
	// so far it's only the done btn
	document.addEventListener('click', function(e) {
	        // console.log('click: ' + e.offsetX + '/' + e.offsetY);
	        // see if the click collides with the button
	        if(showGame){
	        	var donePressed = collides(doneBtnImg, e.offsetX, e.offsetY);
	    	}
	    	else if(showMenu){
	    		var playPressed = collides(playBtnImg, e.offsetX, e.offsetY);
	    		var creditsPressed = collides(creditsBtnImg, e.offsetX, e.offsetY);
	    	}
	        else if(showInstructions){
	        	var continuePressed = collides(continueBtnImg, e.offsetX, e.offsetY);

	    	}
	        else if(showCredits || showGameOver){
	        	var goBackPressed = collides(goBackMenuBtnImg, e.offsetX, e.offsetY);
	    	}
	        ///if it collides, check to see if the images match their respective squares
	        // if they do, end the game. Else, keep going
	        if(playPressed){
	        	showInstructions=true;
	        	showMenu=false;
	        	// console.log("play pressed");
	        }
	        if(creditsPressed){
	        	showCredits=true;
	        	showMenu=false;
	        	// console.log("credits pressed");
	        }
	        if(goBackPressed){
	        	showMenu=true;
	        	showCredits=false;
	        	showGameOver=false;
	        	gameIsOver=false;
	        	// console.log("goBackPressed");
	        }
	        if(continuePressed){
	        	showGame=true;
	        	showInstructions=false;
	        	startTimer();
	        	// console.log("continue pressed");
	        }

	        if (donePressed) {
	            if(wordImages.every(winCond)){
					gameIsOver=true;
					showGame=false;
					showGameOver=true;
					stopTimer(timer);
				}
	        } else {
	            // console.log('no collision');
	        }
	}, false);


	// document.addEventListener('mouseover', function(e) {
 //        // console.log('click: ' + e.offsetX + '/' + e.offsetY);
 //        // see if the click collides with the button
 //        if(showGame){
 //        	var doneHover = collides(doneBtnImg, e.offsetX, e.offsetY);
 //    	}
 //    	else if(showMenu){
 //    		var playHover = collides(playBtnImg, e.offsetX, e.offsetY);
 //    		var creditsHover = collides(creditsBtnImg, e.offsetX, e.offsetY);
 //    	}
 //        else if(showInstructions){
 //        	var continueHover = collides(continueBtnImg, e.offsetX, e.offsetY);
 //    	}
 //        else if(showCredits || showGameOver){
 //        	var goBackHover = collides(goBackMenuBtnImg, e.offsetX, e.offsetY);
 //    	}
 //        ///if it collides, check to see if the images match their respective squares
 //        // if they do, end the game. Else, keep going
 //        if(playHover){
 //        	playBtnImg.img="images/marley.jpg";
 //        	console.log("Playbtn mouse over");
 //        }
 //        if(creditsHover){
 //        	creditsBtnImg.img="images/marley.jpg"
 //        }
 //        if(goBackHover){
 //        	goBackMenuBtnImg.img="images/marley.jpg"
 //        }
 //        if(continueHover){
 //        	continueBtnImg.img="images/marley.jpg"
 //        }

 //        if (doneHover) {
 //        	doneBtnImg.img="images/marley.jpg"
 //        }
	// }, false);

	$("#canvas").mousedown(function (e) {
    	handleMouseDown(e);
	});
	$("#canvas").mousemove(function (e) {
	    handleMouseMove(e);
	});
	$("#canvas").mouseup(function (e) {
	    handleMouseUp(e);
	});
	$("#canvas").mouseout(function (e) {
	    handleMouseOut(e);
	});


		//inititalize buttons
		// doneBtn=document.querySelector("#doneBtn");

	// create rectangle objects
	for(var i=0; i<numMatches;i++){
		var xPosition = 250*i;
		var obj= rectangle(i,50+xPosition,300,100,100,"blue");
		rectangles.push(obj);
	}

	// create image objects
	for(var i=0; i<numMatches;i++){
		// var randNumX= Math.random()*WIDTH-10;
		// var randNumY= Math.random()*HEIGHT-10;
		var xPosition = 250*i;
		var obj= makeImageObj(i,wordsStartingPosX+xPosition,wordsStartingPosY,50,50,temp[0],false,false);
		wordImages.push(obj);
		// console.log("rectangle length:"+ rectangles);
	}

	//timer
	var halfW= WIDTH/2;
    timer = document.querySelector('#timer');
    $("#timer").hide();
   	timer.style.position="absolute";
   	timer.style.right=halfW+"px";
   	timer.style.top=HEIGHT*(1/10)+"px";
   	// timer.style.maxWidth=halfW+"px";


	//make done button object
	doneBtnImg=makeButton(WIDTH*(2/3),HEIGHT*(5/6),buttonWidth,buttonHeight,"images/RIT_tiger.jpg");
	playBtnImg=makeButton(WIDTH*(2/3),HEIGHT*(1/6),buttonWidth,buttonHeight,"images/RIT_tiger.jpg");
	creditsBtnImg=makeButton(WIDTH*(2/3),HEIGHT*(2/6),buttonWidth,buttonHeight,"images/RIT_tiger.jpg");
	continueBtnImg=makeButton(WIDTH/2-(buttonWidth/2),HEIGHT*(5/6),buttonWidth,buttonHeight,"images/RIT_tiger.jpg");
	goBackMenuBtnImg=makeButton(WIDTH/2-(buttonWidth/2),HEIGHT*(5/6),buttonWidth,buttonHeight,"images/RIT_tiger.jpg");

	menuBgImg=makeBgImg(0,0,WIDTH,HEIGHT,"images/testBG.png");
	gameBgImg=makeBgImg(0,0,WIDTH,HEIGHT,"images/testBG.png");

		//load images
	loadedMenuBgImg= loadImage(menuBgImg);
	loadedPlayBtnImg= loadImage(playBtnImg);
	loadedCreditsBtnImg=loadImage(creditsBtnImg);
	loadedGoBackBtnImg= loadImage(goBackMenuBtnImg);
	loadedContinueBtnImg= loadImage(continueBtnImg);
	loadedDoneBtnImg=loadImage(doneBtnImg);

	// draw the draggable images
	for(var i=0; i<wordImages.length;i++){
		var loadedWord=loadImage(wordImages[i]);
		// console.log(loadedWord);
		temp2.push(loadedWord);

	}
	// console.log("Temp array:"+temp);

	update();

}

function loadImage(g){
	var i= new Image();
	i.src=g.img;

	return i;
}
// update function
function update(){

	// draw the assets on the screen
	draw();
	console.log("1:"+wordImages[0].isCor + "2:"+wordImages[1].isCor + "3:"+wordImages[2].isCor);
	console.log("Image1 X:"+ wordImages[0].xPos+ "  Image1 Y:" + wordImages[0].xPos);
	// if the game is over, stop the game.
	// Else, continue checking the cnavas for any updates


	//win condition
	if(gameIsOver){
		// console.log("game over");
		resetGame();
		// stop();
	}
	// else{
	// 	runUpdate=window.requestAnimationFrame(update);
	// }
		//runUpdate=window.requestAnimationFrame(update);
	runUpdate=window.requestAnimationFrame(update);

}

// function buttons(){
// 	doneBtn.onclick=function(){
// 		console.log("button pressed");
// 	};
// }

//draw function. Draws to the screen
function draw() {

	if(showMenu){
		clear();

		ctx.drawImage(loadedMenuBgImg,menuBgImg.xPos,menuBgImg.yPos,menuBgImg.w,menuBgImg.h);

		ctx.drawImage(loadedPlayBtnImg,playBtnImg.xPos,playBtnImg.yPos,playBtnImg.w,playBtnImg.h);

		ctx.drawImage(loadedCreditsBtnImg,creditsBtnImg.xPos,creditsBtnImg.yPos,creditsBtnImg.w,creditsBtnImg.h);

	// wordsStartingPosX
		// gameIsOver=false;

	}
	else if(showCredits){
		clear();

		ctx.drawImage(loadedMenuBgImg,menuBgImg.xPos,menuBgImg.yPos,menuBgImg.w,menuBgImg.h);

		ctx.drawImage(loadedGoBackBtnImg,goBackMenuBtnImg.xPos,goBackMenuBtnImg.yPos,goBackMenuBtnImg.w,goBackMenuBtnImg.h);
	}
	else if(showInstructions){
		clear();

		ctx.drawImage(loadedMenuBgImg,menuBgImg.xPos,menuBgImg.yPos,menuBgImg.w,menuBgImg.h);

		ctx.drawImage(loadedContinueBtnImg,continueBtnImg.xPos,continueBtnImg.yPos,continueBtnImg.w,continueBtnImg.h);

	}
	else if(showGame){
		// first clear the canvas from the previous update
		clear();

		if(!timerStarted){
			$("#timer").show();
			startTimer(timerTime, timer);
			timerStarted=true;
		}
		ctx.drawImage(loadedMenuBgImg,gameBgImg.xPos,gameBgImg.yPos,gameBgImg.w,gameBgImg.h);
		// draw the rectangles
		for(var i=0; i<rectangles.length;i++){
			ctx.save();
			// ctx.fillStyle = "skyblue";
			ctx.fillStyle=rectangles[i].c;
			ctx.fillRect(rectangles[i].xPos, rectangles[i].yPos, rectangles[i].w, rectangles[i].h, rectangles[i].c);
			ctx.restore();
		}

		//draw the buttons

		ctx.drawImage(loadedDoneBtnImg,doneBtnImg.xPos,doneBtnImg.yPos,doneBtnImg.w,doneBtnImg.h);

		//draw the draggable images
		for(var i=0; i<wordImages.length;i++){
			var wI=wordImages[i];
			ctx.drawImage(temp2[i],wI.xPos,wI.yPos,wI.w,wI.h);

		}
	}
	else if(showGameOver){
		clear();

		ctx.drawImage(loadedMenuBgImg,menuBgImg.xPos,menuBgImg.yPos,menuBgImg.w,menuBgImg.h);

		ctx.drawImage(loadedGoBackBtnImg,goBackMenuBtnImg.xPos,goBackMenuBtnImg.yPos,goBackMenuBtnImg.w,goBackMenuBtnImg.h);

	}

}
//http://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
function startTimer(duration, display) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since 
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds; 

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }
        if(display.textContent=="00:00"){
        	// gameIsOver=true;
        	// showGameOver=true;
        	// showGame=false;
        	stopTimer(timer);
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    interval=setInterval(timer, 1000);
}

function stopTimer(display){
	clearInterval(interval);
	timerStarted=false;
	winningTime=display.textContent;
		//timer
    $("#timer").hide();
}
// if reset, reset the positions of the words
function resetGame(){
		// create image objects
		for(var i=0; i<wordImages.length;i++){
			// var randNumX= Math.random()*WIDTH-10;
			// var randNumY= Math.random()*HEIGHT-10;
			var w = wordImages[i];
			// var xPosition = 100;
			var xPosition = 250*i;
			console.log("in reset function");
			w.posX= wordsStartingPosX+xPosition+400;
			w.posY = wordsStartingPosY;
			w.isCorrect=false;

			ctx.fillStyle="blue";
			console.log("wordsStartingPosX"+ wordsStartingPosX);
			// con}ole.log("rectangle length:"+ rectangles);
		}
}
// return true if the rectangle and image are colliding
function RectCircleColliding(rect,i) {

	// find the distance of X and Y
	//checks if the rect (rectangle) and i (image) are colliding based on the 
	//distance formula
    var distX = Math.abs(i.xPos - rect.xPos - rect.w / 2);
    var distY = Math.abs(i.yPos - rect.yPos - rect.h / 2);

    if (distX > (rect.w / 2 + i.w)) {
        return false;
    }
    if (distY > (rect.h / 2 + i.w)) {
        return false;
    }

    if (distX <= (rect.w / 2)) {
        return true;
    }
    if (distY <= (rect.h / 2)) {
        return true;
    }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;

    if(dx * dx + dy * dy <= (i.w * i.h)){
    	return true;
    }
    //else do nothing
    else{

    }
}

// checks to see if a click collides with a button
// http://jsfiddle.net/9WWqG/2/
function collides(rects, x, y) {
    var isCollision = false;
    // for (var i = 0, len = rects.length; i < len; i++) {
        var left = rects.xPos, right = rects.xPos+rects.w;
        var top = rects.yPos, bottom = rects.yPos+rects.h;
        if (right >= x
            && left <= x
            && bottom >= y
            && top <= y) {
            isCollision = rects;
        }
    // }
    return isCollision;
}


// handle mouse down event listener
function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
    isDown=true;

    // see if mouse is selecting one of the images
	for(var i=0; i<wordImages.length;i++){

	   	var wx = startX - wordImages[i].xPos;
	    var wy = startY - wordImages[i].yPos;

	    if(wx * wx + wy * wy < wordImages[i].w * wordImages[i].h){
	    	wordImages[i].isDrag=true;
	    }
	}
}
// handle mouse up event listener
function handleMouseUp(e) {
    e.preventDefault();
    isDown = false;

    for(var i=0; i<wordImages.length;i++){
    	wordImages[i].isDrag=false;
    }
}

// handle mouse out event listener
function handleMouseOut(e) {
    e.preventDefault();
    isDown = false;
}
// handle mouse move event handler
function handleMouseMove(e) {
    e.preventDefault();

    if (!isDown) {
        return;
    }
    // determine if the image was moved into a square
    // ie see if a square and image are colliding
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);
    var dx = mouseX - startX;
    var dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;
    for(var i=0; i<wordImages.length;i++){
		if(wordImages[i].isDrag){

		    wordImages[i].xPos += dx;
		    wordImages[i].yPos += dy;
			for(var j=0; j<wordImages.length;j++){
				//check for collisions. Also check to see if the image matches its respective square
				if (RectCircleColliding(rectangles[j],wordImages[i]) && conditionals(rectangles[j],wordImages[i])){

			        break;
				}
				//else, the image is not in the correct square
				else{
					wordImages[i].isCor=false;
				}
			}
		}
	}
	// call draw
    draw();
    // set vars back to mouse position
    startX = mouseX;
    startY = mouseY;
}


// start the game;
function start() {
    if (!runUpdate) {
       update();
    }
}
//stop the game
function stop() {
    if (runUpdate) {
       window.cancelAnimationFrame(runUpdate);
       runUpdate = undefined;
    }
}
// checks for win condition
// if all the values in the array are equal to true,
// then all images are on their respective squares
function winCond(value,index,ar){
	if(value.isCor==true){
		return true;
	}
	else{
		return false;
	}

}

//checkes to see if the image matches it's rectangle
// if it is correct, the rectablge turns light blue
function conditionals(b,c){

	if(c.n==b.n){
		b.c="skyblue";
		c.isCor=true;
		return true;
	}
	else{
		return false;
	}
}

//clears the canvas
function clear(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//makes rectangle objects
function rectangle(name,x,y,width,height, color){
	rect={
		n:name,
		xPos: x,
		yPos: y,
		w: width,
		h: height,
		c:color
	};

	return rect;
}
//makes image objects
// the name variable must match the name variable in the rectangle object
// if this happens, isCor (isCorrect), turns true
// if for all images isCor=true, then the game ends.
function makeImageObj(name,x,y,width,height,image,isDragging,isCorrect){
	imageObj={
		n:name,
		xPos:x,
		yPos:y,
		w:width,
		h:height,
		img:image,
		isDrag:isDragging,
		isCor:isCorrect
	}
	return imageObj;
}

function makeButton(x,y,width,height,image){
	var button={
			xPos:x,
			yPos:y,
			w:width,
			h:height,
			img:image
		};
	return button;
}

function makeBgImg(x,y,width,height,image){
	var bgImg={
			xPos:x,
			yPos:y,
			w:width,
			h:height,
			img:image
		};
	return bgImg;
}
// makes circle objects (testing only)
function makeCircle(name,x,y,radius,color,isDragging,isCorrect){
	circle={
		n:name,
		xPos: x,
		yPos:y,
		r:radius,
		c:color,
		isDrag:isDragging,
		isCor:isCorrect
	};

	return circle;
}

// call init when window loads
window.onload=init;
