 import { sleep } from 'k6';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from 'k6/data';
import { logIn, logInUser } from './shared/login.js';
import { addCase1Item1 } from './test-scenarios/scenario-1-addCase1Item1.js';
import { addCase2Item2 } from './test-scenarios/scenario-2-addCase2Item2.js';
import { addCase3Item3 } from './test-scenarios/scenario-3-addCase3Item3.js';
import { caseSearch } from './test-scenarios/scenario-4-caseSearch.js';
import { itemSearch } from './test-scenarios/scenario-5-itemSearch.js';
import { peopleSearch } from './test-scenarios/scenario-6-peopleSearch.js';
import { userSearch } from './test-scenarios/scenario-7-userSearch.js';
import { checkInSearch } from './test-scenarios/scenario-8-checkInSearch.js';
import { checkOutSearch } from './test-scenarios/scenario-9-checkoutSearch.js';
import { disposalSearch } from './test-scenarios/scenario-11-disposalSearch.js';
import { transferSearch } from './test-scenarios/scenario-12-transferSearch.js';
import { moveSearch } from './test-scenarios/scenario-13-movesSearch.js';
import { notesSearch } from './test-scenarios/scenario-14-notesSearch.js';
import { taskSearch } from './test-scenarios/scenario-15-taskSearch.js';
import { mediaSearch } from './test-scenarios/scenario-16-mediaSearch.js';
import { getItemsByBarcode } from './test-scenarios/scenario-17-getitemsByBarcode.js';
import { createAndUpdateLocation } from './test-scenarios/scenario-18-createAndUpdateLocation.js';
import { getDashboardAndWidgets } from './test-scenarios/getDashboardAndWidgets.js';
import { settings } from './shared/settings.js';

//How many users and for how long should run this script
export let options = {
    vus: 2,           // How many VUs (virtual users)
    duration: '120s',  // How long does the test run
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
    
    // sleep(1);
    // getDashboardAndWidgets(__VU, token);

    // sleep(1);    
    // addCase1Item1(__VU, token );

    // sleep(1);
    // addCase2Item2(__VU, token);

    // sleep(1);
    // addCase3Item3(__VU, token);

    // sleep(1);
    // caseSearch(__VU, token);

    // sleep(1);
    // itemSearch(__VU, token);

    // sleep(1);
    // peopleSearch(__VU, token);

    // sleep(1);
    // userSearch(__VU, token);

    // sleep(1);
    // checkInSearch(__VU, token);

    // sleep(1);
    // checkOutSearch(__VU, token);

    // sleep(1);
    // disposalSearch(__VU, token);

    // sleep(1);
    // transferSearch(__VU, token);

    // sleep(1);
    // moveSearch(__VU, token);

    // sleep(1);
    // notesSearch(__VU, token);

    // sleep(1);
    // taskSearch(__VU, token);

    // sleep(1);
    // mediaSearch(__VU, token);

    // sleep(1);
    // getItemsByBarcode(__VU, token);

    // sleep(1);
    // createAndUpdateLocation(__VU, token);

    // sleep(1);
}
