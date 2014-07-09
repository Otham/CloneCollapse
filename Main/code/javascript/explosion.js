	var particles = [];

	// starting the game loop at 60 frames per second
	var frameRate = 50.0;
	var frameDelay = 1000.0/frameRate;

	
	
	/*
	 * A single explosion particle
	 */
	function Particle ()
	{
		this.scale = 1.0;
		this.x = 0;
		this.y = 0;
		this.radius = 20;
		this.color = "#000";
		this.velocityX = 0;
		this.velocityY = 0;
		this.scaleSpeed = 0.5;
		
		this.update = function(ms)
		{
			// shrinking
			this.scale -= this.scaleSpeed * ms / 1000.0;
			
			if (this.scale <= 0)
			{
				this.scale = 0;
			}
			
			// moving away from explosion center
			this.x += this.velocityX * ms/1000.0;
			this.y += this.velocityY * ms/1000.0;
		};
		
		this.draw = function(context2D)
		{
			// translating the 2D context to the particle coordinates
			context2D.save();
			context2D.translate(this.x, this.y);
			context2D.scale(this.scale, this.scale);
			
			// drawing a filled circle in the particle's local space
			context2D.beginPath();
			context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
			context2D.closePath();
			
			context2D.fillStyle = this.color;
			context2D.fill();
			
			context2D.restore();
		};
	}
	
	/*
	 * Basic Explosion, all particles move and shrink at the same speed.
	 * 
	 * Parameter : explosion center
	 */
	function createBasicExplosion(x, y, c)
	{
		// creating 4 particles that scatter at 0, 90, 180 and 270 degrees
		for (var angle=0; angle<360; angle+=90)
		{
			var particle = new Particle();
			var dx = x*50+25;
			var dy = y*50+25;
		
			//alert(dx+" "+dy);
			
			// particle will start at explosion center
			particle.x = dx;
			particle.y = dy;
			
			particle.color = c;
			
			var speed = 50.0;
			
			// velocity is rotated by "angle"
			particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
			particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
			
			// adding the newly created particle to the "particles" array
			particles.push(particle);
		}
		
		
		setInterval(function()
		{
			update(frameDelay);
			
		}, frameDelay);
	}
	
		
		function update (frameDelay)
	{
		
		// update and draw particles
		for (var i=0; i<particles.length; i++)
		{
			var particle = particles[i];
			
			particle.update(frameDelay);
			particle.draw(context2D);
		}
	}
	
	canvas = document.getElementById("canvas");
