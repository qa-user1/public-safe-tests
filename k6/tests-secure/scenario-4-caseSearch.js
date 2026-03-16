import http from 'k6/http';
import { settings } from '../settings.js';
import { getHeaders } from '../shared/header-gen.js';
import { caseSearchTime } from '../shared/trend-data.js';

export function caseSearch(virtualUserIndex, token) {

  let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
  let httpBody = JSON.stringify({
      "tags": [

      ],
      "IsSearchingInSublocations": false,
      "DynamicFields": [

      ],
      "StaticFields": [
        {
          "name": "GENERAL.CREATED_DATE",
          "typeId": 2,
          "fieldName": "CreatedDate",
          "searchCriteriasType": 2,
          "searchCriterias": [
          ],
          "searchCriteria": 12,
          "model": 100,
          "toDate": "2021-06-25T04:00:00.000Z"
        },
        {
          "name": "NAV.TAGS",
          "typeId": 5,
          "fieldName": "Tags",
          "searchCriteriasType": 7,
          "typeAheadTemplate": "<tp-multi-tag-typeahead field=\"field\" tp-model=\"field.model\"></tp-multi-tag-typeahead>",
          "searchCriterias": [
          ],
          "searchCriteria": 0,
          "model": "tags"
        },
        {
          "name": "SEARCH.OFFICE_SELECTION",
          "typeId": 7,
          "fieldName": "OfficeSelection",
          "searchCriteriasType": 5,
          "dropdownEntities": {
            "entity": "offices"
          },
          "searchCriterias": [
            {
              "id": 0,
              "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"
            }
          ],
          "selectedOffices": [
          ],
          "model": [
          ],
          "searchCriteria": 0
        }
      ],
      "officeIds": [
        1316,
        1229,
        504,
        231,
        1,
        1364,
        1365,
        385,
        911,
        1359,
        1366
      ],
      "orderBy": "Active",
      "orderByAsc": false,
      "thenOrderBy": "",
      "thenOrderByAsc": false,
      "PageSize": 100,
      "peopleIds": [

      ],
      "PageNumber": 1,
      "clientDate": "2021-06-25T21:10:02.741Z",
      "clientTz": "America/New_York",
      "timezoneOffset": 240,
      "SavedSearchEntities": [
        {
          "name": "SEARCH.SAVED_SEARCH.ITEMS",
          "typeId": 3,
          "fieldName": "SavedSearchId_items",
          "searchCriteriasType": 5,
          "dropdownEntities": {
            "entity": "SavedSearches",
            "options": {
              "model": "items"
            }
          },
          "searchCriterias": [
            {
              "id": 0,
              "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"
            }
          ],
          "dropdownValues": [
          ],
          "searchCriteria": 0
        }
      ]
    });

  var response = http.post(`${settings.baseUrl}/api/cases/search`, httpBody, { headers: httpHeaders });

  if (response.status === 200) {
    var searchResults = JSON.parse(response.body);
    console.log(`Cases Search - cases found : ${searchResults.count}, response time(ms): ${response.timings.duration}`);
    caseSearchTime.add(response.timings.duration);

  } else {
    console.log(`ERROR searching cases res: ${response.body}`);
  }
}
