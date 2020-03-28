console.log('process File Active');

function processResource(passedResource) {
  console.log('passedResource: ', passedResource);
  let resourceType = passedResource.type;
  console.log(resourceType);

  //handle sound
  if(resourceType === 'sound'){
    let soundFile = passedResource.resource;
    let soundUrl = chrome.extension.getURL(soundFile);
    let audio = new Audio(soundUrl);
    audio.play();
  }

  // handle image
  if(resourceType === 'picture'){
//This return images...but not reliably. Too many random errors
    // setTimeout(() => {
    //   const cuteImage = document.createElement('img');
    //   let imageURL = passedResource.resource
    //   cuteImage.src = imageURL;
    //   cuteImage.setAttribute('id','cuteImage');
    //   happyContainer.appendChild(cuteImage);
    //   // cuteImage.addEventListener('click', documentTime.removeChild(happyContainer));
    // }, 500);

    //not a popup....but more reliable
    chrome.runtime.sendMessage({message: passedResource.resource}, (response) => {
    console.log(response.message);
    });


   // setTimeout(removeAllContent,10000);
  };

  // handle website
  if(resourceType === 'website'){
    console.log(chrome);
    chrome.runtime.sendMessage({message: passedResource.resource}, (response) => {
      console.log(response.message);
    });

    //setTimeout(removeAllContent,10000);
  };

  }

  function removeAllContent() {
    console.log('called Remove');
    documentTime.removeChild(happyContainer);
   
  }