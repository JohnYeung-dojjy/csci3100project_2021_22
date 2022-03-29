const ruleElement = document.getElementsByClassName('rule')[0];
const buttonElement = ruleElement.getElementsByClassName('play_button')[0];
const cameraElement = document.getElementsByClassName('camera')[0];

function buttonAvailable(){
    buttonElement.innerHTML = "Play!";
    buttonElement.disabled = false;
}

buttonElement.addEventListener('click', () => {
    ruleElement.style.display = "none";
    cameraElement.style.display = "block";
    start_timer();
});