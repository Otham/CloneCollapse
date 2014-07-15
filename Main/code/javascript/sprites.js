	function createSprite(locY, locX) {
		var sp = new Object();					
		var circle = new createjs.Shape();
		var color = parseInt(Math.random() * 4);
		circle.graphics.beginStroke("black").beginFill(spriteColors[color]).drawCircle(0, 0, 25);
						
		circle.x = cells[locY][locX].x;
		circle.y = cells[locY][locX].y - cellOffset * gridHeight;
		circle.name = parseInt(Math.random() * 10000000);
		sp.circle = circle;
		sp.matched = false;
		sp.active = false;
		sp.cellC = 0;
		sp.cellR = 0;
		sp.lifeTime = 0;
		sp.animIndex = 0;
		sp.value = color;
		stage.addChild(circle);
		return sp;
	}
