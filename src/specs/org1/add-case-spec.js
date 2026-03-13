const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let adminFromAnotherOrg = S.getUserData(S.userAccounts.adminFromAnotherOrg);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let office_1 = S.selectedEnvironment.office_1;
let office_2 = S.selectedEnvironment.office_2;
let permissionGroup_officeAdmin = S.selectedEnvironment.regularUser_permissionGroup;
let permissionGroup_regularUser = S.selectedEnvironment.regularUser_permissionGroup;

describe('Add Case', function () {

    context('1. --- No Case Number formatting in Org/Office, AutoDispo ON', function () {

        before(function () {
            api.auth.get_tokens_without_page_load(orgAdmin);
            api.auto_disposition.edit(true);
            api.org_settings.set_Org_Level_Case_Number_formatting(false, false, false)
            api.users.update_current_user_settings(orgAdmin.id, C.currentDateTimeFormat)
            api.permissions.update_ALL_permissions_for_an_existing_Permission_group(permissionGroup_regularUser, true, true, true, true)
            api.auth.get_tokens_without_page_load(powerUser);
            api.users.update_current_user_settings(powerUser.id, C.currentDateTimeFormat)
        });

        it('1.1 Org Admin-- All fields enabled -- redirect to View Added Case', function () {
            api.auth.get_tokens(orgAdmin);
            //ui.app.log_in(orgAdmin)
            D.getNewCaseData();
            api.org_settings.enable_all_Case_fields();

            ui.menu.click_Add__Case();
            ui.addCase.verify_Add_Case_page_is_open()
                .verify_limits_for_Case_Number_length(2)
                .verify_limits_for_Case_Number_length(3)
                // TODO: Report bug on newUI - no message about Case# max length
                // .verify_limits_for_Case_Number_length(76)
                // .verify_limits_for_Case_Number_length(75)
                .clear_Case_Number();

            //TODO Report bug on newUI --> Closed Date required when status is ACTIVE
            D.newCase.closedDate = D.newCase.reviewDate

            ui.addCase.populate_all_fields(D.newCase)

                //TODO Report bug on newUI --> Missing Post-Save actions
                //.select_post_save_action(C.postSaveActions.viewAddedCase)

                .click_Save()

            //TODO Report bug on newUI --> Missing SAVED toast message
               // .verify_toast_message(C.toastMsgs.addedNewCase + D.newCase.caseNumber);
            ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
                .click_Edit()
                .verify_values_on_Edit_form(D.newCase);
        });

        context('Org Admin-- minimum case fields', function () {

            before(function () {
                api.auth.get_tokens(orgAdmin);
                api.org_settings.disable_Case_fields([C.caseFields.tags]);
            })

            it('1.2 Org Admin-- minimum case fields -- redirect to Add Case page again', function () {
                api.auth.get_tokens(orgAdmin)
                D.generateNewDataSet(true);
                ui.menu.click_Add__Case();
                //TODO Report bug on newUI --> Closed Date required when status is ACTIVE
                D.newCase.closedDate = D.newCase.reviewDate

                ui.addCase.populate_all_fields(D.newCase)
                    .click_Save()
                ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
                    .click_Edit()
                    .verify_values_on_Edit_form(D.newCase);
            });

            //TODO Report bug on newUI --> Missing Post-Save actions
            xit('1.3 Org Admin-- minimum case fields -- redirect to Add Item page', function () {
                api.auth.get_tokens(orgAdmin)
                D.generateNewDataSet(true);
                ui.menu.click_Add__Case();
                ui.addCase.populate_all_fields(D.newCase)
                    .select_post_save_action(C.postSaveActions.addItem)
                    .click_Save()
                    .verify_toast_message(C.toastMsgs.addedNewCase + D.newCase.caseNumber)
                    .verify_text_is_present_on_main_container(C.labels.addItem.title)
                ui.addItem.verify_Case_Number_is_populated_on_enabled_input_field(D.newCase.caseNumber)
                    .open_newly_created_case_via_direct_link()
                ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
                    .click_Edit()
                    .verify_values_on_Edit_form(D.newCase)
            });

            //TODO Report bug on newUI --> Missing Post-Save actions
            xit('1.4 Org Admin-- minimum case fields -- redirect to Add Person page', function () {
                api.auth.get_tokens(orgAdmin)
                D.generateNewDataSet(true);
                ui.menu.click_Add__Case();
                ui.addCase.populate_all_fields(D.newCase)
                    .select_post_save_action(C.postSaveActions.addPerson)
                    .click_Save()
                    .verify_toast_message(C.toastMsgs.addedNewCase + D.newCase.caseNumber)
                    .verify_text_is_present_on_main_container(C.labels.addPerson.title);
                ui.addPerson.verify_Case_Number_is_populated_on_enabled_input_field(D.newCase.caseNumber);
            });

            //TODO Report bug on newUI --> Missing Post-Save actions
            xit('1.5 Org Admin-- minimum case fields -- redirect to Media tab on Case View page', function () {
                api.auth.get_tokens(orgAdmin)
                D.generateNewDataSet(true);
                ui.menu.click_Add__Case();
                ui.addCase.populate_all_fields(D.newCase)
                    .select_post_save_action(C.postSaveActions.addMediaForTheCase)
                    .click_Save()
                    .verify_toast_message(C.toastMsgs.addedNewCase + D.newCase.caseNumber);
                ui.caseView.verify_active_tab(C.tabs.media)
                    .verify_text_is_present_on_main_container(C.labels.caseView.title);
            });

            //TODO Report bug on newUI --> Missing Post-Save actions
            xit('1.6 Org Admin-- minimum case fields -- redirect to Notes tab on Case View page', function () {
                api.auth.get_tokens(orgAdmin)
                D.generateNewDataSet(true);
                ui.menu.click_Add__Case();
                ui.addCase.populate_all_fields(D.newCase)
                    .select_post_save_action(C.postSaveActions.addNoteForTheCase)
                    .click_Save()
                    .verify_toast_message(C.toastMsgs.addedNewCase + D.newCase.caseNumber)
                    .verify_text_is_present_on_main_container(C.labels.caseView.title);
                ui.caseView.verify_active_tab(C.tabs.notes);
            });

            it.only('1.7 Power User can add case and view/enter/update Review Date/Notes when having AutoDispo permissions', function () {
                api.auth.get_tokens_without_page_load(orgAdmin);
                D.generateNewDataSet(true);
                api.permissions.assign_office_based_permissions_to_user(powerUser.id, office_1.id, permissionGroup_regularUser.id);
                api.permissions.update_ALL_permissions_for_an_existing_Permission_group(permissionGroup_regularUser, true, true, true, true)
                api.permissions.set_CRUD_permissions_for_specific_entity_on_existing_Permission_group(permissionGroup_regularUser, C.perissionMatrixEntity.autoDispo, false, null, false, false, null)
                D.getNewCaseData();
                D.newCase.reviewDate = null
                D.newCase.reviewDateNotes = null
                api.org_settings.enable_all_Case_fields();

                ui.app.log_in(powerUser)
                ui.menu.click_Add__Case();
                ui.addCase.populate_all_fields(D.newCase)
                    .check_if_Review_Date_and_Notes_fields_are_present(false)
                    .click_Save()
                ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
                    .check_if_Review_Date_and_Notes_fields_are_present(false)
                    .click_Edit()
                    .check_if_Review_Date_and_Notes_fields_are_present(false)
                cy.wait(2000)
                ui.caseView.verify_values_on_Edit_form(D.newCase)

                api.auth.get_tokens_without_page_load(orgAdmin);
                api.permissions.set_CRUD_permissions_for_specific_entity_on_existing_Permission_group(permissionGroup_regularUser, C.perissionMatrixEntity.autoDispo, true, null, true, true, null)
                api.org_settings.disable_Case_fields();
                D.generateNewDataSet(true)

                ui.app.log_in(powerUser)
                ui.menu.click_Add__Case();
                ui.addCase.populate_all_fields(D.newCase)
                    .check_if_Review_Date_and_Notes_fields_are_present(true)
                    .click_Save()
                ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
                    .check_if_Review_Date_and_Notes_fields_are_present(true)
                    .click_Edit()
                    .check_if_Review_Date_and_Notes_fields_are_present(true)
                    .verify_values_on_Edit_form(D.newCase)
            });

            it('1.8 Org Admin - Adding Item to the Closed Case --> auto-opening the case', function () {
                api.auth.get_tokens(orgAdmin)
                D.generateNewDataSet(true);
                api.org_settings.disable_Item_fields()
                api.cases.add_new_case(D.newCase.caseNumber);
                ui.app.open_newly_created_case_via_direct_link()
                ui.caseView.click_Edit()
                ui.addCase.close_the_case(D.editedCase)
                    .click_Save()
                ui.addItem.select_tab(C.tabs.items)
                    .click_element_on_active_tab(C.buttons.addItem)
                    .verify_Add_Item_page_is_open()
                    .populate_all_fields(D.newItem, false, true, false, true)
                    .select_post_save_action(C.postSaveActions.viewAddedItem)
                    .click_Save()
                    .verify_text_is_present_on_main_container(D.newCase.caseNumber)
                ui.app.open_newly_created_case_via_direct_link()
                    .verify_text_is_present_on_main_container("Open")

                ui.searchCase.run_search_by_Case_Number(D.newCase.caseNumber, C.searchCriteria.inputFields.equals)
                    .verify_records_count_on_grid(1)
                    .verify_specific_column_has_element_with_specific_class_in_first_table_row('Active',
                        'text-success') // blue 'power' icon as indicator for open case
            });

            it('1.9 Org Admin - Closing Case with undisposed Items', function () {
                api.auth.get_tokens(orgAdmin)
                api.org_settings.disable_Item_fields()
                D.generateNewDataSet(true);
                api.cases.add_new_case(D.newCase.caseNumber);
                api.items.add_new_item(true)
                ui.app.open_newly_created_case_via_direct_link()
                ui.caseView.click_Edit()
                ui.addCase.close_the_case(D.editedCase, true)
                    .click_Save()
                    .verify_text_is_present_on_main_container(D.newCase.caseNumber)
                    .verify_text_is_present_on_main_container("Closed")
                    .reload_page()
                    .verify_text_is_present_on_main_container(D.newCase.caseNumber)
                    .verify_text_is_present_on_main_container("Closed")
                ui.addItem.select_tab(C.tabs.items)
                    .verify_text_is_present_on_main_container("Showing 1 to 1 of 1 items")
                    .verify_content_of_specific_table_row_by_provided_column_title_and_value(0, "Primary Case #", D.newCase.caseNumber)

                ui.searchCase.run_search_by_Case_Number(D.newCase.caseNumber, C.searchCriteria.inputFields.equals)
                    .verify_records_count_on_grid(1)
                    .verify_specific_column_has_element_with_specific_class_in_first_table_row('Active',
                        'text-danger') // red 'power' icon as indicator for closed case
            });
        })
    });

    context('2. --- with Case Number formatting in Org, AutoDispo OFF ', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.auto_disposition.edit(false);
            api.org_settings.disable_all_Office_Level_Case_Number_formattings()
            api.org_settings.set_Org_Level_Case_Number_formatting(true, false, false, "orgFormat_\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d")
        });

        it('2.1 verify Org Case Number Format and check that Case Review Date/Notes is NOT displayed for Org Admin', function () {
            ui.app.log_title(this);

            api.auth.get_tokens(orgAdmin);
            api.org_settings.disable_Case_fields();
            D.generateNewDataSet(true);
            D.newCase.caseNumber = 'abc'

            ui.menu.click_Add__Case();
            ui.addCase.enter_Case_Number(D.newCase.caseNumber)
                .verify_text_is_present_on_main_container("Please enter a valid character based on guidelines below:")
                .verify_text_is_present_on_main_container("Format examples: 'orgFormat_")
            D.newCase.caseNumber = D.getRandomNo(10)
            D.newCase.reviewDate = null
            D.newCase.reviewDateNotes = null
            ui.addCase.populate_all_fields(D.newCase)
                .check_if_Review_Date_and_Notes_fields_are_present(false)
                .select_post_save_action(C.postSaveActions.viewAddedCase)
                .click_Save()
                .verify_toast_message(C.toastMsgs.addedNewCase + 'orgFormat_' + D.newCase.caseNumber);
            ui.caseView.verify_Case_View_page_is_open('orgFormat_' + D.newCase.caseNumber)
        });

        it('2.2 verify Org Case Number Format with custom validation message', function () {
            ui.app.log_title(this);
            const customMsg = 'validation msg at org level'

            api.auth.get_tokens(orgAdmin);
            api.org_settings.set_Org_Level_Case_Number_formatting(true, false, false, "orgFormat_\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d", null, null, customMsg)
            api.org_settings.disable_Case_fields();
            D.getNewCaseData();
            D.newCase.caseNumber = 'abc'

            ui.menu.click_Add__Case();
            ui.addCase.enter_Case_Number(D.newCase.caseNumber)
                .verify_text_is_present_on_main_container("Please enter a valid character based on guidelines below:")
                .verify_text_is_present_on_main_container("Format examples: 'orgFormat_")
                .verify_text_is_present_on_main_container(customMsg)

            D.newCase.caseNumber = 'abc' + D.randomNo
            D.newCase.reviewDate = null
            D.newCase.reviewDateNotes = null

            api.auth.get_tokens(adminFromAnotherOrg);
            api.org_settings.set_Org_Level_Case_Number_formatting(true, false, false, null, null, null, customMsg)

            ui.menu.click_Add__Case()
            ui.addCase.enter_Case_Number(D.newCase.caseNumber)
                .pause(2)
                .verify_text_is_NOT_present_on_main_container(customMsg)
        });
    });

    context('3. --- with Case Number formatting in Office ', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.auto_disposition.edit(false);
            api.org_settings.set_Org_Level_Case_Number_formatting(true, false, false, "orgFormat_\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d")
            api.org_settings.set_Office_Level_Case_Number_formatting(office_1.id,
                "officeFormat_\\w\\w\\w\\w\\w")
        });

        it('3.1 verify Office Case Number Format with default validation message', function () {
            ui.app.log_title(this);

            api.auth.get_tokens(orgAdmin);
            api.org_settings.disable_Case_fields();
            D.generateNewDataSet(true, true);

            ui.menu.click_Add__Case();
            ui.addCase.enter_Case_Number('?<>', true)
                .verify_text_is_present_on_main_container("Please enter a valid character based on guidelines below:")
                .verify_text_is_present_on_main_container("Format examples: 'officeFormat_")
            D.newCase.caseNumber = D.getRandomNo(5)
            ui.addCase.populate_all_fields(D.newCase)
                .select_post_save_action(C.postSaveActions.viewAddedCase)
                .click_Save()
                .verify_toast_message(C.toastMsgs.addedNewCase + 'officeFormat_' + D.newCase.caseNumber);
            ui.caseView.verify_Case_View_page_is_open('officeFormat_' + D.newCase.caseNumber)
            ui.menu.reload_page()
                .select_office(office_2.orgAndOfficeName)
                .click_Add__Case();
            ui.addCase.enter_Case_Number('?<>', true)
                .verify_text_is_present_on_main_container("Please enter a valid character based on guidelines below:")
                .verify_text_is_present_on_main_container("Format examples: 'orgFormat_")
        });

        it('3.2 verify Office Case Number Format with custom validation message', function () {
            ui.app.log_title(this);
            const customMsgAtOrgLevel = 'validation msg at org level'
            const customMsgAtOfficeLevel = 'validation msg at office level'

            api.auth.get_tokens(orgAdmin);
            api.org_settings.set_Org_Level_Case_Number_formatting(true, false, false, "orgFormat_\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d", null, null, customMsgAtOrgLevel)
            api.org_settings.set_Office_Level_Case_Number_formatting(office_1.id, "officeFormat_\\d\\d\\d", null, customMsgAtOfficeLevel)
            api.org_settings.disable_Case_fields();
            D.generateNewDataSet(true, true);
            D.newCase.caseNumber = '?ab'

            ui.menu.click_Add__Case();
            ui.addCase.enter_Case_Number(D.newCase.caseNumber)
                .verify_text_is_present_on_main_container("Please enter a valid character based on guidelines below:")
                .verify_text_is_present_on_main_container("Format examples: 'officeFormat_")
                .verify_text_is_present_on_main_container(customMsgAtOfficeLevel)
        });
    });

    context('4. --- with Default Case Number in Org ', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.auto_disposition.edit(false);
            api.org_settings.disable_all_Office_Level_Case_Number_formattings()
            api.org_settings.set_Org_Level_Case_Number_formatting(false, true, false, null, 'orgPrefix')
        });

        it('4.1 verify Org Default Case Number Prefix, clear a default value and save the other one', function () {
            ui.app.log_title(this);

            api.auth.get_tokens(orgAdmin);
            api.org_settings.disable_Case_fields();
            D.generateNewDataSet(true, true);

            ui.menu.click_Add__Case();
            ui.addCase.verify_Case_Number_value('orgPrefix')
                .populate_all_fields(D.newCase, true)
                .select_post_save_action(C.postSaveActions.viewAddedCase)
                .click_Save()
                .verify_toast_message(C.toastMsgs.addedNewCase + D.newCase.caseNumber);
            ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
        });

        it('4.2 verify Org Default Case Number Prefix, keep a default value as part of the Case Number', function () {
            ui.app.log_title(this);

            api.auth.get_tokens(orgAdmin);
            api.org_settings.disable_Case_fields();
            D.generateNewDataSet(true, true);

            ui.menu.click_Add__Case();
            ui.addCase.verify_Case_Number_value('orgPrefix')
                .populate_all_fields(D.newCase, false)
                .select_post_save_action(C.postSaveActions.viewAddedCase)
                .click_Save()
                .verify_toast_message(C.toastMsgs.addedNewCase + 'orgPrefix' + D.newCase.caseNumber);
            ui.caseView.verify_Case_View_page_is_open('orgPrefix' + D.newCase.caseNumber)
        });

        it('4.3 verify Org Default Case Number Prefix and Org Formatting pattern, before and after page reload', function () {
            ui.app.log_title(this);

            api.auth.get_tokens(orgAdmin);
            api.org_settings.set_Org_Level_Case_Number_formatting(true, true, false, "\\d\\d\\-\\d\\d\\d\\d\\d", '22')
            api.org_settings.disable_Case_fields();
            D.generateNewDataSet(true, true);

            ui.menu.click_Add__Case();
            ui.addCase.verify_Case_Number_value('22-_____')
                .reload_page()
                .verify_Case_Number_value('22-_____')
                .enter_Case_Number('abc', false)
                .verify_text_is_present_on_main_container("Please enter a valid character based on guidelines below:")
                .verify_text_is_present_on_main_container("Format examples:")
        });

    });

    context('5. --- with Default Case Number in Office ', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.auto_disposition.edit(false);
            api.org_settings.disable_all_Office_Level_Case_Number_formattings()
            api.org_settings.set_Org_Level_Case_Number_formatting(true, true, false, 'prefix\\d\\d\\d\\d\\d',)
            api.org_settings.set_Office_Level_Case_Number_formatting(office_1.id, null, 'prefix22')
        });

        it('5.1 verify Office Default Case Number Prefix', function () {
            ui.app.log_title(this);

            api.auth.get_tokens(orgAdmin);
            api.org_settings.disable_Case_fields();
            D.generateNewDataSet(true, true);

            ui.menu.click_Add__Case();
            ui.addCase.verify_Case_Number_value('prefix22')
                .populate_all_fields(D.newCase, false)
                .select_post_save_action(C.postSaveActions.viewAddedCase)
                .click_Save()
                .verify_toast_message(C.toastMsgs.addedNewCase + 'prefix22' + D.newCase.caseNumber);
            ui.caseView.verify_Case_View_page_is_open('prefix22' + D.newCase.caseNumber)
            ui.menu.reload_page()
                .select_office(office_2.orgAndOfficeName)
                .click_Add__Case();
            ui.addCase.enter_Case_Number('abc')
                .verify_text_is_present_on_main_container("Please enter a valid character based on guidelines below:")
                .verify_text_is_present_on_main_container("Format examples: 'prefix")
        });
    });

    context('6. --- with Auto Assigned Case Number ', function () {

        let randomNo = D.getRandomNo(6)

        beforeEach(function () {
            api.auth.get_tokens(orgAdmin);
            api.auto_disposition.edit(false);
            api.org_settings.disable_all_Office_Level_Case_Number_formattings()
            api.org_settings.disable_Case_fields();
            api.org_settings.set_Org_Level_Case_Number_formatting(false, true, true, null, randomNo, 555)
        });

        it('6.1 verify Auto Assigned Case Number with Default Case Number Prefix', function () {
            ui.app.log_title(this);

            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet(true, true);
            let caseNumber = randomNo + S.selectedEnvironment.orgSettings.nextCaseNumber;

            ui.menu.reload_page()
                .click_Add__Case()
            ui.addCase.verify_Case_Number_field_is_disabled_and_shows_Auto_Assigned_placeholder()
                .select_Offense_Type(D.newCase.offenseType)
                .click_Next()
                .populate_all_fields_on_second_form(D.newCase)
                .select_post_save_action(C.postSaveActions.viewAddedCase)
                .click_Save()
                .verify_toast_message(C.toastMsgs.addedNewCase + caseNumber);
            ui.caseView.verify_Case_View_page_is_open(caseNumber)
        });
    });

    //setting this test just for Org#1 until the issue with shared form gets fixed ----> #14625 ⁃ 'Dropdown Typeahead' on the Shared custom form has options available only in the originating Org
    //if (Cypress.env('orgNum') === 1) {
    context('7. --- with required Custom Form filled out, all required fields on Form', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.auto_disposition.edit(false);
            api.org_settings.disable_Case_fields();
            D.generateNewDataSet(true, true);
            api.org_settings.set_Org_Level_Case_Number_formatting(false, false, false)
        });

        it('7.1 verify all values are properly saved to the custom form -single user in custom User/User Group field', function () {
            ui.app.log_title(this);

            api.auth.get_tokens(orgAdmin);
            D.newCase.offenseType = D.newCase.offenseTypelinkedToRequiredForm1
            D.newCase.offenseTypeId = D.newCase.offenseTypeIdlinkedToRequiredForm1
            ui.menu.click_Add__Case();
            ui.addCase.populate_all_fields(D.newCase)
                .verify_number_of_required_fields_marked_with_asterisk(12)
                .verify_Save_button_is_disabled()
                .populate_all_fields_on_Custom_Form(D.newCustomFormData)
                .select_post_save_action(C.postSaveActions.viewAddedCase)
                .click_Save()
                .verify_toast_message(C.toastMsgs.addedNewCase + D.newCase.caseNumber);
            ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
                .click_Edit()
                .verify_values_on_Edit_form(D.newCase, true)
        });
    });
    // }

    context('8. --- with required Custom Form but not filled out, all optional fields on Form', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.auto_disposition.edit(false);
            api.org_settings.disable_Case_fields();
            D.generateNewDataSet(true, true);
            api.org_settings.set_Org_Level_Case_Number_formatting(false, false, false)
        });

        it('8.1 verify that required custom form is attached to the case with blank fields', function () {
            ui.app.log_title(this);

            D.newCase = Object.assign(D.newCase, D.defaultCustomFormData)

            api.auth.get_tokens(orgAdmin);
            D.newCase.offenseType = D.newCase.offenseTypelinkedToRequiredForm2
            D.newCase.offenseTypeId = D.newCase.offenseTypeIdlinkedToRequiredForm2
            ui.menu.click_Add__Case();
            ui.addCase.populate_all_fields(D.newCase)
                .verify_number_of_required_fields_marked_with_asterisk(0)
                .select_post_save_action(C.postSaveActions.viewAddedCase)
                .click_Save()
                .verify_toast_message(C.toastMsgs.addedNewCase + D.newCase.caseNumber);
            ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
                .click_Edit()
                .verify_values_on_Edit_form(D.newCase, true)
        });
    });

    context('9. --- with multiple users/groups in Case Officers field', function () {

        before(function () {

            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            api.org_settings.disable_all_Office_Level_Case_Number_formattings()
            api.org_settings.set_Org_Level_Case_Number_formatting(false, false, false)

            api.org_settings.disable_Case_fields();
            api.auto_disposition.edit(false)
        });

        it('9.1 verify multiple Users and Groups can be saved in Case Officers field and Custom User/User Group', function () {
            ui.app.log_title(this);
            D.newCustomFormData = {
                custom_user_or_group_names: [S.userAccounts.basicUser.name, S.selectedEnvironment.blocked_userGroup.name]
            }
            D.getNewCaseData(D.randomNo, true)
            D.removeValuesForDisabledCaseFields()
            D.newCase.caseOfficers = D.newCase.caseOfficersAndGroups;
            D.newCase.offenseType = D.newCase.offenseTypelinkedToRequiredForm2
            D.newCase.offenseTypeId = D.newCase.offenseTypeIdlinkedToRequiredForm2
            ui.menu.click_Add__Case();
            ui.addCase.populate_all_fields(D.newCase)
                .populate_all_fields_on_Custom_Form(D.newCustomFormData)
                .select_post_save_action(C.postSaveActions.viewAddedCase)
                .click_Save()
                .verify_toast_message(C.toastMsgs.addedNewCase + D.newCase.caseNumber);
            ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
                .click_Edit()
                .verify_values_on_Edit_form(D.newCase, true)
        });
    });
});
