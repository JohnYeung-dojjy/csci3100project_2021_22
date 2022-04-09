/**
 * wall: This file contains functions handles all wall related functions
 * 
 * Author: YEUNG Ching Fung
 * 
 * Version 1: Written 8 April 2022
 * Version 2: Revised 9 April 2022, moved display hand and countdown function to wall.js
 * 
 * functions: 
 *    random_array(num)         : a function that returns a random shuffled array of $(num) wall indices
 *
 *    display_hand()            : a function that draw the detected hand onto the game canvas
 * 
 *    display_wall()            : a function that draw the wall image onto the game canvas 
 * 
 *    update_wall()             : a function that update the wall image, called after player passed a wall
 * 
 *    reset_wall()              : a function that reset the wall image and the wall index array, 
 *                                called after player clicked replay

 *    game_countdown()          : a function that handles the countdown when the game has just started
 * 
 *    display_countdown()       : a function that draw the countdown image onto the game canvas 
 *                                when the game is counting down before start
 * 
 *    update_countdown()        : a function that updates the countdown image during countdown
 *                                called once a second update game_countdown_second == 0
 * 
 *    is_Transparent(pixelData) : a function that check if the input pixel on the wall is transparent
 * 
 *    is_ffff49(pixelData)      : a function that check if the input pixel on the wall is of color #ffff49
 * 
 *    is_bounded(landmarks)     : a function that check if the input landmarks are all bounded by the wall image
 * 
 *    check_Depth(landmarks)    : a function that check if the player's hand is too far away from the camera
 * 
 *    EuclideanDistance(landmark1, landmark2): a function that computes the distance between 2 hand landmarks
 * 
 *    adjust_canvas_size()      : a function that adjusts the wall canvas size dynamically,
 *                                called when transition from another display to game 
 *                                (i.e., when player clicks 'start button' at rules)
 * 
 */


const wallElement = document.createElement('canvas');
wallElement.style.display = 'none';
// image size is fixed
wallElement.width = 1280;
wallElement.height = 720;
const wallCtx = wallElement.getContext('2d');

let wall_order = random_array(22); /* An array that stores the order to display wall*/



const wall = new Image();
console.log(wall_order)

let curr_wall_id = 0;
const wall_dir = "static/img/wall/"
wall.src = wall_dir + `${wall_order[curr_wall_id]}.png`;

function random_array(num) {
  let tmp_arr = new Array(num);

  // only rendered once on load
  for (let i = 0; i < tmp_arr.length; i++) {
    tmp_arr[i] = i;
  }
  // from https://shubo.io/javascript-random-shuffle/
  for (let i = tmp_arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [tmp_arr[i], tmp_arr[j]] = [tmp_arr[j], tmp_arr[i]];
  }
  return tmp_arr;
}


function display_hand(results) {
  for (const landmarks of results.multiHandLandmarks) {
    // landmarks is an array of 21 hand landmarks detected (x_pos, y_pos, z_pos)
    drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,                  // draw the connecting lines
      { color: '#00FF00', lineWidth: 5 });                                    
    drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 }); // draw the points
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

function update_wall() {
  console.log(curr_wall_id);
  curr_wall_id += 1;
  wall.src = wall_dir + `${wall_order[curr_wall_id]}.png`;
  console.log(wall.src);
  // wall_passed = false;
}

function reset_wall(){
  wall_order = random_array(10);
  curr_wall_id = 0;
}
function game_countdown(results) {
  // reset image previously drew on canvas, and draw new image instead
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height); // draw camera image

  display_countdown(); // display the current countdown image
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
      

    }, 1000); // change a new countdown image every 1s

  }
  // standard operations to reset the canvas after each frame
  canvasCtx.restore();
  wallCtx.restore();
}

function display_countdown() {
  // standard operations to reset the canvas after each frame
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
  if (game_countdown_second>0){
    let audio = new Audio("static/audio/321.mp3");
    audio.play();
  }else{
    let audio = new Audio("static/audio/go.mp3");
    audio.play();
  }

}


function is_Transparent(pixelData) {

  // if alpha value not 255 (transparent) or of color ffff49
  if (pixelData[3] != 255) {
    // console.log(pixelData);
    return true;
  } else if(pixelData[0] != 255 || pixelData[1] != 255 || pixelData[2] != 16*4+9){
    // if color is not #ffff49

  }else {
    return false;
  }

}

function is_ffff49(pixelData) {
  // check if the pixel is of RGB value #ffff49
  if (pixelData[0] != 255 || pixelData[1] != 255 || pixelData[2] != 16*4+9){
    return false;
  } else{
    return true;
  }
  
}

function is_bounded(landmarks) {
  // this function returns true is all hand landmarks are in bound
  ffff49_count = 0;
  for (const landmark of landmarks) {
      // the image must be 1280*720
    var pixel_x = Math.floor(landmark.x * 1280);
    var pixel_y = Math.floor(landmark.y * 720);

    var pixelData = wallCtx.getImageData(pixel_x, pixel_y, 1, 1).data;
    // console.log(pixelData);
    // return false if any of the landmarks are not in bound (i.e. it's pixel is not transparent)
    if (!is_Transparent(pixelData)) {
      if (!is_ffff49(pixelData)){
        return false;
      } else{
        ffff49_count += 1;
      }
    }
    // console.log(landmarks);
  }
  // all hand landmarks are bounded at this point, check if at least 5 landmarks are in special area
  console.log(ffff49_count);
  if (ffff49_count >= 5){
    // 
    return true; 
  } else{
    return false;
  }
  
}

function checkDepth(landmarks) {
  // var d_p0p9 = ManhattanDistance(landmarks[0], landmarks[9]);
  // var d_p5p17 = ManhattanDistance(landmarks[5], landmarks[17]);
  // return (d_p0p9 > 0.25 || d_p5p17 > 0.15);
  var d_p0p9 = EuclideanDistance(landmarks[0], landmarks[9]);
  var d_p5p17 = EuclideanDistance(landmarks[5], landmarks[17]);
  // console.log(d_p0p9, d_p5p17);
  return (d_p0p9 > 0.3 || d_p5p17 > 0.2);
}


function EuclideanDistance(landmark_1, landmark_2) {
  return Math.sqrt(Math.pow((landmark_1.x - landmark_2.x) * 16 / 9, 2) + Math.pow((landmark_1.y - landmark_2.y), 2) + Math.pow((landmark_1.z - landmark_2.z), 2));
}

function adjust_canvas_size(){
  if (displayElement.offsetHeight < 740){  // 720 + 10*2 (border width=10)
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

