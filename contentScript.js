(function(){
  var token = extractTokenFromURL(window.location.href);
  if (token) {
    chrome.storage.sync.set({ 'token': token });
  }
})();

function extractTokenFromURL(url) {
  var urlFragment = url.match(/[#?](.*)/);
  if (!urlFragment || urlFragment.length < 1) {
    return null;
  }
  var params = new URLSearchParams(urlFragment[0].split("#")[1]);
  return params.get("access_token");
}
