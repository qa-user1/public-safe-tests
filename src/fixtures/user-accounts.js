const S = require('./settings');

exports.userRoles = {
    systemAdmin: 'System Admin',
    orgAdmin: 'Org Admin',
    adminUser: 'Admin User',
    powerUser: 'Power User',
    basicUser: 'Basic User',
    blockedUser: 'Blocked User',
    readOnlyUser: 'Read-Only User',
    clpUser: 'Clp User'
};

exports.getTestAccounts = function (environment, orgNum = 1) {

    exports.userAccounts = {};

    exports.userAccounts[`orgNum${orgNum}`] = {
        orgAdmin: {
            title: exports.userRoles.orgAdmin,
            email: `qa+org${orgNum}admin@trackerproducts.com`,
            password: 'Qwerty123!',
            name: `Cypress Org${orgNum}Admin`,
            firstName: 'Cypress',
            lastName: `Org${orgNum}Admin`,
            fullName: `Cypress Org${orgNum}Admin`,
            officeId: environment.office_1.id,
            organizationId: environment.orgSettings.id,
            id: environment.users.orgAdmin.id,
            guid: environment.users.orgAdmin.guid,
            orgAndOfficeName: environment.users.orgAdmin.orgAndOfficeName,
            staticToken: environment.users.orgAdmin.staticToken,
        },
        powerUser: {
            title: exports.userRoles.powerUser,
            email: `qa+org${orgNum}_poweruser@trackerproducts.com`,
            name: 'Power User',
            firstName: 'Power',
            lastName: 'User',
            fullName: `Power User`,
            password: 'Qwerty123!',
            officeId: environment.office_1.id,
            organizationId: environment.orgSettings.id,
            id: environment.users.powerUser.id,
            guid: environment.users.powerUser.guid
        },
        basicUser: {
            title: exports.userRoles.basicUser,
            email: `qa+org${orgNum}_basicUser@trackerproducts.com`,
            name: 'Basic CypressUser',
            firstName: 'Basic',
            lastName: 'CypressUser',
            password: 'Qwerty123!',
            officeId: environment.office_1.id,
            organizationId: environment.orgSettings.id,
            id: environment.users.basicUser.id,
            guid: environment.users.basicUser.guid
        },
        clpUser: {
            title: exports.userRoles.clpUser,
            email: `qa+org${orgNum}_clpUser@trackerproducts.com`,
            password: 'Qwerty123!',
            name: 'Clp User',
            firstName: 'Clp',
            lastName: 'User',
            officeId: environment.office_1.id,
            organizationId: environment.orgSettings.id,
            id: environment.users.clpUser.id,
            guid: environment.users.clpUser.guid
        }

    }
    return exports.userAccounts['orgNum' + orgNum];
};

exports.getAdminFromAnotherOrg = function (environment, orgNum = 1) {
   return  {
        title: exports.userRoles.orgAdmin,
        email: `qa+org${environment.users.adminFromAnotherOrg.parentOrgNumber}admin@trackerproducts.com`,
        password: 'Qwerty123!',
        name: `Cypress Org${environment.users.adminFromAnotherOrg.parentOrgNumber}Admin`,
        firstName: 'Cypress',
        lastName: `Org${environment.users.adminFromAnotherOrg.parentOrgNumber}Admin`,
        fullName: `Cypress Org${environment.users.adminFromAnotherOrg.parentOrgNumber}Admin`,
        officeId: environment.users.adminFromAnotherOrg.officeId,
        organizationId: environment.users.adminFromAnotherOrg.organizationId,
        id: environment.users.adminFromAnotherOrg.id,
        guid: environment.users.adminFromAnotherOrg.guid,
        orgAndOfficeName: environment.users.adminFromAnotherOrg.orgAndOfficeName,
        isExternalAdmin: environment.users.adminFromAnotherOrg.isExternalAdmin
    }
};

exports.getSystemAdminAccount = function (environment, orgNum = 1) {

    return {
        title: exports.userRoles.systemAdmin,
        email: 'sumejja@trackerproducts.com',
        password: 'Qwerty123!',
        name: 'QA',
        firstName: 'SystemAdmin',
        lastName: 'SystemAdmin',
        officeId: 1,
        organizationId: 1,
        id: environment.systemAdminId,
    }
};

module.exports = exports;
