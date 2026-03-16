import Searches from '../helpers/secure/secure-search-helper.js';

export function userSearch (virtualUserIndex, token) {
    // Search Users
    var result = Searches.searchUsers(virtualUserIndex, token);

}