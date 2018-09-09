window.addEventListener('contextmenu', function (e) {
  chrome.storage.sync.get(['token'], function (res) {
    var token = res.token;
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
      'query': 'a OR e OR i OR o OR u',
      'limit': 100
    }

    searchXhr.send(JSON.stringify(searchQuery));
  });
});
