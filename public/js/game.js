const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

window.onload = function () {
  if (window.innerWidth > window.innerHeight) {
    canvasElement.width = window.innerHeight;
    canvasElement.height = window.innerHeight;
  }
  else {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerWidth;
  }
}

window.onresize = function () {
  if (window.innerWidth > window.innerHeight) {
    canvasElement.width = window.innerHeight;
    canvasElement.height = window.innerHeight;
  }
  else {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerWidth;
  }
}

function onResults(results) {

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
        { color: '#00FF00', lineWidth: 5 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
    }
  }
  // https://stackoverflow.com/questions/23104582/scaling-an-image-to-fit-on-canvas
  const wall = new Image();
  wall.src = 'static/img/h4.png';
  canvasCtx.drawImage(wall, 0, 0, wall.width, wall.height,           // source rectangle
    0, 0, canvasElement.width, canvasElement.height); // destination rectangle);

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