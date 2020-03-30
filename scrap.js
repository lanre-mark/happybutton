/**
 * These functions contains the code snippets used to scrap media resources from
 * the websites of interest. The media resources were mainly pictures and a few sounds
 */
function scrap() {
    /// FOR the happyButton backend API hosted on localhost while working on the API  
    // www.unsplash.com
    var images = document.querySelectorAll("img");
    images.forEach(item => {
        if (item.alt !== "" && item.src !== "") {
            fetch("http://localhost:8000/resources", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        section: item.alt,
                        type: "picture",
                        data: item.src
                    })
                })
                .then(function responsefxn(response) {
                    console.log("Response after POST :: ", response);
                    if (response.status === 200) {
                        // chatmessage.value = "";
                        return response.json();
                    }
                })
                .then(response => {
                    console.log("Response after Then :: ", response);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    });


    /// FOR the happyButton backend API hosted on glicth.com

    var countImages = 0;
    var iMages = document.querySelectorAll("img");
    iMages.forEach(item => {
        if (item.alt === "") {
            countImages++;
            console.log(item.src);
        }
    });
    console.log(countImages);

    iMages.forEach(item => {
        if (item.alt !== "" && item.src !== "") {
            fetch("https://alike-sore-hail.glitch.me/resources", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        section: item.alt,
                        type: "picture",
                        data: item.src
                    })
                })
                .then(function responsefxn(response) {
                    console.log("Response after POST :: ", response);
                    if (response.status === 200) {
                        // chatmessage.value = "";
                        return response.json();
                    }
                })
                .then(response => {
                    console.log("Response after Then :: ", response);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    });
}