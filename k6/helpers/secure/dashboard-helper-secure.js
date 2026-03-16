import http from 'k6/http';
import {settings} from '../../shared/settings.js';
import {getHeaders} from '../../shared/header-gen.js';

export function GetDashboard(virtualUserIndex, token) {

    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    let response = http.get(`${settings.baseUrl}/api/dashboards`, {headers: httpHeaders});
    let responseBody = JSON.parse(response.body);

    if (response.status === 200) {
        console.log(`Retrieved Dashboard for ${virtualUserIndex}, response time(ms): ${response.timings.duration}`);
    } else {
        console.error(`ERROR retrieving dashboard` + JSON.stringify(responseBody))
    }
}

export function GetMyDataWidgets(virtualUserIndex, token) {
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    let response = http.get(`${settings.baseUrl}/api/charts/getMyDataWidgets`, {headers: httpHeaders});
    let responseBody = JSON.parse(response.body);

    if (response.status === 200) {
        console.log(`Retrieved my data widgets for ${virtualUserIndex}, response time(ms): ${response.timings.duration}`);
    } else {
        console.error(`ERROR retrieving my data widgets` + JSON.stringify(responseBody))
    }

}

export function GetItemsByCategoryOrg(virtualUserIndex, token) {

    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);

    let response = http.get(`${settings.baseUrl}/api/charts/GetItemsByCategory?recalculateChart=true`, {headers: httpHeaders});
    let responseBody = JSON.parse(response.body);

    if (response.status === 200) {
        console.log(`GetItemsByCategory for Org ${virtualUserIndex}, response time(ms): ${response.timings.duration}`);
    } else {
        console.error(`ERROR GetItemsByCategory for Org` + JSON.stringify(responseBody))
    }

}


export function GetItemsByCategoryUser(virtualUserIndex, token) {

    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);

    let response = http.get(`${settings.baseUrl}/api/charts/GetItemsByCategory?recalculateChart=true&userId=12659`, {headers: httpHeaders});
    let responseBody = JSON.parse(response.body);

    if (response.status === 200) {
        console.log(`GetItemsByCategory for User for ${virtualUserIndex}, response time(ms): ${response.timings.duration}`);
    } else {
        console.error(`ERROR GetItemsByCategory for user` + JSON.stringify(responseBody))
    }

    return responseBody;
}

export function GetInAndDisposedItems(virtualUserIndex, token) {

    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    let response = http.get(`${settings.baseUrl}/api/charts/GetInAndDisposedItems?clientDate=2021-06-25T17:33:25.997Z&clientTimeZone=America%2FNew_York&recalculateChart=true`, 
        {headers: httpHeaders});
    let responseBody = JSON.parse(response.body);

    if (response.status === 200) {
        console.log(`Get In and Disposed Items for User for ${virtualUserIndex}, response time(ms): ${response.timings.duration}`);
    } else {
        console.error(`ERROR GetItemsByCategory for user` + JSON.stringify(responseBody))
    }

    return responseBody;
}

export function GetNewItems(virtualUserIndex, token) {

    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);

    let response = http.get(`${settings.baseUrl}/api/charts/GetNewItems?clientDate=2021-06-25T17:33:25.998Z&clientTimeZone=America%2FNew_York&recalculateChart=true&userId=12659`, 
        {headers: httpHeaders});
    let responseBody = JSON.parse(response.body);

    if (response.status === 200) {
        console.log(`Get New Items User for User for ${virtualUserIndex}, response time(ms): ${response.timings.duration}`);
    } else {
        console.error(`ERROR GetItemsByCategory for user` + JSON.stringify(responseBody))
    }

    return responseBody;
}

export function GetItemsByStatus(virtualUserIndex, token) {

    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);

    let response = http.get(`${settings.baseUrl}/api/charts/GetItemsByStatus?recalculateChart=true`, 
        {headers: httpHeaders});
    let responseBody = JSON.parse(response.body);

    if (response.status === 200) {
        console.log(`Get Item Byu Status org for ${virtualUserIndex}, response time(ms): ${response.timings.duration}`);
    } else {
        console.error(`ERROR Get Items By Status for org` + JSON.stringify(responseBody))
    }

    return responseBody;
}


export function GetItemsByStatusUser(virtualUserIndex, token) {

    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);

    let response = http.get(`${settings.baseUrl}/api/charts/GetItemsByStatus?recalculateChart=true&userId=12659`, 
        {headers: httpHeaders});
    let responseBody = JSON.parse(response.body);

    if (response.status === 200) {
        console.log(`Get Item By Status for User for ${virtualUserIndex}, response time(ms): ${response.timings.duration}`);
    } else {
        console.error(`ERROR Get Items By Status for user` + JSON.stringify(responseBody))
    }

    return responseBody;
}

export function GetStatsCalcBulk(virtualUserIndex, token) {

    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);

    let httpBody = JSON.stringify(
        [
            {
              "id": 372,
              "title": "All Items Last 365 Days",
              "field": {
                "formId": 0,
                "name": "SubmittedById"
              },
              "functionId": 0,
              "formatId": 0,
              "savedSearchId": 94167,
              "selectedOfficesIds": [
                1181
              ],
              "clientDate": "2021-06-26T10:50:58.879Z",
              "clientTz": "America/New_York",
              "timezoneOffset": 240
            },
            {
              "id": 373,
              "title": "All Items Last 30 Days",
              "field": {
                "formId": 0,
                "name": "SubmittedById"
              },
              "functionId": 0,
              "formatId": 0,
              "savedSearchId": 94168,
              "selectedOfficesIds": [
               1181
              ],
              "clientDate": "2021-06-26T10:50:58.879Z",
              "clientTz": "America/New_York",
              "timezoneOffset": 240
            },
            {
              "id": 374,
              "title": "All Checked In Items Count",
              "field": {
                "formId": 0,
                "name": "SubmittedById"
              },
              "functionId": 0,
              "formatId": 0,
              "savedSearchId": 94169,
              "selectedOfficesIds": [
                1
              ],
              "clientDate": "2021-06-26T10:50:58.879Z",
              "clientTz": "America/New_York",
              "timezoneOffset": 240
            },
            {
              "id": 375,
              "title": "All Checked Out Items Count",
              "field": {
                "formId": 0,
                "name": "SubmittedById"
              },
              "functionId": 0,
              "formatId": 0,
              "savedSearchId": 94170,
              "selectedOfficesIds": [
                1
              ],
              "clientDate": "2021-06-26T10:50:58.879Z",
              "clientTz": "America/New_York",
              "timezoneOffset": 240
            },
            {
              "id": 376,
              "title": "All Disposed Items Count",
              "field": {
                "formId": 0,
                "name": "SubmittedById"
              },
              "functionId": 0,
              "formatId": 0,
              "savedSearchId": 94171,
              "selectedOfficesIds": [
                1
              ],
              "clientDate": "2021-06-26T10:50:58.879Z",
              "clientTz": "America/New_York",
              "timezoneOffset": 240
            },
            {
              "id": 377,
              "title": "All Cases Count",
              "field": {
                "formId": 0,
                "name": "CreatorId"
              },
              "functionId": 0,
              "formatId": 0,
              "savedSearchId": 94172,
              "clientDate": "2021-06-26T10:50:58.879Z",
              "clientTz": "America/New_York",
              "timezoneOffset": 240
            },
            {
              "id": 378,
              "title": "All Cases Last 365 Days Count",
              "field": {
                "formId": 0,
                "name": "CreatorId"
              },
              "functionId": 0,
              "formatId": 0,
              "savedSearchId": 94173,
              "clientDate": "2021-06-26T10:50:58.879Z",
              "clientTz": "America/New_York",
              "timezoneOffset": 240
            },
            {
              "id": 379,
              "title": "All Items Count",
              "field": {
                "formId": 0,
                "name": "SubmittedById"
              },
              "functionId": 0,
              "formatId": 0,
              "savedSearchId": 94174,
              "selectedOfficesIds": [
                1
              ],
              "clientDate": "2021-06-26T10:50:58.879Z",
              "clientTz": "America/New_York",
              "timezoneOffset": 240
            }
          ]
    );

    let response = http.post(`${settings.baseUrl}/api/dashboards/statisticsBulk?searchCache=false`, httpBody,
        {headers: httpHeaders});
    let responseBody = JSON.parse(response.body);

    if (response.status === 200) {
        console.log(`Get Stats Calc bulk user : ${virtualUserIndex}, response time(ms): ${response.timings.duration}`);
    } else {
        console.error(`ERROR Get Stats Calc bulk user :${virtualUserIndex} ` + JSON.stringify(responseBody))
    }

    return responseBody;
}
