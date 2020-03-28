const documentTime = document.querySelector("body");

  console.log("command:", document);
  console.log("command:", "It did it!!");

  //create container and button
  const happyContainer = document.createElement('div');
  const happyButton = document.createElement('img');
  let imageURL = chrome.extension.getURL("sourceImages/smileyButton.png");
  happyButton.src = imageURL;
  happyButton.classList.add('happyButton');

//add them to the dom
  documentTime.appendChild(happyContainer);
  happyContainer.appendChild(happyButton);
  