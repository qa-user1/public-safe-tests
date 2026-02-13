const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let systemAdmin = S.getUserData(S.userAccounts.systemAdmin);

describe('User Admin -- Actions', function () {

    beforeEach(function () {
        ui.app.clear_gmail_inbox(S.gmailAccount);
    });

    it('1. Send verification email', function () {
        ui.app.log_title(this);
        D.getNewUserData();

        api.auth.get_tokens(orgAdmin);
        api.users.add_new_user();
        api.permissions.assign_Org_Admin_permissions_to_user('newUser', D.newUser.officeId)
        ui.menu.click_Settings__User_Admin()
        ui.app.clear_gmail_inbox(S.gmailAccount);
        ui.userAdmin.search_for_user(D.newUser.firstName)
            .select_checkbox_on_first_table_row()
            .click_button(C.buttons.actions)
            .click_option_on_expanded_menu(C.dropdowns.userActions.sendVerificationEmail)
            .verify_toast_message(C.toastMsgs.emailsSent(1))
        ui.menu.click_Log_Out()
        ui.userAdmin.verify_email_content_(D.newUser.email, C.users.emailTemplates.welcomeToSafe, D.newUser)
            .open_verification_link_from_email()
            .set_password(D.newUser.password)
            .scroll_and_click(C.buttons.setPassword)
            .verify_confirmation_message_for_setting_Password(C.users.setPassword.confirmationMsg)
            .click_button(C.buttons.login);
        ui.login.enter_credentials(D.newUser.email, D.newUser.password)
            .click_Login_button()
            .verify_text_is_present_on_main_container(C.labels.dashboard.title)

        api.auth.get_tokens(orgAdmin)
        api.users.deactivate_previously_created_user();

    });

    it('2. Activate Users, Mass Update Div, Unit and Supervisors', function () {
        api.auth.get_tokens(orgAdmin);
        let user1 = Object.assign({}, D.getNewUserData())
        let user2 = Object.assign({}, D.getNewUserData())
        D.getEditedUserData()
        user1.active = user2.active = false
        user1.firstName = user2.firstName

        api.users.add_new_user('user1', user1)
        api.users.add_new_user('user2', user2)

        ui.menu.click_Settings__User_Admin()
        ui.userAdmin.select_radiobutton(C.filters.inactive)
            .search_for_user(user1.firstName, 2)
            .select_checkbox_for_all_records()
            .click_Actions()
            .click_option_on_expanded_menu('Activate Users')
            .verify_toast_message('Saved!')
            .pause(1)
            .select_radiobutton(C.filters.active)
            .search_for_user(user1.firstName, 2)
            .verify_records_count_on_grid(2)

        cy.log(" 🟢🟢🟢 Add Internal Users to the User Group 🟢🟢🟢 ")
        ui.app.select_checkbox_for_all_records()
            .click_Actions()
            .click_option_on_expanded_menu('Add to Group')
        D.editedUser.userGroups = S.selectedEnvironment.admin_userGroup.name
        ui.userAdmin.populate_Add_to_Group_modal(D.editedUser.userGroups)
            .click_Ok()
            .verify_content_of_specific_cell_in_first_table_row('User Groups', D.editedUser.userGroups)
            .click_button('Edit')
            .verify_text_is_present_on_main_container(D.editedUser.userGroups)
            .click_button('Cancel')

        cy.log(" 🟢🟢🟢 Mass Update Div & Unit 🟢🟢🟢 ")
        ui.userAdmin.click_Actions()
            .click_option_on_expanded_menu('Mass Update Users Division and Unit')
            .turn_on_and_enter_values_to_mass_update_division_unit_modal(D.editedUser)
            .click_Ok()
            .verify_toast_message('Saved!')
            .click_button('Edit')
            .verify_text_is_present_on_main_container(D.editedUser.division)
            .verify_text_is_present_on_main_container(D.editedUser.unit)
            .click_button('Cancel')

        cy.log(" 🟢🟢🟢 Mass Update Supervisor for Internal User 🟢🟢🟢 ")
        ui.userAdmin.verify_content_of_specific_cell_in_first_table_row('Supervisor', D.newUser.supervisors)
            .click_Actions()
            .click_option_on_expanded_menu('Set Supervisors')
            .set_supervisors_on_modal(D.editedUser.supervisors)
            .set_supervisors_on_modal(D.editedUser.supervisorGroups)
            .click_Ok()
            .verify_messages_on_sweet_alert([C.warning_msgs.overwriteSupervisor])
            .click_button_on_sweet_alert('OK')
            .verify_toast_message('Saved!')
            .reload_page()
            .search_for_user(user1.firstName, 2)
            .verify_specific_column_has_specific_value_in_all_rows('User Groups', D.editedUser.userGroups)
            .verify_specific_column_has_specific_value_in_all_rows('Division', D.editedUser.division)
            .verify_specific_column_has_specific_value_in_all_rows('Division', D.editedUser.division)
            .verify_specific_column_has_specific_value_in_all_rows('Unit', D.editedUser.unit)
        cy.wait(1000)
        ui.userAdmin.verify_specific_column_has_specific_value_in_all_rows('Supervisor', D.editedUser.supervisors)
            .verify_specific_column_has_specific_value_in_all_rows('Supervisor', D.editedUser.supervisorGroup)
            .verify_specific_column_does_NOT_contain_specific_value_in_specific_rows('Supervisor', D.newUser.supervisors)
    });

});
