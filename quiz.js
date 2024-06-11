const quizContainer = document.querySelector('#quiz-container');
const questionContainer = document.querySelector('#question-container');
const questionElement = document.querySelector('#question');
const answerForm = document.querySelector('#answer-form');
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
        const div = document.createElement('div');
        div.classList.add('form-group');

        const label = document.createElement('label');
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answer';
        input.value = decodeHTML(answer);

        label.appendChild(input);
        label.appendChild(document.createTextNode(decodeHTML(answer)));
        
        div.appendChild(label);
        answerForm.appendChild(div);
    });
}

function resetState() {
    nextButton.classList.add('hide');
    submitButton.classList.add('hide');
    while (answerForm.firstChild) {
        answerForm.removeChild(answerForm.firstChild);
    }
}

function selectAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert('Please select an answer');
        return;
    }

    const correct = selectedAnswer.value === decodeHTML(questions[currentQuestionIndex].correct_answer);
    if (correct) {
        score++;
    }
    if (questions.length > currentQuestionIndex + 1) {
        currentQuestionIndex++;
        showQuestion(questions[currentQuestionIndex]);
    } else {
        showResult();
    }
}

function showResult() {
    quizContainer.classList.add('hide');
    resultContainer.classList.remove('hide');
    resultElement.innerText = `Your Score: ${score} / ${questions.length}`;
}

nextButton.addEventListener('click', selectAnswer);
submitButton.addEventListener('click', showResult);

restartButton.addEventListener('click', startQuiz);

function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}
