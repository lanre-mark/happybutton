async function fetchResource() {
  let result = await fetch("https://alike-sore-hail.glitch.me/generate")
    .then((response) => {
      // console.log('1st Then: ', response)
      return response.json();
    })

    .then((resources) => {
      // console.log("second Then: ", resources);
      return resources;
    })
    .catch((error) => {
      console.log(error);
    });

  return result;
}
