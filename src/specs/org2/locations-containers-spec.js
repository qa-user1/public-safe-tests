const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const {itemFields: itemObject} = require("../../fixtures/constants");
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let office_1 = S.selectedEnvironment.office_1;
let permissionGroup_A = S.selectedEnvironment.regularUser_permissionGroup;
let permissionGroup_B
let startTime;
let currentDate

for (let i = 0; i < 1; i++) {
    describe('Locations - Containers', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.permissions.get_first_available_permission_group(permissionGroup_A.name)
            api.permissions.assign_office_based_permissions_to_user(powerUser.id, office_1.id, permissionGroup_A.id);
            api.permissions.update_ALL_permissions_for_an_existing_Permission_group(permissionGroup_A, true, true, true, true)
            api.permissions.set_CRUD_permissions_for_specific_entity_on_existing_Permission_group(permissionGroup_A, C.perissionMatrixEntity.autoDispo, false, null, false, false, null)

            D.generateNewDataSet();
            api.cases.add_new_case()
            startTime = Date.now();
        });

        after(function () {
            //  api.locations.delete_storage_location_by_name(D.editedStorageLocation.parentMoveLocation)
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });

        it('1. Add, Edit, Search & Delete Location', function () {
            let parentLoc = Object.assign({}, D.getStorageLocationData('------00__parent_'))
            api.locations.add_storage_location(parentLoc)

            D.getStorageLocationData('------00_autoTest_')
            D.getEditedStorageLocationData('------00_edit_autoTest_')
            D.newStorageLocation.legacyBarcode = ''
            D.editedStorageLocation.parentLocName = parentLoc.name
            cy.log(" 🟢🟢🟢  1. Add Storage Location 🟢🟢🟢  ")
            ui.menu.click_Tools__Storage_Locations()
                .click_button('Add Storage Locations')
            ui.storageLocations.add_one_or_more_storage_locations([D.newStorageLocation.name])
                .click_button('Save')
                .verify_toast_message('1 storage locations successfully added!')
                .reload_page()
                .verify_location_properties(D.newStorageLocation)
                .enter_storage_location_in_search(D['------00_autoTest_'].name)

            cy.log(" 🟢🟢🟢 2. Edit all Storage Location properties & Move location 🟢🟢🟢  ")
            ui.storageLocations.click_button('Edit Selected Storage Locations')
                .populate_all_fields_on_edit_storage_location_modal(D.editedStorageLocation)
                .click_button('Save')
                .verify_modal_content(C.modalMsgs.moveLocation)
                .click_button('Proceed')
                .verify_toast_message('Saved!')
                .verify_text_is_present_on_main_container('Location/Container Move Jobs')
                .verify_content_of_first_row_in_results_table('Complete', true)
            ui.menu.click_Tools__Storage_Locations()
            ui.storageLocations.verify_text_is_NOT_present_on_main_container(D.editedStorageLocation.name)
                .expand_location(D.editedStorageLocation.parentLocName)
                .verify_text_is_present_on_main_container(D.editedStorageLocation.name)

            cy.log(" 🟢🟢🟢 3. Hide Containers & filter active/inactive 🟢🟢🟢  ")
            ui.storageLocations.click_Hide_Containers()
                .verify_text_is_NOT_present_on_main_container(D.editedStorageLocation.name)
                .click_Hide_Containers()
                .expand_location(D.editedStorageLocation.parentLocName)
                .verify_text_is_present_on_main_container(D.editedStorageLocation.name)
                .select_radiobutton(C.filters.active)
                .expand_location(D.editedStorageLocation.parentLocName)
                .verify_text_is_NOT_present_on_main_container(D.editedStorageLocation.name)
                .enter_storage_location_in_search(D.editedStorageLocation.parentLocName)
                .click_button('Edit Selected Storage Locations')
                .change_state_of_Active_location_toggle()
                .click_button('Save')
                .reload_page()
                .select_radiobutton(C.filters.inactive)
                .expand_location(D.editedStorageLocation.parentLocName)
                .verify_text_is_present_on_main_container(D.editedStorageLocation.name)
            ui.searchItem.open_direct_url_for_page()
                .enter_Storage_Location(D.editedStorageLocation.parentLocName, false) // inactive location not available
                .enter_Storage_Location(D.editedStorageLocation.name, false) // inactive location not available
            ui.menu.click_Tools__Storage_Locations()
            ui.storageLocations.select_row_on_the_grid_that_contains_specific_location(D.editedStorageLocation.parentLocName)
                .click_button('Edit Selected Storage Locations')
                .change_state_of_Active_location_toggle()
                .click_button('Save')
            ui.menu.click_Add__Item()
            ui.addItem.select_Category(D.newItem.category)
                .click_Next()
                .enter_Storage_Location(D.editedStorageLocation.parentLocName, true) // --> parent is active and available
                .enter_Storage_Location(D.editedStorageLocation.name, false) // child location is still inactive and not available

            cy.log(" 🟢🟢🟢 4. MEMBER - has permissions and access to location  🟢🟢🟢 ")
            api.auth.get_tokens(powerUser);
            ui.menu.click_Tools__Storage_Locations()
            ui.storageLocations.expand_Location(D.editedStorageLocation.parentLocName)
                .select_row_on_the_grid_that_contains_specific_location(D.editedStorageLocation.name)
                .click_button('Edit Selected Storage Locations')
                .change_state_of_Active_location_toggle()
                .click_button('Save')
                .verify_toast_message('Saved')
            ui.searchItem.open_direct_url_for_page()
                .enter_Storage_Location(D.editedStorageLocation.parentLocName, false) // not available due to permissions
                .enter_Storage_Location(D.editedStorageLocation.name, true)

            cy.getLocalStorage('PermissionGroupB').then(permissionGroup_B => {
                ui.storageLocations.open_direct_url_for_page()
                    .expand_Location(D.editedStorageLocation.parentLocName)
                    .select_row_on_the_grid_that_contains_specific_location(D.editedStorageLocation.name)
                    .click_button('Edit Selected Storage Locations')
                    .enter_new_Permission_Groups([JSON.parse(permissionGroup_B).name], true)
                    .click_button('Save')
                    .verify_toast_message('Saved')
                ui.searchItem.open_direct_url_for_page()
                    .enter_Storage_Location(D.editedStorageLocation.parentLocName, false) // not available due to permissions
                    .enter_Storage_Location(D.editedStorageLocation.name, false)

                ui.storageLocations.open_direct_url_for_page()
                    .select_row_on_the_grid_that_contains_specific_location(D.editedStorageLocation.parentLocName)
                    .click_button('Edit Selected Storage Locations')
                    .enter_new_Permission_Groups([permissionGroup_A.name], false)
                    .click_button('Save')
                    .verify_toast_message('Saved')
                ui.searchItem.open_direct_url_for_page()
                    .enter_Storage_Location(D.editedStorageLocation.parentLocName, true)
                    .enter_Storage_Location(D.editedStorageLocation.name, true) // available because of permissions set on parent location
            })

            cy.log(" 🟢🟢🟢  5. Delete Storage Location 🟢🟢🟢  ")
            api.auth.get_tokens(orgAdmin);
            ui.storageLocations.open_direct_url_for_page()
                .click_delete_button_in_row_by_location_name(D.editedStorageLocation.parentLocName)
                .verify_modal_content(C.modalMsgs.deleteStorageLocation)
                .click_button('Confirm')
                .verify_toast_message('Saved!')
                .verify_text_is_NOT_present_on_main_container(D.editedStorageLocation.parentLocName)
        });

    });
}
