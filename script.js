let translations = {};
const TRANSLATIONS_FILE = 'translations.json';
let quizWords = [];
let currentQuizIndex = 0;

function loadTranslations() {
  if (localStorage.getItem(TRANSLATIONS_FILE)) {
    translations = JSON.parse(localStorage.getItem(TRANSLATIONS_FILE));
  }
}

function addTranslation() {
  const englishWordInput = document.getElementById('english-word');
  const translationInput = document.getElementById('translation');
  const englishWord = englishWordInput.value.trim();
  const translation = translationInput.value.trim();
  const editButton = document.getElementById('edit-button');

  if (englishWord !== '' && translation !== '') {
    const editingWord = editButton.getAttribute('data-editing');

    if (editingWord) {
      translations[editingWord] = translation;
      editButton.removeAttribute('data-editing');
      document.getElementById('add-button').style.display = 'inline-block';
      editButton.style.display = 'none';
    } else {
      translations[englishWord] = translation;
    }

    saveTranslations();
    updateTranslationsList();
    englishWordInput.value = '';
    translationInput.value = '';
  }
}

function saveTranslations() {
  localStorage.setItem(TRANSLATIONS_FILE, JSON.stringify(translations));
}

function updateTranslationsList() {
  const translationsList = document.getElementById('translations-list');
  translationsList.innerHTML = '';

  for (const englishWord of Object.keys(translations)) {
    const listItem = document.createElement('li');
    listItem.className = 'translation-item';
    listItem.innerHTML = `
      <span>${englishWord}</span>
      <button id="edit-button" onclick="editTranslation('${englishWord}')">Edit</button>
      <button onclick="removeTranslation('${englishWord}')">Remove</button>
    `;
    translationsList.appendChild(listItem);
  }
}

function removeTranslation(englishWord) {
  delete translations[englishWord];
  saveTranslations();
  updateTranslationsList();
}

function removeAllTranslations() {
  translations = {};
  saveTranslations();
  updateTranslationsList();

  const quizWordElement = document.getElementById('quiz-word');
  const quizTranslationInput = document.getElementById('quiz-translation');
  const quizResultElement = document.getElementById('quiz-result');

  quizResultElement.textContent = '';
  quizWordElement.textContent = '';
  quizTranslationInput.value = '';
  currentQuizIndex = 0;
}

function startQuiz() {
  quizWords = Object.keys(translations);
  if (quizWords.length === 0) {
    alert('Add Words before starting the quiz.');
    return;
  }

  shuffleArray(quizWords);
  currentQuizIndex = 0;
  showNextQuizWord();
}

function showNextQuizWord() {
  const quizWordElement = document.getElementById('quiz-word');
  const quizTranslationInput = document.getElementById('quiz-translation');
  const quizResultElement = document.getElementById('quiz-result');

  quizResultElement.textContent = '';
  quizWordElement.textContent = quizWords[currentQuizIndex];
  quizTranslationInput.value = '';
}

function checkQuizAnswer() {
  const quizTranslationInput = document.getElementById('quiz-translation');
  const quizResultElement = document.getElementById('quiz-result');
  const quizWord = quizWords[currentQuizIndex];
  const userTranslation = quizTranslationInput.value.trim().toLowerCase();
  const correctTranslation = translations[quizWord].toLowerCase();

  if (userTranslation === correctTranslation) {
    quizResultElement.textContent = 'Correct!';
    setTimeout(function () {
      requestAnimationFrame(function () {
        currentQuizIndex++;
        if (currentQuizIndex < quizWords.length) {
          showNextQuizWord();
        } else {
          setTimeout(function () {
            quizResultElement.textContent = 'Quiz completed!';
          }, 1000);
        }
      });
    }, 1000);
  } else {
    quizResultElement.textContent = 'Incorrect. Try again.';
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function revealTranslation() {
  const quizWordElement = document.getElementById('quiz-word');
  const correctTranslation = translations[quizWordElement.textContent].toLowerCase();

  const translationDisplay = document.createElement('div');
  translationDisplay.className = 'translation-display';
  translationDisplay.textContent = `Translation: ${correctTranslation}`;

  document.body.appendChild(translationDisplay);

  setTimeout(() => {
    document.body.removeChild(translationDisplay);
  }, 3000);
}

function editTranslation(englishWord) {
  const translationInput = document.getElementById('translation');
  const englishWordInput = document.getElementById('english-word');
  const editButton = document.getElementById('edit-button');

  englishWordInput.value = englishWord;
  translationInput.value = translations[englishWord];

  document.getElementById('add-button').style.display = 'none';
  editButton.style.display = 'inline-block';

  editButton.setAttribute('data-editing', englishWord);
}

loadTranslations();
updateTranslationsList();
