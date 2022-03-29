const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const hand_too_far_warning = document.getElementsByClassName('hand_too_far_warning')[0];
const lboardElement = document.getElementById("lboard");

let camera_ready = false;
// game variables
let is_game_end = false;
let score = 0;
// let wall_passed = false;

// adjust canvas size
window.onload = function () {
  if (window.innerWidth > window.innerHeight * 16 / 9) {
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
  if (window.innerWidth > window.innerHeight * 16 / 9) {
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
    play_game(results);
  }
  else{
    cameraElement.style.display = "none";
    lboardElement.style.display = "block";
  }
  
  is_game_end = check_game_ended();
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults); // draw the hand detection image on the canvas

const camera = new Camera(videoElement, {
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
  score += 1;
  console.log("Score:" + score);
  document.getElementById('score').innerHTML = 'Score: ' + score;
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
          if (is_bounded(landmarks)) {
            console.log('ok');
            // wall_passed = true;
            update_wall();

            update_score();
          }
          else {
            console.log('not ok');
          }
        }
        else {
          hand_too_far_warning.innerHTML = `<p>your hand is too far away!</p>`;
        }
      }
      /*if( !timer.check_start_timer()){
        timer.start_timer();
      }*/
    }
    else {
      hand_too_far_warning.innerHTML = `<p>hand not detected</p>`;
      /*if( timer.check_start_timer()){
        timer.stop_timer();
      }*/
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