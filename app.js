import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getDatabase,
ref,
onValue,
set

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// FIREBASE CONFIG

const firebaseConfig={

apiKey:"XXXX",

authDomain:"XXXX",

databaseURL:

"https://hwarang-1c5dc-default-rtdb.firebaseio.com",

projectId:"hwarang-1c5dc"

};


const app=initializeApp(firebaseConfig);

const db=getDatabase(app);


let sportiviGlobal=[];


// ===========================
// INCARCA AUTOMAT CATEGORII
// ===========================

window.addEventListener("load",()=>{

const select=

document.getElementById("categorie");


const categoriiRef=

ref(db,"sportivi");


onValue(categoriiRef,(snapshot)=>{

select.innerHTML="";


snapshot.forEach(cat=>{

const opt=

document.createElement("option");

opt.value=cat.key;

opt.textContent=cat.key;

select.appendChild(opt);

});

});

});



// ===========================
// INCARCARE SPORTIVI
// ===========================

window.incarcaSportivi=function(){

const categorie=

document.getElementById("categorie").value;

const proba=

document.getElementById("proba").value;


const lista=

document.getElementById("listaSportivi");

lista.innerHTML="Se incarca...";


const sportiviRef=

ref(db,`sportivi/${categorie}`);


onValue(sportiviRef,(snapshot)=>{

sportiviGlobal=[];


snapshot.forEach(child=>{

const sportiv=child.val();


// FILTRU PROBA

if(

sportiv.probe &&

sportiv.probe[proba]

){

sportiviGlobal.push({

id:child.key,

...sportiv

});

}

});


ascultaPrezenta(

categorie,

proba

);

});

};


const categorie=

document.getElementById("categorie").value;


const lista=

document.getElementById("listaSportivi");

lista.innerHTML="Se incarca...";


const sportiviRef=

ref(db,`sportivi/${categorie}`);


onValue(sportiviRef,(snapshot)=>{

sportiviGlobal=[];


snapshot.forEach(child=>{

sportiviGlobal.push({

id:child.key,

...child.val()

});

});


ascultaPrezenta(categorie);

});

};



// ===========================
// PREZENTA LIVE
// ===========================

function ascultaPrezenta(categorie){

const prezentaRef=

ref(db,

`live/prezenta/${categorie}/${proba}/${sportiv.id}

);

onValue(prezentaRef,(snap)=>{

let prezenta={};

if(snap.exists())

prezenta=snap.val();


deseneazaLista(

categorie,

prezenta

);

});

}



// ===========================
// DESENEAZA LISTA
// ===========================

function deseneazaLista(

categorie,

prezenta

){

const lista=

document.getElementById(

"listaSportivi"

);

lista.innerHTML="";


sportiviGlobal.sort(

(a,b)=>a.nume.localeCompare(b.nume)

);


sportiviGlobal.forEach(

sportiv=>{


const status=

prezenta[sportiv.id]?.status;


const div=

document.createElement("div");

div.className="sportiv";


if(status==="prezent")

div.classList.add("prezent");

if(status==="absent")

div.classList.add("absent");


div.innerHTML=`

<div>

<b>${sportiv.nume}</b>

<div class="club">

${sportiv.club}

</div>

</div>

<div>

<button class="ok">

✔

</button>

<button class="nu">

✖

</button>

</div>

`;


const prezentaRef=

ref(

db,

`live/prezenta/${categorie}/${sportiv.id}`

);


// PREZENT

div.querySelector(".ok")

.onclick=()=>{

set(prezentaRef,{

status:"prezent",

ora:Date.now()

});

};


// ABSENT

div.querySelector(".nu")

.onclick=()=>{

set(prezentaRef,{

status:"absent",

ora:Date.now()

});

};


lista.appendChild(div);

});

}
