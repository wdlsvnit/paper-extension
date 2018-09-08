console.log('getPaperList running fine');

window.addEventListener('mousedown',  function(e) { 
    console.log("clicked");
    var rightclick; 
    if (!e) var e = window.event; 
    if (e.which) rightclick = (e.which == 3); 
    else if (e.button) rightclick = (e.button == 2); 
    if(rightclick){
        chrome.storage.sync.get(['token'], function(res) {
            var token = res.token;
            var searchUrl = 'https://api.dropboxapi.com/2/paper/docs/search';
            var searchXhr = new XMLHttpRequest();
        
            searchXhr.open("POST", searchUrl ,true);
        
            searchXhr.setRequestHeader("Authorization", "Bearer " + token);
            // searchXhr.setRequestHeader("Dropbox-API-Arg", "{\"import_format\": \"markdown\"}");
            searchXhr.setRequestHeader("Content-Type", "application/json");
        
            searchXhr.onreadystatechange = function() {
              console.log(searchXhr.status);
              if (searchXhr.readyState == XMLHttpRequest.DONE && searchXhr.status == 200) {
                console.log('request done. ------------------------------');
                var allDocs = JSON.parse(searchXhr.responseText);
                console.log(allDocs);
                chrome.extension.sendMessage({docs: allDocs}, function(response) {
                    console.log(`sent allDocs to paper.js: ${response}`);
                });
                
              }
            };
        
            var searchQuery = {
              "query": "a OR e OR i OR o OR u",
              "limit": 10
            };
        
            searchXhr.send(JSON.stringify(searchQuery));
          });
    }
});