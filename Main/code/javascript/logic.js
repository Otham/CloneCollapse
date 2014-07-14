	var stage; 
	var cells;
	var sprites;
    var spriteColors = ["Red", "Green", "Blue","Yellow", "Orange", "Purple"];
	var screenWidth = 600;
	var screenHeight = 650;
	var gridX = 12;
	var gridY = 13;
	var fillRow = 12;
	var fillRowX = 0;
	var spriteCount = 0;
	var pause = 0;	
	var cellRows = 26;
	var cellOffset = 0;
	var path;
	
	var	context2D;
	var	gridWidth = screenWidth / gridX;
	var gridHeight = screenHeight / gridY;
	var clicked = false;
	
	function pauseGame()
	{
		pause = 1-pause;
	}
	
	function removeSprite(r, c)
	{
		var removed = stage.removeChild(cells[r][c].sprite.circle);
		if( !removed )
			alert( "Shape not removed!!" );
		cells[r][c].sprite.circle = null;
		cells[r][c].sprite.x = 0;
		cells[r][c].sprite.y = 0;
		cells[r][c].sprite = null;
				
		return;		
	}
	
	function findMatches(r, c)
	{
		path.enqueue(cells[r][c]);
		var val = cells[r][c].sprite.value;
		var matches = [];
		while( !path.isEmpty() )
		{
			var cell = path.dequeue();
			matches.push(cell);
			cell.sprite.matched = true;
			var cr = cell.sprite.cellR;
			var cc = cell.sprite.cellC;
			cr++;
			if( cr < fillRow && cells[cr][cc] != null && cells[cr][cc].sprite != null && cells[cr][cc].sprite.value == val && cells[cr][cc].sprite.matched == false )
			{
				cells[cr][cc].sprite.matched = true;
				path.enqueue(cells[cr][cc]);
			}
			cr-=2;
			if( cr >= 0 && cells[cr][cc] != null && cells[cr][cc].sprite != null && cells[cr][cc].sprite.value == val && cells[cr][cc].sprite.matched == false )
			{
				cells[cr][cc].sprite.matched = true;
				path.enqueue(cells[cr][cc]);
			}
			cr++;
			cc++;
			if( cc < gridX && cells[cr][cc] != null && cells[cr][cc].sprite != null && cells[cr][cc].sprite.value == val && cells[cr][cc].sprite.matched == false )
			{
				cells[cr][cc].sprite.matched = true;
				path.enqueue(cells[cr][cc]);
			}
			cc-=2;
			if( cc >= 0 && cells[cr][cc] != null && cells[cr][cc].sprite != null && cells[cr][cc].sprite.value == val && cells[cr][cc].sprite.matched == false )
			{
				cells[cr][cc].sprite.matched = true;
				path.enqueue(cells[cr][cc]);
			}
		}
		if( matches.length >= 3 )
			return matches;
		else
		{
			for( var i=0; i<matches.length; i++ )
			{
				matches[i].sprite.matched = false;
			}
			return null;
		}
	
	
	
	}
        function init() 
		{
			path = new Queue();
        	stage = new createjs.Stage("canvas");
			var htmlStage = document.getElementById("canvas");
			htmlStage.width = screenWidth;
			htmlStage.height = screenHeight;
			context2D = canvas.getContext("2d");
			
			sprites = [];
			cells = new Array(gridY); ;
			var i = 0;
			
			for( var r=0; r<=cellRows/*gridY*/; r++ ) 
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
						cells[r][c].sprite.cellC = c;
						cells[r][c].sprite.cellR = r;
						spriteCount++;
					}
				}
			}
			
			document.getElementById("canvas").onclick=function(e) {				
				clicked = true;		// a sprite was clicked...

				var gx, gy;
				
				gx = parseInt((e.clientX - 400 - 8)/ gridWidth);  //padding = 8, margin = 400
				gy = parseInt((e.clientY + cellOffset * gridHeight) / gridHeight);
				
				if( gy == fillRow || cells[gy][gx].sprite == null )
				{
					clicked = false;
					return;
				}
				
				var matchingCells = findMatches(gy, gx);
				if( matchingCells != null )
				{
					createBasicExplosion(gx, gy, spriteColors[cells[gy][gx].sprite.value]);
					clickSound('audiotag1');
				
						for( var i=0; i<matchingCells.length; i++ )
						{
							removeSprite(matchingCells[i].sprite.cellR, matchingCells[i].sprite.cellC); 
						}
						clickSound('audiotag1');
				}
				else
				{
					// play not enough sprites sound...
				}
				//set sprites in motion if necessary 
					var c = 0;
					while( c < gridX )
					{
						var r = fillRow - 1;
						var r2;
						while( r >= 1 )
						{
							if( cells[r][c].sprite == null )
							{
								r2 = r-1;
								while( r2 >= 0 )
								{
									if( cells[r2][c].sprite != null )
									{
										cells[r2][c].sprite.active = true;
										cells[r2][c].sprite.cellR = r;
										cells[r2][c].sprite.cellC = c;
										cells[r2][c].sprite.stepX = 0;
										cells[r2][c].sprite.stepY = (cells[r][c].y - cells[r2][c].y) / 5;
										cells[r2][c].sprite.lifeTime = 5;
										cells[r][c].transition = 1;
										cells[r2][c].sprite = null;
										r2 = -1;
									}
									r2--;
								}
							}
							r--;
						}
						c++;
					}
				
				
				
				clicked = false;
			};
			
			
			setInterval( function() {
				if( pause > 0 || clicked == true ) return;
				clicked = true;
				if( fillRowX == gridX )  //filled in bottom row
				{
					fillRowX = 0;
					fillRow++;
					cellOffset++;
					if( cellOffset >= 11 )
					{
						var win = true;
						var r = cellOffset - 1;
						for( var c=0; c<gridX; c++ )
						{
							if( cells[r][c].sprite != null ) 
								win = false;
						}
						if( win == false )
							alert( "You Lose!!!" );
						if( cellOffset == 15 )
							alert( "You Win!!!" );
					}
					/* push up */
					/*
					for( var r = 1; r<gridY; r++ )
					{
						for( var c=0; c<gridX; c++ )
						{
							cells[r-1][c].sprite = cells[r][c].sprite;
							cells[r-1][c].transition = cells[r][c].transition;
						}
					}
					*/
					for( var i=0; i<spriteCount; i++ )
					{
						if( sprites[i] != null && sprites[i].circle != null )
							sprites[i].circle.y -= gridHeight;						
					}
				}
				else if( fillRowX < gridX )
				{
					sprites[spriteCount] = createSprite(fillRow, fillRowX);
					cells[fillRow][fillRowX].sprite = sprites[spriteCount];
					cells[fillRow][fillRowX].sprite.cellC = fillRowX;
					cells[fillRow][fillRowX].sprite.cellR = fillRow;
					spriteCount++;
					fillRowX = fillRowX + 1;
				}
				clicked = false;
			}, 1000);
			
			
			var shakeR = [-2, 0, 2, 0];
			var shakeC = [0, 2, 0, -2];
			setInterval(function()
			{
				if( clicked == true || pause > 0 )
					return;
				for( var i = 0; i<sprites.length; i++ )
				{
					sprites[i].animIndex++;
					if( sprites[i].active == false )
					{
						if( sprites[i].circle != null && cells[sprites[i].cellR][sprites[i].cellC].sprite != null )
						{
							sprites[i].circle.x = cells[sprites[i].cellR][sprites[i].cellC].x + shakeC[sprites[i].animIndex % 3];
							sprites[i].circle.y = -( cellOffset * gridHeight ) + cells[sprites[i].cellR][sprites[i].cellC].y + shakeR[sprites[i].animIndex % 3];
						}
						continue;					
					}
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
