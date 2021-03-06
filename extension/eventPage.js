db = {};
//http://vps.provolot.com/manila_api/get_tab?tabroom=surfclub
//db.API_URL = "http://localhost:5000/";
db.API_URL = "http://vps.provolot.com/manila_api/";
//db.API_CURRENT_URL = "get_current";
db.API_CURRENT_URL = "get_tab";
db.PLAYLIST_URL = "get_playlist";
db.PLAYLIST = "surfclub";

var isEnabled = false;





var onUrlSendMessage = function(url) {
    console.log("### loading " + url + "###");

	chrome.tabs.query({'index':0}, function(tabs) {
		console.log("sending message to active tab:" + tabs[0].id);
		chrome.tabs.sendMessage(tabs[0].id, {
			url: url
		});
	});

}


var getCurrentUrl = function(onGet) {
    console.log("## checking if new url");
    $.ajax({
        url: db.API_URL + db.API_CURRENT_URL + "?tabroom=" + db.PLAYLIST,
        success: function(response) {
            console.log("url received..:" + response['url']);
            
            if(isEnabled) { onGet(response['url']); }
        },
        error: function(xhr) {  console.log('FAILURE');    }
    });
}


var startAlarm = function() {
    chrome.alarms.create("myAlarm", {delayInMinutes: 0.0, periodInMinutes: 1} );
    /*window.setInterval(function() {
        getCurrentUrl(onUrlSendMessage);
    }, 15000); */
}


chrome.alarms.onAlarm.addListener(function( alarm ) {
    getCurrentUrl(onUrlSendMessage);
});

// on/off action!
chrome.browserAction.onClicked.addListener(function(tab) {
  if(isEnabled) {
      isEnabled = false;
      chrome.browserAction.setIcon({path: "icons/icon_disabled.png"});
  } else {
      isEnabled = true;
      chrome.browserAction.setIcon({path: "icons/icon.png"});
      getCurrentUrl(onUrlSendMessage);
  }
});

////////////////////////

$( document ).ready(function() {
    console.log("WOWOWO document ready");

    startAlarm();
});

