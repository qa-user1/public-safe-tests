const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const generic_request = require("../../api-utils/generic-api-requests");
let requestPayloads = require('./request-payloads');
const C = require("../../fixtures/constants");
let office1 = S.selectedEnvironment.office_1
let office2 = S.selectedEnvironment.office_2
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let numberOfRequests = 15
S.parallelJobNumber = Cypress.env('verificationJob')

describe('Services', function () {

    before(function () {
        // api.auth.get_tokens_without_page_load(orgAdmin);
        // D.getCaseDataWithReducedFields()
        // D.getItemDataWithReducedFields()
        // api.org_settings.disable_Case_fields()
        // api.org_settings.disable_Item_fields()
        // api.cases.add_new_case()
        // api.items.add_new_item()
    });

    it('REPORT Service', function () {
        api.auth.get_tokens_without_page_load(orgAdmin);

        function checkStatusOfJobs(nameOfReportsInCache, secondsToWait = 30) {
            cy.wait(secondsToWait * 1000)
            nameOfReportsInCache.forEach(reportName => {
                cy.getLocalStorage(reportName).then(reportId => {

                    if (reportId) {
                        generic_request.GET(
                            '/api/reports/getcompletereport?jobId=' + reportId,
                            'response')

                        cy.getLocalStorage('apiResponse').then(apiResponse => {
                            if (JSON.parse(apiResponse).complete) {
                                cy.log(` ✅ ${reportName} FINISHED SUCCESSFULLY`)
                            } else {
                                cy.log(` ❌ ${reportName} NOT FINISHED YET, AFTER ${secondsToWait} seconds`)
                            }
                        })
                    }
                })
            });
        }

        // start report for case with cca 1k items
        generic_request.POST(
            '/api/reports/buildreport',
            requestPayloads.reporterPayloadFromCaseView([S.selectedEnvironment.oldActiveCase.id]),
            "REPORT Service",
            'Big_Case_Report'
        )

        // start report for case with cca 1k items
        generic_request.POST(
            '/api/reports/buildreport',
            requestPayloads.reporterPayloadFromCaseView([S.selectedEnvironment.oldActiveCase.id]),
            "REPORT Service",
            'Big_Case_Report'
        )

        // start report for case with cca 1k items
        generic_request.POST(
            '/api/reports/buildreport',
            requestPayloads.reporterPayloadFromCaseView([S.selectedEnvironment.oldActiveCase.id]),
            "REPORT Service",
            'Big_Case_Report'
        )

        // start report for case with cca 1k items
        generic_request.POST(
            '/api/reports/buildreport',
            requestPayloads.reporterPayloadFromCaseView([S.selectedEnvironment.oldActiveCase.id]),
            "REPORT Service",
            'Big_Case_Report'
        )

        // //  start X big reports
        // for (let i = 0; i < numberOfRequests; i++) {
        //     generic_request.POST(
        //         '/api/reports/buildreport',
        //         //  requestPayloads.reporterPayloadFromCaseView([S.selectedEnvironment.oldActiveCase.id]),
        //         requestPayloads.reporterPayloadFromCaseView([7663616]),
        //         // 7663616 -- case on DEV - in Org#2 with 1500 items
        //         // 9090618 -- case on DEV - in Org#2 with 1 item1
        //         "REPORT Service",
        //         'Big_Case_Report_' + i
        //     )
        // }

        //fetch status for specific job with ID
        // let reportId = 730114
        // generic_request.GET(
        //     '/api/reports/getcompletereport?jobId=' + 730111,
        //     'response')
        //
        // generic_request.GET(
        //     '/api/reports/getcompletereport?jobId=' + 730112,
        //     'response')
        //
        // generic_request.GET(
        //     '/api/reports/getcompletereport?jobId=' + 730113,
        //     'response')
        //
        // cy.getLocalStorage('apiResponse').then(apiResponse => {
        //     cy.log(JSON.stringify(apiResponse));
        // })

        //start X reports for 1 item only
        // for (let i = 0; i < numberOfRequests; i++) {
        //     cy.getLocalStorage('newItem').then(newItem => {
        //         generic_request.POST(
        //             '/api/reports/buildreport',
        //             requestPayloads.reporterPayloadFromItemList(null, [JSON.parse(newItem).id]),
        //             "REPORT Service",
        //             'Item_Report' + i
        //         )
        //     });
        // }

        const reports = ['Big_Case_Report'];

        for (let i = 0; i < 100; i++) {
            reports.push(`Item_Report${i}`);
        }

        for (let i = 0; i < 100; i++) {
            reports.push(`Big_Case_Report_${i}`);
        }

        checkStatusOfJobs(reports);

    });

    it('EXPORT Service', function () {
        api.auth.get_tokens_without_page_load(orgAdmin);

        function checkStatusOfJobs(secondsToWait = 15) {
            cy.wait(secondsToWait * 1000)
            generic_request.GET(
                '/api/exports',
                'response')

            cy.getLocalStorage('apiResponse').then(apiResponse => {
                function printStatuses(apiResponse) {
                    JSON.parse(apiResponse).forEach(item => { // Only first 101 elements
                        if (item.status === 'Complete') {
                            cy.log(`✅ Export FINISHED SUCCESSFULLY`);
                            cy.log(`***************** File link: *****************`);
                            cy.log(`${item["s3FileLink"]}`);
                            cy.log(`***********************************************`);
                        } else {
                            cy.log(`❌ Export NOT FINISHED YET, AFTER ${secondsToWait} seconds. Status is: ${item.status}`);
                        }
                    });
                }

                printStatuses(apiResponse);
            })
        }

        // Requests below are for Dev -- Org #2
        // //  Export from Case View -- Items tab
        // generic_request.POST(
        //     //  '/api/exports/case-items/'+ S.selectedEnvironment.oldActiveCase.id+'?exportTime=2025-12-12T13:16:30.616Z&fileType=0&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     '/api/exports/case-items/' + 7663616 + '?exportTime=2025-12-12T13:16:30.616Z&fileType=0&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     // 7663616 -- case on DEV - in Org#2 with 1500 items
        //     {"orderBy": "SequentialOrgId", "orderByAsc": false, "thenOrderBy": "", "thenOrderByAsc": false},
        //     "EXPORT Service",
        // )
        //
        // // Export from Item View -- Cases tab
        // generic_request.POST(
        //     //  '/api/exports/case-items/'+ S.selectedEnvironment.oldActiveCase.id+'?exportTime=2025-12-12T13:16:30.616Z&fileType=0&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     '/api/exports/item-cases/' + 24653163 + '?exportTime=2025-12-12T14:09:17.175Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     //24653163 -- item on DEV - Org2
        //     {"orderBy": "SequentialOrgId", "orderByAsc": false, "thenOrderBy": "", "thenOrderByAsc": false},
        //     "EXPORT Service",
        // )
        //
        // //  Export from Search Cases page
        // generic_request.POST(
        //     '/api/exports/cases?exportTime=2025-12-12T10:34:03.124Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "CASE_NUMBER",
        //             "typeId": 0,
        //             "fieldName": "CaseNumber",
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}, {
        //                 "id": 1,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"
        //             }, {"id": 2, "name": "TP_SEARCH.SEARCH_CRITERIA.STARTS_WITH"}, {
        //                 "id": 4,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.CONTAINS"
        //             }, {"id": 25, "name": "TP_SEARCH.SEARCH_CRITERIA.TEXT_SEARCH"}],
        //             "searchCriteria": 4,
        //             "model": "test"
        //         }, {
        //             "name": "CASE_OFFICERS",
        //             "typeId": 5,
        //             "fieldName": "CaseOfficers",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-users-and-groups-typeahead field=\"field\" name=\"usersAndGroups\" selected-items=\"field.model\" search-inactive=\"true\"></tp-multi-users-and-groups-typeahead>",
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "isCurrentUserSelected": false,
        //             "searchCriteria": 0,
        //             "model": {"items": []}
        //         }, {
        //             "name": "NAV.TAGS",
        //             "typeId": 5,
        //             "fieldName": "Tags",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-tag-typeahead field=\"field\" tp-model=\"field.model\"></tp-multi-tag-typeahead>",
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "tags": [],
        //             "model": "tags"
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automation #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automation #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [],
        //         "fromOrgIds": [],
        //         "orderBy": "Active",
        //         "orderByAsc": false,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 25,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T10:33:53.550Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [{
        //             "name": "SEARCH.SAVED_SEARCH.ITEMS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_items",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "items"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.PEOPLE",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_people",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "people"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )

        //  Export from Search Items page (88k items)
        // generic_request.POST(
        //     '/api/exports/items?exportTime=2025-12-12T19:19:20.182Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "ITEMS.PRIMARY_CASE_OFFICERS",
        //             "typeId": 5,
        //             "fieldName": "PrimaryCaseOfficers",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-users-and-groups-typeahead field=\"field\" name=\"usersAndGroups\" selected-items=\"field.model\" search-inactive=\"true\"></tp-multi-users-and-groups-typeahead>",
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "model": {"items": []}
        //         }, {
        //             "name": "NAV.TAGS",
        //             "typeId": 5,
        //             "fieldName": "Tags",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-tag-typeahead field=\"field\" tp-model=\"field.model\"></tp-multi-tag-typeahead>",
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "tags": [],
        //             "model": "tags"
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automation #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automation #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [556, 541],
        //         "fromOrgIds": [556, 541],
        //         "orderBy": "SequentialCaseId",
        //         "orderByAsc": false,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 100,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T19:19:09.275Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [{
        //             "name": "SEARCH.SAVED_SEARCH.CASES",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_cases",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.PEOPLE",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_people",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "people"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.DISPOSALS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_disposals",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "disposals"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}, {
        //                 "id": 98484,
        //                 "name": "all disposals",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.CHECKINS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_checkins",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkins"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.CHECKOUTS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_checkouts",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkouts"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}, {
        //                 "id": 98786,
        //                 "name": "checkouts - Nov 26",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }, {
        //                 "id": 98787,
        //                 "name": "checkout on nov 26",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }, {"id": 98870, "name": "Checkout Pallet222", "version": 1, "isVersionTwoWithOnlyAnd": false}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.MOVES",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_moves",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "moves"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.TRANSFERS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_transfers",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "transfers"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.TASK",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_task",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "tasks"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )

        // //  Export from Search Items page (88k items)
        // generic_request.POST(
        //     '/api/exports/items?exportTime=2025-12-12T19:19:20.182Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "ITEMS.PRIMARY_CASE_OFFICERS",
        //             "typeId": 5,
        //             "fieldName": "PrimaryCaseOfficers",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-users-and-groups-typeahead field=\"field\" name=\"usersAndGroups\" selected-items=\"field.model\" search-inactive=\"true\"></tp-multi-users-and-groups-typeahead>",
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "model": {"items": []}
        //         }, {
        //             "name": "NAV.TAGS",
        //             "typeId": 5,
        //             "fieldName": "Tags",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-tag-typeahead field=\"field\" tp-model=\"field.model\"></tp-multi-tag-typeahead>",
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "tags": [],
        //             "model": "tags"
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automation #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automation #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [556, 541],
        //         "fromOrgIds": [556, 541],
        //         "orderBy": "SequentialCaseId",
        //         "orderByAsc": false,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 100,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T19:19:09.275Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [{
        //             "name": "SEARCH.SAVED_SEARCH.CASES",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_cases",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.PEOPLE",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_people",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "people"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.DISPOSALS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_disposals",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "disposals"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}, {
        //                 "id": 98484,
        //                 "name": "all disposals",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.CHECKINS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_checkins",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkins"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.CHECKOUTS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_checkouts",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkouts"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}, {
        //                 "id": 98786,
        //                 "name": "checkouts - Nov 26",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }, {
        //                 "id": 98787,
        //                 "name": "checkout on nov 26",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }, {"id": 98870, "name": "Checkout Pallet222", "version": 1, "isVersionTwoWithOnlyAnd": false}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.MOVES",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_moves",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "moves"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.TRANSFERS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_transfers",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "transfers"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.TASK",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_task",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "tasks"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )
        //
        // //  Export from Search Items page (88k items)
        // generic_request.POST(
        //     '/api/exports/items?exportTime=2025-12-12T19:19:20.182Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "ITEMS.PRIMARY_CASE_OFFICERS",
        //             "typeId": 5,
        //             "fieldName": "PrimaryCaseOfficers",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-users-and-groups-typeahead field=\"field\" name=\"usersAndGroups\" selected-items=\"field.model\" search-inactive=\"true\"></tp-multi-users-and-groups-typeahead>",
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "model": {"items": []}
        //         }, {
        //             "name": "NAV.TAGS",
        //             "typeId": 5,
        //             "fieldName": "Tags",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-tag-typeahead field=\"field\" tp-model=\"field.model\"></tp-multi-tag-typeahead>",
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "tags": [],
        //             "model": "tags"
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automation #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automation #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [556, 541],
        //         "fromOrgIds": [556, 541],
        //         "orderBy": "SequentialCaseId",
        //         "orderByAsc": false,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 100,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T19:19:09.275Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [{
        //             "name": "SEARCH.SAVED_SEARCH.CASES",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_cases",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.PEOPLE",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_people",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "people"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.DISPOSALS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_disposals",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "disposals"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}, {
        //                 "id": 98484,
        //                 "name": "all disposals",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.CHECKINS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_checkins",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkins"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.CHECKOUTS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_checkouts",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkouts"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}, {
        //                 "id": 98786,
        //                 "name": "checkouts - Nov 26",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }, {
        //                 "id": 98787,
        //                 "name": "checkout on nov 26",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }, {"id": 98870, "name": "Checkout Pallet222", "version": 1, "isVersionTwoWithOnlyAnd": false}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.MOVES",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_moves",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "moves"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.TRANSFERS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_transfers",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "transfers"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.TASK",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_task",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "tasks"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )

        //  Export from Search People page--> cca 2,5k records (Dev - Org#2)
        generic_request.POST(
            '/api/exports/people?exportTime=2025-12-12T15:44:45.491Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=6',
            {
                "caseOfficers": [],
                "tags": [],
                "IsSearchingInSublocations": false,
                "DynamicFields": [],
                "StaticFields": [],
                "officeIds": [],
                "custodyOrgIds": [],
                "fromOrgIds": [],
                "orderBy": "Active",
                "orderByAsc": false,
                "thenOrderBy": "",
                "thenOrderByAsc": false,
                "PageSize": 25,
                "peopleIds": [],
                "PageNumber": 1,
                "clientDate": "2025-12-12T18:53:12.583Z",
                "clientTz": "Europe/Berlin",
                "timezoneOffset": -60,
                "SavedSearchEntities": [{
                    "name": "SEARCH.SAVED_SEARCH.CASES",
                    "typeId": 3,
                    "fieldName": "SavedSearchId_cases",
                    "searchCriteriasType": 5,
                    "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
                    "isV2": false,
                    "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                    "dropdownValues": [{"id": null, "name": "Select all"}],
                    "searchCriteria": 0
                }],
                "version": 1
            },
            "EXPORT Service",
        )

        //  Export from Search People page--> cca 2,5k records (Dev - Org#2)
        generic_request.POST(
            '/api/exports/people?exportTime=2025-12-12T15:44:45.491Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=6',
            {
                "caseOfficers": [],
                "tags": [],
                "IsSearchingInSublocations": false,
                "DynamicFields": [],
                "StaticFields": [],
                "officeIds": [],
                "custodyOrgIds": [],
                "fromOrgIds": [],
                "orderBy": "Active",
                "orderByAsc": false,
                "thenOrderBy": "",
                "thenOrderByAsc": false,
                "PageSize": 25,
                "peopleIds": [],
                "PageNumber": 1,
                "clientDate": "2025-12-12T18:53:12.583Z",
                "clientTz": "Europe/Berlin",
                "timezoneOffset": -60,
                "SavedSearchEntities": [{
                    "name": "SEARCH.SAVED_SEARCH.CASES",
                    "typeId": 3,
                    "fieldName": "SavedSearchId_cases",
                    "searchCriteriasType": 5,
                    "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
                    "isV2": false,
                    "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                    "dropdownValues": [{"id": null, "name": "Select all"}],
                    "searchCriteria": 0
                }],
                "version": 1
            },
            "EXPORT Service",
        )

        //  Export from Search People page--> cca 2,5k records (Dev - Org#2)
        generic_request.POST(
            '/api/exports/people?exportTime=2025-12-12T15:44:45.491Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=6',
            {
                "caseOfficers": [],
                "tags": [],
                "IsSearchingInSublocations": false,
                "DynamicFields": [],
                "StaticFields": [],
                "officeIds": [],
                "custodyOrgIds": [],
                "fromOrgIds": [],
                "orderBy": "Active",
                "orderByAsc": false,
                "thenOrderBy": "",
                "thenOrderByAsc": false,
                "PageSize": 25,
                "peopleIds": [],
                "PageNumber": 1,
                "clientDate": "2025-12-12T18:53:12.583Z",
                "clientTz": "Europe/Berlin",
                "timezoneOffset": -60,
                "SavedSearchEntities": [{
                    "name": "SEARCH.SAVED_SEARCH.CASES",
                    "typeId": 3,
                    "fieldName": "SavedSearchId_cases",
                    "searchCriteriasType": 5,
                    "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
                    "isV2": false,
                    "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                    "dropdownValues": [{"id": null, "name": "Select all"}],
                    "searchCriteria": 0
                }],
                "version": 1
            },
            "EXPORT Service",
        )

        //  Export from Search People page--> cca 2,5k records (Dev - Org#2)
        generic_request.POST(
            '/api/exports/people?exportTime=2025-12-12T15:44:45.491Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=6',
            {
                "caseOfficers": [],
                "tags": [],
                "IsSearchingInSublocations": false,
                "DynamicFields": [],
                "StaticFields": [],
                "officeIds": [],
                "custodyOrgIds": [],
                "fromOrgIds": [],
                "orderBy": "Active",
                "orderByAsc": false,
                "thenOrderBy": "",
                "thenOrderByAsc": false,
                "PageSize": 25,
                "peopleIds": [],
                "PageNumber": 1,
                "clientDate": "2025-12-12T18:53:12.583Z",
                "clientTz": "Europe/Berlin",
                "timezoneOffset": -60,
                "SavedSearchEntities": [{
                    "name": "SEARCH.SAVED_SEARCH.CASES",
                    "typeId": 3,
                    "fieldName": "SavedSearchId_cases",
                    "searchCriteriasType": 5,
                    "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
                    "isV2": false,
                    "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                    "dropdownValues": [{"id": null, "name": "Select all"}],
                    "searchCriteria": 0
                }],
                "version": 1
            },
            "EXPORT Service",
        )

        //  Export from Search People page--> cca 2,5k records (Dev - Org#2)
        generic_request.POST(
            '/api/exports/people?exportTime=2025-12-12T15:44:45.491Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=6',
            {
                "caseOfficers": [],
                "tags": [],
                "IsSearchingInSublocations": false,
                "DynamicFields": [],
                "StaticFields": [],
                "officeIds": [],
                "custodyOrgIds": [],
                "fromOrgIds": [],
                "orderBy": "Active",
                "orderByAsc": false,
                "thenOrderBy": "",
                "thenOrderByAsc": false,
                "PageSize": 25,
                "peopleIds": [],
                "PageNumber": 1,
                "clientDate": "2025-12-12T18:53:12.583Z",
                "clientTz": "Europe/Berlin",
                "timezoneOffset": -60,
                "SavedSearchEntities": [{
                    "name": "SEARCH.SAVED_SEARCH.CASES",
                    "typeId": 3,
                    "fieldName": "SavedSearchId_cases",
                    "searchCriteriasType": 5,
                    "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
                    "isV2": false,
                    "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                    "dropdownValues": [{"id": null, "name": "Select all"}],
                    "searchCriteria": 0
                }],
                "version": 1
            },
            "EXPORT Service",
        )

        //  Export from Search People page--> cca 2,5k records (Dev - Org#2)
        generic_request.POST(
            '/api/exports/people?exportTime=2025-12-12T15:44:45.491Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=6',
            {
                "caseOfficers": [],
                "tags": [],
                "IsSearchingInSublocations": false,
                "DynamicFields": [],
                "StaticFields": [],
                "officeIds": [],
                "custodyOrgIds": [],
                "fromOrgIds": [],
                "orderBy": "Active",
                "orderByAsc": false,
                "thenOrderBy": "",
                "thenOrderByAsc": false,
                "PageSize": 25,
                "peopleIds": [],
                "PageNumber": 1,
                "clientDate": "2025-12-12T18:53:12.583Z",
                "clientTz": "Europe/Berlin",
                "timezoneOffset": -60,
                "SavedSearchEntities": [{
                    "name": "SEARCH.SAVED_SEARCH.CASES",
                    "typeId": 3,
                    "fieldName": "SavedSearchId_cases",
                    "searchCriteriasType": 5,
                    "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
                    "isV2": false,
                    "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                    "dropdownValues": [{"id": null, "name": "Select all"}],
                    "searchCriteria": 0
                }],
                "version": 1
            },
            "EXPORT Service",
        )

        // //  Export from Search Tasks page
        // generic_request.POST(
        //     '/api/exports/tasks?exportTime=2025-12-12T14:38:03.949Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "TASKS.CREATION_DATE",
        //             "typeId": 2,
        //             "fieldName": "DateCreated",
        //             "searchCriteriasType": 2,
        //             "searchCriteria": 8,
        //             "model": "2024-12-31T23:00:00.000Z",
        //             "toDate": "2025-05-06T22:00:00.000Z",
        //             "searchCriterias": [{"id": 6, "name": "TP_SEARCH.SEARCH_CRITERIA.BEFORE"}, {
        //                 "id": 7,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.AFTER"
        //             }, {"id": 8, "name": "TP_SEARCH.SEARCH_CRITERIA.BETWEEN"}, {
        //                 "id": 13,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EXACTLY"
        //             }, {"id": 12, "name": "TP_SEARCH.SEARCH_CRITERIA.NEWER_THAN_X"}, {
        //                 "id": 11,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.OLDER_THAN_X"
        //             }, {"id": 18, "name": "TP_SEARCH.SEARCH_CRITERIA.BETWEEN_X_AND_Y"}, {
        //                 "id": 19,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.CURRENT_WEEK"
        //             }, {"id": 20, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_WEEK"}, {
        //                 "id": 21,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.MONTH_TO_DATE"
        //             }, {"id": 22, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_MONTH"}, {
        //                 "id": 23,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.YEAR_TO_DATE"
        //             }, {"id": 24, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_YEAR"}]
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automation #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automation #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [],
        //         "fromOrgIds": [],
        //         "orderBy": "DateCreated",
        //         "orderByAsc": false,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 25,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T15:37:31.718Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )
        //
        // // Export from Search Notes page
        // generic_request.POST(
        //     '/api/exports/notes?exportTime=2025-12-12T14:43:04.678Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "GENERAL.CREATED_DATE",
        //             "typeId": 2,
        //             "fieldName": "Date",
        //             "searchCriteriasType": 2,
        //             "searchCriterias": [{"id": 6, "name": "TP_SEARCH.SEARCH_CRITERIA.BEFORE"}, {
        //                 "id": 7,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.AFTER"
        //             }, {"id": 8, "name": "TP_SEARCH.SEARCH_CRITERIA.BETWEEN"}, {
        //                 "id": 13,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EXACTLY"
        //             }, {"id": 12, "name": "TP_SEARCH.SEARCH_CRITERIA.NEWER_THAN_X"}, {
        //                 "id": 11,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.OLDER_THAN_X"
        //             }, {"id": 18, "name": "TP_SEARCH.SEARCH_CRITERIA.BETWEEN_X_AND_Y"}, {
        //                 "id": 19,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.CURRENT_WEEK"
        //             }, {"id": 20, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_WEEK"}, {
        //                 "id": 21,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.MONTH_TO_DATE"
        //             }, {"id": 22, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_MONTH"}, {
        //                 "id": 23,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.YEAR_TO_DATE"
        //             }, {"id": 24, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_YEAR"}],
        //             "searchCriteria": 23,
        //             "model": null,
        //             "toDate": null
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automation #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automation #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [],
        //         "fromOrgIds": [],
        //         "orderBy": "Date",
        //         "orderByAsc": true,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 25,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T15:39:38.332Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )

        //
        // //  Export from Search Disposal page --> Dev Org#2 286 records
        // generic_request.POST(
        //     '/api/exports/disposals?exportTime=2025-12-12T14:20:52.987Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "ITEMS.DISPOSAL.DISPOSED_BY",
        //             "typeId": 5,
        //             "fieldName": "DisposedById",
        //             "searchCriteriasType": 8,
        //             "typeAheadTemplate": "<tp-multi-users-and-groups-typeahead field=\"field\" name=\"usersAndGroups\" selected-items=\"field.model\" search-inactive=\"true\"></tp-multi-users-and-groups-typeahead>",
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 1,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"
        //             }],
        //             "isCurrentUserSelected": false,
        //             "searchCriteria": 0,
        //             "model": {"items": []}
        //         }, {
        //             "name": "ITEMS.DISPOSAL.DISPOSED_BY.DIVISIONS_UNITS",
        //             "typeId": 5,
        //             "fieldName": "DisposedByDivisionsUnits",
        //             "searchCriteriasType": 5,
        //             "typeAheadTemplate": "<tp-multi-divisions-units-typeahead field=\"field\"name=\"divisionsUnits\" selected-items=\"field.model\"></tp-multi-divisions-units-typeahead>",
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "searchCriteria": 0,
        //             "model": {"items": []}
        //         }, {
        //             "name": "DISPOSAL.DISPOSE_DATE",
        //             "typeId": 2,
        //             "fieldName": "Date",
        //             "searchCriteriasType": 2,
        //             "searchCriterias": [{"id": 6, "name": "TP_SEARCH.SEARCH_CRITERIA.BEFORE"}, {
        //                 "id": 7,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.AFTER"
        //             }, {"id": 8, "name": "TP_SEARCH.SEARCH_CRITERIA.BETWEEN"}, {
        //                 "id": 13,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EXACTLY"
        //             }, {"id": 12, "name": "TP_SEARCH.SEARCH_CRITERIA.NEWER_THAN_X"}, {
        //                 "id": 11,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.OLDER_THAN_X"
        //             }, {"id": 18, "name": "TP_SEARCH.SEARCH_CRITERIA.BETWEEN_X_AND_Y"}, {
        //                 "id": 19,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.CURRENT_WEEK"
        //             }, {"id": 20, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_WEEK"}, {
        //                 "id": 21,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.MONTH_TO_DATE"
        //             }, {"id": 22, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_MONTH"}, {
        //                 "id": 23,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.YEAR_TO_DATE"
        //             }, {"id": 24, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_YEAR"}],
        //             "searchCriteria": 8,
        //             "toDate": "2025-12-11T23:00:00.000Z",
        //             "model": "2024-12-31T23:00:00.000Z"
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automation #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automation #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [],
        //         "fromOrgIds": [],
        //         "orderBy": "Date",
        //         "orderByAsc": false,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 25,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T14:20:47.315Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )

        // code below is needed like this for each export request from search pages
        /*      , {
            "name": "SEARCH.OFFICE_SELECTION",
            "typeId": 7,
            "fieldName": "OfficeSelection",
            "placeholder": "Select an office...",
            "searchCriteriasType": 5,
            "dropdownEntities": {"entity": "offices"},
            "isV2": false,
            "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
            "selectedElements": [
                {"id": office1.id, "name": "Web Test Automation #3 - Cypress Office 1", "selected": true}, {
                    "id": 1130,
                    "name": "Web Test Automation #3 - Cypress Office 2",
                    "selected": true
                }],
            "searchCriteria": 0
        }],
        "officeIds": [office1.id],*/

        // for (let i = 0; i < numberOfRequests; i++) {
        //     D.getNewCaseData()
        //     api.cases.add_new_case(null, null, 'newCase' + i)
        //     cy.wait(3000)
        // }

        // for (let i = 0; i < numberOfRequests; i++) {
        //     cy.getLocalStorage('newCase' + i).then(newCase => {
        //         generic_request.POST(
        //             '/api/exports/case-items/' + 7663616, // case in Org#2 with 8 items
        //             {"orderBy": "SequentialOrgId", "orderByAsc": false, "thenOrderBy": "", "thenOrderByAsc": false},
        //             "EXPORT Service",
        //         )
        //     });
        // }

        checkStatusOfJobs()
    });

    it('LOCATIONS MOVE Service', function () {
        api.auth.get_tokens_without_page_load(orgAdmin);

        let currentLocName, currentParentLocName, newParentLocNameOrId
        let destinationOffice = office1

        function checkStatusOfJobs(secondsToWait = 5) {
            cy.wait(secondsToWait * 1000)
            generic_request.GET(
                '/api/locations/moveJobs',
                'response')

            cy.getLocalStorage('apiResponse').then(apiResponse => {
                function printStatuses(apiResponse) {
                    JSON.parse(apiResponse).forEach(item => {
                        if (item.status === 'Complete') {
                            cy.log(`✅ Location Move Job FINISHED SUCCESSFULLY`);
                        } else {
                            cy.log(`❌ Location Move Job NOT FINISHED YET, AFTER ${secondsToWait} seconds. Status is: ${item.status}`);
                        }
                    });
                }

                printStatuses(apiResponse);
            })
        }

        cy.getLocalStorage('headers').then(headers => {

            let updatedHeaders = JSON.parse(headers);
            //   updatedHeaders.officeid = office2.id
            cy.setLocalStorage('headers', JSON.stringify(updatedHeaders))

            function fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId) {
                if (currentParentLocName) {
                    api.locations.get_and_save_any_location_data_to_local_storage(currentParentLocName)
                    api.locations.get_and_save_any_location_data_to_local_storage(currentLocName, null, currentParentLocName)
                } else {
                    api.locations.get_and_save_any_location_data_to_local_storage(currentLocName)
                }

                api.locations.get_and_save_any_location_data_to_local_storage(newParentLocNameOrId)
            }

            numberOfRequests = 50
            let numberOfItemsInBigLocs = 100

            //   add X number of items to specific locations on root level
            currentParentLocName = null
            for (let i = 1; i < (numberOfRequests + 1); i++) {
                currentParentLocName = '__AAA_Loc1'
                currentLocName = '____CONT_' + i
                fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
                for (let j = 0; j < numberOfItemsInBigLocs; j++) {
                    api.items.add_new_item(true, currentLocName)
                }
            }

            // MOVE X locations
            for (let i = 1; i < numberOfRequests; i++) {

                currentLocName = '____SMJ_BIG_CONT_' + i
                cy.log('Moving location  ' + i)
                // //  -------- moving locations to specific parent location ---> with Locations Update endpoint - PUT request
                // currentParentLocName = null
                // newParentLocNameOrId = '268_parentLoc' // root-level loc in Org#3- Office1
                // fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
                // api.locations.move_location(currentLocName, newParentLocNameOrId, true)


                ////  -------- moving locations to specific parent location within the same office---> with Locations Move endpoint - POST request
                // currentParentLocName = 'BBBB'
                // newParentLocNameOrId = 'AAAA' // root-level loc in Org#3- Office1
                // fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
                // api.locations.move_location_with_request_from_scan_page(currentLocName, newParentLocNameOrId, destinationOffice, orgAdmin)

                //// -------- moving locations to specific parent location in office_2---> with Locations Move endpoint - POST request
                //  newParentLocNameOrId = 542708 // Containers in Dev Org#3- Office2
                //    newParentLocNameOrId = 1166445 // ___NEW_OFF_2 in Pentest Org#3- Office2
                //    currentParentLocName = '___AAAA'
                //    destinationOffice = office2
                //    fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
                //    api.locations.move_location_with_request_from_scan_page(currentLocName, newParentLocNameOrId, destinationOffice, orgAdmin)
                //
                //
                // cy.getLocalStorage('apiResponse').then(apiResponse => {
                //     let response = JSON.parse(apiResponse)
                //     if (response[0].status === 'Complete') {
                ////  -------- moving locations BACK to specific parent location in office_1---> with Locations Move endpoint - POST request
                // updatedHeaders.officeid = office2.id // need this line only when location is already in office 2, and we need to make API actions from that office
                // cy.setLocalStorage('headers', JSON.stringify(updatedHeaders))
                // currentParentLocName = '___NEW_OFF_2'
                // newParentLocNameOrId = 1162711 // '___AAAA' in Org#3- Office1
                // destinationOffice = office1
                // fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
                // api.locations.move_location_with_request_from_scan_page(currentLocName, newParentLocNameOrId, destinationOffice, orgAdmin)
                //    waitAndCheckStatusOfLastJob()
                //     }
                // })


                //  ---------moving items back to the root level
                // updatedHeaders.officeid = office1.id
                // cy.setLocalStorage('headers', JSON.stringify(updatedHeaders))
                // currentParentLocName = '268_parentLoc'
                // fetch_location_IDs(currentLocName, currentParentLocName)
                // api.locations.move_location_to_root_level(currentLocName)
                //
            }


            function waitAndCheckStatusOfLastJob(secondsToWait = 20) {
                cy.wait(secondsToWait * 1000)
                generic_request.GET(
                    '/api/locations/moveJobs',
                    'response')
                cy.getLocalStorage('apiResponse').then(apiResponse => {
                    let response = JSON.parse(apiResponse)
                    if (response[0].status === 'Complete') {
                        cy.log(`✅ Location Move Job FINISHED SUCCESSFULLY`);
                    } else if (response[0].status === 'In Progress') {
                        cy.log(`⚠️ Location Move Job NOT FINISHED YET, AFTER ${secondsToWait} seconds. Status is: ${response[0].status}`);
                        cy.wait(secondsToWait * 1000)
                        generic_request.GET(
                            '/api/locations/moveJobs',
                            'response')
                        cy.getLocalStorage('apiResponse').then(apiResponse => {
                            let response = JSON.parse(apiResponse)
                            if (response[0].status === 'Complete') {
                                cy.log(`✅ Location Move Job FINISHED SUCCESSFULLY`);
                            } else if (response[0].status === 'In Progress') {
                                cy.log(`⚠️ Location Move Job NOT FINISHED YET, AFTER ${secondsToWait * 2} seconds. Status is: ${response[0].status}`);
                                cy.wait(secondsToWait * 1000)
                            } else {
                                cy.log(`❌ Location Move has status ${response[0].status}. Error Message is: ${response[0].error}`);
                            }
                        })
                    }

                })
            }

            //waitAndCheckStatusOfLastJob()

            // cy.wait(40000)
            // for (let i = 0; i < numberOfRequests; i++) {
            //     validate_CoC_of_few_items_in_specific_location(currentLocName, newParentLocNameOrId)
            // }

            // ************ Validate Items CoC ************

            function fetch_item_last_CoC_record_and_validate_note_about_location_move(itemId, currentLocName, currentParentLocName) {
                api.items.get_item_CoC(itemId)
                cy.getLocalStorage("itemCoC").then(cocResponse => {
                    if (currentParentLocName) {
                        expect(JSON.parse(cocResponse)['coC'][0].notes).to.equal(currentLocName + ' moved to ' + currentParentLocName)
                    } else {
                        expect(JSON.parse(cocResponse)['coC'][0].notes).to.equal(currentLocName + ' moved to root level')
                    }
                })
            }

            function validate_CoC_of_all_items_in_specific_location(currentLocName, currentParentLocName) {
                if (currentParentLocName) {
                    api.locations.get_and_save_any_location_data_to_local_storage(currentParentLocName)
                    api.locations.get_and_save_any_location_data_to_local_storage(currentLocName, null, currentParentLocName)
                } else {
                    api.locations.get_and_save_any_location_data_to_local_storage(currentLocName)
                }
                api.items.get_items_stored_in_location(currentLocName)

                cy.getLocalStorage("itemIds").then(ids => {
                    JSON.parse(ids).forEach(id => {
                        fetch_item_last_CoC_record_and_validate_note_about_location_move(id, currentLocName, currentParentLocName)
                    })
                })
            }

            function validate_CoC_of_few_items_in_specific_location(currentLocName, currentParentLocName) {
                if (currentParentLocName) {
                    api.locations.get_and_save_any_location_data_to_local_storage(currentParentLocName)
                    api.locations.get_and_save_any_location_data_to_local_storage(currentLocName, null, currentParentLocName)
                } else {
                    api.locations.get_and_save_any_location_data_to_local_storage(currentLocName)
                }
                api.items.get_items_stored_in_location(currentLocName)

                cy.getLocalStorage("itemIds").then(ids => {
                    fetch_item_last_CoC_record_and_validate_note_about_location_move(JSON.parse(ids)[0], currentLocName, currentParentLocName)

                    fetch_item_last_CoC_record_and_validate_note_about_location_move(JSON.parse(ids)[299], currentLocName, currentParentLocName)
                })
            }


            // for (let i = 0; i < numberOfRequests; i++) {
            //
            //     let currentLocName = 'bigLoc' + i
            //     let currentParentLocName = 'Dec 10, 2025_057_parentLoc'
            //         // currentParentLocName = null // if location is at root level
            //
            //    // validate_CoC_of_all_items_in_specific_location(currentLocName, currentParentLocName)
            //     validate_CoC_of_few_items_in_specific_location(currentLocName, currentParentLocName)
            // }

            //
            // for (let i = 0; i < numberOfRequests; i++) {
            //     // ************ Editing Location Name ************
            //     currentLocName = 'bigLoc-edited' + i
            //    let  newLocName = 'bigLoc' + i
            //     currentParentLocName = 'AAAA'
            //     fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
            //     api.locations.update_location(currentLocName, 'Name', newLocName)
            // }


            // // editing location names of all sublocations --> setting Name = LegacyBarcode
            // for (let i = 0; i < numberOfRequests; i++) {
            //     let parentLocName = '0000001'
            //     api.locations.get_and_save_any_location_data_to_local_storage(parentLocName)
            //     cy.getLocalStorage(parentLocName).then(parentLoc => {
            //         api.locations.get_storage_locations(JSON.parse(parentLoc).id)
            //         cy.getLocalStorage("locations").then(locs => {
            //             JSON.parse(locs).forEach(loc => {
            //                  api.locations.update_location_by_full_loc_object(loc, 'Name', loc.legacyBarcode)
            //             })
            //         })
            //     })
            // }

            // checkStatusOfJobs(10)
        });
    });

    xit('MASS UPDATE BY QUERY Service', function () {
        api.auth.get_tokens(orgAdmin);

        for (let i = 0; i < numberOfRequests; i++) {
            cy.getLocalStorage('newItem').then(newItem => {
                generic_request.PUT(
                    '/api/items/massupdateitemsByquery',
                    requestPayloads.actionsByQueryPayload(JSON.parse(newItem).sequentialOrgId),
                    'MASS UPDATE BY QUERY Service'
                )
            });
        }
    });

    it('PEOPLE MERGE Service', function () {
        api.auth.get_tokens(orgAdmin);

        const PEOPLE_PER_BATCH = 1000;

        const createPeopleBatch = (startIndex) => {
            for (let n = 1; n <= PEOPLE_PER_BATCH; n++) {
                const idx = startIndex + n;
                D.getNewPersonData();
                api.people.add_new_person(null, null, D.newPerson, `person${idx}`);
            }
        };

        const readPeopleBatch = (startIndex) => {
            const keys = Array.from(
                {length: PEOPLE_PER_BATCH},
                (_, i) => `person${startIndex + i + 1}`
            );

            return Cypress.Promise.all(keys.map((k) => cy.getLocalStorage(k)))
                .then((values) => values.map((v) => JSON.parse(v)));
        };

        for (let r = 0; r < numberOfRequests; r++) {
            const start = r * PEOPLE_PER_BATCH;
            createPeopleBatch(start);
        }

        ui.app.pause(3 * numberOfRequests);

        for (let r = 0; r < numberOfRequests; r++) {
            const start = r * PEOPLE_PER_BATCH;

            readPeopleBatch(start).then((people) => {
                const primaryId = people[0].id;
                const mergeIds = people.slice(1).map((p) => p.id);

                generic_request.POST(
                    `/api/people/mergePeople/${primaryId}`,
                    mergeIds,
                    `PEOPLE MERGE Service (job ${r + 1})`
                );
            });
        }
    });

    it('WORKFLOWS Service', function () {
        api.auth.get_tokens(orgAdmin);
        // api.org_settings.enable_all_Case_fields();
        // api.workflows.delete_all_workflows();
        // ui.menu.click_Settings__Workflows();
        // ui.workflows.click_(C.buttons.add)

        // for (let i = 0; i < 1; i++) {
        //     D.generateNewDataSet()
        //     ui.app.clear_gmail_inbox(S.gmailAccount);
        //     ui.workflows.click_(C.buttons.add)
        //     ui.workflows.set_up_workflow(
        //         'workflow_' + i,
        //         C.workflows.types.cases,
        //         powerUser.name,
        //         ['Create new Task'],
        //         C.workflows.executeWhen.edited)
        //         .set_matching_criteria(
        //             C.caseFields.offenseLocation,
        //             C.workflows.operators.equals,
        //             D.editedCase.offenseLocation)
        //         .click_Save();
        // }

        for (let i = 0; i < 30; i++) {
            // UPDATE action for 1k items at a time
            api.cases.generic_PUT_request('/api/items/MassUpdateItemTags',
                {
                    "itemIds": [24663637, 24662631, 24662630, 24662629, 24662628, 24662627, 24662626, 24662625, 24662624, 24662623, 24662622, 24662621, 24662620, 24662619, 24662618, 24662617, 24662616, 24662615, 24662614, 24661995, 24661994, 24661964, 24661963, 24661933, 24661932, 24661902, 24661901, 24661871, 24661870, 24661840, 24661839, 24661809, 24661808, 24661778, 24661777, 24661747, 24661746, 24661716, 24661715, 24661685, 24661684, 24661655, 24661654, 24661624, 24661623, 24661593, 24661592, 24661562, 24661561, 24661531, 24661530, 24661501, 24661500, 24661468, 24661467, 24661436, 24661435, 24661405, 24661404, 24661374, 24661373, 24661343, 24661342, 24661312, 24661311, 24661281, 24661280, 24661250, 24661249, 24661219, 24661218, 24661188, 24661187, 24661157, 24661156, 24661126, 24661125, 24661095, 24661094, 24661064, 24661063, 24661033, 24661032, 24661002, 24661001, 24660971, 24660970, 24660929, 24660928, 24660891, 24660890, 24660841, 24660840, 24660808, 24660807, 24660777, 24660776, 24660746, 24660745, 24660715, 24660714, 24660684, 24660683, 24660653, 24660652, 24660611, 24660610, 24660580, 24660579, 24658538, 24658532, 24658517, 24658514, 24658511, 24658510, 24658509, 24658504, 24658503, 24658502, 24658497, 24658496, 24658489, 24658362, 24658355, 24658342, 24658333, 24658332, 24658331, 24658330, 24658329, 24658324, 24658323, 24658321, 24658315, 24658309, 24658187, 24658179, 24658166, 24658163, 24658160, 24658159, 24658158, 24658157, 24658156, 24658151, 24658144, 24658142, 24658135, 24653290, 24653287, 24653274, 24653271, 24653270, 24653269, 24653268, 24653263, 24653262, 24653257, 24653252, 24653251, 24653020, 24653017, 24653004, 24652999, 24652998, 24652996, 24652995, 24652990, 24652985, 24652984, 24652979, 24652972, 24641801, 24641796, 24641785, 24641780, 24641779, 24641778, 24641777, 24641776, 24641771, 24641766, 24641765, 24641764, 24641759, 24641618, 24641614, 24641601, 24641600, 24641599, 24641594, 24641593, 24641592, 24641591, 24641586, 24641581, 24641580, 24641574, 24641440, 24641439, 24641427, 24641424, 24641423, 24641422, 24641421, 24641420, 24641417, 24641416, 24641411, 24641410, 24641265, 24641261, 24641249, 24641247, 24641246, 24641245, 24641240, 24641239, 24641238, 24641233, 24641232, 24641227, 24641222, 24641080, 24641079, 24641064, 24641063, 24641062, 24641059, 24641058, 24641057, 24641056, 24641051, 24641050, 24641049, 24641040, 24640859, 24640857, 24640846, 24640843, 24640842, 24640841, 24640840, 24640839, 24640836, 24640835, 24640834, 24640829, 24640824, 24640661, 24640653, 24640639, 24640630, 24640629, 24640628, 24640627, 24640626, 24640621, 24640620, 24640618, 24640612, 24640607, 24640350, 24640344, 24640329, 24640328, 24640327, 24640322, 24640321, 24640320, 24640315, 24640314, 24640313, 24640308, 24640305, 24638077, 24637925, 24637919, 24637905, 24637898, 24637895, 24637894, 24637893, 24637892, 24637887, 24637885, 24637883, 24637878, 24637872, 24637750, 24637745, 24637730, 24637729, 24637728, 24637723, 24637722, 24637721, 24637716, 24637715, 24637712, 24637709, 24637704, 24637577, 24637575, 24637563, 24637561, 24637560, 24637558, 24637557, 24637556, 24637555, 24637550, 24637549, 24637548, 24637539, 24514265, 24514262, 24514251, 24514248, 24514247, 24514246, 24514245, 24514244, 24514239, 24514238, 24514237, 24514236, 24514227, 24473878, 24473876, 24473865, 24473863, 24473862, 24473859, 24473858, 24473857, 24473852, 24473851, 24473850, 24473841, 24473637, 24473635, 24473624, 24473621, 24473620, 24473619, 24473618, 24473616, 24473614, 24473613, 24473608, 24473599, 24473433, 24473427, 24473415, 24473410, 24473409, 24473408, 24473407, 24473406, 24473401, 24473396, 24473395, 24473394, 24473387, 24472722, 24472717, 24472705, 24472700, 24472699, 24472698, 24472697, 24472692, 24472689, 24472686, 24472685, 24472679, 24472677, 24472540, 24472537, 24472525, 24472523, 24472522, 24472519, 24472516, 24472515, 24472514, 24472509, 24472508, 24472502, 24472496, 24472360, 24472356, 24472344, 24472339, 24472338, 24472337, 24472336, 24472331, 24472326, 24472325, 24472324, 24472318, 24472316, 24472129, 24472124, 24472113, 24472108, 24472107, 24472106, 24472105, 24472100, 24472095, 24472094, 24472091, 24472086, 24472084, 24471742, 24471739, 24471729, 24471726, 24471725, 24471724, 24471723, 24471722, 24471720, 24471718, 24471717, 24471712, 24471705, 24471509, 24471504, 24471489, 24471484, 24471483, 24471478, 24471477, 24471476, 24471474, 24471468, 24471467, 24471466, 24471460, 24471216, 24471207, 24471191, 24471190, 24471189, 24471184, 24471183, 24471182, 24471181, 24471180, 24471175, 24471172, 24471167, 24470910, 24470902, 24470886, 24470881, 24470880, 24470879, 24470878, 24470877, 24470876, 24470871, 24470869, 24470867, 24470862, 24470732, 24470724, 24470708, 24470703, 24470702, 24470701, 24470700, 24470699, 24470694, 24470692, 24470690, 24470689, 24470683, 24470556, 24470550, 24470536, 24470531, 24470530, 24470529, 24470528, 24470527, 24470522, 24470521, 24470520, 24470518, 24470512, 24470342, 24470337, 24470322, 24470321, 24470320, 24470319, 24470318, 24470317, 24470312, 24470310, 24470308, 24470303, 24470301, 24470267, 24470164, 24470162, 24470149, 24470147, 24470146, 24470141, 24470140, 24470139, 24470138, 24470137, 24470132, 24470125, 24469990, 24469988, 24469975, 24469973, 24469972, 24469967, 24469966, 24469965, 24469964, 24469963, 24469957, 24469950, 24469800, 24469798, 24469788, 24469787, 24469786, 24469784, 24469782, 24469781, 24469778, 24469777, 24469772, 24469770, 24451988, 24443666, 24443665, 24443664, 24443663, 24443662, 24443661, 24443660, 24443659, 24443658, 24443657, 24443656, 24443655, 24443654, 24443653, 24443646, 24443645, 24443644, 24443643, 24443642, 24443641, 24443640, 24443613, 24443612, 24443611, 24443610, 24443609, 24443608, 24443607, 24443606, 24443605, 24443604, 24443603, 24443602, 24443601, 24443600, 24443593, 24443592, 24443591, 24443590, 24443589, 24443588, 24443587, 24443570, 24443569, 24443568, 24443567, 24443566, 24443565, 24443564, 24443563, 24443562, 24443561, 24443560, 24443559, 24443558, 24443557, 24443550, 24443549, 24443548, 24443547, 24443546, 24443545, 24443543, 24443469, 24443468, 24443462, 24443461, 24443460, 24443459, 24443458, 24443457, 24443456, 24443455, 24443454, 24443453, 24443452, 24443451, 24443450, 24443449, 24443448, 24443447, 24443446, 24443445, 24443444, 24443443, 24443442, 24443441, 24443440, 24443433, 24443432, 24443431, 24443430, 24443428, 24443426, 24443424, 24443421, 24443420, 24443419, 24443418, 24443417, 24443416, 24443415, 24443414, 24443413, 24443412, 24443411, 24443410, 24443409, 24443408, 24443401, 24443400, 24443399, 24443398, 24443397, 24443396, 24443395, 24443389, 24443388, 24443387, 24443386, 24443385, 24443384, 24443383, 24443382, 24443381, 24443380, 24443379, 24443378, 24443377, 24443376, 24443369, 24443368, 24443367, 24443366, 24443365, 24443364, 24443361, 24443357, 24443356, 24443355, 24443354, 24443353, 24443352, 24443351, 24443350, 24443349, 24443348, 24443347, 24443346, 24443345, 24443344, 24443337, 24443336, 24443335, 24443334, 24443333, 24443332, 24443330, 24443319, 24443318, 24443317, 24443316, 24443315, 24443314, 24443313, 24443312, 24443311, 24443310, 24443309, 24443308, 24443307, 24443306, 24443299, 24443298, 24443297, 24443296, 24443295, 24443294, 24443292, 24443124, 24443123, 24443122, 24443121, 24443120, 24443119, 24443118, 24443117, 24443116, 24443115, 24443114, 24443113, 24443112, 24443109, 24443100, 24443099, 24443098, 24443097, 24443096, 24443095, 24443094, 24442698, 24442675, 24442666, 24442665, 24442664, 24442663, 24442648, 24442647, 24442646, 24442645, 24442644, 24442643, 24442642, 24442641, 24442640, 24442639, 24442638, 24442637, 24442636, 24442635, 24442634, 24442633, 24442632, 24442631, 24442630, 24442629, 24442628, 24442627, 24442626, 24442625, 24442624, 24442623, 24442622, 24442621, 24442620, 24442619, 24442618, 24442617, 24442616, 24442615, 24442614, 24442613, 24442612, 24442611, 24442610, 24442609, 24442608, 24442607, 24442606, 24442605, 24442604, 24442603, 24442602, 24442601, 24442600, 24442599, 24442598, 24442597, 24442596, 24442595, 24442594, 24442580, 24442579, 24442578, 24442577, 24442576, 24442575, 24442574, 24442573, 24442572, 24442571, 24442570, 24442569, 24442568, 24442567, 24442566, 24442565, 24442564, 24442563, 24442562, 24442561, 24442560, 24442559, 24442558, 24442557, 24442556, 24442555, 24442554, 24442553, 24442552, 24442551, 24442550, 24442543, 24442542, 24442541, 24442540, 24442539, 24442538, 24442536, 24442490, 24442488, 24442487, 24442486, 24442485, 24442484, 24442483, 24442482, 24442481, 24442480, 24442479, 24442478, 24442477, 24442476, 24442475, 24442474, 24442473, 24442472, 24442471, 24442470, 24442469, 24442468, 24442467, 24442466, 24442465, 24442464, 24442463, 24442462, 24442461, 24442460, 24442459, 24442458, 24442457, 24442456, 24442455, 24442454, 24442453, 24442452, 24442451, 24442450, 24442449, 24442448, 24442447, 24442446, 24442445, 24442444, 24442443, 24442442, 24442441, 24442440, 24442439, 24442438, 24442437, 24442436, 24442435, 24442434, 24442433, 24442430, 24442429, 24442428, 24442427, 24442426, 24442425, 24442424, 24442423, 24442410, 24442409, 24442408, 24442407, 24442406, 24442405, 24442404, 24442403, 24442402, 24442401, 24442400, 24442399, 24442398, 24442397, 24442396, 24442395, 24442394, 24442393, 24442392, 24442391, 24442390, 24442389, 24442388, 24442387, 24442386, 24442385, 24442384, 24442383, 24442382, 24442381, 24442380, 24442379, 24442378, 24442377, 24442376, 24442375, 24442374, 24442373, 24442372, 24442371, 24442370, 24442369, 24442368, 24442367, 24442366, 24442365, 24442364, 24442363, 24442362, 24442361, 24442360, 24442359, 24442358, 24442357, 24442356, 24442354, 24442353, 24442352, 24442351, 24442350, 24442349, 24442348, 24442347, 24442346, 24442345, 24442344, 24442343, 24442342, 24442341, 24442340, 24442339, 24442338, 24442337, 24442315, 24442293, 24442292, 24442291, 24442287, 24442280, 24442279, 24442278, 24442277, 24442276, 24442275, 24442274, 24442273, 24442272, 24442271, 24442270, 24442269],
                    "currentOfficeId": 11081,
                    "itemMassUpdateActions": {
                        "descriptionSelected": true,
                        "description": "workflow- kubernetes - test1",
                        "recoveryLocationSelected": false,
                        "recoveryLocation": "",
                        "recoveredBySelected": false,
                        "recoveredById": 0,
                        "submittedBySelected": false,
                        "submittedById": 0,
                        "categorySelected": false,
                        "custodyReasonSelected": false,
                        "recoveryDateSelected": false,
                        "recoveryDate": "2026-02-20T13:13:28.566Z",
                        "modelSelected": false,
                        "model": "11223344",
                        "makeSelected": false,
                        "make": "",
                        "peopleSelected": false,
                        "peopleIds": [],
                        "peopleNames": [],
                        "tagsSelected": false,
                        "tagsAction": 0,
                        "tags": []
                    }
                },
            )
        }


        // for (let i = 0; i < numberOfRequests; i++) {
        //     let newCase = D.getNewCaseData()
        //     api.cases.add_new_case(newCase.caseNumber, newCase, 'case' + i)
        // }
        //
        // for (let i = 0; i < numberOfRequests; i++) {
        //     api.cases.edit_newly_added_case(false, 'case' + i);
        // }
    });

    it('VERIFICATIONS Service', function () {

        // DEV---> Web Test Automation #1 -
        for (let i = 0; i < 1; i++) {
            // TRANSFER action for 1k items at a time

            if (S.parallelJobNumber === 1) {
                api.auth.get_tokens_without_page_load(orgAdmin)
                generic_request.POST('/api/transfers/V2',
                    {
                        "transaction": {
                            "transferredFromId": 5077358,
                            "transferredToId": 5084990,
                            "notes": "transfer with verifications",
                            "date": "2026-03-06T09:14:32.810Z",
                            "itemIds": [24663637, 24662631, 24662630, 24662629, 24662628, 24662627, 24662626, 24662625, 24662624, 24662623, 24662622, 24662621, 24662620, 24662619, 24662618, 24662617, 24662616, 24662615, 24662614, 24661995, 24661994, 24661964, 24661963, 24661933, 24661932, 24661902, 24661901, 24661871, 24661870, 24661840, 24661839, 24661809, 24661808, 24661778, 24661777, 24661747, 24661746, 24661716, 24661715, 24661685, 24661684, 24661655, 24661654, 24661624, 24661623, 24661593, 24661592, 24661562, 24661561, 24661531, 24661530, 24661501, 24661500, 24661468, 24661467, 24661436, 24661435, 24661405, 24661404, 24661374, 24661373, 24661343, 24661342, 24661312, 24661311, 24661281, 24661280, 24661250, 24661249, 24661219, 24661218, 24661188, 24661187, 24661157, 24661156, 24661126, 24661125, 24661095, 24661094, 24661064, 24661063, 24661033, 24661032, 24661002, 24661001, 24660971, 24660970, 24660929, 24660928, 24660891, 24660890, 24660841, 24660840, 24660808, 24660807, 24660777, 24660776, 24660746, 24660745, 24660715, 24660714, 24660684, 24660683, 24660653, 24660652, 24660611, 24660610, 24660580, 24660579, 24660539, 24660538, 24660537, 24660536, 24660535, 24660534, 24660533, 24660532, 24660531, 24660530, 24660529, 24660528, 24660527, 24660526, 24660525, 24660524, 24660523, 24660522, 24660521, 24660520, 24660519, 24660518, 24660517, 24660516, 24660515, 24660514, 24660513, 24660512, 24660511, 24660510, 24660509, 24660508, 24660507, 24660506, 24660505, 24660504, 24660503, 24660502, 24660501, 24660500, 24660499, 24660498, 24660497, 24660496, 24660495, 24660494, 24660493, 24660492, 24660491, 24660490, 24660489, 24660488, 24660487, 24660486, 24660485, 24660484, 24660483, 24660482, 24660481, 24660480, 24660479, 24660478, 24660477, 24660476, 24660475, 24660474, 24660473, 24660472, 24660471, 24660470, 24660469, 24660468, 24660467, 24660466, 24660465, 24660464, 24660463, 24660462, 24660461, 24660460, 24660459, 24660458, 24660457, 24660456, 24660455, 24660454, 24660453, 24660452, 24660451, 24660450, 24660449, 24660448, 24660447, 24660446, 24660445, 24660444, 24660443, 24660442, 24660441, 24660440, 24660418, 24660417, 24660416, 24660415, 24660414, 24660413, 24660412, 24660411, 24660410, 24660409, 24660408, 24660407, 24660406, 24660405, 24660404, 24660403, 24660402, 24660401, 24660400, 24660399, 24660398, 24660397, 24660396, 24660395, 24660394, 24660393, 24660392, 24660391, 24660390, 24660389, 24660388, 24660387, 24660386, 24660385, 24660384, 24660383, 24660382, 24660381, 24660380, 24660379, 24660378, 24660377, 24660376, 24660375, 24660374, 24660373, 24660372, 24660371, 24660370, 24660369, 24660368, 24660367, 24660366, 24660365, 24660364, 24660363, 24660362, 24660361, 24660360, 24660359, 24660358, 24660357, 24660356, 24660355, 24660354, 24660353, 24660352, 24660351, 24660350, 24660349, 24660348, 24660347, 24660346, 24660345, 24660344, 24660343, 24660342, 24660341, 24660340, 24660339, 24660338, 24660337, 24660336, 24660335, 24660334, 24660333, 24660332, 24660331, 24660330, 24660329, 24660328, 24660327, 24660326, 24660325, 24660324, 24660323, 24660322, 24660321, 24660320, 24660319, 24660311, 24660310, 24660309, 24660308, 24660307, 24660306, 24660305, 24660304, 24660303, 24660302, 24660301, 24660300, 24660299, 24660298, 24660297, 24660296, 24660295, 24660294, 24660293, 24660292, 24660291, 24660290, 24660289, 24660288, 24660287, 24660286, 24660285, 24660284, 24660283, 24660282, 24660281, 24660280, 24660279, 24660278, 24660277, 24660276, 24660275, 24660274, 24660273, 24660272, 24660271, 24660270, 24660269, 24660268, 24660267, 24660266, 24660265, 24660264, 24660263, 24660262, 24660261, 24660260, 24660259, 24660258, 24660257, 24660256, 24660255, 24660254, 24660253, 24660252, 24660251, 24660250, 24660249, 24660248, 24660247, 24660246, 24660245, 24660244, 24660243, 24660242, 24660241, 24660240, 24660239, 24660238, 24660237, 24660236, 24660235, 24660234, 24660233, 24660232, 24660231, 24660230, 24660229, 24660228, 24660227, 24660226, 24660225, 24660224, 24660223, 24660222, 24660221, 24660220, 24660219, 24660218, 24660217, 24660216, 24660215, 24660214, 24660213, 24660212, 24660210, 24660209, 24660208, 24660207, 24660206, 24660205, 24660204, 24660203, 24660202, 24660201, 24660200, 24660199, 24660198, 24660197, 24660196, 24660195, 24660194, 24660193, 24660192, 24660191, 24660190, 24660189, 24660188, 24660187, 24660186, 24660185, 24660184, 24660183, 24660182, 24660181, 24660180, 24660179, 24660178, 24660177, 24660176, 24660175, 24660174, 24660173, 24660172, 24660171, 24660170, 24660169, 24660168, 24660167, 24660166, 24660165, 24660164, 24660163, 24660162, 24660161, 24660160, 24660159, 24660158, 24660157, 24660156, 24660155, 24660154, 24660153, 24660152, 24660151, 24660150, 24660149, 24660148, 24660147, 24660146, 24660145, 24660144, 24660143, 24660142, 24660141, 24660140, 24660139, 24660138, 24660137, 24660136, 24660135, 24660134, 24660133, 24660132, 24660131, 24660130, 24660129, 24660128, 24660127, 24660126, 24660125, 24660124, 24660123, 24660122, 24660121, 24660120, 24660119, 24660118, 24660117, 24660116, 24660115, 24660114, 24660113, 24660112, 24660111, 24660109, 24660108, 24660107, 24660106, 24660105, 24660104, 24660103, 24660102, 24660101, 24660100, 24660099, 24660098, 24660097, 24660096, 24660095, 24660094, 24660093, 24660092, 24660091, 24660090, 24660089, 24660088, 24660087, 24660086, 24660085, 24660084, 24660083, 24660082, 24660081, 24660080, 24660079, 24660078, 24660077, 24660076, 24660075, 24660074, 24660073, 24660072, 24660071, 24660070, 24660069, 24660068, 24660067, 24660066, 24660065, 24660064, 24660063, 24660062, 24660061, 24660060, 24660059, 24660058, 24660057, 24660056, 24660055, 24660054, 24660053, 24660052, 24660051, 24660050, 24660049, 24660048, 24660047, 24660046, 24660045, 24660044, 24660043, 24660042, 24660041, 24660040, 24660039, 24660038, 24660037, 24660036, 24660035, 24660034, 24660033, 24660032, 24660031, 24660030, 24660029, 24660028, 24660027, 24660026, 24660025, 24660024, 24660023, 24660022, 24660021, 24660020, 24660019, 24660018, 24660017, 24660016, 24660015, 24660014, 24660013, 24660012, 24660011, 24660010, 24660000, 24659999, 24659998, 24659997, 24659996, 24659995, 24659994, 24659993, 24659992, 24659991, 24659990, 24659989, 24659988, 24659987, 24659986, 24659985, 24659984, 24659983, 24659982, 24659981, 24659980, 24659979, 24659978, 24659977, 24659976, 24659975, 24659974, 24659973, 24659972, 24659971, 24659970, 24659969, 24659968, 24659967, 24659966, 24659965, 24659964, 24659963, 24659962, 24659961, 24659960, 24659959, 24659958, 24659957, 24659956, 24659955, 24659954, 24659953, 24659952, 24659951, 24659950, 24659949, 24659948, 24659947, 24659946, 24659945, 24659944, 24659943, 24659942, 24659941, 24659940, 24659939, 24659938, 24659937, 24659936, 24659935, 24659934, 24659933, 24659932, 24659931, 24659930, 24659929, 24659928, 24659927, 24659926, 24659925, 24659924, 24659923, 24659922, 24659921, 24659920, 24659919, 24659918, 24659917, 24659916, 24659915, 24659914, 24659913, 24659912, 24659911, 24659910, 24659909, 24659908, 24659907, 24659906, 24659905, 24659904, 24659903, 24659902, 24659901, 24659897, 24659896, 24659895, 24659894, 24659893, 24659892, 24659891, 24659890, 24659889, 24659888, 24659887, 24659886, 24659885, 24659884, 24659883, 24659882, 24659881, 24659880, 24659879, 24659878, 24659877, 24659876, 24659875, 24659874, 24659873, 24659872, 24659871, 24659870, 24659869, 24659868, 24659867, 24659866, 24659865, 24659864, 24659863, 24659862, 24659861, 24659860, 24659859, 24659858, 24659857, 24659856, 24659855, 24659854, 24659853, 24659852, 24659851, 24659850, 24659849, 24659848, 24659847, 24659846, 24659845, 24659844, 24659843, 24659842, 24659841, 24659840, 24659839, 24659838, 24659837, 24659836, 24659835, 24659834, 24659833, 24659832, 24659831, 24659830, 24659829, 24659828, 24659827, 24659826, 24659825, 24659824, 24659823, 24659822, 24659821, 24659820, 24659819, 24659818, 24659817, 24659816, 24659815, 24659814, 24659813, 24659812, 24659811, 24659810, 24659809, 24659808, 24659807, 24659806, 24659805, 24659804, 24659803, 24659802, 24659801, 24659800, 24659799, 24659798, 24659794, 24659793, 24659792, 24659791, 24659790, 24659789, 24659788, 24659787, 24659786, 24659785, 24659784, 24659783, 24659782, 24659781, 24659780, 24659779, 24659778, 24659777, 24659776, 24659775, 24659774, 24659773, 24659772, 24659771, 24659770, 24659769, 24659768, 24659767, 24659766, 24659765, 24659764, 24659763, 24659762, 24659761, 24659760, 24659759, 24659758, 24659757, 24659756, 24659755, 24659754, 24659753, 24659752, 24659751, 24659750, 24659749, 24659748, 24659747, 24659746, 24659745, 24659744, 24659743, 24659742, 24659741, 24659740, 24659739, 24659738, 24659737, 24659736, 24659735, 24659734, 24659733, 24659732, 24659731, 24659730, 24659729, 24659728, 24659727, 24659726, 24659725, 24659724, 24659723, 24659722, 24659721, 24659720, 24659719, 24659718, 24659717, 24659716, 24659715, 24659714, 24659713, 24659712, 24659711, 24659710, 24659709, 24659708, 24659707, 24659706, 24659705, 24659704, 24659703, 24659702, 24659701, 24659700, 24659699, 24659698, 24659697, 24659696, 24659695, 24659670, 24659669, 24659668, 24659667, 24659666, 24659665, 24659664, 24659663, 24659662, 24659661, 24659660, 24659659, 24659658, 24659657, 24659656, 24659655, 24659654, 24659653, 24659652, 24659651, 24659650, 24659649, 24659648, 24659647, 24659646, 24659645, 24659644, 24659643, 24659642, 24659641, 24659640, 24659639, 24659638, 24659637, 24659636, 24659635, 24659634, 24659633, 24659632, 24659631, 24659630, 24659629, 24659628, 24659627, 24659626, 24659625, 24659624, 24659623, 24659622, 24659621, 24659620, 24659619, 24659618, 24659617, 24659616, 24659615, 24659614, 24659613, 24659612, 24659611, 24659610, 24659609, 24659608, 24659607, 24659606, 24659605, 24659604, 24659603, 24659602, 24659601, 24659600, 24659599, 24659598, 24659597, 24659596, 24659595, 24659594, 24659593, 24659592, 24659591, 24659590, 24659589, 24659588, 24659587, 24659586, 24659585, 24659584, 24659583, 24659582, 24659581, 24659580]
                        },
                        "sigdata": "iVBORw0KGgoAAAANSUhEUgAAAIwAAAA3CAYAAADezaKIAAAOqElEQVR4AeybB5BVRRaGzw9rwggmFhNJKQsQJSiOKygGQEQtBUEwFBSuAUFQMZSAmDAjuiCYRVFRDBQquLqrICoiIohiAJVBBTEnMBWs21837753X9hhYHbAN/fVO+92nz7dffrcv0+f7p6pZsknsUA5LJAAphzGSkTNCgJmt91269W8efMJ7du3n969e/dFPXr0WJxQ8dmAd9u5c+cZJSUl4xs0aNDfTYq/OCr4zQeYXVu0aPHvG264YdQDDzzQbcSIEW2GDBnS8NJLL62bUPHZgHd77bXX/u3OO+/sOXLkyBEOONNr1arVuBBisgGz6+GHH/6vsWPHtmvatGmNQpUSfnFaoH79+tXduy857rjjJteoUaNFvlHGAOM8y7jrrruu0VZbbWXVqlVLqAraYJNNNrFBgwbVb9Wq1RgHmJzlKQIMMctFF13UessttzRJCVVxG7ilqnnjxo2HOtDEvhFgdt555/bNmjWrIW2cYJESvaTKs4FzINXr1KnTMoYWl4kAs+OOO/5VqjyFpKQvaeO2gXMitR1GYt8IMDVr1qwjbdwDkBL9pEq1Qc0YWlwmAsxf3CcJdJNAPxMDkhxE4t8IMHF2kksskN8CMcBkoqtQumfPngYtXry44Lb7iSee8DLvv/9+QZlC7ZfF/+OPP4z2Tz/9dDvyyCOtXbt21rt3b7vttttsxYoVOf1dffXVXpey2t0Q5V9++WWOvhtCj0J95oNMBBgqSSpzO/3aa68Z5PbqBWWXLl3qZX766aeCMlLZfUlxmZ9//tm6du3KOYG98MIL9uOPP5pbSW369Ol200032cEHH2xvv/12rM93333X6yLF25I2bP6SSy6xgQMHxnSVNqxOUrx/MJENmggwFEjxClJuHjlo7ty5dv/99+cdMOWQlFtfWneeu6Yw+j3ttNM8SN544w0PnFdeecXcGZIH0Nlnn22rV6+O9LrsssvskUceifLSuvcvrUXdtZSZMGECJtro9JLSY/QKZv1EgJHSglLhNPW32WYbg9ypsOFNpFx55CApt0xaN97LL79sHCwOHjzY6tWrFxnbnRlY37597ZhjjrHPPvss5mXc4ZMdeOCBkay0bn1LFVuvom0jVax+UmgPPTMpAgxMXFBZhNy2225r7iTQVq5c6Wd2dh1JiOWsz8QYgKxjx4625557Gk/yv/zyS45sdpvk8Rz0+fHHH+eV79Onjw0bNsx22GGHqPyKK66wbt26RXnagR588EHP33vvvc3dndikSZPsscce87xvvvnGy6fyyI8ZM8aOPvpoQ57n1KlTvQxlKfr+++8tJdekSRM/RmIslsuUzHvvvef7wEALFizwafqhvJCu6MMYaBs5CNl+/foZtujSpYsdcMABhjelDEIXd1nsbYwu1L/nnntydEa2EKFjNlXLZqxt/qSTTvIzd8aMGfboo4+WWe3TTz+1ww47zG6//XZr2LCh9wh169a10aNHm7vwtG+//bbMNvAUCBE/Pfvssx6w5FPUvHlzAzS0a2s+vJSZM2euyYUH9YkhACDy6HPeeefZzTffbMj++uuvXhBvRZ7JgZ7u5NPog7jojDPOiI0bIGMTd8vvveApp5xiPXr08Drecsstfpw0utlmmxkeMTONtyafT1f46IMeH330EVlPyL766quG3qTp/4cffvBl8+fPt/bt29vDDz9seFj0KC0t9ZOJCeWF1vEnAoyktUKfrfmASncd7o2DEl988UVUX5KXkhTxhg4dap9//rndcccdfhZecMEF5q7U7cYbbzTAdPnll0eytJ2PaOOII44wDMKL3meffezEE0/0OyRmbr46UtAlVUbAjiFph5lN7MM40As9zH1SslKo+8wzz9jTTz9tzFDioaeeespJmY0bNy7SmbZ4cbycxx9/3Jjd7NBefPFFb6Px48d72b322svojwbwsqSPOuooXyaF/lL9Zz6Rl+Tl4Euyr776yn777TebN2+esSPFW1N21VVXeVvjRWkfu82aNcsGDBhgd911lxE/IVcWSUEfy/hEgIEnqcy1HjlIku2+++5+SWK3goGkUJ9ySAp5Zurzzz9v+++/v3eRUuBL8lteZgFGLmtXxS06gfZDDz3k69WqVcuYZcOHDzcA0LlzZ/vggw9iY0APSAp98uLIA1BuZqXAZ3lEP8qkwCMNAU5erhT4++67r/cSeEUp8EpKSoyXAwClwJNkLN/ujs7YQktpPu1C0v/mSaEcWUiK50844QTDLpL8k8mETeizTZs2kS0Y6/nnn+/By4oghXakwk/6y6YIMFLhilK6LNWAFHicgbRo0cJYIpiJUuAjJ4U0noV8y5YtowFIoUySHXTQQRRbqXObUpov5U+n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",
                        "mediumFileData": []
                    },
                )
            }

            if (S.parallelJobNumber === 2) {

                let user2 = Object.assign({}, orgAdmin)
                user2.email = 'qa+21926803696@trackerproducts.com'
                user2.password = 'Test12345.'
                api.auth.get_tokens_without_page_load(user2)
                generic_request.POST('/api/transfers/V2',
                    {
                        "transaction": {
                            "transferredFromId": 5084990,
                            "transferredToId": 5077358,
                            "notes": "fdgvdf",
                            "date": "2026-03-06T09:23:36.832Z",
                            "itemIds": [24659579, 24659578, 24659577, 24659576, 24659575, 24659574, 24659573, 24659572, 24659571, 24659559, 24659558, 24659557, 24659556, 24659555, 24659554, 24659553, 24659552, 24659551, 24659550, 24659549, 24659548, 24659547, 24659546, 24659545, 24659544, 24659543, 24659542, 24659541, 24659540, 24659539, 24659538, 24659537, 24659536, 24659535, 24659534, 24659533, 24659532, 24659531, 24659530, 24659529, 24659528, 24659527, 24659526, 24659525, 24659524, 24659523, 24659522, 24659521, 24659520, 24659519, 24659518, 24659517, 24659516, 24659515, 24659514, 24659513, 24659512, 24659511, 24659510, 24659509, 24659508, 24659507, 24659506, 24659505, 24659504, 24659503, 24659502, 24659501, 24659500, 24659499, 24659498, 24659497, 24659496, 24659495, 24659494, 24659493, 24659492, 24659491, 24659490, 24659489, 24659488, 24659487, 24659486, 24659485, 24659484, 24659483, 24659482, 24659481, 24659480, 24659479, 24659478, 24659477, 24659476, 24659475, 24659474, 24659473, 24659472, 24659471, 24659470, 24659469, 24659468, 24659467, 24659466, 24659465, 24659464, 24659463, 24659462, 24659461, 24659460, 24659454, 24659453, 24659452, 24659451, 24659450, 24659449, 24659448, 24659447, 24659446, 24659445, 24659444, 24659443, 24659442, 24659441, 24659440, 24659439, 24659438, 24659437, 24659436, 24659435, 24659434, 24659433, 24659432, 24659431, 24659430, 24659429, 24659428, 24659427, 24659426, 24659425, 24659424, 24659423, 24659422, 24659421, 24659420, 24659419, 24659418, 24659417, 24659416, 24659415, 24659414, 24659413, 24659412, 24659411, 24659410, 24659409, 24659408, 24659407, 24659406, 24659405, 24659404, 24659403, 24659402, 24659401, 24659400, 24659399, 24659398, 24659397, 24659396, 24659395, 24659394, 24659393, 24659392, 24659391, 24659390, 24659389, 24659388, 24659387, 24659386, 24659385, 24659384, 24659383, 24659382, 24659381, 24659380, 24659379, 24659378, 24659377, 24659376, 24659375, 24659374, 24659373, 24659372, 24659371, 24659370, 24659369, 24659368, 24659367, 24659366, 24659365, 24659364, 24659363, 24659362, 24659361, 24659360, 24659359, 24659358, 24659357, 24659356, 24659355, 24659345, 24659344, 24659343, 24659342, 24659341, 24659340, 24659339, 24659338, 24659337, 24659336, 24659335, 24659334, 24659333, 24659332, 24659331, 24659330, 24659329, 24659328, 24659327, 24659326, 24659325, 24659324, 24659323, 24659322, 24659321, 24659320, 24659319, 24659318, 24659317, 24659316, 24659315, 24659314, 24659313, 24659312, 24659311, 24659310, 24659309, 24659308, 24659307, 24659306, 24659305, 24659304, 24659303, 24659302, 24659301, 24659300, 24659299, 24659298, 24659297, 24659296, 24659295, 24659294, 24659293, 24659292, 24659291, 24659290, 24659289, 24659288, 24659287, 24659286, 24659285, 24659284, 24659283, 24659282, 24659281, 24659280, 24659279, 24659278, 24659277, 24659276, 24659275, 24659274, 24659273, 24659272, 24659271, 24659270, 24659269, 24659268, 24659267, 24659266, 24659265, 24659264, 24659263, 24659262, 24659261, 24659260, 24659259, 24659258, 24659257, 24659256, 24659255, 24659254, 24659253, 24659252, 24659251, 24659250, 24659249, 24659248, 24659247, 24659246, 24659244, 24659243, 24659242, 24659241, 24659240, 24659239, 24659238, 24659237, 24659236, 24659235, 24659234, 24659233, 24659232, 24659231, 24659230, 24659229, 24659228, 24659227, 24659226, 24659225, 24659224, 24659223, 24659222, 24659221, 24659220, 24659219, 24659218, 24659217, 24659216, 24659215, 24659214, 24659213, 24659212, 24659211, 24659210, 24659209, 24659208, 24659207, 24659206, 24659205, 24659204, 24659203, 24659202, 24659201, 24659200, 24659199, 24659198, 24659197, 24659196, 24659195, 24659194, 24659193, 24659192, 24659191, 24659190, 24659189, 24659188, 24659187, 24659186, 24659185, 24659184, 24659183, 24659182, 24659181, 24659180, 24659179, 24659178, 24659177, 24659176, 24659175, 24659174, 24659173, 24659172, 24659171, 24659170, 24659169, 24659168, 24659167, 24659166, 24659165, 24659164, 24659163, 24659162, 24659161, 24659160, 24659159, 24659158, 24659157, 24659156, 24659155, 24659154, 24659153, 24659152, 24659151, 24659150, 24659149, 24659148, 24659147, 24659146, 24659145, 24659143, 24659142, 24659141, 24659140, 24659139, 24659138, 24659137, 24659136, 24659135, 24659134, 24659133, 24659132, 24659131, 24659130, 24659129, 24659128, 24659127, 24659126, 24659125, 24659124, 24659123, 24659122, 24659121, 24659120, 24659119, 24659118, 24659117, 24659116, 24659115, 24659114, 24659113, 24659112, 24659111, 24659110, 24659109, 24659108, 24659107, 24659106, 24659105, 24659104, 24659103, 24659102, 24659101, 24659100, 24659099, 24659098, 24659097, 24659096, 24659095, 24659094, 24659093, 24659092, 24659091, 24659090, 24659089, 24659088, 24659087, 24659086, 24659085, 24659084, 24659083, 24659082, 24659081, 24659080, 24659079, 24659078, 24659077, 24659076, 24659075, 24659074, 24659073, 24659072, 24659071, 24659070, 24659069, 24659068, 24659067, 24659066, 24659065, 24659064, 24659063, 24659062, 24659061, 24659060, 24659059, 24659058, 24659057, 24659056, 24659055, 24659054, 24659053, 24659052, 24659051, 24659050, 24659049, 24659048, 24659047, 24659046, 24659045, 24659044, 24659042, 24659041, 24659040, 24659039, 24659038, 24659037, 24659036, 24659035, 24659034, 24659033, 24659032, 24659031, 24659030, 24659029, 24659028, 24659027, 24659026, 24659025, 24659024, 24659023, 24659022, 24659021, 24659020, 24659019, 24659018, 24659017, 24659016, 24659015, 24659014, 24659013, 24659012, 24659011, 24659010, 24659009, 24659008, 24659007, 24659006, 24659005, 24659004, 24659003, 24659002, 24659001, 24659000, 24658999, 24658998, 24658997, 24658996, 24658995, 24658994, 24658993, 24658992, 24658991, 24658990, 24658989, 24658988, 24658987, 24658986, 24658985, 24658984, 24658983, 24658982, 24658981, 24658980, 24658979, 24658978, 24658977, 24658976, 24658975, 24658974, 24658973, 24658972, 24658971, 24658970, 24658969, 24658968, 24658967, 24658966, 24658965, 24658964, 24658963, 24658962, 24658961, 24658960, 24658959, 24658958, 24658957, 24658956, 24658955, 24658954, 24658953, 24658952, 24658951, 24658950, 24658949, 24658948, 24658947, 24658946, 24658945, 24658944, 24658943, 24658638, 24658637, 24658636, 24658635, 24658634, 24658633, 24658632, 24658631, 24658630, 24658629, 24658628, 24658627, 24658626, 24658625, 24658624, 24658623, 24658622, 24658621, 24658620, 24658619, 24658618, 24658617, 24658616, 24658615, 24658614, 24658613, 24658612, 24658611, 24658610, 24658609, 24658608, 24658607, 24658606, 24658605, 24658604, 24658603, 24658602, 24658601, 24658600, 24658599, 24658598, 24658597, 24658596, 24658595, 24658594, 24658593, 24658592, 24658591, 24658590, 24658589, 24658588, 24658587, 24658586, 24658585, 24658584, 24658583, 24658582, 24658581, 24658580, 24658579, 24658578, 24658577, 24658576, 24658575, 24658574, 24658573, 24658572, 24658571, 24658570, 24658569, 24658568, 24658567, 24658566, 24658565, 24658564, 24658563, 24658562, 24658561, 24658560, 24658559, 24658558, 24658557, 24658556, 24658555, 24658554, 24658553, 24658552, 24658551, 24658550, 24658549, 24658548, 24658547, 24658546, 24658545, 24658544, 24658543, 24658542, 24658541, 24658540, 24658539, 24658538, 24658532, 24658529, 24658528, 24658525, 24658524, 24658523, 24658520, 24658517, 24658514, 24658511, 24658510, 24658509, 24658504, 24658503, 24658502, 24658497, 24658496, 24658489, 24658462, 24658461, 24658460, 24658459, 24658458, 24658457, 24658456, 24658455, 24658454, 24658453, 24658452, 24658451, 24658450, 24658449, 24658448, 24658447, 24658446, 24658445, 24658444, 24658443, 24658442, 24658441, 24658440, 24658439, 24658438, 24658437, 24658436, 24658435, 24658434, 24658433, 24658432, 24658431, 24658430, 24658429, 24658428, 24658427, 24658426, 24658425, 24658424, 24658423, 24658422, 24658421, 24658420, 24658419, 24658418, 24658417, 24658416, 24658415, 24658414, 24658413, 24658412, 24658411, 24658410, 24658409, 24658408, 24658407, 24658406, 24658405, 24658404, 24658403, 24658402, 24658401, 24658400, 24658399, 24658398, 24658397, 24658396, 24658395, 24658394, 24658393, 24658392, 24658391, 24658390, 24658389, 24658388, 24658387, 24658386, 24658385, 24658384, 24658383, 24658382, 24658381, 24658380, 24658379, 24658378, 24658377, 24658376, 24658375, 24658374, 24658373, 24658372, 24658371, 24658370, 24658369, 24658368, 24658367, 24658366, 24658365, 24658364, 24658363, 24658362, 24658355, 24658353, 24658351, 24658350, 24658345, 24658344, 24658343, 24658342, 24658333, 24658332, 24658331, 24658330, 24658329, 24658324, 24658323, 24658321, 24658315, 24658309, 24658287, 24658286, 24658285, 24658284, 24658283, 24658282, 24658281, 24658280, 24658279, 24658278, 24658277, 24658276, 24658275, 24658274, 24658273, 24658272, 24658271, 24658270, 24658269, 24658268, 24658267, 24658266, 24658265, 24658264, 24658263, 24658262, 24658261, 24658260, 24658259, 24658258, 24658257, 24658256, 24658255, 24658254, 24658253, 24658252, 24658251, 24658250, 24658249, 24658248, 24658247, 24658246, 24658245, 24658244, 24658243, 24658242, 24658241, 24658240, 24658239, 24658238, 24658237, 24658236, 24658235, 24658234, 24658233, 24658232, 24658231, 24658230, 24658229, 24658228, 24658227, 24658226, 24658225, 24658224, 24658223, 24658222, 24658221, 24658220, 24658219, 24658218, 24658217, 24658216, 24658215, 24658214, 24658213, 24658212, 24658211, 24658210, 24658209, 24658208, 24658207, 24658206, 24658205, 24658204, 24658203, 24658202, 24658201, 24658200, 24658199, 24658198, 24658197, 24658196, 24658195, 24658194, 24658193, 24658192, 24658191, 24658190, 24658189, 24658188, 24658187, 24658179, 24658176, 24658175, 24658172, 24658171, 24658170, 24658168, 24658166, 24658163, 24658160, 24658159, 24658158, 24658157, 24658156, 24658151, 24658144, 24658142, 24658135, 24653390, 24653389, 24653388, 24653387, 24653386, 24653385, 24653384, 24653383, 24653382, 24653381, 24653380, 24653379, 24653378, 24653377, 24653376, 24653375, 24653374, 24653373, 24653372, 24653371, 24653370, 24653369, 24653368, 24653367, 24653366, 24653365, 24653364, 24653363, 24653362, 24653361, 24653360, 24653359, 24653358, 24653357]
                        },
                        "sigdata": "iVBORw0KGgoAAAANSUhEUgAAAIwAAAA3CAYAAADezaKIAAAOqElEQVR4AeybB5BVRRaGzw9rwggmFhNJKQsQJSiOKygGQEQtBUEwFBSuAUFQMZSAmDAjuiCYRVFRDBQquLqrICoiIohiAJVBBTEnMBWs21837753X9hhYHbAN/fVO+92nz7dffrcv0+f7p6pZsknsUA5LJAAphzGSkTNCgJmt91269W8efMJ7du3n969e/dFPXr0WJxQ8dmAd9u5c+cZJSUl4xs0aNDfTYq/OCr4zQeYXVu0aPHvG264YdQDDzzQbcSIEW2GDBnS8NJLL62bUPHZgHd77bXX/u3OO+/sOXLkyBEOONNr1arVuBBisgGz6+GHH/6vsWPHtmvatGmNQpUSfnFaoH79+tXduy857rjjJteoUaNFvlHGAOM8y7jrrruu0VZbbWXVqlVLqAraYJNNNrFBgwbVb9Wq1RgHmJzlKQIMMctFF13UessttzRJCVVxG7ilqnnjxo2HOtDEvhFgdt555/bNmjWrIW2cYJESvaTKs4FzINXr1KnTMoYWl4kAs+OOO/5VqjyFpKQvaeO2gXMitR1GYt8IMDVr1qwjbdwDkBL9pEq1Qc0YWlwmAsxf3CcJdJNAPxMDkhxE4t8IMHF2kksskN8CMcBkoqtQumfPngYtXry44Lb7iSee8DLvv/9+QZlC7ZfF/+OPP4z2Tz/9dDvyyCOtXbt21rt3b7vttttsxYoVOf1dffXVXpey2t0Q5V9++WWOvhtCj0J95oNMBBgqSSpzO/3aa68Z5PbqBWWXLl3qZX766aeCMlLZfUlxmZ9//tm6du3KOYG98MIL9uOPP5pbSW369Ol200032cEHH2xvv/12rM93333X6yLF25I2bP6SSy6xgQMHxnSVNqxOUrx/MJENmggwFEjxClJuHjlo7ty5dv/99+cdMOWQlFtfWneeu6Yw+j3ttNM8SN544w0PnFdeecXcGZIH0Nlnn22rV6+O9LrsssvskUceifLSuvcvrUXdtZSZMGECJtro9JLSY/QKZv1EgJHSglLhNPW32WYbg9ypsOFNpFx55CApt0xaN97LL79sHCwOHjzY6tWrFxnbnRlY37597ZhjjrHPPvss5mXc4ZMdeOCBkay0bn1LFVuvom0jVax+UmgPPTMpAgxMXFBZhNy2225r7iTQVq5c6Wd2dh1JiOWsz8QYgKxjx4625557Gk/yv/zyS45sdpvk8Rz0+fHHH+eV79Onjw0bNsx22GGHqPyKK66wbt26RXnagR588EHP33vvvc3dndikSZPsscce87xvvvnGy6fyyI8ZM8aOPvpoQ57n1KlTvQxlKfr+++8tJdekSRM/RmIslsuUzHvvvef7wEALFizwafqhvJCu6MMYaBs5CNl+/foZtujSpYsdcMABhjelDEIXd1nsbYwu1L/nnntydEa2EKFjNlXLZqxt/qSTTvIzd8aMGfboo4+WWe3TTz+1ww47zG6//XZr2LCh9wh169a10aNHm7vwtG+//bbMNvAUCBE/Pfvssx6w5FPUvHlzAzS0a2s+vJSZM2euyYUH9YkhACDy6HPeeefZzTffbMj++uuvXhBvRZ7JgZ7u5NPog7jojDPOiI0bIGMTd8vvveApp5xiPXr08Drecsstfpw0utlmmxkeMTONtyafT1f46IMeH330EVlPyL766quG3qTp/4cffvBl8+fPt/bt29vDDz9seFj0KC0t9ZOJCeWF1vEnAoyktUKfrfmASncd7o2DEl988UVUX5KXkhTxhg4dap9//rndcccdfhZecMEF5q7U7cYbbzTAdPnll0eytJ2PaOOII44wDMKL3meffezEE0/0OyRmbr46UtAlVUbAjiFph5lN7MM40As9zH1SslKo+8wzz9jTTz9tzFDioaeeespJmY0bNy7SmbZ4cbycxx9/3Jjd7NBefPFFb6Px48d72b322svojwbwsqSPOuooXyaF/lL9Zz6Rl+Tl4Euyr776yn777TebN2+esSPFW1N21VVXeVvjRWkfu82aNcsGDBhgd911lxE/IVcWSUEfy/hEgIEnqcy1HjlIku2+++5+SWK3goGkUJ9ySAp5Zurzzz9v+++/v3eRUuBL8lteZgFGLmtXxS06gfZDDz3k69WqVcuYZcOHDzcA0LlzZ/vggw9iY0APSAp98uLIA1BuZqXAZ3lEP8qkwCMNAU5erhT4++67r/cSeEUp8EpKSoyXAwClwJNkLN/ujs7YQktpPu1C0v/mSaEcWUiK50844QTDLpL8k8mETeizTZs2kS0Y6/nnn+/By4oghXakwk/6y6YIMFLhilK6LNWAFHicgbRo0cJYIpiJUuAjJ4U0noV8y5YtowFIoUySHXTQQRRbqXObUpov5U+n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",
                        "mediumFileData": []
                    },
                )
            }

            if (S.parallelJobNumber === 3) {
                let user3 = Object.assign({}, orgAdmin)
                user3.email = 'qa+21926784309@trackerproducts.com'
                user3.password = 'Test12345.'
                api.auth.get_tokens_without_page_load(user3)
                generic_request.POST('/api/transfers/V2',
                    {
                        "transaction": {
                            "transferredFromId": 5079777,
                            "transferredToId": 5077358,
                            "notes": "gdfgfd",
                            "date": "2026-03-06T10:19:58.294Z",
                            "itemIds": [24653356, 24653355, 24653354, 24653353, 24653352, 24653351, 24653350, 24653349, 24653348, 24653347, 24653346, 24653345, 24653344, 24653343, 24653342, 24653341, 24653340, 24653339, 24653338, 24653337, 24653336, 24653335, 24653334, 24653333, 24653332, 24653331, 24653330, 24653329, 24653328, 24653327, 24653326, 24653325, 24653324, 24653323, 24653322, 24653321, 24653320, 24653319, 24653318, 24653317, 24653316, 24653315, 24653314, 24653313, 24653312, 24653311, 24653310, 24653309, 24653308, 24653307, 24653306, 24653305, 24653304, 24653303, 24653302, 24653301, 24653300, 24653299, 24653298, 24653297, 24653296, 24653295, 24653294, 24653293, 24653292, 24653291, 24653290, 24653287, 24653282, 24653281, 24653280, 24653278, 24653276, 24653275, 24653274, 24653271, 24653270, 24653269, 24653268, 24653263, 24653262, 24653257, 24653252, 24653251, 24653146, 24653145, 24653120, 24653119, 24653118, 24653117, 24653116, 24653115, 24653114, 24653113, 24653112, 24653111, 24653110, 24653109, 24653108, 24653107, 24653106, 24653105, 24653104, 24653103, 24653102, 24653101, 24653100, 24653099, 24653098, 24653097, 24653096, 24653095, 24653094, 24653093, 24653092, 24653091, 24653090, 24653089, 24653088, 24653087, 24653086, 24653085, 24653084, 24653083, 24653082, 24653081, 24653080, 24653079, 24653078, 24653077, 24653076, 24653075, 24653074, 24653073, 24653072, 24653071, 24653070, 24653069, 24653068, 24653067, 24653066, 24653065, 24653064, 24653063, 24653062, 24653061, 24653060, 24653059, 24653058, 24653057, 24653056, 24653055, 24653054, 24653053, 24653052, 24653051, 24653050, 24653049, 24653048, 24653047, 24653046, 24653045, 24653044, 24653043, 24653042, 24653041, 24653040, 24653039, 24653038, 24653037, 24653036, 24653035, 24653034, 24653033, 24653032, 24653031, 24653030, 24653029, 24653028, 24653027, 24653026, 24653025, 24653024, 24653023, 24653022, 24653021, 24653020, 24653017, 24653014, 24653013, 24653011, 24653009, 24653008, 24653007, 24653004, 24652999, 24652998, 24652996, 24652995, 24652990, 24652985, 24652984, 24652979, 24652972, 24641901, 24641900, 24641899, 24641898, 24641897, 24641896, 24641895, 24641894, 24641893, 24641892, 24641891, 24641890, 24641889, 24641888, 24641887, 24641886, 24641885, 24641884, 24641883, 24641882, 24641881, 24641880, 24641879, 24641878, 24641877, 24641876, 24641875, 24641874, 24641873, 24641872, 24641871, 24641870, 24641869, 24641868, 24641867, 24641866, 24641865, 24641864, 24641863, 24641862, 24641861, 24641860, 24641859, 24641858, 24641857, 24641856, 24641855, 24641854, 24641853, 24641852, 24641851, 24641850, 24641849, 24641848, 24641847, 24641846, 24641845, 24641844, 24641843, 24641842, 24641841, 24641840, 24641839, 24641838, 24641837, 24641836, 24641835, 24641834, 24641833, 24641832, 24641831, 24641830, 24641829, 24641828, 24641827, 24641826, 24641825, 24641824, 24641823, 24641822, 24641821, 24641820, 24641819, 24641818, 24641817, 24641816, 24641815, 24641814, 24641813, 24641812, 24641811, 24641810, 24641809, 24641808, 24641807, 24641806, 24641805, 24641804, 24641803, 24641802, 24641801, 24641796, 24641793, 24641792, 24641790, 24641789, 24641787, 24641786, 24641785, 24641780, 24641779, 24641778, 24641777, 24641776, 24641771, 24641766, 24641765, 24641764, 24641759, 24641718, 24641717, 24641716, 24641715, 24641714, 24641713, 24641712, 24641711, 24641710, 24641709, 24641708, 24641707, 24641706, 24641705, 24641704, 24641703, 24641702, 24641701, 24641700, 24641699, 24641698, 24641697, 24641696, 24641695, 24641694, 24641693, 24641692, 24641691, 24641690, 24641689, 24641688, 24641687, 24641686, 24641685, 24641684, 24641683, 24641682, 24641681, 24641680, 24641679, 24641678, 24641677, 24641676, 24641675, 24641674, 24641673, 24641672, 24641671, 24641670, 24641669, 24641668, 24641667, 24641666, 24641665, 24641664, 24641663, 24641662, 24641661, 24641660, 24641659, 24641658, 24641657, 24641656, 24641655, 24641654, 24641653, 24641652, 24641651, 24641650, 24641649, 24641648, 24641647, 24641646, 24641645, 24641644, 24641643, 24641642, 24641641, 24641640, 24641639, 24641638, 24641637, 24641636, 24641635, 24641634, 24641633, 24641632, 24641631, 24641630, 24641629, 24641628, 24641627, 24641626, 24641625, 24641624, 24641623, 24641622, 24641621, 24641620, 24641619, 24641618, 24641614, 24641611, 24641610, 24641607, 24641606, 24641605, 24641603, 24641601, 24641600, 24641599, 24641594, 24641593, 24641592, 24641591, 24641586, 24641581, 24641580, 24641574, 24641540, 24641539, 24641538, 24641537, 24641536, 24641535, 24641534, 24641533, 24641532, 24641531, 24641530, 24641529, 24641528, 24641527, 24641526, 24641525, 24641524, 24641523, 24641522, 24641521, 24641520, 24641519, 24641518, 24641517, 24641516, 24641515, 24641514, 24641513, 24641512, 24641511, 24641510, 24641509, 24641508, 24641507, 24641506, 24641505, 24641504, 24641503, 24641502, 24641501, 24641500, 24641499, 24641498, 24641497, 24641496, 24641495, 24641494, 24641493, 24641492, 24641491, 24641490, 24641489, 24641488, 24641487, 24641486, 24641485, 24641484, 24641483, 24641482, 24641481, 24641480, 24641479, 24641478, 24641477, 24641476, 24641475, 24641474, 24641473, 24641472, 24641471, 24641470, 24641469, 24641468, 24641467, 24641466, 24641465, 24641464, 24641463, 24641462, 24641461, 24641460, 24641459, 24641458, 24641457, 24641456, 24641455, 24641454, 24641453, 24641452, 24641451, 24641450, 24641449, 24641448, 24641447, 24641446, 24641445, 24641444, 24641443, 24641442, 24641441, 24641440, 24641439, 24641437, 24641436, 24641434, 24641431, 24641429, 24641428, 24641427, 24641424, 24641423, 24641422, 24641421, 24641420, 24641417, 24641416, 24641411, 24641410, 24641365, 24641364, 24641363, 24641362, 24641361, 24641360, 24641359, 24641358, 24641357, 24641356, 24641355, 24641354, 24641353, 24641352, 24641351, 24641350, 24641349, 24641348, 24641347, 24641346, 24641345, 24641344, 24641343, 24641342, 24641341, 24641340, 24641339, 24641338, 24641337, 24641336, 24641335, 24641334, 24641333, 24641332, 24641331, 24641330, 24641329, 24641328, 24641327, 24641326, 24641325, 24641324, 24641323, 24641322, 24641321, 24641320, 24641319, 24641318, 24641317, 24641316, 24641315, 24641314, 24641313, 24641312, 24641311, 24641310, 24641309, 24641308, 24641307, 24641306, 24641305, 24641304, 24641303, 24641302, 24641301, 24641300, 24641299, 24641298, 24641297, 24641296, 24641295, 24641294, 24641293, 24641292, 24641291, 24641290, 24641289, 24641288, 24641287, 24641286, 24641285, 24641284, 24641283, 24641282, 24641281, 24641280, 24641279, 24641278, 24641277, 24641276, 24641275, 24641274, 24641273, 24641272, 24641271, 24641270, 24641269, 24641268, 24641267, 24641266, 24641265, 24641261, 24641258, 24641257, 24641255, 24641253, 24641252, 24641251, 24641249, 24641247, 24641246, 24641245, 24641240, 24641239, 24641238, 24641233, 24641232, 24641227, 24641222, 24641185, 24641184, 24641183, 24641182, 24641181, 24641180, 24641179, 24641178, 24641177, 24641176, 24641175, 24641174, 24641173, 24641172, 24641171, 24641170, 24641169, 24641168, 24641167, 24641166, 24641165, 24641164, 24641163, 24641162, 24641161, 24641160, 24641159, 24641158, 24641157, 24641156, 24641155, 24641154, 24641153, 24641152, 24641151, 24641150, 24641149, 24641148, 24641147, 24641146, 24641145, 24641144, 24641143, 24641142, 24641141, 24641140, 24641139, 24641138, 24641137, 24641136, 24641135, 24641134, 24641133, 24641132, 24641131, 24641130, 24641129, 24641128, 24641127, 24641126, 24641125, 24641124, 24641123, 24641122, 24641121, 24641120, 24641119, 24641118, 24641117, 24641116, 24641115, 24641114, 24641113, 24641112, 24641111, 24641110, 24641109, 24641108, 24641107, 24641106, 24641105, 24641104, 24641103, 24641102, 24641101, 24641100, 24641099, 24641098, 24641097, 24641096, 24641095, 24641094, 24641093, 24641092, 24641091, 24641090, 24641089, 24641088, 24641087, 24641086, 24641080, 24641079, 24641075, 24641074, 24641070, 24641069, 24641068, 24641067, 24641064, 24641063, 24641062, 24641059, 24641058, 24641057, 24641056, 24641051, 24641050, 24641049, 24641040, 24640959, 24640958, 24640957, 24640956, 24640955, 24640954, 24640953, 24640952, 24640951, 24640950, 24640949, 24640948, 24640947, 24640946, 24640945, 24640944, 24640943, 24640942, 24640941, 24640940, 24640939, 24640938, 24640937, 24640936, 24640935, 24640934, 24640933, 24640932, 24640931, 24640930, 24640929, 24640928, 24640927, 24640926, 24640925, 24640924, 24640923, 24640922, 24640921, 24640920, 24640919, 24640918, 24640917, 24640916, 24640915, 24640914, 24640913, 24640912, 24640911, 24640910, 24640909, 24640908, 24640907, 24640906, 24640905, 24640904, 24640903, 24640902, 24640901, 24640900, 24640899, 24640898, 24640897, 24640896, 24640895, 24640894, 24640893, 24640892, 24640891, 24640890, 24640889, 24640888, 24640887, 24640886, 24640885, 24640884, 24640883, 24640882, 24640881, 24640880, 24640879, 24640878, 24640877, 24640876, 24640875, 24640874, 24640873, 24640872, 24640871, 24640870, 24640869, 24640868, 24640867, 24640866, 24640865, 24640864, 24640863, 24640862, 24640861, 24640860, 24640859, 24640857, 24640856, 24640854, 24640853, 24640852, 24640850, 24640848, 24640847, 24640846, 24640843, 24640842, 24640841, 24640840, 24640839, 24640836, 24640835, 24640834, 24640829, 24640824, 24640768, 24640762, 24640761, 24640760, 24640759, 24640758, 24640757, 24640756, 24640755, 24640754, 24640753, 24640752, 24640751, 24640750, 24640749, 24640748, 24640747, 24640746, 24640745, 24640744, 24640743, 24640742, 24640741, 24640740, 24640739, 24640738, 24640737, 24640736, 24640735, 24640734, 24640733, 24640732, 24640731, 24640730, 24640729, 24640728, 24640727, 24640726, 24640725, 24640724, 24640723, 24640722, 24640721, 24640720, 24640719, 24640718, 24640717, 24640716, 24640715, 24640714, 24640713, 24640712, 24640711, 24640710, 24640709, 24640708, 24640707, 24640706, 24640705, 24640704, 24640703, 24640702, 24640701, 24640700, 24640699, 24640698, 24640697, 24640696, 24640695, 24640694, 24640693, 24640692, 24640691, 24640690, 24640689, 24640688, 24640687, 24640686, 24640685, 24640684, 24640683, 24640682]
                        },
                        "sigdata": "iVBORw0KGgoAAAANSUhEUgAAAIwAAAA3CAYAAADezaKIAAAOqElEQVR4AeybB5BVRRaGzw9rwggmFhNJKQsQJSiOKygGQEQtBUEwFBSuAUFQMZSAmDAjuiCYRVFRDBQquLqrICoiIohiAJVBBTEnMBWs21837753X9hhYHbAN/fVO+92nz7dffrcv0+f7p6pZsknsUA5LJAAphzGSkTNCgJmt91269W8efMJ7du3n969e/dFPXr0WJxQ8dmAd9u5c+cZJSUl4xs0aNDfTYq/OCr4zQeYXVu0aPHvG264YdQDDzzQbcSIEW2GDBnS8NJLL62bUPHZgHd77bXX/u3OO+/sOXLkyBEOONNr1arVuBBisgGz6+GHH/6vsWPHtmvatGmNQpUSfnFaoH79+tXduy857rjjJteoUaNFvlHGAOM8y7jrrruu0VZbbWXVqlVLqAraYJNNNrFBgwbVb9Wq1RgHmJzlKQIMMctFF13UessttzRJCVVxG7ilqnnjxo2HOtDEvhFgdt555/bNmjWrIW2cYJESvaTKs4FzINXr1KnTMoYWl4kAs+OOO/5VqjyFpKQvaeO2gXMitR1GYt8IMDVr1qwjbdwDkBL9pEq1Qc0YWlwmAsxf3CcJdJNAPxMDkhxE4t8IMHF2kksskN8CMcBkoqtQumfPngYtXry44Lb7iSee8DLvv/9+QZlC7ZfF/+OPP4z2Tz/9dDvyyCOtXbt21rt3b7vttttsxYoVOf1dffXVXpey2t0Q5V9++WWOvhtCj0J95oNMBBgqSSpzO/3aa68Z5PbqBWWXLl3qZX766aeCMlLZfUlxmZ9//tm6du3KOYG98MIL9uOPP5pbSW369Ol200032cEHH2xvv/12rM93333X6yLF25I2bP6SSy6xgQMHxnSVNqxOUrx/MJENmggwFEjxClJuHjlo7ty5dv/99+cdMOWQlFtfWneeu6Yw+j3ttNM8SN544w0PnFdeecXcGZIH0Nlnn22rV6+O9LrsssvskUceifLSuvcvrUXdtZSZMGECJtro9JLSY/QKZv1EgJHSglLhNPW32WYbg9ypsOFNpFx55CApt0xaN97LL79sHCwOHjzY6tWrFxnbnRlY37597ZhjjrHPPvss5mXc4ZMdeOCBkay0bn1LFVuvom0jVax+UmgPPTMpAgxMXFBZhNy2225r7iTQVq5c6Wd2dh1JiOWsz8QYgKxjx4625557Gk/yv/zyS45sdpvk8Rz0+fHHH+eV79Onjw0bNsx22GGHqPyKK66wbt26RXnagR588EHP33vvvc3dndikSZPsscce87xvvvnGy6fyyI8ZM8aOPvpoQ57n1KlTvQxlKfr+++8tJdekSRM/RmIslsuUzHvvvef7wEALFizwafqhvJCu6MMYaBs5CNl+/foZtujSpYsdcMABhjelDEIXd1nsbYwu1L/nnntydEa2EKFjNlXLZqxt/qSTTvIzd8aMGfboo4+WWe3TTz+1ww47zG6//XZr2LCh9wh169a10aNHm7vwtG+//bbMNvAUCBE/Pfvssx6w5FPUvHlzAzS0a2s+vJSZM2euyYUH9YkhACDy6HPeeefZzTffbMj++uuvXhBvRZ7JgZ7u5NPog7jojDPOiI0bIGMTd8vvveApp5xiPXr08Drecsstfpw0utlmmxkeMTONtyafT1f46IMeH330EVlPyL766quG3qTp/4cffvBl8+fPt/bt29vDDz9seFj0KC0t9ZOJCeWF1vEnAoyktUKfrfmASncd7o2DEl988UVUX5KXkhTxhg4dap9//rndcccdfhZecMEF5q7U7cYbbzTAdPnll0eytJ2PaOOII44wDMKL3meffezEE0/0OyRmbr46UtAlVUbAjiFph5lN7MM40As9zH1SslKo+8wzz9jTTz9tzFDioaeeespJmY0bNy7SmbZ4cbycxx9/3Jjd7NBefPFFb6Px48d72b322svojwbwsqSPOuooXyaF/lL9Zz6Rl+Tl4Euyr776yn777TebN2+esSPFW1N21VVXeVvjRWkfu82aNcsGDBhgd911lxE/IVcWSUEfy/hEgIEnqcy1HjlIku2+++5+SWK3goGkUJ9ySAp5Zurzzz9v+++/v3eRUuBL8lteZgFGLmtXxS06gfZDDz3k69WqVcuYZcOHDzcA0LlzZ/vggw9iY0APSAp98uLIA1BuZqXAZ3lEP8qkwCMNAU5erhT4++67r/cSeEUp8EpKSoyXAwClwJNkLN/ujs7YQktpPu1C0v/mSaEcWUiK50844QTDLpL8k8mETeizTZs2kS0Y6/nnn+/By4oghXakwk/6y6YIMFLhilK6LNWAFHicgbRo0cJYIpiJUuAjJ4U0noV8y5YtowFIoUySHXTQQRRbqXObUpov5U+n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",
                        "mediumFileData": []
                    },)

            }

            if (S.parallelJobNumber === 4) {
                let user4 = Object.assign({}, orgAdmin)
                user4.email = 'qa+21926827590@trackerproducts.com'
                user4.password = 'Test12345.'
                api.auth.get_tokens_without_page_load(user4)
                generic_request.POST('/api/transfers/V2',
                    {
                        "transaction": {
                            "transferredFromId": 5084990,
                            "transferredToId": 5077358,
                            "notes": "gdfg",
                            "date": "2026-03-06T11:59:09.156Z",
                            "itemIds": [24472816, 24472815, 24472814, 24472813, 24472812, 24472811, 24472810, 24472809, 24472808, 24472807, 24472806, 24472805, 24472804, 24472803, 24472802, 24472801, 24472800, 24472799, 24472798, 24472797, 24472796, 24472795, 24472794, 24472793, 24472792, 24472791, 24472790, 24472789, 24472788, 24472787, 24472786, 24472785, 24472784, 24472783, 24472782, 24472781, 24472780, 24472779, 24472778, 24472777, 24472776, 24472775, 24472774, 24472773, 24472772, 24472771, 24472770, 24472769, 24472768, 24472767, 24472766, 24472765, 24472764, 24472763, 24472762, 24472761, 24472760, 24472759, 24472758, 24472757, 24472756, 24472755, 24472754, 24472753, 24472752, 24472751, 24472750, 24472749, 24472748, 24472747, 24472746, 24472745, 24472744, 24472743, 24472742, 24472741, 24472740, 24472739, 24472738, 24472737, 24472736, 24472735, 24472734, 24472733, 24472732, 24472731, 24472730, 24472729, 24472728, 24472727, 24472726, 24472725, 24472724, 24472723, 24472722, 24472717, 24472715, 24472714, 24472712, 24472711, 24472710, 24472708, 24472706, 24472705, 24472700, 24472699, 24472698, 24472697, 24472692, 24472689, 24472686, 24472685, 24472679, 24472677, 24472640, 24472639, 24472638, 24472637, 24472636, 24472635, 24472634, 24472633, 24472632, 24472631, 24472630, 24472629, 24472628, 24472627, 24472626, 24472625, 24472624, 24472623, 24472622, 24472621, 24472620, 24472619, 24472618, 24472617, 24472616, 24472615, 24472614, 24472613, 24472612, 24472611, 24472610, 24472609, 24472608, 24472607, 24472606, 24472605, 24472604, 24472603, 24472602, 24472601, 24472600, 24472599, 24472598, 24472597, 24472596, 24472595, 24472594, 24472593, 24472592, 24472591, 24472590, 24472589, 24472588, 24472587, 24472586, 24472585, 24472584, 24472583, 24472582, 24472581, 24472580, 24472579, 24472578, 24472577, 24472576, 24472575, 24472574, 24472573, 24472572, 24472571, 24472570, 24472569, 24472568, 24472567, 24472566, 24472565, 24472564, 24472563, 24472562, 24472561, 24472560, 24472559, 24472558, 24472557, 24472556, 24472555, 24472554, 24472553, 24472552, 24472551, 24472550, 24472549, 24472548, 24472547, 24472546, 24472545, 24472544, 24472543, 24472542, 24472541, 24472540, 24472537, 24472534, 24472533, 24472531, 24472529, 24472528, 24472527, 24472525, 24472523, 24472522, 24472519, 24472516, 24472515, 24472514, 24472509, 24472508, 24472502, 24472496, 24472461, 24472460, 24472459, 24472458, 24472457, 24472456, 24472455, 24472454, 24472453, 24472452, 24472451, 24472450, 24472449, 24472448, 24472447, 24472446, 24472445, 24472444, 24472443, 24472442, 24472441, 24472440, 24472439, 24472438, 24472437, 24472436, 24472435, 24472434, 24472433, 24472432, 24472431, 24472430, 24472429, 24472428, 24472427, 24472426, 24472425, 24472424, 24472423, 24472422, 24472421, 24472420, 24472419, 24472418, 24472417, 24472416, 24472415, 24472414, 24472413, 24472412, 24472411, 24472410, 24472409, 24472408, 24472407, 24472406, 24472405, 24472404, 24472403, 24472402, 24472401, 24472400, 24472399, 24472398, 24472397, 24472396, 24472395, 24472394, 24472393, 24472392, 24472391, 24472390, 24472389, 24472388, 24472387, 24472386, 24472385, 24472384, 24472383, 24472382, 24472381, 24472380, 24472379, 24472378, 24472377, 24472376, 24472375, 24472374, 24472373, 24472372, 24472371, 24472370, 24472369, 24472368, 24472367, 24472366, 24472365, 24472364, 24472363, 24472362, 24472360, 24472356, 24472353, 24472352, 24472351, 24472350, 24472348, 24472346, 24472345, 24472344, 24472339, 24472338, 24472337, 24472336, 24472331, 24472326, 24472325, 24472324, 24472318, 24472316, 24472229, 24472228, 24472227, 24472226, 24472225, 24472224, 24472223, 24472222, 24472221, 24472220, 24472219, 24472218, 24472217, 24472216, 24472215, 24472214, 24472213, 24472212, 24472211, 24472210, 24472209, 24472208, 24472207, 24472206, 24472205, 24472204, 24472203, 24472202, 24472201, 24472200, 24472199, 24472198, 24472197, 24472196, 24472195, 24472194, 24472193, 24472192, 24472191, 24472190, 24472189, 24472188, 24472187, 24472186, 24472185, 24472184, 24472183, 24472182, 24472181, 24472180, 24472179, 24472178, 24472177, 24472176, 24472175, 24472174, 24472173, 24472172, 24472171, 24472170, 24472169, 24472168, 24472167, 24472166, 24472165, 24472164, 24472163, 24472162, 24472161, 24472160, 24472159, 24472158, 24472157, 24472156, 24472155, 24472154, 24472153, 24472152, 24472151, 24472150, 24472149, 24472148, 24472147, 24472146, 24472145, 24472144, 24472143, 24472142, 24472141, 24472140, 24472139, 24472138, 24472137, 24472136, 24472135, 24472134, 24472133, 24472132, 24472131, 24472130, 24472129, 24472124, 24472122, 24472120, 24472119, 24472117, 24472115, 24472114, 24472113, 24472108, 24472107, 24472106, 24472105, 24472100, 24472095, 24472094, 24472091, 24472086, 24472084, 24471843, 24471842, 24471841, 24471840, 24471839, 24471838, 24471837, 24471836, 24471835, 24471834, 24471833, 24471832, 24471831, 24471830, 24471829, 24471828, 24471827, 24471826, 24471825, 24471824, 24471823, 24471822, 24471821, 24471820, 24471819, 24471818, 24471817, 24471816, 24471815, 24471814, 24471813, 24471812, 24471811, 24471810, 24471809, 24471808, 24471807, 24471806, 24471805, 24471804, 24471803, 24471802, 24471801, 24471800, 24471799, 24471798, 24471797, 24471796, 24471795, 24471794, 24471793, 24471792, 24471791, 24471790, 24471789, 24471788, 24471787, 24471786, 24471785, 24471784, 24471783, 24471782, 24471781, 24471780, 24471779, 24471778, 24471777, 24471776, 24471775, 24471774, 24471773, 24471772, 24471771, 24471770, 24471769, 24471768, 24471767, 24471766, 24471765, 24471764, 24471763, 24471762, 24471761, 24471760, 24471759, 24471758, 24471757, 24471756, 24471755, 24471754, 24471753, 24471752, 24471751, 24471750, 24471749, 24471748, 24471747, 24471746, 24471745, 24471744, 24471742, 24471739, 24471738, 24471737, 24471735, 24471734, 24471731, 24471730, 24471729, 24471726, 24471725, 24471724, 24471723, 24471722, 24471720, 24471718, 24471717, 24471712, 24471705, 24471610, 24471609, 24471608, 24471607, 24471606, 24471605, 24471604, 24471603, 24471602, 24471601, 24471600, 24471599, 24471598, 24471597, 24471596, 24471595, 24471594, 24471593, 24471592, 24471591, 24471590, 24471589, 24471588, 24471587, 24471586, 24471585, 24471584, 24471583, 24471582, 24471581, 24471580, 24471579, 24471578, 24471577, 24471576, 24471575, 24471574, 24471573, 24471572, 24471571, 24471570, 24471569, 24471568, 24471567, 24471566, 24471565, 24471564, 24471563, 24471562, 24471561, 24471560, 24471559, 24471558, 24471557, 24471556, 24471555, 24471554, 24471553, 24471552, 24471551, 24471550, 24471549, 24471548, 24471547, 24471546, 24471545, 24471544, 24471543, 24471542, 24471541, 24471540, 24471539, 24471538, 24471537, 24471536, 24471535, 24471534, 24471533, 24471532, 24471531, 24471530, 24471529, 24471528, 24471527, 24471526, 24471525, 24471524, 24471523, 24471522, 24471521, 24471520, 24471519, 24471518, 24471517, 24471516, 24471515, 24471514, 24471513, 24471512, 24471511, 24471509, 24471504, 24471501, 24471499, 24471498, 24471497, 24471496, 24471493, 24471490, 24471489, 24471484, 24471483, 24471478, 24471477, 24471476, 24471474, 24471468, 24471467, 24471466, 24471460, 24471316, 24471315, 24471314, 24471313, 24471312, 24471311, 24471310, 24471309, 24471308, 24471307, 24471306, 24471305, 24471304, 24471303, 24471302, 24471301, 24471300, 24471299, 24471298, 24471297, 24471296, 24471295, 24471294, 24471293, 24471292, 24471291, 24471290, 24471289, 24471288, 24471287, 24471286, 24471285, 24471284, 24471283, 24471282, 24471281, 24471280, 24471279, 24471278, 24471277, 24471276, 24471275, 24471274, 24471273, 24471272, 24471271, 24471270, 24471269, 24471268, 24471267, 24471266, 24471265, 24471264, 24471263, 24471262, 24471261, 24471260, 24471259, 24471258, 24471257, 24471256, 24471255, 24471254, 24471253, 24471252, 24471251, 24471250, 24471249, 24471248, 24471247, 24471246, 24471245, 24471244, 24471243, 24471242, 24471241, 24471240, 24471239, 24471238, 24471237, 24471236, 24471235, 24471234, 24471233, 24471232, 24471231, 24471230, 24471229, 24471228, 24471227, 24471226, 24471225, 24471224, 24471223, 24471222, 24471221, 24471220, 24471219, 24471218, 24471217, 24471216, 24471207, 24471202, 24471201, 24471200, 24471199, 24471198, 24471197, 24471196, 24471191, 24471190, 24471189, 24471184, 24471183, 24471182, 24471181, 24471180, 24471175, 24471172, 24471167, 24471011, 24471010, 24471009, 24471008, 24471007, 24471006, 24471005, 24471004, 24471003, 24471002, 24471001, 24471000, 24470999, 24470998, 24470997, 24470996, 24470995, 24470994, 24470993, 24470992, 24470991, 24470990, 24470989, 24470988, 24470987, 24470986, 24470985, 24470984, 24470983, 24470982, 24470981, 24470980, 24470979, 24470978, 24470977, 24470976, 24470975, 24470974, 24470973, 24470972, 24470971, 24470970, 24470969, 24470968, 24470967, 24470966, 24470965, 24470964, 24470963, 24470962, 24470961, 24470960, 24470959, 24470958, 24470957, 24470956, 24470955, 24470954, 24470953, 24470952, 24470951, 24470950, 24470949, 24470948, 24470947, 24470946, 24470945, 24470944, 24470943, 24470942, 24470941, 24470940, 24470939, 24470938, 24470937, 24470936, 24470935, 24470934, 24470933, 24470932, 24470931, 24470930, 24470929, 24470928, 24470927, 24470926, 24470925, 24470924, 24470923, 24470922, 24470921, 24470920, 24470919, 24470918, 24470917, 24470916, 24470915, 24470914, 24470913, 24470912, 24470910, 24470902, 24470897, 24470896, 24470895, 24470894, 24470893, 24470892, 24470887, 24470886, 24470881, 24470880, 24470879, 24470878, 24470877, 24470876, 24470871, 24470869, 24470867, 24470862, 24470833, 24470832, 24470831, 24470830, 24470829, 24470828, 24470827, 24470826, 24470825, 24470824, 24470823, 24470822, 24470821, 24470820, 24470819, 24470818, 24470817, 24470816, 24470815, 24470814, 24470813, 24470812, 24470811, 24470810, 24470809, 24470808, 24470807, 24470806, 24470805, 24470804, 24470803, 24470802, 24470801, 24470800, 24470799, 24470798, 24470797, 24470796, 24470795, 24470794, 24470793, 24470792, 24470791, 24470790, 24470789, 24470788, 24470787, 24470786, 24470785]
                        },
                        "sigdata": "iVBORw0KGgoAAAANSUhEUgAAAIwAAAA3CAYAAADezaKIAAAOqElEQVR4AeybB5BVRRaGzw9rwggmFhNJKQsQJSiOKygGQEQtBUEwFBSuAUFQMZSAmDAjuiCYRVFRDBQquLqrICoiIohiAJVBBTEnMBWs21837753X9hhYHbAN/fVO+92nz7dffrcv0+f7p6pZsknsUA5LJAAphzGSkTNCgJmt91269W8efMJ7du3n969e/dFPXr0WJxQ8dmAd9u5c+cZJSUl4xs0aNDfTYq/OCr4zQeYXVu0aPHvG264YdQDDzzQbcSIEW2GDBnS8NJLL62bUPHZgHd77bXX/u3OO+/sOXLkyBEOONNr1arVuBBisgGz6+GHH/6vsWPHtmvatGmNQpUSfnFaoH79+tXduy857rjjJteoUaNFvlHGAOM8y7jrrruu0VZbbWXVqlVLqAraYJNNNrFBgwbVb9Wq1RgHmJzlKQIMMctFF13UessttzRJCVVxG7ilqnnjxo2HOtDEvhFgdt555/bNmjWrIW2cYJESvaTKs4FzINXr1KnTMoYWl4kAs+OOO/5VqjyFpKQvaeO2gXMitR1GYt8IMDVr1qwjbdwDkBL9pEq1Qc0YWlwmAsxf3CcJdJNAPxMDkhxE4t8IMHF2kksskN8CMcBkoqtQumfPngYtXry44Lb7iSee8DLvv/9+QZlC7ZfF/+OPP4z2Tz/9dDvyyCOtXbt21rt3b7vttttsxYoVOf1dffXVXpey2t0Q5V9++WWOvhtCj0J95oNMBBgqSSpzO/3aa68Z5PbqBWWXLl3qZX766aeCMlLZfUlxmZ9//tm6du3KOYG98MIL9uOPP5pbSW369Ol200032cEHH2xvv/12rM93333X6yLF25I2bP6SSy6xgQMHxnSVNqxOUrx/MJENmggwFEjxClJuHjlo7ty5dv/99+cdMOWQlFtfWneeu6Yw+j3ttNM8SN544w0PnFdeecXcGZIH0Nlnn22rV6+O9LrsssvskUceifLSuvcvrUXdtZSZMGECJtro9JLSY/QKZv1EgJHSglLhNPW32WYbg9ypsOFNpFx55CApt0xaN97LL79sHCwOHjzY6tWrFxnbnRlY37597ZhjjrHPPvss5mXc4ZMdeOCBkay0bn1LFVuvom0jVax+UmgPPTMpAgxMXFBZhNy2225r7iTQVq5c6Wd2dh1JiOWsz8QYgKxjx4625557Gk/yv/zyS45sdpvk8Rz0+fHHH+eV79Onjw0bNsx22GGHqPyKK66wbt26RXnagR588EHP33vvvc3dndikSZPsscce87xvvvnGy6fyyI8ZM8aOPvpoQ57n1KlTvQxlKfr+++8tJdekSRM/RmIslsuUzHvvvef7wEALFizwafqhvJCu6MMYaBs5CNl+/foZtujSpYsdcMABhjelDEIXd1nsbYwu1L/nnntydEa2EKFjNlXLZqxt/qSTTvIzd8aMGfboo4+WWe3TTz+1ww47zG6//XZr2LCh9wh169a10aNHm7vwtG+//bbMNvAUCBE/Pfvssx6w5FPUvHlzAzS0a2s+vJSZM2euyYUH9YkhACDy6HPeeefZzTffbMj++uuvXhBvRZ7JgZ7u5NPog7jojDPOiI0bIGMTd8vvveApp5xiPXr08Drecsstfpw0utlmmxkeMTONtyafT1f46IMeH330EVlPyL766quG3qTp/4cffvBl8+fPt/bt29vDDz9seFj0KC0t9ZOJCeWF1vEnAoyktUKfrfmASncd7o2DEl988UVUX5KXkhTxhg4dap9//rndcccdfhZecMEF5q7U7cYbbzTAdPnll0eytJ2PaOOII44wDMKL3meffezEE0/0OyRmbr46UtAlVUbAjiFph5lN7MM40As9zH1SslKo+8wzz9jTTz9tzFDioaeeespJmY0bNy7SmbZ4cbycxx9/3Jjd7NBefPFFb6Px48d72b322svojwbwsqSPOuooXyaF/lL9Zz6Rl+Tl4Euyr776yn777TebN2+esSPFW1N21VVXeVvjRWkfu82aNcsGDBhgd911lxE/IVcWSUEfy/hEgIEnqcy1HjlIku2+++5+SWK3goGkUJ9ySAp5Zurzzz9v+++/v3eRUuBL8lteZgFGLmtXxS06gfZDDz3k69WqVcuYZcOHDzcA0LlzZ/vggw9iY0APSAp98uLIA1BuZqXAZ3lEP8qkwCMNAU5erhT4++67r/cSeEUp8EpKSoyXAwClwJNkLN/ujs7YQktpPu1C0v/mSaEcWUiK50844QTDLpL8k8mETeizTZs2kS0Y6/nnn+/By4oghXakwk/6y6YIMFLhilK6LNWAFHicgbRo0cJYIpiJUuAjJ4U0noV8y5YtowFIoUySHXTQQRRbqXObUpov5U+n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",
                        "mediumFileData": []
                    },
                )
            }

            if (S.parallelJobNumber === 5) {
                let user5 = Object.assign({}, orgAdmin)
                user5.email = 'qa+21926924053@trackerproducts.com'
                user5.password = 'Test12345.'
                api.auth.get_tokens_without_page_load(user5)
                generic_request.POST('/api/transfers/V2',
                    {
                        "transaction": {
                            "transferredFromId": 5085010,
                            "transferredToId": 5077358,
                            "notes": "gdgfd",
                            "date": "2026-03-06T12:05:00.043Z",
                            "itemIds": [24470784, 24470783, 24470782, 24470781, 24470780, 24470779, 24470778, 24470777, 24470776, 24470775, 24470774, 24470773, 24470772, 24470771, 24470770, 24470769, 24470768, 24470767, 24470766, 24470765, 24470764, 24470763, 24470762, 24470761, 24470760, 24470759, 24470758, 24470757, 24470756, 24470755, 24470754, 24470753, 24470752, 24470751, 24470750, 24470749, 24470748, 24470747, 24470746, 24470745, 24470744, 24470743, 24470742, 24470741, 24470740, 24470739, 24470738, 24470737, 24470736, 24470735, 24470734, 24470732, 24470724, 24470719, 24470718, 24470717, 24470716, 24470715, 24470714, 24470709, 24470708, 24470703, 24470702, 24470701, 24470700, 24470699, 24470694, 24470692, 24470690, 24470689, 24470683, 24470657, 24470656, 24470655, 24470654, 24470653, 24470652, 24470651, 24470650, 24470649, 24470648, 24470647, 24470646, 24470645, 24470644, 24470643, 24470642, 24470641, 24470640, 24470639, 24470638, 24470637, 24470636, 24470635, 24470634, 24470633, 24470632, 24470631, 24470630, 24470629, 24470628, 24470627, 24470626, 24470625, 24470624, 24470623, 24470622, 24470621, 24470620, 24470619, 24470618, 24470617, 24470616, 24470615, 24470614, 24470613, 24470612, 24470611, 24470610, 24470609, 24470608, 24470607, 24470606, 24470605, 24470604, 24470603, 24470602, 24470601, 24470600, 24470599, 24470598, 24470597, 24470596, 24470595, 24470594, 24470593, 24470592, 24470591, 24470590, 24470589, 24470588, 24470587, 24470586, 24470585, 24470584, 24470583, 24470582, 24470581, 24470580, 24470579, 24470578, 24470577, 24470576, 24470575, 24470574, 24470573, 24470572, 24470571, 24470570, 24470569, 24470568, 24470567, 24470566, 24470565, 24470564, 24470563, 24470562, 24470561, 24470560, 24470559, 24470558, 24470556, 24470550, 24470547, 24470546, 24470545, 24470544, 24470543, 24470538, 24470537, 24470536, 24470531, 24470530, 24470529, 24470528, 24470527, 24470522, 24470521, 24470520, 24470518, 24470512, 24470447, 24470446, 24470445, 24470442, 24470441, 24470440, 24470439, 24470438, 24470437, 24470436, 24470435, 24470434, 24470433, 24470432, 24470431, 24470430, 24470429, 24470428, 24470427, 24470426, 24470425, 24470424, 24470423, 24470422, 24470421, 24470420, 24470419, 24470418, 24470417, 24470416, 24470415, 24470414, 24470413, 24470412, 24470411, 24470410, 24470409, 24470408, 24470407, 24470406, 24470405, 24470404, 24470403, 24470402, 24470401, 24470400, 24470399, 24470398, 24470397, 24470396, 24470395, 24470394, 24470393, 24470392, 24470391, 24470390, 24470389, 24470388, 24470387, 24470386, 24470385, 24470384, 24470383, 24470382, 24470381, 24470380, 24470379, 24470378, 24470377, 24470376, 24470375, 24470374, 24470373, 24470372, 24470371, 24470370, 24470369, 24470368, 24470367, 24470366, 24470365, 24470364, 24470363, 24470362, 24470361, 24470360, 24470359, 24470358, 24470357, 24470356, 24470355, 24470354, 24470353, 24470352, 24470351, 24470350, 24470349, 24470348, 24470347, 24470346, 24470345, 24470344, 24470343, 24470342, 24470337, 24470336, 24470335, 24470332, 24470331, 24470330, 24470327, 24470322, 24470321, 24470320, 24470319, 24470318, 24470317, 24470312, 24470310, 24470308, 24470303, 24470301, 24470268, 24470267, 24470264, 24470263, 24470262, 24470261, 24470260, 24470259, 24470258, 24470257, 24470256, 24470255, 24470254, 24470253, 24470252, 24470251, 24470250, 24470249, 24470248, 24470247, 24470246, 24470245, 24470244, 24470243, 24470242, 24470241, 24470240, 24470239, 24470238, 24470237, 24470236, 24470235, 24470234, 24470233, 24470232, 24470231, 24470230, 24470229, 24470228, 24470227, 24470226, 24470225, 24470224, 24470223, 24470222, 24470221, 24470220, 24470219, 24470218, 24470217, 24470216, 24470215, 24470214, 24470213, 24470212, 24470211, 24470210, 24470209, 24470208, 24470207, 24470206, 24470205, 24470204, 24470203, 24470202, 24470201, 24470200, 24470199, 24470198, 24470197, 24470196, 24470195, 24470194, 24470193, 24470192, 24470191, 24470190, 24470189, 24470188, 24470187, 24470186, 24470185, 24470184, 24470183, 24470182, 24470181, 24470180, 24470179, 24470178, 24470177, 24470176, 24470175, 24470174, 24470173, 24470172, 24470171, 24470170, 24470169, 24470168, 24470167, 24470166, 24470165, 24470164, 24470162, 24470160, 24470158, 24470156, 24470155, 24470154, 24470152, 24470149, 24470147, 24470146, 24470141, 24470140, 24470139, 24470138, 24470137, 24470132, 24470125, 24470090, 24470089, 24470088, 24470087, 24470086, 24470085, 24470084, 24470083, 24470082, 24470081, 24470080, 24470079, 24470078, 24470077, 24470076, 24470075, 24470074, 24470073, 24470072, 24470071, 24470070, 24470069, 24470068, 24470067, 24470066, 24470065, 24470064, 24470063, 24470062, 24470061, 24470060, 24470059, 24470058, 24470057, 24470056, 24470055, 24470054, 24470053, 24470052, 24470051, 24470050, 24470049, 24470048, 24470047, 24470046, 24470045, 24470044, 24470043, 24470042, 24470041, 24470040, 24470039, 24470038, 24470037, 24470036, 24470035, 24470034, 24470033, 24470032, 24470031, 24470030, 24470029, 24470028, 24470027, 24470026, 24470025, 24470024, 24470023, 24470022, 24470021, 24470020, 24470019, 24470018, 24470017, 24470016, 24470015, 24470014, 24470013, 24470012, 24470011, 24470010, 24470009, 24470008, 24470007, 24470006, 24470005, 24470004, 24470003, 24470002, 24470001, 24470000, 24469999, 24469998, 24469997, 24469996, 24469995, 24469994, 24469993, 24469992, 24469991, 24469990, 24469988, 24469986, 24469985, 24469982, 24469981, 24469980, 24469977, 24469975, 24469973, 24469972, 24469967, 24469966, 24469965, 24469964, 24469963, 24469957, 24469950, 24469916, 24469915, 24469914, 24469913, 24469912, 24469911, 24469900, 24469899, 24469898, 24469897, 24469896, 24469895, 24469894, 24469893, 24469892, 24469891, 24469890, 24469889, 24469888, 24469887, 24469886, 24469885, 24469884, 24469883, 24469882, 24469881, 24469880, 24469879, 24469878, 24469877, 24469876, 24469875, 24469874, 24469873, 24469872, 24469871, 24469870, 24469869, 24469868, 24469867, 24469866, 24469865, 24469864, 24469863, 24469862, 24469861, 24469860, 24469859, 24469858, 24469857, 24469856, 24469855, 24469854, 24469853, 24469852, 24469851, 24469850, 24469849, 24469848, 24469847, 24469846, 24469845, 24469844, 24469843, 24469842, 24469841, 24469840, 24469839, 24469838, 24469837, 24469836, 24469835, 24469834, 24469833, 24469832, 24469831, 24469830, 24469829, 24469828, 24469827, 24469826, 24469825, 24469824, 24469823, 24469822, 24469821, 24469820, 24469819, 24469818, 24469817, 24469816, 24469815, 24469814, 24469813, 24469812, 24469811, 24469810, 24469809, 24469808, 24469807, 24469806, 24469805, 24469804, 24469803, 24469802, 24469801, 24469800, 24469798, 24469797, 24469796, 24469795, 24469794, 24469793, 24469792, 24469788, 24469787, 24469786, 24469784, 24469782, 24469781, 24469778, 24469777, 24469772, 24469770, 24469719, 24469718, 24469717, 24469525, 24469524, 24469523, 24469502, 24469501, 24469500, 24469400, 24469399, 24469398, 24469397, 24469396, 24469395, 24469394, 24469393, 24469392, 24469391, 24469390, 24469389, 24469388, 24469387, 24469386, 24469385, 24469384, 24469383, 24469382, 24469381, 24469380, 24469379, 24469378, 24469377, 24469376, 24469375, 24469374, 24469373, 24469372, 24469371, 24469370, 24469369, 24469368, 24469367, 24469366, 24469365, 24469364, 24469363, 24469362, 24469361, 24469360, 24469359, 24469358, 24469357, 24469356, 24469355, 24469354, 24469353, 24469352, 24469351, 24469350, 24469349, 24469348, 24469347, 24469346, 24469345, 24469344, 24469343, 24469342, 24469341, 24469340, 24469339, 24469338, 24469337, 24469336, 24469335, 24469334, 24469333, 24469332, 24469331, 24469330, 24469329, 24469328, 24469327, 24469326, 24469325, 24469324, 24469323, 24469322, 24469321, 24469320, 24469319, 24469318, 24469317, 24469316, 24469315, 24469314, 24469313, 24469312, 24469311, 24469310, 24469309, 24469308, 24469307, 24469306, 24469305, 24469304, 24469303, 24469302, 24469301, 24469284, 24469283, 24469282, 24469281, 24469280, 24469279, 24469278, 24469277, 24469276, 24469275, 24469274, 24469273, 24469272, 24469271, 24469270, 24469269, 24469268, 24469267, 24469266, 24469265, 24469264, 24469263, 24469262, 24469261, 24469260, 24469259, 24469258, 24469257, 24469256, 24469255, 24469254, 24469253, 24469252, 24469251, 24469250, 24469249, 24469248, 24469247, 24469246, 24469245, 24469244, 24469243, 24469242, 24469241, 24469240, 24469239, 24469238, 24469237, 24469236, 24469235, 24469234, 24469233, 24469232, 24469231, 24469230, 24469229, 24469228, 24469227, 24469226, 24469225, 24469224, 24469223, 24469222, 24469221, 24469220, 24469219, 24469218, 24469217, 24469216, 24469215, 24469214, 24469213, 24469212, 24469211, 24469210, 24469209, 24469208, 24469207, 24469206, 24469205, 24469204, 24469203, 24469202, 24469201, 24469200, 24469199, 24469198, 24469197, 24469196, 24469195, 24469194, 24469193, 24469192, 24469191, 24469190, 24469189, 24469188, 24469187, 24469186, 24469185, 24469160, 24469159, 24469158, 24469157, 24469156, 24469155, 24469154, 24469153, 24469152, 24469151, 24469150, 24469149, 24469148, 24469147, 24469146, 24469145, 24469144, 24469143, 24469142, 24469141, 24469140, 24469139, 24469138, 24469137, 24469136, 24469135, 24469134, 24469133, 24469132, 24469131, 24469130, 24469129, 24469128, 24469127, 24469126, 24469125, 24469124, 24469123, 24469122, 24469121, 24469120, 24469119, 24469118, 24469117, 24469116, 24469115, 24469114, 24469113, 24469112, 24469111, 24469110, 24469109, 24469108, 24469107, 24469106, 24469105, 24469104, 24469103, 24469102, 24469101, 24469100, 24469099, 24469098, 24469097, 24469096, 24469095, 24469094, 24469093, 24469092, 24469091, 24469090, 24469089, 24469088, 24469087, 24469086, 24469085, 24469084, 24469083, 24469082, 24469081, 24469080, 24469079, 24469078, 24469077, 24469076, 24469075, 24469074, 24469073, 24469072, 24469071, 24469070, 24469069, 24469068, 24469067, 24469066, 24469065, 24469064, 24469063, 24469062, 24469061, 24464494, 24464493, 24464492, 24464491, 24464490, 24464489, 24464488, 24464487, 24464486, 24464485, 24464484, 24464483, 24464482, 24464481, 24464480, 24464479]
                        },
                        "sigdata": "iVBORw0KGgoAAAANSUhEUgAAAIwAAAA3CAYAAADezaKIAAAOqElEQVR4AeybB5BVRRaGzw9rwggmFhNJKQsQJSiOKygGQEQtBUEwFBSuAUFQMZSAmDAjuiCYRVFRDBQquLqrICoiIohiAJVBBTEnMBWs21837753X9hhYHbAN/fVO+92nz7dffrcv0+f7p6pZsknsUA5LJAAphzGSkTNCgJmt91269W8efMJ7du3n969e/dFPXr0WJxQ8dmAd9u5c+cZJSUl4xs0aNDfTYq/OCr4zQeYXVu0aPHvG264YdQDDzzQbcSIEW2GDBnS8NJLL62bUPHZgHd77bXX/u3OO+/sOXLkyBEOONNr1arVuBBisgGz6+GHH/6vsWPHtmvatGmNQpUSfnFaoH79+tXduy857rjjJteoUaNFvlHGAOM8y7jrrruu0VZbbWXVqlVLqAraYJNNNrFBgwbVb9Wq1RgHmJzlKQIMMctFF13UessttzRJCVVxG7ilqnnjxo2HOtDEvhFgdt555/bNmjWrIW2cYJESvaTKs4FzINXr1KnTMoYWl4kAs+OOO/5VqjyFpKQvaeO2gXMitR1GYt8IMDVr1qwjbdwDkBL9pEq1Qc0YWlwmAsxf3CcJdJNAPxMDkhxE4t8IMHF2kksskN8CMcBkoqtQumfPngYtXry44Lb7iSee8DLvv/9+QZlC7ZfF/+OPP4z2Tz/9dDvyyCOtXbt21rt3b7vttttsxYoVOf1dffXVXpey2t0Q5V9++WWOvhtCj0J95oNMBBgqSSpzO/3aa68Z5PbqBWWXLl3qZX766aeCMlLZfUlxmZ9//tm6du3KOYG98MIL9uOPP5pbSW369Ol200032cEHH2xvv/12rM93333X6yLF25I2bP6SSy6xgQMHxnSVNqxOUrx/MJENmggwFEjxClJuHjlo7ty5dv/99+cdMOWQlFtfWneeu6Yw+j3ttNM8SN544w0PnFdeecXcGZIH0Nlnn22rV6+O9LrsssvskUceifLSuvcvrUXdtZSZMGECJtro9JLSY/QKZv1EgJHSglLhNPW32WYbg9ypsOFNpFx55CApt0xaN97LL79sHCwOHjzY6tWrFxnbnRlY37597ZhjjrHPPvss5mXc4ZMdeOCBkay0bn1LFVuvom0jVax+UmgPPTMpAgxMXFBZhNy2225r7iTQVq5c6Wd2dh1JiOWsz8QYgKxjx4625557Gk/yv/zyS45sdpvk8Rz0+fHHH+eV79Onjw0bNsx22GGHqPyKK66wbt26RXnagR588EHP33vvvc3dndikSZPsscce87xvvvnGy6fyyI8ZM8aOPvpoQ57n1KlTvQxlKfr+++8tJdekSRM/RmIslsuUzHvvvef7wEALFizwafqhvJCu6MMYaBs5CNl+/foZtujSpYsdcMABhjelDEIXd1nsbYwu1L/nnntydEa2EKFjNlXLZqxt/qSTTvIzd8aMGfboo4+WWe3TTz+1ww47zG6//XZr2LCh9wh169a10aNHm7vwtG+//bbMNvAUCBE/Pfvssx6w5FPUvHlzAzS0a2s+vJSZM2euyYUH9YkhACDy6HPeeefZzTffbMj++uuvXhBvRZ7JgZ7u5NPog7jojDPOiI0bIGMTd8vvveApp5xiPXr08Drecsstfpw0utlmmxkeMTONtyafT1f46IMeH330EVlPyL766quG3qTp/4cffvBl8+fPt/bt29vDDz9seFj0KC0t9ZOJCeWF1vEnAoyktUKfrfmASncd7o2DEl988UVUX5KXkhTxhg4dap9//rndcccdfhZecMEF5q7U7cYbbzTAdPnll0eytJ2PaOOII44wDMKL3meffezEE0/0OyRmbr46UtAlVUbAjiFph5lN7MM40As9zH1SslKo+8wzz9jTTz9tzFDioaeeespJmY0bNy7SmbZ4cbycxx9/3Jjd7NBefPFFb6Px48d72b322svojwbwsqSPOuooXyaF/lL9Zz6Rl+Tl4Euyr776yn777TebN2+esSPFW1N21VVXeVvjRWkfu82aNcsGDBhgd911lxE/IVcWSUEfy/hEgIEnqcy1HjlIku2+++5+SWK3goGkUJ9ySAp5Zurzzz9v+++/v3eRUuBL8lteZgFGLmtXxS06gfZDDz3k69WqVcuYZcOHDzcA0LlzZ/vggw9iY0APSAp98uLIA1BuZqXAZ3lEP8qkwCMNAU5erhT4++67r/cSeEUp8EpKSoyXAwClwJNkLN/ujs7YQktpPu1C0v/mSaEcWUiK50844QTDLpL8k8mETeizTZs2kS0Y6/nnn+/By4oghXakwk/6y6YIMFLhilK6LNWAFHicgbRo0cJYIpiJUuAjJ4U0noV8y5YtowFIoUySHXTQQRRbqXObUpov5U+n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",
                        "mediumFileData": []
                    },
                )
            }

            if (S.parallelJobNumber === 6) {
                let user6 = Object.assign({}, orgAdmin)
                user6.email = 'qa+21926657713@trackerproducts.com'
                user6.password = 'Test12345.'
                api.auth.get_tokens_without_page_load(user6)
                generic_request.POST('/api/transfers/V2',
                    {
                        "transaction": {
                            "transferredFromId": 5085057,
                            "transferredToId": 5077358,
                            "notes": "gxgdf",
                            "date": "2026-03-06T12:11:10.375Z",
                            "itemIds": [24457618, 24457617, 24457616, 24457615, 24457614, 24457613, 24457612, 24457611, 24457610, 24457609, 24457608, 24457607, 24457606, 24457605, 24457604, 24457603, 24457602, 24457601, 24457600, 24457599, 24457598, 24457597, 24457596, 24457595, 24457594, 24457593, 24457592, 24457591, 24457590, 24457589, 24457588, 24457587, 24457586, 24457585, 24457584, 24457583, 24457582, 24457581, 24457580, 24457579, 24457578, 24457577, 24457576, 24457575, 24457574, 24457573, 24457572, 24457571, 24457570, 24457569, 24457568, 24457567, 24457566, 24457565, 24457564, 24457563, 24457562, 24457561, 24457560, 24457559, 24457558, 24457557, 24457556, 24457555, 24457554, 24457553, 24457552, 24457551, 24457550, 24457549, 24457548, 24457547, 24457546, 24457545, 24457544, 24457543, 24457542, 24457541, 24457540, 24457539, 24457538, 24457537, 24457536, 24457535, 24457534, 24457532, 24457531, 24457530, 24457529, 24457528, 24457527, 24457526, 24457525, 24457524, 24457523, 24457522, 24457521, 24457520, 24457519, 24457518, 24457517, 24457516, 24457515, 24457514, 24457513, 24457512, 24457511, 24457510, 24457509, 24457508, 24457507, 24457506, 24457505, 24457504, 24457503, 24457502, 24457501, 24457500, 24457499, 24457498, 24457497, 24457496, 24457495, 24457494, 24457493, 24457492, 24457491, 24457490, 24457489, 24457488, 24457487, 24457486, 24457485, 24457484, 24457483, 24457482, 24457481, 24457480, 24457479, 24457478, 24457477, 24457476, 24457475, 24457474, 24457473, 24457472, 24457471, 24457470, 24457469, 24457468, 24457467, 24457466, 24457465, 24457464, 24457463, 24457462, 24457461, 24457460, 24457459, 24457458, 24457457, 24457456, 24457455, 24457454, 24457453, 24457452, 24457451, 24457450, 24457449, 24457448, 24457447, 24457446, 24457445, 24457444, 24457443, 24457442, 24457441, 24457440, 24457439, 24457438, 24457437, 24457436, 24457435, 24457434, 24457433, 24457431, 24457430, 24457429, 24457428, 24457427, 24457426, 24457425, 24457424, 24457423, 24457422, 24457421, 24457420, 24457419, 24457418, 24457417, 24457416, 24457415, 24457414, 24457413, 24457412, 24457411, 24457410, 24457409, 24457408, 24457407, 24457406, 24457405, 24457404, 24457403, 24457402, 24457401, 24457400, 24457399, 24457398, 24457397, 24457396, 24457395, 24457394, 24457393, 24457392, 24457391, 24457390, 24457389, 24457388, 24457387, 24457386, 24457385, 24457384, 24457383, 24457382, 24457381, 24457380, 24457379, 24457378, 24457377, 24457376, 24457375, 24457374, 24457373, 24457372, 24457371, 24457370, 24457369, 24457368, 24457367, 24457366, 24457365, 24457364, 24457363, 24457362, 24457361, 24457360, 24457359, 24457358, 24457357, 24457356, 24457355, 24457354, 24457353, 24457352, 24457351, 24457350, 24457349, 24457348, 24457347, 24457346, 24457345, 24457344, 24457343, 24457342, 24457341, 24457340, 24457339, 24457338, 24457337, 24457336, 24457335, 24457334, 24457333, 24457332, 24457329, 24457328, 24457327, 24457326, 24457325, 24457324, 24457323, 24457322, 24457321, 24457320, 24457319, 24457318, 24457317, 24457316, 24457315, 24457314, 24457313, 24457312, 24457311, 24457310, 24457309, 24457308, 24457307, 24457306, 24457305, 24457304, 24457303, 24457302, 24457301, 24457300, 24457299, 24457298, 24457297, 24457296, 24457295, 24457294, 24457293, 24457292, 24457291, 24457290, 24457289, 24457288, 24457287, 24457286, 24457285, 24457284, 24457283, 24457282, 24457281, 24457280, 24457279, 24457278, 24457277, 24457276, 24457275, 24457274, 24457273, 24457272, 24457271, 24457270, 24457269, 24457268, 24457267, 24457266, 24457265, 24457264, 24457263, 24457262, 24457261, 24457260, 24457259, 24457258, 24457257, 24457256, 24457255, 24457254, 24457253, 24457252, 24457251, 24457250, 24457249, 24457248, 24457247, 24457246, 24457245, 24457244, 24457243, 24457242, 24457241, 24457240, 24457239, 24457238, 24457237, 24457236, 24457235, 24457234, 24457233, 24457232, 24457231, 24457230, 24457213, 24457212, 24457211, 24457210, 24457209, 24457208, 24457207, 24457206, 24457205, 24457204, 24457203, 24457202, 24457201, 24457200, 24457199, 24457198, 24457197, 24457196, 24457195, 24457194, 24457193, 24457192, 24457191, 24457190, 24457189, 24457188, 24457187, 24457186, 24457185, 24457184, 24457183, 24457182, 24457181, 24457180, 24457179, 24457178, 24457177, 24457176, 24457175, 24457174, 24457173, 24457172, 24457171, 24457170, 24457169, 24457168, 24457167, 24457166, 24457165, 24457164, 24457163, 24457162, 24457161, 24457160, 24457159, 24457158, 24457157, 24457156, 24457155, 24457154, 24457153, 24457152, 24457151, 24457150, 24457149, 24457148, 24457147, 24457146, 24457145, 24457144, 24457143, 24457142, 24457141, 24457140, 24457139, 24457138, 24457137, 24457136, 24457135, 24457134, 24457133, 24457132, 24457131, 24457130, 24457129, 24457128, 24457127, 24457126, 24457125, 24457124, 24457123, 24457122, 24457121, 24457120, 24457119, 24457118, 24457117, 24457116, 24457115, 24457114, 24457110, 24457108, 24457107, 24457106, 24457105, 24457104, 24457103, 24457102, 24457101, 24457100, 24457099, 24457098, 24457097, 24457096, 24457095, 24457094, 24457093, 24457092, 24457091, 24457090, 24457089, 24457088, 24457087, 24457086, 24457085, 24457084, 24457083, 24457082, 24457081, 24457080, 24457079, 24457078, 24457077, 24457076, 24457075, 24457074, 24457073, 24457072, 24457071, 24457070, 24457069, 24457068, 24457067, 24457066, 24457065, 24457064, 24457063, 24457062, 24457061, 24457060, 24457059, 24457058, 24457057, 24457056, 24457055, 24457054, 24457053, 24457052, 24457051, 24457050, 24457049, 24457048, 24457047, 24457046, 24457045, 24457044, 24457043, 24457042, 24457041, 24457040, 24457039, 24457038, 24457037, 24457036, 24457035, 24457034, 24457033, 24457032, 24457031, 24457030, 24457029, 24457028, 24457027, 24457026, 24457025, 24457024, 24457023, 24457022, 24457021, 24457020, 24457019, 24457018, 24457017, 24457016, 24457015, 24457014, 24457013, 24457012, 24457011, 24457010, 24457009, 24457007, 24457006, 24457005, 24457004, 24457003, 24457002, 24457001, 24457000, 24456999, 24456998, 24456997, 24456996, 24456995, 24456994, 24456993, 24456992, 24456991, 24456990, 24456989, 24456988, 24456987, 24456986, 24456985, 24456984, 24456983, 24456982, 24456981, 24456980, 24456979, 24456978, 24456977, 24456976, 24456975, 24456974, 24456973, 24456972, 24456971, 24456970, 24456969, 24456968, 24456967, 24456966, 24456965, 24456964, 24456963, 24456962, 24456961, 24456960, 24456959, 24456958, 24456957, 24456956, 24456955, 24456954, 24456953, 24456952, 24456951, 24456950, 24456949, 24456948, 24456947, 24456946, 24456945, 24456944, 24456943, 24456942, 24456941, 24456940, 24456939, 24456938, 24456937, 24456936, 24456935, 24456934, 24456933, 24456932, 24456931, 24456930, 24456929, 24456928, 24456927, 24456926, 24456925, 24456924, 24456923, 24456922, 24456921, 24456920, 24456919, 24456918, 24456917, 24456916, 24456915, 24456914, 24456913, 24456912, 24456911, 24456910, 24456909, 24456908, 24456906, 24456905, 24456904, 24456903, 24456902, 24456901, 24456900, 24456899, 24456898, 24456897, 24456896, 24456895, 24456894, 24456893, 24456892, 24456891, 24456890, 24456889, 24456888, 24456887, 24456886, 24456885, 24456884, 24456883, 24456882, 24456881, 24456880, 24456879, 24456878, 24456877, 24456876, 24456875, 24456874, 24456873, 24456872, 24456871, 24456870, 24456869, 24456868, 24456867, 24456866, 24456865, 24456864, 24456863, 24456862, 24456861, 24456860, 24456859, 24456858, 24456857, 24456856, 24456855, 24456854, 24456853, 24456852, 24456851, 24456850, 24456849, 24456848, 24456847, 24456846, 24456845, 24456844, 24456843, 24456842, 24456841, 24456840, 24456839, 24456838, 24456837, 24456836, 24456835, 24456834, 24456833, 24456832, 24456831, 24456830, 24456829, 24456828, 24456827, 24456826, 24456825, 24456824, 24456823, 24456822, 24456821, 24456820, 24456819, 24456818, 24456817, 24456816, 24456815, 24456814, 24456813, 24456812, 24456811, 24456810, 24456809, 24456808, 24456807, 24456805, 24456804, 24456803, 24456802, 24456801, 24456800, 24456799, 24456798, 24456797, 24456796, 24456795, 24456794, 24456793, 24456792, 24456791, 24456790, 24456789, 24456788, 24456787, 24456786, 24456785, 24456784, 24456783, 24456782, 24456781, 24456780, 24456779, 24456778, 24456777, 24456776, 24456775, 24456774, 24456773, 24456772, 24456771, 24456770, 24456769, 24456768, 24456767, 24456766, 24456765, 24456764, 24456763, 24456762, 24456761, 24456760, 24456759, 24456758, 24456757, 24456756, 24456755, 24456754, 24456753, 24456752, 24456751, 24456750, 24456749, 24456748, 24456747, 24456746, 24456745, 24456744, 24456743, 24456742, 24456741, 24456740, 24456739, 24456738, 24456737, 24456736, 24456735, 24456734, 24456733, 24456732, 24456731, 24456730, 24456729, 24456728, 24456727, 24456726, 24456725, 24456724, 24456723, 24456722, 24456721, 24456720, 24456719, 24456718, 24456717, 24456716, 24456715, 24456714, 24456713, 24456712, 24456711, 24456710, 24456709, 24456708, 24456707, 24456706, 24456704, 24456703, 24456702, 24456701, 24456700, 24456699, 24456698, 24456697, 24456696, 24456695, 24456694, 24456693, 24456692, 24456691, 24456690, 24456689, 24456688, 24456687, 24456686, 24456685, 24456684, 24456683, 24456682, 24456681, 24456680, 24456679, 24456678, 24456677, 24456676, 24456675, 24456674, 24456673, 24456672, 24456671, 24456670, 24456669, 24456668, 24456667, 24456666, 24456665, 24456664, 24456663, 24456662, 24456661, 24456660, 24456659, 24456658, 24456657, 24456656, 24456655, 24456654, 24456653, 24456652, 24456651, 24456650, 24456649, 24456648, 24456647, 24456646, 24456645, 24456644, 24456643, 24456642, 24456641, 24456640, 24456639, 24456638, 24456637, 24456636, 24456635, 24456634, 24456633, 24456632, 24456631, 24456630, 24456629, 24456628, 24456627, 24456626, 24456625, 24456624, 24456623, 24456622, 24456621, 24456620, 24456619, 24456618, 24456617, 24456616, 24456615, 24456614, 24456613, 24456612, 24456611, 24456610, 24456609, 24456608, 24456607, 24456606, 24456605, 24456593, 24456592, 24456591, 24456590, 24456589, 24456588, 24456587, 24456586, 24456585, 24456584, 24456583, 24456582, 24456581, 24456580]
                        },
                        "sigdata": "iVBORw0KGgoAAAANSUhEUgAAAIwAAAA3CAYAAADezaKIAAAOqElEQVR4AeybB5BVRRaGzw9rwggmFhNJKQsQJSiOKygGQEQtBUEwFBSuAUFQMZSAmDAjuiCYRVFRDBQquLqrICoiIohiAJVBBTEnMBWs21837753X9hhYHbAN/fVO+92nz7dffrcv0+f7p6pZsknsUA5LJAAphzGSkTNCgJmt91269W8efMJ7du3n969e/dFPXr0WJxQ8dmAd9u5c+cZJSUl4xs0aNDfTYq/OCr4zQeYXVu0aPHvG264YdQDDzzQbcSIEW2GDBnS8NJLL62bUPHZgHd77bXX/u3OO+/sOXLkyBEOONNr1arVuBBisgGz6+GHH/6vsWPHtmvatGmNQpUSfnFaoH79+tXduy857rjjJteoUaNFvlHGAOM8y7jrrruu0VZbbWXVqlVLqAraYJNNNrFBgwbVb9Wq1RgHmJzlKQIMMctFF13UessttzRJCVVxG7ilqnnjxo2HOtDEvhFgdt555/bNmjWrIW2cYJESvaTKs4FzINXr1KnTMoYWl4kAs+OOO/5VqjyFpKQvaeO2gXMitR1GYt8IMDVr1qwjbdwDkBL9pEq1Qc0YWlwmAsxf3CcJdJNAPxMDkhxE4t8IMHF2kksskN8CMcBkoqtQumfPngYtXry44Lb7iSee8DLvv/9+QZlC7ZfF/+OPP4z2Tz/9dDvyyCOtXbt21rt3b7vttttsxYoVOf1dffXVXpey2t0Q5V9++WWOvhtCj0J95oNMBBgqSSpzO/3aa68Z5PbqBWWXLl3qZX766aeCMlLZfUlxmZ9//tm6du3KOYG98MIL9uOPP5pbSW369Ol200032cEHH2xvv/12rM93333X6yLF25I2bP6SSy6xgQMHxnSVNqxOUrx/MJENmggwFEjxClJuHjlo7ty5dv/99+cdMOWQlFtfWneeu6Yw+j3ttNM8SN544w0PnFdeecXcGZIH0Nlnn22rV6+O9LrsssvskUceifLSuvcvrUXdtZSZMGECJtro9JLSY/QKZv1EgJHSglLhNPW32WYbg9ypsOFNpFx55CApt0xaN97LL79sHCwOHjzY6tWrFxnbnRlY37597ZhjjrHPPvss5mXc4ZMdeOCBkay0bn1LFVuvom0jVax+UmgPPTMpAgxMXFBZhNy2225r7iTQVq5c6Wd2dh1JiOWsz8QYgKxjx4625557Gk/yv/zyS45sdpvk8Rz0+fHHH+eV79Onjw0bNsx22GGHqPyKK66wbt26RXnagR588EHP33vvvc3dndikSZPsscce87xvvvnGy6fyyI8ZM8aOPvpoQ57n1KlTvQxlKfr+++8tJdekSRM/RmIslsuUzHvvvef7wEALFizwafqhvJCu6MMYaBs5CNl+/foZtujSpYsdcMABhjelDEIXd1nsbYwu1L/nnntydEa2EKFjNlXLZqxt/qSTTvIzd8aMGfboo4+WWe3TTz+1ww47zG6//XZr2LCh9wh169a10aNHm7vwtG+//bbMNvAUCBE/Pfvssx6w5FPUvHlzAzS0a2s+vJSZM2euyYUH9YkhACDy6HPeeefZzTffbMj++uuvXhBvRZ7JgZ7u5NPog7jojDPOiI0bIGMTd8vvveApp5xiPXr08Drecsstfpw0utlmmxkeMTONtyafT1f46IMeH330EVlPyL766quG3qTp/4cffvBl8+fPt/bt29vDDz9seFj0KC0t9ZOJCeWF1vEnAoyktUKfrfmASncd7o2DEl988UVUX5KXkhTxhg4dap9//rndcccdfhZecMEF5q7U7cYbbzTAdPnll0eytJ2PaOOII44wDMKL3meffezEE0/0OyRmbr46UtAlVUbAjiFph5lN7MM40As9zH1SslKo+8wzz9jTTz9tzFDioaeeespJmY0bNy7SmbZ4cbycxx9/3Jjd7NBefPFFb6Px48d72b322svojwbwsqSPOuooXyaF/lL9Zz6Rl+Tl4Euyr776yn777TebN2+esSPFW1N21VVXeVvjRWkfu82aNcsGDBhgd911lxE/IVcWSUEfy/hEgIEnqcy1HjlIku2+++5+SWK3goGkUJ9ySAp5Zurzzz9v+++/v3eRUuBL8lteZgFGLmtXxS06gfZDDz3k69WqVcuYZcOHDzcA0LlzZ/vggw9iY0APSAp98uLIA1BuZqXAZ3lEP8qkwCMNAU5erhT4++67r/cSeEUp8EpKSoyXAwClwJNkLN/ujs7YQktpPu1C0v/mSaEcWUiK50844QTDLpL8k8mETeizTZs2kS0Y6/nnn+/By4oghXakwk/6y6YIMFLhilK6LNWAFHicgbRo0cJYIpiJUuAjJ4U0noV8y5YtowFIoUySHXTQQRRbqXObUpov5U+n4gJ2TNOmTTNmEAaaM2eOB87rr78e9eMbdj9SaOvDDz80loX69etHMlIoIw5wojE++UywSEEWPiSFPLFN9+7d/Uujf7wnk6hDhw6GXngCKchKoqonSVF/nuF+pDRPCmnH9l8pnic+kQJPkrehF3Q/AwYM8F5lwJonXp2xZ08qKV1fiqddM7FvBBi4UlxYys0jB0mhDOSyRqPIhRdeaN999x3FniR5Y+BhYLBWS4EnpZ/wKeecRUrzpbLTvCh2SM8995xfBlatWmVjx471/UqiWU+SPI91fvvtt/dpKfCk8GQMCEshTxrabrvtcuThQ1KQleSX2AYNGtixxx7rQcwSRl877bQTorE2PMP9SOn6Luu/UponhTQFUkhLIuspG/ipZfWtt97yxwksoZmEV8QGkmL6SLl530HWz3oDRpKxLnMIhTIEiJKibiQZwSKM33//Pa+SAIVyDCsprwwerG3btt4IUn4Zlg7a4RRaSsvAk0KePpYtW5a3D2KCTFlJZD1JitXxTPcjBT4xEGOnfQJR4gTiCp7wnGhOfSnUldLPbDkplMGHpJCXRDbWpiQD3BT079/feza8Wz6SlFNXivNoJ5sqBDCS7NxzzzXcI8EfgR4dSUEBAEWe4EwKPCn9ZECUZ88WKS2D0XkBBJ9Smi+l0yngMaulwKddSAp5lhfyBKhS4EnhmdJDCnnkICnkpfQTPiQFHt6EU+dJkyYZOzB2hCk9WAYzZSWR9SQpenHEZDCJCaU0nwkAH5ICnzQkhbwUnpxPwecknBgzk5i4eGLsKAV5qfCTdrIpAkxZEXOqnAYkRdF6ir/pppvaqFGj/FE9J7DmPqmy2rVrW+vWrf2pLOt7is8TcBHBsw2kDXj5iBiladOmxoBZ+thiZsp9/fXX/kW5bg1PlCojD6XyZ555pteRw7/M8x92PO+88w6i/gUiL8nnSWeTpEiOMl5y9erVbeutt47ZBs/DEkBDLNfIQix/eGTSKWI5Qw6bpHg8iYfgS4ratjUfSREPWYJvQMNYmBTwUoQugJklKsUr62lZnwgw8KVgBKnwEzlIypVhm3vOOedQHJEU5FJxzvHHH29XXnmlPyO45pprrFevXn4nwZZQCrJS7nPzzTf3W0J2Hffee68H4H777Wennnqq8SSWmTx5sgcLQZ6UbgNlpJBHRwDHdQIgPuuss6xTp0528cUXR0unFGQlUdWTJA8QKTw90/1IIc+4CGzZVrMTY+vNwRoHbCmvxpInBXm87qJFi4x6Tz75pG+b7TUn2QSn1L3++uv9eQqAw8NKoa4Unq57X08KeUmGnaiHt2Nc2Pq+++7zdiJNO2wSpHQdKX+a9rOp3IDBxeHapPydYHheBHJbbLFFNCAMhHfhkI4ZA7A4uSTPNnCPPfaIZKX8bdMGwRw31bT/ySefGDszYhJeCqBkSSQQl0IbGAhZKeQl+ctL5Fq1auWvEVg6Jk6caIcccoi3jxRkASd1M8chhTJsAEkhzykr4Ofyk+UZ4myKg012S7Qzb968aIwACY8JcF966SXPR5+7777bH1dwdIDH3mWXXfwJNMs1ekqhv9S4MscqhTJsypJEe9ia7fQ0t5vEi3NCjSeTgqxU+OmNkfUTAUYqXFFKl7HPJwCV0jwpnQbhlCOHwlK6DFBwmMT9E1s7niwFGEVKy0mF0wR1nKbSPsffnLqyHM2ePdu4lMw2ILEFslJoky0+ZyIYlb45QUWnQw891JjxzEyuFiQZF5nUzR6HJGOMkBTa5SyEk2J0YWxLliwxzpYAOVcPtMOfhUhBnv5YepC/9dZbPWAkGdtwQEZ9CB1pm77wEFKonxpXIdvhSYmnsDH68GScawsWKfSThZf4fz5KQUj6/z+Ja6T176eQwaT8beORGjVqZCxrUlqGNR/QMet5QVK6TCpfuiLGxsTIBr9UPj2kIL+u+mSDhXzkYcoKfiqufMP+GSSnwSw1w4YN8x4E4HCEz4kp3oX4pljGWhHjACSZFAEmk1nMaTwSwfHJJ5/s4xcCZLbq3ECzA+NZzONf37FFgJEU255VBDo31ja4omAnQfzCLS9LEXEEVwMbq84bQi9Jlv2JAEOBpCj4kpK0VLVtACayKQLMf9xHqtoGkpLxS2kbZIOFfAQYdzi0XEoLS0laqto2cD5kJSDJpAgw7vBrqVS1DSQl45fSNnBXF0sywUI6Aszy5ctnukuy1VK6glSl01U6nnMrjrmT9IWAJJMiwCxcuPAfbos5y7mhKrNb2hA7jz9Ln4MGDXrTXQoPyQQL6QgwLrPKXe//3d1mLpYSzyJVXRu4a4dl7u5psMPECkexbyZg+Mv9BU64qzsNnV1aWposT1UMNCxDvXv3ftOdfPdx91hTY0hZk4kBBp6rNGfKlCklXbp0Ge4uzf7Zp0+f+e6qvTShfkVrg759+y7o1q3blI4dO450l51tC4EFfOQABqajVXPnzh3qjtA7OI/TbPTo0fUSKl4bjBkzpsnEiRM7uZhloHv3OcuQ40XfQoCJBJJEYoFMCySAybTGnzRdmWongKlMaxdBXwlgiuAlVuYQEsBUprWLoK8EMEXwEitzCAlgKtPaRdBXApgieImVOYQEMJVp7SLoa70AUwTjT4ZQTgskgCmnwaq6eAKYqo6Aco4/AUw5DVbVxf8LAAD//zTkojMAAAAGSURBVAMAX4q558LHiOYAAAAASUVORK5CYII=",
                        "mediumFileData": []
                    },
                )
            }

            if (S.parallelJobNumber === 7) {
                let user7 = Object.assign({}, orgAdmin)
                user7.email = 'qa+21926219210@trackerproducts.com'
                user7.password = 'Test12345.'
                api.auth.get_tokens_without_page_load(user7)
                generic_request.POST('/api/transfers/V2',
                    {
                        "transaction": {
                            "transferredFromId": 5085057,
                            "transferredToId": 5077358,
                            "notes": "gdsg",
                            "date": "2026-03-06T12:14:42.765Z",
                            "itemIds": [24454527, 24454526, 24454525, 24454524, 24454523, 24454522, 24454521, 24454520, 24454519, 24454518, 24454517, 24454516, 24454515, 24454514, 24454513, 24454512, 24454511, 24454510, 24454509, 24454508, 24454507, 24454506, 24454505, 24454504, 24454503, 24454502, 24454501, 24454500, 24454499, 24454498, 24454497, 24454496, 24454495, 24454494, 24454493, 24454492, 24454491, 24454490, 24454489, 24454488, 24454487, 24454486, 24454485, 24454484, 24454483, 24454482, 24454481, 24454480, 24454479, 24454478, 24454477, 24454476, 24454475, 24454474, 24454473, 24454472, 24454471, 24454470, 24454469, 24454468, 24454467, 24454466, 24454465, 24454464, 24454463, 24454462, 24454461, 24454460, 24454459, 24454458, 24454457, 24454456, 24454455, 24454454, 24454453, 24454452, 24454451, 24454450, 24454449, 24454448, 24454447, 24454446, 24454445, 24454444, 24454443, 24454442, 24454441, 24454440, 24454439, 24454438, 24454435, 24454434, 24454433, 24454432, 24454431, 24454430, 24454429, 24454428, 24454427, 24454426, 24454425, 24454424, 24454423, 24454422, 24454421, 24454420, 24454419, 24454418, 24454417, 24454416, 24454415, 24454414, 24454413, 24454412, 24454411, 24454410, 24454409, 24454408, 24454407, 24454406, 24454405, 24454404, 24454403, 24454402, 24454401, 24454400, 24454399, 24454398, 24454397, 24454396, 24454395, 24454394, 24454393, 24454392, 24454391, 24454390, 24454389, 24454388, 24454387, 24454386, 24454385, 24454384, 24454383, 24454382, 24454381, 24454380, 24454379, 24454378, 24454377, 24454376, 24454375, 24454374, 24454373, 24454372, 24454371, 24454370, 24454369, 24454368, 24454367, 24454366, 24454365, 24454364, 24454363, 24454362, 24454361, 24454360, 24454359, 24454358, 24454357, 24454356, 24454355, 24454354, 24454353, 24454352, 24454351, 24454350, 24454349, 24454348, 24454347, 24454346, 24454345, 24454344, 24454343, 24454342, 24454341, 24454340, 24454339, 24454338, 24454337, 24454336, 24454334, 24454333, 24454332, 24454331, 24454330, 24454329, 24454328, 24454327, 24454326, 24454325, 24454324, 24454323, 24454322, 24454321, 24454320, 24454319, 24454318, 24454317, 24454316, 24454315, 24454314, 24454313, 24454312, 24454311, 24454310, 24454309, 24454308, 24454307, 24454306, 24454305, 24454304, 24454303, 24454302, 24454301, 24454300, 24454299, 24454298, 24454297, 24454296, 24454295, 24454294, 24454293, 24454292, 24454291, 24454290, 24454289, 24454288, 24454287, 24454286, 24454285, 24454284, 24454283, 24454282, 24454281, 24454280, 24454279, 24454278, 24454277, 24454276, 24454275, 24454274, 24454273, 24454272, 24454271, 24454270, 24454269, 24454268, 24454267, 24454266, 24454265, 24454264, 24454263, 24454262, 24454261, 24454260, 24454259, 24454258, 24454257, 24454256, 24454255, 24454254, 24454253, 24454252, 24454251, 24454250, 24454249, 24454248, 24454247, 24454246, 24454245, 24454244, 24454243, 24454242, 24454241, 24454240, 24454239, 24454238, 24454237, 24454236, 24454235, 24454165, 24454164, 24454163, 24454162, 24454161, 24454160, 24454159, 24454158, 24454157, 24454156, 24454155, 24454154, 24454153, 24454152, 24454151, 24454150, 24454149, 24454148, 24454147, 24454146, 24454145, 24454144, 24454143, 24454142, 24454141, 24454140, 24454139, 24454138, 24454137, 24454136, 24454135, 24454134, 24454133, 24454132, 24454131, 24454130, 24454129, 24454128, 24454127, 24454126, 24454125, 24454124, 24454123, 24454122, 24454121, 24454120, 24454119, 24454118, 24454117, 24454116, 24454115, 24454114, 24454113, 24454112, 24454111, 24454110, 24454109, 24454108, 24454107, 24454106, 24454105, 24454104, 24454103, 24454102, 24454101, 24454100, 24454099, 24454098, 24454097, 24454096, 24454095, 24454094, 24454093, 24454092, 24454091, 24454090, 24454089, 24454088, 24454087, 24454086, 24454085, 24454084, 24454083, 24454082, 24454081, 24454080, 24454079, 24454078, 24454077, 24454076, 24454075, 24454074, 24454073, 24454072, 24454071, 24454070, 24454069, 24454068, 24454067, 24454066, 24454056, 24454055, 24454054, 24454053, 24454052, 24454051, 24454050, 24454049, 24454048, 24454047, 24454046, 24454045, 24454044, 24454043, 24454042, 24454041, 24454040, 24454039, 24454038, 24454037, 24454036, 24454035, 24454034, 24454033, 24454032, 24454031, 24454030, 24454029, 24454028, 24454027, 24454026, 24454025, 24454024, 24454023, 24454022, 24454021, 24454020, 24454019, 24454018, 24454017, 24454016, 24454015, 24454014, 24454013, 24454012, 24454011, 24454010, 24454009, 24454008, 24454007, 24454006, 24454005, 24454004, 24454003, 24454002, 24454001, 24454000, 24453999, 24453998, 24453997, 24453996, 24453995, 24453994, 24453993, 24453992, 24453991, 24453990, 24453989, 24453988, 24453987, 24453986, 24453985, 24453984, 24453983, 24453982, 24453981, 24453980, 24453979, 24453978, 24453977, 24453976, 24453975, 24453974, 24453973, 24453972, 24453971, 24453970, 24453969, 24453968, 24453967, 24453966, 24453965, 24453964, 24453963, 24453962, 24453961, 24453960, 24453959, 24453958, 24453957, 24453954, 24453953, 24453952, 24453951, 24453950, 24453949, 24453948, 24453947, 24453946, 24453945, 24453944, 24453943, 24453942, 24453941, 24453940, 24453939, 24453938, 24453937, 24453936, 24453935, 24453934, 24453933, 24453932, 24453931, 24453930, 24453929, 24453928, 24453927, 24453926, 24453925, 24453924, 24453923, 24453922, 24453921, 24453920, 24453919, 24453918, 24453917, 24453916, 24453915, 24453914, 24453913, 24453912, 24453911, 24453910, 24453909, 24453908, 24453907, 24453906, 24453905, 24453904, 24453903, 24453902, 24453901, 24453900, 24453899, 24453898, 24453897, 24453896, 24453895, 24453894, 24453893, 24453892, 24453891, 24453890, 24453889, 24453888, 24453887, 24453886, 24453885, 24453884, 24453883, 24453882, 24453881, 24453880, 24453879, 24453878, 24453877, 24453876, 24453875, 24453874, 24453873, 24453872, 24453871, 24453870, 24453869, 24453868, 24453867, 24453866, 24453865, 24453864, 24453863, 24453862, 24453861, 24453860, 24453859, 24453858, 24453857, 24453856, 24453855, 24453847, 24453846, 24453845, 24453844, 24453843, 24453842, 24453841, 24453840, 24453839, 24453838, 24453837, 24453836, 24453835, 24453834, 24453833, 24453832, 24453831, 24453830, 24453829, 24453828, 24453827, 24453826, 24453825, 24453824, 24453823, 24453822, 24453821, 24453820, 24453819, 24453818, 24453817, 24453816, 24453815, 24453814, 24453813, 24453812, 24453811, 24453810, 24453809, 24453808, 24453807, 24453806, 24453805, 24453804, 24453803, 24453802, 24453801, 24453800, 24453799, 24453798, 24453797, 24453796, 24453795, 24453794, 24453793, 24453792, 24453791, 24453790, 24453789, 24453788, 24453787, 24453786, 24453785, 24453784, 24453783, 24453782, 24453781, 24453780, 24453779, 24453778, 24453777, 24453776, 24453775, 24453774, 24453773, 24453772, 24453771, 24453770, 24453769, 24453768, 24453767, 24453766, 24453765, 24453764, 24453763, 24453762, 24453761, 24453760, 24453759, 24453758, 24453757, 24453756, 24453755, 24453754, 24453753, 24453752, 24453751, 24453750, 24453749, 24453748, 24453641, 24453640, 24453639, 24453638, 24453637, 24453636, 24453635, 24453634, 24453633, 24453632, 24453631, 24453630, 24453629, 24453628, 24453627, 24453626, 24453625, 24453624, 24453623, 24453622, 24453621, 24453620, 24453619, 24453618, 24453617, 24453616, 24453615, 24453614, 24453613, 24453612, 24453611, 24453610, 24453609, 24453608, 24453607, 24453606, 24453605, 24453604, 24453603, 24453602, 24453601, 24453600, 24453599, 24453598, 24453597, 24453596, 24453595, 24453594, 24453593, 24453592, 24453591, 24453590, 24453589, 24453588, 24453587, 24453586, 24453585, 24453584, 24453583, 24453582, 24453581, 24453580, 24453579, 24453578, 24453577, 24453576, 24453575, 24453574, 24453573, 24453572, 24453571, 24453570, 24453569, 24453568, 24453567, 24453566, 24453565, 24453564, 24453563, 24453562, 24453561, 24453560, 24453559, 24453558, 24453557, 24453556, 24453555, 24453554, 24453553, 24453552, 24453551, 24453550, 24453549, 24453548, 24453547, 24453546, 24453545, 24453544, 24453543, 24453542, 24453438, 24453437, 24453436, 24453435, 24453434, 24453433, 24453432, 24453431, 24453430, 24453429, 24453428, 24453427, 24453426, 24453425, 24453424, 24453423, 24453422, 24453421, 24453420, 24453419, 24453418, 24453417, 24453416, 24453415, 24453414, 24453413, 24453412, 24453411, 24453410, 24453409, 24453408, 24453407, 24453406, 24453405, 24453404, 24453403, 24453402, 24453401, 24453400, 24453399, 24453398, 24453397, 24453396, 24453395, 24453394, 24453393, 24453392, 24453391, 24453390, 24453389, 24453388, 24453387, 24453386, 24453385, 24453384, 24453383, 24453382, 24453381, 24453380, 24453379, 24453378, 24453377, 24453376, 24453375, 24453374, 24453373, 24453372, 24453371, 24453370, 24453369, 24453368, 24453367, 24453366, 24453365, 24453364, 24453363, 24453362, 24453361, 24453360, 24453359, 24453358, 24453357, 24453356, 24453355, 24453354, 24453353, 24453352, 24453351, 24453350, 24453349, 24453348, 24453347, 24453346, 24453345, 24453344, 24453343, 24453342, 24453341, 24453340, 24453339, 24451995, 24451988, 24449947, 24449946, 24449945, 24449944, 24449943, 24449942, 24449941, 24449940, 24449939, 24449938, 24449937, 24449936, 24449935, 24449934, 24449933, 24449932, 24449931, 24449930, 24449929, 24449928, 24449927, 24449926, 24449925, 24449924, 24449923, 24449922, 24449921, 24449920, 24449919, 24449918, 24449917, 24449916, 24449915, 24449914, 24449913, 24449912, 24449911, 24449910, 24449909, 24449908, 24449907, 24449906, 24449905, 24449904, 24449903, 24449902, 24449901, 24449900, 24449899, 24449898, 24449897, 24449896, 24449895, 24449894, 24449893, 24449892, 24449891, 24449890, 24449889, 24449888, 24449887, 24449886, 24449885, 24449884, 24449883, 24449882, 24449881, 24449880, 24449879, 24449878, 24449877, 24449876, 24449875, 24449874, 24449873, 24449872, 24449871, 24449870, 24449869, 24449868, 24449867, 24449866, 24449865, 24449864, 24449863, 24449862, 24449861, 24449860, 24449859, 24449858, 24449857, 24449856, 24449855, 24449854, 24449853, 24449852, 24449851, 24449850, 24449849, 24449848, 24447432, 24446288, 24446286, 24446282, 24443666, 24443665, 24443664, 24443663]
                        },
                        "sigdata": "iVBORw0KGgoAAAANSUhEUgAAAIwAAAA3CAYAAADezaKIAAAOqElEQVR4AeybB5BVRRaGzw9rwggmFhNJKQsQJSiOKygGQEQtBUEwFBSuAUFQMZSAmDAjuiCYRVFRDBQquLqrICoiIohiAJVBBTEnMBWs21837753X9hhYHbAN/fVO+92nz7dffrcv0+f7p6pZsknsUA5LJAAphzGSkTNCgJmt91269W8efMJ7du3n969e/dFPXr0WJxQ8dmAd9u5c+cZJSUl4xs0aNDfTYq/OCr4zQeYXVu0aPHvG264YdQDDzzQbcSIEW2GDBnS8NJLL62bUPHZgHd77bXX/u3OO+/sOXLkyBEOONNr1arVuBBisgGz6+GHH/6vsWPHtmvatGmNQpUSfnFaoH79+tXduy857rjjJteoUaNFvlHGAOM8y7jrrruu0VZbbWXVqlVLqAraYJNNNrFBgwbVb9Wq1RgHmJzlKQIMMctFF13UessttzRJCVVxG7ilqnnjxo2HOtDEvhFgdt555/bNmjWrIW2cYJESvaTKs4FzINXr1KnTMoYWl4kAs+OOO/5VqjyFpKQvaeO2gXMitR1GYt8IMDVr1qwjbdwDkBL9pEq1Qc0YWlwmAsxf3CcJdJNAPxMDkhxE4t8IMHF2kksskN8CMcBkoqtQumfPngYtXry44Lb7iSee8DLvv/9+QZlC7ZfF/+OPP4z2Tz/9dDvyyCOtXbt21rt3b7vttttsxYoVOf1dffXVXpey2t0Q5V9++WWOvhtCj0J95oNMBBgqSSpzO/3aa68Z5PbqBWWXLl3qZX766aeCMlLZfUlxmZ9//tm6du3KOYG98MIL9uOPP5pbSW369Ol200032cEHH2xvv/12rM93333X6yLF25I2bP6SSy6xgQMHxnSVNqxOUrx/MJENmggwFEjxClJuHjlo7ty5dv/99+cdMOWQlFtfWneeu6Yw+j3ttNM8SN544w0PnFdeecXcGZIH0Nlnn22rV6+O9LrsssvskUceifLSuvcvrUXdtZSZMGECJtro9JLSY/QKZv1EgJHSglLhNPW32WYbg9ypsOFNpFx55CApt0xaN97LL79sHCwOHjzY6tWrFxnbnRlY37597ZhjjrHPPvss5mXc4ZMdeOCBkay0bn1LFVuvom0jVax+UmgPPTMpAgxMXFBZhNy2225r7iTQVq5c6Wd2dh1JiOWsz8QYgKxjx4625557Gk/yv/zyS45sdpvk8Rz0+fHHH+eV79Onjw0bNsx22GGHqPyKK66wbt26RXnagR588EHP33vvvc3dndikSZPsscce87xvvvnGy6fyyI8ZM8aOPvpoQ57n1KlTvQxlKfr+++8tJdekSRM/RmIslsuUzHvvvef7wEALFizwafqhvJCu6MMYaBs5CNl+/foZtujSpYsdcMABhjelDEIXd1nsbYwu1L/nnntydEa2EKFjNlXLZqxt/qSTTvIzd8aMGfboo4+WWe3TTz+1ww47zG6//XZr2LCh9wh169a10aNHm7vwtG+//bbMNvAUCBE/Pfvssx6w5FPUvHlzAzS0a2s+vJSZM2euyYUH9YkhACDy6HPeeefZzTffbMj++uuvXhBvRZ7JgZ7u5NPog7jojDPOiI0bIGMTd8vvveApp5xiPXr08Drecsstfpw0utlmmxkeMTONtyafT1f46IMeH330EVlPyL766quG3qTp/4cffvBl8+fPt/bt29vDDz9seFj0KC0t9ZOJCeWF1vEnAoyktUKfrfmASncd7o2DEl988UVUX5KXkhTxhg4dap9//rndcccdfhZecMEF5q7U7cYbbzTAdPnll0eytJ2PaOOII44wDMKL3meffezEE0/0OyRmbr46UtAlVUbAjiFph5lN7MM40As9zH1SslKo+8wzz9jTTz9tzFDioaeeespJmY0bNy7SmbZ4cbycxx9/3Jjd7NBefPFFb6Px48d72b322svojwbwsqSPOuooXyaF/lL9Zz6Rl+Tl4Euyr776yn777TebN2+esSPFW1N21VVXeVvjRWkfu82aNcsGDBhgd911lxE/IVcWSUEfy/hEgIEnqcy1HjlIku2+++5+SWK3goGkUJ9ySAp5Zurzzz9v+++/v3eRUuBL8lteZgFGLmtXxS06gfZDDz3k69WqVcuYZcOHDzcA0LlzZ/vggw9iY0APSAp98uLIA1BuZqXAZ3lEP8qkwCMNAU5erhT4++67r/cSeEUp8EpKSoyXAwClwJNkLN/ujs7YQktpPu1C0v/mSaEcWUiK50844QTDLpL8k8mETeizTZs2kS0Y6/nnn+/By4oghXakwk/6y6YIMFLhilK6LNWAFHicgbRo0cJYIpiJUuAjJ4U0noV8y5YtowFIoUySHXTQQRRbqXObUpov5U+n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",
                        "mediumFileData": []
                    },
                )
            }

            if (S.parallelJobNumber === 8) {
                let user8 = Object.assign({}, orgAdmin)
                user8.email = 'qa+21926865297@trackerproducts.com'
                user8.password = 'Test12345.'
                api.auth.get_tokens_without_page_load(user8)
                generic_request.POST('/api/transfers/V2',
                    {
                        "transaction": {
                            "transferredFromId": 5085010,
                            "transferredToId": 5077358,
                            "notes": "gdgfd",
                            "date": "2026-03-06T12:18:27.905Z",
                            "itemIds": [24429665, 24429664, 24429663, 24429662, 24429661, 24429660, 24429659, 24429658, 24429657, 24429656, 24429655, 24429654, 24429653, 24429652, 24429651, 24429650, 24429649, 24429648, 24429647, 24429646, 24429645, 24429644, 24429643, 24429642, 24429641, 24429640, 24429639, 24429638, 24429637, 24429636, 24429635, 24429634, 24429633, 24429632, 24429631, 24429630, 24429629, 24429628, 24429627, 24429626, 24429625, 24429624, 24429623, 24429622, 24429621, 24429620, 24429619, 24429618, 24429617, 24429616, 24429615, 24429614, 24429613, 24429612, 24429611, 24429610, 24429609, 24429608, 24429607, 24429606, 24429605, 24429604, 24429603, 24429602, 24429601, 24429600, 24429599, 24429598, 24429597, 24429596, 24429595, 24429594, 24429593, 24429592, 24429591, 24429590, 24429589, 24429588, 24429587, 24429586, 24429585, 24429584, 24429583, 24429582, 24429581, 24429580, 24429579, 24429578, 24429577, 24429576, 24429575, 24429574, 24429573, 24429572, 24429571, 24429570, 24429569, 24429568, 24429567, 24429566, 24429565, 24429564, 24429563, 24429562, 24429561, 24429560, 24429559, 24429558, 24429557, 24429556, 24429555, 24429554, 24429553, 24429552, 24429551, 24429550, 24429549, 24429548, 24429494, 24429493, 24429488, 24429473, 24429468, 24429461, 24429460, 24429459, 24429458, 24429457, 24429456, 24429455, 24429454, 24429453, 24429452, 24429451, 24429450, 24429449, 24429448, 24429418, 24429363, 24429362, 24429358, 24429247, 24429193, 24429178, 24429125, 24429124, 24429119, 24429054, 24429053, 24429049, 24428992, 24428934, 24428183, 24428129, 24428128, 24428123, 24428106, 24428052, 24428051, 24428047, 24427982, 24427981, 24427980, 24427979, 24427815, 24427814, 24427760, 24427691, 24427690, 24427685, 24427618, 24427617, 24427613, 24427533, 24427530, 24427413, 24427412, 24427408, 24427339, 24427338, 24427334, 24427073, 24427072, 24427017, 24426944, 24426943, 24426938, 24426598, 24426597, 24426596, 24426595, 24425517, 24425515, 24425514, 24425460, 24425450, 24425386, 24425301, 24425173, 24425169, 24425168, 24425167, 24425104, 24425103, 24425099, 24425088, 24425035, 24425034, 24425030, 24425019, 24424962, 24424961, 24424960, 24424855, 24424802, 24424801, 24424795, 24424663, 24424662, 24424661, 24424595, 24424594, 24424593, 24424584, 24424530, 24424529, 24424525, 24424480, 24424479, 24424478, 24424460, 24424455, 24424454, 24424401, 24424334, 24424333, 24424332, 24424331, 24424330, 24424329, 24424322, 24424319, 24424318, 24424317, 24424314, 24424313, 24424312, 24424311, 24424258, 24423956, 24423955, 24423954, 24423953, 24423952, 24423951, 24423950, 24423949, 24423948, 24423947, 24423946, 24423945, 24423944, 24423943, 24423942, 24423941, 24423940, 24423939, 24423938, 24423937, 24423936, 24423935, 24423934, 24423933, 24423932, 24423931, 24423930, 24423929, 24423928, 24423927, 24423926, 24423925, 24423924, 24423923, 24423922, 24423921, 24423920, 24423919, 24423918, 24423917, 24423916, 24423915, 24423914, 24423913, 24423912, 24423911, 24423910, 24423909, 24423908, 24423907, 24423906, 24423903, 24423901, 24423900, 24423899, 24423898, 24423897, 24423896, 24423895, 24423894, 24423893, 24423892, 24423891, 24423888, 24423887, 24423886, 24423885, 24423883, 24423882, 24423881, 24423880, 24423879, 24423878, 24423877, 24423876, 24423875, 24423874, 24423873, 24423872, 24423871, 24423870, 24423869, 24423868, 24423867, 24423866, 24423865, 24423864, 24423863, 24423860, 24423859, 24423858, 24423857, 24423856, 24423855, 24423854, 24423853, 24423852, 24423849, 24423848, 24423846, 24423845, 24423844, 24423843, 24423842, 24423841, 24423840, 24423839, 24423838, 24423772, 24423771, 24423770, 24423769, 24423768, 24423767, 24423766, 24423765, 24423764, 24423763, 24423762, 24423761, 24423760, 24423759, 24423758, 24423757, 24423756, 24423755, 24423754, 24423753, 24423752, 24423751, 24423750, 24423749, 24423748, 24423747, 24423746, 24423745, 24423744, 24423743, 24423742, 24423741, 24423740, 24423739, 24423738, 24423737, 24423736, 24423735, 24423734, 24423733, 24423732, 24423731, 24423730, 24423729, 24423728, 24423727, 24423726, 24423725, 24423724, 24423723, 24423722, 24423721, 24423609, 24423608, 24423603, 24423602, 24423601, 24423600, 24423599, 24423598, 24423597, 24423596, 24423595, 24423594, 24423593, 24423592, 24423591, 24423590, 24423589, 24423588, 24423587, 24423586, 24423585, 24423584, 24423583, 24423582, 24423581, 24423580, 24423579, 24423578, 24423577, 24423576, 24423575, 24423574, 24423573, 24423572, 24423571, 24423570, 24423569, 24423568, 24423567, 24423566, 24423565, 24423564, 24423563, 24423562, 24423561, 24423560, 24423559, 24423558, 24423557, 24423556, 24423555, 24423554, 24423553, 24423552, 24423551, 24423550, 24423549, 24423548, 24423547, 24423546, 24423545, 24423544, 24423539, 24423538, 24423534, 24423533, 24423532, 24423531, 24423530, 24423529, 24423528, 24423527, 24423526, 24423525, 24423524, 24423523, 24423522, 24423521, 24423520, 24423519, 24423518, 24423517, 24423516, 24423515, 24423514, 24423513, 24423512, 24423511, 24423510, 24423509, 24423508, 24423507, 24423506, 24423505, 24423504, 24423503, 24423502, 24423501, 24423500, 24423499, 24423498, 24423497, 24423496, 24423495, 24423494, 24423493, 24423492, 24423491, 24423490, 24423489, 24423488, 24423487, 24423486, 24423485, 24423484, 24423482, 24423480, 24423479, 24423478, 24423477, 24423476, 24423475, 24423474, 24423473, 24423469, 24423416, 24423415, 24423414, 24423413, 24423412, 24423411, 24423410, 24423409, 24423346, 24423345, 24423344, 24423343, 24423342, 24423341, 24423340, 24423339, 24423338, 24423337, 24423336, 24423335, 24423334, 24423333, 24423332, 24423331, 24423330, 24423329, 24423328, 24423192, 24423191, 24423190, 24423145, 24423144, 24423143, 24423132, 24422863, 24422862, 24422861, 24422860, 24422859, 24422858, 24422857, 24422856, 24422855, 24422854, 24422853, 24422852, 24422851, 24422850, 24422849, 24422848, 24422847, 24422846, 24422845, 24422844, 24422843, 24422842, 24422841, 24422840, 24422839, 24422838, 24422837, 24422836, 24422835, 24422834, 24422833, 24422832, 24422831, 24422830, 24422829, 24422828, 24422827, 24422826, 24422825, 24422824, 24422823, 24422822, 24422821, 24422820, 24422819, 24422818, 24422817, 24422816, 24422815, 24422814, 24422813, 24422811, 24422810, 24422809, 24422808, 24422807, 24422806, 24422805, 24422804, 24422803, 24422802, 24422801, 24422800, 24422799, 24422798, 24422797, 24422796, 24422795, 24422794, 24422793, 24422792, 24422791, 24422790, 24422789, 24422788, 24422787, 24422786, 24422785, 24422784, 24422783, 24422782, 24422781, 24422780, 24422779, 24422778, 24422777, 24422776, 24422775, 24422774, 24422773, 24422772, 24422771, 24422770, 24422769, 24422768, 24422767, 24422766, 24422765, 24422764, 24422763, 24422762, 24422761, 24422759, 24422758, 24422757, 24422756, 24422755, 24422754, 24422753, 24422752, 24422751, 24422750, 24422749, 24422748, 24422747, 24422746, 24422745, 24422744, 24422743, 24422742, 24422741, 24422740, 24422739, 24422738, 24422737, 24422736, 24422735, 24422734, 24422733, 24422732, 24422731, 24422730, 24422729, 24422728, 24422727, 24422726, 24422725, 24422724, 24422723, 24422722, 24422721, 24422720, 24422719, 24422718, 24422717, 24422716, 24422715, 24422714, 24422713, 24422712, 24422711, 24422710, 24422709, 24422656, 24422655, 24422654, 24422653, 24422652, 24422651, 24422650, 24422649, 24422648, 24422647, 24422646, 24422645, 24422644, 24422643, 24422642, 24422641, 24422640, 24422639, 24422638, 24422637, 24422636, 24422635, 24422634, 24422633, 24422632, 24422631, 24422630, 24422629, 24422628, 24422627, 24422626, 24422625, 24422624, 24422623, 24422622, 24422621, 24422620, 24422619, 24422618, 24422617, 24422616, 24422615, 24422614, 24422613, 24422612, 24422611, 24422610, 24422609, 24422608, 24422607, 24422606, 24422605, 24422604, 24422603, 24422602, 24422601, 24422600, 24422599, 24422598, 24422597, 24421809, 24421808, 24421807, 24421806, 24421805, 24421804, 24421801, 24421800, 24421799, 24421797, 24421796, 24421795, 24421716, 24421715, 24421713, 24421712, 24421711, 24421710, 24421709, 24421708, 24421707, 24421706, 24421705, 24421704, 24421703, 24421702, 24421701, 24421700, 24421699, 24421698, 24421697, 24421696, 24421695, 24421694, 24421693, 24421692, 24421691, 24421690, 24421689, 24421688, 24421687, 24421686, 24421685, 24421684, 24421683, 24421682, 24421681, 24421680, 24421679, 24421678, 24421677, 24421676, 24421675, 24421674, 24421673, 24421672, 24421671, 24421670, 24421669, 24421668, 24421667, 24421666, 24421665, 24421664, 24421663, 24421543, 24421542, 24421541, 24421540, 24421539, 24421538, 24421537, 24421536, 24421535, 24421534, 24421533, 24421532, 24421531, 24421530, 24421529, 24421528, 24421527, 24421526, 24421525, 24421524, 24421523, 24421522, 24421521, 24421520, 24421519, 24421518, 24421517, 24421516, 24421515, 24421514, 24421513, 24421512, 24421511, 24421510, 24421509, 24421508, 24421507, 24421506, 24421505, 24421504, 24421503, 24421502, 24421501, 24421500, 24421499, 24421498, 24421497, 24421496, 24421495, 24421494, 24421493, 24421491, 24421490, 24421489, 24421488, 24421487, 24421486, 24421485, 24421484, 24421483, 24421482, 24421481, 24421480, 24421479, 24421478, 24421477, 24421476, 24421475, 24421474, 24421473, 24421472, 24421471, 24421470, 24421469, 24421468, 24421467, 24421466, 24421465, 24421464, 24421463, 24421462, 24421461, 24421460, 24421459, 24421458, 24421457, 24421456, 24421455, 24421454, 24421453, 24421452, 24421451, 24421450, 24421449, 24421448, 24421447, 24421446, 24421445, 24421444, 24421443, 24421442, 24421441, 24419452, 24419451, 24419450, 24419449, 24419448, 24419447, 24419446, 24419445, 24419444, 24419443, 24419442, 24419441, 24419440, 24419231, 24419230, 24419225, 24419224, 24419223, 24419222, 24419221, 24419220, 24419213, 24419212, 24419205, 24419204, 24419203, 24419201, 24419148, 24419147, 24419146, 24416167, 24393545, 23548114, 23548113, 23548112, 23547983, 23547975, 23547968, 23547967, 23547966, 23547965, 23547964, 23547963, 23547962, 23547961, 23547960, 23547959, 23547958, 23547957, 23547956, 23547955, 23547954]
                        },
                        "sigdata": "iVBORw0KGgoAAAANSUhEUgAAAIwAAAA3CAYAAADezaKIAAAOqElEQVR4AeybB5BVRRaGzw9rwggmFhNJKQsQJSiOKygGQEQtBUEwFBSuAUFQMZSAmDAjuiCYRVFRDBQquLqrICoiIohiAJVBBTEnMBWs21837753X9hhYHbAN/fVO+92nz7dffrcv0+f7p6pZsknsUA5LJAAphzGSkTNCgJmt91269W8efMJ7du3n969e/dFPXr0WJxQ8dmAd9u5c+cZJSUl4xs0aNDfTYq/OCr4zQeYXVu0aPHvG264YdQDDzzQbcSIEW2GDBnS8NJLL62bUPHZgHd77bXX/u3OO+/sOXLkyBEOONNr1arVuBBisgGz6+GHH/6vsWPHtmvatGmNQpUSfnFaoH79+tXduy857rjjJteoUaNFvlHGAOM8y7jrrruu0VZbbWXVqlVLqAraYJNNNrFBgwbVb9Wq1RgHmJzlKQIMMctFF13UessttzRJCVVxG7ilqnnjxo2HOtDEvhFgdt555/bNmjWrIW2cYJESvaTKs4FzINXr1KnTMoYWl4kAs+OOO/5VqjyFpKQvaeO2gXMitR1GYt8IMDVr1qwjbdwDkBL9pEq1Qc0YWlwmAsxf3CcJdJNAPxMDkhxE4t8IMHF2kksskN8CMcBkoqtQumfPngYtXry44Lb7iSee8DLvv/9+QZlC7ZfF/+OPP4z2Tz/9dDvyyCOtXbt21rt3b7vttttsxYoVOf1dffXVXpey2t0Q5V9++WWOvhtCj0J95oNMBBgqSSpzO/3aa68Z5PbqBWWXLl3qZX766aeCMlLZfUlxmZ9//tm6du3KOYG98MIL9uOPP5pbSW369Ol200032cEHH2xvv/12rM93333X6yLF25I2bP6SSy6xgQMHxnSVNqxOUrx/MJENmggwFEjxClJuHjlo7ty5dv/99+cdMOWQlFtfWneeu6Yw+j3ttNM8SN544w0PnFdeecXcGZIH0Nlnn22rV6+O9LrsssvskUceifLSuvcvrUXdtZSZMGECJtro9JLSY/QKZv1EgJHSglLhNPW32WYbg9ypsOFNpFx55CApt0xaN97LL79sHCwOHjzY6tWrFxnbnRlY37597ZhjjrHPPvss5mXc4ZMdeOCBkay0bn1LFVuvom0jVax+UmgPPTMpAgxMXFBZhNy2225r7iTQVq5c6Wd2dh1JiOWsz8QYgKxjx4625557Gk/yv/zyS45sdpvk8Rz0+fHHH+eV79Onjw0bNsx22GGHqPyKK66wbt26RXnagR588EHP33vvvc3dndikSZPsscce87xvvvnGy6fyyI8ZM8aOPvpoQ57n1KlTvQxlKfr+++8tJdekSRM/RmIslsuUzHvvvef7wEALFizwafqhvJCu6MMYaBs5CNl+/foZtujSpYsdcMABhjelDEIXd1nsbYwu1L/nnntydEa2EKFjNlXLZqxt/qSTTvIzd8aMGfboo4+WWe3TTz+1ww47zG6//XZr2LCh9wh169a10aNHm7vwtG+//bbMNvAUCBE/Pfvssx6w5FPUvHlzAzS0a2s+vJSZM2euyYUH9YkhACDy6HPeeefZzTffbMj++uuvXhBvRZ7JgZ7u5NPog7jojDPOiI0bIGMTd8vvveApp5xiPXr08Drecsstfpw0utlmmxkeMTONtyafT1f46IMeH330EVlPyL766quG3qTp/4cffvBl8+fPt/bt29vDDz9seFj0KC0t9ZOJCeWF1vEnAoyktUKfrfmASncd7o2DEl988UVUX5KXkhTxhg4dap9//rndcccdfhZecMEF5q7U7cYbbzTAdPnll0eytJ2PaOOII44wDMKL3meffezEE0/0OyRmbr46UtAlVUbAjiFph5lN7MM40As9zH1SslKo+8wzz9jTTz9tzFDioaeeespJmY0bNy7SmbZ4cbycxx9/3Jjd7NBefPFFb6Px48d72b322svojwbwsqSPOuooXyaF/lL9Zz6Rl+Tl4Euyr776yn777TebN2+esSPFW1N21VVXeVvjRWkfu82aNcsGDBhgd911lxE/IVcWSUEfy/hEgIEnqcy1HjlIku2+++5+SWK3goGkUJ9ySAp5Zurzzz9v+++/v3eRUuBL8lteZgFGLmtXxS06gfZDDz3k69WqVcuYZcOHDzcA0LlzZ/vggw9iY0APSAp98uLIA1BuZqXAZ3lEP8qkwCMNAU5erhT4++67r/cSeEUp8EpKSoyXAwClwJNkLN/ujs7YQktpPu1C0v/mSaEcWUiK50844QTDLpL8k8mETeizTZs2kS0Y6/nnn+/By4oghXakwk/6y6YIMFLhilK6LNWAFHicgbRo0cJYIpiJUuAjJ4U0noV8y5YtowFIoUySHXTQQRRbqXObUpov5U+n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",
                        "mediumFileData": []
                    },
                )
            }

            if (S.parallelJobNumber === 9) {
                let user9 = Object.assign({}, orgAdmin)
                user9.email = 'qa+21926758469@trackerproducts.com'
                user9.password = 'Test12345.'
                api.auth.get_tokens_without_page_load(user9)
                generic_request.POST('/api/transfers/V2',
                    {
                        "transaction": {
                            "transferredFromId": 5085057,
                            "transferredToId": 5077358,
                            "notes": "",
                            "date": "2026-03-06T12:32:16.462Z",
                            "itemIds": [24456579, 24456578, 24456577, 24456576, 24456575, 24456574, 24456573, 24456572, 24456571, 24456570, 24456569, 24456568, 24456567, 24456566, 24456565, 24456564, 24456563, 24456562, 24456561, 24456560, 24456559, 24456558, 24456557, 24456556, 24456555, 24456554, 24456553, 24456552, 24456551, 24456550, 24456549, 24456548, 24456547, 24456546, 24456545, 24456544, 24456543, 24456542, 24456541, 24456540, 24456539, 24456538, 24456537, 24456536, 24456535, 24456534, 24456533, 24456532, 24456531, 24456530, 24456529, 24456528, 24456527, 24456526, 24456525, 24456524, 24456523, 24456522, 24456521, 24456520, 24456519, 24456518, 24456517, 24456516, 24456515, 24456514, 24456513, 24456512, 24456511, 24456510, 24456509, 24456508, 24456507, 24456506, 24456505, 24456504, 24456503, 24456502, 24456501, 24456500, 24456499, 24456498, 24456497, 24456496, 24456495, 24456494, 24456492, 24456491, 24456490, 24456489, 24456488, 24456487, 24456486, 24456485, 24456484, 24456483, 24456482, 24456481, 24456480, 24456479, 24456478, 24456477, 24456476, 24456475, 24456474, 24456473, 24456472, 24456471, 24456470, 24456469, 24456468, 24456467, 24456466, 24456465, 24456464, 24456463, 24456462, 24456461, 24456460, 24456459, 24456458, 24456457, 24456456, 24456455, 24456454, 24456453, 24456452, 24456451, 24456450, 24456449, 24456448, 24456447, 24456446, 24456445, 24456444, 24456443, 24456442, 24456441, 24456440, 24456439, 24456438, 24456437, 24456436, 24456435, 24456434, 24456433, 24456432, 24456431, 24456430, 24456429, 24456428, 24456427, 24456426, 24456425, 24456424, 24456423, 24456422, 24456421, 24456420, 24456419, 24456418, 24456417, 24456416, 24456415, 24456414, 24456413, 24456412, 24456411, 24456410, 24456409, 24456408, 24456407, 24456406, 24456405, 24456404, 24456403, 24456402, 24456401, 24456400, 24456399, 24456398, 24456397, 24456396, 24456395, 24456394, 24456393, 24456391, 24456390, 24456389, 24456388, 24456387, 24456386, 24456385, 24456384, 24456383, 24456382, 24456381, 24456380, 24456379, 24456378, 24456377, 24456376, 24456375, 24456374, 24456373, 24456372, 24456371, 24456370, 24456369, 24456368, 24456367, 24456366, 24456365, 24456364, 24456363, 24456362, 24456361, 24456360, 24456359, 24456358, 24456357, 24456356, 24456355, 24456354, 24456353, 24456352, 24456351, 24456350, 24456349, 24456348, 24456347, 24456346, 24456345, 24456344, 24456343, 24456342, 24456341, 24456340, 24456339, 24456338, 24456337, 24456336, 24456335, 24456334, 24456333, 24456332, 24456331, 24456330, 24456329, 24456328, 24456327, 24456326, 24456325, 24456324, 24456323, 24456322, 24456321, 24456320, 24456319, 24456318, 24456317, 24456316, 24456315, 24456314, 24456313, 24456312, 24456311, 24456310, 24456309, 24456308, 24456307, 24456306, 24456305, 24456304, 24456303, 24456302, 24456301, 24456300, 24456299, 24456298, 24456297, 24456296, 24456295, 24456294, 24456293, 24456292, 24456290, 24456289, 24456288, 24456287, 24456286, 24456285, 24456284, 24456283, 24456282, 24456281, 24456280, 24456279, 24456278, 24456277, 24456276, 24456275, 24456274, 24456273, 24456272, 24456271, 24456270, 24456269, 24456268, 24456267, 24456266, 24456265, 24456264, 24456263, 24456262, 24456261, 24456260, 24456259, 24456258, 24456257, 24456256, 24456255, 24456254, 24456253, 24456252, 24456251, 24456250, 24456249, 24456248, 24456247, 24456246, 24456245, 24456244, 24456243, 24456242, 24456241, 24456240, 24456239, 24456238, 24456237, 24456236, 24456235, 24456234, 24456233, 24456232, 24456231, 24456230, 24456229, 24456228, 24456227, 24456226, 24456225, 24456224, 24456223, 24456222, 24456221, 24456220, 24456219, 24456218, 24456217, 24456216, 24456215, 24456214, 24456213, 24456212, 24456211, 24456210, 24456209, 24456208, 24456207, 24456206, 24456205, 24456204, 24456203, 24456202, 24456201, 24456200, 24456199, 24456198, 24456197, 24456196, 24456195, 24456194, 24456193, 24456192, 24456191, 24456189, 24456188, 24456187, 24456186, 24456185, 24456184, 24456183, 24456182, 24456181, 24456180, 24456179, 24456178, 24456177, 24456176, 24456175, 24456174, 24456173, 24456172, 24456171, 24456170, 24456169, 24456168, 24456167, 24456166, 24456165, 24456164, 24456163, 24456162, 24456161, 24456160, 24456159, 24456158, 24456157, 24456156, 24456155, 24456154, 24456153, 24456152, 24456151, 24456150, 24456149, 24456148, 24456147, 24456146, 24456145, 24456144, 24456143, 24456142, 24456141, 24456140, 24456139, 24456138, 24456137, 24456136, 24456135, 24456134, 24456133, 24456132, 24456131, 24456130, 24456129, 24456128, 24456127, 24456126, 24456125, 24456124, 24456123, 24456122, 24456121, 24456120, 24456119, 24456118, 24456117, 24456116, 24456115, 24456114, 24456113, 24456112, 24456111, 24456110, 24456109, 24456108, 24456107, 24456106, 24456105, 24456104, 24456103, 24456102, 24456101, 24456100, 24456099, 24456098, 24456097, 24456096, 24456095, 24456094, 24456093, 24456092, 24456091, 24456090, 24456078, 24456077, 24456076, 24456075, 24456074, 24456073, 24456072, 24456071, 24456070, 24456069, 24456068, 24456067, 24456066, 24456065, 24456064, 24456063, 24456062, 24456061, 24456060, 24456059, 24456058, 24456057, 24456056, 24456055, 24456054, 24456053, 24456052, 24456051, 24456050, 24456049, 24456048, 24456047, 24456046, 24456045, 24456044, 24456043, 24456042, 24456041, 24456040, 24456039, 24456038, 24456037, 24456036, 24456035, 24456034, 24456033, 24456032, 24456031, 24456030, 24456029, 24456028, 24456027, 24456026, 24456025, 24456024, 24456023, 24456022, 24456021, 24456020, 24456019, 24456018, 24456017, 24456016, 24456015, 24456014, 24456013, 24456012, 24456011, 24456010, 24456009, 24456008, 24456007, 24456006, 24456005, 24456004, 24456003, 24456002, 24456001, 24456000, 24455999, 24455998, 24455997, 24455996, 24455995, 24455994, 24455993, 24455992, 24455991, 24455990, 24455989, 24455988, 24455987, 24455986, 24455985, 24455984, 24455983, 24455982, 24455981, 24455980, 24455979, 24455977, 24455976, 24455975, 24455974, 24455973, 24455972, 24455971, 24455970, 24455969, 24455968, 24455967, 24455966, 24455965, 24455964, 24455963, 24455962, 24455961, 24455960, 24455959, 24455958, 24455957, 24455956, 24455955, 24455954, 24455953, 24455952, 24455951, 24455950, 24455949, 24455948, 24455947, 24455946, 24455945, 24455944, 24455943, 24455942, 24455941, 24455940, 24455939, 24455938, 24455937, 24455936, 24455935, 24455934, 24455933, 24455932, 24455931, 24455930, 24455929, 24455928, 24455927, 24455926, 24455925, 24455924, 24455923, 24455922, 24455921, 24455920, 24455919, 24455918, 24455917, 24455916, 24455915, 24455914, 24455913, 24455912, 24455911, 24455910, 24455909, 24455908, 24455907, 24455906, 24455905, 24455904, 24455903, 24455902, 24455901, 24455900, 24455899, 24455898, 24455897, 24455896, 24455895, 24455894, 24455893, 24455892, 24455891, 24455890, 24455889, 24455888, 24455887, 24455886, 24455885, 24455884, 24455883, 24455882, 24455881, 24455880, 24455879, 24455878, 24455876, 24455875, 24455874, 24455873, 24455872, 24455871, 24455870, 24455869, 24455868, 24455867, 24455866, 24455865, 24455864, 24455863, 24455862, 24455861, 24455860, 24455859, 24455858, 24455857, 24455856, 24455855, 24455854, 24455853, 24455852, 24455851, 24455850, 24455849, 24455848, 24455847, 24455846, 24455845, 24455844, 24455843, 24455842, 24455841, 24455840, 24455839, 24455838, 24455837, 24455836, 24455835, 24455834, 24455833, 24455832, 24455831, 24455830, 24455829, 24455828, 24455827, 24455826, 24455825, 24455824, 24455823, 24455822, 24455821, 24455820, 24455819, 24455818, 24455817, 24455816, 24455815, 24455814, 24455813, 24455812, 24455811, 24455810, 24455809, 24455808, 24455807, 24455806, 24455805, 24455804, 24455803, 24455802, 24455801, 24455800, 24455799, 24455798, 24455797, 24455796, 24455795, 24455794, 24455793, 24455792, 24455791, 24455790, 24455789, 24455788, 24455787, 24455786, 24455785, 24455784, 24455783, 24455782, 24455781, 24455780, 24455779, 24455778, 24455777, 24455775, 24455774, 24455773, 24455772, 24455771, 24455770, 24455769, 24455768, 24455767, 24455766, 24455765, 24455764, 24455763, 24455762, 24455761, 24455760, 24455759, 24455758, 24455757, 24455756, 24455755, 24455754, 24455753, 24455752, 24455751, 24455750, 24455749, 24455748, 24455747, 24455746, 24455745, 24455744, 24455743, 24455742, 24455741, 24455740, 24455739, 24455738, 24455737, 24455736, 24455735, 24455734, 24455733, 24455732, 24455731, 24455730, 24455729, 24455728, 24455727, 24455726, 24455725, 24455724, 24455723, 24455722, 24455721, 24455720, 24455719, 24455718, 24455717, 24455716, 24455715, 24455714, 24455713, 24455712, 24455711, 24455710, 24455709, 24455708, 24455707, 24455706, 24455705, 24455704, 24455703, 24455702, 24455701, 24455700, 24455699, 24455698, 24455697, 24455696, 24455695, 24455694, 24455693, 24455692, 24455691, 24455690, 24455689, 24455688, 24455687, 24455686, 24455685, 24455684, 24455683, 24455682, 24455681, 24455680, 24455679, 24455678, 24455677, 24455676, 24455674, 24455673, 24455672, 24455671, 24455670, 24455669, 24455668, 24455667, 24455666, 24455665, 24455664, 24455663, 24455662, 24455661, 24455660, 24455659, 24455658, 24455657, 24455656, 24455655, 24455654, 24455653, 24455652, 24455651, 24455650, 24455649, 24455648, 24455647, 24455646, 24455645, 24455644, 24455643, 24455642, 24455641, 24455640, 24455639, 24455638, 24455637, 24455636, 24455635, 24455634, 24455633, 24455632, 24455631, 24455630, 24455629, 24455628, 24455627, 24455626, 24455625, 24455624, 24455623, 24455622, 24455621, 24455620, 24455619, 24455618, 24455617, 24455616, 24455615, 24455614, 24455613, 24455612, 24455611, 24455610, 24455609, 24455608, 24455607, 24455606, 24455605, 24455604, 24455603, 24455602, 24455601, 24455600, 24455599, 24455598, 24455597, 24455596, 24455595, 24455594, 24455593, 24455592, 24455591, 24455590, 24455589, 24455588, 24455587, 24455586, 24455585, 24455584, 24455583, 24455582, 24455581, 24455580, 24455579, 24455578, 24455577, 24455576, 24455575, 24455573, 24455572, 24455571, 24455570, 24455569, 24455568, 24455567, 24455566, 24455565, 24455564, 24455563, 24455562, 24455561, 24455560]
                        },
                        "sigdata": "iVBORw0KGgoAAAANSUhEUgAAAIwAAAA3CAYAAADezaKIAAAOqElEQVR4AeybB5BVRRaGzw9rwggmFhNJKQsQJSiOKygGQEQtBUEwFBSuAUFQMZSAmDAjuiCYRVFRDBQquLqrICoiIohiAJVBBTEnMBWs21837753X9hhYHbAN/fVO+92nz7dffrcv0+f7p6pZsknsUA5LJAAphzGSkTNCgJmt91269W8efMJ7du3n969e/dFPXr0WJxQ8dmAd9u5c+cZJSUl4xs0aNDfTYq/OCr4zQeYXVu0aPHvG264YdQDDzzQbcSIEW2GDBnS8NJLL62bUPHZgHd77bXX/u3OO+/sOXLkyBEOONNr1arVuBBisgGz6+GHH/6vsWPHtmvatGmNQpUSfnFaoH79+tXduy857rjjJteoUaNFvlHGAOM8y7jrrruu0VZbbWXVqlVLqAraYJNNNrFBgwbVb9Wq1RgHmJzlKQIMMctFF13UessttzRJCVVxG7ilqnnjxo2HOtDEvhFgdt555/bNmjWrIW2cYJESvaTKs4FzINXr1KnTMoYWl4kAs+OOO/5VqjyFpKQvaeO2gXMitR1GYt8IMDVr1qwjbdwDkBL9pEq1Qc0YWlwmAsxf3CcJdJNAPxMDkhxE4t8IMHF2kksskN8CMcBkoqtQumfPngYtXry44Lb7iSee8DLvv/9+QZlC7ZfF/+OPP4z2Tz/9dDvyyCOtXbt21rt3b7vttttsxYoVOf1dffXVXpey2t0Q5V9++WWOvhtCj0J95oNMBBgqSSpzO/3aa68Z5PbqBWWXLl3qZX766aeCMlLZfUlxmZ9//tm6du3KOYG98MIL9uOPP5pbSW369Ol200032cEHH2xvv/12rM93333X6yLF25I2bP6SSy6xgQMHxnSVNqxOUrx/MJENmggwFEjxClJuHjlo7ty5dv/99+cdMOWQlFtfWneeu6Yw+j3ttNM8SN544w0PnFdeecXcGZIH0Nlnn22rV6+O9LrsssvskUceifLSuvcvrUXdtZSZMGECJtro9JLSY/QKZv1EgJHSglLhNPW32WYbg9ypsOFNpFx55CApt0xaN97LL79sHCwOHjzY6tWrFxnbnRlY37597ZhjjrHPPvss5mXc4ZMdeOCBkay0bn1LFVuvom0jVax+UmgPPTMpAgxMXFBZhNy2225r7iTQVq5c6Wd2dh1JiOWsz8QYgKxjx4625557Gk/yv/zyS45sdpvk8Rz0+fHHH+eV79Onjw0bNsx22GGHqPyKK66wbt26RXnagR588EHP33vvvc3dndikSZPsscce87xvvvnGy6fyyI8ZM8aOPvpoQ57n1KlTvQxlKfr+++8tJdekSRM/RmIslsuUzHvvvef7wEALFizwafqhvJCu6MMYaBs5CNl+/foZtujSpYsdcMABhjelDEIXd1nsbYwu1L/nnntydEa2EKFjNlXLZqxt/qSTTvIzd8aMGfboo4+WWe3TTz+1ww47zG6//XZr2LCh9wh169a10aNHm7vwtG+//bbMNvAUCBE/Pfvssx6w5FPUvHlzAzS0a2s+vJSZM2euyYUH9YkhACDy6HPeeefZzTffbMj++uuvXhBvRZ7JgZ7u5NPog7jojDPOiI0bIGMTd8vvveApp5xiPXr08Drecsstfpw0utlmmxkeMTONtyafT1f46IMeH330EVlPyL766quG3qTp/4cffvBl8+fPt/bt29vDDz9seFj0KC0t9ZOJCeWF1vEnAoyktUKfrfmASncd7o2DEl988UVUX5KXkhTxhg4dap9//rndcccdfhZecMEF5q7U7cYbbzTAdPnll0eytJ2PaOOII44wDMKL3meffezEE0/0OyRmbr46UtAlVUbAjiFph5lN7MM40As9zH1SslKo+8wzz9jTTz9tzFDioaeeespJmY0bNy7SmbZ4cbycxx9/3Jjd7NBefPFFb6Px48d72b322svojwbwsqSPOuooXyaF/lL9Zz6Rl+Tl4Euyr776yn777TebN2+esSPFW1N21VVXeVvjRWkfu82aNcsGDBhgd911lxE/IVcWSUEfy/hEgIEnqcy1HjlIku2+++5+SWK3goGkUJ9ySAp5Zurzzz9v+++/v3eRUuBL8lteZgFGLmtXxS06gfZDDz3k69WqVcuYZcOHDzcA0LlzZ/vggw9iY0APSAp98uLIA1BuZqXAZ3lEP8qkwCMNAU5erhT4++67r/cSeEUp8EpKSoyXAwClwJNkLN/ujs7YQktpPu1C0v/mSaEcWUiK50844QTDLpL8k8mETeizTZs2kS0Y6/nnn+/By4oghXakwk/6y6YIMFLhilK6LNWAFHicgbRo0cJYIpiJUuAjJ4U0noV8y5YtowFIoUySHXTQQRRbqXObUpov5U+n4gJ2TNOmTTNmEAaaM2eOB87rr78e9eMbdj9SaOvDDz80loX69etHMlIoIw5wojE++UywSEEWPiSFPLFN9+7d/Uujf7wnk6hDhw6GXngCKchKoqonSVF/nuF+pDRPCmnH9l8pnic+kQJPkrehF3Q/AwYM8F5lwJonXp2xZ08qKV1fiqddM7FvBBi4UlxYys0jB0mhDOSyRqPIhRdeaN999x3FniR5Y+BhYLBWS4EnpZ/wKeecRUrzpbLTvCh2SM8995xfBlatWmVjx471/UqiWU+SPI91fvvtt/dpKfCk8GQMCEshTxrabrvtcuThQ1KQleSX2AYNGtixxx7rQcwSRl877bQTorE2PMP9SOn6Luu/UponhTQFUkhLIuspG/ipZfWtt97yxwksoZmEV8QGkmL6SLl530HWz3oDRpKxLnMIhTIEiJKibiQZwSKM33//Pa+SAIVyDCsprwwerG3btt4IUn4Zlg7a4RRaSsvAk0KePpYtW5a3D2KCTFlJZD1JitXxTPcjBT4xEGOnfQJR4gTiCp7wnGhOfSnUldLPbDkplMGHpJCXRDbWpiQD3BT079/feza8Wz6SlFNXivNoJ5sqBDCS7NxzzzXcI8EfgR4dSUEBAEWe4EwKPCn9ZECUZ88WKS2D0XkBBJ9Smi+l0yngMaulwKddSAp5lhfyBKhS4EnhmdJDCnnkICnkpfQTPiQFHt6EU+dJkyYZOzB2hCk9WAYzZSWR9SQpenHEZDCJCaU0nwkAH5ICnzQkhbwUnpxPwecknBgzk5i4eGLsKAV5qfCTdrIpAkxZEXOqnAYkRdF6ir/pppvaqFGj/FE9J7DmPqmy2rVrW+vWrf2pLOt7is8TcBHBsw2kDXj5iBiladOmxoBZ+thiZsp9/fXX/kW5bg1PlCojD6XyZ555pteRw7/M8x92PO+88w6i/gUiL8nnSWeTpEiOMl5y9erVbeutt47ZBs/DEkBDLNfIQix/eGTSKWI5Qw6bpHg8iYfgS4ratjUfSREPWYJvQMNYmBTwUoQugJklKsUr62lZnwgw8KVgBKnwEzlIypVhm3vOOedQHJEU5FJxzvHHH29XXnmlPyO45pprrFevXn4nwZZQCrJS7nPzzTf3W0J2Hffee68H4H777Wennnqq8SSWmTx5sgcLQZ6UbgNlpJBHRwDHdQIgPuuss6xTp0528cUXR0unFGQlUdWTJA8QKTw90/1IIc+4CGzZVrMTY+vNwRoHbCmvxpInBXm87qJFi4x6Tz75pG+b7TUn2QSn1L3++uv9eQqAw8NKoa4Unq57X08KeUmGnaiHt2Nc2Pq+++7zdiJNO2wSpHQdKX+a9rOp3IDBxeHapPydYHheBHJbbLFFNCAMhHfhkI4ZA7A4uSTPNnCPPfaIZKX8bdMGwRw31bT/ySefGDszYhJeCqBkSSQQl0IbGAhZKeQl+ctL5Fq1auWvEVg6Jk6caIcccoi3jxRkASd1M8chhTJsAEkhzykr4Ofyk+UZ4myKg012S7Qzb968aIwACY8JcF966SXPR5+7777bH1dwdIDH3mWXXfwJNMs1ekqhv9S4MscqhTJsypJEe9ia7fQ0t5vEi3NCjSeTgqxU+OmNkfUTAUYqXFFKl7HPJwCV0jwpnQbhlCOHwlK6DFBwmMT9E1s7niwFGEVKy0mF0wR1nKbSPsffnLqyHM2ePdu4lMw2ILEFslJoky0+ZyIYlb45QUWnQw891JjxzEyuFiQZF5nUzR6HJGOMkBTa5SyEk2J0YWxLliwxzpYAOVcPtMOfhUhBnv5YepC/9dZbPWAkGdtwQEZ9CB1pm77wEFKonxpXIdvhSYmnsDH68GScawsWKfSThZf4fz5KQUj6/z+Ja6T176eQwaT8beORGjVqZCxrUlqGNR/QMet5QVK6TCpfuiLGxsTIBr9UPj2kIL+u+mSDhXzkYcoKfiqufMP+GSSnwSw1w4YN8x4E4HCEz4kp3oX4pljGWhHjACSZFAEmk1nMaTwSwfHJJ5/s4xcCZLbq3ECzA+NZzONf37FFgJEU255VBDo31ja4omAnQfzCLS9LEXEEVwMbq84bQi9Jlv2JAEOBpCj4kpK0VLVtACayKQLMf9xHqtoGkpLxS2kbZIOFfAQYdzi0XEoLS0laqto2cD5kJSDJpAgw7vBrqVS1DSQl45fSNnBXF0sywUI6Aszy5ctnukuy1VK6glSl01U6nnMrjrmT9IWAJJMiwCxcuPAfbos5y7mhKrNb2hA7jz9Ln4MGDXrTXQoPyQQL6QgwLrPKXe//3d1mLpYSzyJVXRu4a4dl7u5psMPECkexbyZg+Mv9BU64qzsNnV1aWposT1UMNCxDvXv3ftOdfPdx91hTY0hZk4kBBp6rNGfKlCklXbp0Ge4uzf7Zp0+f+e6qvTShfkVrg759+y7o1q3blI4dO450l51tC4EFfOQABqajVXPnzh3qjtA7OI/TbPTo0fUSKl4bjBkzpsnEiRM7uZhloHv3OcuQ40XfQoCJBJJEYoFMCySAybTGnzRdmWongKlMaxdBXwlgiuAlVuYQEsBUprWLoK8EMEXwEitzCAlgKtPaRdBXApgieImVOYQEMJVp7SLoa70AUwTjT4ZQTgskgCmnwaq6eAKYqo6Aco4/AUw5DVbVxf8LAAD//zTkojMAAAAGSURBVAMAX4q558LHiOYAAAAASUVORK5CYII=",
                        "mediumFileData": []
                    },
                )
            }

            if (S.parallelJobNumber === 10) {
                let user10 = Object.assign({}, orgAdmin)
                user10.email = 'qa+21926613034@trackerproducts.com'
                user10.password = 'Test12345.'
                api.auth.get_tokens_without_page_load(user10)
                generic_request.POST('/api/transfers/V2',
                    {
                        "transaction": {
                            "transferredFromId": 5085057,
                            "transferredToId": 5077358,
                            "notes": "",
                            "date": "2026-03-06T12:34:29.892Z",
                            "itemIds": [24455559, 24455558, 24455557, 24455556, 24455555, 24455554, 24455553, 24455552, 24455551, 24455550, 24455549, 24455548, 24455547, 24455546, 24455545, 24455544, 24455543, 24455542, 24455541, 24455540, 24455539, 24455538, 24455537, 24455536, 24455535, 24455534, 24455533, 24455532, 24455531, 24455530, 24455529, 24455528, 24455527, 24455526, 24455525, 24455524, 24455523, 24455522, 24455521, 24455520, 24455519, 24455518, 24455517, 24455516, 24455515, 24455514, 24455513, 24455512, 24455511, 24455510, 24455509, 24455508, 24455507, 24455506, 24455505, 24455504, 24455503, 24455502, 24455501, 24455500, 24455499, 24455498, 24455497, 24455496, 24455495, 24455494, 24455493, 24455492, 24455491, 24455490, 24455489, 24455488, 24455487, 24455486, 24455485, 24455484, 24455483, 24455482, 24455481, 24455480, 24455479, 24455478, 24455477, 24455476, 24455475, 24455474, 24455472, 24455471, 24455470, 24455469, 24455468, 24455467, 24455466, 24455465, 24455464, 24455463, 24455462, 24455461, 24455460, 24455459, 24455458, 24455457, 24455456, 24455455, 24455454, 24455453, 24455452, 24455451, 24455450, 24455449, 24455448, 24455447, 24455446, 24455445, 24455444, 24455443, 24455442, 24455441, 24455440, 24455439, 24455438, 24455437, 24455436, 24455435, 24455434, 24455433, 24455432, 24455431, 24455430, 24455429, 24455428, 24455427, 24455426, 24455425, 24455424, 24455423, 24455422, 24455421, 24455420, 24455419, 24455418, 24455417, 24455416, 24455415, 24455414, 24455413, 24455412, 24455411, 24455410, 24455409, 24455408, 24455407, 24455406, 24455405, 24455404, 24455403, 24455402, 24455401, 24455400, 24455399, 24455398, 24455397, 24455396, 24455395, 24455394, 24455393, 24455392, 24455391, 24455390, 24455389, 24455388, 24455387, 24455386, 24455385, 24455384, 24455383, 24455382, 24455381, 24455380, 24455379, 24455378, 24455377, 24455376, 24455375, 24455374, 24455373, 24455371, 24455370, 24455369, 24455368, 24455367, 24455366, 24455365, 24455364, 24455363, 24455362, 24455361, 24455360, 24455359, 24455358, 24455357, 24455356, 24455355, 24455354, 24455353, 24455352, 24455351, 24455350, 24455349, 24455348, 24455347, 24455346, 24455345, 24455344, 24455343, 24455342, 24455341, 24455340, 24455339, 24455338, 24455337, 24455336, 24455335, 24455334, 24455333, 24455332, 24455331, 24455330, 24455329, 24455328, 24455327, 24455326, 24455325, 24455324, 24455323, 24455322, 24455321, 24455320, 24455319, 24455318, 24455317, 24455316, 24455315, 24455314, 24455313, 24455312, 24455311, 24455310, 24455309, 24455308, 24455307, 24455306, 24455305, 24455304, 24455303, 24455302, 24455301, 24455300, 24455299, 24455298, 24455297, 24455296, 24455295, 24455294, 24455293, 24455292, 24455291, 24455290, 24455289, 24455288, 24455287, 24455286, 24455285, 24455284, 24455283, 24455282, 24455281, 24455280, 24455279, 24455278, 24455277, 24455276, 24455275, 24455274, 24455273, 24455272, 24455270, 24455269, 24455268, 24455267, 24455266, 24455265, 24455264, 24455263, 24455262, 24455261, 24455260, 24455259, 24455258, 24455257, 24455256, 24455255, 24455254, 24455253, 24455252, 24455251, 24455250, 24455249, 24455248, 24455247, 24455246, 24455245, 24455244, 24455243, 24455242, 24455241, 24455240, 24455239, 24455238, 24455237, 24455236, 24455235, 24455234, 24455233, 24455232, 24455231, 24455230, 24455229, 24455228, 24455227, 24455226, 24455225, 24455224, 24455223, 24455222, 24455221, 24455220, 24455219, 24455218, 24455217, 24455216, 24455215, 24455214, 24455213, 24455212, 24455211, 24455210, 24455209, 24455208, 24455207, 24455206, 24455205, 24455204, 24455203, 24455202, 24455201, 24455200, 24455199, 24455198, 24455197, 24455196, 24455195, 24455194, 24455193, 24455192, 24455191, 24455190, 24455189, 24455188, 24455187, 24455186, 24455185, 24455184, 24455183, 24455182, 24455181, 24455180, 24455179, 24455178, 24455177, 24455176, 24455175, 24455174, 24455173, 24455172, 24455171, 24455169, 24455168, 24455167, 24455166, 24455165, 24455164, 24455163, 24455162, 24455161, 24455160, 24455159, 24455158, 24455157, 24455156, 24455155, 24455154, 24455153, 24455152, 24455151, 24455150, 24455149, 24455148, 24455147, 24455146, 24455145, 24455144, 24455143, 24455142, 24455141, 24455140, 24455139, 24455138, 24455137, 24455136, 24455135, 24455134, 24455133, 24455132, 24455131, 24455130, 24455129, 24455128, 24455127, 24455126, 24455125, 24455124, 24455123, 24455122, 24455121, 24455120, 24455119, 24455118, 24455117, 24455116, 24455115, 24455114, 24455113, 24455112, 24455111, 24455110, 24455109, 24455108, 24455107, 24455106, 24455105, 24455104, 24455103, 24455102, 24455101, 24455100, 24455099, 24455098, 24455097, 24455096, 24455095, 24455094, 24455093, 24455092, 24455091, 24455090, 24455089, 24455088, 24455087, 24455086, 24455085, 24455084, 24455083, 24455082, 24455081, 24455080, 24455079, 24455078, 24455077, 24455076, 24455075, 24455074, 24455073, 24455072, 24455071, 24455070, 24455068, 24455067, 24455066, 24455065, 24455064, 24455063, 24455062, 24455061, 24455060, 24455059, 24455058, 24455057, 24455056, 24455055, 24455054, 24455053, 24455052, 24455051, 24455050, 24455049, 24455048, 24455047, 24455046, 24455045, 24455044, 24455043, 24455042, 24455041, 24455040, 24455039, 24455038, 24455037, 24455036, 24455035, 24455034, 24455033, 24455032, 24455031, 24455030, 24455029, 24455028, 24455027, 24455026, 24455025, 24455024, 24455023, 24455022, 24455021, 24455020, 24455019, 24455018, 24455017, 24455016, 24455015, 24455014, 24455013, 24455012, 24455011, 24455010, 24455009, 24455008, 24455007, 24455006, 24455005, 24455004, 24455003, 24455002, 24455001, 24455000, 24454999, 24454998, 24454997, 24454996, 24454995, 24454994, 24454993, 24454992, 24454991, 24454990, 24454989, 24454988, 24454987, 24454986, 24454985, 24454984, 24454983, 24454982, 24454981, 24454980, 24454979, 24454978, 24454977, 24454976, 24454975, 24454974, 24454973, 24454972, 24454971, 24454970, 24454969, 24454968, 24454966, 24454965, 24454964, 24454944, 24454943, 24454942, 24454941, 24454940, 24454939, 24454938, 24454937, 24454936, 24454935, 24454934, 24454933, 24454932, 24454931, 24454930, 24454929, 24454928, 24454927, 24454926, 24454925, 24454924, 24454923, 24454922, 24454921, 24454920, 24454919, 24454918, 24454917, 24454916, 24454915, 24454914, 24454913, 24454912, 24454911, 24454910, 24454909, 24454908, 24454907, 24454906, 24454905, 24454904, 24454903, 24454902, 24454901, 24454900, 24454899, 24454898, 24454897, 24454896, 24454895, 24454894, 24454893, 24454892, 24454891, 24454890, 24454889, 24454888, 24454887, 24454886, 24454885, 24454884, 24454883, 24454882, 24454881, 24454880, 24454879, 24454878, 24454877, 24454876, 24454875, 24454874, 24454873, 24454872, 24454871, 24454870, 24454869, 24454868, 24454867, 24454866, 24454865, 24454864, 24454863, 24454862, 24454861, 24454860, 24454859, 24454858, 24454857, 24454856, 24454855, 24454854, 24454853, 24454852, 24454851, 24454850, 24454849, 24454848, 24454847, 24454846, 24454845, 24454840, 24454839, 24454838, 24454837, 24454836, 24454835, 24454834, 24454833, 24454832, 24454831, 24454830, 24454829, 24454828, 24454827, 24454826, 24454825, 24454824, 24454823, 24454822, 24454821, 24454820, 24454819, 24454818, 24454817, 24454816, 24454815, 24454814, 24454813, 24454812, 24454811, 24454810, 24454809, 24454808, 24454807, 24454806, 24454805, 24454804, 24454803, 24454802, 24454801, 24454800, 24454799, 24454798, 24454797, 24454796, 24454795, 24454794, 24454793, 24454792, 24454791, 24454790, 24454789, 24454788, 24454787, 24454786, 24454785, 24454784, 24454783, 24454782, 24454781, 24454780, 24454779, 24454778, 24454777, 24454776, 24454775, 24454774, 24454773, 24454772, 24454771, 24454770, 24454769, 24454768, 24454767, 24454766, 24454765, 24454764, 24454763, 24454762, 24454761, 24454760, 24454759, 24454758, 24454757, 24454756, 24454755, 24454754, 24454753, 24454752, 24454751, 24454750, 24454749, 24454748, 24454747, 24454746, 24454745, 24454744, 24454743, 24454742, 24454741, 24454739, 24454738, 24454737, 24454736, 24454735, 24454734, 24454733, 24454732, 24454731, 24454730, 24454729, 24454728, 24454727, 24454726, 24454725, 24454724, 24454723, 24454722, 24454721, 24454720, 24454719, 24454718, 24454717, 24454716, 24454715, 24454714, 24454713, 24454712, 24454711, 24454710, 24454709, 24454708, 24454707, 24454706, 24454705, 24454704, 24454703, 24454702, 24454701, 24454700, 24454699, 24454698, 24454697, 24454696, 24454695, 24454694, 24454693, 24454692, 24454691, 24454690, 24454689, 24454688, 24454687, 24454686, 24454685, 24454684, 24454683, 24454682, 24454681, 24454680, 24454679, 24454678, 24454677, 24454676, 24454675, 24454674, 24454673, 24454672, 24454671, 24454670, 24454669, 24454668, 24454667, 24454666, 24454665, 24454664, 24454663, 24454662, 24454661, 24454660, 24454659, 24454658, 24454657, 24454656, 24454655, 24454654, 24454653, 24454652, 24454651, 24454650, 24454649, 24454648, 24454647, 24454646, 24454645, 24454644, 24454643, 24454642, 24454641, 24454640, 24454638, 24454637, 24454636, 24454635, 24454634, 24454633, 24454632, 24454631, 24454630, 24454629, 24454628, 24454627, 24454626, 24454625, 24454624, 24454623, 24454622, 24454621, 24454620, 24454619, 24454618, 24454617, 24454616, 24454615, 24454614, 24454613, 24454612, 24454611, 24454610, 24454609, 24454608, 24454607, 24454606, 24454605, 24454604, 24454603, 24454602, 24454601, 24454600, 24454599, 24454598, 24454597, 24454596, 24454595, 24454594, 24454593, 24454592, 24454591, 24454590, 24454589, 24454588, 24454587, 24454586, 24454585, 24454584, 24454583, 24454582, 24454581, 24454580, 24454579, 24454578, 24454577, 24454576, 24454575, 24454574, 24454573, 24454572, 24454571, 24454570, 24454569, 24454568, 24454567, 24454566, 24454565, 24454564, 24454563, 24454562, 24454561, 24454560, 24454559, 24454558, 24454557, 24454556, 24454555, 24454554, 24454553, 24454552, 24454551, 24454550, 24454549, 24454548, 24454547, 24454546, 24454545, 24454544, 24454543, 24454542, 24454541, 24454540, 24454539, 24454537, 24454536, 24454535, 24454534, 24454533, 24454532, 24454531, 24454530, 24454529, 24454528]
                        },
                        "sigdata": "iVBORw0KGgoAAAANSUhEUgAAAIwAAAA3CAYAAADezaKIAAAOqElEQVR4AeybB5BVRRaGzw9rwggmFhNJKQsQJSiOKygGQEQtBUEwFBSuAUFQMZSAmDAjuiCYRVFRDBQquLqrICoiIohiAJVBBTEnMBWs21837753X9hhYHbAN/fVO+92nz7dffrcv0+f7p6pZsknsUA5LJAAphzGSkTNCgJmt91269W8efMJ7du3n969e/dFPXr0WJxQ8dmAd9u5c+cZJSUl4xs0aNDfTYq/OCr4zQeYXVu0aPHvG264YdQDDzzQbcSIEW2GDBnS8NJLL62bUPHZgHd77bXX/u3OO+/sOXLkyBEOONNr1arVuBBisgGz6+GHH/6vsWPHtmvatGmNQpUSfnFaoH79+tXduy857rjjJteoUaNFvlHGAOM8y7jrrruu0VZbbWXVqlVLqAraYJNNNrFBgwbVb9Wq1RgHmJzlKQIMMctFF13UessttzRJCVVxG7ilqnnjxo2HOtDEvhFgdt555/bNmjWrIW2cYJESvaTKs4FzINXr1KnTMoYWl4kAs+OOO/5VqjyFpKQvaeO2gXMitR1GYt8IMDVr1qwjbdwDkBL9pEq1Qc0YWlwmAsxf3CcJdJNAPxMDkhxE4t8IMHF2kksskN8CMcBkoqtQumfPngYtXry44Lb7iSee8DLvv/9+QZlC7ZfF/+OPP4z2Tz/9dDvyyCOtXbt21rt3b7vttttsxYoVOf1dffXVXpey2t0Q5V9++WWOvhtCj0J95oNMBBgqSSpzO/3aa68Z5PbqBWWXLl3qZX766aeCMlLZfUlxmZ9//tm6du3KOYG98MIL9uOPP5pbSW369Ol200032cEHH2xvv/12rM93333X6yLF25I2bP6SSy6xgQMHxnSVNqxOUrx/MJENmggwFEjxClJuHjlo7ty5dv/99+cdMOWQlFtfWneeu6Yw+j3ttNM8SN544w0PnFdeecXcGZIH0Nlnn22rV6+O9LrsssvskUceifLSuvcvrUXdtZSZMGECJtro9JLSY/QKZv1EgJHSglLhNPW32WYbg9ypsOFNpFx55CApt0xaN97LL79sHCwOHjzY6tWrFxnbnRlY37597ZhjjrHPPvss5mXc4ZMdeOCBkay0bn1LFVuvom0jVax+UmgPPTMpAgxMXFBZhNy2225r7iTQVq5c6Wd2dh1JiOWsz8QYgKxjx4625557Gk/yv/zyS45sdpvk8Rz0+fHHH+eV79Onjw0bNsx22GGHqPyKK66wbt26RXnagR588EHP33vvvc3dndikSZPsscce87xvvvnGy6fyyI8ZM8aOPvpoQ57n1KlTvQxlKfr+++8tJdekSRM/RmIslsuUzHvvvef7wEALFizwafqhvJCu6MMYaBs5CNl+/foZtujSpYsdcMABhjelDEIXd1nsbYwu1L/nnntydEa2EKFjNlXLZqxt/qSTTvIzd8aMGfboo4+WWe3TTz+1ww47zG6//XZr2LCh9wh169a10aNHm7vwtG+//bbMNvAUCBE/Pfvssx6w5FPUvHlzAzS0a2s+vJSZM2euyYUH9YkhACDy6HPeeefZzTffbMj++uuvXhBvRZ7JgZ7u5NPog7jojDPOiI0bIGMTd8vvveApp5xiPXr08Drecsstfpw0utlmmxkeMTONtyafT1f46IMeH330EVlPyL766quG3qTp/4cffvBl8+fPt/bt29vDDz9seFj0KC0t9ZOJCeWF1vEnAoyktUKfrfmASncd7o2DEl988UVUX5KXkhTxhg4dap9//rndcccdfhZecMEF5q7U7cYbbzTAdPnll0eytJ2PaOOII44wDMKL3meffezEE0/0OyRmbr46UtAlVUbAjiFph5lN7MM40As9zH1SslKo+8wzz9jTTz9tzFDioaeeespJmY0bNy7SmbZ4cbycxx9/3Jjd7NBefPFFb6Px48d72b322svojwbwsqSPOuooXyaF/lL9Zz6Rl+Tl4Euyr776yn777TebN2+esSPFW1N21VVXeVvjRWkfu82aNcsGDBhgd911lxE/IVcWSUEfy/hEgIEnqcy1HjlIku2+++5+SWK3goGkUJ9ySAp5Zurzzz9v+++/v3eRUuBL8lteZgFGLmtXxS06gfZDDz3k69WqVcuYZcOHDzcA0LlzZ/vggw9iY0APSAp98uLIA1BuZqXAZ3lEP8qkwCMNAU5erhT4++67r/cSeEUp8EpKSoyXAwClwJNkLN/ujs7YQktpPu1C0v/mSaEcWUiK50844QTDLpL8k8mETeizTZs2kS0Y6/nnn+/By4oghXakwk/6y6YIMFLhilK6LNWAFHicgbRo0cJYIpiJUuAjJ4U0noV8y5YtowFIoUySHXTQQRRbqXObUpov5U+n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",
                        "mediumFileData": []
                    },
                )
            }

            if (S.parallelJobNumber === 11) {
                let user11 = Object.assign({}, orgAdmin)
                user11.email = 'qa+21926264579@trackerproducts.com'
                user11.password = 'Test12345.'
                api.auth.get_tokens_without_page_load(user11)
                generic_request.POST('/api/transfers/V2',
                    {
                        "transaction": {
                            "transferredFromId": 5085057,
                            "transferredToId": 5077358,
                            "notes": "gfd",
                            "date": "2026-03-06T12:40:22.747Z",
                            "itemIds": [24432520, 24432519, 24432518, 24432517, 24432516, 24432515, 24432514, 24432513, 24432512, 24432511, 24432510, 24432509, 24432508, 24432507, 24432506, 24432505, 24432504, 24432503, 24432502, 24432501, 24432500, 24432499, 24432498, 24432497, 24432496, 24432495, 24432494, 24432493, 24432492, 24432491, 24432490, 24432489, 24432488, 24432487, 24432486, 24432485, 24432484, 24432483, 24432482, 24432481, 24432480, 24432479, 24432478, 24432477, 24432476, 24432475, 24432474, 24432473, 24432472, 24432471, 24432470, 24432469, 24432468, 24432467, 24432466, 24432465, 24432464, 24432463, 24432462, 24432461, 24432460, 24432459, 24432458, 24432457, 24432456, 24432455, 24432454, 24432453, 24432452, 24432451, 24432450, 24432449, 24432448, 24432447, 24432446, 24432445, 24432444, 24432443, 24432442, 24432441, 24432440, 24432439, 24432438, 24432437, 24432436, 24432435, 24432434, 24432433, 24432432, 24432431, 24432430, 24432429, 24432428, 24432427, 24432426, 24432425, 24432424, 24432423, 24432422, 24432421, 24432420, 24432419, 24432418, 24432417, 24432416, 24432415, 24432414, 24432413, 24432412, 24432411, 24432410, 24432409, 24432407, 24432406, 24432405, 24432404, 24432403, 24432402, 24432401, 24432400, 24432399, 24432398, 24432397, 24432396, 24432395, 24432394, 24432393, 24432392, 24432391, 24432390, 24432389, 24432388, 24432387, 24432386, 24432385, 24432384, 24432383, 24432382, 24432381, 24432380, 24432379, 24432378, 24432377, 24432376, 24432375, 24432374, 24432373, 24432372, 24432371, 24432370, 24432369, 24432368, 24432367, 24432366, 24432365, 24432364, 24432363, 24432362, 24432361, 24432360, 24432359, 24432358, 24432357, 24432356, 24432355, 24432354, 24432353, 24432352, 24432351, 24432350, 24432349, 24432348, 24432347, 24432346, 24432345, 24432344, 24432343, 24432342, 24432341, 24432340, 24432339, 24432338, 24432337, 24432336, 24432335, 24432334, 24432333, 24432332, 24432331, 24432330, 24432329, 24432328, 24432327, 24432326, 24432325, 24432324, 24432323, 24432322, 24432321, 24432320, 24432319, 24432318, 24432317, 24432316, 24432315, 24432314, 24432313, 24432312, 24432311, 24432310, 24432309, 24432308, 24432307, 24432306, 24432305, 24432304, 24432303, 24432302, 24432301, 24432300, 24432299, 24432298, 24432297, 24432296, 24432295, 24432294, 24432293, 24432292, 24432291, 24432290, 24432289, 24432288, 24432287, 24432286, 24432285, 24432284, 24432283, 24432282, 24432281, 24432280, 24432279, 24432278, 24432277, 24432276, 24432275, 24432274, 24432273, 24432272, 24432271, 24432270, 24432269, 24432268, 24432267, 24432266, 24432265, 24432264, 24432263, 24432262, 24432261, 24432260, 24432259, 24432258, 24432257, 24432256, 24432255, 24432254, 24432253, 24432252, 24432251, 24432250, 24432249, 24432248, 24432247, 24432246, 24432245, 24432244, 24432243, 24432242, 24432241, 24432240, 24432239, 24432238, 24432237, 24432236, 24432235, 24432234, 24432233, 24432232, 24432231, 24432230, 24432229, 24432228, 24432227, 24432226, 24432225, 24432224, 24432223, 24432222, 24432221, 24432220, 24432219, 24432218, 24432217, 24432216, 24432215, 24432214, 24432213, 24432212, 24432211, 24432210, 24432209, 24432208, 24432207, 24432206, 24432205, 24432204, 24432203, 24432202, 24432201, 24432200, 24432199, 24432198, 24432197, 24432196, 24432195, 24432194, 24432193, 24432192, 24432191, 24432190, 24432189, 24432188, 24432187, 24432186, 24432185, 24432184, 24432183, 24432182, 24432181, 24432180, 24432179, 24432178, 24432177, 24432176, 24432175, 24432174, 24432173, 24432172, 24432171, 24432170, 24432169, 24432168, 24432167, 24432166, 24432165, 24432164, 24432163, 24432162, 24432161, 24432160, 24432159, 24432158, 24432157, 24432156, 24432155, 24432154, 24432153, 24432152, 24432151, 24432150, 24432149, 24432148, 24432147, 24432146, 24432145, 24432144, 24432143, 24432142, 24432141, 24432140, 24432139, 24432138, 24432137, 24432136, 24432135, 24432134, 24432133, 24432132, 24432131, 24432130, 24432129, 24432128, 24432127, 24432126, 24432125, 24432124, 24432123, 24432122, 24432121, 24432120, 24432119, 24432118, 24432117, 24432116, 24432115, 24432114, 24432113, 24432112, 24432111, 24432110, 24432109, 24432108, 24432107, 24432106, 24432105, 24432104, 24432103, 24432102, 24432101, 24432100, 24432099, 24432098, 24432097, 24432096, 24432095, 24432094, 24432093, 24432092, 24432091, 24432090, 24432089, 24432088, 24432087, 24432086, 24432085, 24432084, 24432083, 24432082, 24432081, 24432080, 24432079, 24432078, 24432077, 24432076, 24432075, 24432074, 24432073, 24432072, 24432071, 24432070, 24432069, 24432068, 24432067, 24432066, 24432065, 24432064, 24432063, 24432062, 24432061, 24432060, 24432059, 24432058, 24432057, 24432056, 24432055, 24432054, 24432053, 24432052, 24432051, 24432050, 24432049, 24432048, 24432047, 24432046, 24432045, 24432044, 24432043, 24432042, 24432041, 24432040, 24432039, 24432038, 24432037, 24432036, 24432035, 24432034, 24432033, 24432032, 24432031, 24432030, 24432029, 24432028, 24432027, 24432026, 24432025, 24432024, 24432023, 24432022, 24432021, 24432020, 24432019, 24432018, 24432017, 24432016, 24432015, 24432014, 24432013, 24432012, 24432011, 24432010, 24432009, 24432008, 24432007, 24432006, 24432005, 24432004, 24432003, 24432002, 24432001, 24432000, 24431999, 24431998, 24431997, 24431996, 24431995, 24431994, 24431993, 24431992, 24431991, 24431990, 24431989, 24431988, 24431987, 24431986, 24431985, 24431984, 24431983, 24431982, 24431981, 24431980, 24431979, 24431978, 24431977, 24431976, 24431975, 24431974, 24431973, 24431972, 24431971, 24431970, 24431969, 24431968, 24431967, 24431966, 24431965, 24431964, 24431963, 24431962, 24431961, 24431960, 24431959, 24431958, 24431957, 24431956, 24431955, 24431954, 24431953, 24431952, 24431951, 24431950, 24431949, 24431948, 24431947, 24431946, 24431945, 24431944, 24431943, 24431942, 24431941, 24431940, 24431939, 24431938, 24431937, 24431936, 24431935, 24431934, 24431933, 24431932, 24431931, 24431930, 24431929, 24431928, 24431927, 24431926, 24431925, 24431924, 24431923, 24431922, 24431921, 24431920, 24431919, 24431918, 24431917, 24431916, 24431915, 24431914, 24431913, 24431912, 24431911, 24431910, 24431909, 24431908, 24431906, 24431905, 24431904, 24431903, 24431902, 24431901, 24431900, 24431899, 24431898, 24431897, 24431896, 24431895, 24431894, 24431893, 24431892, 24431891, 24431890, 24431889, 24431888, 24431887, 24431886, 24431885, 24431884, 24431883, 24431882, 24431881, 24431880, 24431879, 24431878, 24431877, 24431876, 24431875, 24431874, 24431873, 24431872, 24431871, 24431870, 24431869, 24431868, 24431867, 24431866, 24431865, 24431864, 24431863, 24431862, 24431861, 24431860, 24431859, 24431858, 24431857, 24431856, 24431855, 24431854, 24431853, 24431852, 24431851, 24431850, 24431849, 24431848, 24431847, 24431846, 24431845, 24431844, 24431843, 24431842, 24431841, 24431840, 24431839, 24431838, 24431837, 24431836, 24431835, 24431834, 24431833, 24431832, 24431831, 24431830, 24431829, 24431828, 24431827, 24431826, 24431825, 24431824, 24431823, 24431822, 24431821, 24431820, 24431819, 24431818, 24431817, 24431816, 24431815, 24431814, 24431813, 24431812, 24431811, 24431810, 24431809, 24431808, 24431807, 24431806, 24431805, 24431804, 24431803, 24431802, 24431801, 24431800, 24431799, 24431798, 24431797, 24431796, 24431795, 24431794, 24431793, 24431792, 24431791, 24431790, 24431789, 24431788, 24431787, 24431786, 24431785, 24431784, 24431783, 24431782, 24431781, 24431780, 24431779, 24431778, 24431777, 24431776, 24431775, 24431774, 24431773, 24431772, 24431771, 24431770, 24431769, 24431768, 24431767, 24431766, 24431765, 24431764, 24431763, 24431762, 24431761, 24431760, 24431759, 24431758, 24431757, 24431756, 24431755, 24431754, 24431753, 24431752, 24431751, 24431750, 24431749, 24431748, 24431747, 24431746, 24431745, 24431744, 24431743, 24431742, 24431741, 24431740, 24431739, 24431738, 24431737, 24431736, 24431735, 24431734, 24431733, 24431732, 24431731, 24431730, 24431729, 24431728, 24431727, 24431726, 24431725, 24431724, 24431723, 24431722, 24431721, 24431720, 24431719, 24431718, 24431717, 24431716, 24431715, 24431714, 24431713, 24431712, 24431711, 24431710, 24431709, 24431708, 24431707, 24431706, 24431705, 24431704, 24431703, 24431702, 24431701, 24431700, 24431699, 24431698, 24431697, 24431696, 24431695, 24431694, 24431693, 24431692, 24431691, 24431690, 24431689, 24431688, 24431687, 24431686, 24431685, 24431684, 24431683, 24431682, 24431681, 24431680, 24431679, 24431678, 24431677, 24431676, 24431675, 24431674, 24431673, 24431672, 24431671, 24431670, 24431669, 24431668, 24431667, 24431666, 24431665, 24431664, 24431663, 24431662, 24431661, 24431660, 24431659, 24431658, 24431657, 24431656, 24431655, 24431654, 24431653, 24431652, 24431651, 24431650, 24431649, 24431648, 24431647, 24431646, 24431645, 24431644, 24431643, 24431642, 24431641, 24431640, 24431639, 24431638, 24431637, 24431636, 24431635, 24431634, 24431633, 24431632, 24431631, 24431630, 24431629, 24431628, 24431627, 24431626, 24431625, 24431624, 24431623, 24431622, 24431621, 24431620, 24431619, 24431618, 24431617, 24431616, 24431615, 24431614, 24431613, 24431612, 24431611, 24431610, 24431609, 24431608, 24431607, 24431606, 24431605, 24431604, 24431603, 24431602, 24431601, 24431600, 24431599, 24431598, 24431597, 24431596, 24431595, 24431594, 24431593, 24431592, 24431591, 24431590, 24431589, 24431588, 24431587, 24431586, 24431585, 24431584, 24431583, 24431582, 24431581, 24431580, 24431579, 24431578, 24431577, 24431576, 24431575, 24431574, 24431573, 24431572, 24431571, 24431570, 24431569, 24431568, 24431567, 24431566, 24431565, 24431564, 24431563, 24431562, 24431561, 24431560, 24431559, 24431558, 24431557, 24431556, 24431555, 24431554, 24431553, 24431552, 24431551, 24431550, 24431549, 24431548, 24431547, 24431546, 24431545, 24431544, 24431543, 24431542, 24431541, 24431540, 24431539, 24431538, 24431537, 24431536, 24431535, 24431534, 24431533, 24431532, 24431531, 24431530, 24431529, 24431528, 24431527, 24431526, 24431525, 24431524, 24431523, 24431522, 24431521, 24431520, 24431519]
                        },
                        "sigdata": "iVBORw0KGgoAAAANSUhEUgAAAIwAAAA3CAYAAADezaKIAAAOqElEQVR4AeybB5BVRRaGzw9rwggmFhNJKQsQJSiOKygGQEQtBUEwFBSuAUFQMZSAmDAjuiCYRVFRDBQquLqrICoiIohiAJVBBTEnMBWs21837753X9hhYHbAN/fVO+92nz7dffrcv0+f7p6pZsknsUA5LJAAphzGSkTNCgJmt91269W8efMJ7du3n969e/dFPXr0WJxQ8dmAd9u5c+cZJSUl4xs0aNDfTYq/OCr4zQeYXVu0aPHvG264YdQDDzzQbcSIEW2GDBnS8NJLL62bUPHZgHd77bXX/u3OO+/sOXLkyBEOONNr1arVuBBisgGz6+GHH/6vsWPHtmvatGmNQpUSfnFaoH79+tXduy857rjjJteoUaNFvlHGAOM8y7jrrruu0VZbbWXVqlVLqAraYJNNNrFBgwbVb9Wq1RgHmJzlKQIMMctFF13UessttzRJCVVxG7ilqnnjxo2HOtDEvhFgdt555/bNmjWrIW2cYJESvaTKs4FzINXr1KnTMoYWl4kAs+OOO/5VqjyFpKQvaeO2gXMitR1GYt8IMDVr1qwjbdwDkBL9pEq1Qc0YWlwmAsxf3CcJdJNAPxMDkhxE4t8IMHF2kksskN8CMcBkoqtQumfPngYtXry44Lb7iSee8DLvv/9+QZlC7ZfF/+OPP4z2Tz/9dDvyyCOtXbt21rt3b7vttttsxYoVOf1dffXVXpey2t0Q5V9++WWOvhtCj0J95oNMBBgqSSpzO/3aa68Z5PbqBWWXLl3qZX766aeCMlLZfUlxmZ9//tm6du3KOYG98MIL9uOPP5pbSW369Ol200032cEHH2xvv/12rM93333X6yLF25I2bP6SSy6xgQMHxnSVNqxOUrx/MJENmggwFEjxClJuHjlo7ty5dv/99+cdMOWQlFtfWneeu6Yw+j3ttNM8SN544w0PnFdeecXcGZIH0Nlnn22rV6+O9LrsssvskUceifLSuvcvrUXdtZSZMGECJtro9JLSY/QKZv1EgJHSglLhNPW32WYbg9ypsOFNpFx55CApt0xaN97LL79sHCwOHjzY6tWrFxnbnRlY37597ZhjjrHPPvss5mXc4ZMdeOCBkay0bn1LFVuvom0jVax+UmgPPTMpAgxMXFBZhNy2225r7iTQVq5c6Wd2dh1JiOWsz8QYgKxjx4625557Gk/yv/zyS45sdpvk8Rz0+fHHH+eV79Onjw0bNsx22GGHqPyKK66wbt26RXnagR588EHP33vvvc3dndikSZPsscce87xvvvnGy6fyyI8ZM8aOPvpoQ57n1KlTvQxlKfr+++8tJdekSRM/RmIslsuUzHvvvef7wEALFizwafqhvJCu6MMYaBs5CNl+/foZtujSpYsdcMABhjelDEIXd1nsbYwu1L/nnntydEa2EKFjNlXLZqxt/qSTTvIzd8aMGfboo4+WWe3TTz+1ww47zG6//XZr2LCh9wh169a10aNHm7vwtG+//bbMNvAUCBE/Pfvssx6w5FPUvHlzAzS0a2s+vJSZM2euyYUH9YkhACDy6HPeeefZzTffbMj++uuvXhBvRZ7JgZ7u5NPog7jojDPOiI0bIGMTd8vvveApp5xiPXr08Drecsstfpw0utlmmxkeMTONtyafT1f46IMeH330EVlPyL766quG3qTp/4cffvBl8+fPt/bt29vDDz9seFj0KC0t9ZOJCeWF1vEnAoyktUKfrfmASncd7o2DEl988UVUX5KXkhTxhg4dap9//rndcccdfhZecMEF5q7U7cYbbzTAdPnll0eytJ2PaOOII44wDMKL3meffezEE0/0OyRmbr46UtAlVUbAjiFph5lN7MM40As9zH1SslKo+8wzz9jTTz9tzFDioaeeespJmY0bNy7SmbZ4cbycxx9/3Jjd7NBefPFFb6Px48d72b322svojwbwsqSPOuooXyaF/lL9Zz6Rl+Tl4Euyr776yn777TebN2+esSPFW1N21VVXeVvjRWkfu82aNcsGDBhgd911lxE/IVcWSUEfy/hEgIEnqcy1HjlIku2+++5+SWK3goGkUJ9ySAp5Zurzzz9v+++/v3eRUuBL8lteZgFGLmtXxS06gfZDDz3k69WqVcuYZcOHDzcA0LlzZ/vggw9iY0APSAp98uLIA1BuZqXAZ3lEP8qkwCMNAU5erhT4++67r/cSeEUp8EpKSoyXAwClwJNkLN/ujs7YQktpPu1C0v/mSaEcWUiK50844QTDLpL8k8mETeizTZs2kS0Y6/nnn+/By4oghXakwk/6y6YIMFLhilK6LNWAFHicgbRo0cJYIpiJUuAjJ4U0noV8y5YtowFIoUySHXTQQRRbqXObUpov5U+n4gJ2TNOmTTNmEAaaM2eOB87rr78e9eMbdj9SaOvDDz80loX69etHMlIoIw5wojE++UywSEEWPiSFPLFN9+7d/Uujf7wnk6hDhw6GXngCKchKoqonSVF/nuF+pDRPCmnH9l8pnic+kQJPkrehF3Q/AwYM8F5lwJonXp2xZ08qKV1fiqddM7FvBBi4UlxYys0jB0mhDOSyRqPIhRdeaN999x3FniR5Y+BhYLBWS4EnpZ/wKeecRUrzpbLTvCh2SM8995xfBlatWmVjx471/UqiWU+SPI91fvvtt/dpKfCk8GQMCEshTxrabrvtcuThQ1KQleSX2AYNGtixxx7rQcwSRl877bQTorE2PMP9SOn6Luu/UponhTQFUkhLIuspG/ipZfWtt97yxwksoZmEV8QGkmL6SLl530HWz3oDRpKxLnMIhTIEiJKibiQZwSKM33//Pa+SAIVyDCsprwwerG3btt4IUn4Zlg7a4RRaSsvAk0KePpYtW5a3D2KCTFlJZD1JitXxTPcjBT4xEGOnfQJR4gTiCp7wnGhOfSnUldLPbDkplMGHpJCXRDbWpiQD3BT079/feza8Wz6SlFNXivNoJ5sqBDCS7NxzzzXcI8EfgR4dSUEBAEWe4EwKPCn9ZECUZ88WKS2D0XkBBJ9Smi+l0yngMaulwKddSAp5lhfyBKhS4EnhmdJDCnnkICnkpfQTPiQFHt6EU+dJkyYZOzB2hCk9WAYzZSWR9SQpenHEZDCJCaU0nwkAH5ICnzQkhbwUnpxPwecknBgzk5i4eGLsKAV5qfCTdrIpAkxZEXOqnAYkRdF6ir/pppvaqFGj/FE9J7DmPqmy2rVrW+vWrf2pLOt7is8TcBHBsw2kDXj5iBiladOmxoBZ+thiZsp9/fXX/kW5bg1PlCojD6XyZ555pteRw7/M8x92PO+88w6i/gUiL8nnSWeTpEiOMl5y9erVbeutt47ZBs/DEkBDLNfIQix/eGTSKWI5Qw6bpHg8iYfgS4ratjUfSREPWYJvQMNYmBTwUoQugJklKsUr62lZnwgw8KVgBKnwEzlIypVhm3vOOedQHJEU5FJxzvHHH29XXnmlPyO45pprrFevXn4nwZZQCrJS7nPzzTf3W0J2Hffee68H4H777Wennnqq8SSWmTx5sgcLQZ6UbgNlpJBHRwDHdQIgPuuss6xTp0528cUXR0unFGQlUdWTJA8QKTw90/1IIc+4CGzZVrMTY+vNwRoHbCmvxpInBXm87qJFi4x6Tz75pG+b7TUn2QSn1L3++uv9eQqAw8NKoa4Unq57X08KeUmGnaiHt2Nc2Pq+++7zdiJNO2wSpHQdKX+a9rOp3IDBxeHapPydYHheBHJbbLFFNCAMhHfhkI4ZA7A4uSTPNnCPPfaIZKX8bdMGwRw31bT/ySefGDszYhJeCqBkSSQQl0IbGAhZKeQl+ctL5Fq1auWvEVg6Jk6caIcccoi3jxRkASd1M8chhTJsAEkhzykr4Ofyk+UZ4myKg012S7Qzb968aIwACY8JcF966SXPR5+7777bH1dwdIDH3mWXXfwJNMs1ekqhv9S4MscqhTJsypJEe9ia7fQ0t5vEi3NCjSeTgqxU+OmNkfUTAUYqXFFKl7HPJwCV0jwpnQbhlCOHwlK6DFBwmMT9E1s7niwFGEVKy0mF0wR1nKbSPsffnLqyHM2ePdu4lMw2ILEFslJoky0+ZyIYlb45QUWnQw891JjxzEyuFiQZF5nUzR6HJGOMkBTa5SyEk2J0YWxLliwxzpYAOVcPtMOfhUhBnv5YepC/9dZbPWAkGdtwQEZ9CB1pm77wEFKonxpXIdvhSYmnsDH68GScawsWKfSThZf4fz5KQUj6/z+Ja6T176eQwaT8beORGjVqZCxrUlqGNR/QMet5QVK6TCpfuiLGxsTIBr9UPj2kIL+u+mSDhXzkYcoKfiqufMP+GSSnwSw1w4YN8x4E4HCEz4kp3oX4pljGWhHjACSZFAEmk1nMaTwSwfHJJ5/s4xcCZLbq3ECzA+NZzONf37FFgJEU255VBDo31ja4omAnQfzCLS9LEXEEVwMbq84bQi9Jlv2JAEOBpCj4kpK0VLVtACayKQLMf9xHqtoGkpLxS2kbZIOFfAQYdzi0XEoLS0laqto2cD5kJSDJpAgw7vBrqVS1DSQl45fSNnBXF0sywUI6Aszy5ctnukuy1VK6glSl01U6nnMrjrmT9IWAJJMiwCxcuPAfbos5y7mhKrNb2hA7jz9Ln4MGDXrTXQoPyQQL6QgwLrPKXe//3d1mLpYSzyJVXRu4a4dl7u5psMPECkexbyZg+Mv9BU64qzsNnV1aWposT1UMNCxDvXv3ftOdfPdx91hTY0hZk4kBBp6rNGfKlCklXbp0Ge4uzf7Zp0+f+e6qvTShfkVrg759+y7o1q3blI4dO450l51tC4EFfOQABqajVXPnzh3qjtA7OI/TbPTo0fUSKl4bjBkzpsnEiRM7uZhloHv3OcuQ40XfQoCJBJJEYoFMCySAybTGnzRdmWongKlMaxdBXwlgiuAlVuYQEsBUprWLoK8EMEXwEitzCAlgKtPaRdBXApgieImVOYQEMJVp7SLoa70AUwTjT4ZQTgskgCmnwaq6eAKYqo6Aco4/AUw5DVbVxf8LAAD//zTkojMAAAAGSURBVAMAX4q558LHiOYAAAAASUVORK5CYII=",
                        "mediumFileData": []
                    },
                )
            }
        }

    })

    it.only('Disposal transactions ', function () {
        api.auth.get_tokens_without_page_load(orgAdmin);
        for (let i = 0; i < 10; i++) {
            api.items.add_new_item(true, null, 'newItem' + i)
            cy.log('Adding new item __' + (i + 1))
        }

        for (let i = 0; i < 10; i++) {
            api.transactions.dispose_item('newItem' + i)
            cy.log('Item Disposed __' + (i + 1))
        }
    })
    for (let i = 0; i < 1000; i++) {
        it.only('Disposal transactions _____BATCH #' + i, function () {

            // ORG: "Biggest Disposal Count'
            if (Cypress.env('parallelJobNumber') === 1) {
                orgAdmin.email = 'qa+smj-api@trackerproducts.com'
                orgAdmin.id = 147742
                S.userAccounts.orgAdmin.id = 147742
            }

            if (Cypress.env('parallelJobNumber') === 2) {
                orgAdmin.email = 'qa+smj-api2@trackerproducts.com'
                orgAdmin.id = S.userAccounts.orgAdmin.id = 147743
            }

            if (Cypress.env('parallelJobNumber') === 3) {
                orgAdmin.email = 'qa+smj-api3@trackerproducts.com'
                orgAdmin.id = S.userAccounts.orgAdmin.id = 147744
            }

            if (Cypress.env('parallelJobNumber') === 4) {
                orgAdmin.email = 'qa+smj-api4@trackerproducts.com'
                orgAdmin.id = S.userAccounts.orgAdmin.id = 147745
            }

            if (Cypress.env('parallelJobNumber') === 5) {
                orgAdmin.email = 'qa+smj-api5@trackerproducts.com'
                orgAdmin.id = S.userAccounts.orgAdmin.id = 147746
            }

            if (Cypress.env('parallelJobNumber') === 6) {
                orgAdmin.email = 'qa+smj-api6@trackerproducts.com'
                orgAdmin.id = S.userAccounts.orgAdmin.id = 147747
            }

            if (Cypress.env('parallelJobNumber') === 7) {
                orgAdmin.email = 'qa+smj-api7@trackerproducts.com'
                orgAdmin.id = S.userAccounts.orgAdmin.id = 147748
            }

            if (Cypress.env('parallelJobNumber') === 8) {
                orgAdmin.email = 'qa+smj-api8@trackerproducts.com'
                orgAdmin.id = S.userAccounts.orgAdmin.id = 147749
            }

            if (Cypress.env('parallelJobNumber') === 9) {
                orgAdmin.email = 'qa+smj-api9@trackerproducts.com'
                orgAdmin.id = S.userAccounts.orgAdmin.id = 147750
            }

            if (Cypress.env('parallelJobNumber') === 10) {
                orgAdmin.email = 'qa+smj-api10@trackerproducts.com'
                orgAdmin.id = S.userAccounts.orgAdmin.id = 147751
            }

            orgAdmin.officeId = 932
            orgAdmin.organizationId = 517
            let loc = {id: 619297}

            api.auth.get_tokens_without_page_load(orgAdmin);
            D.getCaseDataWithReducedFields()
            D.getItemDataWithReducedFields()
            D.newCase.caseOfficerIds = [orgAdmin.id]
            api.cases.add_new_case()

            for (let i = 0; i < 10; i++) {
                api.items.add_new_item(true, loc, 'newItem' + i)
                cy.log('Adding new item __' + (i + 1))

                // api.transactions.dispose_item('newItem' + i)
                // cy.log('Item Disposed __' + (i + 1))
            }

            for (let i = 0; i < 10; i++) {
                api.transactions.dispose_item('newItem' + i)
                cy.log('Item Disposed __' + (i + 1))
            }
        })
    }


});


