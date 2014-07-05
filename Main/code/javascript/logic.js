	
    
    var stage; 
	var cells;
	var sprites;
    var spriteColors = ["Red", "Green", "Blue","Yellow", "Orange", "Purple"];
	var screenWidth = 600;
	var screenHeight = 650;
	var gridX = 12;
	var gridY = 13;
	var fillRow = gridY - 1;
	var fillRowX = 0;
	var spriteCount = 0;
	var pause = 0;
	
	var	gridWidth = screenWidth / gridX;
	var gridHeight = screenHeight / gridY;
	var clicked = false;
	
	function pauseGame()
	{
		pause = 1-pause;
	}
	
		
        function init() 
		{
            // code here.
			alert( supportsAudio());
        	stage = new createjs.Stage("canvas");
			var htmlStage = document.getElementById("canvas");
			htmlStage.width = screenWidth;
			htmlStage.height = screenHeight;
			
			
			//stage.graphics.beginFill("aqua");
			sprites = [];
			cells = new Array(gridY); ;
			var i = 0;
			
			for( var r=0; r<=fillRow; r++ ) 
			{
				cells[r] = new Array(gridX);
				for( var c=0; c<gridX; c++ )
				{
					cells[r][c] = new Object();
					cells[r][c].x = c * gridWidth + gridWidth/2;
					cells[r][c].y = r * gridHeight + gridHeight/2;

					cells[r][c].sprite = null;
					cells[r][c].transition = 0;
					
					if( r < fillRow && r > fillRow - 3)
					{
						sprites[spriteCount] = createSprite(r, c);
						cells[r][c].sprite = sprites[spriteCount];
						spriteCount++;
					}
				}
			}
			document.getElementById("canvas").onclick=function(e) {
				
				var gx, gy;
				
				gx = parseInt(e.clientX / gridWidth);
				gy = parseInt(e.clientY / gridHeight);
				
				if( gy == fillRow || cells[gy][gx].sprite == null )
					return;
				clicked = true;
													
				var removed = stage.removeChild(cells[gy][gx].sprite.circle);
				if( !removed )
					alert( "Shape not removed!!" );
				cells[gy][gx].sprite.circle = null;
				cells[gy][gx].sprite.x = 0;
				cells[gy][gx].sprite.y = 0;
				cells[gy][gx].sprite = null;
				
				var prevY;
				
				for( prevY=gy-1;prevY >= 0;prevY-- )
				{
					if(cells[prevY][gx].sprite == null)
					{
						continue;
					}
					var destY = fillRow-1;
					while( cells[destY][gx].sprite != null || cells[destY][gx].transition != 0)
					{
						destY--;
					}
					cells[prevY][gx].sprite.stepX = (cells[destY][gx].x - cells[prevY][gx].x) / 10;
					cells[prevY][gx].sprite.stepY = (cells[destY][gx].y - cells[prevY][gx].y) / 10;
					cells[prevY][gx].sprite.lifeTime = 10;
					cells[prevY][gx].sprite.cellC = gx;
					cells[prevY][gx].sprite.cellR = destY;
					cells[prevY][gx].sprite.active = true;
					cells[destY][gx].transition = 1;
					cells[prevY][gx].sprite = null;
					gy = prevY;
					//prevY--;
				}
				clicked = false;
			};
			
			
			setInterval( function() {
				if( pause > 0 || clicked == true ) return;
				clicked = true;
				if( fillRowX == gridX )  //filled in bottom row
				{
					fillRowX = 0;
					/* push up */
					for( var r = 1000; r<gridY; r++ )
					{
						for( var c=0; c<gridX; c++ )
						{
							cells[r-1][c].sprite = cells[r][c].sprite;
							cells[r-1][c].transition = cells[r][c].transition;
						}
					}
					for( var i=spriteCount; i<spriteCount; i++ )
					{
						if( sprites[i] != null && sprites[i].circle != null )
							sprites[i].circle.y -= gridHeight;						
					}
				}
				else	if( fillRowX < gridX )
				{
					sprites[spriteCount] = createSprite(fillRow, fillRowX);
					cells[fillRow][fillRowX].sprite = sprites[spriteCount];
					spriteCount++;
					fillRowX = fillRowX + 1;
				}
				clicked = false;
			}, 300);
			
			setInterval(function()
			{
				if( clicked || pause > 0 )
					return;
				for( var i = 0; i<sprites.length; i++ )
				{
					if( sprites[i].active == false )
						continue;
					sprites[i].lifeTime--;
					if( sprites[i].lifeTime <= 0 )
					{
						sprites[i].active = false;
						var r = sprites[i].cellR;
						var c = sprites[i].cellC;
						cells[r][c].sprite = sprites[i];
						cells[r][c].transition = 0;
					}
					sprites[i].circle.x = sprites[i].circle.x + sprites[i].stepX;
					sprites[i].circle.y = sprites[i].circle.y + sprites[i].stepY;
				}
				stage.update();
			},20);			
		}
