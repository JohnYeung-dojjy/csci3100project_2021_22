// game variables
let is_game_start = false;

function buttonAvailable(){
    buttonElement.innerHTML = "Play!";
    buttonElement.disabled = false;
}

buttonElement.addEventListener('click', () => {
    contentElement.style.transform = "rotateY(180deg)";
    contentElement.style.height = "100%";
    
    cameraElement.style.display = "block";
    cameraElement.style.visibility = "visible";

    adjust_canvas_size();
    
    ruleElement.style.display = "none";
    ruleElement.style.visibility = "hidden";
    is_game_start = true;
    
});