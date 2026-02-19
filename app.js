import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getDatabase,
ref,
get,
set

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// FIREBASE CONFIG

const firebaseConfig = {

apiKey:"XXXX",

authDomain:"XXXX",

databaseURL:

"https://hwarang-1c5dc-default-rtdb.firebaseio.com",

projectId:"hwarang-1c5dc"

};


const app = initializeApp(firebaseConfig);

const db = getDatabase(app);



// =====================
// INCARCA CATEGORII
// =====================

window.addEventListener("load", async ()=>{

const select=

document.getElementById("categorie");

select.innerHTML="Se incarca...";


const snapshot=

await get(

ref(db,"sportivi")

);


select.innerHTML="";


snapshot.forEach(cat=>{

const opt=

document.createElement("option");

opt.value=cat.key;

opt.textContent=cat.key;

select.appendChild(opt);

});


incarcaSportivi();

});



// CHANGE

document.getElementById("categorie")

.addEventListener(

"change",

incarcaSportivi

);

document.getElementById("proba")

.addEventListener(

"change",

incarcaSportivi

);



// =====================
// INCARCARE SPORTIVI
// =====================

async function incarcaSportivi(){

const categorie=

document.getElementById("categorie").value;

const proba=

document.getElementById("proba").value;


const lista=

document.getElementById("listaSportivi");

lista.innerHTML="Se incarca...";


const snapshot=

await get(

ref(

db,

`sportivi/${categorie}`

)

);


lista.innerHTML="";


if(!snapshot.exists()){

lista.innerHTML="Nu exista sportivi";

return;

}


snapshot.forEach(child=>{

const sportiv=child.val();

const id=child.key;


// CREARE DIV

const div=document.createElement("div");

div.className="sportiv";


div.innerHTML=`

<div>

<b>${sportiv.nume}</b>

<div class="club">

${sportiv.club}

</div>

</div>

<div>

<button class="ok">✔</button>

<button class="nu">✖</button>

</div>

`;


// PREZENTA

const prezentaRef=

ref(

db,

`live/prezenta/${categorie}/${proba}/${id}`

);


div.querySelector(".ok")

.onclick=()=>{

set(prezentaRef,{

status:"prezent",

ora:Date.now()

});

};


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
