var canvas = document.getElementById("gameScreen"),
    ctx = canvas.getContext("2d"),
    smileys = [];
var bX = 10;
var bXStep = 1;
var bYStep = 1;
var bY = 0;

canvas.width = canvas.height = 540;
var colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"];

function imageLoaded(ev) {
    //element = document.getElementById("cancan");
    //c = element.getContext("2d");

    im = ev.target; // the image
	
	
    // read the width and height of the canvas
    width = 540;
    height = 540;

    // stamp the image on the left of the canvas:
    //ctx.drawImage(im, 0, 0);

}

function makeImageSprite() {
    var canvasTemp = document.createElement("canvas");
    var tCtx = canvasTemp.getContext("2d");
    canvasTemp.width = canvasTemp.height = 150;
	
	tCtx.drawImage(spriteImage, 0, 0, 150, 150);
	var imageData = tCtx.getImageData(0, 0, 150, 150);
    var data = imageData.data;

        // iterate over all pixels
    for(var i = 0, n = data.length; i < n; i += 4) {
        var red = data[i];
        var green = data[i + 1];
        var blue = data[i + 2];
        var alpha = data[i + 3];
		if( red < 20 && green < 20 && blue < 20 )
			data[i+3] = 0;
		else
			data[i+3] = 255;
		//data[i] = 255-red;
    }
	tCtx.putImageData(imageData, 0, 0);
	var anim = [tCtx, tCtx, tCtx, tCtx];
	return anim;
}

function makeAnimatedSprite(color){
    // cache the smiley
    var canvasTemp = document.createElement("canvas");
    var canvasTemp2 = document.createElement("canvas");
    var canvasTemp3 = document.createElement("canvas");

    var tCtx = canvasTemp.getContext("2d");
    canvasTemp.width = canvasTemp.height = 150;

    tCtx.fillStyle = color;//colors[parseInt(Math.random() * colors.length)];
    tCtx.beginPath();
    tCtx.arc(75,75,30,0,Math.PI*2,true); // Outer circle
    tCtx.fill();
    tCtx.closePath();

	/*  */
    tCtx.beginPath();
    tCtx.moveTo(110,75);
    tCtx.arc(75,75,25,0,Math.PI,false);   // Mouth
    tCtx.closePath();
    tCtx.fillStyle = "#000";
    tCtx.fill();

    tCtx.beginPath();    
    tCtx.moveTo(65,65);
    tCtx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
    tCtx.moveTo(95,65);
    tCtx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
    tCtx.closePath();
    tCtx.fill();
	
    var tCtx3 = canvasTemp3.getContext("2d");
    canvasTemp3.width = canvasTemp3.height = 150;

    tCtx3.fillStyle = color;//colors[parseInt(Math.random() * colors.length)];
    tCtx3.beginPath();
    tCtx3.arc(75,75,30,0,Math.PI*2,true); // Outer circle
    tCtx3.fill();
    tCtx3.closePath();

	/*  */
    tCtx3.beginPath();
    tCtx3.moveTo(110,75);
    tCtx3.arc(75,75,20,0*Math.PI,Math.PI);   // Mouth
    tCtx3.closePath();
    tCtx3.fillStyle = "#000";
    tCtx3.fill();

    tCtx3.beginPath();    
    tCtx3.moveTo(65,65);
    tCtx3.arc(60,65,5,0,Math.PI*2,true);  // Left eye
    tCtx3.moveTo(95,65);
    tCtx3.arc(90,65,5,0,Math.PI*2,true);  // Right eye
    tCtx3.closePath();
    tCtx3.fill();
	
    var tCtx2 = canvasTemp2.getContext("2d");
    canvasTemp2.width = canvasTemp2.height = 150;

    tCtx2.fillStyle = color;//tCtx.fillStyle;//colors[parseInt(Math.random() * colors.length)];
    tCtx2.beginPath();
    tCtx2.arc(75,75,30,0,Math.PI*2,true); // Outer circle
    tCtx2.fill();
    tCtx2.closePath();

	/*  */
    tCtx2.beginPath();
    tCtx2.fillStyle = "#000";
    tCtx2.moveTo(100,75);
    tCtx2.lineTo(50,75);   // Mouth
	tCtx2.stroke();
    tCtx2.closePath();
    //tCtx.fill();
	
    tCtx2.fillStyle = "Black";
    tCtx2.beginPath();    
    tCtx2.moveTo(65,65);
    tCtx2.arc(60,65,5,0,Math.PI*2,true);  // Left eye
    tCtx2.moveTo(95,65);
    tCtx2.arc(90,65,5,0,Math.PI*2,true);  // Right eye
    tCtx2.closePath();
    tCtx2.fill();
	var anim = [tCtx, tCtx3, tCtx2,tCtx3];

	return anim;
}

function update(){
    //ctx.clearRect(0,0,540,540);
    ctx.drawImage(backgroundImage, bX, bY, 540, 540);
	bX += bXStep;
	bY += bYStep;
	if( bX > 20 || bX < -20 )
		bXStep = -bXStep;
	if( bY > 20 || bY < -20 )
		bYStep = -bYStep;
	for(var i = 0, len = smileys.length; i < len; i++){
        smileys[i].x += smileys[i].xStep;
        smileys[i].y += smileys[i].yStep;
		if( smileys[i].x <= 0 || smileys[i].x >= 400 )
			smileys[i].xStep = -smileys[i].xStep;
		if( smileys[i].y <= 0 || smileys[i].y >= 400 )
			smileys[i].yStep = -smileys[i].yStep;
			
		smileys[i].frameTick++;
		if( smileys[i].frameTick > smileys[i].frameLength[smileys[i].frame] )
		{
			smileys[i].frameTick = 0;
			smileys[i].frame++;
			if( smileys[i].frame >= smileys[i].frames )
				smileys[i].frame = 0;
		}
		//if( i % 2 == 0 )
			ctx.drawImage(smileys[i].sprite[smileys[i].frame].canvas, smileys[i].x, smileys[i].y);
        //else
		//	ctx.drawImage(spriteImage, smileys[i].x, smileys[i].y, 100, 100 );
    }
    setTimeout(update,10);
}
var backgroundImage = new Image();
backgroundImage.onload = imageLoaded;
backgroundImage.width = 540;
backgroundImage.src = "mario.jpg";

var spriteImage = new Image();
spriteImage.onload = imageLoaded;
spriteImage.src = "galaga.jpg";
spriteImage.width = 540;

//init smileys
for(var i = 0; i < 40; i++){
    smileys[i] ={};
    smileys[i].x = Math.random()*400;
    smileys[i].y = Math.random()*400;
	if( i % 2 == 0 )
		smileys[i].sprite = makeAnimatedSprite(colors[i%colors.length]);
	else
		smileys[i].sprite = makeImageSprite();
	smileys[i].frame = parseInt(Math.random() * 4);
	smileys[i].frames = 4;
	smileys[i].frameLength = [20, 8, 50, 8];
	smileys[i].frameTick = parseInt(Math.random() * smileys[i].frameLength[smileys[i].frame]);
	smileys[i].xStep = 4 - Math.random() * 8;
	smileys[i].yStep = 4 - Math.random() * 8;
}


update();