const C = require('../../../fixtures/constants');
const S = require('../../../fixtures/settings');
const D = require('../../../fixtures/data');
const api = require('../../../api-utils/api-spec');
const ui = require('../../../pages/ui-spec');

let user = S.getUserData(S.userAccounts.orgAdmin);
let startTime;

for (let i = 0; i < 1; i++) {
    describe('Change Primary Case ', function () {

        before(function () {
            api.auth.get_tokens(user);
            api.auto_disposition.edit(true);
            startTime = Date.now();

        });

        after(() => {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });


        it('1.1 Change Primary Case from Search Item Page when "Remove Old Primary Case From Item(s)" is unchecked', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(user);
            D.generateNewDataSet();

            let case1 = Object.assign({}, D.getNewCaseData())

            api.org_settings.enable_all_Item_fields()
            api.cases.add_new_case();
            api.items.add_new_item(true, null, 'newItem1')
            api.items.add_new_item(true, null, 'newItem2')

            ui.menu.click_Search__Item()
            ui.searchItem.run_search_by_Item_Description(D.newItem.description, C.searchCriteria.inputFields.textSearch)
                .select_checkbox_for_all_records()
                .click_Actions_on_Search_Page()
                .click_option_on_expanded_menu(C.dropdowns.itemActions.changePrimaryCase)

            let case2 = Object.assign({}, D.getNewCaseData())
            api.cases.add_new_case(case2.caseNumber)
            ui.itemView.change_primary_case(case2)
                .click_remove_old_primary_case_checkbox()
                .verify_text_is_visible('Changing primary case for 2 items')
                .click_Ok()
                .verify_toast_message('Saved')
                .verify_specific_column_has_specific_value_in_all_rows('Primary Case #', case2.caseNumber)

            // TODO: Sumejja should adjust this further
            // D.editedItem.caseNumber = case2.caseNumber
            // cy.getLocalStorage('newItem1').then(item => {
            //     ui.app.open_item_url(JSON.parse(item).id)
            //     ui.itemView.select_tab(C.tabs.basicInfo)
            //         .verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.case, D.editedItem)
            //         .select_tab('Cases')
            //         .verify_content_of_specific_cell_in_first_table_row('Case Number', case2.caseNumber)
            //         .verify_content_of_specific_table_row_by_provided_column_title_and_value(1, 'Case Number', case1.caseNumber)
            //         .open_last_history_record(0)
            //         .verify_red_highlighted_history_records(C.itemFields.case)
            //         .verify_all_values_on_history(D.editedItem, D.newItem)
          //  })
        });

       // TODO: Sumejja should adjust this further
        xit('1.2 Change Primary Case from Case View - Items Tab when "Remove Old Primary Case From Item(s)" is checked', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(user);
            D.generateNewDataSet();

            api.org_settings.enable_all_Item_fields()
            api.cases.add_new_case();
            api.items.add_new_item(true, null, 'newItem1')
            ui.app.open_newly_created_case_via_direct_link()
                .select_tab('Items')
                .select_checkbox_on_specific_table_row(1)
                .click_Actions()
                .click_option_on_expanded_menu(C.dropdowns.itemActions.changePrimaryCase)
            D.editedCase.caseNumber = 'AutomatedTest-Active Case 2'
            ui.itemView.change_primary_case(D.editedCase)
                .verify_text_is_visible('Changing primary case for 1 item')
                .click_Ok()
                .verify_toast_message('Saved')
                .verify_text_is_visible('Showing 0 to 0 of 0 items')

            cy.getLocalStorage('newItem1').then(item => {
                ui.app.open_item_url(JSON.parse(item).id)
                ui.itemView.select_tab(C.tabs.basicInfo)
            })
            D.editedItem.caseNumber = 'AutomatedTest-Active Case 2'
            ui.itemView.verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.caseNumber, D.editedItem)
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.case, D.editedItem)
                .select_tab('Cases')
                .verify_content_of_specific_cell_in_first_table_row('Case Number', 'AutomatedTest-Active Case 2')
                .verify_content_of_last_row_in_results_table(D.editedCase.caseNumber)
                .open_last_history_record(0)
                .verify_red_highlighted_history_records(C.itemFields.case)
                .verify_all_values_on_history(D.editedItem.caseNumber, D.newItem.caseNumber)

        });
    });
}
