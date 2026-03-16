import Searches from '../helpers/secure/secure-search-helper.js';


export function getItemsByBarcode (virtualUserIndex, token) {
    
    // Search Items By Barcode
    var result = Searches.searchItemsByBarcode(virtualUserIndex, token);

}