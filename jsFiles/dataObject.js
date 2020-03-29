function getResource(dataBase) {
  const types = ['website', 'sound', 'image', 'video'];

  let randomType = types[Math.floor(Math.random()*4)];
  
  let resourceKeys = Object.keys(dataBase[randomType]);
  let randomResourceIndex = Math.floor(Math.random()*resourceKeys.length);
  let randomResourceKey = resourceKeys[randomResourceIndex];
  return dataBase[randomType][randomResourceKey];
}