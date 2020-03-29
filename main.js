
//let happyButtonEl = document.getElementById('happyButton');
//let clickFaceEl = document.getElementById('clickFace');


happyButton.addEventListener('mousedown', function(){
  console.log('hit the event!');
  
  
  happyButton.classList.add('mouseDown');
  
  //LIVE DATABASE
  let resource = resourceWork();

  
  // //NO NEED TO CHANGE THIS AS LONG AS RESOURCE OBJECT HAS TYPE AND RESOURCE URL
  // //FOR STATIC DATABASE
  // let resource = getResource(data);
  // processResource(resource);
});

async function resourceWork(){
  let resource = await fetchResource();
  console.log('obtained Resource:', resource);
  processResource(resource);

}

clickFace.addEventListener('mouseup', () => happyButton.classList.remove('mouseDown'));
closeButton.addEventListener('mouseup', () => {
  
  documentTime.removeChild(happyContainer);
  documentTime.removeChild(closeButton);
});

