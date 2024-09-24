"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = "https://66e98a6387e417609449dfc5.mockapi.io/api/";
const all = document.querySelector(".all");
const reset = document.querySelector("#reset");
const viewDiv = document.querySelector(".viewDiv");
const btnAddPasangr = document.querySelector("#btnAddPasangr");
const btnGetAllPasangers = document.querySelector("#btnGetAllPasangers");
reset.addEventListener("click", () => {
    window.location.reload();
});
const createNewPasanger = (name, gender, flight_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(BASE_URL + "pasangers", {
            method: "POST",
            body: JSON.stringify({
                createdAt: new Date().toISOString(),
                name: name,
                gender: gender,
                flight_id: flight_id,
                agent: "meny"
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        console.log("res.status= ", res.status);
        const post = yield res.json();
        console.log(`createNewPasanger= `, post);
        if (res.status == 201) {
            alert("the pasanger created");
            return true;
        }
        return false;
    }
    catch (err) {
        console.log("err= ", err);
        return false;
    }
});
btnAddPasangr.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    openCreateNewPasangerAlert("");
}));
const openCreateNewPasangerAlert = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (pasanger = "") {
    const backroundDiv = document.createElement("div");
    backroundDiv.className = "backroundDiv";
    const createForm = document.createElement("div");
    createForm.className = "createForm";
    const closeFormBtn = document.createElement("button");
    closeFormBtn.className = "closeFormBtn";
    closeFormBtn.textContent = "❌";
    const selectFlight = document.createElement("select");
    const allFlights = yield getAllFilghts();
    for (let f of allFlights) {
        const newOpsion = document.createElement("option");
        newOpsion.value = f.id;
        newOpsion.textContent = `form: ${f.from} -> to: ${f.to}`;
        selectFlight.options.add(newOpsion);
    }
    ;
    typeof pasanger !== "string" ? selectFlight.selectedIndex = parseInt(pasanger.flight_id) - 1 : selectFlight.selectedIndex = 0;
    closeFormBtn.addEventListener("click", (e) => {
        document.body.removeChild(backroundDiv);
    });
    const inputName = document.createElement("input");
    inputName.placeholder = "insert the pasanger name";
    typeof pasanger === "string" ? inputName.value = "" : inputName.value = pasanger.name;
    const inputMale = document.createElement("input");
    const inputFemale = document.createElement("input");
    const maleDiv = document.createElement("div");
    const femaleDiv = document.createElement("div");
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
    if (typeof pasanger === "string") {
        inputMale.checked = true;
        inputFemale.checked = false;
    }
    else {
        inputMale.checked = pasanger.gender === "male";
        inputFemale.checked = pasanger.gender === "female";
    }
    const btnCreateNewPasanger = document.createElement("button");
    btnCreateNewPasanger.textContent = "send";
    btnCreateNewPasanger.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (typeof pasanger === "string") {
            const chakIfCreated = yield createNewPasanger(inputName.value, inputMale.checked ? "male" : "female", selectFlight.value);
            if (chakIfCreated)
                document.body.removeChild(backroundDiv);
        }
        else {
            const newPasager = {
                name: (_a = inputName.value) !== null && _a !== void 0 ? _a : "",
                gender: inputMale.checked ? "male" : "female",
                flight_id: selectFlight.value,
                createdAt: new Date().toISOString(),
                agent: "meny",
                id: pasanger.id
            };
            const chakIfCreated = yield editPasangerById(pasanger.id, newPasager);
            chakIfCreated ? document.body.removeChild(createForm) : alert("לא ניתן לעדכן את הנוסע");
        }
    }));
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
});
const getAllPasangers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (idFligth = "") {
    try {
        const res = yield fetch(BASE_URL + `pasangers?agent=meny`);
        const json = yield res.json();
        console.log(json);
        viewDiv.textContent = "";
        if (res.status == 200) {
            if (idFligth == "") {
                for (const pasanger of json) {
                    viewDiv.appendChild(createCardPasanger(pasanger));
                }
                ;
                return;
            }
            const currentFlightsPasangers = json.filter((c) => { return c.flight_id == idFligth; });
            if (currentFlightsPasangers.length == 0) {
                alert("אין לך נוסעים בטיסה זו עדיין");
                return fillingMainWithFlights();
            }
            for (const pasanger of currentFlightsPasangers) {
                viewDiv.appendChild(createCardPasanger(pasanger));
            }
            ;
            return;
        }
        viewDiv.textContent = "אין לך נסיעות עדיין";
    }
    catch (err) {
        console.log(err);
    }
    ;
});
const createCardPasanger = (pasanger) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    const createdAt = document.createElement("h4");
    createdAt.textContent = pasanger.createdAt;
    const agent = document.createElement("h5");
    agent.textContent = "agent: " + pasanger.agent;
    const gender = document.createElement("h5");
    gender.textContent = "gender: " + pasanger.gender;
    const name = document.createElement("h5");
    name.textContent = "name: " + pasanger.name;
    const flight_id = document.createElement("p");
    flight_id.textContent = "flight_id: " + pasanger.flight_id;
    const deletePasanger = document.createElement("button");
    deletePasanger.className = "classicButton";
    deletePasanger.textContent = "🗑️";
    deletePasanger.title = "delete passanger";
    deletePasanger.addEventListener("click", (e) => {
        deletePasangerById(pasanger.id);
    });
    const editPasanger = document.createElement("button");
    editPasanger.className = "classicButton";
    editPasanger.textContent = "🏗️";
    editPasanger.title = "edit passanger";
    editPasanger.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
        alert(`edit passenger with id: ${pasanger.id}`);
        openCreateNewPasangerAlert(pasanger);
    }));
    const buttomDiv = document.createElement("div");
    buttomDiv.append(deletePasanger, editPasanger);
    buttomDiv.className = "flex whith-100 justify-content-center";
    cardDiv.append(name, agent, gender, flight_id, emptyDiv(), buttomDiv);
    return cardDiv;
};
const deletePasangerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(`${BASE_URL}pasangers/${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const pasanger = yield res.json();
        console.log(`pasanger= `, pasanger);
        if (res.status == 200) {
            alert(`pasanger with id: ${pasanger.id} deleted`);
            getAllPasangers();
        }
    }
    catch (err) {
        console.log(err);
    }
    ;
});
const editPasangerById = (id, pasanger) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(`${BASE_URL}pasangers/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                agent: pasanger.agent,
                createdAt: pasanger.createdAt,
                flight_id: pasanger.flight_id,
                name: pasanger.name,
                gender: pasanger.gender
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const post = yield res.json();
        console.log(`post= `, post);
        getAllPasangers();
        return true;
    }
    catch (err) {
        console.log("err= ", err);
        return false;
    }
});
btnGetAllPasangers.addEventListener("click", (e) => {
    getAllPasangers();
});
const emptyDiv = () => {
    const empty = document.createElement("div");
    empty.style.height = "10%";
    return empty;
};
const getAllFilghts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(BASE_URL + "flights");
        const json = yield res.json();
        // console.log(json);
        return json;
    }
    catch (err) {
        console.log(err);
        return [];
    }
    ;
});
const fillingMainWithFlights = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allFlights = yield getAllFilghts();
        if (allFlights.length == 0) {
            viewDiv.textContent = "אין נסיעות עדיין";
            return;
        }
        viewDiv.textContent = "";
        for (const flight of allFlights) {
            viewDiv.appendChild(createCardFlight(flight));
        }
        ;
    }
    catch (err) {
        console.log(err);
    }
    ;
});
fillingMainWithFlights();
const createCardFlight = (flight) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    const from_to = document.createElement("h4");
    from_to.textContent = "from: " + flight.from + " to: -> " + flight.to;
    const date = document.createElement("h5");
    date.textContent = "date: " + flight.date;
    const id = document.createElement("p");
    id.textContent = flight.id;
    const btnGetItsPasangers = document.createElement("button");
    btnGetItsPasangers.textContent = "get all pasangers";
    btnGetItsPasangers.addEventListener("click", (e) => {
        getAllPasangers(flight.id);
    });
    cardDiv.append(from_to, date, id, btnGetItsPasangers);
    return cardDiv;
};
;
