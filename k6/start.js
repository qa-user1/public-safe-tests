import { sleep } from 'k6';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from 'k6/data';
import { logIn } from './helpers/login.js';
import { runScenario1 } from './test-scenarios/scenario-1.js';
import { runScenario2 } from './test-scenarios/scenario-2-searching.js';
import { settings } from './shared/settings.js'
// How many users and for how long should run this script
export let options = {
    vus: 2,           // How many VUs (virtual users)
    duration: '7s',  // How long does the test run
};


// Global variables
let token = {   // Will be used for all requests
    access: '',
    refresh: ''
};

// These functions will run one time:
// Load CSV file with user credentials
const csvData = new SharedArray("parsed credentials", function () {
    return papaparse.parse(open('./users-credentials.csv'), { header: true }).data;    
});


// This function will run as many times as fit in "duration"
export default function () {

    console.log(`Virtual User ${__VU}:`);

    logIn(__VU, token);
    
    sleep(1);
    
    runScenario1(__VU, token, settings.baseUrl );

    sleep(1);

    runScenario2(__VU, token);

    sleep(1);
}
