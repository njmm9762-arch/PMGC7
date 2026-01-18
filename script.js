let audioEnabled = false;
let lang = "ar";
const ADMIN_PASSWORD = "1234";

const texts = {
  ar:{title:"بطولة PMGC", subtitle:"مرحبًا بك في الموقع الرسمي للبطولة"},
  en:{title:"PMGC Tournament", subtitle:"Welcome to the official tournament website"}
};

// اللاعبين مع الأكواد والID
const players=[
  {name:"عمر السيد محمد", code:"5682", id:"5535938673"},
  {name:"عمر الشافعي", code:"1683", id:"5780015747"},
  {name:"محمد أحمد", code:"0618", id:"5114404295"},
  {name:"زياد محمود", code:"4681", id:"5181732509"},
  {name:"فارس محسن", code:"8331", id:"52013524002"},
  {name:"يوسف عمرو", code:"1656", id:"5568744837"},
  {name:"معاذ محمود", code:"8989", id:"5888700371"},
  {name:"مهند محمود", code:"2326", id:"5789024569"},
  {name:"محمد سلامة", code:"1656", id:"5964471266"}
];

let comments=JSON.parse(localStorage.getItem("comments"))||[];

const playersList=document.getElementById("playersList");
const commentsDiv=document.getElementById("comments");
const welcomeScreen=document.getElementById("welcomeScreen");
const mainContent=document.getElementById("mainContent");

function enterSite(){
  audioEnabled=true;
  welcomeScreen.style.display="none";
  mainContent.style.display="block";
  speak("مرحبًا بك في بطولة PMGC");
  renderPlayers();
  renderComments();
}

function speak(text){
  if(!audioEnabled) return;
  const msg=new SpeechSynthesisUtterance(text);
  msg.lang=lang==="ar"?"ar":"en-US";
  speechSynthesis.speak(msg);
}

function toggleLang(){
  lang=lang==="ar"?"en":"ar";
  document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  document.getElementById("title").innerText=texts[lang].title;
  document.getElementById("subtitle").innerText=texts[lang].subtitle;
}

function renderPlayers(){
  playersList.innerHTML="";
  players.forEach(player=>{
    const msg=`تم قبول اللاعب ${player.name} في بطولة PMGC. كود الدخول الخاص بك هو ${player.code}`;
    const whatsappLink=`https://wa.me/201211056530?text=${encodeURIComponent(msg)}`;
    const div=document.createElement("div");
    div.className="player-card gold";
    div.innerHTML=`
      <h3>${player.name}</h3>
      <p>ID: ${player.id}</p>
      <p>كود الدخول: <strong>${player.code}</strong></p>
      <button onclick="speakPlayer('${player.name}','${player.code}')">🔊 نطق القبول</button>
      <a href="${whatsappLink}" target="_blank">
        <button>📱 واتساب – تأكيد الانضمام</button>
      </a>
    `;
    playersList.appendChild(div);
  });
}

function speakPlayer(name, code){
  const text=`تم قبول اللاعب ${name} في بطولة PMGC. كود الدخول الخاص بك هو ${code}`;
  speak(text);
}

function randomLikes(){return Math.floor(Math.random()*400)+150;}
function save(){localStorage.setItem("comments",JSON.stringify(comments));}

function addAdminComment(){
  if(document.getElementById("adminPass").value!==ADMIN_PASSWORD){
    alert("كلمة سر غير صحيحة");
    return;
  }
  comments.unshift({
    name:document.getElementById("adminName").value,
    text:document.getElementById("adminComment").value,
    likes:randomLikes(),
    admin:true
  });
  save();
  renderComments();
  speak(document.getElementById("adminComment").value);
}

function likeComment(i){comments[i].likes++;save();renderComments();}
function deleteComment(i){comments.splice(i,1);save();renderComments();}

function renderComments(){
  commentsDiv.innerHTML="";
  comments.forEach((c,i)=>{
    const d=document.createElement("div");
    d.className="comment"+(c.admin?" gold":"");
    d.innerHTML=`
      <b>${c.admin?"⭐ إداري: ":""}${c.name}</b>
      <div>${c.text}</div>
      <div class="actions">
        <span class="like" onclick="likeComment(${i})">👍 ${c.likes}</span>
        <span class="delete" onclick="deleteComment(${i})">🗑 حذف</span>
      </div>
    `;
    commentsDiv.appendChild(d);
  });
}
