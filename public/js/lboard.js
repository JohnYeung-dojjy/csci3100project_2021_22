/**
 * Game: This file contains functions that handles all operations that can be done when leaderboard is displayed.
 * 
 * Author: YEUNG Ching Fung
 * 
 * Version 1: Written 8 April 2022
 * 
 * functions: 
 *    play_again(): this function is called after the replay button is clicked, which will reset all game settings and restart the game.
 * 
 *    Show_lboard(): this function is called when game is ended (15 seconds passed), which will then display the leaderboard.
 * 
 *    reset_game_parameter(): this function resets all game parameters when called
 * 
 *    reset_game_display(): this function resets the display of the game, i.e. display the game canvas again
 * 
 *    get_lboard(): this function adds the obtained leaderboard information to the leaderboard display
 * 
 *    add_lboard(): this function fetches and retruns the leaderboard information from the database   
 */
replay_buttonElement.addEventListener("click", () => {
  play_again();

});

// return_buttonElement.on("click", ()=>{

// });

function play_again() {
  // when player choose to play again

  reset_game_parameter();
  reset_game_display();

  // reset timer
  initialize_timer(time_allowed, 'timer');
  adjust_canvas_size();
  //start_timer();

}
function Show_lboard() {
  ruleElement.style.display = "none";
  ruleElement.style.visibility = "hidden";

  contentElement.style.height = "90%";

  cameraElement.style.visibility = "hidden";
  cameraElement.style.display = "none";


  lboardElement.style.visibility = "visible";
  lboardElement.style.display = "block";
  play_scoreElement.innerHTML = `<p>Your final score: ${score}</p>`;
}

function reset_game_parameter() {
  reset_score();
  is_game_end = false;
  game_countdown_second = 4;
  countdown.src = `static/img/count_down/${game_countdown_second - 1}_flip.png`;
  countdown_ready = true;
  is_lboard_displayed = false;
}

function reset_game_display() {
  document.getElementById('score').innerHTML = 'Score: ' + score;
  ruleElement.style.display = "none";
  ruleElement.style.visibility = "hidden";

  cameraElement.style.display = "block";
  cameraElement.style.visibility = "visible";

  lboardElement.style.display = "none";
  lboardElement.style.visibility = "hidden";
  reset_wall();
}

async function get_lboard() {
  let request = new Request('/getleaderboard', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8;'
    }
  });
  let response = await fetch(request);
  if (response.status !== 200) {
    throw new Error(response.status);
  }
  response.json().then((response) => {
    let getleaderboard = response;
    let htmlboardname = document.querySelectorAll('#lboard .name');
    let htmlboardscore = document.querySelectorAll('#lboard .score');
    let looplength = 6 < getleaderboard.length ? 6 : getleaderboard.length;



    for (let i = 0; i < looplength; i++) {
      htmlboardname[i].innerHTML = getleaderboard[i].username;
      htmlboardscore[i].innerHTML = getleaderboard[i].score;
    }
    for (let i = looplength; i < 6; i++) {
      htmlboardname[i].innerHTML = "";
      htmlboardscore[i].innerHTML = "";
    }
  });
  return 0;
}

async function add_lboard(score, bestscore) {
  console.log("the current final score is" + score);
  console.log("the best score is" + bestscore);
  if (score >= bestscore) {
    let request = new Request('/updateleaderboard', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8;'
      },
      body: JSON.stringify(
        {
          username: username,
          score: score
        }
      )
    });
    let response = await fetch(request);
    if (response.status !== 200) {
      throw new Error(response.status);
    }
    response = await response.json();
    console.log("after uploading, bestscore is" + response.score);
    console.log("if best score < score, err!!")
    return response.score;
  }
  return bestscore;
}