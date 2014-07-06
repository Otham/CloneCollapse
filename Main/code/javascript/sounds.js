//Create Audio channels
			var channel_max = 10;										// number of channels
			audiochannels = new Array();
			for (a=0;a<channel_max;a++) {									// prepare the channels
				audiochannels[a] = new Array();
				audiochannels[a]['channel'] = new Audio();						// create a new audio object
				audiochannels[a]['finished'] = -1;							// expected end time for this channel
			}
			




function clickSound(s)
{
	//alert( "**CLICK**!" );
	/*var snd = new Audio("bigboom.wav"); // buffers automatically when created
	snd.play();
	*/
	//document.getElementById('audiotag1').play();
	
	

	for (a=0;a<audiochannels.length;a++) {
			thistime = new Date();
			if (audiochannels[a]['finished'] < thistime.getTime()) {			// is this channel finished?
				audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration*2000;
				audiochannels[a]['channel'].src = document.getElementById(s).src;
				audiochannels[a]['channel'].load();
				audiochannels[a]['channel'].play();
				break;
			}
	}
				
}

function supportsAudio()
{
	var snd = new Audio("bigboom.wav"); // buffers automatically when created
	snd.play();
    var a = document.createElement('audio'); 
    return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}