window.addEventListener('contextmenu', function (e) {
  chrome.storage.sync.get(['token'], function (res) {
    var token = res.token;
    if (token) {
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
  });
});
