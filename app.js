let questions = [];
let currentQuestionIndex = null;
let askedQuestions = [];
let correctAnswers = 0;
let incorrectAnswers = 0;
let initialQuestionDisplayed = false;

function toggleInstrucciones() {
  const instrucciones = document.getElementById('instrucciones');
  const juego = document.getElementById('juego');
  if (instrucciones.style.display === 'none') {
    console.log('dentro');
    instrucciones.style.display = 'block';
    juego.style.display = 'none';
  } else {
    console.log('fuera');
    instrucciones.style.display = 'none';
    juego.style.display = 'block';
  }
}

function loadQuestions(so = 'windows') {
  fetch(`system/${so}.json`) // fijarse en las comillas que solo funcionan los  literales con comillas inversas
    .then((response) => response.json())
    .then((data) => {
      questions = data;
      showStats(); // Llamar a showStats para inicializar el contador
      generateRandomQuestion();
    })
    .catch((error) => console.error('Error al cargar las preguntas:', error));
}

function generateOtherCuestion(param) {
  generateRandomQuestion('new question');
  incorrectAnswers++;
  showStats();
}

function generateRandomQuestion(param) {
  if (!initialQuestionDisplayed) {
    initialQuestionDisplayed = true;
  } else {
    if (document.getElementById('answer').value.trim() === '' && param === undefined) {
      return;
    }
  }

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

function showStats() {
  let accuracy = 0;
  const totalQuestions = correctAnswers + incorrectAnswers;
  if (totalQuestions > 0) {
    accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);
  }

  document.getElementById('correct').innerText = `Respuestas correctas: ${correctAnswers}`;
  document.getElementById('incorrect').innerText = `Respuestas incorrectas: ${incorrectAnswers}`;
  document.getElementById('accuracy').innerText = `Porcentaje de acierto: ${accuracy}%`;

  const remainingQuestions = questions.length - totalQuestions;
  const currentQuestionNumber = totalQuestions + 1;
  if (currentQuestionNumber <= questions.length) {
    document.getElementById('question-counter').innerText = `Pregunta ${currentQuestionNumber} de ${questions.length}`;
  }
}

document.getElementById('answer').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    validateAnswer();
  }
});

function validateAnswer() {
  const userAnswer = document.getElementById('answer').value.trim().toUpperCase(); // Convertir la respuesta a mayúsculas
  if (userAnswer === '') {
    showAlert('Por favor, ingrese una respuesta.', 'danger');
    return;
  }

  const correctAnswer = questions[currentQuestionIndex].answer.toUpperCase(); // Convertir la respuesta correcta a mayúsculas

  if (userAnswer === correctAnswer) {
    correctAnswers++;
    showAlert('Correcto! La respuesta es ' + correctAnswer, 'success');
  } else {
    incorrectAnswers++;
    showAlert('Incorrecto. La respuesta correcta es ' + correctAnswer, 'danger');
  }

  showStats(); // Llamar a la función para actualizar estadísticas
}

function setupButtons() {
  document.querySelectorAll('.btn-value').forEach((button) => {
    button.addEventListener('click', function () {
      if (this.value == '') {
        document.getElementById('answer').value = this.value;
      } else {
        document.getElementById('answer').value += this.value;
      }
      // Focus
      document.getElementById('answer').focus();
    });
  });
}

function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.classList.add('alert', 'alert-' + type, 'alert-dismissible', 'fade', 'show');
  alertDiv.setAttribute('role', 'alert');

  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  const messageDiv = document.getElementById('message');
  messageDiv.innerHTML = '';
  messageDiv.appendChild(alertDiv);

  messageDiv.style.display = 'block';

  setTimeout(generateRandomQuestion, 3000);
}

function showMessage(message) {
  const messageDiv = document.getElementById('message');
  messageDiv.innerText = message;
  messageDiv.style.display = 'block';

  setTimeout(generateRandomQuestion, 3000);
}



loadQuestions();
setupButtons();
