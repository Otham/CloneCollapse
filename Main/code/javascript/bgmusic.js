//Background Music
var music = 0;	


function playMusic()
{
	document.getElementById('bgMusic').play();

}

function pauseMusic()
{
		music = 1-music;
		
		if (music == 1)
			document.getElementById('bgMusic').pause();
		else
			playMusic();

}


