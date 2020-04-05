function injectStyles(url) {
  var elem = document.createElement("link");
  elem.rel = "stylesheet";
  elem.setAttribute("href", url);
  document.body.appendChild(elem);
}

injectStyles(chrome.extension.getURL("style.css"));

if (typeof documentTime === "undefined")
  var documentTime = document.querySelector("body");

// console.log("command:", document);
// console.log("command:", "It did it!!");

//create container and button
if (typeof happyContainer === "undefined")
  var happyContainer = document.createElement("div");

happyContainer.classList.add("happyContainer");

if (typeof happyButton === "undefined")
  var happyButton = document.createElement("img");

if (typeof imageURL === "undefined")
  var imageURL = chrome.extension.getURL("sourceImages/smileyButton.png");

happyButton.src = imageURL;
happyButton.setAttribute("id", "happyButton");

//create clickFace
if (typeof clickFace === "undefined")
  var clickFace = document.createElement("img");

if (typeof imageURL2 === "undefined")
  var imageURL2 = chrome.extension.getURL("sourceImages/clickFace2.png");

clickFace.src = imageURL2;
clickFace.setAttribute("id", "clickFace");

//create closeButton
if (typeof closeButton === "undefined")
  var closeButton = document.createElement("img");

if (typeof imageURL3 === "undefined")
  var imageURL3 = chrome.extension.getURL("sourceImages/closeWindow.png");
closeButton.src = imageURL3;
closeButton.setAttribute("id", "closeButton");

//create faceDiv

//add them to the dom
documentTime.appendChild(happyContainer);
happyContainer.appendChild(clickFace);
happyContainer.appendChild(happyButton);
documentTime.appendChild(closeButton);
