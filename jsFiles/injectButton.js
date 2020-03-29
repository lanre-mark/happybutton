function injectStyles(url) {
  var elem = document.createElement('link');
  elem.rel = 'stylesheet';
  elem.setAttribute('href', url);
  document.body.appendChild(elem);
}

injectStyles(chrome.extension.getURL('style.css'));

let documentTime = document.querySelector("body");

  console.log("command:", document);
  console.log("command:", "It did it!!");

  //create container and button
  let happyContainer = document.createElement('div');
  happyContainer.classList.add('happyContainer');
  let happyButton = document.createElement('img');
  let imageURL = chrome.extension.getURL("sourceImages/smileyButton.png");
  happyButton.src = imageURL;
  happyButton.setAttribute('id','happyButton');

//create clickFace
let clickFace = document.createElement('img');
let imageURL2 = chrome.extension.getURL("sourceImages/clickFace2.png");
clickFace.src = imageURL2;
clickFace.setAttribute('id','clickFace');

//create closeButton
let closeButton = document.createElement('img');
let imageURL3 = chrome.extension.getURL("sourceImages/closeWindow.png");
closeButton.src = imageURL3;
closeButton.setAttribute('id','closeButton');

//create faceDiv


//add them to the dom
  documentTime.appendChild(happyContainer);
  happyContainer.appendChild(clickFace);
  happyContainer.appendChild(happyButton);
  documentTime.appendChild(closeButton);
  