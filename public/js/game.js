/**
 * Game: This file contains functions that controls the game behavior, relying on the camera image input
 * 
 * Author: YEUNG Ching Fung
 * 
 * Version 1: Written 8 April 2022
 * Version 2: Revised 9 April 2022, moved display hand and countdown function to wall.js
 * 
 * functions: 
 *    hands.onResults(): a function that handles each frame captured by the camera,
 *                       which is also where the main game logic occurs
 * 
 *    play_game()      : a function that handles the game logic, includes 
 *                          1. game state check (is_game_started, is_game_ended)  
 *                          2. score check
 *                          3. update countdown and wall images
 * 
 *    update_score()   : a function that updates the score after player passed a wall
 *    
 *    reset_score()    : a function that resets the score to 0, called when the player replay the game
 * 
 *    
 */


// game variables

let is_game_end = false; // whether the game has ended or not
let score = 0;           // current score of player
let camera_ready = false; /* determinewhether the camera is ready or not, 
                            player can start game once the camera_ready=true*/

let wall_ready = true;   /* determine whether the wall is ready to be counted or not
                            refreshed to false when a new wall is displayed.
                            set to true when a new wall has been displayed for 0.3s*/

let wall_timer;           /*a variable that stores the value in setInterval*/
let countdown_ready = true; /* a variable that checks if the next countdown image is ready to be displayed*/
let game_countdown_second = 4; /* a variable that checks countdown seconds, game start after this becomes 0*/

const countdown = new Image(); // initialize the countdown image to be displayed

// define the source of the countdown image
// will be updated in the game_countdown function
countdown.src = `static/img/count_down/${game_countdown_second - 1}_flip.png`; 

let is_lboard_displayed = false; /* checks if the leaderboard should be displayed
                                  set to true when game is ended, set back to false when user clicks reply button*/


// adjust canvas size
window.onload = function () {
  // things to be done when the window is loaded (when the user is redirected to game page)
  adjust_canvas_size(); // determine canvas size dynamically according to user's window size
  initialize_timer(time_allowed, 'timer');  // initialize the timer object
  // get_lboard();
  // wall_order = random_array(wall_order);
}
// adjust canvas size on resizing the window
window.onresize = function () {
  //thing to be done when the window is resized
  adjust_canvas_size(); // determine canvas size dynamically according to user's window size

}

async function onResults(results) { // called for each frame of input image
  if (!is_game_start) { // if is in rules
    is_lboard_displayed = false;
  } else { // if is in game
    if (!is_game_end) {
      //console.log(game_countdown_second);
      //console.log(wall_ready);
      if (game_countdown_second > 0) {
        game_countdown(results);
      } else if (game_countdown_second == 0) {
        game_countdown_second -= 1;
        start_timer();
      } else {
        play_game(results);
      }
    }
    else { // if game ended
      if (!is_lboard_displayed) {
        console.log("bestscore passed to the client:" + bestscore);

        bestscore = await add_lboard(score, bestscore); // add the score to the server if user beat their record
        await get_lboard(); // get top 6 record from leaderboard


        Show_lboard(); // display the leaderboard

        is_lboard_displayed = true; // tell the program that the leaderboard is being displayed
      }

    }
  }


  is_game_end = check_game_ended(); 
}

const hands = new Hands({ // get the hand detection model
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});
hands.setOptions({ // hand detection model settings
  maxNumHands: 1, // number of hands to be detected by the model
  modelComplexity: 0, // complexity of the model, 0 is simple model, 1 is complex model
                      // simple model is used by default for integrated GPU
  minDetectionConfidence: 0.5, // hand detection model variables, the default setting is sufficient
  minTrackingConfidence: 0.5
});
hands.onResults(onResults); // things to do for every frame returned from the camera by the hand detection model 

const camera = new Camera(videoElement, {
  // calls the camera, return the camera image
  onFrame: async () => {
    await hands.send({ image: videoElement });
    camera_ready = true; // tell the program that the camera is ready 
                        // (as the hand detection model first receive an camera image)
    buttonAvailable()   // make the 'start game' button available once the camera is ready
  },
  width: 1280,
  height: 720
});

camera.start();

function update_score() {
  /*update the score
  called when the hand image fits in the wall*/
  score += 1;
  console.log("Score:" + score);
  document.getElementById('score').innerHTML = 'Score: ' + score;
  let audio = new Audio("static/audio/pass.mp3");
  audio.play();
}
function reset_score() {
  // call when the user choose to replay the game 
  score = 0;
}
function play_game(results) {
  // reset image previously drew on canvas, and draw new image instead
  canvasCtx.save(); // standard operation to reset the canvas image
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height); // same as above
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height); // draw camera image

  display_wall();


  // draw hand skeleton
  if (results.multiHandLandmarks) {
    // results.multiHandLandmarks is a array of hand landmarks positions of detected hand
    display_hand(results) // draw the hand skeleton onto canvas

    // check hand status
    if (results.multiHandLandmarks.length > 0) { // if at least 1 hand is detected
      for (const landmarks of results.multiHandLandmarks) { // loop for all hand landmarks (21 for each hand)
        if (checkDepth(landmarks)) {
          // console.log(curr_wall_id, `static/img/walls/${wall_order[curr_wall_id]}.png`);
          hand_too_far_warning.innerHTML = ``;
          if (wall_ready) { // when the displayed wall is displayed for at least 0.5s, 
                            // prevents instant change of wall in actual game play
            if (is_bounded(landmarks)) { // if the hands fits into the image
              update_wall();    // display another wall
              update_score();   // update the score
              wall_ready = false; // tell the program that the displayed wall has just started displaying
              canvasElement.style.border = "10px solid rgb(172, 250, 54)"; // make the border green to indicate that user passed a wall
              wall_timer = setTimeout(() => {
                wall_ready = true;
                canvasElement.style.border = "10px solid black"; // set the wall boarder back to black
              }, 500); // set wall_ready to true when the wall has been displayed for 0.5s
            }
          }
        }
        else { // if the detected hand is too far away from the camera
          hand_too_far_warning.innerHTML = `your hand is too far away!`;
        }
      }
    }
    else { // if no hands are detected
      hand_too_far_warning.innerHTML = `hand not detected`;
    }
  }
  // standard operations to reset the canvas after each frame
  canvasCtx.restore();
  wallCtx.restore();
}

