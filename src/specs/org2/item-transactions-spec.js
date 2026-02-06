const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const {randomNo} = require("../../fixtures/data");
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let person = S.getUserData(S.selectedEnvironment.person);

describe('Item Transactions & Actions', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin);
        api.users.update_current_user_settings(orgAdmin.id)
        api.org_settings.enable_all_Item_fields(C.itemFields.dispositionStatus)
            .disable_Case_fields()
            .enable_all_Person_fields()
            .update_org_settings(false, true, false, "~person.firstName~ ~person.lastName~")
        api.auto_disposition.edit(false)
        D.box2 = D.getStorageLocationData('BOX_2')
        api.locations.add_storage_location(D.box2)
        D.box1 = D.getStorageLocationData('BOX_1')
        api.locations.add_storage_location(D.box1)
    });

    //TODO AMINA should copy/paste Transaction tests from main-actions1 instead of those, as we have all transactions there where it runs much faster
    // and check if we have some additional verifications in tests here which should be kept (e.g. variations for Add to Container, more verifications on different places)

    it('1. Verify Check Out transaction and enabled/disabled actions for Checked Out item', function () {
        ui.app.log_title(this);
        const enabledActions = [
            'Check Item In',
            'Transfer Item',
            'Dispose Item',
            'Duplicate',
            'Split',
            'Manage Cases']
        const disabledActions = [
            'Check Item Out',
            'Move Item',
            'Undispose Item',
        ]

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        api.items.add_new_item(false);
        ui.app.open_newly_created_item_via_direct_link();
        let initialItem = Object.assign({}, D.newItem)

        ui.app.click_Actions()
            .perform_Item_Check_Out_transaction(orgAdmin, C.checkoutReasons.lab, 'test-note1', D.currentDate)
        ui.itemView.verify_Items_Status('Checked Out')
            .verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ``], ['Check out Reason', `Lab`], ['Note', `test-note1`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown_on_Search_Page(enabledActions, disabledActions)
    });

    it('2. Verify Transfer transaction and enabled/disabled actions for Checked Out item', function () {
        ui.app.log_title(this);
        const enabledActions = [
            'Check Item In',
            'Transfer Item',
            'Dispose Item',
            'Duplicate',
            'Split',
            'Manage Cases']

        const disabledActions = [
            'Check Item Out',
            'Move Item',
            'Undispose Item',
        ]

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        api.items.add_new_item(false);
        api.transactions.check_out_item()
        ui.app.open_newly_created_item_via_direct_link();
        let initialItem = Object.assign({}, D.newItem)

        ui.app.click_Actions()
            .perform_Item_Transfer_transaction(powerUser, orgAdmin, 'test-note2')
        ui.itemView.verify_Items_Status('Checked Out')
            .verify_edited_and_not_edited_values('view', ["Custodian"], D.editedItem, D.newItem)
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'Transfer'], ['Issued From', orgAdmin.name], ['Issued To', powerUser.name], ['Storage Location', ``], ['Check out Reason', ``], ['Note', `test-note2`]],
                [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', person.fullName], ['Storage Location', ``], ['Check out Reason', `Court`], ['Note', `Note for Checked Out Item`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown_on_Search_Page(enabledActions, disabledActions)
    });

    it('3. Verify Check Item In transaction and enabled/disabled actions for Checked In item', function () {
        ui.app.log_title(this);
        const enabledActions = [
            'Check Item Out',
            'Move Item',
            'Dispose Item',
            'Duplicate',
            'Split',
            'Manage Cases']

        const disabledActions = [
            'Check Item In',
            'Transfer Item',
            'Undispose Item'
        ]

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        api.items.add_new_item(false);
        api.transactions.check_out_item()
        api.locations.add_storage_location('Box_2')
        ui.app.open_newly_created_item_via_direct_link();
        let initialItem = Object.assign({}, D.newItem)


        ui.app.click_Actions()
            .perform_Item_CheckIn_transaction(powerUser, false, D.box2.name, 'test-note3')
        ui.itemView.verify_Items_Status('Checked In')
            .click_Actions()
        ui.itemView.verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
            .verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'In'], ['Issued From', powerUser.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box2.name], ['Check out Reason', ``], ['Note', `test-note3`]],
                [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', person.fullName], ['Storage Location', ``], ['Check out Reason', `Court`], ['Note', `Note for Checked Out Item`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown_on_Search_Page(enabledActions, disabledActions)

    });

    it('4. Verify Dispose transaction and enabled/disabled actions for Disposed item', function () {
        ui.app.log_title(this);
        const enabledActions = [
            'Undispose Item',
            'Duplicate',
            'Manage Cases']

        const disabledActions = [
            'Check Item In',
            'Check Item Out',
            'Move Item',
            'Transfer Item',
            'Dispose Item',
            // 'Split' // uncomment this when bugs gets fixed -- card  #14841 /#20
        ]

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        api.items.add_new_item(false);
        ui.app.open_newly_created_item_via_direct_link();
        let initialItem = Object.assign({}, D.newItem)

        ui.app.click_Actions()
            .perform_Item_Disposal_transaction(powerUser, C.disposalMethods.auctioned, 'test-note4')
        ui.itemView.verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
        ui.itemView.verify_Items_Status('Disposed')
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'Disposal'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ''], ['Check out Reason', ``], ['Note', `test-note4`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown_on_Search_Page(enabledActions, disabledActions)
    });

    it('5. Verify Undispose transaction and enabled/disabled actions for Checked In item', function () {
        ui.app.log_title(this);
        const enabledActions = [
            'Check Item Out',
            'Move Item',
            'Dispose Item',
            'Duplicate',
            'Split',
            'Manage Cases']

        const disabledActions = [
            'Check Item In',
            'Transfer Item',
            'Undispose Item'
        ]

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        api.items.add_new_item(false);
        api.transactions.dispose_item()
        ui.app.open_newly_created_item_via_direct_link();
        let initialItem = Object.assign({}, D.newItem)

        ui.app.click_Actions()
            .perform_Item_Undisposal_transaction(powerUser, false, D.box2.name, 'test-note5')
        ui.itemView.verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
            .verify_Items_Status('Checked In')
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'In'], ['Issued From', powerUser.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box2.name], ['Check out Reason', ``], ['Note', `test-note5`]],
                [['Type', 'Disposal'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ''], ['Witness', powerUser.name], ['Storage Location', ''], ['Check out Reason', ``], ['Note', D.randomNo]],
                //  [['Type', 'In'], ['Issued From', powerUser.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box2.name],  ['Check out Reason', ``], ['Note', `test-note3`]],
                // [['Type', 'Transfer'], ['Issued From', orgAdmin.name], ['Issued To', powerUser.name], ['Storage Location', ``],  ['Check out Reason', ``], ['Note', `test-note2`]],
                // [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ``],  ['Check out Reason', `Lab`], ['Note', `test-note1`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown_on_Search_Page(enabledActions, disabledActions)
    });

    it('6. Verify Move transaction and enabled/disabled actions for Moved item', function () {
        ui.app.log_title(this);
        const enabledActions = [
            'Check Item Out',
            'Move Item',
            'Dispose Item',
            'Duplicate',
            'Split',
            'Manage Cases']

        const disabledActions = [
            'Check Item In',
            'Transfer Item',
            'Undispose Item'
        ]

        api.auth.get_tokens(orgAdmin);
        D.box1 = D.getStorageLocationData('BOX_1')
        D.box2 = D.getStorageLocationData('BOX_2')
        api.locations.add_storage_location(D.box1)
        api.locations.add_storage_location(D.box2)
        D.generateNewDataSet()
        api.items.add_new_item(false);
        ui.app.open_newly_created_item_via_direct_link();
        let initialItem = Object.assign({}, D.newItem)

        ui.app.click_Actions()
            .perform_Item_Move_transaction(D.box1.name, 'move_' + S.currentDate)
        ui.itemView.verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
            .verify_Items_Status('Checked In')
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'Move'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box1.name], ['Check out Reason', ``], ['Note', 'move_' + S.currentDate]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown_on_Search_Page(enabledActions, disabledActions)

        //  api.locations.get_and_save_any_location_data_to_local_storage('root')
        //  api.locations.move_location(D.box2.name, 'root')

    });

    context('7. Verify Move transaction -- Add to Container', function () {

        it('7.1. Create new Container - AutoNumbering OFF', function () {
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            api.org_settings.update_org_settings_by_specifying_properties({
                'useContainers': true,
                'useContainerAutoNumbering': false,
                'useCaseLevelContainerAutoNumbering': false
            })
            api.cases.add_new_case()
            api.items.add_new_item(true)
            D.parent1 = D.getStorageLocationData('PARENT_1', null, true, true, true)
            D.cont1 = D.getStorageLocationData('BOX_1', null, true, true, true, D.parent1.randomNo)
            D.cont1.parentStorageLocation = D.parent1.name
            D.cont1.moveNote = "Add to Container -note" + ' ' + randomNo
            api.locations.add_storage_location(D.parent1)

            ui.app.open_newly_created_case_via_direct_link()
                .select_tab(C.tabs.items)
                .select_checkbox_on_first_table_row()
                .click_Actions()
                .click_option_on_expanded_menu(C.dropdowns.itemActions.addToContainer)
            ui.modal.populate_add_item_to_container_modal(D.cont1)
                .click_button(C.buttons.ok)
                .verify_toast_message('Saved!')
                .verify_content_of_specific_cell_in_first_table_row('Storage Location', D.parent1.name + '/' + D.cont1.name)
                .open_newly_created_item_via_direct_link()
            ui.itemView.verify_text_is_present_on_main_container(D.parent1.name + '/' + D.cont1.name)
                .select_tab(C.tabs.chainOfCustody)
                .verify_data_on_Chain_of_Custody([
                    [['Type', 'Move'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', D.parent1.name + '/' + D.cont1.name], ['Check out Reason', ``], ['Note', D.cont1.moveNote]],
                    [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', D.newItem.location], ['Notes', `Item entered into system.`]],
                ])
        });

        it('7.2. Create new Container - OrgLevel-AutoNumbering ON', function () {
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            api.org_settings.get_container_settings()
                .update_org_settings_by_specifying_properties({
                'useContainers': true,
                'useContainerAutoNumbering': true,
                'useCaseLevelContainerAutoNumbering': false
            })
            api.cases.add_new_case()
            api.items.add_new_item(true)
            D.parent1 = D.getStorageLocationData('PARENT_1', null, true, true, true)
            D.cont1 = D.getStorageLocationData('BOX_1', null, true, true, true)
            D.cont1.parentStorageLocation = D.parent1.name
            D.cont1.moveNote = "Add to Container -note" + ' ' + randomNo
            api.locations.add_storage_location(D.parent1)

            cy.getLocalStorage("containerSettings").then(settings => {
                let containerSettings = JSON.parse(settings);
                ui.app.open_newly_created_case_via_direct_link()
                    .select_tab(C.tabs.items)
                    .select_checkbox_on_first_table_row()
                    .click_Actions()
                    .click_option_on_expanded_menu(C.dropdowns.itemActions.addToContainer)
                    .verify_modal_content('New Container name will be auto-assigned')
                ui.modal.verify_that_Container_field_is_disabled()
                    .populate_add_item_to_container_modal(D.cont1, true)
                    .click_button(C.buttons.ok)
                    .verify_toast_message('Saved!')
                    .verify_content_of_specific_cell_in_first_table_row('Storage Location', D.parent1.name + '/' + containerSettings.nextContainerNumber)
                    .open_newly_created_item_via_direct_link()
                ui.itemView.verify_text_is_present_on_main_container(D.parent1.name + '/' + containerSettings.nextContainerNumber)
                    .select_tab(C.tabs.chainOfCustody)
                    .verify_data_on_Chain_of_Custody([
                        [['Type', 'Move'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', D.parent1.name + '/' + containerSettings.nextContainerNumber], ['Check out Reason', ``], ['Note', D.cont1.moveNote]],
                        [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', D.newItem.location], ['Notes', `Item entered into system.`]],
                    ])
            });
        });

        it('7.3. Create new Container - CaseLevel-AutoNumbering ON', function () {
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            api.org_settings.update_org_settings_by_specifying_properties({
                'useContainers': true,
                'useContainerAutoNumbering': false,
                'useCaseLevelContainerAutoNumbering': true
            })
            api.cases.add_new_case()
            api.items.add_new_item(true, null, 'item1')
            api.items.add_new_item(true, null, 'item2')
            let parent1 = D.getStorageLocationData('PARENT_1', null, true, true, true)
            let cont1 = D.getStorageLocationData('BOX_1', null, true, true, true)
            cont1.parentStorageLocation = parent1.name
            cont1.moveNote = "Add to Container -note" + ' ' + randomNo
            api.locations.add_storage_location(parent1)

            cy.getLocalStorage("newCase").then(newCase => {
                cy.getLocalStorage("item1").then(item1 => {
                    cy.getLocalStorage("item2").then(item2 => {
                        api.org_settings.get_next_container_number_for_case(JSON.parse(newCase).id)
                        cy.getLocalStorage("nextContainerNumberForCase").then(containerData => {
                            let nextContainerNumber = JSON.parse(containerData).containerNumber
                            ui.app.open_newly_created_case_via_direct_link()
                                .select_tab(C.tabs.items)
                                .select_checkbox_for_all_records()
                                .click_Actions()
                                .click_option_on_expanded_menu(C.dropdowns.itemActions.addToContainer)
                                .verify_modal_content('Auto-assigned: ' + D.newCase.caseNumber + ' - ' + nextContainerNumber)
                            ui.modal.verify_that_Container_field_is_disabled()
                                .populate_add_item_to_container_modal(cont1, true)
                                .click_button(C.buttons.ok)
                                .verify_toast_message('Saved!')
                                .verify_content_of_specific_cell_in_first_table_row('Storage Location', parent1.name + '/'  + D.newCase.caseNumber + '-' + nextContainerNumber)
                                .open_item_url(JSON.parse(item1).id)
                            ui.itemView.verify_text_is_present_on_main_container(parent1.name + '/' + D.newCase.caseNumber + '-' + nextContainerNumber)
                                .wait_all_GET_requests()
                                .select_tab(C.tabs.chainOfCustody)
                                .verify_data_on_Chain_of_Custody([
                                    [['Type', 'Move'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', parent1.name + '/'  + D.newCase.caseNumber + '-' + nextContainerNumber], ['Check out Reason', ``], ['Note', cont1.moveNote]],
                                    [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', D.newItem.location], ['Notes', `Item entered into system.`]],
                                ])
                                .open_item_url(JSON.parse(item2).id)
                            ui.itemView.verify_text_is_present_on_main_container(parent1.name + '/'  + D.newCase.caseNumber + '-' + nextContainerNumber)
                                .wait_all_GET_requests()
                                .select_tab(C.tabs.chainOfCustody)
                                .verify_data_on_Chain_of_Custody([
                                    [['Type', 'Move'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', parent1.name + '/'  + D.newCase.caseNumber + '-' + nextContainerNumber], ['Check out Reason', ``], ['Note', cont1.moveNote]],
                                    [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', D.newItem.location], ['Notes', `Item entered into system.`]],
                                ])
                        });
                    });
                });
            });
        });

    });


});
