
replay_buttonElement.addEventListener("click", ()=>{
    play_again();
    
});

// return_buttonElement.on("click", ()=>{
    
// });

function play_again(){
    // when player choose to play again
    reset_score();
    document.getElementById('score').innerHTML = 'Score: ' + score;
    initialize_timer(time_allowed, 'timer');
    start_timer();
    reset_wall();
    is_game_end = false;
    ruleElement.style.display = "none";
    cameraElement.style.display = "block";
    lboardElement.style.display = "none";
}

function Show_lboard(){
    ruleElement.style.display = "none";
    cameraElement.style.display = "none";
    lboardElement.style.display = "block";
    play_scoreElement.innerHTML = `<p>Your final score: ${score}</p>`;
}