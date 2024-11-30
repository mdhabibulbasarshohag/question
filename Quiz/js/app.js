const intersectionSection = document.querySelector(".intersection");
const stepsContainer = document.getElementById("steps");
const questionBody = document.getElementById("question-body");
const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("previous-btn");

// Load quiz data
const quizData = {
  quiz: [
    {
      id: 1,
      title: "General Knowledge Quiz",
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "Paris",
    },
    {
      id: 2,
      title: "Solar System Quiz",
      question: "Which is the largest planet in our solar system?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: "Jupiter",
    },
    {
      id: 3,
      title: "Math Quiz",
      question: "What is 5 + 3?",
      options: ["5", "8", "10", "15"],
      correctAnswer: "8",
    },
    {
      id: 4,
      title: "Programming Quiz",
      question: "Which programming language is known for web development?",
      options: ["Python", "JavaScript", "C++", "Swift"],
      correctAnswer: "JavaScript",
    },
    {
      id: 5,
      title: "Geography Quiz",
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: "Pacific",
    },
  ],
};

let currentStep = -1; // Start at -1 to include the intersection as the first step
let selectedAnswers = []; // Store answers to display them later

function initQuiz() {
  renderSteps();
  renderQuestions();
  updateQuestions();
  updateButtons();
}

function renderSteps() {
  stepsContainer.innerHTML = quizData.quiz
    .map((_, index) => `<span class="circle">${index + 1}</span>`)
    .join("");
  stepsContainer.classList.add("steps"); // Add steps class
}

function renderQuestions() {
  questionBody.innerHTML = quizData.quiz
    .map(
      (quiz, quizNumber) => `
        <div class="question ${quizNumber === 0 ? "active-question" : ""}">
          <h1 class="quiz-title">${quiz.title}</h1>
          <p class="quiz-question">${quiz.question}</p>
          <form class="question-from">
            ${quiz.options
              .map(
                (option, optIndex) => `
                  <div class="quiz-body">
                    <input 
                      type="radio" 
                      class="radio" 
                      name="question-${quizNumber}" 
                      id="question-${quizNumber}-option-${optIndex}" 
                      value="${option}">
                    <label for="question-${quizNumber}-option-${optIndex}" class="label">${option}</label>
                  </div>
                `
              )
              .join("")}
          </form>
          <p id="selected-answer-${quizNumber}" class="selected-answer"></p> <!-- Show selected answer here -->
        </div>
      `
    )
    .join("");
}

function updateQuestions() {
  const questions = document.querySelectorAll(".question");
  const steps = document.getElementById("steps");

  // Show or hide the intersection step
  if (currentStep === -1) {
    intersectionSection.classList.add("active-intersection");
    questions.forEach((question) =>
      question.classList.remove("active-question")
    );
    steps.classList.remove("visible"); // Hide steps during intersection
  } else {
    intersectionSection.classList.remove("active-intersection");
    questions.forEach((question, index) => {
      question.classList.toggle("active-question", index === currentStep);
    });
    steps.classList.add("visible"); // Show steps when in the quiz
  }

  // Update step progress
  const circles = steps.querySelectorAll(".circle");
  circles.forEach((circle, index) => {
    circle.classList.toggle("active", index <= currentStep);
  });
}

function updateButtons() {
  prevButton.style.visibility = currentStep <= 0 ? "hidden" : "visible";
  nextButton.textContent =
    currentStep === quizData.quiz.length - 1 ? "Finish" : "Next";
}

function validateStep() {
  if (currentStep === -1) return true; // Skip validation for the intersection step

  const currentInputs = document.querySelectorAll(
    `.question:nth-child(${currentStep + 1}) input[type="radio"]`
  );
  return Array.from(currentInputs).some((input) => input.checked);
}

function storeSelectedAnswer() {
  const selectedInput = document.querySelector(
    `.question:nth-child(${currentStep + 1}) input[type="radio"]:checked`
  );

  if (selectedInput) {
    selectedAnswers[currentStep] = selectedInput.value;
    // Show the selected answer below the options
    const selectedAnswerElement = document.getElementById(
      `selected-answer-${currentStep}`
    );
    selectedAnswerElement.textContent = `You selected: ${selectedAnswers[currentStep]}`;

    const labels = document.querySelectorAll(
      `.question:nth-child(${currentStep + 1}) .label`
    );

    labels.forEach((label) => {
      if (label.textContent === selectedAnswers[currentStep]) {
        if (
          selectedAnswers[currentStep] ===
          quizData.quiz[currentStep].correctAnswer
        ) {
          label.style.color = "white";
          label.style.backgroundColor = "green";
        } else {
          label.style.color = "white";
          label.style.backgroundColor = "red";
        }
      }
    });
  }
}

nextButton.addEventListener("click", () => {
  if (!validateStep()) {
    alert("Please select an answer before proceeding.");
    return;
  }

  storeSelectedAnswer(); // Store the selected answer before moving to the next question

  if (currentStep < quizData.quiz.length - 1) {
    currentStep++;
    updateQuestions();
    updateButtons();
  } else {
    calculateScore(); // Calculate and display score when quiz finishes
    alert("Quiz completed! Submitting...");
  }
});

prevButton.addEventListener("click", () => {
  if (currentStep > -1) {
    currentStep--;
    updateQuestions();
    updateButtons();
  }
});

function calculateScore() {
  let score = 0;
  quizData.quiz.forEach((quiz, answer) => {
    const selectedAnswer = selectedAnswers[answer];
    if (selectedAnswer && selectedAnswer === quiz.correctAnswer) {
      score++;
    }
  });
  alert(`You scored ${score} out of ${quizData.quiz.length}`);
  document.getElementById(
    "quiz-score"
  ).innerText = `You scored ${score} out of ${quizData.quiz.length}`;
}

initQuiz();
