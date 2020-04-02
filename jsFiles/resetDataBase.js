
  async function resetData(){

    let result = await fetch("https://alike-sore-hail.glitch.me/reset")
      .then(response => {
        console.log('1st Then: ', response)
        return response.json();
        })
    
      .then(resources => {
        console.log("second Then: ", resources);
        return resources;
      })
      .catch((error) => {
        console.log(error);
      });
      console.log('return database', result);
      return result
    }

    resetData();