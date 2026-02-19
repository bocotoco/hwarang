import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getDatabase,
ref,
get,
onValue,
set

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";



// CONFIG FIREBASE

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


// =======================
// INCARCA CATEGORII
// =======================

window.addEventListener(

"load",

async()=>{

const select=

document.getElementById(

"categorie"

);


const snapshot=

await get(

ref(db,"sportivi")

);


select.innerHTML="";


snapshot.forEach(cat=>{

const opt=

document.createElement(

"option"

);

opt.value=cat.key;

opt.textContent=cat.key;

select.appendChild(opt);

});


// AUTO LOAD

incarcaSportivi();

}

);



// CHANGE EVENTS

document

.getElementById(

"categorie"

)

.addEventListener(

"change",

incarcaSportivi

);


document

.getElementById(

"proba"

)

.addEventListener(

"change",

incarcaSportivi

);



// =======================
// INCARCARE SPORTIVI
// =======================

async function incarcaSportivi(){

const categorie=

document.getElementById(

"categorie"

).value;


const proba=

document.getElementById(

"proba"

).value;


const lista=

document.getElementById(

"listaSportivi"

);

lista.innerHTML="Se incarca...";


const snapshot=

await get(

ref(

db,

`sportivi/${categorie}`

)

);


sportiviGlobal=[];


snapshot.forEach(child=>{

const sportiv=

child.val();


// FILTRU PROBA (CORECT)

if(

sportiv[proba]

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

}



// =======================
// PREZENTA LIVE
// =======================

function ascultaPrezenta(

categorie,

proba

){

onValue(

ref(

db,

`live/prezenta/${categorie}/${proba}`

),

snap=>{


let prezenta={};

if(snap.exists())

prezenta=snap.val();


deseneazaLista(

categorie,

proba,

prezenta

);

}

);

}



// =======================
// DESENEAZA LISTA
// =======================

function deseneazaLista(

categorie,

proba,

prezenta

){

const lista=

document.getElementById(

"listaSportivi"

);

lista.innerHTML="";


let prezenti=0;


sportiviGlobal.sort(

(a,b)=>

a.nume.localeCompare(

b.nume

)

);


sportiviGlobal.forEach(

sportiv=>{


const status=

prezenta[sportiv.id]

?.status;


if(status==="prezent")

prezenti++;


const div=

document.createElement(

"div"

);

div.className="sportiv";


if(status==="prezent")

div.classList.add(

"prezent"

);


if(status==="absent")

div.classList.add(

"absent"

);


div.innerHTML=`

<div>

<b>${sportiv.nume}</b>

<div class="club">

${sportiv.club}

</div>

</div>

<div>

<button>✔</button>

<button>✖</button>

</div>

`;


const prezentaRef=

ref(

db,

`live/prezenta/${categorie}/${proba}/${sportiv.id}`

);


div.children[1]

.children[0]

.onclick=()=>{

set(prezentaRef,{

status:"prezent",

ora:Date.now()

});

};


div.children[1]

.children[1]

.onclick=()=>{

set(prezentaRef,{

status:"absent",

ora:Date.now()

});

};


lista.appendChild(div);

});


document

.getElementById(

"contor"

)

.innerHTML=

`${prezenti} / ${sportiviGlobal.length} prezenti`;

}
