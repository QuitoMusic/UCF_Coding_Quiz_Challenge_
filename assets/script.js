

let startBtn = document.getElementById('start-btn');
let questionContainerEl = document.getElementById("question-container");
let highscoresContainerEl = document.getElementById("highscores-container");
let highscoresListEl = document.getElementById("highscores-list");
let clearBtn = document.getElementById("clear-btn");
let restartBtn = document.getElementById("restart-btn");
let questionEl = document.getElementById("question");
let answerButtonsEl = document.getElementById("answer-buttons");
let feedbackEl = document.getElementById("feedback"); 
let timerEl = document.createElement("p"); 
let headerEl = document.getElementById("header"); 
let shuffledQuestions, currentQuestionIndex;
let counter;
let allQuestionsAnswered = false; 

startBtn.addEventListener("click", startQuiz);
clearBtn.addEventListener("click", clearScores);
restartBtn.addEventListener("click", restartQuiz);

//Start Quiz with timer function

function startQuiz() {
  console.log("Quiz started");
  startBtn.classList.add('hide');
  questionContainerEl.classList.remove('hide');
  headerEl.classList.add('hide'); 
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  setNextQuestion();

  document.body.appendChild(timerEl); 
  timerEl.classList.add('timer'); 
  counter = 75;
  let myInterval = setInterval(function() {
    timerEl.textContent = "Time left: " + counter;
    if (counter === 0 || allQuestionsAnswered) {
      clearInterval(myInterval);
      endQuiz();
    }
    counter--;
  }, 1000);
}

// Gives feedback and takes 10 seconds off if answer is incorrect

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  setStatusClass(selectedButton, correct);

  if (!correct) {
    counter -= 10;
  }

  setTimeout(function() {
    clearStatusClass(selectedButton);
    setNextQuestion();
  }, 1000);

  if (correct) {
    feedbackEl.textContent = "Correct!";
  } else {
    feedbackEl.textContent = "Incorrect!";
  }
}

//follows up to the next question

function setNextQuestion() {
  if (currentQuestionIndex < shuffledQuestions.length) {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    currentQuestionIndex++;
  } else {
    allQuestionsAnswered = true; 
    endQuiz();
  }
}

//Shows answer in the console to check if Event listener was registered 

function showQuestion(question) {
  questionEl.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsEl.appendChild(button);
  });
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add('correct');
    console.log("Answer was correct!");
  } else {
    element.classList.add('wrong');
    console.log("Answer was incorrect!");
  }
}

function resetState() {
  while (answerButtonsEl.firstChild) {
    answerButtonsEl.removeChild(answerButtonsEl.firstChild);
  }
  feedbackEl.textContent = "";
}

function clearStatusClass(element) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
}

// Shows last page with stats and saves on the DOM 
function endQuiz() {
  questionContainerEl.classList.add('hide');
  highscoresContainerEl.classList.remove('hide');
  saveHighScore();
  displayHighScores();
}

let initialsInput; 
let submitBtn; 

function saveHighScore() {
  if (!initialsInput && !submitBtn) {
    initialsInput = document.createElement('input');
    initialsInput.classList.add('initials');
    initialsInput.setAttribute('type', 'text');
    initialsInput.setAttribute('placeholder', 'Enter your initials');
    highscoresContainerEl.appendChild(initialsInput);

    submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    highscoresContainerEl.appendChild(submitBtn);
    submitBtn.classList.add('submitBtn');

    submitBtn.addEventListener('click', function() {
      const initials = initialsInput.value;
      const score = counter;

      if (initials && score) {
        const highScore = { initials, score };
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push(highScore);
        localStorage.setItem('highScores', JSON.stringify(highScores));
      }

      initialsInput.remove();
      submitBtn.remove();
      initialsInput = null; 
      submitBtn = null; 

      displayHighScores();
    });
  }
}

function displayHighScores() {
  highscoresListEl.innerHTML = '';
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  
  highScores
    .sort((a, b) => b.score - a.score)
    .forEach((highScore, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${index + 1}. ${highScore.initials} - ${highScore.score}`;
      highscoresListEl.appendChild(listItem);
    });
}

function clearScores() {
  localStorage.removeItem('highScores');
  highscoresListEl.innerHTML = '';
}

function restartQuiz() {
  highscoresContainerEl.classList.add('hide');
  questionContainerEl.classList.remove('hide');
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  counter = 75;
  setNextQuestion();
}

const highScoreLink = document.createElement('a');
highScoreLink.textContent = 'View High Scores';
highScoreLink.href = '#highscores-container';
highScoreLink.classList.add('viewHSbtn');
document.body.appendChild(highScoreLink);


//Question Array

const questions = [
  {
    question: "Commonly used data types DO NOT Include:",
    answers: [
      {text: "1. strings", correct: false},
      {text: "2. booleans", correct: false},
      {text: "3. alerts", correct: true},
      {text: "4. numbers", correct:false},
    ]
  },
  {
    question: "The condition in an if/else statement is enclosed with:____________.",
    answers: [
      {text: "1. quotes", correct: false},
      {text: "2. curly brackets", correct: false},
      {text: "3. parenthesis", correct: true},
      {text: "4. square brackets", correct:false},
    ]
  },
  {
    question: "Arrays in Javascript can be used to store:________________.",
    answers: [
      {text: "1. numbers and strings", correct: false},
      {text: "2. other arrays", correct: false},
      {text: "3. booleans", correct: false},
      {text: "4. all of the above", correct: true},
    ]
  },
  {
    question: "String values must be enclosed within____________ when being assigned to variables.",
    answers: [
      {text: "1. commas", correct: false},
      {text: "2. curly brackets", correct: false},
      {text: "3. quotes", correct: true},
      {text: "4. parenthesis", correct: false},
    ]
  },
]