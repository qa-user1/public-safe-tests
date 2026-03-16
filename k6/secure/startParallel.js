import { sleep } from 'k6';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from 'k6/data';
import { logIn } from '../shared/login.js';
import { viewCase } from '../shared/case-view.js';
import { viewItem } from '../shared/item-view.js';
import { viewPerson } from '../shared/person-view.js';
import Searches from '../helpers/secure/secure-search-helper.js';

//How many users and for how long should run this script
export let options = {
    vus: 30,           // How many VUs (virtual users)
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
    return papaparse.parse(open('./users-credentials-secure.csv'), { header: true }).data;
});



// This function will run as many times as fit in "duration"
export default function () {
    console.log(`Virtual User ${__VU}:`);
    logIn(__VU, token);   
    sleep(1);

    Searches.searchCases(__VU, token);
    sleep(1);

    Searches.searchItems(__VU, token);
    sleep(1);

    Searches.searchPeople(__VU, token);
    sleep(1);

    viewCase();
    sleep(1);

    viewItem();
    sleep(1);

    viewPerson();
    sleep(1);
   
    Searches.searchUsers(__VU, token);
    sleep(1)

    //getDashboardAndWidgets(__VU, token);
    // sleep(1);
}
