// rule page
const ruleElement = document.getElementsByClassName('rule')[0];
const buttonElement = ruleElement.getElementsByClassName('play_button')[0];
const cameraElement = document.getElementsByClassName('camera')[0];

const canvasElement = document.getElementsByClassName('output_canvas')[0];
const displayElement = document.getElementsByClassName('display')[0];

//game page
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasCtx = canvasElement.getContext('2d');

const hand_too_far_warning = document.getElementsByClassName('hand_too_far_warning')[0];


//leader board page
const lboardElement = document.getElementById("lboard");
const play_scoreElement = document.getElementsByClassName("play_score")[0];
const replay_return_buttonElement = lboardElement.getElementsByClassName("replay_return_button")[0];

const replay_buttonElement = document.getElementById("replay_button");
const return_buttonElement = document.getElementById("return_button");
