let questions = [];
let currentQuestionIndex = null;
let askedQuestions = [];
let correctAnswers = 0;
let incorrectAnswers = 0;

function loadQuestions() {
  fetch('questions.json')
    .then((response) => response.json())
    .then((data) => {
      questions = data;
      generateRandomQuestion();
    })
    .catch((error) => console.error('Error al cargar las preguntas:', error));
}

function generateRandomQuestion() {
  if (questions.length === 0) {
    console.error('No se han cargado las preguntas.');
    return;
  }

  document.getElementById('message').style.display = 'none';

  if (askedQuestions.length === questions.length) {
    showStats();
    return;
  }

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * questions.length);
  } while (askedQuestions.includes(randomIndex));

  askedQuestions.push(randomIndex);

  const randomQuestion = questions[randomIndex].question;
  document.getElementById('question').innerText = randomQuestion;
  document.getElementById('answer').value = '';
  document.getElementById('answer').focus();
  currentQuestionIndex = randomIndex;
}

function validateAnswer() {
  const userAnswer = document.getElementById('answer').value.trim();
  if (userAnswer === '') {
    alert('Por favor, ingrese una respuesta.');
    return;
  }

  const correctAnswer = questions[currentQuestionIndex].answer;

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    correctAnswers++;
    showMessage('Correcto! La respuesta es ' + correctAnswer);
  } else {
    incorrectAnswers++;
    showMessage('Incorrecto. La respuesta correcta es ' + correctAnswer);
  }
}

function showMessage(message) {
  const messageDiv = document.getElementById('message');
  messageDiv.innerText = message;
  messageDiv.style.display = 'block';

  setTimeout(generateRandomQuestion, 3000);
}

function showStats() {
  const totalQuestions = correctAnswers + incorrectAnswers;
  const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  document.getElementById('correct').innerText = `Respuestas correctas: ${correctAnswers}`;
  document.getElementById('incorrect').innerText = `Respuestas incorrectas: ${incorrectAnswers}`;
  document.getElementById('accuracy').innerText = `Porcentaje de acierto: ${accuracy}%`;

  document.getElementById('stats').style.display = 'block';
}

document.getElementById('answer').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    validateAnswer();
  }
});

loadQuestions();
