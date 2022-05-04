/**
 * timer: This file contains functions that act as a timer and display the timer at the inputted location.
 * 
 * Author: Ho Hong Pan
 * 
 * Version 1: Written 8 April 2022
 * 
 * function:
 *  initialize_timer(duration, id)  : Initialize the timer with the duration and the location of the timer.
 *  start_timer()                   : Start the countdown of the timer.
 *  stop_timer()                    : Stop the countdown of the timer.
 *  check_start_timer()             : Return if the timer has started or not.
 *  check_time_remain()             : Return the remaining time.
 *  check_game_ended()              : Return if the countdown has ended or not.
 *  count_down()                    : Countdowning the timer.
 *  update_timer()                  : Update the timer in the location.
 */


let time; // store the remaining time (int)
let timer_started = false; // store if the timer has started (boolean)
let update_location = ''; // store the location the timer will display (string)
let timer_link; // store the link for the timer (pointer)

// initialize the timer
// duration is the duration of timer (int), id is the id of the location (string)

function initialize_timer(duration, id) {
    time = duration;
    update_location = document.getElementById(id);
    update_timer();
}

// start the timer

function start_timer() {

    update_timer();
    if (time >= 0) {
        timer_link = setInterval(count_down, 1000);
        timer_started = true;
    }
}

// stop the timer

function stop_timer() {

    clearInterval(timer_link);
    timer_started = false;
}

// return if the timer is started

function check_start_timer() {

    return timer_started;
}

// return the remaining duration
// return -1 if the  timer has not initialized

function check_time_remain() {
    if (update_location == '') {
        return -1;
    } else {
        return time;
    }
}

// return if the timer is up or not.

function check_game_ended() {
    if (update_location != '') {
        if (time == 0) {
            return true;
        }
    }
    return false;

}

// function to count down
function count_down() {
    if (timer_started && time > 0) {
        time = time - 1;
    }

    update_timer();

    if (time == 0) {
        clearInterval(timer_link);
        timer_started = false;
    }
}

// function to update the html gile
function update_timer() {
    update_location.innerHTML = 'Time remain: ' + time + 's';
}