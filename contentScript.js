(function(){
  var token = extractTokenFromURL(window.location.href);
  if (token) {
    chrome.storage.sync.set({ 'token': token });
  }
})();

function extractTokenFromURL(url) {
  var m = url.match(/[#?](.*)/);
  if (!m || m.length < 1)
    console.log("Get a url");
  var params = new URLSearchParams(m[0].split("#")[1]);
  return params.get("access_token");
}
