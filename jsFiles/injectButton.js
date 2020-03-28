const documentTime = document.querySelector("body");
  console.log("command:", document);
  console.log("command:", "It did it!!");
  let happyButton = document.createElement('img');
  let imageURL = chrome.extension.getURL("sourceImages/smileyButton.png");
  //let imageURL = 'https://i.picsum.photos/id/545/200/300.jpg'
  happyButton.src = imageURL;
  documentTime.appendChild(happyButton);
  