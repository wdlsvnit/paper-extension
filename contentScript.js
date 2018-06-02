(function(){
  var token = extractTokenFromURL(window.location);
  if (token) {
    chrome.storage.sync.set({ 'token': token });
  }
})();

function extractTokenFromURL(url) {
  access_token = url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
}
