// ;

// This code loads the IFrame Player API code asynchronously.
// var tag = document.createElement('script');
// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var time_update_interval = 0;
var titleSet = false;

function init() {
  var url = document.getElementById("url-input").value;
    //var url = "https://www.youtube.com/watch?v=n8Z7mUOGEAE&list=PLBoFNGFmekcMIhlW5Z-umsS3VPnQx7tI8&index=2&t=0s"; // aikotoba iii
    //var url = "https://www.youtube.com/watch?v=MiuFIzr8bR0&list=PLI3I4eCwIlMi4odNVCWL-UekHfNZvAPYp&index=4&t=0s"; // jo-jo- yu-jo-
    url = url.split("&")[0];
    //player.loadVideoByUrl("https://www.youtube.com/watch/v/n8Z7mUOGEAE?version=3");
    url = url.split("v=")[1];
    var vid = new String(url);
    player.loadVideoById(vid);
    titleSet = false;
  
    // Update the controls on load
    updateTimerDisplay();
    updateProgressBar();
  
  
    $('#volume-control').val(Math.round(player.getVolume()));
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video', {
        width: 1366,
        height: 768,
        //videoId: 'MiuFIzr8bR0',
        //videoId: 'n8Z7mUOGEAE',
        videoId: '',
        playerVars: {
            //playlist: 'taJ60kskkns,FG0fTKAqZ5g'
        },
        events: {
            'onReady': initialize,
            'onStateChange': refresh
        }
    });
}

function refresh() {
}

function initialize() {
    
    init();


    // Clear any old interval.
    clearInterval(time_update_interval);

    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    time_update_interval = setInterval(function() {
        updateTimerDisplay();
        updateSeekBar();
        document.getElementById("volume-control").value = Math.round(player.getVolume());
        
        if (titleSet == false && player != null) {
            var title = player.getVideoData().title;
            if (title != "") {
                document.getElementById("title-info").innerText = title;
                titleSet = true;
            }
        }
    }, 300);


}

// This function is called by initialize()
function updateTimerDisplay() {
    // Update current time text display.
    $('#time-current').text(formatTime(player.getCurrentTime()));
    $('#time-duration').text(formatTime(player.getDuration()));
}

function updateSeekBar() {
    if (player == null) {
        document.getElementById("seek-bar").value = "0";
        return;
    }
    
    document.getElementById("seek-bar").value = player.getCurrentTime() / player.getDuration() * 1000;
}

function updateVolumeControllBar() {
    if (player == null) {
        document.getElementById("volume-controll").value = "0";
        return;
    }
    
    document.getElementById("volume-control").value = Math.Round(player.getVolume());
}




// Progress bar
$('#seek-bar').on('mouseup touchend', function (e) {
    // Calculate the new time for the video.
    // new time in seconds = total duration in seconds * ( value of range input / 100 )
    var newTime = player.getDuration() * (e.target.value / 1000);

    // Skip video to new time.
    player.seekTo(newTime);
});


// Playback
function tryPlayOrPause() {
  if (player == null)
    return;  
  
  var playElement = null;
  
  playElement = document.getElementById("play");
  if (playElement != null) {
    player.playVideo();
    playElement.innerText = "||";
    playElement.id = "pause";
    return;
  } 
  
  playElement = document.getElementById("pause");
  if (playElement != null) {
    player.pauseVideo();
    playElement.innerText = "|>";
    playElement.id = "play";
    return;
  } 
  
  
}

// Sound volume
$('#mute-toggle').on('click', function() {
    var mute_toggle = $(this);

    if(player.isMuted()){
        player.unMute();
        mute_toggle.text('volume_up');
    }
    else{
        player.mute();
        mute_toggle.text('volume_off');
    }
});

$('#volume-control').on('change', function() {
    player.setVolume($(this).val());
});


// Other options


$('#speed').on('change', function () {
    player.setPlaybackRate($(this).val());
});

$('#quality').on('change', function () {
    player.setPlaybackQuality($(this).val());
});


// Playlist

$('#next').on('click', function () {
    player.nextVideo()
});

$('#prev').on('click', function () {
    player.previousVideo()
});


// Load video

$('.thumbnail').on('click', function () {

    var url = $(this).attr('data-video-id');

    player.cueVideoById(url);

});


// Helper Functions

function formatTime(time){
    time = Math.round(time);

    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ":" + seconds;
}


$('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
});