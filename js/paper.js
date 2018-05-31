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
  //TODO: create new tab to request authorisation (use "https://wdlsvnit.github.io/paper-extension/" as redirect url)
}

function createPaper(token) {
  //TODO: create paper on user's dropbox and store paperId to storage
}

function saveToPaper(token, paperId, text) {
  //TODO: save text to paper
}