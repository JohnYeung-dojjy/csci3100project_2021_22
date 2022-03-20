const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const hand_too_far_warning = document.getElementsByClassName('hand_too_far_warning')[0];
const timer = document.getElementById('timer');

const wallElement = document.createElement('canvas');
wallElement.style.display = 'none';
// image size is fixed
wallElement.width = 1280;
wallElement.height = 720;
const wallCtx = wallElement.getContext('2d');
const time_allowed = 15;

const wall_order = random_array(4);
// game variables
let timer_link;
let is_game_end = false;
let score = 0;
let time = time_allowed;
let timer_started = false;
let wall_passed = false;
let curr_wall_id = 0;

const wall = new Image();
console.log(wall_order)
wall.src = `static/img/walls/${wall_order[curr_wall_id]}.png`;

// adjust canvas size
window.onload = function () {
  if (window.innerWidth > window.innerHeight *16/9) {
    var min_height = Math.min(window.innerHeight, 720);
    canvasElement.height = min_height;
    canvasElement.width = min_height * 16/9;
  }
  else {
    var min_width = Math.min(window.innerWidth, 1280);
    canvasElement.width = min_width;
    canvasElement.height = min_width * 9 / 16;
  }
  update_timer();
  start_timer();
  // wall_order = random_array(wall_order);
}
// adjust canvas size on resizing the window
window.onresize = function () {
  if (window.innerWidth > window.innerHeight*16/9) {
    var min_height = Math.min(window.innerHeight, 720);
    canvasElement.height = min_height;
    canvasElement.width = min_height * 16/9;
  }
  else {
    var min_width = Math.min(window.innerWidth, 1280);
    canvasElement.width = min_width;
    canvasElement.height = min_width * 9 / 16;
  }
}




function onResults(results) {
  // reset image previously drew on canvas, and draw new image instead
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height); // draw camera image

  wallCtx.save();
  wallCtx.clearRect(0, 0, wallElement.width, wallElement.height);
  // draw wall image
  // https://stackoverflow.com/questions/23104582/scaling-an-image-to-fit-on-canvas
  
  wallCtx.drawImage(wall, 0, 0, wall.width, wall.height);
  canvasCtx.drawImage(wall, 0, 0, wall.width, wall.height,           // source rectangle
    0, 0, canvasElement.width, canvasElement.height); // destination rectangle);
  // draw hand skeleton
  if (results.multiHandLandmarks) {
    // results.multiHandLandmarks is a array of hand landmarks positions of detected hand
    for (const landmarks of results.multiHandLandmarks) {
      // landmarks is an array of 21 hand landmarks detected (x_pos, y_pos, z_pos)
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
        { color: '#00FF00', lineWidth: 5 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
    }
    
    
    if (results.multiHandLandmarks.length > 0){
      for( const landmarks of results.multiHandLandmarks){
        if (checkDepth(landmarks)){
          // console.log(curr_wall_id, `static/img/walls/${wall_order[curr_wall_id]}.png`);
          hand_too_far_warning.innerHTML = `<p></p>`;
          if (is_bounded(landmarks)){
            console.log('ok');
            wall_passed = true;
            update_wall();
            
            update_score();
          }
          else{
            console.log('not ok');
          }
        }
        else{
          hand_too_far_warning.innerHTML = `<p>your hand is too far away!</p>`;
        }
      } 
      /*if( !timer_started){
        start_timer();
      }*/
    }
    else{
      hand_too_far_warning.innerHTML = `<p>hand not detected</p>`;
      /*if( timer_started){
        stop_timer();
      }*/
    }
  }
  
  canvasCtx.restore();
  wallCtx.restore();
}

const hands = new Hands({
  locateFile: (file) => {
    return `static/@mediapipe/hands/${file}`;
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
  },
  width: 1280,
  height: 720
});
camera.start();


function checkTransparent(x,y){
  // the image must be 1280*720
  var pixel_x = Math.floor(x*1280);
  var pixel_y = Math.floor(y*720);
  
  var pixelData = wallCtx.getImageData(pixel_x, pixel_y, 1, 1).data;
  
  // console.log(pixel_x, pixel_y, pixelData);
  // console.log(wallElement.width, wallElement.height, pixel_x, pixel_y, pixelData);
  // if alpha value not 255 (transparent)
  if (pixelData[3] != 255){
    // console.log(pixelData);
    return true;
  }else{
    return false;
  }
  
}

function checkDepth(landmarks){
  // var d_p0p9 = ManhattanDistance(landmarks[0], landmarks[9]);
  // var d_p5p17 = ManhattanDistance(landmarks[5], landmarks[17]);
  // return (d_p0p9 > 0.25 || d_p5p17 > 0.15);
  var d_p0p9 = EuclideanDistance(landmarks[0], landmarks[9]);
  var d_p5p17 = EuclideanDistance(landmarks[5], landmarks[17]);
  // console.log(d_p0p9, d_p5p17);
  return (d_p0p9 > 0.3 || d_p5p17 > 0.2);
}


function EuclideanDistance(landmark_1, landmark_2) {
  return Math.sqrt(Math.pow((landmark_1.x - landmark_2.x)*16/9, 2) + Math.pow((landmark_1.y - landmark_2.y), 2) + Math.pow((landmark_1.z - landmark_2.z), 2));
}

function is_bounded(landmarks){
  // this function returns true is all hand landmarks are in bound
  for (const landmark of landmarks) {
    // return false if any of the landmarks are not in bound (i.e. it's pixel is not transparent)
    if( !checkTransparent(landmark.x, landmark.y) ){
      return false;
    }
    // console.log(landmarks);
  }
  return true; // all hand landmarks are bound
}

function update_wall(){
  console.log(curr_wall_id);
  curr_wall_id += 1;
  wall.src = `static/img/walls/${wall_order[curr_wall_id]}.png`;
  wall_passed = false;
}

function random_array(num){
  let tmp_arr = new Array(num);

  // only rendered once on load
  for (let i = 0; i < tmp_arr.length; i++){
    tmp_arr[i] = i;
  }
  // from https://shubo.io/javascript-random-shuffle/
  for (let i = tmp_arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [tmp_arr[i], tmp_arr[j]] = [tmp_arr[j], tmp_arr[i]];
  }
  return tmp_arr;
}

function start_timer(){
  update_timer();
  if(time >= 0){
    timer_link = setInterval(count_down ,1000);
    timer_started = true;
  }
}

function stop_timer(){
  clearInterval(timer_link);
  timer_started = false;
}

function count_down() {
  update_timer();
  console.log("Timer:"+time);
  if(time == 0){
    console.log("end");
    clearInterval(timer_link);
    timer_started = false;
    is_game_end = true;
  }else{
    if(timer_started)
      time = time - 1;
  }
}

function update_timer(){
  timer.innerHTML = 'Time remain: ' + time +'s';
}

function update_score(){
  score += 1;
  console.log("Score:"+score);
  document.getElementById('score').innerHTML = 'Score: ' + score;
}