import Searches from '../helpers/secure/secure-search-helper.js';

export function checkInSearch (virtualUserIndex, token) {
    
    // Search Check Ins
    var result = Searches.searchCheckIns(virtualUserIndex, token);

}