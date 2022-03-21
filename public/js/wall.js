
export const wallElement = document.createElement('canvas');
wallElement.style.display = 'none';
// image size is fixed
wallElement.width = 1280;
wallElement.height = 720;
export const wallCtx = wallElement.getContext('2d');

export const wall_order = random_array(4);

export const wall = new Image();
console.log(wall_order)

let curr_wall_id = 0;
wall.src = `static/img/walls/${wall_order[curr_wall_id]}.png`;

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

export function update_wall(){
    console.log(curr_wall_id);
    curr_wall_id += 1;
    wall.src = `static/img/walls/${wall_order[curr_wall_id]}.png`;
    // wall_passed = false;
}

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

export function is_bounded(landmarks){
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

export function checkDepth(landmarks){
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