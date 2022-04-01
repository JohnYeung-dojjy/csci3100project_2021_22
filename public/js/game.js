// game variables
let is_game_end = false; // whether the game has ended or not
let score = 0;           // current score of player
let camera_ready = false; /* determinewhether the camera is ready or not, 
                            player can start game once the camera_ready=true*/
                            
let wall_ready = true;   /* determine whether the wall is ready to be counted or not
                            refreshed to false when a new wall is displayed.
                            set to true when a new wall has been displayed for 0.3s*/

let wall_timer;           /*a variable that stores the value in setInterval*/
                      
// let wall_passed = false;


// adjust canvas size
window.onload = function () {
  if (displayElement.offsetHeight < 720){
    canvasElement.height = displayElement.offsetHeight;
    canvasElement.width = displayElement.offsetHeight * 16 / 9;
  }
  else if (window.innerWidth > window.innerHeight * 16 / 9) {
    var min_height = Math.min(window.innerHeight, 720);
    canvasElement.height = min_height;
    canvasElement.width = min_height * 16 / 9;
  }
  else {
    var min_width = Math.min(window.innerWidth, 1280);
    canvasElement.width = min_width;
    canvasElement.height = min_width * 9 / 16;
  }

  
  initialize_timer(time_allowed, 'timer');
  // wall_order = random_array(wall_order);
}
// adjust canvas size on resizing the window
window.onresize = function () {
  if (displayElement.offsetHeight < 720){
    canvasElement.height = displayElement.offsetHeight;
    canvasElement.width = displayElement.offsetHeight * 16 / 9;
  }
  else if (window.innerWidth > window.innerHeight * 16 / 9) {
    var min_height = Math.min(window.innerHeight, 720);
    canvasElement.height = min_height;
    canvasElement.width = min_height * 16 / 9;
  }
  else {
    var min_width = Math.min(window.innerWidth, 1280);
    canvasElement.width = min_width;
    canvasElement.height = min_width * 9 / 16;
  }
  
}

function onResults(results) {
  if (!is_game_end){
    
    console.log(wall_ready);
    play_game(results);
  }
  else{
    Show_lboard();
  }
  
  is_game_end = check_game_ended();
}

const hands = new Hands({
  locateFile: (file) => {
    return `static/@mediapipe/hands/${file}`;
  }
});
hands.setOptions({ // hand detection model settings
  maxNumHands: 1,
  modelComplexity: 1,
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
function reset_score(){
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
          hand_too_far_warning.innerHTML = `<p></p>`;
          if (wall_ready) {
            if (is_bounded(landmarks)){
              update_wall();
              update_score();
              wall_ready = false;
              wall_timer = setTimeout(()=>{wall_ready=true}, 500);
            }
          }
        }
        else {
          hand_too_far_warning.innerHTML = `<p>your hand is too far away!</p>`;
        }
      }
    }
    else {
      hand_too_far_warning.innerHTML = `<p>hand not detected</p>`;
    }
  }
  canvasCtx.restore();
  wallCtx.restore();
}

function display_hand(results){
  for (const landmarks of results.multiHandLandmarks) {
    // landmarks is an array of 21 hand landmarks detected (x_pos, y_pos, z_pos)
    drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
      { color: '#00FF00', lineWidth: 5 });
    drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
  }
}

function display_wall(){
  wallCtx.save();
  wallCtx.clearRect(0, 0, wallElement.width, wallElement.height);
  // draw wall image
  // https://stackoverflow.com/questions/23104582/scaling-an-image-to-fit-on-canvas

  wallCtx.drawImage(wall, 0, 0, wall.width, wall.height);
  canvasCtx.drawImage(wall, 0, 0, wall.width, wall.height, 0, 0, canvasElement.width, canvasElement.height);
                          // source rectangle             // destination rectangle);
}