const ADMIN_PASSWORD = "1234";
let lang = "ar";

const texts = {
  ar:{
    title:"بطولة PMGC",
    subtitle:"مرحبًا بك في الموقع الرسمي للبطولة"
  },
  en:{
    title:"PMGC Tournament",
    subtitle:"Welcome to the official tournament website"
  }
};

const players = [
  {name:"عمر السيد محمد × عمر الشافعي", code:"5682"},
  {name:"محمد أحمد × زياد محمود", code:"1683"},
  {name:"فارس محسن × يوسف عمرو", code:"8331"},
  {name:"معاذ محمود × مهند محمود", code:"2326"},
  {name:"محمد سلامة (أحادي)", code:"1656"}
];

let comments = JSON.parse(localStorage.getItem("comments")) || [];

const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const playersList = document.getElementById("playersList");
const commentsDiv = document.getElementById("comments");

function typeText(el,text){
  el.innerHTML="";
  let i=0;
  let t=setInterval(()=>{
    el.innerHTML+=text[i];
    i++;
    if(i>=text.length)clearInterval(t);
  },60);
}

function speak(text){
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = lang==="ar" ? "ar" : "en-US";
  speechSynthesis.speak(msg);
}

function renderHeader(){
  document.documentElement.dir = lang==="ar"?"rtl":"ltr";
  typeText(titleEl,texts[lang].title);
  typeText(subtitleEl,texts[lang].subtitle);
  speak(texts[lang].subtitle);
}

function toggleLang(){
  lang = lang==="ar"?"en":"ar";
  renderHeader();
}

function renderPlayers(){
  playersList.innerHTML="";
  players.forEach(p=>{
    const div=document.createElement("div");
    div.className="player-card gold";
    div.innerHTML=`<b>${p.name}</b><br>كود الدخول: <strong>${p.code}</strong>`;
    playersList.appendChild(div);
  });
}

function randomLikes(){
  return Math.floor(Math.random()*400)+150;
}

function save(){
  localStorage.setItem("comments",JSON.stringify(comments));
}

function addAdminComment(){
  if(adminPass.value!==ADMIN_PASSWORD){
    alert("كلمة السر غير صحيحة");
    return;
  }
  comments.unshift({
    name:adminName.value,
    text:adminComment.value,
    likes:randomLikes(),
    admin:true
  });
  save();
  renderComments();
  speak(adminComment.value);
}

function likeComment(i){
  comments[i].likes++;
  save();
  renderComments();
}

function deleteComment(i){
  comments.splice(i,1);
  save();
  renderComments();
}

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

renderHeader();
renderPlayers();
renderComments();
