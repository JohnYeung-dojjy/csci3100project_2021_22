const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

window.onload = function () {
  if (window.innerWidth > window.innerHeight *16/9) {
    // canvasElement.width = window.innerHeight;
    // canvasElement.height = window.innerHeight;
    var min_height = Math.min(window.innerHeight, 720);
    canvasElement.height = min_height;
    canvasElement.width = min_height * 16/9;
  }
  else {
    // canvasElement.width = window.innerWidth;
    // canvasElement.height = window.innerWidth;
    var min_width = Math.min(window.innerWidth, 1280);
    canvasElement.width = min_width;
    canvasElement.height = min_width * 9 / 16;
  }
  // var min_height = Math.min(window.innerHeight, 720);
  // canvasElement.height = min_height;
  // canvasElement.width = min_height * 16 / 9;
  
  // var min_width = Math.min(window.innerWidth, 1280);
  // canvasElement.width = min_width;
  // canvasElement.height = min_width * 9 / 16;
}

window.onresize = function () {
  if (window.innerWidth > window.innerHeight*16/9) {
    // canvasElement.width = window.innerHeight;
    // canvasElement.height = window.innerHeight;
    var min_height = Math.min(window.innerHeight, 720);
    canvasElement.height = min_height;
    canvasElement.width = min_height * 16/9;
  }
  else {
    // canvasElement.width = window.innerWidth;
    // canvasElement.height = window.innerWidth;
    var min_width = Math.min(window.innerWidth, 1280);
    canvasElement.width = min_width;
    canvasElement.height = min_width * 9 / 16;
  }
  // var min_height = Math.min(window.innerHeight, 720);
  // canvasElement.height = min_height;
  // canvasElement.width = min_height * 16/9;

  // var min_width = Math.min(window.innerWidth, 1280);
  // canvasElement.width = min_width;
  // canvasElement.height = min_width * 9 / 16;
}

function onResults(results) {

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height); // draw camera image
  
  // draw wall image
  // https://stackoverflow.com/questions/23104582/scaling-an-image-to-fit-on-canvas
  const wall = new Image();
  wall.src = 'static/img/h1.png';
  canvasCtx.drawImage(wall, 0, 0, wall.width, wall.height,           // source rectangle
    0, 0, canvasElement.width, canvasElement.height); // destination rectangle);

  // draw hand skeleton
  if (results.multiHandLandmarks) {
    if(results.multiHandLandmarks.length != 0){ 
      var fittedNum = 0;
      for( let i = 0; i < 21; i++){
        if(results.multiHandLandmarks[0][i].x >= 0 && results.multiHandLandmarks[0][i].x <= 1){
          if(results.multiHandLandmarks[0][i].y >= 0 && results.multiHandLandmarks[0][i].y <= 1){
            if(checkTransparent(wall.src,results.multiHandLandmarks[0][i].x, results.multiHandLandmarks[0][i].y)){
              fittedNum++;
            }
          }
        }
      }
      console.log(fittedNum);
    }
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
        { color: '#00FF00', lineWidth: 5 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
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
  maxNumHands: 2,
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
  const img = new Image();
  img.src = scr;
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
  var pixelData = canvas.getContext('2d').getImageData(x*img.width, y*img.height, 1, 1).data;
  if (pixelData[3] != 255){
    return true;
  }else{
    return false;
  }
  
}