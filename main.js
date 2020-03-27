/*
Notes for Lanre and Matt:
 Because we're trying to create a button on an active tab
 with no specific site, we need a script that can listen in the background 
 and then when executed, interact with the DOM. The activeTab
 permission grants access to an active tab. The controls property
 (in manifest) sets the key command. The background property
 tells the extension which files to use in the background.
 In the JS file, the chrome.tabs object, property, command, whatever
 is what is able to inject code into the actual DOM. 

 Background pages get their own DOM. Chrome.tabs bridges the gap
 and injects script code into the current active tab. 

 If we didn't have to listen for a user command (of which
  there can be many, we only set up one key command)
  we could set up content scripts which would automatically
  interact with matching pages. All this is in the documentation
  but very convoluted. 
https://stackoverflow.com/questions/4532236/how-to-access-the-webpage-dom-rather-than-the-extension-page-dom
*/

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.executeScript({
  file: 'injectButton.js'
  });
});