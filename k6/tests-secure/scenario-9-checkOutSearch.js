import Searches from '../helpers/secure/secure-search-helper.js';

export function checkOutSearch (virtualUserIndex, token) {
    
    // Search Check Outs
    var result = Searches.searchCheckOuts(virtualUserIndex, token);

}