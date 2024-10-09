let teamName1 = "TeamA";
let teamName2 = "TeamB";

function gameStartUp(){
    teamName1 = document.getElementById("team-name1").value;
    teamName2 = document.getElementById("team-name2").value;
    loadRound();
}


const startBtn = document.getElementById("start");
startBtn.addEventListener("click", gameStartUp);

let timeLeft = 30;
let timerInterval;
let currentRound = 0;
let currentTeam = null; // Track which team buzzed in
let wrongAnswerCount = 0; // Count of wrong answers for the current team

// Questions and answers
const rounds = [
    {
        question: "Magbigay ng salitang pwedeng pang-describe sa saging?",
        answers: [
            { text: "Mahaba", points: 43 },
            { text: "Masarap", points: 10 },
            { text: "Matamis", points: 9 },
            { text: "Dilaw", points: 6 },
            { text: "Malambot", points: 4 },
            { text: "Kurbado", points: 4 }
        ]
    },
    {
        question: "Mahirap maging (blank).",
        answers: [
            { text: "Pogi", points: 60 },
            { text: "Mahirao", points: 17 },
            { text: "Mabait", points: 4 },
            { text: "Pangit", points: 4 },
            { text: "Single", points: 3 }
        ]
    },
    {
        question: "Ano ang karaniwang ginagawa sa dilim?",
        answers: [
            { text: "Natutulog", points: 21 },
            { text: "Kiss / Sexy time", points: 16 },
            { text: "Nangangapa", points: 11 },
            { text: "Nagtatago", points: 11 },
            { text: "Nagse-cellphone", points: 7 }
        ]
    },
    {
        question: "Anong mga pambobola ang sinasabi ng lalaki sa babae?",
        answers: [
            { text: "Ang ganda mo", points: 32 },
            { text: "Ikaw lang wala na", points: 31 },
            { text: "Di kita iiwan", points: 8 },
            { text: "I miss you", points: 8 },
            { text: "Ang sexy mo", points: 3 }
        ]
    },
    {
        question: "Magbigay ng tunog na nalilikha ng katawan?",
        answers: [
            { text: "Utot", points: 24 },
            { text: "Boses", points: 14 },
            { text: "Sipol", points: 10 },
            { text: "Hilik", points: 9 },
            { text: "Palakpak", points: 8 }
        ]
    },
    {
        question: "Matutuwa ka kung ano ang mabango sa lalaki?",
        answers: [
            { text: "Buhok / Ulo", points: 32 },
            { text: "Kilikili", points: 18 },
            { text: "Leeg", points: 12 },
            { text: "Bibig / Hininga", points: 12 },
            { text: "Dibdib", points: 4 }
        ]
    },
    {
        question: "Anong nagagawa ng bibe na kaya mo rin gawin?",
        answers: [
            { text: "Lumangoy / Maligo", points: 38 },
            { text: "Lumakad / Kumendeng", points: 26 },
            { text: "Tumuka / Kumain", points: 13 },
            { text: "Uminom", points: 6 },
            { text: "Mag quack quack", points: 3 }
        ]
    },
    {
        question: "Sino kinakausap mo pag may problem ka sa lovelife?",
        answers: [
            { text: "Friend", points: 51 },
            { text: "Parents", points: 13 },
            { text: "Kapatid", points: 6 },
            { text: "Sarili", points: 4 },
            { text: "Lord", points: 3 }
        ]
    }
];

function loadRound() {
    if (currentRound >= rounds.length) {
        alert("Game over! Thanks for playing!");
        recordFinalScores();
        return;
    }

    // Load the current question and answers
    const currentRoundData = rounds[currentRound];
    document.getElementById('currentQuestion').innerText = currentRoundData.question;

    const answersDiv = document.querySelector('.answers');
    answersDiv.innerHTML = ''; // Clear previous answers

    currentRoundData.answers.forEach(answer => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
        answerDiv.setAttribute('data-points', answer.points);
        answerDiv.style.display = 'none'; // Hide answers initially

        const answerText = document.createElement('p');
        answerText.innerText = answer.text;

        const pointsText = document.createElement('p');
        pointsText.className = 'points';
        pointsText.innerText = `Points: ${answer.points}`;

        answerDiv.appendChild(answerText);
        answerDiv.appendChild(pointsText);
        answersDiv.appendChild(answerDiv);
    });

    resetBuzzer();
    startTimer();
}

function resetBuzzer() {
    currentTeam = null; // Reset current team
    wrongAnswerCount = 0; // Reset wrong answer count
    document.getElementById('answerInput').disabled = true; // Disable input
    document.getElementById('submitAnswer').disabled = true; // Disable submit
}

document.getElementById('buzzTeamA').addEventListener('click', function() {
    if (!currentTeam) {
        currentTeam = 'A'; // Set current team to A
        alert("Team A has buzzed in! You can answer now.");
        enableAnswerInput();
    }
});

document.getElementById('buzzTeamB').addEventListener('click', function() {
    if (!currentTeam) {
        currentTeam = 'B'; // Set current team to B
        alert("Team B has buzzed in! You can answer now.");
        enableAnswerInput();
    }
});

function enableAnswerInput() {
    document.getElementById('answerInput').disabled = false; // Enable input
    document.getElementById('submitAnswer').disabled = false; // Enable submit
}

document.getElementById('submitAnswer').addEventListener('click', function() {
    const answerInput = document.getElementById('answerInput');
    const answer = answerInput.value.toLowerCase().trim();
    const correctAnswers = Array.from(document.querySelectorAll('.answer'));
    let found = false;

    // Check the current team's answer
    correctAnswers.forEach(answerDiv => {
        const correctAnswer = answerDiv.querySelector('p').innerText.toLowerCase();
        const points = parseInt(answerDiv.getAttribute('data-points'));

        if (answer === correctAnswer) {
            found = true;
            const currentScore = parseInt(document.getElementById(`score${currentTeam}`).innerText);
            document.getElementById(`score${currentTeam}`).innerText = currentScore + points;
            alert(`Correct! Team ${currentTeam} earned ${points} points.`);
            
            // Reveal the answer
            answerDiv.style.display = 'block';

            // Check if all answers have been revealed
            if (correctAnswers.every(div => div.style.display === 'block')) {
                alert(`Team ${currentTeam} has revealed all answers!`);
                currentRound++;
                clearInterval(timerInterval);
                resetBuzzer();
                loadRound(); // Load next round
            }
        }
    });

    if (!found) {
        wrongAnswerCount++;
        alert('Incorrect answer. Try again!');
        if (wrongAnswerCount >= 3) {
            alert(`Team ${currentTeam} has three wrong answers!`);
            resetBuzzer(); // Reset for the next team
            currentRound++; // Move to next round
            loadRound(); // Load next round
        }
    }

    answerInput.value = '';
});

function startTimer() {
    timeLeft = 30; // Reset time
    document.getElementById('timeLeft').innerText = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! Moving to the next round.');
            currentRound++;
            resetBuzzer();
            loadRound(); // Load next round
        }
    }, 1000);
}
