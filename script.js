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
    result.innerHTML = "<div class='section'>✔ Your sentence seems grammatically correct!</div>";
  } else {
    errors.forEach(e=>{
      result.innerHTML += `<div class='error-card'>❌ ${e}</div>`;
    });
  }
}

const questions = {
  easy:[
    { q:"Choose the correct form: She ___ happy.", a:["is","are","am"], c:0 },
    { q:"Choose the correct article: I saw ___ elephant.", a:["a","an"], c:1 }
  ],
  medium:[
    { q:"Choose the correct sentence.", a:["He go to school.","He goes to school."], c:1 },
    { q:"Find the correct past tense.", a:["He eated food.","He ate food."], c:1 }
  ],
  hard:[
    { q:"Choose the grammatically correct option.", a:["If I was you, I'd go.","If I were you, I'd go."], c:1 },
    { q:"Correct form?", a:["She suggested me to go.","She suggested that I go."], c:1 }
  ]
};

let currentSet=[];
let currentIndex=0;
let score=0;
let streak=0;

function startQuiz(level){
  currentSet = questions[level];
  currentIndex = 0;
  score = 0;
  streak = 0;
  document.getElementById("quizBox").style.display="block";
  document.getElementById("finalResult").innerHTML="";
  showQuestion();
}

function showQuestion(){
  const q = currentSet[currentIndex];
  document.getElementById("quizQuestion").innerHTML = q.q;

  const optionsDiv = document.getElementById("quizOptions");
  optionsDiv.innerHTML = "";

  q.a.forEach((opt,i)=>{
    const btn = document.createElement("div");
    btn.className="quiz-option";
    btn.innerHTML=opt;
    btn.onclick=()=> checkAnswer(i);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(choice){
  const q=currentSet[currentIndex];
  const options=document.querySelectorAll(".quiz-option");

  if (choice === q.c){
    options[choice].classList.add("correct");
    score++;
    streak++;
  } else {
    options[choice].classList.add("wrong");
    streak=0;
  }

  setTimeout(()=>{
    currentIndex++;
    if (currentIndex < currentSet.length){
      showQuestion();
    } else {
      showFinal();
    }
  },700);
}

function showFinal(){
  document.getElementById("quizBox").style.display="none";
  document.getElementById("finalResult").innerHTML=
    `<h2>Quiz Completed!</h2>
     <p>Correct: ${score}</p>
     <p>Wrong: ${currentSet.length-score}</p>`;
}
