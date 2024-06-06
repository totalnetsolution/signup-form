const quizContainer = document.querySelector('#quiz-container');
const questionContainer = document.querySelector('#question-container');
const questionElement = document.querySelector('#question');
const answerButtonsElement = document.querySelector('#answer-buttons');
const nextButton = document.querySelector('#next-btn');
const submitButton = document.querySelector('#submit-btn');
const resultContainer = document.querySelector('#result-container');
const resultElement = document.querySelector('#result');
const restartButton = document.querySelector('#restart-btn');

let currentQuestionIndex, score, questions;

fetch('https://opentdb.com/api.php?amount=25')
    .then(response => response.json())
    .then(data => {
        questions = data.results.map((question, index) => ({
            ...question,
            id: index,
            answers: shuffle([...question.incorrect_answers, question.correct_answer])
        }));
        startQuiz();
    })
    .catch(error => console.error('Error fetching questions:', error));

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.add('hide');
    quizContainer.classList.remove('hide');
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    resetState();
    questionElement.innerText = decodeHTML(question.question);
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = decodeHTML(answer);
        button.classList.add('btn');
        if (answer === question.correct_answer) {
            button.dataset.correct = true;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hide');
    submitButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    if (correct) {
        score++;
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === 'true');
    });
    if (questions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        submitButton.classList.remove('hide');
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('btn-success');
    } else {
        element.classList.add('btn-danger');
    }
}

function clearStatusClass(element) {
    element.classList.remove('btn-success');
    element.classList.remove('btn-danger');
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    showQuestion(questions[currentQuestionIndex]);
});

submitButton.addEventListener('click', showResult);

function showResult() {
    quizContainer.classList.add('hide');
    resultContainer.classList.remove('hide');
    resultElement.innerText = `Your Score: ${score} / ${questions.length}`;
}

restartButton.addEventListener('click', startQuiz);

function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}
