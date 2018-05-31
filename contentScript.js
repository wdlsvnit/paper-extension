(function(){
  var token = extractTokenFromURL(window.location);
  if (token) {
    chrome.storage.sync.set({ 'token': token });
  }
})();

function extractTokenFromURL(url) {
  //TODO: get authtoken from url
}