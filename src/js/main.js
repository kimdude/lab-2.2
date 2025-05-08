//Fetching elements from HTML-file
const url = "https://workexperienceapi.onrender.com/api/employers";
const list = document.getElementById("list");
const submitBtn = document.getElementById("submit");

if(list != null) {
    getData();
}

//Adding eventlisteners
if(submitBtn != null) {
    submitBtn.addEventListener("click", function(event) {
        addExpirience(event);
    });
}

//Fetching data
async function getData() {
    //Try/catch to call API
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok) {
            throw new Error('An error occurred. Invalid answer from server.');
        }
    
        const data = await response.json();
        listExp(data);

    } catch (error) {
        console.log("An error occurred: ", error.message);

    }
}

//Listing workexperience
async function listExp(data) {
    for(let i = 0; i < data.length; i++) {

        let article = document.createElement("article");
        let header = document.createElement("h2");
        let employerEl = document.createTextNode(data[i].jobtitle);

        list.appendChild(article);
        article.appendChild(header);
        header.appendChild(employerEl);

        let roleEl = document.createElement("h3");
        let role = document.createTextNode(data[i].companyname + ", " + data[i].location);

        article.appendChild(roleEl);
        roleEl.appendChild(role);

        let descrEl = document.createElement("p");
        let descr= document.createTextNode(data[i].description);

        article.appendChild(descrEl);
        descrEl.appendChild(descr);

        let startFormated = data[i].startdate.slice(0,10);
        let endFormated = data[i].enddate.slice(0,10);
        let datesEl = document.createElement("p");
        let start = document.createTextNode(startFormated + " - ");
        let end = document.createTextNode(endFormated);

        article.appendChild(datesEl);
        datesEl.appendChild(start);
        datesEl.appendChild(end);

        let editBtn = document.createElement("button");
        let editNode = document.createTextNode("Redigera");

        article.appendChild(editBtn);
        editBtn.appendChild(editNode);

        editBtn.addEventListener("click", function(e) {
            editExp(data[i], e);
        });

        let deleteBtn = document.createElement("button");
        let deleteNode = document.createTextNode("Ta bort");

        article.appendChild(deleteBtn);
        deleteBtn.appendChild(deleteNode);

        //Eventlistener to delete experience
        deleteBtn.addEventListener("click", function() {
            deleteExp(data[i].id);
        });
    }
}

//Edit experience
async function editExp(data, e) {

    const article = e.target.parentElement;
    article.style.backgroundColor = "transparent";
    article.innerHTML = "<div id=edit></div>";
    const editDiv = document.getElementById("edit");

    let nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "companyNew");
    let labelNode = document.createTextNode("Arbetsgivare: ");
    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("name", "companyNew");
    nameInput.setAttribute("id", "companyNew");
    nameInput.setAttribute("value", data.companyname);

    editDiv.appendChild(nameLabel);
    nameLabel.appendChild(labelNode);
    editDiv.appendChild(nameInput);

    let titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "titleNew");
    let titleNode = document.createTextNode("Yrkestitel: ");
    let titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("name", "titleNew");
    titleInput.setAttribute("id", "titleNew");
    titleInput.setAttribute("value", data.jobtitle);

    editDiv.appendChild(titleLabel);
    titleLabel.appendChild(titleNode);
    editDiv.appendChild(titleInput);

    let locationLabel = document.createElement("label");
    locationLabel.setAttribute("for", "locationNew");
    let locationNode = document.createTextNode("Plats: ");
    let locationInput = document.createElement("input");
    locationInput.setAttribute("type", "text");
    locationInput.setAttribute("name", "locationNew");
    locationInput.setAttribute("id", "locationNew");
    locationInput.setAttribute("value", data.location);

    editDiv.appendChild(locationLabel);
    locationLabel.appendChild(locationNode);
    editDiv.appendChild(locationInput);

    let startLabel = document.createElement("label");
    startLabel.setAttribute("for", "startNew");
    let startNode = document.createTextNode("Från: ");
    let startInput = document.createElement("input");
    startInput.setAttribute("type", "date");
    startInput.setAttribute("name", "startNew");
    startInput.setAttribute("id", "startNew");
    let startFormated = data.startdate.slice(0,10);
    startInput.setAttribute("value", startFormated);

    editDiv.appendChild(startLabel);
    startLabel.appendChild(startNode);
    editDiv.appendChild(startInput);

    let endLabel = document.createElement("label");
    endLabel.setAttribute("for", "endNew");
    let endNode = document.createTextNode("Till: ");
    let endInput = document.createElement("input");
    endInput.setAttribute("type", "date");
    endInput.setAttribute("name", "endNew");
    endInput.setAttribute("id", "endNew");
    let endFormated = data.enddate.slice(0,10);
    endInput.setAttribute("value", endFormated);

    editDiv.appendChild(endLabel);
    endLabel.appendChild(endNode);
    editDiv.appendChild(endInput);

    let descrLabel = document.createElement("label");
    descrLabel.setAttribute("for", "descrNew")
    let descrNode = document.createTextNode("Arbetsbeskrivning: ");
    let descrInput = document.createElement("textarea");
    descrInput.setAttribute("name", "descrNew");
    descrInput.setAttribute("id", "descrNew");
    let descrValue = document.createTextNode(data.description);

    editDiv.appendChild(descrLabel);
    descrLabel.appendChild(descrNode);
    editDiv.appendChild(descrInput);
    descrInput.appendChild(descrValue);


    //Adding button to confirm changes
    let confirmBtn = document.createElement("button");
    let confirmNode = document.createTextNode("Uppdatera");

    confirmBtn.addEventListener("click", function() {
        let newExp = {
            companyname: nameInput.value,
            jobtitle: titleInput.value,
            location: locationInput.value,
            startdate: startInput.value,
            enddate: endInput.value,
            description: descrInput.value
        }

        confirmExp(newExp, data.id);
    })

    article.appendChild(confirmBtn);
    confirmBtn.appendChild(confirmNode);
}

//Updates edit
async function confirmExp(newExp, id) {
    try {
        const response = await fetch(url + "/" + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newExp)
        });

        if(!response.ok) {
            throw new Error('An error occurred. Invalid answer from server.');
        }
    
        list.innerHTML = "";
        getData();

    } catch (error) {
        console.log("An error occurred: ", error.message);

    }
}

//Deleting experience
async function deleteExp(id) {
    try {
        const response = await fetch(url + "/" + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok) {
            throw new Error('An error occurred. Invalid answer from server.');
        }
    
        list.innerHTML = "";
        getData();

    } catch (error) {
        console.log("An error occurred: ", error.message);

    }
}

//Adding experience
async function addExpirience(event) {
    event.preventDefault(); //Preventing page from reloading

    const companyName = document.getElementById("company");
    const jobtitle = document.getElementById("title");
    const location = document.getElementById("location");
    const startDate = document.getElementById("start");
    const endDate = document.getElementById("end");
    const descr = document.getElementById("descr");

    //Timing message
    const confirm = document.getElementById("confirm");
    confirm.style.display = "block";
    setTimeout(displayConfirmation, 5000);
    function displayConfirmation () {
        confirm.style.display = "none";
    }

    const errors = [];

    let newExp = {
        companyname: companyName.value,
        jobtitle: jobtitle.value,
        location: location.value,
        startdate: startDate.value,
        enddate: endDate.value,
        description: descr.value
    }

    if(newExp.companyname === "") {
        let errorMessage = "arbetsgivare";
        errors.push(errorMessage);

    } 
    
    if(newExp.jobtitle === "") {
        let errorMessage = "yrkestitel";
        errors.push(errorMessage);

    }
    
    if (newExp.location === "") {
        let errorMessage = "plats";
        errors.push(errorMessage);

    }
    
    if (newExp.startdate === "") {
        let errorMessage = "startdatum";
        errors.push(errorMessage);

    }
    
    if (newExp.enddate === "") {
        let errorMessage = "slutdatum";
        errors.push(errorMessage);

    } 

    if (newExp.description === "") {
        let errorMessage = "beskriving";
        errors.push(errorMessage);

    } 
    
    if(errors.length === 0) {
        //Try/catch to call API
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newExp)
            });

            if(!response.ok) {
                throw new Error('An error occurred. Invalid answer from server.');
            }

        } catch (error) {
            console.log("An error occurred: ", error.message);

        }

        companyName.value = "";
        jobtitle.value = "";
        location.value = "";
        startDate.value = "";
        endDate.value = "";
        descr.value = "";

    } else {
        confirm.innerHTML = "Du måste ange <strong>" + errors.toString() + "</strong>.";

    }

}
