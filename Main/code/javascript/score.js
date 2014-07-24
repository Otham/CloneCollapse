


function score(c)
	{
	var score = document.getElementById("current");
	
	score.innerHTML = parseInt(score.innerHTML,10) + 10*c;
	
	}
function updateTimer(c)
	{
	//var timerElement = document.getElementById("timer");
	document.getElementById("timer").innerHTML = c;
	//timerElement.innerHTML = c;
	
	}
