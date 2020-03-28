const happyButtonEl = document.getElementById('happyButton');
const clickFaceEl = document.getElementById('clickFace');

console.log(happyButtonEl)
happyButtonEl.addEventListener('mousedown', function(){
  console.log('hit the event!');
  happyButton.classList.add('mouseDown')
});

clickFaceEl.addEventListener('mouseup', () => happyButton.classList.remove('mouseDown'));
console.log('end main');