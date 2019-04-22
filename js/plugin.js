const buttons = document.querySelectorAll('[data-time]');
const form = document.querySelector('#custom');
const inputTime = document.querySelector('input[name=minutes]');
const display = document.querySelector('.display');
const resetTimer = document.querySelector('.reset');

const timer = (function() {

    let countdown,
        timerDisplay,
        endTime,
        alarmSound;

    function init(settings) {
        timerDisplay = document.querySelector(settings.timeLeftSelector);
        endTime = document.querySelector(settings.timeEndSelector);

        if (settings.alarmSound) {
            alarmSound = new Audio(settings.alarmSound);
        }
        
        return this;
    }

    function start(seconds) {
        if (!timerDisplay || !endTime) return console.log('Please init module first');
        if (!seconds || typeof seconds !== 'number') return console.log('Please provide seconds.');

        // Reset timer
        clearInterval(countdown);
        // Reset sound
        alarmSound.pause();
        alarmSound.currentTime = 0;
        

        const now = Date.now();
        const then = now + seconds * 1000;

        displayTimerLeft(seconds);
        displayEndTime(then);

        countdown = setInterval(() => {
            const secondsLeft = Math.round((then - Date.now()) / 1000);

            if (secondsLeft < 0) {
                clearInterval(countdown);
                playSound();
                return;
            }

            displayTimerLeft(secondsLeft);
        }, 1000);
    }

    function displayTimerLeft(seconds) {
        const hour = Math.floor((seconds / 3600));
        const minutes = Math.floor(seconds % 3600 / 60);
        const reminderSeconds = seconds % 60;

        const display = `${hour < 10 ? '0' + hour : hour} : ${minutes < 10 ? '0' + minutes : minutes} : ${reminderSeconds < 10 ? '0' + reminderSeconds : reminderSeconds}`;

        document.title = display;
        timerDisplay.textContent = display;
    }

    function displayEndTime(timestamp) {
        const end = new Date (timestamp);
        const hour = end.getHours();
        const minutes = end.getMinutes();


        resetTimer.textContent = `Click for reset timer :)`;
        endTime.textContent = `Be back at ${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
    }

    function stop() {
        // clear interval
        clearInterval(countdown);
        // upgrade set time;
        resetTimer.textContent = ``;
        const display = ``;
        document.title = display;
        timerDisplay.textContent = display;
        // upgrade end time
        endTime.textContent = ``;
        // clear sound
        alarmSound.pause();
        alarmSound.currentTime = 0; 
    }

    function playSound() {
        alarmSound.play();
    }

    return {
        init,
        start,
        stop
    }

}());

// init timer
timer.init({
    timeLeftSelector: '.display-time-left',
    timeEndSelector: '.display-end-time',
    alarmSound: 'sound/music.mp3'
});

// Start timer by click

function startTimer() {
    const seconds = parseInt(this.dataset.time);
    timer.start(seconds);
}


buttons.forEach((btn) => btn.addEventListener('click', startTimer)); 


form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const seconds = Math.round(+inputTime.value) * 60;
    timer.start(seconds);
});

display.addEventListener('click', () => timer.stop());

