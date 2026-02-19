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



// ========================
// INCARCA AUTOMAT CATEGORII
// ========================

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



// ========================
// SCHIMBA CATEGORIE/PROBA
// ========================

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



// ========================
// INCARCARE SPORTIVI RAPID
// ========================

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

}



// ========================
// PREZENTA LIVE
// ========================

function ascultaPrezenta(

categorie,

proba

){

const prezentaRef=

ref(

db,

`live/prezenta/${categorie}/${proba}`

);


onValue(

prezentaRef,

snap=>{


let prezenta={};


if(

snap.exists()

)

prezenta=

snap.val();


deseneazaLista(

categorie,

proba,

prezenta

);

}

);

}



// ========================
// DESENEAZA LISTA
// ========================

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

const total=

sportiviGlobal.length;


// SORTARE

sportiviGlobal.sort(

(a,b)=>{

const sa=

prezenta[a.id]?.status;

const sb=

prezenta[b.id]?.status;


if(sa==="prezent")

return -1;

if(sb==="prezent")

return 1;


return a.nume

.localeCompare(

b.nume

);

}

);



// CREARE SPORTIVI

sportiviGlobal.forEach(

sportiv=>{


const status=

prezenta[sportiv.id]

?.status;


if(

status==="prezent"

)

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

`live/prezenta/${categorie}/${proba}/${sportiv.id}`

);


// PREZENT

div.querySelector(

".ok"

)

.onclick=()=>{

set(

prezentaRef,

{

status:"prezent",

ora:Date.now()

}

);

};


// ABSENT

div.querySelector(

".nu"

)

.onclick=()=>{

set(

prezentaRef,

{

status:"absent",

ora:Date.now()

}

);

};


lista.appendChild(div);

});



document

.getElementById(

"contor"

)

.innerHTML=

`${prezenti} / ${total} prezenti`;

}
