const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const wallElement = document.createElement('canvas');
wallElement.style.display = 'none';
// image size is fixed
wallElement.width = 1280;
wallElement.height = 720;
const wallCtx = wallElement.getContext('2d');


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

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height); // draw camera image
  
  // draw wall image
  // https://stackoverflow.com/questions/23104582/scaling-an-image-to-fit-on-canvas
  const wall = new Image();
  wall.src = 'static/img/h1.png';
  wallCtx.drawImage(wall, 0, 0, wall.width, wall.height);
  canvasCtx.drawImage(wall, 0, 0, wall.width, wall.height,           // source rectangle
    0, 0, canvasElement.width, canvasElement.height); // destination rectangle);
  // draw hand skeleton
  if (results.multiHandLandmarks) {
    // results.multiHandLandmarks is a array of positions of all hand landmarks (a total of 21 of them) 
    // console.log(results.multiHandLandmarks);
    // if(results.multiHandLandmarks.length != 0){ 
    //   var fittedNum = 0;
    //   for( let i = 0; i < 21; i++){
    //     if(checkTransparent(wall.src,results.multiHandLandmarks[0][i].x, results.multiHandLandmarks[0][i].y)){
    //       fittedNum++;
    //     }
    //   }
    //   console.log(fittedNum);
    // }
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
        { color: '#00FF00', lineWidth: 5 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
    }
    
    
    if (results.multiHandLandmarks.length > 0){
      for( const landmarks of results.multiHandLandmarks){
        if (checkDepth(landmarks)){
          var fittedNum = 0;
          for (const landmark of landmarks) {
            if(checkTransparent(wall,landmark.x, landmark.y)){
              fittedNum++;
            }
            // console.log(landmarks);
          }
        }
        else{
          console.log('your hand is too far away!');
        }
        // console.log(d_p0p9 , d_p5p17);
        
        // if(checkTransparent(wall,landmarks.x, landmarks.y)){
        //   fittedNum++;
        // }
      }
    }
      
  }
  
  canvasCtx.restore();
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


function checkTransparent(scr,x,y){
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
  return (d_p0p9 > 0.04 || d_p5p17 > 0.02);
}

function ManhattanDistance(landmark_1, landmark_2) {
  return Math.abs(landmark_1.x - landmark_2.x)*16/9 + Math.abs(landmark_1.y - landmark_2.y);
}

function EuclideanDistance(landmark_1, landmark_2) {
  return Math.pow((landmark_1.x - landmark_2.x)*16/9, 2) + Math.pow((landmark_1.y - landmark_2.y), 2);
}