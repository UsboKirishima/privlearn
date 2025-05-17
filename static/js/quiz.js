/**
 * Davide Usberti, Matthew Gasparetti, Alesio Broshka - Quiz JavaScript
 * Handles the interactive quiz functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Quiz elements
    const quizIntro = document.getElementById('quiz-intro');
    const questionsSection = document.getElementById('quiz-questions');
    const quizResults = document.getElementById('quiz-results');
    const reviewContainer = document.getElementById('review-container');
    
    // Buttons
    const startQuizBtn = document.getElementById('start-quiz');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const reviewAnswersBtn = document.getElementById('review-answers');
    const retakeQuizBtn = document.getElementById('retake-quiz');
    const backToResultsBtn = document.getElementById('back-to-results');
    
    // Display elements
    const questionCounter = document.getElementById('question-counter');
    const questionContainer = document.getElementById('question-container');
    const scorePercentage = document.getElementById('score-percentage');
    const correctAnswers = document.getElementById('correct-answers');
    const totalQuestions = document.getElementById('total-questions');
    const scoreMessage = document.getElementById('score-message');
    const scoreProgress = document.getElementById('score-progress');
    const timerDisplay = document.getElementById('timer');
    const questionsReview = document.getElementById('questions-review');
    
    // Quiz state variables
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let quizStartTime;
    let timerInterval;
    
    // Quiz questions array
    const quizQuestions = [
        {
            question: "What is phishing?",
            options: [
                "A type of computer virus that corrupts files",
                "An attack that attempts to steal sensitive information by disguising as a trustworthy entity",
                "The practice of sending bulk emails to multiple recipients",
                "A form of encryption that protects data"
            ],
            correctAnswer: 1,
            explanation: "Phishing is a cybercrime where attackers disguise themselves as trustworthy entities to trick victims into revealing sensitive information such as passwords, credit card numbers, or personal data."
        },
        {
            question: "Which of the following is a common sign of a phishing email?",
            options: [
                "An email from someone you regularly communicate with",
                "A message with perfect grammar and spelling",
                "Urgent requests for personal information",
                "Email sent from a company domain that matches the company name"
            ],
            correctAnswer: 2,
            explanation: "Urgency is a common tactic in phishing attempts. Legitimate organizations rarely create panic or demand immediate action regarding sensitive information."
        },
        {
            question: "What is two-factor authentication (2FA)?",
            options: [
                "A system that requires two passwords",
                "A method that requires two separate authentication factors to verify identity",
                "A system that automatically changes your password every two months",
                "A type of encryption that uses two different keys"
            ],
            correctAnswer: 1,
            explanation: "Two-factor authentication adds an extra layer of security by requiring two different types of verification: something you know (like a password) and something you have (like a phone) or something you are (like a fingerprint)."
        },
        {
            question: "Which of the following is the best password practice?",
            options: [
                "Using the same strong password for all your accounts",
                "Writing down your passwords and keeping them near your computer",
                "Using unique, complex passwords for each account and managing them with a password manager",
                "Changing your password every day"
            ],
            correctAnswer: 2,
            explanation: "Using unique, complex passwords for each account prevents a breach of one account from affecting others. Password managers help generate and store these complex passwords securely."
        },
        {
            question: "What is ransomware?",
            options: [
                "Software that displays unwanted advertisements",
                "Malware that encrypts files and demands payment for decryption",
                "A program that slows down your computer's performance",
                "A tool used to recover accidentally deleted files"
            ],
            correctAnswer: 1,
            explanation: "Ransomware is malicious software that encrypts a victim's files. The attacker then demands a ransom from the victim to restore access to the data upon payment."
        },
        {
            question: "Which of the following is NOT a good way to protect your privacy on social media?",
            options: [
                "Regularly reviewing and updating privacy settings",
                "Being selective about friend/connection requests",
                "Sharing your personal achievements and life updates with everyone",
                "Limiting the personal information you provide in your profile"
            ],
            correctAnswer: 2,
            explanation: "Sharing extensive personal information publicly on social media can expose you to various privacy risks including identity theft and targeted phishing attacks."
        },
        {
            question: "What is a VPN primarily used for?",
            options: [
                "Speeding up your internet connection",
                "Blocking all advertisements",
                "Encrypting your internet connection and hiding your IP address",
                "Creating backup copies of your data"
            ],
            correctAnswer: 2,
            explanation: "A Virtual Private Network (VPN) encrypts your internet connection and masks your IP address, making it more difficult for third parties to track your online activities or intercept your data."
        },
        {
            question: "What should you do if you suspect you've fallen victim to a phishing attack?",
            options: [
                "Ignore it and hope nothing happens",
                "Only change the password for the affected account",
                "Immediately change passwords for all your accounts, run a security scan, and monitor for suspicious activity",
                "Disconnect your computer from the internet permanently"
            ],
            correctAnswer: 2,
            explanation: "Quick action is essential after a phishing attack. You should change all passwords (attackers might have access to multiple accounts), run security scans to check for malware, and monitor your accounts for any unauthorized activity."
        },
        {
            question: "Which of the following is an example of a social engineering attack?",
            options: [
                "A hacker using specialized software to crack passwords",
                "A virus corrupting files on your computer",
                "Someone calling pretending to be from IT support to get your login credentials",
                "A power surge damaging your computer hardware"
            ],
            correctAnswer: 2,
            explanation: "Social engineering attacks manipulate people into breaking security procedures or revealing sensitive information by exploiting human psychology rather than technical hacking techniques."
        },
        {
            question: "What is the best way to verify if an email from your bank is legitimate?",
            options: [
                "Check if the email address looks professional",
                "Click on links in the email to see if the website looks real",
                "Contact your bank directly using the official contact information from their website",
                "Reply to the email and ask if it's really from the bank"
            ],
            correctAnswer: 2,
            explanation: "Never use the contact information or links provided in the suspicious email. Instead, contact your bank through official channels (phone number from their official website or visit a branch) to verify any communication."
        }
    ];
    
    // Event listeners
    startQuizBtn.addEventListener('click', startQuiz);
    prevButton.addEventListener('click', goToPreviousQuestion);
    nextButton.addEventListener('click', goToNextQuestion);
    reviewAnswersBtn.addEventListener('click', showReview);
    retakeQuizBtn.addEventListener('click', retakeQuiz);
    backToResultsBtn.addEventListener('click', backToResults);
    
    // Initialize quiz
    function startQuiz() {
        quizIntro.classList.add('d-none');
        questionsSection.classList.remove('d-none');
        quizResults.classList.add('d-none');
        reviewContainer.classList.add('d-none');
        
        currentQuestionIndex = 0;
        userAnswers = Array(quizQuestions.length).fill(null);
        displayQuestion(currentQuestionIndex);
        
        // Start timer
        quizStartTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
        
        // Update display
        totalQuestions.textContent = quizQuestions.length;
    }
    
    // Display current question
    function displayQuestion(index) {
        // Update question counter
        questionCounter.textContent = `Question ${index + 1}/${quizQuestions.length}`;
        
        // Create question HTML
        const question = quizQuestions[index];
        let questionHTML = `
            <h3 class="mb-4">${question.question}</h3>
            <div class="options-container">
        `;
        
        // Add options
        question.options.forEach((option, optionIndex) => {
            const isSelected = userAnswers[index] === optionIndex;
            questionHTML += `
                <div class="quiz-option ${isSelected ? 'selected' : ''}" data-index="${optionIndex}">
                    <div class="d-flex align-items-start">
                        <div class="option-indicator me-3">
                            <span class="option-letter">${String.fromCharCode(65 + optionIndex)}.</span>
                        </div>
                        <div>${option}</div>
                    </div>
                </div>
            `;
        });
        
        questionHTML += `</div>`;
        questionContainer.innerHTML = questionHTML;
        
        // Add event listeners to options
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', selectOption);
        });
        
        // Update buttons
        prevButton.disabled = index === 0;
        
        if (index === quizQuestions.length - 1) {
            nextButton.textContent = 'Finish Quiz';
        } else {
            nextButton.textContent = 'Next';
        }
    }
    
    // Handle option selection
    function selectOption(event) {
        const selectedOption = event.currentTarget;
        const optionIndex = parseInt(selectedOption.dataset.index);
        
        // Remove selection from all options
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to clicked option
        selectedOption.classList.add('selected');
        
        // Save user answer
        userAnswers[currentQuestionIndex] = optionIndex;
    }
    
    // Navigate to previous question
    function goToPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion(currentQuestionIndex);
        }
    }
    
    // Navigate to next question or finish quiz
    function goToNextQuestion() {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
        } else {
            finishQuiz();
        }
    }
    
    // Complete the quiz and show results
    function finishQuiz() {
        // Stop timer
        clearInterval(timerInterval);
        
        // Calculate score
        const score = calculateScore();
        const percentage = Math.round((score.correct / quizQuestions.length) * 100);
        
        // Update results display
        scorePercentage.textContent = `${percentage}%`;
        correctAnswers.textContent = score.correct;
        scoreProgress.style.width = `${percentage}%`;
        
        // Customize score message
        if (percentage >= 90) {
            scoreMessage.className = 'alert alert-success mt-3';
            scoreMessage.innerHTML = '<strong>Excellent!</strong> You have a strong understanding of online privacy and security concepts.';
        } else if (percentage >= 70) {
            scoreMessage.className = 'alert alert-info mt-3';
            scoreMessage.innerHTML = '<strong>Good job!</strong> You have a solid grasp of online privacy, but there\'s still room to learn more.';
        } else if (percentage >= 50) {
            scoreMessage.className = 'alert alert-warning mt-3';
            scoreMessage.innerHTML = '<strong>Not bad!</strong> You have some understanding of online privacy, but should review the material to strengthen your knowledge.';
        } else {
            scoreMessage.className = 'alert alert-danger mt-3';
            scoreMessage.innerHTML = '<strong>Need improvement.</strong> We recommend reviewing the educational content to better protect yourself online.';
        }
        
        // Show results screen
        questionsSection.classList.add('d-none');
        quizResults.classList.remove('d-none');
        
        // Save results to local storage
        saveQuizResults(percentage, score.correct, quizQuestions.length);
    }
    
    // Calculate quiz score
    function calculateScore() {
        let correct = 0;
        
        userAnswers.forEach((answer, index) => {
            if (answer === quizQuestions[index].correctAnswer) {
                correct++;
            }
        });
        
        return {
            correct: correct,
            total: quizQuestions.length
        };
    }
    
    // Update timer display
    function updateTimer() {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - quizStartTime) / 1000); // in seconds
        
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Show answer review
    function showReview() {
        quizResults.classList.add('d-none');
        reviewContainer.classList.remove('d-none');
        
        let reviewHTML = '';
        
        quizQuestions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const statusClass = isCorrect ? 'success' : 'danger';
            
            reviewHTML += `
                <div class="card mb-4">
                    <div class="card-header bg-${statusClass} text-white d-flex justify-content-between align-items-center">
                        <span>Question ${index + 1}</span>
                        <span>${isCorrect ? 'Correct' : 'Incorrect'}</span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${question.question}</h5>
                        <div class="options-review mt-3">
            `;
            
            question.options.forEach((option, optionIndex) => {
                let optionClass = '';
                
                if (optionIndex === question.correctAnswer) {
                    optionClass = 'correct';
                } else if (userAnswer === optionIndex) {
                    optionClass = 'incorrect';
                }
                
                reviewHTML += `
                    <div class="quiz-option ${optionClass}">
                        <div class="d-flex align-items-start">
                            <div class="option-indicator me-3">
                                <span class="option-letter">${String.fromCharCode(65 + optionIndex)}.</span>
                            </div>
                            <div>${option}</div>
                        </div>
                    </div>
                `;
            });
            
            reviewHTML += `
                        </div>
                        <div class="answer-explanation">
                            <strong>Explanation:</strong> ${question.explanation}
                        </div>
                    </div>
                </div>
            `;
        });
        
        questionsReview.innerHTML = reviewHTML;
    }
    
    // Go back to results from review
    function backToResults() {
        reviewContainer.classList.add('d-none');
        quizResults.classList.remove('d-none');
    }
    
    // Retake the quiz
    function retakeQuiz() {
        startQuiz();
    }
    
    // Save quiz results to local storage
    function saveQuizResults(percentage, correct, total) {
        const results = {
            date: new Date().toISOString(),
            percentage: percentage,
            correct: correct,
            total: total,
            timeSpent: timerDisplay.textContent
        };
        
        // Get existing results or initialize empty array
        let quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
        
        // Add current result
        quizHistory.push(results);
        
        // Save back to local storage
        localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
    }
});
