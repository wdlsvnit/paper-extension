const clientId = "client id here";

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.storage.sync.get(['token'], function(res) {
    var authToken = res.token;
    if (!authToken) {
      authorise();
    }
  });
});

var contextMenuItem = {
  "id": "sendText",
  "title": "Send Text to Paper",
  "contexts": ["selection"]
}

chrome.contextMenus.create(contextMenuItem);

chrome.storage.sync.get(['token'], function(res) {
  var authToken = res.token;
  if (!authToken) {
    chrome.browserAction.setBadgeText({ text: '!' });
    chrome.browserAction.setBadgeBackgroundColor({ color: "red" });
    chrome.browserAction.setTitle({ title: 'Please Sign-In' });
    chrome.contextMenus.update('sendText', { visible: false });
  }
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  chrome.storage.sync.get(['token'], function(res) {
    var authToken = res.token;
    if (!authToken) {
      chrome.browserAction.setBadgeText({ text: '!' });
      chrome.browserAction.setBadgeBackgroundColor({ color: "red" });
      chrome.browserAction.setTitle({ title: 'Please Sign-In' });
      chrome.contextMenus.update('sendText', { visible: false });
    }
    else {
      chrome.contextMenus.update('sendText', { visible: true });
      chrome.browserAction.setBadgeText({ text:'' });
      chrome.browserAction.setTitle({ title: '' });
    }
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  var selectedText = info.selectionText;
  chrome.storage.sync.get(['token'], function(res) {
    var authToken = res.token;
    if (authToken) {
      chrome.storage.sync.get(['paperId'], function(res) {
        var paperId = res.paperId;
        if (paperId) {
          saveToPaper(authToken, paperId, selectedText);
        }
        else {
          createPaper(authToken);
        }
      });
    }
    else {
      window.alert('Oops! Looks like you have not authorised paper-extension yet. Sign in to dropbox by clicking paper-extension icon.');
    }
  });
});

function authorise() {
  var dropboxURL = "https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=" + clientId + "&redirect_uri=https://wdlsvnit.github.io/paper-extension/"
  chrome.tabs.create({ url: dropboxURL });
}

function createPaper(token) {
  //TODO: create paper on user's dropbox and store paperId to storage
  var url = 'https://api.dropboxapi.com/2/paper/docs/create';
  var xhr = new XMLHttpRequest();

  xhr.open("POST", url ,true);

  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.setRequestHeader("Dropbox-API-Arg", "{\"import_format\": \"markdown\"}");
  xhr.setRequestHeader("Content-Type", "application/octet-stream");

  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      var paperid = JSON.parse(this.response);
      chrome.storage.sync.set({paperId : paperid.doc_id});
      chrome.storage.sync.set({Revision : paperid.revision}, function(){
      saveToPaper(authToken, paperId, selectedText);
      });
    }
  };

  var reqObj = {import_format: "html"};
  xhr.send(reqObj);
}

function saveToPaper(token, paperId, text) {
  //TODO: save text to paper
  chrome.storage.sync.get(['Revision'], function(result) {
    var url = 'https://api.dropboxapi.com/2/paper/docs/update';
    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);

    var rev = result.Revision;
    
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Dropbox-API-Arg", "{\"doc_id\": \"" + paperId + "\",\"doc_update_policy\": \"prepend\",\"revision\": " + rev + ",\"import_format\": \"plain_text\"}");
    xhr.setRequestHeader("Content-Type", "application/octet-stream");

    xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        new_rev = JSON.parse(this.response);
        var rrev=new_rev.revision;
        chrome.storage.sync.set({Revision : rrev}, function(){
        console.log('Revision is set to ' + rrev);
        });
      }
    }

    xhr.send(text);

  });
}
