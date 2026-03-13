const S = require('../../fixtures/settings.js');
const C = require('../../fixtures/constants.js');
const generic_requests = require('../generic-api-requests.js');
const ui = require('../../pages/ui-spec.js');
const orgSettingsApi = require('../endpoints/org-settings/collection');
const usersApi = require('../endpoints/users/collection')


function token_request(selectedUser) {

    // cy.clearLocalStorage();

    //cy.log('-------------------------------- Getting token via API - LOGIN with ' + selectedUser.title + ' --------------------------------');

    return cy.request({
        method: 'POST',
        url: S.api_url + '/token',
        form: true, //sets to application/x-www-form-urlencoded
        body: {
            grant_type: 'password',
            username: selectedUser.email,
            password: selectedUser.password
        },
        headers: {
            'kick-out-user': true
        },
        failOnStatusCode: false
    })
}

function get_token_status(selectedUser) {

    return token_request(selectedUser).then(response => {
        return response.status;
    })
}

exports.get_tokens = function (selectedUser, arrayOfPropertiesToRetain, specificOffice, userFromLocalStorage) {

    //   ui.app.define_API_request_to_be_awaited('POST', '', 'all_POST_Requests')
    ui.app.define_API_request_to_be_awaited('GET', '', 'all_GET_Requests')
    // ui.app.define_all_dashboard_GET_requests();
    // cy.log(`Logging in with  __________________________________________________________
    //             ${selectedUser.email} /  ${selectedUser.password}
    //              _________________________________________________________________________
    //              ` );

    console.log('TIME: ' + S.currentDateAndTime)
    cy.log('TIME: ' + S.currentDateAndTime)

    token_request(selectedUser)
        .then(response => {

            response = response.body;

            if (response.error) {
                cy.log(`ERROR on login ___
                ${response.error}
                ${response.error_description}`)

            } else {
                exports.keep_some_values_in_local_storage(arrayOfPropertiesToRetain, selectedUser, response, userFromLocalStorage)
           cy.wait(2000)
            }
        })
        .then(() => {
            cy.visit(S.base_url).then(() => {
                ui.app.wait_all_dashboard_GET_requests();
                // cy.get('.alert-dismissable').eq(0).invoke('remove');
                // cy.get('.alert-dismissable').eq(0).invoke('remove');
                cy.getLocalStorage("access-token").should("not.equal", null).then(() => {
                    cy.saveLocalStorage().then(() => {

                        if (selectedUser.title === S.userRoles.systemAdmin || specificOffice) {
                            let office = specificOffice || S.selectedEnvironment.office_1

                            if (selectedUser.title === S.userRoles.systemAdmin) {
                                ui.menu.select_office(office.orgAndOfficeName)
                            }

                            cy.getLocalStorage("headers").then(headers => {
                                let updatedHeaders = JSON.parse(headers);
                                updatedHeaders.organizationid = S.selectedEnvironment.orgSettings.id;
                                updatedHeaders.officeid = office.id

                                cy.clearLocalStorage("headers");
                                cy.setLocalStorage("headers", JSON.stringify(updatedHeaders));
                                cy.saveLocalStorage()
                            })
                        }
                    });
                });
            });
        });
    return this;
}

exports.get_tokens_without_page_load = function (selectedUser, arrayOfPropertiesToRetain) {

    ui.app.define_API_request_to_be_awaited('GET', '', 'all_GET_Requests')
   // ui.app.define_all_dashboard_GET_requests();
    // cy.log(`Logging in with  __________________________________________________________
    //             ${selectedUser.email} /  ${selectedUser.password}
    //              _________________________________________________________________________
    //              ` );

    token_request(selectedUser)
        .then(response => {

            response = response.body;

            if (response.error) {
                cy.log(`ERROR on login ___
                ${response.error}
                ${response.error_description}`)

            } else {
                exports.keep_some_values_in_local_storage(arrayOfPropertiesToRetain, selectedUser, response)
            }
        })
        .then(() => {
            //   ui.app.wait_all_dashboard_GET_requests();
            cy.getLocalStorage("access-token").should("not.equal", null).then(() => {
                cy.saveLocalStorage().then(() => {

                    if (selectedUser.title === S.userRoles.systemAdmin) {
                        ui.menu.select_office(S.selectedEnvironment.office_1.name)

                        cy.getLocalStorage("headers").then(headers => {
                            let updatedHeaders = JSON.parse(headers);
                            updatedHeaders.organizationid = S.selectedEnvironment.orgSettings.id;
                            updatedHeaders.officeid = S.selectedEnvironment.office_1.id;

                            cy.clearLocalStorage("headers");
                            cy.setLocalStorage("headers", JSON.stringify(updatedHeaders));
                            cy.saveLocalStorage()
                        })
                    }
                });
            });
        });
    return this;
}

exports.keep_some_values_in_local_storage = function (arrayOfPropertiesToRetain, selectedUser, response, userFromLocalStorage) {
    //cy.log('******************************** Setting local storage ********************************');
    if (selectedUser && response) {

        let tokens = JSON.stringify(response);

        let propertiesToSave = [
            'newCase',
            'newItem',
            'newPerson',
            'locations',
            'newUser',
            'orgSettings',
            'currentCase',
            'currentUserSettings',
            'profile',
            'access-token',
            'refresh-token',
            'userId',
        ]

        if (arrayOfPropertiesToRetain) {
            arrayOfPropertiesToRetain.forEach(property => {
                cy.setLocalStorage(property, JSON.stringify(S.selectedEnvironment[property]));
            })
        }

        propertiesToSave.forEach(property => {
            cy.setLocalStorage(property, JSON.stringify(S.selectedEnvironment[property]));
        })

        cy.getLocalStorage("user1").then(newUser => {

            if (userFromLocalStorage) selectedUser = JSON.parse(newUser);

            selectedUser.isSystemAdmin = selectedUser.title === S.userRoles.systemAdmin;
            selectedUser.isOrgAdmin = selectedUser.title === S.userRoles.orgAdmin || selectedUser.title === S.userRoles.systemAdmin

            let headers = {
                'Content-Type': 'application/json',
                officeid: selectedUser.officeId,
                organizationid:  selectedUser.organizationId,
                authorization: 'Bearer ' + response.access_token,
                refreshtoken: response.refresh_token,
            };

            cy.setLocalStorage("headers", JSON.stringify(headers));
            cy.setLocalStorage("identity_data", tokens);
            cy.setLocalStorage("currentOfficeId", selectedUser.officeId);
            cy.setLocalStorage("currentOrganizationId", selectedUser.organizationId);
            cy.setLocalStorage("access-token", response.access_token);
            cy.setLocalStorage("refresh-token", response.refresh_token);
            cy.setLocalStorage("userId", selectedUser.id);
            cy.setLocalStorage("userName", selectedUser.email);
            cy.setLocalStorage("loginTime", 'Wed, 11 Mar 2026 10:11:33 GMT');
            cy.setLocalStorage("dateFormat", 'shortDate');
            cy.setLocalStorage("dateTimeFormat", 'short');
            cy.setLocalStorage("BrowserId", 'e2074844-1b5e-40ef-bcaa-e87327d1d2a1');
            cy.setLocalStorage("isAdmin", 'false');
            cy.setLocalStorage("isOrgAdmin", selectedUser.isOrgAdmin);
            cy.setLocalStorage("autoDispoSettings", '{"isAutoDispositionOn":true,"officeAutoDispositionReviewers":[{"officeId":11082,"officeName":"Cypress Office 1","generalTaskFromUserId":63328,"generalTaskFromUserGroupId":null,"isDefault":true,"isGeneralTaskFromUser":true},{"officeId":11091,"officeName":"Cypress Office 2","generalTaskFromUserId":63328,"generalTaskFromUserGroupId":null,"isDefault":false,"isGeneralTaskFromUser":true},{"officeId":11100,"officeName":"Office 3","generalTaskFromUserId":null,"generalTaskFromUserGroupId":null,"isDefault":false,"isGeneralTaskFromUser":false}],"settings":[{"id":7933,"active":true,"daysToFollowUp":100,"organizationId":558,"organization":null,"offenseTypeId":2,"offenseType":{"id":2,"name":"Arson","active":true,"organizationOffenseTypeFollowUpDays":null,"customDropdownCategoryId":1,"customDropdownCategory":null,"autoDispositionSettings":null}},{"id":7935,"active":true,"daysToFollowUp":33,"organizationId":558,"organization":null,"offenseTypeId":4,"offenseType":{"id":4,"name":"Burglary","active":true,"organizationOffenseTypeFollowUpDays":null,"customDropdownCategoryId":1,"customDropdownCategory":null,"autoDispositionSettings":null}},{"id":7961,"active":true,"daysToFollowUp":100,"organizationId":558,"organization":null,"offenseTypeId":28,"offenseType":{"id":28,"name":"Vandalism","active":true,"organizationOffenseTypeFollowUpDays":null,"customDropdownCategoryId":1,"customDropdownCategory":null,"autoDispositionSettings":null}},{"id":7952,"active":true,"daysToFollowUp":100,"organizationId":558,"organization":null,"offenseTypeId":158,"offenseType":{"id":158,"name":"Accident","active":true,"organizationOffenseTypeFollowUpDays":null,"customDropdownCategoryId":1,"customDropdownCategory":null,"autoDispositionSettings":null}}]}');


            if ((selectedUser.title === 'Org Admin' || selectedUser.title === 'System Admin')
                && !selectedUser.isExternalAdmin) {
                orgSettingsApi.get_current_org_settings(selectedUser.organizationId)
            }

            if (!selectedUser.isExternalAdmin) {

                usersApi.get_current_user_settings(selectedUser.id)

                cy.getLocalStorage("currentUserSettings").then(userSettings => {
                    cy.getLocalStorage("orgSettings").then(orgSettings => {

                        let signatureConfig = JSON.parse(orgSettings).signatureConfiguration
                        let dateTimeFormat = JSON.parse(userSettings).dateTimeFormat
                        let dateFormat = JSON.parse(userSettings).dateFormat
                        let idle = JSON.parse(orgSettings).idle || 45
                        let timeout = JSON.parse(orgSettings).timeout || 2

                        cy.setLocalStorage("profile", JSON.stringify(
                            {
                                "id": selectedUser.id,
                                "organizationId": selectedUser.organizationId,
                                "officeId": selectedUser.officeId,
                                "dateFormat": dateFormat,
                                "dateTimeFormat": dateTimeFormat,
                                "useDateFormatOnly": false,
                                "idle": idle,
                                "timeout": timeout,
                                "isAdmin": selectedUser.isSystemAdmin,
                                "showNewUserPopup": true,
                                "signatureConfig": signatureConfig,
                                "organizationType": 1
                            }))
                    })
                })

             //    cy.setLocalStorage("userOfficeSettings", JSON.stringify('[{"userId":0,"currentOfficeId":0,"currentOrganizationId":0,"currentOfficeName":""},{"userId":63324,"currentOfficeId":11081,"currentOrganizationId":557,"currentOfficeName":"Web Test Automation #1 - Cypress Office 1"},{"userId":40357,"currentOfficeId":1,"currentOrganizationId":1,"currentOfficeName":"Tracker Products - Office Ukr Testing"}]'));
             //    cy.setLocalStorage("saml-login-url", JSON.stringify('null'));
             //    cy.setLocalStorage("userId", JSON.stringify('63324'));
             //    cy.setLocalStorage("currentOrganizationId", JSON.stringify('557'));
             //    cy.setLocalStorage("currentOfficeId", JSON.stringify('11081'));
             //    cy.setLocalStorage("dateFormat", JSON.stringify('shortDate'));
             //    cy.setLocalStorage("signatureConfig.defaultSignatureDevice", JSON.stringify('2'));
             //    cy.setLocalStorage("userName", JSON.stringify('qa+org1admin@trackerproducts.com'));
             //    cy.setLocalStorage("BrowserId", JSON.stringify('98a5ccc2-8c6b-4352-a786-5a215de12710'));
             // //   cy.setLocalStorage("deviceId", JSON.stringify("f482591a-0d77-4531-b28d-f08d038e6484"));
             //    cy.setLocalStorage("maxStringFieldLength", JSON.stringify("10000"));
             //    cy.setLocalStorage("selected", JSON.stringify({
             //        "selectedOfficeId": selectedUser.officeId,
             //        "selectedOrganizationId": selectedUser.organizationId,
             //        "selectedOrganizationProductTypeId": 1
             //    }));
             //    cy.setLocalStorage("isMostRecentCaseCurrent", JSON.stringify(true));
             //    cy.setLocalStorage("uac", []);
             //    cy.setLocalStorage("loginTimeAndVersion", JSON.stringify({
             //        "loginTimeAsUtcString": new Date().toUTCString(),
             //        "systemVersionNumberStringAtLogin": "8.73.001"
             //    }));
             //    cy.setLocalStorage("isOrgAutoIncrementCaseNumberOn", false);
             //    cy.setLocalStorage("undefined_isSaasAccepted", true);
             //    cy.setLocalStorage("uac", []);
             //    cy.setLocalStorage("opfs", null);
             //    cy.setLocalStorage("isOrgAdmin", selectedUser.isOrgAdmin);
            }
        })
    }
};

exports.log_out = function (selectedUser) {
    cy.getLocalStorage("access-token").then(token => {
        cy.getLocalStorage("refresh-token").then(refresh_token => {

            let headers = {
                'Content-Type': 'application/json',
                Officeid: selectedUser.officeId,
                Organizationid: selectedUser.organizationId,
                Authorization: 'Bearer ' + JSON.parse(token),
                Refreshtoken: JSON.parse(refresh_token),
            };

            cy.setLocalStorage("headers", JSON.stringify(headers));

            generic_requests.POST('/api/users/logout');
        });
    });
};

exports.login_and_logout = function (selectedUser) {
    exports.get_tokens(selectedUser, true);
    exports.log_out(selectedUser);
};

exports.set_password = function (selectedUser) {

    token_request(selectedUser)
        .then(response => {

            if (response.status === 200) {
                cy.log('*********************************************    ' +
                    'Password is already based on the current date: ' + S.getCurrentDate(S.passwordPattern) +
                    S.orgNum + '     *********************************************');

            } else if (response.body.error && response.body.error_description.includes('You typed the password incorrectly')) {

                //cy.log('Updating the password with current date/time value')
                exports.update_password_by_trying_values_based_on_recent_dates(selectedUser, 1)
            } else {
                //cy.log(JSON.stringify(response))
            }

            let user = Object.assign({}, selectedUser);
            user.password = S.getCurrentDate(S.passwordPattern)
            get_token_status(user).should("be.equal", 200)
        })
}

//workaround for changing the password, as we have Captcha that prevents having the step to Reset Password with the link
exports.update_password_by_trying_values_based_on_recent_dates = function (selectedUser, daysBeforeTheCurrentDate) {

    if (daysBeforeTheCurrentDate < 5) {

        selectedUser.password = S.getDateBeforeXDaysInSpecificFormat(S.passwordPattern, daysBeforeTheCurrentDate)
        //cy.log('Trying with password: ' + selectedUser.password)

        token_request(selectedUser)
            .then(response => {

                response = response.body;
                if (response.error) {
                    exports.update_password_by_trying_values_based_on_recent_dates(selectedUser, daysBeforeTheCurrentDate + 1)
                } else {
                    exports.get_tokens(selectedUser)
                    usersApi.update_password(selectedUser.password, S.getCurrentDate(S.passwordPattern))
                    // ui.open_base_url()
                    // ui.menu.click_User_Settings()
                    // ui.userSettings
                    //     .click_button(C.buttons.changePassword)
                    //     .enter_current_and_new_password(selectedUser.password, S.getCurrentDate(S.passwordPattern))
                    //     .click_button(C.buttons.save)
                    //     .verify_toast_message('Saved')

                    selectedUser.password = S.getCurrentDate(S.passwordPattern)
                    cy.clearLocalStorage();
                }
            })
    }
}
