const BASE_URL: string = "https://66e98a6387e417609449dfc5.mockapi.io/api/";
const all: HTMLDivElement = document.querySelector(".all")!;
const reset: HTMLButtonElement = document.querySelector("#reset")!;
const viewDiv:HTMLDivElement = document.querySelector(".viewDiv")!;
const btnAddPasangr:HTMLButtonElement = document.querySelector("#btnAddPasangr")!;
const btnGetAllPasangers:HTMLButtonElement = document.querySelector("#btnGetAllPasangers")!;


reset.addEventListener("click", () => {
    window.location.reload();
});



const createNewPasanger = async (name:string, gender:string, flight_id:string):Promise<boolean> => {
    try{
        const res:Response = await fetch(BASE_URL + "pasangers", {
            method: "POST",
            body: JSON.stringify({
                    createdAt: new Date().toISOString(),
                    name: name,
                    gender: gender,
                    flight_id: flight_id,
                    agent: "meny"
                    }
            ),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        console.log("res.status= ", res.status);
        const post:Pasanger = await res.json();
        console.log(`createNewPasanger= `, post);
        if(res.status == 201){
            alert("the pasanger created");
            return true;
        }
        return false;
    }catch (err){
        console.log("err= ", err);
        return false;
    }
};

btnAddPasangr.addEventListener("click", async (e) => {
    openCreateNewPasangerAlert("");
});


const openCreateNewPasangerAlert = async (pasanger:Pasanger | string = "") => {
    const backroundDiv:HTMLDivElement = document.createElement("div");
    backroundDiv.className = "backroundDiv";
    const createForm:HTMLDivElement = document.createElement("div");
    createForm.className = "createForm";
    const closeFormBtn:HTMLButtonElement = document.createElement("button");
    closeFormBtn.className = "closeFormBtn";
    closeFormBtn.textContent = "❌";
    const selectFlight:HTMLSelectElement = document.createElement("select");
    const allFlights:Flight[] = await getAllFilghts();
    for(let f of allFlights) {
        const newOpsion:HTMLOptionElement = document.createElement("option");
        newOpsion.value = f.id;
        newOpsion.textContent = `form: ${f.from} -> to: ${f.to}`;
        selectFlight.options.add(newOpsion);
    };
    typeof pasanger !== "string" ? selectFlight.selectedIndex = parseInt(pasanger.flight_id) -1 : selectFlight.selectedIndex = 0;
    closeFormBtn.addEventListener("click", (e) => {
        document.body.removeChild(backroundDiv);
    });
    const inputName:HTMLInputElement = document.createElement("input");
    inputName.placeholder = "insert the pasanger name";
    typeof pasanger === "string" ? inputName.value = "" : inputName.value = pasanger.name;
    const inputMale:HTMLInputElement = document.createElement("input");
    const inputFemale:HTMLInputElement = document.createElement("input");
    const maleDiv:HTMLDivElement = document.createElement("div");
    const femaleDiv:HTMLDivElement = document.createElement("div");
    inputMale.type = "radio";
    inputFemale.type = "radio";
    inputMale.name = "gender";
    inputFemale.name = "gender";
    inputMale.value = "male";
    inputFemale.value = "female";
    maleDiv.innerHTML = "male: ";
    maleDiv.appendChild(inputMale);
    femaleDiv.innerHTML = "female: ";
    femaleDiv.appendChild(inputFemale);
    if(typeof pasanger === "string"){
        inputMale.checked = true;
        inputFemale.checked = false;
    }else{
        inputMale.checked = pasanger.gender === "male";
        inputFemale.checked = pasanger.gender === "female";
    }
    const btnCreateNewPasanger: HTMLButtonElement = document.createElement("button");
    btnCreateNewPasanger.textContent = "send";
    btnCreateNewPasanger.addEventListener("click", async (e) => {
        if(typeof pasanger === "string"){
            const chakIfCreated:boolean = await createNewPasanger(inputName.value, inputMale.checked ? "male" : "female", selectFlight.value);
            if(chakIfCreated) document.body.removeChild(backroundDiv);
        } else{
            const newPasager:Pasanger = {
                name:inputName.value?? "",
                gender: inputMale.checked ? "male" : "female",
                flight_id: selectFlight.value,
                createdAt: new Date().toISOString(),
                agent:"meny",
                id:pasanger.id};
            const chakIfCreated:boolean = await editPasangerById(pasanger.id, newPasager);
            chakIfCreated ? document.body.removeChild(createForm) : alert("לא ניתן לעדכן את הנוסע");
        }
    });
    createForm.append(closeFormBtn, emptyDiv(), selectFlight, emptyDiv(), maleDiv, femaleDiv, inputName, btnCreateNewPasanger);
    backroundDiv.appendChild(createForm);
    backroundDiv.style.display = "block";
    backroundDiv.style.position = "fixed";
    backroundDiv.style.top = "0";
    backroundDiv.style.left = "0";
    backroundDiv.style.width = "100%";
    backroundDiv.style.height = "100%";
    backroundDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    backroundDiv.style.zIndex = "1";
    document.body.appendChild(backroundDiv);
}


const getAllPasangers = async (idFligth:string = ""):Promise<void> => {
    try{
        const res:Response = await fetch(BASE_URL + `pasangers?agent=meny`);
        const json:Pasanger[] = await res.json();
        console.log(json);
        viewDiv.textContent = "";
        if(res.status == 200){
            if(idFligth == ""){
                for(const pasanger of json){
                    viewDiv.appendChild(createCardPasanger(pasanger));
                };
                return;
            }
            const currentFlightsPasangers = json.filter((c) => {return c.flight_id == idFligth});
            if(currentFlightsPasangers.length == 0){
                alert("אין לך נוסעים בטיסה זו עדיין");
                return fillingMainWithFlights();
            }
            for(const pasanger of currentFlightsPasangers){
                viewDiv.appendChild(createCardPasanger(pasanger));
            };
            return;
        }
        viewDiv.textContent = "אין לך נסיעות עדיין";
    }catch (err){
        console.log(err);
    };
};

const createCardPasanger = (pasanger:Pasanger):HTMLDivElement => {
    const cardDiv:HTMLDivElement = document.createElement("div");
    cardDiv.className = "card";
    const createdAt : HTMLHeadingElement = document.createElement("h4");
    createdAt.textContent = pasanger.createdAt;
    const agent: HTMLHeadingElement = document.createElement("h5");
    agent.textContent = "agent: " + pasanger.agent;
    const gender: HTMLHeadingElement = document.createElement("h5");
    gender.textContent = "gender: " + pasanger.gender;
    const name: HTMLHeadingElement = document.createElement("h5");
    name.textContent = "name: " + pasanger.name;
    const flight_id: HTMLParagraphElement = document.createElement("p");
    flight_id.textContent = "flight_id: " + pasanger.flight_id;
    const deletePasanger:HTMLButtonElement = document.createElement("button");
    deletePasanger.className = "classicButton";
    deletePasanger.textContent = "🗑️";
    deletePasanger.title = "delete passanger";
    deletePasanger.addEventListener("click", (e) => {
        deletePasangerById(pasanger.id);
    });
    const editPasanger:HTMLButtonElement = document.createElement("button");
    editPasanger.className = "classicButton";
    editPasanger.textContent = "🏗️";
    editPasanger.title = "edit passanger";
    editPasanger.addEventListener("click", async (e) => {
        alert(`edit passenger with id: ${pasanger.id}`);
        openCreateNewPasangerAlert(pasanger);
    });
    const buttomDiv:HTMLDivElement = document.createElement("div");
    buttomDiv.append(deletePasanger, editPasanger);
    buttomDiv.className = "flex whith-100 justify-content-center";
    cardDiv.append(name, agent, gender, flight_id, emptyDiv(), buttomDiv);
    return cardDiv;
};


const deletePasangerById = async (id:string):Promise<void> => {
    try{
        const res:Response = await fetch(`${BASE_URL}pasangers/${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const pasanger:Pasanger = await res.json();
        console.log(`pasanger= `, pasanger);
        if(res.status == 200){
            alert(`pasanger with id: ${pasanger.id} deleted`);
            getAllPasangers();
        }
    }catch (err){
        console.log(err);
    };
};


const editPasangerById = async (id:string, pasanger:Pasanger):Promise<boolean> => {
    try{
        const res:Response = await fetch(`${BASE_URL}pasangers/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                agent: pasanger.agent,
                createdAt: pasanger.createdAt,
                flight_id: pasanger.flight_id,
                name: pasanger.name,
                gender:pasanger.gender
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const post = await res.json();
        console.log(`post= `, post);
        getAllPasangers();
        return true;
    }catch (err){
        console.log("err= ", err);
        return false;
    }
}


btnGetAllPasangers.addEventListener("click", (e) => {
    getAllPasangers();
});




const emptyDiv = ():HTMLDivElement =>{
    const empty:HTMLDivElement = document.createElement("div");
    empty.style.height = "10%";
    return empty;
}

const getAllFilghts = async ():Promise<Flight[]> => {
    try{
        const res:Response = await fetch(BASE_URL + "flights");
        const json:Flight[] = await res.json();
        // console.log(json);
        return json;
    }catch (err){
        console.log(err);
        return [];
    };
}

const fillingMainWithFlights = async ():Promise<void> => {
    try{
        const allFlights = await getAllFilghts();
        if(allFlights.length == 0){
            viewDiv.textContent = "אין נסיעות עדיין";
            return;
        }
        viewDiv.textContent = "";
        for(const flight of allFlights){
            viewDiv.appendChild(createCardFlight(flight));
        };
    }catch (err){
        console.log(err);
    };
};
fillingMainWithFlights();


const createCardFlight = (flight:Flight):HTMLDivElement => {
    const cardDiv:HTMLDivElement = document.createElement("div");
    cardDiv.className = "card";
    const from_to : HTMLHeadingElement = document.createElement("h4");
    from_to.textContent = "from: " + flight.from + " to: -> " + flight.to;
    const date: HTMLHeadingElement = document.createElement("h5");
    date.textContent = "date: " + flight.date;
    const id:HTMLParagraphElement = document.createElement("p");
    id.textContent = flight.id;
    const btnGetItsPasangers:HTMLButtonElement = document.createElement("button");
    btnGetItsPasangers.textContent = "get all pasangers";
    btnGetItsPasangers.addEventListener("click", (e) => {
        getAllPasangers(flight.id);
    })

    cardDiv.append(from_to, date, id, btnGetItsPasangers);
    return cardDiv;
};









interface Flight {
    id:string;
    to:string;
    from:string;
    date:string;
};

interface Pasanger {
    createdAt: string;
    name: string;
    gender: string;
    flight_id: string;
    agent: string;//שם הסוכן שהכניס את הטיסה(אני)
    id: string;
}