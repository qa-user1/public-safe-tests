import http from 'k6/http';
import { settings } from '../../shared/settings.js';
import { getHeaders } from '../../shared/header-gen.js';
import { caseSearchTime, itemSearchTime, personSearchTime, userSearchTime } from '../../shared/trend-data.js';

export default{ 
  
  searchCases (virutalUserIndex, token) {

    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    let httpBody = JSON.stringify(
      {
        "caseOfficers":[
           
        ],
        "tags":[
           
        ],
        "IsSearchingInSublocations":false,
        "DynamicFields":[
           
        ],
        "StaticFields":[
           {
              "name":"CASE_OFFICERS",
              "typeId":5,
              "fieldName":"CaseOfficers",
              "searchCriteriasType":7,
              "typeAheadTemplate":"<tp-multi-users-and-groups-typeahead field=\"field\" name=\"usersAndGroups\" selected-items=\"field.model\" search-inactive=\"true\"></tp-multi-users-and-groups-typeahead>",
              "searchCriterias":[
                 {
                    "id":0,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"
                 },
                 {
                    "id":26,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
                 },
                 {
                    "id":1,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"
                 }
              ],
              "isCurrentUserSelected":false,
              "searchCriteria":0,
              "model":{
                 "items":[
                    
                 ]
              }
           },
           {
              "name":"CASE_OFFENSE_TYPE",
              "typeId":3,
              "fieldName":"OffenseTypeId",
              "searchCriteriasType":1,
              "dropdownEntities":{
                 "entity":"offenseTypes",
                 "options":{
                    "belongToOrganization":true
                 }
              },
              "searchCriterias":[
                 {
                    "id":0,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS"
                 },
                 {
                    "id":1,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"
                 }
              ],
              "dropdownValues":[
                 {
                    "id":null,
                    "name":"Select all"
                 },
                 {
                    "id":1282,
                    "name":"Abandoned Property"
                 },
                 {
                    "id":1212,
                    "name":"Abduction"
                 },
                 {
                    "id":270,
                    "name":"Accident PI"
                 },
                 {
                    "id":273,
                    "name":"Alarm - Burglar/Facility"
                 },
                 {
                    "id":74,
                    "name":"Alcohol Related"
                 },
                 {
                    "id":1319,
                    "name":"Ammo Destruction"
                 },
                 {
                    "id":1210,
                    "name":"Animal Case"
                 },
                 {
                    "id":2,
                    "name":"Arson"
                 },
                 {
                    "id":3,
                    "name":"Assault"
                 },
                 {
                    "id":146,
                    "name":"Assist Other Agency"
                 },
                 {
                    "id":348,
                    "name":"Automobile Offense"
                 },
                 {
                    "id":1364,
                    "name":"Bb Gun/ Air Soft Violation"
                 },
                 {
                    "id":276,
                    "name":"Bomb"
                 },
                 {
                    "id":178,
                    "name":"Bomb Threat"
                 },
                 {
                    "id":4,
                    "name":"Burglary"
                 },
                 {
                    "id":1190,
                    "name":"Burglary - Building"
                 },
                 {
                    "id":278,
                    "name":"Check Welfare"
                 },
                 {
                    "id":5,
                    "name":"Child Abuse"
                 },
                 {
                    "id":216,
                    "name":"Child Abuse - Physical"
                 },
                 {
                    "id":215,
                    "name":"Child Abuse - Sexual"
                 },
                 {
                    "id":1296,
                    "name":"Child Abuse / Child Neglect"
                 },
                 {
                    "id":406,
                    "name":"Code / Ordinance Violation"
                 },
                 {
                    "id":111,
                    "name":"Crash / Accident"
                 },
                 {
                    "id":140,
                    "name":"Criminal Damage"
                 },
                 {
                    "id":8,
                    "name":"Criminal Mischief"
                 },
                 {
                    "id":281,
                    "name":"Damage To Property"
                 },
                 {
                    "id":283,
                    "name":"Dangerous Conditions"
                 },
                 {
                    "id":38,
                    "name":"Death Investigation"
                 },
                 {
                    "id":122,
                    "name":"Death Investigation - Accidental"
                 },
                 {
                    "id":123,
                    "name":"Death Investigation - Natural"
                 },
                 {
                    "id":124,
                    "name":"Death Investigation - Undetermined"
                 },
                 {
                    "id":231,
                    "name":"Decommissioned Project"
                 },
                 {
                    "id":266,
                    "name":"Destruction To Property"
                 },
                 {
                    "id":9,
                    "name":"Disorderly Conduct"
                 },
                 {
                    "id":1238,
                    "name":"Domestic Dispute"
                 },
                 {
                    "id":286,
                    "name":"Domestic Situation"
                 },
                 {
                    "id":10,
                    "name":"Domestic Violence"
                 },
                 {
                    "id":148,
                    "name":"Drug Drop Box"
                 },
                 {
                    "id":11,
                    "name":"Drug Offense"
                 },
                 {
                    "id":82,
                    "name":"DUI/DWI"
                 },
                 {
                    "id":101,
                    "name":"E - Discovery"
                 },
                 {
                    "id":1240,
                    "name":"E-Cigarette"
                 },
                 {
                    "id":363,
                    "name":"Electrical"
                 },
                 {
                    "id":1262,
                    "name":"Equipment Failure"
                 },
                 {
                    "id":192,
                    "name":"Explosion"
                 },
                 {
                    "id":154,
                    "name":"Explosives"
                 },
                 {
                    "id":1198,
                    "name":"Extreme Risk Protective Order"
                 },
                 {
                    "id":343,
                    "name":"False Report/Information"
                 },
                 {
                    "id":183,
                    "name":"Fire"
                 },
                 {
                    "id":364,
                    "name":"Fire / Explosions"
                 },
                 {
                    "id":239,
                    "name":"Fire Other"
                 },
                 {
                    "id":237,
                    "name":"Fire Structure"
                 },
                 {
                    "id":238,
                    "name":"Fire Vehicle"
                 },
                 {
                    "id":236,
                    "name":"Fire Wildland"
                 },
                 {
                    "id":225,
                    "name":"Firearm"
                 },
                 {
                    "id":352,
                    "name":"Firearms Offense"
                 },
                 {
                    "id":235,
                    "name":"Fireworks Seizure"
                 },
                 {
                    "id":353,
                    "name":"Fleeing And Eluding"
                 },
                 {
                    "id":100,
                    "name":"Forensic Accounting"
                 },
                 {
                    "id":1215,
                    "name":"Forensic Interview"
                 },
                 {
                    "id":35,
                    "name":"Forensic Investigation"
                 },
                 {
                    "id":14,
                    "name":"Forgery"
                 },
                 {
                    "id":115,
                    "name":"Forgery / Uttering"
                 },
                 {
                    "id":15,
                    "name":"Found Property"
                 },
                 {
                    "id":16,
                    "name":"Fraud"
                 },
                 {
                    "id":408,
                    "name":"Fraud / Forgery"
                 },
                 {
                    "id":142,
                    "name":"Gambling"
                 },
                 {
                    "id":293,
                    "name":"Graffiti"
                 },
                 {
                    "id":17,
                    "name":"Harassment"
                 },
                 {
                    "id":1253,
                    "name":"Home Invasion"
                 },
                 {
                    "id":20,
                    "name":"Homicide / Murder"
                 },
                 {
                    "id":259,
                    "name":"Internal Affairs"
                 },
                 {
                    "id":32,
                    "name":"Investigation"
                 },
                 {
                    "id":297,
                    "name":"Juvenile"
                 },
                 {
                    "id":151,
                    "name":"Larceny"
                 },
                 {
                    "id":1266,
                    "name":"Lightning"
                 },
                 {
                    "id":147,
                    "name":"Littering / Dumping"
                 },
                 {
                    "id":176,
                    "name":"Loitering / Prowling"
                 },
                 {
                    "id":1295,
                    "name":"Mentally Unstable / Emergency Petition"
                 },
                 {
                    "id":341,
                    "name":"Minor In Possession (Mip)"
                 },
                 {
                    "id":303,
                    "name":"Missing Person"
                 },
                 {
                    "id":1,
                    "name":"Other"
                 },
                 {
                    "id":143,
                    "name":"Overdose"
                 },
                 {
                    "id":222,
                    "name":"Police Information"
                 },
                 {
                    "id":315,
                    "name":"Prostitution"
                 },
                 {
                    "id":345,
                    "name":"Rape"
                 },
                 {
                    "id":349,
                    "name":"Recovered Property"
                 },
                 {
                    "id":23,
                    "name":"Robbery"
                 },
                 {
                    "id":1231,
                    "name":"Sex Offense"
                 },
                 {
                    "id":24,
                    "name":"Sexual Assault"
                 },
                 {
                    "id":250,
                    "name":"Solicitation"
                 },
                 {
                    "id":339,
                    "name":"Stolen Property Offense"
                 },
                 {
                    "id":346,
                    "name":"Suicide/Attempted Suicide"
                 },
                 {
                    "id":79,
                    "name":"Suspicious Activity"
                 },
                 {
                    "id":347,
                    "name":"Tampering"
                 },
                 {
                    "id":27,
                    "name":"Theft"
                 },
                 {
                    "id":163,
                    "name":"Traffic Accident"
                 },
                 {
                    "id":1232,
                    "name":"Traffic Violation"
                 },
                 {
                    "id":78,
                    "name":"Trespass"
                 },
                 {
                    "id":332,
                    "name":"Vehicle Theft"
                 },
                 {
                    "id":208,
                    "name":"Violation Of Protective Order"
                 },
                 {
                    "id":73,
                    "name":"Weapons Charge"
                 },
                 {
                    "id":413,
                    "name":"Weapons Offense"
                 }
              ],
              "searchCriteria":0,
              "model":3
           },
           {
              "name":"SEARCH.OFFICE_SELECTION",
              "typeId":7,
              "fieldName":"OfficeSelection",
              "searchCriteriasType":5,
              "dropdownEntities":{
                 "entity":"offices"
              },
              "searchCriterias":[
                 {
                    "id":0,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS"
                 }
              ],
               "selectedOffices": [
                   {
                       "id": 11081,
                       "name": "Web Test Automation #1 - Cypress Office 1",
                       "selected": true
                   },
               ],
              "model":[
                 {
                    "id":1669,
                    "name":"Tracker Products - cath - phone numbers",
                    "selected":true
                 },
                 {
                    "id":1229,
                    "name":"Tracker Products - CatherineTestOffice",
                    "selected":true
                 },
                 {
                    "id":504,
                    "name":"Tracker Products - DEA Drug Task Force",
                    "selected":true
                 },
                 {
                    "id":231,
                    "name":"Tracker Products - Drug Task Force",
                    "selected":true
                 },
                 {
                    "id":1,
                    "name":"Tracker Products - Evidence Unit",
                    "selected":true
                 },
                 {
                    "id":385,
                    "name":"Tracker Products - Internal Affairs",
                    "selected":true
                 },
                 {
                    "id":911,
                    "name":"Tracker Products - Lower Cletusville PD",
                    "selected":true
                 },
                 {
                    "id":1670,
                    "name":"Tracker Products - new/cat",
                    "selected":true
                 },
                 {
                    "id":1621,
                    "name":"Tracker Products - Rio-office-A",
                    "selected":true
                 },
                 {
                    "id":1622,
                    "name":"Tracker Products - Rio-office-B",
                    "selected":true
                 }
              ],
              "searchCriteria":0
           }
        ],
        "officeIds":[
           1669,
           1229,
           504,
           231,
           1,
           385,
           911,
           1670,
           1621,
           1622
        ],
        "orderBy":"Active",
        "orderByAsc":false,
        "thenOrderBy":"",
        "thenOrderByAsc":false,
        "PageSize":25,
        "peopleIds":[
           
        ],
        "PageNumber":1,
        "clientDate":"2023-03-13T18:51:34.609Z",
        "clientTz":"America/New_York",
        "timezoneOffset":240,
        "SavedSearchEntities":[
           {
              "name":"SEARCH.SAVED_SEARCH.ITEMS",
              "typeId":3,
              "fieldName":"SavedSearchId_items",
              "searchCriteriasType":5,
              "dropdownEntities":{
                 "entity":"SavedSearches",
                 "options":{
                    "model":"items"
                 }
              },
              "searchCriterias":[
                 {
                    "id":0,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS"
                 }
              ],
              "dropdownValues":[
                 {
                    "id":null,
                    "name":"Select all"
                 },
                 {
                    "id":94167,
                    "name":"All Items Created in last 365 days"
                 },
                 {
                    "id":94168,
                    "name":"All Items Created Last 30 Days"
                 },
                 {
                    "id":94169,
                    "name":"All Checked In Items"
                 },
                 {
                    "id":94170,
                    "name":"All Checked Out Items"
                 },
                 {
                    "id":94171,
                    "name":"All Disposed Items"
                 },
                 {
                    "id":94174,
                    "name":"All Items"
                 },
                 {
                    "id":106537,
                    "name":"items- tag1"
                 }
              ],
              "searchCriteria":0
           }
        ]
     });

    var response = http.post(`${settings.baseUrl}/api/cases/search`, httpBody, { headers: httpHeaders });
    
    if (response.status === 200) {
        var searchResults = JSON.parse(response.body);
        console.log(`Cases Search - cases found : ${searchResults.count}, response time(ms): ${response.timings.duration}`);     
        caseSearchTime.add(response.timings.duration);
    } else {
      console.log(`ERROR searching cases `);
    }
  },

  searchItems (virutalUserIndex, token) {

    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);    
    let httpBody = JSON.stringify(
      {
        "caseOfficers":[
           
        ],
        "tags":[
           
        ],
        "IsSearchingInSublocations":false,
        "DynamicFields":[
           
        ],
        "StaticFields":[
           {
              "name":"ITEM_STATUS",
              "typeId":3,
              "fieldName":"StatusId",
              "searchCriteriasType":1,
              "dropdownEntities":{
                 "entity":"itemstatus",
                 "options":""
              },
              "searchCriterias":[
                 {
                    "id":0,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS"
                 },
                 {
                    "id":1,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"
                 }
              ],
              "dropdownValues":[
                 {
                    "id":null,
                    "name":"Select all"
                 },
                 {
                    "id":1,
                    "name":"Checked In"
                 },
                 {
                    "id":2,
                    "name":"Checked Out"
                 },
                 {
                    "id":3,
                    "name":"Disposed"
                 }
              ],
              "searchCriteria":0,
              "model":1
           },
           {
              "name":"NAV.TAGS",
              "typeId":5,
              "fieldName":"Tags",
              "searchCriteriasType":7,
              "typeAheadTemplate":"<tp-multi-tag-typeahead field=\"field\" tp-model=\"field.model\"></tp-multi-tag-typeahead>",
              "searchCriterias":[
                 {
                    "id":0,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"
                 },
                 {
                    "id":26,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
                 },
                 {
                    "id":1,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"
                 }
              ],
              "searchCriteria":0,
              "model":"tags"
           },
           {
              "name":"SEARCH.OFFICE_SELECTION",
              "typeId":7,
              "fieldName":"OfficeSelection",
              "searchCriteriasType":5,
              "dropdownEntities":{
                 "entity":"offices"
              },
              "searchCriterias":[
                 {
                    "id":0,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS"
                 }
              ],
              "selectedOffices":[
                 {
                    "id":1669,
                    "name":"Tracker Products - cath - phone numbers",
                    "selected":true
                 },
                 {
                    "id":1229,
                    "name":"Tracker Products - CatherineTestOffice",
                    "selected":true
                 },
                 {
                    "id":504,
                    "name":"Tracker Products - DEA Drug Task Force",
                    "selected":true
                 },
                 {
                    "id":231,
                    "name":"Tracker Products - Drug Task Force",
                    "selected":true
                 },
                 {
                    "id":1,
                    "name":"Tracker Products - Evidence Unit",
                    "selected":true
                 },
                 {
                    "id":385,
                    "name":"Tracker Products - Internal Affairs",
                    "selected":true
                 },
                 {
                    "id":911,
                    "name":"Tracker Products - Lower Cletusville PD",
                    "selected":true
                 },
                 {
                    "id":1670,
                    "name":"Tracker Products - new/cat",
                    "selected":true
                 },
                 {
                    "id":1621,
                    "name":"Tracker Products - Rio-office-A",
                    "selected":true
                 },
                 {
                    "id":1622,
                    "name":"Tracker Products - Rio-office-B",
                    "selected":true
                 }
              ],
              "model":[
                 {
                    "id":1669,
                    "name":"Tracker Products - cath - phone numbers",
                    "selected":true
                 },
                 {
                    "id":1229,
                    "name":"Tracker Products - CatherineTestOffice",
                    "selected":true
                 },
                 {
                    "id":504,
                    "name":"Tracker Products - DEA Drug Task Force",
                    "selected":true
                 },
                 {
                    "id":231,
                    "name":"Tracker Products - Drug Task Force",
                    "selected":true
                 },
                 {
                    "id":1,
                    "name":"Tracker Products - Evidence Unit",
                    "selected":true
                 },
                 {
                    "id":385,
                    "name":"Tracker Products - Internal Affairs",
                    "selected":true
                 },
                 {
                    "id":911,
                    "name":"Tracker Products - Lower Cletusville PD",
                    "selected":true
                 },
                 {
                    "id":1670,
                    "name":"Tracker Products - new/cat",
                    "selected":true
                 },
                 {
                    "id":1621,
                    "name":"Tracker Products - Rio-office-A",
                    "selected":true
                 },
                 {
                    "id":1622,
                    "name":"Tracker Products - Rio-office-B",
                    "selected":true
                 }
              ],
              "searchCriteria":0
           }
        ],
        "officeIds":[
           1669,
           1229,
           504,
           231,
           1,
           385,
           911,
           1670,
           1621,
           1622
        ],
        "orderBy":"PrimaryCaseNumber",
        "orderByAsc":true,
        "thenOrderBy":"",
        "thenOrderByAsc":false,
        "PageSize":10,
        "peopleIds":[
           
        ],
        "PageNumber":1,
        "clientDate":"2023-03-13T18:54:45.985Z",
        "clientTz":"America/New_York",
        "timezoneOffset":240,
        "SavedSearchEntities":[
           {
              "name":"SEARCH.SAVED_SEARCH.CASES",
              "typeId":3,
              "fieldName":"SavedSearchId_cases",
              "searchCriteriasType":5,
              "dropdownEntities":{
                 "entity":"SavedSearches",
                 "options":{
                    "model":"cases"
                 }
              },
              "searchCriterias":[
                 {
                    "id":0,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS"
                 }
              ],
              "dropdownValues":[
                 {
                    "id":null,
                    "name":"Select all"
                 },
                 {
                    "id":94172,
                    "name":"All Cases"
                 },
                 {
                    "id":94173,
                    "name":"All Cases Last 365 Days"
                 },
                 {
                    "id":106536,
                    "name":"tag1- saved search"
                 }
              ],
              "searchCriteria":0
           },
           {
              "name":"SEARCH.SAVED_SEARCH.DISPOSALS",
              "typeId":3,
              "fieldName":"SavedSearchId_disposals",
              "searchCriteriasType":5,
              "dropdownEntities":{
                 "entity":"SavedSearches",
                 "options":{
                    "model":"disposals"
                 }
              },
              "searchCriterias":[
                 {
                    "id":0,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS"
                 }
              ],
              "dropdownValues":[
                 {
                    "id":null,
                    "name":"Select all"
                 }
              ],
              "searchCriteria":0
           },
           {
              "name":"SEARCH.SAVED_SEARCH.CHECKINS",
              "typeId":3,
              "fieldName":"SavedSearchId_checkins",
              "searchCriteriasType":5,
              "dropdownEntities":{
                 "entity":"SavedSearches",
                 "options":{
                    "model":"checkins"
                 }
              },
              "searchCriterias":[
                 {
                    "id":0,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS"
                 }
              ],
              "dropdownValues":[
                 {
                    "id":null,
                    "name":"Select all"
                 }
              ],
              "searchCriteria":0
           },
           {
              "name":"SEARCH.SAVED_SEARCH.CHECKOUTS",
              "typeId":3,
              "fieldName":"SavedSearchId_checkouts",
              "searchCriteriasType":5,
              "dropdownEntities":{
                 "entity":"SavedSearches",
                 "options":{
                    "model":"checkouts"
                 }
              },
              "searchCriterias":[
                 {
                    "id":0,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS"
                 }
              ],
              "dropdownValues":[
                 {
                    "id":null,
                    "name":"Select all"
                 }
              ],
              "searchCriteria":0
           },
           {
              "name":"SEARCH.SAVED_SEARCH.MOVES",
              "typeId":3,
              "fieldName":"SavedSearchId_moves",
              "searchCriteriasType":5,
              "dropdownEntities":{
                 "entity":"SavedSearches",
                 "options":{
                    "model":"moves"
                 }
              },
              "searchCriterias":[
                 {
                    "id":0,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS"
                 }
              ],
              "dropdownValues":[
                 {
                    "id":null,
                    "name":"Select all"
                 }
              ],
              "searchCriteria":0
           },
           {
              "name":"SEARCH.SAVED_SEARCH.TRANSFERS",
              "typeId":3,
              "fieldName":"SavedSearchId_transfers",
              "searchCriteriasType":5,
              "dropdownEntities":{
                 "entity":"SavedSearches",
                 "options":{
                    "model":"transfers"
                 }
              },
              "searchCriterias":[
                 {
                    "id":0,
                    "name":"TP_SEARCH.SEARCH_CRITERIA.EQUALS"
                 }
              ],
              "dropdownValues":[
                 {
                    "id":null,
                    "name":"Select all"
                 }
              ],
              "searchCriteria":0
           }
        ]
     });

    var response = http.post(`${settings.baseUrl}/api/items/search`, httpBody, { headers: httpHeaders });

    if (response.status === 200) {
      var searchResults = JSON.parse(response.body);
      console.log(`Items Search - items found : ${searchResults.count}, response time(ms): ${response.timings.duration}`);    
      itemSearchTime.add(response.timings.duration);
    } else {
      console.log(`ERROR searching items `);
    }
  },


  searchPeople (virutalUserIndex, token) {

    let currentDateTime = new Date().toDateString() + ' - ' + new Date().toLocaleTimeString();
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
  
    let httpBody = JSON.stringify({
        "tags": [
          
        ],
        "IsSearchingInSublocations": false,
        "DynamicFields": [
          
        ],
        "StaticFields": [
          {
            "name": "GENERAL.GENDER",
            "typeId": 3,
            "fieldName": "GenderId",
            "searchCriteriasType": 1,
            "dropdownEntities": {
              "entity": "genders"
            },
            "searchCriterias": [
              {
                "id": 0,
                "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"
              },
              {
                "id": 1,
                "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"
              }
            ],
            "dropdownValues": [
      
            ],
            "searchCriteria": 0,
            "model": 3
          }
        ],
        "officeIds": [
          
        ],
        "orderBy": "BusinessName",
        "orderByAsc": false,
        "thenOrderBy": "",
        "thenOrderByAsc": false,
        "PageSize": 100,
        "peopleIds": [
          
        ],
        "PageNumber": 1,
        "clientDate": "2021-06-26T11:33:43.885Z",
        "clientTz": "America/New_York",
        "timezoneOffset": 240,
        "SavedSearchEntities": [
          
        ]
      });

    var response = http.post(`${settings.baseUrl}/api/people/search`, httpBody, { headers: httpHeaders });
    
    if (response.status === 200) {
      var searchResults = JSON.parse(response.body);
      console.log(`people Search - people found : ${searchResults.count}, response time(ms): ${response.timings.duration}`);    
      personSearchTime.add(response.timings.duration);
    } else {
      console.log(`ERROR searching people `);
    }
  },

  searchUsers (virutalUserIndex, token) {
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);    
    let httpBody = JSON.stringify({"page":0,"count":100,"searchString":"trackerproducts","orderBy":"MobilePhone","orderByAsc":true,"officeId":0,"onlyActiveUsers":true});    
    var response = http.post(`${settings.baseUrl}/api/users/search`, httpBody, { headers: httpHeaders });

    if (response.status === 200) {
      var searchResults = JSON.parse(response.body);
      console.log(`User Search - users found : ${searchResults.count}, response time(ms): ${response.timings.duration}`);    
      userSearchTime.add(response.timings.duration);
    } else {
      console.log(`ERROR searching users `);
    }
  },


  searchCheckIns (virutalUserIndex, token) {
    let currentDateTime = new Date().toDateString() + ' - ' + new Date().toLocaleTimeString();
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);

    let httpBody = JSON.stringify({
        "tags": [
          
        ],
        "IsSearchingInSublocations": false,
        "DynamicFields": [
          
        ],
        "StaticFields": [
          {
            "name": "ITEMS.CHECK_IN.CHECK_IN_DATE",
            "typeId": 2,
            "fieldName": "Date",
            "searchCriteriasType": 2,
            "searchCriterias": [
      
            ],
            "searchCriteria": 23,
            "model": null,
            "toDate": null
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
              {
                "id": 1316,
                "name": "Tracker Products - CatherineNewOffice",
                "selected": true
              },
              {
                "id": 1229,
                "name": "Tracker Products - CatherineTestOffice",
                "selected": true
              },
              {
                "id": 504,
                "name": "Tracker Products - DEA Drug Task Force",
                "selected": true
              },
              {
                "id": 231,
                "name": "Tracker Products - Drug Task Force",
                "selected": true
              },
              {
                "id": 1,
                "name": "Tracker Products - Evidence Unit",
                "selected": true
              },
              {
                "id": 1364,
                "name": "Tracker Products - Img test Office2",
                "selected": true
              },
              {
                "id": 1365,
                "name": "Tracker Products - Img test Office3",
                "selected": true
              },
              {
                "id": 385,
                "name": "Tracker Products - Internal Affairs",
                "selected": true
              },
              {
                "id": 911,
                "name": "Tracker Products - Lower Cletusville PD",
                "selected": true
              },
              {
                "id": 1359,
                "name": "Tracker Products - oiuytr",
                "selected": true
              },
              {
                "id": 1366,
                "name": "Tracker Products - ss",
                "selected": true
              }
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
        "orderBy": "Date",
        "orderByAsc": false,
        "thenOrderBy": "",
        "thenOrderByAsc": false,
        "PageSize": 100,
        "peopleIds": [
          
        ],
        "PageNumber": 1,
        "clientDate": "2021-06-26T11:45:45.454Z",
        "clientTz": "America/New_York",
        "timezoneOffset": 240,
        "SavedSearchEntities": [
          
        ]
      });

    var response = http.post(`${settings.baseUrl}/api/checkins/search`, httpBody, { headers: httpHeaders });

    if (response.status === 200) {
      var searchResults = JSON.parse(response.body);
      console.log(`Check Ins Search - check ins found : ${searchResults.count}, response time(ms): ${response.timings.duration}`);    
    } else {
      console.log(`ERROR searching check ins `);
    }
  },

  searchCheckOuts (virutalUserIndex, token) {
    let currentDateTime = new Date().toDateString() + ' - ' + new Date().toLocaleTimeString();
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    
    let httpBody = JSON.stringify({
        "tags": [
          
        ],
        "IsSearchingInSublocations": false,
        "DynamicFields": [
          
        ],
        "StaticFields": [
          {
            "name": "ITEMS.CHECK_OUT.CHECK_OUT_DATE",
            "typeId": 2,
            "fieldName": "Date",
            "searchCriteriasType": 2,
            "searchCriterias": [
            ],
            "searchCriteria": 8,
            "model": "2020-07-01T04:00:00.000Z",
            "toDate": "2021-06-26T04:00:00.000Z"
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
              {
                "id": 1316,
                "name": "Tracker Products - CatherineNewOffice",
                "selected": true
              },
              {
                "id": 1229,
                "name": "Tracker Products - CatherineTestOffice",
                "selected": true
              },
              {
                "id": 504,
                "name": "Tracker Products - DEA Drug Task Force",
                "selected": true
              },
              {
                "id": 231,
                "name": "Tracker Products - Drug Task Force",
                "selected": true
              },
              {
                "id": 1,
                "name": "Tracker Products - Evidence Unit",
                "selected": true
              },
              {
                "id": 1364,
                "name": "Tracker Products - Img test Office2",
                "selected": true
              },
              {
                "id": 1365,
                "name": "Tracker Products - Img test Office3",
                "selected": true
              },
              {
                "id": 385,
                "name": "Tracker Products - Internal Affairs",
                "selected": true
              },
              {
                "id": 911,
                "name": "Tracker Products - Lower Cletusville PD",
                "selected": true
              },
              {
                "id": 1359,
                "name": "Tracker Products - oiuytr",
                "selected": true
              },
              {
                "id": 1366,
                "name": "Tracker Products - ss",
                "selected": true
              }
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
        "orderBy": "Date",
        "orderByAsc": false,
        "thenOrderBy": "",
        "thenOrderByAsc": false,
        "PageSize": 100,
        "peopleIds": [
          
        ],
        "PageNumber": 1,
        "clientDate": "2021-06-26T11:56:35.551Z",
        "clientTz": "America/New_York",
        "timezoneOffset": 240,
        "SavedSearchEntities": [
          
        ]
      });

    var response = http.post(`${settings.baseUrl}/api/checkouts/search`, httpBody, { headers: httpHeaders });

    if (response.status === 200) {
      var searchResults = JSON.parse(response.body);
      console.log(`Check Out Search - check outs found : ${searchResults.count}, response time(ms): ${response.timings.duration}`);    
    } else {
      console.log(`ERROR searching check outs `);
    }
  },

  searchDisposals (virutalUserIndex, token) {
    let currentDateTime = new Date().toDateString() + ' - ' + new Date().toLocaleTimeString();
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);

    let httpBody = JSON.stringify({
        "tags": [
          
        ],
        "IsSearchingInSublocations": false,
        "DynamicFields": [
          
        ],
        "StaticFields": [
          {
            "name": "DISPOSAL.DISPOSE_DATE",
            "typeId": 2,
            "fieldName": "Date",
            "searchCriteriasType": 2,
            "searchCriterias": [
      
            ],
            "searchCriteria": 8,
            "model": "2019-06-01T04:00:00.000Z",
            "toDate": "2021-06-26T04:00:00.000Z"
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
              {
                "id": 1316,
                "name": "Tracker Products - CatherineNewOffice",
                "selected": true
              },
              {
                "id": 1229,
                "name": "Tracker Products - CatherineTestOffice",
                "selected": true
              },
              {
                "id": 504,
                "name": "Tracker Products - DEA Drug Task Force",
                "selected": true
              },
              {
                "id": 231,
                "name": "Tracker Products - Drug Task Force",
                "selected": true
              },
              {
                "id": 1,
                "name": "Tracker Products - Evidence Unit",
                "selected": true
              },
              {
                "id": 1364,
                "name": "Tracker Products - Img test Office2",
                "selected": true
              },
              {
                "id": 1365,
                "name": "Tracker Products - Img test Office3",
                "selected": true
              },
              {
                "id": 385,
                "name": "Tracker Products - Internal Affairs",
                "selected": true
              },
              {
                "id": 911,
                "name": "Tracker Products - Lower Cletusville PD",
                "selected": true
              },
              {
                "id": 1359,
                "name": "Tracker Products - oiuytr",
                "selected": true
              },
              {
                "id": 1366,
                "name": "Tracker Products - ss",
                "selected": true
              }
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
        "orderBy": "Date",
        "orderByAsc": false,
        "thenOrderBy": "",
        "thenOrderByAsc": false,
        "PageSize": 100,
        "peopleIds": [
          
        ],
        "PageNumber": 1,
        "clientDate": "2021-06-26T12:04:18.255Z",
        "clientTz": "America/New_York",
        "timezoneOffset": 240,
        "SavedSearchEntities": [
          
        ]
      });

    var response = http.post(`${settings.baseUrl}/api/disposals/search`, httpBody, { headers: httpHeaders });

    if (response.status === 200) {
      var searchResults = JSON.parse(response.body);
      console.log(`Disposals Search - dispoosals found : ${searchResults.count}, response time(ms): ${response.timings.duration}`);    
    } else {
      console.log(`ERROR searching usedisposals `);
    }
  },

  searchMoves (virutalUserIndex, token) {
    let currentDateTime = new Date().toDateString() + ' - ' + new Date().toLocaleTimeString();
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    /* #region Search Body */
    let httpBody = JSON.stringify({
      "tags": [
        
      ],
      "IsSearchingInSublocations": false,
      "DynamicFields": [
        
      ],
      "StaticFields": [
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
            {
              "id": 1027,
              "name": "Web Test Automation - Cypress Office 1",
              "selected": true
            },
            {
              "id": 1032,
              "name": "Web Test Automation - Cypress Office 2",
              "selected": true
            },
            {
              "id": 11081,
              "name": "Web Test Automation - fsfsdf",
              "selected": true
            }
          ],
          "model": [
            {
              "id": 1027,
              "name": "Web Test Automation - Cypress Office 1",
              "selected": true
            },
            {
              "id": 1032,
              "name": "Web Test Automation - Cypress Office 2",
              "selected": true
            },
            {
              "id": 11081,
              "name": "Web Test Automation - fsfsdf",
              "selected": true
            }
          ],
          "searchCriteria": 0
        }
      ],
      "officeIds": [
        1027,
        1032,
        11081
      ],
      "orderBy": "Date",
      "orderByAsc": false,
      "thenOrderBy": "",
      "thenOrderByAsc": false,
      "PageSize": 100,
      "peopleIds": [
        
      ],
      "PageNumber": 1,
      "clientDate": "2021-06-14T15:59:00.514Z",
      "clientTz": "America/New_York",
      "timezoneOffset": 240,
      "SavedSearchEntities": [
        
      ]
    });

    var response = http.post(`${settings.baseUrl}/api/moves/search`, httpBody, { headers: httpHeaders });
    if (response.status === 200) {
      var searchResults = JSON.parse(response.body);
      console.log(`Moves Search - moves found : ${searchResults.count}, response time(ms): ${response.timings.duration}`);    
    } else {
      console.log(`ERROR searching moves `);
    }
  },

  searchTransfers (virutalUserIndex, token) {
    let currentDateTime = new Date().toDateString() + ' - ' + new Date().toLocaleTimeString();
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    
    let httpBody = JSON.stringify({
      "tags": [ ],
      "IsSearchingInSublocations": false,
      "DynamicFields": [ ],
      "StaticFields": [
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
            {
              "id": 1027,
              "name": "Web Test Automation - Cypress Office 1",
              "selected": true
            },
            {
              "id": 1032,
              "name": "Web Test Automation - Cypress Office 2",
              "selected": true
            },
            {
              "id": 11081,
              "name": "Web Test Automation - fsfsdf",
              "selected": true
            }
          ],
          "model": [
            {
              "id": 1027,
              "name": "Web Test Automation - Cypress Office 1",
              "selected": true
            },
            {
              "id": 1032,
              "name": "Web Test Automation - Cypress Office 2",
              "selected": true
            },
            {
              "id": 11081,
              "name": "Web Test Automation - fsfsdf",
              "selected": true
            }
          ],
          "searchCriteria": 0
        }
      ],
      "officeIds": [
        1027,
        1032,
        11081
      ],
      "orderBy": "Date",
      "orderByAsc": false,
      "thenOrderBy": "",
      "thenOrderByAsc": false,
      "PageSize": 25,
      "peopleIds": [
        
      ],
      "PageNumber": 1,
      "clientDate": "2021-06-14T16:03:53.548Z",
      "clientTz": "America/New_York",
      "timezoneOffset": 240,
      "SavedSearchEntities": [
        
      ]
    });

    var response = http.post(`${settings.baseUrl}/api/transfers/search`, httpBody, { headers: httpHeaders });

    if (response.status === 200) {
      var searchResults = JSON.parse(response.body);
      console.log(`Transfers Search - transfers found : ${searchResults.count}, response time(ms): ${response.timings.duration}`);    
    } else {
      console.log(`ERROR searching transfers `);
    }
  },

  searchNotes (virutalUserIndex, token) {
    let currentDateTime = new Date().toDateString() + ' - ' + new Date().toLocaleTimeString();
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    
    let httpBody = JSON.stringify({
      "tags": [
        
      ],
      "IsSearchingInSublocations": false,
      "DynamicFields": [
        
      ],
      "StaticFields": [
        {
          "name": "NOTES.CATEGORY",
          "typeId": 3,
          "fieldName": "NoteCategoryId",
          "searchCriteriasType": 1,
          "dropdownEntities": {
            "entity": "notecategories",
            "options": {
              "belongToOrganization": true
            }
          },
          "searchCriterias": [
            {
              "id": 0,
              "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"
            },
            {
              "id": 1,
              "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"
            }
          ],
          "dropdownValues": [
            {
              "id": null,
              "name": "Select all"
            },
            {
              "id": 27,
              "name": "Invalid"
            },
            {
              "id": 1,
              "name": "Miscellaneous"
            },
            {
              "id": 2,
              "name": "Sensitive"
            }
          ],
          "searchCriteria": 0,
          "model": 2
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
            {
              "id": 1027,
              "name": "Web Test Automation - Cypress Office 1",
              "selected": true
            },
            {
              "id": 1032,
              "name": "Web Test Automation - Cypress Office 2",
              "selected": true
            },
            {
              "id": 11081,
              "name": "Web Test Automation - fsfsdf",
              "selected": true
            }
          ],
          "model": [
            {
              "id": 1027,
              "name": "Web Test Automation - Cypress Office 1",
              "selected": true
            },
            {
              "id": 1032,
              "name": "Web Test Automation - Cypress Office 2",
              "selected": true
            },
            {
              "id": 11081,
              "name": "Web Test Automation - fsfsdf",
              "selected": true
            }
          ],
          "searchCriteria": 0
        }
      ],
      "officeIds": [
        1027,
        1032,
        11081
      ],
      "orderBy": "Date",
      "orderByAsc": false,
      "thenOrderBy": "",
      "thenOrderByAsc": false,
      "PageSize": 50,
      "peopleIds": [
        
      ],
      "PageNumber": 1,
      "clientDate": "2021-06-14T18:40:53.199Z",
      "clientTz": "America/New_York",
      "timezoneOffset": 240,
      "SavedSearchEntities": [
        
      ]
    });

    var response = http.post(`${settings.baseUrl}/api/notes/search`, httpBody, { headers: httpHeaders });

    if (response.status === 200) {
      var searchResults = JSON.parse(response.body);
      console.log(`Notes Search - notes found : ${searchResults.count}, response time(ms): ${response.timings.duration}`);    
    } else {
      console.log(`ERROR searching notes `);
    }
  },

  searchTasks (virutalUserIndex, token) {
    let currentDateTime = new Date().toDateString() + ' - ' + new Date().toLocaleTimeString();
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    
    let httpBody = JSON.stringify({
      "tags": [
        
      ],
      "IsSearchingInSublocations": false,
      "DynamicFields": [
        
      ],
      "StaticFields": [
        {
          "name": "TASKS.CREATION_DATE",
          "typeId": 2,
          "fieldName": "DateCreated",
          "searchCriteriasType": 2,
          "searchCriterias": [
          ],
          "searchCriteria": 8,
          "toDate": "2021-06-07T04:00:00.000Z",
          "model": "2021-04-28T04:00:00.000Z"
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
            {
              "id": 1027,
              "name": "Web Test Automation - Cypress Office 1",
              "selected": true
            },
            {
              "id": 1032,
              "name": "Web Test Automation - Cypress Office 2",
              "selected": true
            },
            {
              "id": 11081,
              "name": "Web Test Automation - fsfsdf",
              "selected": true
            }
          ],
          "model": [
            {
              "id": 1027,
              "name": "Web Test Automation - Cypress Office 1",
              "selected": true
            },
            {
              "id": 1032,
              "name": "Web Test Automation - Cypress Office 2",
              "selected": true
            },
            {
              "id": 11081,
              "name": "Web Test Automation - fsfsdf",
              "selected": true
            }
          ],
          "searchCriteria": 0
        },
        {
          "name": "SEARCH.ASSIGN_TO_USERS",
          "typeId": 5,
          "fieldName": "Users",
          "searchCriteriasType": 1,
          "typeAheadTemplate": "<tp-multi-user-typeahead field=\"field\" selected-users=\"field.model\"  search-inactive=\"true\"></tp-multi-user-typeahead>",
          "searchCriterias": [
            {
              "id": 0,
              "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"
            },
            {
              "id": 1,
              "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"
            }
          ],
          "searchCriteria": 0,
          "model": {
            "users": [
              
            ]
          }
        },
        {
          "name": "SEARCH.ASSIGN_TO_USER_GROUPS",
          "typeId": 5,
          "fieldName": "UserGroups",
          "searchCriteriasType": 1,
          "typeAheadTemplate": "<tp-user-groups-typeahead field=\"field\" selected-user-groups=\"field.model\"></tp-user-groups-typeahead>",
          "searchCriterias": [
            {
              "id": 0,
              "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"
            },
            {
              "id": 1,
              "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"
            }
          ],
          "searchCriteria": 0,
          "model": {
            "userGroups": [
              
            ]
          }
        }
      ],
      "officeIds": [
        1027,
        1032,
        11081
      ],
      "orderBy": "DateCreated",
      "orderByAsc": false,
      "thenOrderBy": "",
      "thenOrderByAsc": false,
      "PageSize": 50,
      "peopleIds": [
        
      ],
      "PageNumber": 1,
      "clientDate": "2021-06-14T18:43:41.550Z",
      "clientTz": "America/New_York",
      "timezoneOffset": 240,
      "SavedSearchEntities": [
        
      ]
    });

    var response = http.post(`${settings.baseUrl}/api/tasks/search`, httpBody, { headers: httpHeaders });

    if (response.status === 200) {
      var searchResults = JSON.parse(response.body);
      console.log(`Tasks Search - tasks found : ${searchResults.count}, response time(ms): ${response.timings.duration}`);    
    } else {
      console.log(`ERROR searching tasks `);
    }
  },

  searchMedia (virutalUserIndex, token) {
    let currentDateTime = new Date().toDateString() + ' - ' + new Date().toLocaleTimeString();
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    
    let httpBody = JSON.stringify({
        "tags": [
          
        ],
        "IsSearchingInSublocations": false,
        "DynamicFields": [
          
        ],
        "StaticFields": [
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
        "orderBy": "FileLocation",
        "orderByAsc": false,
        "thenOrderBy": "",
        "thenOrderByAsc": false,
        "PageSize": 100,
        "peopleIds": [
          
        ],
        "PageNumber": 1,
        "clientDate": "2021-06-26T12:05:37.844Z",
        "clientTz": "America/New_York",
        "timezoneOffset": 240,
        "SavedSearchEntities": [
          
        ]
      });

    var response = http.post(`${settings.baseUrl}/api/media/search`, httpBody, { headers: httpHeaders });
    
    if (response.status === 200) {
      var searchResults = JSON.parse(response.body);
      console.log(`Media Search - media found : ${searchResults.count}, response time(ms): ${response.timings.duration}`);    
    } else {
      console.log(`ERROR searching media `);
    }
  },

  searchItemsByBarcode (virutalUserIndex, token) {
    let currentDateTime = new Date().toDateString() + ' - ' + new Date().toLocaleTimeString();
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    
    let httpBody = JSON.stringify({
        "scannedValues": [
          "3c4eb7db-b8a4-45fe-933f-c371adc10cb6",
          "566e72ce-09d4-449a-a4c1-e3a9a9a7530b",
          "0fef9c00-244a-46f0-9df8-90effbff1440",
          "03bdb17c-dfcf-4d45-9021-df0d6b118d14",
          "6d2b4901-bce6-46ea-a3fb-b80203d39db2",
          "d0192f1c-8c77-43df-aa66-d13c6d61786e",
          "bd0b4725-bc38-44b7-9b3d-c385d06879b6",
          "f70eac69-3036-433e-a562-d8f747a2889b",
          "8b4eb2ce-80c7-49d8-bcbf-e2d463c04112",
          "a30245bc-e80f-4e4b-ae42-ac2eb2b23c44",
          "e4ef8d18-a393-430e-943e-bbbd6a19e7b2",
          "833afafb-1e3b-49c9-a791-31af83c4eb82",
          "4df82e98-a3e3-4366-aead-997ec1f3c05d",
          "a9902192-ae7e-413c-82c1-3b0d36c075ea",
          "7254f11f-4e75-4fb7-9603-304b08afc233",
          "41f58200-c303-442e-96af-5bfca8f52d9a",
          "df2c12f4-4b08-49e2-bd78-66668acc346a",
          "8ee45555-c07c-44f9-95ea-fc128dc9a3e5",
          "98b74e04-8984-4bc9-a1d9-71406ad3ed71",
          "682917e8-724e-40cb-afc3-fd2f4332594b",
          "17480f0b-8cd8-4e8d-92ce-bda44f1d5666",
          "18b04138-ef61-4b01-b9e0-7f8ecc818fe8",
          "fd42692d-531f-4d0e-a2df-a4d0367011b9",
          "2e7d3460-f38c-4af5-967a-2fe08984bf6a",
          "c1715756-d13e-4b10-b967-5577eb0b5325",
          "09352a5b-d56c-4c56-8578-46866c80d774",
          "aab07c79-688e-4151-953b-091cbe75e0ef",
          "dfa082f7-d66f-416a-ba42-bc9ca375dc98",
          "2f155a08-b695-4e10-b249-2dc014a87bbe",
          "239276c4-9eae-41b6-b85e-a1a073df7ae1",
          "3e9f9164-a7aa-4e9f-8c0d-d075219bd3a7",
          "90cb7afa-4880-4f0b-8b7c-8e98942e8485",
          "e9d8ef24-3d54-4be8-9d28-194fb51577fc",
          "177a026c-f58e-41d6-aad1-0ed86f13da78",
          "49c51a5e-191e-49cd-ac49-0bba4460da03",
          "c8c09db9-b4fe-4e81-bfb0-8f03781fbd74",
          "e5a245a3-4467-4595-81b5-4cadf779dcf3",
          "1ecf3ce3-efa3-4468-8e71-ad3097c308ed",
          "a8a6713a-c320-4e89-a827-eec1f699cd7a",
          "be91f422-ff04-44a9-a4fa-4e45acae7157",
          "483e1f31-fda7-4800-97f3-435e95a5ecb0",
          "cb37b411-02b3-4537-a48d-d62be5847ef2",
          "48189eb3-5574-453c-879c-103fcb214453",
          "ab7c21cb-4f41-4821-9fda-36dd4a1a176f",
          "425a430b-517d-45ed-a2fa-39f6991caf60",
          "2b75a9ff-5ceb-4671-8b58-de8272438521",
          "e0f1b97f-dbc0-44a2-90b8-16bd061bd35e",
          "ee6bb150-9b96-4ee6-ba91-4af35bcec98d",
          "8d23db23-b4c8-4c1e-9a5d-c18c50717975",
          "25cb438b-2b8e-43d8-880a-015f8cdb9021",
          "68e48eea-2bb2-4924-add9-6e745432c59c",
          "bc9aca88-39ae-4f71-935e-fafe83167296",
          "b2134600-2f2f-4636-8dfa-44acae56b907",
          "d4013e2e-63e5-4bf2-9b8e-2306569fae31",
          "7da91f8d-2ac0-4b48-8e3c-367e35d61d7c",
          "2dec2e5c-9e71-4f4b-8203-40979f062267",
          "e01f163c-0022-4dc6-ab2c-23deabaeb5bc",
          "c07fbbe9-3d73-4417-ae95-c70f8f15c702",
          "037357c2-77ef-47af-a4e5-095ef37b6da3",
          "632b6342-f987-4e37-b2a6-b96654640213",
          "aa1e86dc-781b-4da5-8086-5ed5c9b7d3ae",
          "fe53dc72-a14a-49d1-9fcb-f79e0d9ada49",
          "b17d0acd-976f-4f54-9660-6e0a824a5bee",
          "e30c46de-c48f-4557-b130-a9bb59733f55",
          "5788f6ef-a6df-41c0-904e-d96a8a62c249",
          "771e5461-7160-4ff7-8840-9281b390ac30",
          "9419e3af-c175-436c-b70a-742627c0c0f0",
          "302808a5-cbc3-41a9-a756-064c7edcc21a",
          "5dc77d8d-32d1-4d69-9ff2-40bf481e5f48",
          "3a002aa5-1a9e-4ebe-8bfa-0fb20ae07210",
          "f4aba59f-c4cc-411a-ba68-df3a089725aa",
          "07a39928-98ce-4198-bc3c-f5d003c57317",
          "b6f84e76-8df4-41cd-9057-380ac6a7ad3d",
          "187362a9-a7b1-4744-86f5-d05586ecf8cf",
          "c1f4dc3a-b533-48dd-9a69-309c7cda9441",
          "fbd1024e-3aea-4ad7-bce9-8c0724fb74b0",
          "0554568d-e91c-443b-a1d3-cc56ad6635c0",
          "2ad0eb15-3e97-4b53-96e0-09cef0d3c620",
          "79d5b6f1-d7a3-4390-a6a6-8f555c1b2aef",
          "c2e985d5-73d1-4955-a187-41b3242249d9",
          "023a82cf-c5eb-4286-adb6-78ee94413b55",
          "42afdf21-8fd8-4960-8609-c1e514df3940",
          "5b7cc6ce-15e1-40fb-81a6-a6944cd98a92",
          "b0d4f3fa-6f72-4a5a-aff2-7704901d3609",
          "01e86cc5-e2b9-41d2-8518-79d2732f0558",
          "a48cf0f1-32ff-4dc4-96b7-cfcb0a516b90",
          "8f43076f-3cfe-4eaa-aa24-558706aac1aa",
          "17ae3b52-73ed-44e3-927f-ccb8807e540a",
          "b9d8eda6-7fe1-4155-aeed-1a15be0fd544",
          "548578f9-2ef1-4459-845a-1a6b07362eb1",
          "70d55f14-099b-45bf-a9f0-288510ba547c",
          "dbd99948-b46c-4411-8400-afd0054e68d7",
          "69e59bc1-facc-4b9e-9971-aa260a30eae8",
          "b13cc457-74d8-4808-9d10-0a9224a248fb",
          "fc8bfabe-731e-4537-8787-8073de756afa",
          "9365af1d-dce6-4451-a562-9eebdba989a1",
          "22b1e070-ef84-49f8-931b-dd8278ff5670",
          "4a08a648-4617-44ac-a6f6-b5ae003bfd87",
          "69b6fb4c-0784-49d9-97a8-dee854b9061d",
          "4669601a-88e5-47d9-b2fa-00c4ccbbec54",
          "a9501566-d223-4a59-9555-3831928b5261",
          "e7221852-135d-4269-a528-1e41574be0d4",
          "61ddd578-f30e-47eb-831b-899e8b3c3cb6",
          "6f426ebc-467a-409e-ae0a-0d8513b6ad9d",
          "ac0970a1-4f93-407f-8be3-7987bb0e9da0",
          "b16f0b3e-ba67-4b42-943e-7f293e00e987",
          "857dabe8-029b-41da-8d44-052fc0d3a913",
          "37768f5a-2ec5-44d5-a393-c3c66cb4d869",
          "273388c7-ae9e-47da-bb00-e79bc988652b",
          "4ab38942-43d5-47c8-b7cd-16d486b14e04",
          "d1741a78-3ed6-4a38-902f-73289cc9cf80",
          "20ae995e-5b31-4ea1-bbe8-65a9f0a192f8",
          "ae8e0319-81c1-4aec-b71f-fbfbc53b3ef8",
          "bc56561b-75b5-462d-904c-4607a84ec5af",
          "0d24753a-62bf-4a66-a1d0-aee8ee198872",
          "67c67569-5cfe-4049-996f-298980fdb7e5",
          "b11d773f-a295-4133-aa9e-e937288c1c75",
          "90b1ca99-2498-4547-b280-e5090d1729a9",
          "d71092d7-59b7-4d7b-9d3d-e9814773289a",
          "51926535-5011-4f28-9060-12e309bfda45",
          "2256498b-ad98-4f3d-938e-9ed4fe0846a8",
          "fb3ad502-a8bf-4dbc-9ec3-d73533bd7023",
          "eaf3f1aa-a194-40e6-96ee-0d2c30dd1659",
          "15e6e3ae-f28b-414b-afbf-6f4e38533213",
          "bcaeb34b-1313-4d25-99f4-c2c14d57490d",
          "c550ff3a-f2fd-41ba-82cf-24d6e0b32713",
          "a8dbf679-85d8-4cd3-abdd-25e87da6d2f8",
          "a14c4039-ad52-421c-af6e-21e0dacd7d12",
          "e821816a-5e47-4f0b-8d70-079360997f19",
          "58524a66-2b6f-4207-b112-b4f47615ebe8",
          "0472f0f8-245d-465a-a929-141159ed2b0a",
          "11df6fe2-01e7-45ef-a2c2-8150d370a208",
          "b801b27d-2f4d-4bb0-8e99-9ae18ae2f068",
          "3cf1583d-196b-4dfb-b02f-2475f89db1c1",
          "fdcdd510-6a46-48f0-8919-80ed29954d0c",
          "33b1ae7b-d5f5-438d-a72d-4a48e1d926a5",
          "6794b52a-939b-4d12-bff6-94d6ccd642eb",
          "5c185996-95ab-4e36-af8b-c76004756867",
          "73350a11-5f0c-4148-94fb-739639806aa8",
          "b2058c59-adff-4810-9a92-86793e0c05dc",
          "d59bf652-d0e5-40a5-ad99-4f83d850f8da",
          "c8376b13-5983-4f36-97ae-74e2d659d36d",
          "9603c25d-e954-4911-abae-f42ffd82aac0",
          "6505b8cd-f031-4b9f-806f-8d023aa43c30",
          "02b100ba-9c8c-4f87-9b04-68641e85bbfa",
          "931253e2-ff68-4af3-9060-37a71b6de60a",
          "6ee5f489-b12d-488d-a83a-a9fcd4c16401",
          "7073dd65-2834-4a05-b7ac-87dc16f86265",
          "3c525b30-c245-44ca-983c-bbb5b79666c8",
          "010a67b7-9745-452c-87b4-346efafc8a04",
          "c4144966-0b79-4708-b8eb-806d834c0f7a",
          "14429aba-a772-47f5-b09f-0c59c8df2abf",
          "eb72690b-35f4-4801-80b7-dda321bc8750",
          "2db97815-9ecb-45e0-a35f-f30de7081fac",
          "7c483e55-14ba-426f-ba39-ecb73696c543",
          "ad78ad05-4694-44e7-959a-7acaab7b8c7f",
          "27a10732-8827-4b11-8df1-43244b4b44be",
          "62fa8227-7567-4efd-8823-2b74e2d754a8",
          "6f4dc5cb-cc78-47ff-bebd-214100deedaa",
          "bceea21a-b0f6-49b5-9264-2808546e2fbc",
          "beb915a8-0632-4fb6-900e-df0c3173ca89",
          "211d41b1-c25b-44d2-96a4-54b2c9d22cd8",
          "578810a6-c7bd-4988-b5ea-c27ef3ca1c8a",
          "fcbee3dc-5254-48a9-b02a-88d424d91e95",
          "8617e603-4a45-4109-a833-4adae847441b",
          "52da6288-25e1-4378-8308-68564e0dce92",
          "084aa903-4292-4183-ba53-6c9312d92713",
          "4ffecb73-a4ca-4497-8547-b168bbf304cc",
          "94eb5474-43d0-4ab0-b495-7a4f69b9806e",
          "6ce70766-c3a9-4f89-82b3-c2e38d1c127f",
          "493a2235-e3b1-4b5e-9557-e71d9b6656b7",
          "887da148-e254-433e-8591-99df4906223b",
          "4c61ceb0-3852-48c1-a857-de6e1ec11b04",
          "79c06568-fb4e-4a2e-b25b-b54d10cc1fc2",
          "262381df-716c-4bc0-ae2d-26be33866417",
          "f9d4ab47-6069-4b6f-9471-86620b05c843",
          "3aaa90ee-1867-4ff9-a99a-8a33be2095b8",
          "044c3469-e165-447e-944d-a0488005efdc",
          "6554d101-f192-4b98-8921-1b61a0a31b1f",
          "a77e946e-3e2e-4e55-bc13-6e62a3eea693",
          "3edc632b-1872-4bce-ad1f-ae8b46fe4b26",
          "91d6705d-2807-4924-b4e8-df6dcab2eaea",
          "74a40028-8147-47d9-bb62-4e18074e04b5",
          "6f121e8e-27fc-4b48-8297-a1db6f6653ba",
          "c8e93b5f-5348-4832-bf00-457106643d54",
          "d082eda2-f4da-48ff-9335-bba34ae88e23",
          "4f3e2ec4-852c-44ed-a411-4a23da84d52d",
          "2fd93379-71c6-4ca6-9a1f-be8fa3c4801a",
          "dcc5bf99-eb03-47a1-9eb1-987a6facc1e6",
          "06ab3363-6475-4e4f-af4d-8ca5c57ded7c",
          "d7c85500-10c2-4a87-b3c0-95f0341ef8c5",
          "f5d0575d-12be-46a6-99c4-4c62aeeb8511",
          "ddabb940-c5e1-480a-8a7e-e218380ac314",
          "dafb7d15-7c5c-4d9f-ba51-1691a3178723",
          "0aa4a2a8-0eb2-4e17-af93-96ea04854820",
          "444d16c5-34da-4389-9f6a-572f9a02da96",
          "f4fb063e-e35a-41b5-a8a9-2f370652d6f0",
          "edc68cb8-2d61-43a0-bcca-3f0aecad62a6",
          "1efc8050-8d19-4349-b950-38b866f04ef4",
          "e9a443b7-995f-411d-8c43-c17ea5c7da4a"
        ],
        "isSystemScan": true
      });

    var response = http.post(`${settings.baseUrl}/api/items/barcodes`, httpBody, { headers: httpHeaders });

    if (response.status === 200) {
      var searchResults = JSON.parse(response.body);
      console.log(`Items by Barcode Search - barcode items found , response time(ms): ${response.timings.duration}`);    
    } else {
        var error = JSON.stringify(response.message);
      console.log(`ERROR searching items by barcode, error: ${error} `);
    }

  }

}

