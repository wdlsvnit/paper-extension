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
}

function saveToPaper(token, paperId, text) {
  //TODO: save text to paper
}
