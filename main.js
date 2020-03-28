
let happyButtonEl = document.getElementById('happyButton');
let clickFaceEl = document.getElementById('clickFace');


happyButtonEl.addEventListener('mousedown', function(){
  console.log('hit the event!');
  
  
  happyButtonEl.classList.add('mouseDown');
  
  //obtains resource -- SHOULD BE REPLACED WITH DB.GENERATE
  let resource = getResource(data);
  console.log('obtained Resource:', resource);
  
  //NO NEED TO CHANGE THIS AS LONG AS RESOURCE OBJECT HAS TYPE AND RESOURCE URL
  processResource(resource);
});

clickFaceEl.addEventListener('mouseup', () => happyButtonEl.classList.remove('mouseDown'));

