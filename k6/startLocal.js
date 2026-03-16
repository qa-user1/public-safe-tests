import { sleep } from 'k6';
import { logInLocal } from './helpers/login.js';
import { threadPool } from './tests-secure/threadPool.js';
//How many users and for how long should run this script
export let options = {
    vus: 1,           // How many VUs (virtual users)
    duration: '30s',  // How long does the test run
}; 
 
// Global variables
let token = {   // Will be used for all requests
    access: '',
    refresh: ''
};

// This function will run as many times as fit in "duration"
export default function () {

    console.log(`Virtual User ${__VU}:`);
    logInLocal(__VU, token);
    sleep(1);
    threadPool(__VU, token);
}

