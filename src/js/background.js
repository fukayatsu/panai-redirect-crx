(function(){
  chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    if (details['parentFrameId'] != -1) { return ; }

    var setting = JSON.parse(localStorage.getItem('setting'));
    if (!setting) return;

    var pageUrl = details['url'];
    var tagId   = details['tabId'];
    var redirectTo = "";
    var subUrls = [];

    for (var urlRegExpStr in setting) {
      if ((subUrls = pageUrl.match(new RegExp(urlRegExpStr)))) {
        redirectTo = setting[urlRegExpStr];
        matches = redirectTo.match(/\${[0-9]}/g);

        if (matches) {
          for (var i = 0; i < matches.length; i++) {
            redirectTo = redirectTo.split(matches[i]).join(subUrls[i+1]);
            redirectTo = decodeURIComponent(redirectTo)
          }
        }
        return chrome.tabs.update(tagId, {url: redirectTo});
      }
    }
  });

  chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.create({
       "url": chrome.extension.getURL("options.html")
    });
  });
})();