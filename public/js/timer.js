let time;
let timer_started = false;
let update_location = '';
let timer_link;

export function initialize_timer(duration,id){
    time = duration;
    update_location  = document.getElementById(id);
    update_timer();
}

export function start_timer(){
    update_timer();
    if(time >= 0){
        timer_link = setInterval(count_down ,1000);
        timer_started = true;
    }
}
  
export function stop_timer(){
    clearInterval(timer_link);
    timer_started = false;
}

export function check_start_timer(){
    return timer_started;
}

export function check_time_remain(){
    if(update_location == ''){
        return -1;
    }else{
        return time;
    }
}
  
function count_down() {
    if(timer_started && time > 0)
        time = time - 1;

    update_timer();
    console.log("Timer:"+time);

    if(time == 0){
      console.log("end");
      clearInterval(timer_link);
      timer_started = false;
    }
  }
  
function update_timer(){
    update_location.innerHTML = 'Time remain: ' + time +'s';
}