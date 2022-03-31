

function buttonAvailable(){
    buttonElement.innerHTML = "Play!";
    buttonElement.disabled = false;
}

buttonElement.addEventListener('click', () => {
    ruleElement.style.display = "none";
    cameraElement.style.display = "block";
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
    start_timer();
});