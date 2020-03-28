function injectStyles(url) {
  var elem = document.createElement('link');
  elem.rel = 'stylesheet';
  elem.setAttribute('href', url);
  document.body.appendChild(elem);
}

injectStyles(chrome.extension.getURL('style.css'));

const documentTime = document.querySelector("body");

  console.log("command:", document);
  console.log("command:", "It did it!!");

  //create container and button
  const happyContainer = document.createElement('div');
  happyContainer.classList.add('happyContainer');
  const happyButton = document.createElement('img');
  let imageURL = chrome.extension.getURL("sourceImages/smileyButton.png");
  happyButton.src = imageURL;
  happyButton.setAttribute('id','happyButton');

//create clickFace
const clickFace = document.createElement('img');
let imageURL2 = chrome.extension.getURL("sourceImages/clickFace2.png");
clickFace.src = imageURL2;
clickFace.setAttribute('id','clickFace');

//add them to the dom
  documentTime.appendChild(happyContainer);
  happyContainer.appendChild(clickFace);
  happyContainer.appendChild(happyButton);
  