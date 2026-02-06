const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const DF = require('../../support/date-time-formatting');
const C = require('../../fixtures/constants');
const E = require('../../fixtures/files/excel-data');
const api = require('../../api-utils/api-spec');
const helper = require('../../support/e2e-helper');
const ui = require('../../pages/ui-spec');
import {enableSessionContinuation} from '../../support/continue-session';

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);

before(function () {
    api.auth.get_tokens(orgAdmin)
    api.users.update_current_user_settings(orgAdmin.id, C.currentDateTimeFormat, C.currentDateFormat)
    D.generateNewDataSet();
    api.auto_disposition.edit(true);
    api.cases.add_new_case();
});

describe('Auto-Disposition', function () {

    it('1 Verify enabling/disabling and validation for Follow Up Days', function () {
        api.auth.get_tokens(orgAdmin);
        api.auto_disposition.edit(false);

        ui.menu.click_Settings__Organization()
            .click_element_containing_link(C.labels.organization.tabs.autoDisposition)

        // Verify auto-dispo can be enabled and disabled in Org Settings
        ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types()
        ui.autoDispo.click_Edit()
            .turn_On_the_toggle()
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .click_Edit()
            .turn_Off_the_toggle()
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved);

        //Verify Save button is disabled when missing value in any "Follow Up Days" field
        api.auto_disposition.edit(true);
        ui.autoDispo.click_Edit()
        ui.autoDispo.turn_On_the_toggle()
            .clear_and_enter_value_for_Days_to_follow_up(C.offenseTypes.arson, '')
            .verify_save_auto_dispo_button_is_disabled()
    });

    it('2 Verify "Recalculate Cases to Dispose" and "Close X Cases" functionalities', function () {
        api.auth.get_tokens(orgAdmin);

        ui.menu.click_Settings__Organization()
            .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
        ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types()
            .click_Recalculate_Cases_to_Dispose()
            .pause(5)
            .get_number_of_cases_without_items()
            .verify_labels_for_cases_to_dispose(0)
            .click_Close_X_Cases_button()
            .pause(5)
            .enter_Closed_date(S.currentDate)
            .click_button(C.buttons.closeCases)
            .verify_toast_message(C.toastMsgs.saved)
            .click_Recalculate_Cases_to_Dispose()
            .pause(3)
            .verify_text_is_present_on_main_container('Cases amount: 0')
            .open_newly_created_case_via_direct_link()
            .click_button(C.buttons.edit)
            .verify_text_is_present_on_main_container('Closed')
            .verify_text_is_present_on_main_container(S.currentDate)
    });

    it('3 Verify "View X Cases" functionality', function () {
        api.auth.get_tokens(orgAdmin);
        api.org_settings.enable_all_Case_fields();
        api.auto_disposition.edit(true);

        let fileName = 'Case_allFields-AutoDispo7';
        D.getNewCaseData();
        D.newCase.offenseDate = helper.setDate(C.currentDateTimeFormat.dateOnly.editMode, 2019, 11, 15);
        D.newCase.reviewDate = helper.setDate(C.currentDateTimeFormat.dateOnly.editMode, 2019, 12, 15);

        E.generateDataFor_CASES_Importer([D.newCase]);
        ui.app.generate_excel_file(fileName, E.caseImportDataWithAllFields);

        // import case with Review Date in past and open tab again to fetch a new data
        ui.menu.click_Tools__Data_Import();
        ui.importer.open_direct_url_for_page()
            .import_data(fileName, C.importTypes.cases)
            .check_import_status_on_grid('1 records imported')

        ui.menu.click_Settings__Organization()
        ui.app.click_element_containing_link(C.labels.organization.tabs.orgSettings)
            .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
        ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types()
            .click_View_X_Cases_button()
            .verify_modal_content(C.labels.autoDisposition.viewCases)
            .verify_modal_content(D.newCase.caseNumber)
    });

    context('4. Verify "Re-Distribute Case Review Dates" functionality', function () {

        before(() => {
            cy.session('app-session', () => {
                api.auth.get_tokens_without_page_load(orgAdmin);
                api.users.update_current_user_settings(orgAdmin.id, C.currentDateTimeFormat, C.currentDateFormat)
                D.generateNewDataSet()
            })
        })
        enableSessionContinuation();

        let minDate = helper.setDate(C.currentDateTimeFormat.dateOnly.editMode, 2027, 11, 15);
        let maxDate = helper.setDate(C.currentDateTimeFormat.dateOnly.editMode, 2027, 11, 15);
        let redistributeNote = 'Redistributing Case Review dates from ' + minDate + ' to ' + maxDate;
        let case_pastDue, case_upcoming

        it('^^^^^ Preconditions  -- Data Import ^^^^^ ', function () {
            api.auth.get_tokens(orgAdmin);
            let daysToFollowUp = 33
            api.org_settings.update_dispo_config_for_offense_types(true, true, daysToFollowUp)

            //1. Verify "Re-Distribute" for "No Date" cases
            // import 1 case with Past Due and 1 case with Upcoming Review Date, for verifying that 'Redistribute' action is not applied there
            let fileName2 = 'AutoDispo_RedistributeReviewDates_1';
            D.getNewCaseData()
            D.getDataForMultipleCases(2)
            case_pastDue = Object.assign({}, D.newCase)
            case_upcoming = Object.assign({}, D.newCase)
            case_pastDue.reviewDate = helper.getSpecificDateInSpecificFormat(DF.dateTimeFormats.short.mask, '01/08/2019');
            case_upcoming.reviewDate = helper.getSpecificDateInSpecificFormat(DF.dateTimeFormats.short.mask, '01/08/2030');

            api.org_settings.enable_all_Case_fields();
            E.generateDataFor_CASES_Importer([case_pastDue, case_upcoming], null, false, 2);
            ui.app.generate_excel_file(fileName2, E.caseImportDataWithAllFields);
            ui.importer.reload_page()
                .import_data(fileName2, C.importTypes.cases)
            case_pastDue.caseNumber = D.case1.caseNumber
            case_upcoming.caseNumber = D.case2.caseNumber

            // import 1k cases with NO Review Date
            D.generateNewDataSet()
            let fileName = 'AutoDispo_RedistributeReviewDates_2';
            D.case1000 = {}
            D.case1 = {}
            D.getDataForMultipleCases(1000)
            E.generateDataFor_CASES_Importer([D.newCase], null, false, 1000);
            ui.app.generate_excel_file(fileName, E.caseImportDataWithAllFields);

            // disable Auto Dispo feature temporarily, to be able to import cases with NO review date
            api.auto_disposition.edit(false)
            ui.importer.import_data(fileName, C.importTypes.cases)
            api.auto_disposition.edit(true)

            D.case3.reviewDateNotes = D.case1000.reviewDateNotes = redistributeNote;
            D.case3.reviewDate = D.case1000.reviewDate = helper.getSpecificDateInSpecificFormat(
                DF.dateTimeFormats.short.mask,
                '11/15/2027 12:00 AM'
            );
        });

        it('2.1 Verify "Re-Distribute" for "No Review Date" cases', function () {
            ui.menu.open_base_url()
                .click_Settings__Organization()
                .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
            ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types()
                .click_button(C.buttons.redestributeCaseReviewDates)
                .verify_modal_content(C.labels.autoDisposition.updateCases)
                .populate_Update_Cases_modal(minDate, maxDate, redistributeNote)
                .click_button(C.buttons.updateCases)
                .verify_toast_message(C.toastMsgs.saved)
                .reload_page()
                .click_element_containing_link(C.labels.organization.tabs.autoDisposition)

            // verify change IS applied for Case with 'No Review Date'
            ui.app.quick_search_for_case(D.case3.caseNumber)
                .click_button(C.buttons.edit);
            ui.caseView.verify_values_on_Edit_form(D.case3);
            ui.app.quick_search_for_case(D.case1000.caseNumber)
                .click_button(C.buttons.edit);
            ui.caseView.verify_values_on_Edit_form(D.case1000);

            // verify change IS NOT applied for Case with 'Past Due Date'
            ui.app.quick_search_for_case(case_pastDue.caseNumber)
                .click_button(C.buttons.edit);
            ui.caseView.verify_values_on_Edit_form(case_pastDue);

            // verify change IS NOT applied for Case with 'Upcoming Review Date'
            ui.app.quick_search_for_case(case_upcoming.caseNumber)
                .click_button(C.buttons.edit);
            ui.caseView.verify_values_on_Edit_form(case_upcoming);

            // 2. Verify "Re-Distribute" for 'Past Due' cases
            // // import 3 cases (NO Review Date, Review Date past due and Upcoming Review Date )
            // E.generateDataFor_CASES_Importer([D.case1, D.case2, D.case3]);
            // ui.app.generate_excel_file(fileName, E.caseImportDataWithAllFields);
            // ui.menu.click_Tools__Data_Import()
            // ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.cases, null, 1, 1,
            //     ['Some Review Dates are blank. They will be auto-applied. Select Import to proceed.']
            // )
            //     .verify_toast_message([
            //         C.toastMsgs.importComplete,
            //         3 + C.toastMsgs.recordsImported])
            //
            // // redistribute dates and verify Review Date and notes again
            // D.case2.reviewDate = minDate;
            // D.case2.reviewDateNotes = redistributeNote;
            //
            // ui.menu.click_Settings__Organization()
            //     .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
            // ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types();
            // ui.autoDispo.verify_Redistribute_Case_Review_Date_labels(false, 1, 2)
            // ui.autoDispo.click_button(C.buttons.redestributeCaseReviewDates)
            //     .verify_modal_content(C.labels.autoDisposition.updateCases)
            //     .click_button(C.tabs.pastDue)
            //     .populate_Update_Cases_modal(minDate, maxDate, redistributeNote)
            //     .click_button(C.buttons.updateCases)
            //     .verify_toast_message(C.toastMsgs.saved)
            //     .verify_Redistribute_Case_Review_Date_labels(true, 0, 3)
            // D.case2.reviewDate = helper.getSpecificDateInSpecificFormat(
            //     DF.dateTimeFormats.short.mask,
            //     '11/15/2027 12:00 AM'
            // );
            //
            // // verify change IS applied for Case with 'Past Due Date'
            // ui.app.quick_search_for_case(D.case2.caseNumber)
            //     .click_button(C.buttons.edit);
            // ui.caseView.verify_values_on_Edit_form(D.case2);
            //
            // // verify change is not applied for Case with 'No Review Date'
            // D.case1.reviewDate = helper.getDateAfterXDaysFromSpecificDate(DF.dateTimeFormats.short.mask, S.currentDate, daysToFollowUp);
            // ui.app.quick_search_for_case(D.case1.caseNumber)
            //     .click_button(C.buttons.edit);
            // ui.caseView.verify_values_on_Edit_form(D.case1);
            //
            // // verify change is not applied for Case with 'Upcoming Review Date'
            // ui.app.quick_search_for_case(D.case3.caseNumber)
            //     .click_button(C.buttons.edit);
            // ui.caseView.verify_values_on_Edit_form(D.case3);

        });

        // enable test just during the full regression as it takes longer to redistribute review dates
        //for all cases with upcoming review date in Org

        xit('A.D.4.2 Verify "Re-Distribute" for "Upcoming" cases', function () {
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            api.cases.add_new_case(D.newCase.caseNumber);
            D.setDateOnlyValues(C.currentDateTimeFormat);
            D.newCase.reviewDateEditMode = minDate;
            D.newCase.reviewDateNotes = redistributeNote;

            ui.menu.click_Settings__Organization()
                .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
            ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types();
            ui.autoDispo.get_statistics_for_Review_Dates()
                .click_button(C.buttons.redestributeCaseReviewDates)
                .verify_modal_content(C.labels.autoDisposition.updateCases)
                .click_button(C.tabs.upcoming)
                .populate_Update_Cases_modal(minDate, maxDate, redistributeNote)
                .click_button(C.buttons.updateCases)
                .verify_toast_message(C.toastMsgs.saved)
                .wait_until_label_disappears(C.labels.autoDisposition.pleaseWait, 360)
            D.newCase.reviewDate = helper.getSpecificDateInSpecificFormat(
                DF.dateTimeFormats.short.mask,
                'November 15, 2027 12:00 AM'
            );
            ui.app.open_newly_created_case_via_direct_link()
                .click_button(C.buttons.edit);
            D.newCase.offenseDate = 'April 15, 2020 02:18 PM'
            ui.caseView.verify_values_on_Edit_form(D.newCase);
        });
    });

});


