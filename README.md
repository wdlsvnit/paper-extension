<h1  align='center'>
Paper extension
</h1> 
<p align='center'>
<img src='./img/icon-large.png' >
</p>
<h4 align='center'>
A chrome extension to sync the highlighted text from web to a dropbox paper. 
</h4> 
<p align='center'><i align='center'>Take notes without leaving the tab </i></p>

### Installation
1. Download the paper extension from the [builds folder](https://github.com/wdlsvnit/paper-extension/blob/master/builds/paper-extension.crx).
2. Add extension to chrome as shown here:
![Installation](https://user-images.githubusercontent.com/27485533/45442995-2b96cc80-b6e1-11e8-8065-b9e30943ae0b.gif)

### Use
- Click on the paper-extension icon and authorize.
- The extension is active now. Right-click on the selected text and you'll see the *Save to paper* option!<br>
  1. Save text to existing paper:
  ![Save to existing paper](https://user-images.githubusercontent.com/27485533/45487187-3f8f0c80-b77b-11e8-97a5-3a5c4d1018fd.gif)

  2. Save text to new paper:
  ![create paper](https://user-images.githubusercontent.com/27485533/45487333-a6acc100-b77b-11e8-9b5d-178da966b48f.gif)


### Development
1. `git clone <repository-url>` this repository.
2. Get your client_id by following the instructions [here](https://auth0.com/docs/connections/social/dropbox/ "Connect your app to Dropbox") and fill in the "*client_id_here*" placeholder in paper.js.
3. Go to Chrome menu and click *Tools* then *Extensions* and toggle the *Developer Mode* ON.
4. Click on load *UNPACKED EXTENSION* and select the folder where you've extracted the extension.
5. The extension is now installed and ready for use.

##### Open issues and PRs, feel free to contribute. If this extension helped then do star the repo and share with your friends!
