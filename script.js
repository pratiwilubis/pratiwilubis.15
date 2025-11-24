// script.js
// Helper: shuffle array
function shuffle(arr){
  for(let i = arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

/* ===== Grammar checker (from index.html) ===== */
function checkGrammar(){
  const text = document.getElementById("sentenceInput").value.trim();
  const result = document.getElementById("resultContainer");
  result.innerHTML = "";
  if (!text){
    result.innerHTML = "<div class='error-card'>Please enter a sentence.</div>";
    return;
  }

  let errors = [];
  const rules = [
    { r:/\ba ([aeiou])/i, msg:"Use 'an' before vowel sounds." },
    { r:/\s{2,}/, msg:"Avoid double spaces." },
    { r:/\bchilds\b/i, msg:"'Childs' is incorrect. Use 'children'." },
    { r:/\bgoed\b/i, msg:"'Goed' is incorrect. Use 'went'." }
  ];

  rules.forEach(rule=>{
    if (rule.r.test(text)) errors.push(rule.msg);
  });

  if (errors.length === 0){
    result.innerHTML = "<div class='section success'>✔ Your sentence seems grammatically correct!</div>";
  } else {
    errors.forEach(e=>{
      result.innerHTML += `<div class='error-card'>❌ ${e}</div>`;
    });
  }
}

/* ===== Quiz engine ===== */
const bank = {
  easy: [
    {q:"She ___ hungry.", opts:["is","are","am"], a:0},
    {q:"I saw ___ elephant.", opts:["a","an","the"], a:1},
    {q:"They ___ my friends.", opts:["is","are","be"], a:1},
    {q:"He ___ to school.", opts:["go","goes","gone"], a:1},
    {q:"This ___ a pen.", opts:["is","are","am"], a:0},
    {q:"I ___ coffee.", opts:["likes","like","liking"], a:1},
    {q:"We ___ happy.", opts:["is","are","am"], a:1},
    {q:"She ___ a doctor.", opts:["is","are","am"], a:0},
    {q:"I ___ tired.", opts:["am","is","are"], a:0},
    {q:"He ___ football.", opts:["play","plays","playing"], a:1},
    {q:"___ you okay?", opts:["Are","Is","Am"], a:0},
    {q:"I have ___ cat.", opts:["a","an","the"], a:0},
    {q:"She has ___ umbrella.", opts:["a","an","the"], a:1},
    {q:"We ___ students.", opts:["is","are","am"], a:1},
    {q:"This ___ my bag.", opts:["are","is","am"], a:1},
    {q:"They ___ lunch.", opts:["eat","eats","eating"], a:0},
    {q:"I ___ English.", opts:["study","studies","studying"], a:0},
    {q:"She ___ beautiful.", opts:["is","are","be"], a:0},
    {q:"You ___ my friend.", opts:["are","is","am"], a:0},
    {q:"The cats ___ sleeping.", opts:["is","are","am"], a:1}
  ],
  medium: [
    {q:"He ___ to school every day.", opts:["go","goes","going"], a:1},
    {q:"They ___ finished yet.", opts:["haven't","hasn't","didn't"], a:0},
    {q:"She ___ the movie already.", opts:["saw","has seen","seeing"], a:1},
    {q:"We ___ dinner.", opts:["have ate","have eaten","had ate"], a:1},
    {q:"He ___ there for two hours.", opts:["has been","have been","had been"], a:0},
    {q:"She ___ to the mall yesterday.", opts:["went","go","gone"], a:0},
    {q:"They ___ here since morning.", opts:["have been","has been","had been"], a:0},
    {q:"I ___ my homework.", opts:["have finished","has finished","finished"], a:0},
    {q:"She ___ playing.", opts:["is","are","am"], a:0},
    {q:"He ___ a phone.", opts:["doesn't has","doesn't have","don't have"], a:1},
    {q:"We ___ meet him tomorrow.", opts:["will","would","shall"], a:0},
    {q:"If it rains, we ___ stay home.", opts:["will","would","should"], a:0},
    {q:"She ___ English well.", opts:["speaks","speak","spoke"], a:0},
    {q:"He ___ working now.", opts:["is","are","am"], a:0},
    {q:"They ___ already left.", opts:["have","has","had"], a:0}
  ],
  hard: [
    {q:"If I ___ you, I'd wait.", opts:["was","were","am"], a:1},
    {q:"Had I known, I ___ gone.", opts:["would have","will have","would"], a:0},
    {q:"She suggested that I ___.", opts:["go","to go","going"], a:0},
    {q:"It is essential that he ___ present.", opts:["be","is","are"], a:0},
    {q:"No sooner ___ he arrived.", opts:["had","have","has"], a:0},
    {q:"I wish it ___ not true.", opts:["were","was","is"], a:0},
    {q:"He demanded that she ___ the truth.", opts:["tell","tells","told"], a:0},
    {q:"If only I ___ harder.", opts:["had worked","have worked","worked"], a:0},
    {q:"She behaves as if she ___ everything.", opts:["knew","knows","know"], a:0},
    {q:"It’s time we ___ home.", opts:["went","go","gone"], a:0}
  ]
};

// quiz state
let currentSet = [];
let qIndex = 0;
let score = 0;

function startQuiz(level){
  // clone and shuffle
  currentSet = shuffle(JSON.parse(JSON.stringify(bank[level])));
  // for each question, also shuffle options while keeping track of correct index
  currentSet.forEach(q=>{
    const correctText = q.opts[q.a];
    q.opts = shuffle(q.opts);
    q.a = q.opts.indexOf(correctText);
  });
  qIndex = 0;
  score = 0;
  document.getElementById('startScreen').style.display='none';
  document.getElementById('finalScreen').style.display='none';
  document.getElementById('quizScreen').style.display='block';
  renderQuestion();
  updateProgress();
}

function renderQuestion(){
  const q = currentSet[qIndex];
  document.getElementById('questionText').innerText = q.q;
  const box = document.getElementById('optionsBox');
  box.innerHTML = '';
  q.opts.forEach((opt,i)=>{
    const d = document.createElement('div');
    d.className = 'option';
    d.innerText = opt;
    d.onclick = ()=> selectAnswer(i,d);
    box.appendChild(d);
  });
  updateProgress();
}

function selectAnswer(i, elem){
  const q = currentSet[qIndex];
  const opts = document.querySelectorAll('.option');
  if(i === q.a){
    elem.classList.add('correct');
    score++;
  } else {
    elem.classList.add('wrong');
    // highlight correct
    opts[q.a].classList.add('correct');
  }
  // move next after short delay
  setTimeout(()=>{
    qIndex++;
    if(qIndex >= currentSet.length) finishQuiz();
    else renderQuestion();
  }, 600);
}

function updateProgress(){
  const total = currentSet.length || 0;
  const num = Math.min(qIndex+1, total);
  const pct = total === 0 ? 0 : Math.round((num-1)/total * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressText').innerText = (num>0?num:0) + '/' + total;
}

function finishQuiz(){
  document.getElementById('quizScreen').style.display='none';
  document.getElementById('finalScreen').style.display='block';
  document.getElementById('finalScore').innerText = `Skor: ${score} / ${currentSet.length}`;
}
