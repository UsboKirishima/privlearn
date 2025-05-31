/**
 * Davide Usberti, Matthew Gasparetti, Alesio Broshka 
 * Gestione delle funzionalità del quiz presente nel sito di Privacy Learn.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Elementi del DOM su cui lavorare
    const quizIntro = document.getElementById('quiz-intro');
    const questionsSection = document.getElementById('quiz-questions');
    const quizResults = document.getElementById('quiz-results');
    const reviewContainer = document.getElementById('review-container');

    const startQuizBtn = document.getElementById('start-quiz');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const reviewAnswersBtn = document.getElementById('review-answers');
    const retakeQuizBtn = document.getElementById('retake-quiz');
    const backToResultsBtn = document.getElementById('back-to-results');

    const questionCounter = document.getElementById('question-counter');
    const questionContainer = document.getElementById('question-container');
    const scorePercentage = document.getElementById('score-percentage');
    const correctAnswers = document.getElementById('correct-answers');
    const totalQuestions = document.getElementById('total-questions');
    const scoreMessage = document.getElementById('score-message');
    const scoreProgress = document.getElementById('score-progress');
    const timerDisplay = document.getElementById('timer');
    const questionsReview = document.getElementById('questions-review');

    // Tempo limite del quiz in secondi (5 minuti)
    const TIME_LIMIT = 5 * 60;
    let timeLeft = TIME_LIMIT;

    /**
     * Variabili utili per la gestione del quiz
     
     * currentQuestionIndex: Indice della domanda corrente
     * userAnswers: Array per memorizzare le risposte dell'utente
     * quizStartTime: Timestamp di inizio del quiz
     * timerInterval: Intervallo per il timer del quiz
    */
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let timerInterval;

    // Domande, opzioni, risposte corrette e spiegazioni
    const quizQuestions = [
        {
            question: "Cos'è il phishing?",
            options: [
                "Un tipo di virus informatico che corrompe i file",
                "Un attacco che tenta di rubare informazioni sensibili fingendosi un'entità affidabile",
                "La pratica di inviare email di massa a più destinatari",
                "Una forma di crittografia che protegge i dati"
            ],
            correctAnswer: 1,
            explanation: "Il phishing è un crimine informatico in cui gli aggressori si spacciano per entità affidabili per indurre le vittime a rivelare informazioni sensibili come password, numeri di carte di credito o dati personali."
        },
        {
            question: "Quale delle seguenti è un segnale comune di una email di phishing?",
            options: [
                "Un'email da qualcuno con cui comunichi regolarmente",
                "Un messaggio con grammatica e ortografia perfette",
                "Richieste urgenti di informazioni personali",
                "Email inviata da un dominio aziendale che corrisponde al nome dell'azienda"
            ],
            correctAnswer: 2,
            explanation: "L'urgenza è una tattica comune nei tentativi di phishing. Le organizzazioni legittime raramente creano panico o richiedono azioni immediate riguardo informazioni sensibili."
        },
        {
            question: "Cos'è l'autenticazione a due fattori (2FA)?",
            options: [
                "Un sistema che richiede due password",
                "Un metodo che richiede due fattori di autenticazione separati per verificare l'identità",
                "Un sistema che cambia automaticamente la password ogni due mesi",
                "Un tipo di crittografia che utilizza due chiavi diverse"
            ],
            correctAnswer: 1,
            explanation: "L'autenticazione a due fattori aggiunge un ulteriore livello di sicurezza richiedendo due tipi diversi di verifica: qualcosa che conosci (come una password) e qualcosa che possiedi (come un telefono) o qualcosa che sei (come un'impronta digitale)."
        },
        {
            question: "Quale delle seguenti è la migliore pratica per le password?",
            options: [
                "Usare la stessa password forte per tutti i tuoi account",
                "Scrivere le password e tenerle vicino al computer",
                "Usare password uniche e complesse per ogni account e gestirle con un password manager",
                "Cambiare la password ogni giorno"
            ],
            correctAnswer: 2,
            explanation: "Usare password uniche e complesse per ogni account impedisce che una violazione di un account comprometta anche gli altri. I password manager aiutano a generare e conservare queste password in modo sicuro."
        },
        {
            question: "Cos'è un ransomware?",
            options: [
                "Software che mostra pubblicità indesiderate",
                "Malware che cripta i file e richiede un pagamento per la decriptazione",
                "Un programma che rallenta le prestazioni del computer",
                "Uno strumento per recuperare file cancellati accidentalmente"
            ],
            correctAnswer: 1,
            explanation: "Il ransomware è un software dannoso che cripta i file della vittima. L'aggressore poi richiede un riscatto per ripristinare l'accesso ai dati dopo il pagamento."
        },
        {
            question: "Quale delle seguenti NON è una buona pratica per proteggere la privacy sui social media?",
            options: [
                "Rivedere e aggiornare regolarmente le impostazioni della privacy",
                "Essere selettivi nelle richieste di amicizia/connessione",
                "Condividere i tuoi successi e aggiornamenti di vita con tutti",
                "Limitare le informazioni personali fornite nel profilo"
            ],
            correctAnswer: 2,
            explanation: "Condividere molte informazioni personali pubblicamente sui social media può esporti a vari rischi per la privacy, tra cui furto d'identità e attacchi di phishing mirati."
        },
        {
            question: "A cosa serve principalmente una VPN?",
            options: [
                "Velocizzare la connessione internet",
                "Bloccare tutte le pubblicità",
                "Criptare la connessione internet e nascondere l'indirizzo IP",
                "Creare copie di backup dei dati"
            ],
            correctAnswer: 2,
            explanation: "Una Virtual Private Network (VPN) cripta la connessione internet e maschera l'indirizzo IP, rendendo più difficile per terzi tracciare le tue attività online o intercettare i tuoi dati."
        },
        {
            question: "Cosa dovresti fare se sospetti di essere vittima di un attacco di phishing?",
            options: [
                "Ignorare e sperare che non succeda nulla",
                "Cambiare solo la password dell'account interessato",
                "Cambiare immediatamente le password di tutti gli account, eseguire una scansione di sicurezza e monitorare attività sospette",
                "Disconnettere il computer da internet in modo permanente"
            ],
            correctAnswer: 2,
            explanation: "Agire rapidamente è essenziale dopo un attacco di phishing. Dovresti cambiare tutte le password (gli aggressori potrebbero avere accesso a più account), eseguire scansioni di sicurezza e monitorare eventuali attività non autorizzate."
        },
        {
            question: "Quale delle seguenti è un esempio di attacco di ingegneria sociale?",
            options: [
                "Un hacker che usa software specializzato per decifrare password",
                "Un virus che corrompe i file del computer",
                "Qualcuno che si finge del supporto IT per ottenere le tue credenziali di accesso",
                "Una sovratensione che danneggia l'hardware del computer"
            ],
            correctAnswer: 2,
            explanation: "Gli attacchi di ingegneria sociale manipolano le persone per indurle a violare procedure di sicurezza o rivelare informazioni sensibili sfruttando la psicologia umana piuttosto che tecniche di hacking tecniche."
        },
        {
            question: "Qual è il modo migliore per verificare se un'email della tua banca è legittima?",
            options: [
                "Controllare se l'indirizzo email sembra professionale",
                "Cliccare sui link nell'email per vedere se il sito sembra reale",
                "Contattare direttamente la banca usando i recapiti ufficiali dal loro sito web",
                "Rispondere all'email chiedendo se è davvero della banca"
            ],
            correctAnswer: 2,
            explanation: "Non usare mai i recapiti o i link forniti nell'email sospetta. Contatta invece la banca tramite canali ufficiali (numero di telefono dal sito ufficiale o recandoti in filiale) per verificare qualsiasi comunicazione."
        }
    ];

    startQuizBtn.addEventListener('click', startQuiz);
    prevButton.addEventListener('click', goToPreviousQuestion);
    nextButton.addEventListener('click', goToNextQuestion);
    reviewAnswersBtn.addEventListener('click', showReview);
    retakeQuizBtn.addEventListener('click', retakeQuiz);
    backToResultsBtn.addEventListener('click', backToResults);

    // Inizializzazione bootstrap tooltip
    function startQuiz() {
        quizIntro.classList.add('d-none');
        questionsSection.classList.remove('d-none');
        quizResults.classList.add('d-none');
        reviewContainer.classList.add('d-none');
        
        currentQuestionIndex = 0;
        userAnswers = Array(quizQuestions.length).fill(null);
        displayQuestion(currentQuestionIndex);
        
        // Reset e avvio del timer
        timeLeft = TIME_LIMIT;
        updateTimerDisplay();
        timerInterval = setInterval(updateTimer, 1000);
        
        // Aggiorna il display
        totalQuestions.textContent = quizQuestions.length;
    }
    
    // Aggiorna il timer
    function updateTimer() {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishQuiz();
        }
    }
    

    // Aggiorna il timer
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Cambia colore quando il tempo sta per scadere
        if (timeLeft <= 30) {
            timerDisplay.classList.add('text-danger');
            timerDisplay.classList.add('fw-bold');
        } else {
            timerDisplay.classList.remove('text-danger');
            timerDisplay.classList.remove('fw-bold');
        }
    }

    // Domanda attuale
    function displayQuestion(index) {
        questionCounter.textContent = `Question ${index + 1}/${quizQuestions.length}`;

        // Crea la domanda in modo dinamico 
        const question = quizQuestions[index];
        let questionHTML = `
            <h3 class="mb-4">${question.question}</h3>
            <div class="options-container">
        `;

        // Crea le opzioni in modo dinamico
        question.options.forEach((option, optionIndex) => {
            // Se viene selezionata un opzione la evidenzia
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

        // Classico ascoltatore per le opzioni
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', selectOption);
        });

        // Disabilita il bottone precedente
        prevButton.disabled = index === 0;

        // Se siamo all'ultima domanda cambia il testo del bottone
        if (index === quizQuestions.length - 1) {
            nextButton.textContent = 'Finish Quiz';
        } else {
            nextButton.textContent = 'Next';
        }
    }

    /**  
     * Entriamo nel dettaglio della selezione dell'opzione.
     * 
     * Se l'utente clicca su un'opzione, viene evidenziata e salvata come risposta dell'utente.
     * Le altre opzioni vengono deselezionate.
     * La risposta viene salvata perchè alla fine del quiz verrà calcolato il punteggio.
     * Alla fine del quiz, sarà disponibile una revisione delle domande e delle risposte.
    */
    function selectOption(event) {
        const selectedOption = event.currentTarget;
        const optionIndex = parseInt(selectedOption.dataset.index);

        // Rimuove la selezione da tutte le opzioni
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Aggiunge la selezione all'opzione cliccata
        selectedOption.classList.add('selected');

        // Salva la risposta dell'utente
        userAnswers[currentQuestionIndex] = optionIndex;
    }

    // Domanda precedente
    function goToPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion(currentQuestionIndex);
        }
    }

    // Domanda successiva o termina il quiz
    function goToNextQuestion() {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
        } else {
            finishQuiz();
        }
    }

    // Termine del quiz ed interruzione del timer
    function finishQuiz() {
        clearInterval(timerInterval);

        // Calcolo del punteggio
        const score = calculateScore();
        const percentage = Math.round((score.correct / quizQuestions.length) * 100);

        // Aggiorna il punteggio
        scorePercentage.textContent = `${percentage}%`;
        correctAnswers.textContent = score.correct;
        scoreProgress.style.width = `${percentage}%`;

        // Messaggi basati sul punteggio 
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

        // Mostra il risultato finale
        questionsSection.classList.add('d-none');
        quizResults.classList.remove('d-none');

        // Salva i risultati
        saveQuizResults(percentage, score.correct, quizQuestions.length);
    }

    // Calcolo del punteggio
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

    // Aggiorna il timer
    function updateTimer() {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - quizStartTime) / 1000); // Secondi 

        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Revisione delle domande
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

    // Torna ai risultati
    function backToResults() {
        reviewContainer.classList.add('d-none');
        quizResults.classList.remove('d-none');
    }

    // Ricomincia il quiz
    function retakeQuiz() {
        startQuiz();
    }

    // Magheggio raccontato prima
    /**
    *   "date": "2025-05-17T19:53:14.451Z",
    *   "percentage": 100,
    *   "correct": 10,
    *   "total": 10,
    *   "timeSpent": "00:50"
    */
    function saveQuizResults(percentage, correct, total) {
        const results = {
            date: new Date().toISOString(),
            percentage: percentage,
            correct: correct,
            total: total,
            timeSpent: timerDisplay.textContent
        };

        // Qua cerco di recuperare i risultati precedenti sennò creo un oggetto empty
        let quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];

        // Push dei risultati nella storia
        quizHistory.push(results);

        // Salvo i risultati nel local storage
        localStorage.setItem('quizHistory', JSON.stringify(quizHistory));

        /**
         * Perchè aggiungere i nuovi risultati anche se ci sono risultati precedenti?
         * Se l'utente fa più volte il quiz, i risultati vengono accumulati e mostrati in una lista.
        
         * Qua sotto un esempio di come vengono salvati i risultati in caso di più quiz:
        [
            {
                "date": "2025-05-17T19:53:14.451Z",
                "percentage": 80,
                "correct": 8,
                "total": 10,
                "timeSpent": "00:50"
            },
            {
                "date": "2025-05-17T19:55:37.347Z",
                "percentage": 100,
                "correct": 10,
                "total": 10,
                "timeSpent": "00:22"
            }
        ]
        */
    }
});
