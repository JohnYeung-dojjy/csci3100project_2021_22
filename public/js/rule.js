/**
 * Game: This file contains functions that handles all operations that can be done when rules are displayed.
 * 
 * Author: YEUNG Ching Fung
 * 
 * Version 1: Written 8 April 2022
 * 
 * functions: 
 *    button.onclick : display the game visuals, this button is only available when the camera input is ready 
 */

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