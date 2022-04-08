
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