// ==UserScript==
// @name            Youtube High Definition
// @namespace       rocki
// @version         1.5.3
// @grant           none
// @downloadURL     https://raw.github.com/rockihack/YT-High-Definition/master/127028.user.js
// @updateURL       https://raw.github.com/rockihack/YT-High-Definition/master/127028.meta.js
// @include         *youtube.com*
// ==/UserScript==

// Author: rocki.hack@gmail.com
// License: GNU General Public License v3 (GPL)

// contentEval (http://wiki.greasespot.net/Content_Script_Injection)
(function(source){
	// Check for function input.
	if ('function' == typeof source) {
		// Execute this function with no arguments, by adding parentheses.
		// One set around the function, required for valid syntax, and a
		// second empty set calls the surrounded function.
		source = '(' + source + ')();'
	}

	// Create a script node holding this  source code.
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = source;

	// Insert the script node into the page, so it will run, and immediately
	// remove it to clean up.
	document.body.appendChild(script);
	document.body.removeChild(script);
})

(function(){
	// Dom window
	var w = window,

	// Dom document
	d = w.document,

	// Player object
	p = null,

	// onYouTubePlayerReady
	_onYouTubePlayerReady = w.onYouTubePlayerReady || function(){},

	// Quality levels enumeration
	q = {
		'tiny':0,
		'small':1,
		'medium':2,
		'large':3,
		'hd720':4,
		'hd1080':5,
		'hd1440':6,
		'hd2160':7,
		'highres':8
	},

	// Local maximum
	maximum = 'hd1080';

	// Hook YouTubePlayerReady callback
	w.onYouTubePlayerReadyHD = function(){
		// Get Feather player object
		if(w.videoPlayer){
			for(var i in w.videoPlayer){
				if(w.videoPlayer[i] && w.videoPlayer[i].setPlaybackQuality){
					p = w.videoPlayer[i];
					break;
				}
			}
		}

		// Get Flash / HTML5 player object
		else{
			p = d.getElementById('movie_player') ||
				d.getElementById('movie_player-flash') ||
				d.getElementById('movie_player-html5') ||
				d.getElementById('movie_player-html5-flash');
		}

		// Check for valid player object
		if(p){
			console.log('Youtube player type: ' + typeof p);

			// Add onStateChange listener
			p.addEventListener('onStateChange','onPlayerStateChangeHD');

			// Set playback quality
			w.onPlayerStateChangeHD(-1);
		}

		// Call original function
		_onYouTubePlayerReady();
	};

	// onStateChange callback
	w.onPlayerStateChangeHD = function(z){
		console.log('Youtube player state: ' + z);

		// Catch internal exceptions to prevent flash crashs
		try{
			// Get current playback quality
			var aq = p.getPlaybackQuality(),

			// Get available video quality
			vq = p.getAvailableQualityLevels()[0] || maximum,

			// New playback quality
			zq = q[maximum] < q[vq] ? maximum : vq;

			// Set playback quality
			if(q[aq] < q[zq]){
				p.setPlaybackQuality(zq);
				console.log('Youtube player quality: ' + aq + ' -> ' + zq);
			}
		}catch(e){
			console.log('Youtube player exception: ' + e);
		}
	};

	// onYouTubePlayerReady
	if(w.ytplayer && w.ytplayer.config)
		w.ytplayer.config.args.jsapicallback = 'onYouTubePlayerReadyHD';

	w.onYouTubePlayerReady = w.onYouTubePlayerReadyHD;
});
