import { sleep } from 'k6';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from 'k6/data';
import { logIn, logInUser, logInLocal } from './helpers/login.js';
import { caseSearch } from './tests-secure/scenario-4-caseSearch.js';
import { itemSearch } from './tests-secure/scenario-5-itemSearch.js';
import { peopleSearch } from './tests-secure/scenario-6-peopleSearch.js';
import { userSearch } from './tests-secure/scenario-7-userSearch.js';
import { checkInSearch } from './tests-secure/scenario-8-checkInSearch.js';
import { checkOutSearch } from './tests-secure/scenario-9-checkoutSearch.js';
import { disposalSearch } from './tests-secure/scenario-11-disposalSearch.js';
import { transferSearch } from './test-scenarios/scenario-12-transferSearch.js';
import { moveSearch } from './test-scenarios/scenario-13-movesSearch.js';
import { notesSearch } from './test-scenarios/scenario-14-notesSearch.js';
import { taskSearch } from './test-scenarios/scenario-15-taskSearch.js';
import { mediaSearch } from './tests-secure/scenario-16-mediaSearch.js';
import { getItemsByBarcode } from './tests-secure/scenario-17-getItemsByBarcode.js';

import { getDashboardAndWidgets } from './tests-secure/getDashboardAndWidgets.js';
import { settings } from './settings.js';
import { Trend } from 'k6/metrics';
import { threadPool  } from './tests-secure/threadPool.js';
//export let caseSearchTime = new Trend('case_search_time');
//export let loginTime = new Trend('login_time');

//How many users and for how long should run this script
export let options = {
    vus: 1,           // How many VUs (virtual users)
    duration: '20s',  // How long does the test run
}; 
 
// Global variables
let token = {   // Will be used for all requests
    access: '',
    refresh: ''
};

// These functions will run one time:
// Load CSV file with user credentials
const csvData = new SharedArray("parsed credentials", function () {
    return papaparse.parse(open('./users-credentials-secure.csv'), { header: true }).data;
});



// This function will run as many times as fit in "duration"
export default function () {

    console.log(`Virtual User ${__VU}:`);
    logInLocal(__VU, token);
    
    // // sleep(1);
    // getDashboardAndWidgets(__VU, token);

    sleep(2);
    //caseSearch(__VU, token);
    //sleep(1);
    //threadPool(__VU, token);
    
    // // sleep(1);
    // itemSearch(__VU, token);

    // // sleep(1);
    // peopleSearch(__VU, token);

    // // sleep(1);
    // userSearch(__VU, token);

    // // sleep(1);
    // checkInSearch(__VU, token);

    // // sleep(1);
    // checkOutSearch(__VU, token);

    // // sleep(1);
    // disposalSearch(__VU, token);

    // // sleep(1);
    // // transferSearch(__VU, token);

    // // sleep(1);
    // // moveSearch(__VU, token);

    // // sleep(1);
    // // notesSearch(__VU, token);

    // // sleep(1);
    // // taskSearch(__VU, token);

    // // sleep(1);
    // mediaSearch(__VU, token);

    // // sleep(1);
    // getItemsByBarcode(__VU, token);

    // sleep(1);
}
