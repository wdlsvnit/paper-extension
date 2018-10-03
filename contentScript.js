(function(){
  var token = extractTokenFromURL(window.location.href);
  if (token) {
    chrome.storage.sync.set({ 'token': token });
    chrome.storage.sync.set({ 'papers': [] });

    //get initial paper list
    var searchUrl = 'https://api.dropboxapi.com/2/paper/docs/search';
    var searchXhr = new XMLHttpRequest();

    searchXhr.open('POST', searchUrl , true);

    searchXhr.setRequestHeader('Authorization', 'Bearer ' + token);
    searchXhr.setRequestHeader('Content-Type', 'application/json');

    searchXhr.onreadystatechange = function () {
      if (searchXhr.readyState == XMLHttpRequest.DONE && searchXhr.status == 200) {
        var allDocs = JSON.parse(searchXhr.responseText);
        chrome.extension.sendMessage({docs: allDocs});
      }
    }

    var searchQuery = {
      'query': 'a OR b OR c OR d OR e OR f OR g OR h OR i OR j OR k OR l OR m OR n OR o OR p OR q OR r OR s OR t OR u OR v OR w OR x OR y OR z',
      'limit': 50
    }

    searchXhr.send(JSON.stringify(searchQuery));
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
