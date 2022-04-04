// game variables

let is_game_end = false; // whether the game has ended or not
let score = 0;           // current score of player
let camera_ready = false; /* determinewhether the camera is ready or not, 
                            player can start game once the camera_ready=true*/

let wall_ready = true;   /* determine whether the wall is ready to be counted or not
                            refreshed to false when a new wall is displayed.
                            set to true when a new wall has been displayed for 0.3s*/

let wall_timer;           /*a variable that stores the value in setInterval*/
let countdown_ready = true;
let game_countdown_second = 4;
const countdown = new Image();
countdown.src = `static/img/count_down/${game_countdown_second - 1}_flip.png`;

let is_lboard_displayed = false;


// adjust canvas size
window.onload = function () {
  adjust_canvas_size();
  initialize_timer(time_allowed, 'timer');
  // get_lboard();
  // wall_order = random_array(wall_order);
}
// adjust canvas size on resizing the window
window.onresize = function () {
  adjust_canvas_size();

}

async function onResults(results) {
  if (!is_game_start) { // if is in rules

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

        await add_lboard(score, bestscore);
        await get_lboard();


        Show_lboard();

        is_lboard_displayed = true;
      }

    }
  }


  is_game_end = check_game_ended();
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});
hands.setOptions({ // hand detection model settings
  maxNumHands: 1,
  modelComplexity: 0,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults); // draw the hand detection image on the canvas

const camera = new Camera(videoElement, {
  // calls the camera, return the camera image
  onFrame: async () => {
    await hands.send({ image: videoElement });
    camera_ready = true;
    buttonAvailable()
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
}
function reset_score() {
  // call when the user choose to replay the game 
  score = 0;
}
function play_game(results) {
  // reset image previously drew on canvas, and draw new image instead
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height); // draw camera image

  display_wall();


  // draw hand skeleton
  if (results.multiHandLandmarks) {
    // results.multiHandLandmarks is a array of hand landmarks positions of detected hand
    display_hand(results)

    // check hand status
    if (results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        if (checkDepth(landmarks)) {
          // console.log(curr_wall_id, `static/img/walls/${wall_order[curr_wall_id]}.png`);
          hand_too_far_warning.innerHTML = ``;
          if (wall_ready) {
            if (is_bounded(landmarks)) {
              update_wall();
              update_score();
              wall_ready = false;
              canvasElement.style.border = "10px solid rgb(172, 250, 54)";
              wall_timer = setTimeout(() => {
                wall_ready = true;
                canvasElement.style.border = "10px solid black";
              }, 500);
            }
          }
        }
        else {
          hand_too_far_warning.innerHTML = `your hand is too far away!`;
        }
      }
    }
    else {
      hand_too_far_warning.innerHTML = `hand not detected`;
    }
  }
  canvasCtx.restore();
  wallCtx.restore();
}

function display_hand(results) {
  for (const landmarks of results.multiHandLandmarks) {
    // landmarks is an array of 21 hand landmarks detected (x_pos, y_pos, z_pos)
    drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
      { color: '#00FF00', lineWidth: 5 });
    drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
  }
}



function game_countdown(results) {
  // reset image previously drew on canvas, and draw new image instead
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height); // draw camera image

  display_countdown();
  // draw hand skeleton
  if (results.multiHandLandmarks) {
    // results.multiHandLandmarks is a array of hand landmarks positions of detected hand
    display_hand(results)
  }
  if (countdown_ready) {
    countdown_ready = false;
    wall_timer = setTimeout(() => {
      countdown_ready = true;

      update_countdown();
      countdown.src = `static/img/count_down/${Math.max(0, game_countdown_second - 1)}_flip.png`;

    }, 1000);

  }
  canvasCtx.restore();
  wallCtx.restore();
}

function display_countdown() {
  wallCtx.save();
  wallCtx.clearRect(0, 0, wallElement.width, wallElement.height);
  // draw wall image
  // https://stackoverflow.com/questions/23104582/scaling-an-image-to-fit-on-canvas

  wallCtx.drawImage(countdown, 0, 0, countdown.width, countdown.height);
  canvasCtx.drawImage(countdown, 0, 0, countdown.width, countdown.height,// source rectangle  
    0, 0, canvasElement.width, canvasElement.height); // destination rectangle);
}

function update_countdown() {
  game_countdown_second -= 1;
}