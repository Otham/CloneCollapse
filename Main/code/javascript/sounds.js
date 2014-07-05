function clickSound()
{
	//alert( "**CLICK**!" );
	var snd = new Audio("bigboom.wav"); // buffers automatically when created
	snd.play();
}
function supportsAudio()
{
	var snd = new Audio("bigboom.wav"); // buffers automatically when created
	snd.play();
    var a = document.createElement('audio'); 
    return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}