import login from "./ui-spec";

let C = require('../fixtures/constants')
let S = require('../fixtures/settings')
import BasePage from "./base-pages/base-page";

//************************************ ELEMENTS ***************************************//

let
    locationPlusIcon = (locName) => cy.contains(locName).parent('td').find('.fa-plus'),
    rowWithLocationName = (locName) => cy.contains(locName).parent('td'),
    locationCheckbox = (locName) => rowWithLocationName(locName).parent('tr').find('td').eq(0).find('input'),
    locationItems = (locName) => rowWithLocationName(locName).parent('tr').find('td').eq(2),
    legacyBarcode = (locName) => rowWithLocationName(locName).parent('tr').find('td').eq(4),
    isActive = (locName) => rowWithLocationName(locName).parent('tr').find('td').eq(5),
    isStorage = (locName) => rowWithLocationName(locName).parent('tr').find('td').eq(6),
    isContainer = (locName) => rowWithLocationName(locName).parent('tr').find('td').eq(7),
    locationGroups = (locName) => rowWithLocationName(locName).parent('tr').find('td').eq(8).find('[ng-if="col.field !== \'count\'"]'),
    addStorageLocationModal = e => cy.get('[ng-model="locationsToAdd"]'),
    searchLocationField = e => cy.get('[ng-model="locationText"]'),
    storageLocationNameField = e => cy.get('[name="locationName"]'),
    storageLocationGroups_inputField = e => cy.get('input[placeholder="Groups"]'),
    storageLocationGroups_containerOnModal = e => cy.get('.modal-content').find('[ng-model="location.groups"]'),
    storageLocationLegacyBarcodeField = e => cy.get('[ng-model="location.legacyBarcode"]'),
    storageLocationCanStoreHereToggleButton = e => cy.get('[ng-model="toggle.canStoreHere"]'),
    storageLocationCanStoreHereYesNoButton = e => cy.get('[ng-model="location.canStoreHere"]'),
    storageLocationActiveYesNoButton = e => cy.get('[ng-model="location.active"]'),
    storageLocationContainerYesNoButton = e => cy.get('[ng-model="location.isContainer"]'),
    moveLocationToToggleButton = e => cy.get('[ng-model="toggle.moveLocationTo"]'),
    moveLocationToDropdownOption = e => cy.get('.modal-content').find('[typeahead="l.path as l.id for l in getLocation($viewValue)"]'),
    locationTypeaheadOption = e => cy.get('[ng-repeat="match in matches track by $index"]'),
    locationsGrid = e => cy.get('[id="tg-table"]')

export default class StorageLocationsPage extends BasePage {

    constructor() {
        super()
    }

    //************************************ ACTIONS ***************************************//

    open_direct_url_for_page() {
        this.open_url_and_wait_all_GET_requests_to_finish(S.base_url + '/#/' + C.pages.storageLocations.url)
        return this
    }

    expand_Location(name) {
        locationPlusIcon(name).click()
        return this;
    };

    verify_location_properties(locationObject) {
        const locName = locationObject.name;
        locationItems(locName).should('contain', locationObject.items);
        legacyBarcode(locName).should('contain', locationObject.legacyBarcode);
        isActive(locName).should('contain', locationObject.active);
        isStorage(locName).should('contain', locationObject.canStoreHere);
        isContainer(locName).should('contain', locationObject.isContainer);

        if (locationObject.groups === null) {
            locationGroups(locName).invoke('text')
                .then((text) => {
                    expect(
                        text.trim(),
                        `Expected Permission Groups to be blank for location ${locName}`
                    ).to.eq('');
                });
        } else {
            locationObject.groups.forEach(group => {
                locationGroups(locName).should('contain', group);
            })
        }
        return this;
    };

    add_one_or_more_storage_locations(arrayOfLocNames) {
        arrayOfLocNames.forEach(locName => {
            this.enterValue(addStorageLocationModal, locName)
        })
        return this;
    }

    enter_storage_location_in_search(storageLoc, shouldAppearInTypeahead = true) {
        this.define_API_request_to_be_awaited_with_last_part_of_url('GET', 'search=' + storageLoc, storageLoc)
        this.clearAndEnterValue(searchLocationField, storageLoc)

        if (shouldAppearInTypeahead) {
            this.wait_typeahead_for_search(
                storageLoc,
                storageLoc,
                200,
                {contains: false} // set true if you want partial match
            );
            locationTypeaheadOption().click();
        } else {
            this.verify_response_from_API_method(storageLoc, 200, {locations: []}, storageLoc)
        }
        return this;
    }

    turn_on_and_enter_values_to_all_fields_on_edit_storage_location_modal(labelsArray, valuesArray) {

        for (let i = 0; i < labelsArray.length; i++) {
            let label = labelsArray[i]
            let value = valuesArray[i]

            if (['Container'].some(v => label === v)) {
                this.turnOnToggle(label)

            } else if (['Name', 'Legacy Barcode'].some(v => label === v)) {
                this.turnOnToggleAndEnterValueInTextarea(label, value)

                // } else if (['Case Officer(s)'].some(v => label === v)) {
                //     this.turnOnToggleAndSelectTypeaheadOptionsOnMultiSelectField(label, value)

            } else if (['Groups'].some(v => label === v)) {
                this.turnOnToggleAndEnterValueToInputFieldWithLastCharacterReentering(label, value, this.typeaheadSelectorMatchInMatches)
                firstMatchOnTypeahead().click()

                // }
                // else if (['Item Belongs to'].some(v => label === v)) {
                //     this.turnOnToggleAndEnterValueToInputField(label, value)
                //     firstPersonOnItemBelongsToTypeahead().click()

            } else {
                this.turnOnToggleEnterValueAndPressEnter(label, value)
            }
        }
        return this
    }

    populate_all_fields_on_edit_storage_location_modal(data) {
        this.clearAndEnterValue(storageLocationNameField, data.name)

        for (let i = 0; i < data.groups.length; i++) {
            this.enterValue(storageLocationGroups_inputField, data.groups[i])
            cy.get('[repeat="group in groups"]').contains('span', data.groups[i]).click()
        }
        this.clearAndEnterValue(storageLocationLegacyBarcodeField, data.legacyBarcode)

        storageLocationCanStoreHereYesNoButton()
            .find('.toggle.btn.btn-sm')
            .then(($btn) => {
                if (data.canStoreHere && $btn.hasClass('off')) {
                    cy.wrap($btn).click();
                } else if (!data.canStoreHere && !$btn.hasClass('off')) {
                    cy.wrap($btn).click();
                } else {
                    cy.log('Toggle is already in proper state: ' + data.canStoreHere);
                }
            });

        storageLocationContainerYesNoButton()
            .find('.toggle.btn.btn-sm')
            .then(($btn) => {
                if (data.isContainer && $btn.hasClass('off')) {
                    cy.wrap($btn).click();
                } else if (!data.isContainer && !$btn.hasClass('off')) {
                    cy.wrap($btn).click();
                } else {
                    cy.log('Toggle is already in proper state: ' + data.isContainer);
                }
            });

        storageLocationActiveYesNoButton()
            .find('.toggle.btn.btn-sm')
            .then(($btn) => {
                if (data.active && $btn.hasClass('off')) {
                    cy.wrap($btn).click();
                } else if (!data.active && !$btn.hasClass('off')) {
                    cy.wrap($btn).click();
                } else {
                    cy.log('Toggle is already in proper state: ' + data.active);
                }
            });

        moveLocationToToggleButton()
            .find('.toggle.btn.btn-sm')
            .then(($btn) => {
                if ($btn.hasClass('btn-default') && $btn.hasClass('off')) {
                    cy.wrap($btn).click();
                } else if ($btn.hasClass('btn-primary')) {
                    cy.log('Toggle is already ON');
                }
            });

        this.enterValue(moveLocationToDropdownOption, data.parentLocName)
        locationTypeaheadOption().should('be.visible').click()

        return this;
    }

    expand_location(text, tableIndex = 0) {
        const regex = new RegExp(`^\\s*${text}\\s*$`);

        cy.get('table')
            .eq(tableIndex)
            .contains('td', regex)
            .within(() => {
                cy.get('[ng-class="location.icon"]').click();
            });
        return this;
    }

    select_row_on_the_grid_that_contains_specific_location(locName) {
        locationsGrid().within(($tableBody) => {
            cy.contains('td', locName).parent('tr').find('[ng-model="location.selected"]').click()
        })
        return this;
    };

    click_Hide_Containers() {
        cy.get('[ng-model="hideContainers"]').click()
        return this;
    }

    click_delete_button_in_row_by_location_name(locationName, tableIndex = 0) {
        const regex = new RegExp(`^\\s*${locationName}\\s*$`);

        cy.get('table')
            .eq(tableIndex)
            .contains('td', regex)
            .parents('tr')
            .within(() => {
                cy.get('[title="Delete Storage Location"]')
                    .click({force: true});
            });
        return this;
    }

    change_state_of_Active_location_toggle() {
        storageLocationActiveYesNoButton().click();
        return this;
    }

    enter_new_Permission_Groups(groups, removeExistingGroups = true) {
        if (removeExistingGroups) {
            storageLocationGroups_containerOnModal().should('exist').within(() => {
                cy.get('.ui-select-match-close').then($closeBtns => {
                    if ($closeBtns.length) {
                        cy.wrap($closeBtns).each($btn => cy.wrap($btn).click({force: true}));
                    }
                });
            });
        }

        for (let i = 0; i < groups.length; i++) {
            this.enterValue(storageLocationGroups_inputField, groups[i])
            cy.get('[repeat="group in groups"]').contains('span', groups[i]).click()
        }
        return this;
    }


}
