let time;
let timer_started = false;
let update_location = '';
let timer_link;

// initialize the timer
// duration is the duration of timer (int), id is the id of the location (string)
export function initialize_timer(duration,id){
    time = duration;
    update_location  = document.getElementById(id);
    update_timer();
}

// start the timer
export function start_timer(){
    update_timer();
    if(time >= 0){
        timer_link = setInterval(count_down ,1000);
        timer_started = true;
    }
}

// stop the timer
export function stop_timer(){
    clearInterval(timer_link);
    timer_started = false;
}

// return if the timer is started
export function check_start_timer(){
    return timer_started;
}

// return the remaining duration
// return -1 if the  timer has not initialized
export function check_time_remain(){
    if(update_location == ''){
        return -1;
    }else{
        return time;
    }
}

// return if the timer is up or not.
export function check_game_ended(){
    if(update_location != ''){
        if(time == 0){
            return true;
        }
    }
    return false;
    
}

// function to count down
function count_down() {
    if(timer_started && time > 0){
        time = time - 1;
    }

    update_timer();

    if(time == 0){
      clearInterval(timer_link);
      timer_started = false;
    }
  }
  
// function to update the html gile
function update_timer(){
    update_location.innerHTML = 'Time remain: ' + time +'s';
}