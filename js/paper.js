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

var childContextMenuItem = {
  "id": "newPaper",
  "parentId": "sendText",
  "title": "Create New Paper",
  "contexts": ["selection"]
}

chrome.contextMenus.create(contextMenuItem);
chrome.contextMenus.create(childContextMenuItem);

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
  var pageUrl = info.pageUrl;
  var tabTitle = tab.title;
  var selectedText = info.selectionText;
  chrome.storage.sync.get(['token'], function(res) {
    var authToken = res.token;
    if (authToken) {
      if (info.menuItemId == "newPaper") {
        createPaper(authToken, selectedText, tabTitle, pageUrl);
      }
      else {
        var paperId = info.menuItemId;
        saveToPaper(authToken, paperId, selectedText, tabTitle, pageUrl);
      }
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

function createPaper(token, text, tabTitle, pageUrl) {
  //Send request to create paper and Store paper revision with respective paper_id
  var url = 'https://api.dropboxapi.com/2/paper/docs/create';
  var xhr = new XMLHttpRequest();

  xhr.open("POST", url ,true);

  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.setRequestHeader("Dropbox-API-Arg", "{\"import_format\": \"markdown\"}");
  xhr.setRequestHeader("Content-Type", "application/octet-stream");

  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      var paperid = JSON.parse(this.response);

      var existingPaper = {
        "id": `${paperid.doc_id}`,
        "parentId": "sendText",
        "title": title,
        "contexts": ["selection"]
      }
      chrome.contextMenus.create(existingPaper);

      chrome.storage.sync.set({[paperid.doc_id] : paperid.revision}, function() {
        saveToPaper(token, paperid.doc_id, text, tabTitle, pageUrl);
      });
    }
  };
  var title = window.prompt('Enter title for the paper: ', 'Paper-extension');
  xhr.send(title);
}

function saveToPaper(token, paperId, text, tabTitle, pageUrl) {
  //Send request to update paper and Update paper revision with new revision
  chrome.storage.sync.get([paperId], function(result) {
    var url = 'https://api.dropboxapi.com/2/paper/docs/update';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    var rev = result[paperId];
     
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Dropbox-API-Arg", "{\"doc_id\": \"" + paperId + "\",\"doc_update_policy\": \"append\",\"revision\": " + rev + ",\"import_format\": \"markdown\"}");
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
     
    xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        new_rev = JSON.parse(this.response);
        chrome.storage.sync.set({[paperId] : new_rev.revision});
      } 
    }
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    xhr.send("-\n# " + tabTitle + "\n" + text + "\n" + dateTime + ". " + "[Link](" + pageUrl + ")");
  });
}
