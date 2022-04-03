
replay_buttonElement.addEventListener("click", ()=>{
    play_again();
    
});

// return_buttonElement.on("click", ()=>{
    
// });

function play_again(){
    // when player choose to play again
    
    reset_game_parameter();
    reset_game_display();

    // reset timer
    initialize_timer(time_allowed, 'timer');
    adjust_canvas_size();
    //start_timer();
    
}

function Show_lboard(){
    ruleElement.style.display = "none";
    ruleElement.style.visibility = "hidden";

    contentElement.style.height = "90%";

    cameraElement.style.visibility = "hidden";
    cameraElement.style.display = "none";
    
    
    lboardElement.style.visibility = "visible";
    lboardElement.style.display = "block";
    play_scoreElement.innerHTML = `<p>Your final score: ${score}</p>`;
}

function reset_game_parameter(){
    reset_score();
    is_game_end = false;
    game_countdown_second = 4;
    countdown.src = `static/img/count_down/${game_countdown_second - 1}_flip.png`;
    countdown_ready = true;
}

function reset_game_display(){
    document.getElementById('score').innerHTML = 'Score: ' + score;
    ruleElement.style.display = "none";
    ruleElement.style.visibility = "hidden";

    cameraElement.style.display = "block";
    cameraElement.style.visibility = "visible";
    
    lboardElement.style.display = "none";
    lboardElement.style.visibility = "hidden";
    reset_wall();
}