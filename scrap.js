function scrap() {
    // www.unsplash.com
    images = document.querySelectorAll("img");
    images.forEach(item => {
        if (item.alt !== "") {
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

    images = document.querySelectorAll("img");
    images.forEach(item => {
        if (item.alt !== "") {
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